"""
letters_importer.py

Імпортер листів Шріли Прабгупади з Vedabase

Usage:
    pip install requests beautifulsoup4 lxml
    python tools/letters_importer.py --slug letter-to-mahatma-gandhi

Етапи:
1. Парсинг HTML з vedabase.io/en/library/letters/
2. Витяг метаданих (отримувач, дата, локація, reference)
3. Витяг адреси та тексту листа
4. Виявлення санскритських термінів
5. Збереження в JSON для подальшого імпорту в БД

НОРМАЛІЗАЦІЯ ТЕКСТУ:
- tools/translit_normalizer.py - apply_ukrainian_rules()
- tools/pre_import_normalizer.py - mojibake, діакритика, апострофи
- src/utils/text/textNormalizationRules.ts - повний список правил

МАППІНГ ПОЛІВ (для джерел EN + Sanskrit/Bengali):
=================================================
- sanskrit_en / sanskrit_ua — Bengali/Sanskrit (Devanagari script), однаковий вміст
- transliteration_en — IAST транслітерація (латинка з діакритикою)
- transliteration_ua — українська кирилична транслітерація з діакритикою
  (конвертується з IAST за допомогою tools/translit_normalizer.py)
- translation_en / purport_en — англійський переклад та пояснення
- translation_ua / purport_ua — український переклад та пояснення
"""

import requests
from bs4 import BeautifulSoup, NavigableString, Tag
import time
import json
import re
import sys
import argparse
from typing import Optional, Dict, Any, List
from datetime import datetime
from pathlib import Path

# Headers для запитів
HEADERS = {"User-Agent": "vedavoice-letters-importer/1.0 (+https://vedavoice.org)"}

# Маппінг локацій для української мови
LOCATION_TRANSLATIONS = {
    "New York": "Нью-Йорк",
    "Los Angeles": "Лос-Анджелес",
    "London": "Лондон",
    "Paris": "Париж",
    "Bombay": "Бомбей",
    "Mumbai": "Мумбаї",
    "Calcutta": "Калькутта",
    "Kolkata": "Колката",
    "Cawnpore": "Канпур",
    "Vrindavan": "Вріндаван",
    "Vrndavana": "Вріндаван",
    "Mayapur": "Маяпур",
    "Māyāpur": "Маяпур",
    "Navadvipa": "Навадвіпа",
    "Delhi": "Делі",
    "New Delhi": "Нью-Делі",
    "Hyderabad": "Хайдарабад",
    "Bangalore": "Бангалор",
    "Honolulu": "Гонолулу",
    "Tokyo": "Токіо",
    "Melbourne": "Мельбурн",
    "Sydney": "Сідней",
    "Montreal": "Монреаль",
    "Toronto": "Торонто",
    "Boston": "Бостон",
    "Chicago": "Чикаго",
    "Detroit": "Детройт",
    "Seattle": "Сіетл",
    "Dallas": "Даллас",
    "Atlanta": "Атланта",
    "Allahabad": "Аллахабад",
}


class LettersImporter:
    def __init__(self, delay_seconds: float = 2.0):
        self.delay = delay_seconds
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.sanskrit_terms = set()  # Колекція санскритських термінів

    def fetch_url(self, url: str) -> Optional[str]:
        """Завантажити HTML з URL"""
        try:
            time.sleep(self.delay)  # Rate limiting
            r = self.session.get(url, timeout=30)
            r.raise_for_status()
            return r.text
        except Exception as e:
            print(f"[ERROR] Не вдалося завантажити {url}: {e}")
            return None

    def parse_letter_metadata(self, html: str, slug: str) -> Optional[Dict[str, Any]]:
        """
        Витягнути метадані листа з HTML
        Повертає: {
            'slug': str,
            'recipient_en': str,
            'letter_date': str (YYYY-MM-DD),
            'location_en': str,
            'reference': str,
            'address_block': str,
        }
        """
        soup = BeautifulSoup(html, "lxml")
        metadata = {
            "slug": slug,
            "recipient_en": None,
            "letter_date": None,
            "location_en": None,
            "reference": None,
            "address_block": None,
        }

        # Vedabase структура: перші div.copy містять метадані
        # [0] - "Letter to: Recipient"
        # [1] - "YY-MM-DD" (reference/date)
        # [2] - Address block
        main_content = soup.find("main")
        if main_content:
            copy_divs = main_content.find_all("div", class_=lambda c: c and "copy" in c)

            for i, div in enumerate(copy_divs[:5]):
                text = div.get_text(strip=True)

                # Отримувач - "Letter to: Name"
                if "Letter to:" in text:
                    metadata["recipient_en"] = text.replace("Letter to:", "").strip()

                # Reference/Date у форматі YY-MM-DD
                elif re.match(r"^\d{2}-\d{2}-\d{2}$", text):
                    metadata["reference"] = text
                    # Парсити дату: 47-07-12 -> 1947-07-12
                    yy, mm, dd = text.split("-")
                    year = f"19{yy}" if int(yy) > 20 else f"20{yy}"
                    metadata["letter_date"] = f"{year}-{mm}-{dd}"

                # Адресний блок (зазвичай містить місто/країну)
                elif i <= 3 and len(text) > 10 and not text.startswith("Dear"):
                    if not metadata["address_block"]:
                        metadata["address_block"] = text
                        # Спробувати витягнути локацію
                        for city in LOCATION_TRANSLATIONS.keys():
                            if city.lower() in text.lower():
                                metadata["location_en"] = city
                                break

        # Fallback: витягнути заголовок з h1
        if not metadata["recipient_en"]:
            title_tag = soup.find("h1")
            if title_tag:
                title_text = title_tag.get_text(strip=True)
                if "Letter to:" in title_text:
                    metadata["recipient_en"] = title_text.replace("Letter to:", "").strip()

        # Шукаємо метадані в description list (dl/dt/dd)
        # Зазвичай формат:
        # <dt>Dated:</dt><dd>July 12th 1947</dd>
        # <dt>Location:</dt><dd>Cawnpore</dd>
        # <dt>Reference:</dt><dd>47-07-12</dd>

        metadata_section = soup.find("dl")
        if metadata_section:
            dt_tags = metadata_section.find_all("dt")
            dd_tags = metadata_section.find_all("dd")

            for dt, dd in zip(dt_tags, dd_tags):
                label = dt.get_text(strip=True).lower()
                value = dd.get_text(strip=True)

                if "dated" in label:
                    metadata["letter_date"] = self._parse_date(value)
                elif "location" in label:
                    metadata["location_en"] = value
                elif "reference" in label:
                    metadata["reference"] = value

        # Fallback: шукаємо дату та локацію в тексті сторінки
        if not metadata["letter_date"] or not metadata["location_en"]:
            page_text = soup.get_text()
            # Pattern: "July 12th 1947 - Cawnpore"
            date_loc_pattern = r"(\w+ \d+(?:st|nd|rd|th)?,? \d{4})\s*-\s*([A-Z][a-zA-Z\s]+)"
            match = re.search(date_loc_pattern, page_text)
            if match:
                if not metadata["letter_date"]:
                    metadata["letter_date"] = self._parse_date(match.group(1))
                if not metadata["location_en"]:
                    metadata["location_en"] = match.group(2).strip()

        # Витягнути блок адреси (зазвичай перед "Dear...")
        # Шукаємо текст між заголовком та початком листа
        address_pattern = r"([A-Z][A-Za-z\s,\.]+?)\s*Dear"
        address_match = re.search(address_pattern, soup.get_text(), re.DOTALL)
        if address_match:
            address_text = address_match.group(1).strip()
            # Очистити від зайвих пробілів та рядків
            address_lines = [line.strip() for line in address_text.split("\n") if line.strip()]
            metadata["address_block"] = "\n".join(address_lines[-5:])  # Останні 5 рядків

        return metadata

    def parse_letter_content(self, html: str) -> str:
        """
        Витягнути текст листа з HTML
        Повертає суцільний текст листа
        """
        soup = BeautifulSoup(html, "lxml")

        # Знайти основний контент листа
        # Vedabase використовує div.copy для параграфів
        main_content = soup.find("main")

        if not main_content:
            main_content = soup.find("body")

        if not main_content:
            print("[WARNING] Не знайдено контент листа")
            return ""

        # Vedabase структура: параграфи в div з класом "copy"
        para_tags = main_content.find_all("div", class_=lambda c: c and "copy" in c)

        # Якщо не знайдено, спробувати стандартні <p> теги
        if not para_tags:
            para_tags = main_content.find_all("p")

        # Паттерни для пропуску
        skip_patterns = ["previous", "next", "share", "download", "copyright", "vedabase.io"]

        # Витягнути параграфи
        paragraphs = []
        for p_tag in para_tags:
            text = p_tag.get_text(separator=" ", strip=True)
            if text and len(text) > 5:
                # Пропустити UI елементи
                text_lower = text.lower()
                if any(skip in text_lower for skip in skip_patterns):
                    continue

                paragraphs.append(text)

                # Витягнути санскритські терміни
                self._extract_sanskrit_terms(p_tag, text)

        # Об'єднати параграфи
        content = "\n\n".join(paragraphs)

        return content

    def _extract_sanskrit_terms(self, tag: Tag, text: str) -> List[str]:
        """Витягнути санскритські терміни з параграфа"""
        terms = []

        # 1. Шукаємо слова в курсиві або em тегах
        for italic in tag.find_all(["i", "em"]):
            term = italic.get_text(strip=True)
            if term and len(term) > 2:
                terms.append(term)
                self.sanskrit_terms.add(term)

        # 2. Шукаємо слова з діакритичними знаками
        diacritic_pattern = r'\b\w*[āīūṛṝḷḹēōṃḥṇṭḍśṣñ]\w*\b'
        diacritic_terms = re.findall(diacritic_pattern, text, re.IGNORECASE)
        for term in diacritic_terms:
            if len(term) > 2:
                terms.append(term)
                self.sanskrit_terms.add(term)

        return list(set(terms))

    def _parse_date(self, date_str: str) -> Optional[str]:
        """Парсити дату в формат YYYY-MM-DD"""
        # Спробувати різні формати дат
        formats = [
            "%B %d, %Y",      # "July 12, 1947"
            "%B %dst, %Y",    # "July 1st, 1947"
            "%B %dnd, %Y",    # "July 2nd, 1947"
            "%B %drd, %Y",    # "July 3rd, 1947"
            "%B %dth, %Y",    # "July 12th, 1947"
            "%Y-%m-%d",       # "1947-07-12"
            "%d/%m/%Y",       # "12/07/1947"
            "%B %d %Y",       # "July 12 1947" (без коми)
            "%B %dst %Y",
            "%B %dnd %Y",
            "%B %drd %Y",
            "%B %dth %Y",
        ]

        # Видалити суфікси дат (st, nd, rd, th)
        cleaned = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', date_str)

        for fmt in formats:
            try:
                dt = datetime.strptime(cleaned, fmt)
                return dt.strftime("%Y-%m-%d")
            except:
                continue

        return None

    def translate_metadata_to_ua(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Перекласти метадані на українську"""
        ua_metadata = metadata.copy()

        # Перекласти локацію
        location_en = metadata.get("location_en", "")
        ua_metadata["location_ua"] = LOCATION_TRANSLATIONS.get(
            location_en, location_en
        )

        # Отримувач - транслітерація імен
        # (потім буде виконано через letter_translator.py)
        recipient_en = metadata.get("recipient_en", "")
        ua_metadata["recipient_ua"] = self._transliterate_name(recipient_en)

        return ua_metadata

    def _transliterate_name(self, name: str) -> str:
        """
        Базова транслітерація імен
        Більш детальна транслітерація буде в letter_translator.py
        """
        # Прості заміни для поширених імен
        replacements = {
            "Mahatma Gandhi": "Махатма Ґанді",
            "Jawaharlal Nehru": "Джавахарлал Неру",
            "Sardar Patel": "Сардар Патель",
            "Gandhi": "Ґанді",
            "Nehru": "Неру",
        }

        for en, ua in replacements.items():
            if en in name:
                name = name.replace(en, ua)

        return name or name  # Повернути оригінал якщо немає перекладу

    def import_letter(self, slug: str) -> Optional[Dict[str, Any]]:
        """
        Імпортувати повний лист за slug
        Повертає JSON структуру готову для збереження в БД
        """
        url = f"https://vedabase.io/en/library/letters/{slug}/"
        print(f"[INFO] Завантаження листа: {url}")

        html = self.fetch_url(url)
        if not html:
            return None

        # Парсинг метаданих
        metadata = self.parse_letter_metadata(html, slug)
        if not metadata or not metadata["recipient_en"]:
            print(f"[ERROR] Не вдалося витягнути метадані для {slug}")
            return None

        # Парсинг контенту
        content_en = self.parse_letter_content(html)
        if not content_en:
            print(f"[WARNING] Не знайдено тексту для {slug}")

        # Переклад метаданих на українську
        ua_metadata = self.translate_metadata_to_ua(metadata)

        # Формування результату
        result = {
            "metadata": {
                "slug": slug,
                "recipient_en": metadata["recipient_en"],
                "recipient_ua": ua_metadata["recipient_ua"],
                "letter_date": metadata["letter_date"],
                "location_en": metadata["location_en"],
                "location_ua": ua_metadata["location_ua"],
                "reference": metadata["reference"],
                "address_block": metadata["address_block"],
            },
            "content_en": content_en,
            "sanskrit_terms": list(self.sanskrit_terms),
        }

        print(f"[SUCCESS] Імпортовано лист")
        print(f"[INFO] Знайдено {len(self.sanskrit_terms)} санскритських термінів")

        return result

    def save_to_json(self, data: Dict[str, Any], output_file: str):
        """Зберегти дані в JSON файл"""
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print(f"[SUCCESS] Збережено в {output_file}")


def main():
    parser = argparse.ArgumentParser(
        description="Імпорт листів Прабгупади з Vedabase"
    )
    parser.add_argument(
        "--slug",
        type=str,
        required=True,
        help="Slug листа (наприклад, letter-to-mahatma-gandhi)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default=None,
        help="Шлях до output JSON файлу (за замовчуванням: tools/outputs/letters/{slug}.json)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=2.0,
        help="Затримка між запитами в секундах (за замовчуванням: 2.0)",
    )

    args = parser.parse_args()

    # Ініціалізація імпортера
    importer = LettersImporter(delay_seconds=args.delay)

    # Імпорт листа
    letter_data = importer.import_letter(args.slug)

    if not letter_data:
        print(f"[ERROR] Не вдалося імпортувати лист {args.slug}")
        sys.exit(1)

    # Визначити output файл
    if args.output:
        output_file = args.output
    else:
        output_file = f"tools/outputs/letters/{args.slug}.json"

    # Зберегти результат
    importer.save_to_json(letter_data, output_file)

    print("[DONE] Імпорт завершено успішно!")


if __name__ == "__main__":
    main()
