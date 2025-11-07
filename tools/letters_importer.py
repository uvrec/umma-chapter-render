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

        # Витягнути заголовок (отримувач)
        title_tag = soup.find("h1")
        if title_tag:
            title_text = title_tag.get_text(strip=True)
            # "Letter to: Mahatma Gandhi"
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
        # Зазвичай це div з класом content, article, або main
        content_div = (
            soup.find("div", class_=re.compile(r"content|letter-text|main", re.I))
            or soup.find("article")
            or soup.find("main")
        )

        if not content_div:
            # Fallback: шукаємо body
            content_div = soup.find("body")

        if not content_div:
            print("[WARNING] Не знайдено контент листа")
            return ""

        # Витягнути всі параграфи
        paragraphs = []
        for p_tag in content_div.find_all("p"):
            text = p_tag.get_text(separator=" ", strip=True)
            if text and len(text) > 10:
                paragraphs.append(text)

                # Витягнути санскритські терміни
                self._extract_sanskrit_terms(p_tag, text)

        # Витягнути санскритські вірші (в курсиві або окремих блоках)
        verses = []
        for verse_tag in content_div.find_all(["blockquote", "div"], class_=re.compile(r"verse|sanskrit", re.I)):
            verse_text = verse_tag.get_text(strip=True)
            if verse_text:
                verses.append(verse_text)

        # Також шукаємо курсив з санскритом
        for italic in content_div.find_all(["i", "em"]):
            text = italic.get_text(strip=True)
            # Санскрит зазвичай має діакритичні знаки або є віршем
            if re.search(r'[āīūṛṝḷḹēōṃḥṇṭḍśṣñ]', text) and len(text) > 20:
                if text not in verses:
                    verses.append(text)

        # Об'єднати параграфи
        content = "\n\n".join(paragraphs)

        # Додати вірші в кінець або між параграфами (залежно від структури)
        if verses:
            content += "\n\n" + "\n\n".join(verses)

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
