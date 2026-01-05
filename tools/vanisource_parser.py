"""
vanisource_parser.py

Парсер лекцій з Vanisource.org (MediaWiki API)

Usage:
    pip install requests beautifulsoup4 lxml

    # Парсити конкретну лекцію
    python tools/vanisource_parser.py --page "660219 - Lecture BG Introduction - New York"

    # Парсити всі лекції за рік
    python tools/vanisource_parser.py --year 1966 --limit 10

    # Експорт списку лекцій за рік
    python tools/vanisource_parser.py --year 1966 --list-only

Структура Vanisource:
- API: https://vanisource.org/w/api.php
- Категорії: Category:YYYY_-_Lectures
- Заголовки: "YYMMDD - Lecture [Type] [Ref] - Location"
- Аудіо: AWS S3 mp3 файли
"""

import requests
from bs4 import BeautifulSoup, Tag
import time
import json
import re
import sys
import argparse
from typing import Optional, Dict, Any, List
from datetime import datetime
from pathlib import Path

# API endpoint
VANISOURCE_API = "https://vanisource.org/w/api.php"

# Headers для запитів
HEADERS = {
    "User-Agent": "vedavoice-vanisource-parser/1.0 (+https://vedavoice.org)",
    "Accept": "application/json",
}

# Маппінг типів лекцій
LECTURE_TYPE_MAP = {
    "BG": ("Bhagavad-gita", "bg"),
    "SB": ("Srimad-Bhagavatam", "sb"),
    "CC": ("Sri Caitanya-caritamrta", "cc"),
    "NOD": ("Nectar of Devotion", "nod"),
    "NOI": ("Nectar of Instruction", "noi"),
    "ISO": ("Sri Isopanisad", "iso"),
    "BS": ("Brahma-samhita", "bs"),
}

# Маппінг типів лекцій для української мови
LECTURE_TYPE_TRANSLATIONS = {
    "Bhagavad-gita": "Лекція з Бгаґавад-ґіти",
    "Srimad-Bhagavatam": "Лекція з Шрімад-Бгаґаватам",
    "Sri Caitanya-caritamrta": "Лекція з Шрі Чайтанья-чарітамріта",
    "Nectar of Devotion": "Лекція з Нектару відданості",
    "Nectar of Instruction": "Лекція з Нектару настанов",
    "Sri Isopanisad": "Лекція з Шрі Ішопанішад",
    "Brahma-samhita": "Лекція з Брахма-самхіти",
    "Lecture": "Лекція",
    "General": "Загальна лекція",
}

# Маппінг міст для української мови
LOCATION_TRANSLATIONS = {
    "New York": "Нью-Йорк",
    "Los Angeles": "Лос-Анджелес",
    "San Francisco": "Сан-Франциско",
    "London": "Лондон",
    "Paris": "Париж",
    "Bombay": "Бомбей",
    "Mumbai": "Мумбаї",
    "Calcutta": "Калькутта",
    "Kolkata": "Колката",
    "Vrindavan": "Вріндаван",
    "Vrndavana": "Вріндаван",
    "Mayapur": "Маяпур",
    "Māyāpur": "Маяпур",
    "Delhi": "Делі",
    "Hyderabad": "Хайдарабад",
    "Honolulu": "Гонолулу",
    "Tokyo": "Токіо",
    "Melbourne": "Мельбурн",
    "Sydney": "Сідней",
    "Montreal": "Монреаль",
    "Toronto": "Торонто",
}


class VanisourceParser:
    """Парсер лекцій з Vanisource.org"""

    def __init__(self, delay_seconds: float = 1.0, max_retries: int = 4):
        self.delay = delay_seconds
        self.max_retries = max_retries
        self.session = requests.Session()
        self.session.headers.update(HEADERS)
        self.sanskrit_terms: set = set()

    def _request(self, params: Dict[str, Any]) -> Optional[Dict]:
        """Виконати API запит з rate limiting та retry логікою"""
        params["format"] = "json"

        for attempt in range(self.max_retries):
            try:
                time.sleep(self.delay)
                r = self.session.get(VANISOURCE_API, params=params, timeout=30)
                r.raise_for_status()
                return r.json()
            except requests.exceptions.HTTPError as e:
                if e.response.status_code == 503:
                    wait_time = 2 ** (attempt + 1)  # 2, 4, 8, 16 seconds
                    print(f"[WARN] Server unavailable (503), retry {attempt + 1}/{self.max_retries} in {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                print(f"[ERROR] API request failed: {e}")
                return None
            except Exception as e:
                print(f"[ERROR] API request failed: {e}")
                return None

        print(f"[ERROR] Max retries ({self.max_retries}) exceeded")
        return None

    def get_lectures_list(
        self, year: int, limit: int = 500
    ) -> List[Dict[str, Any]]:
        """
        Отримати список лекцій за рік

        Returns: [{"pageid": int, "title": str}, ...]
        """
        category = f"Category:{year}_-_Lectures"
        lectures = []
        continue_token = None

        while True:
            params = {
                "action": "query",
                "list": "categorymembers",
                "cmtitle": category,
                "cmlimit": min(limit - len(lectures), 500),
                "cmtype": "page",
            }
            if continue_token:
                params["cmcontinue"] = continue_token

            data = self._request(params)
            if not data:
                break

            members = data.get("query", {}).get("categorymembers", [])
            lectures.extend(members)

            # Перевірити чи є ще сторінки
            if "continue" in data and len(lectures) < limit:
                continue_token = data["continue"].get("cmcontinue")
            else:
                break

        print(f"[INFO] Знайдено {len(lectures)} лекцій за {year} рік")
        return lectures

    def parse_page(self, page_title: str) -> Optional[Dict[str, Any]]:
        """
        Парсити сторінку лекції за назвою

        Returns: {
            "metadata": {...},
            "paragraphs": [...],
            "sanskrit_terms": [...]
        }
        """
        print(f"[INFO] Парсинг: {page_title}")

        # Отримати HTML сторінки
        params = {
            "action": "parse",
            "page": page_title,
            "prop": "text|categories|externallinks",
        }
        data = self._request(params)

        if not data or "parse" not in data:
            print(f"[ERROR] Не вдалося отримати сторінку: {page_title}")
            return None

        parse_data = data["parse"]
        html = parse_data.get("text", {}).get("*", "")

        if not html:
            print(f"[WARNING] Порожня сторінка: {page_title}")
            return None

        # Парсити метадані з заголовка
        metadata = self._parse_title_metadata(page_title)

        # Парсити контент
        soup = BeautifulSoup(html, "lxml")

        # Знайти аудіо URL
        audio_url = self._extract_audio_url(soup)
        if audio_url:
            metadata["audio_url"] = audio_url

        # Парсити параграфи
        paragraphs = self._parse_content(soup)

        # Переклад метаданих на українську
        metadata = self._add_ukrainian_translations(metadata)

        return {
            "metadata": metadata,
            "paragraphs": paragraphs,
            "sanskrit_terms": list(self.sanskrit_terms),
        }

    def _parse_title_metadata(self, title: str) -> Dict[str, Any]:
        """
        Парсити метадані з заголовка сторінки

        Формат: "YYMMDD - Lecture TYPE REF - LOCATION"
        Приклади:
            "660219 - Lecture BG Introduction - New York"
            "660302 - Lecture BG 02.07-11 - New York"
            "661216 - Lecture CC Madhya 20.172-244 - New York"
        """
        metadata = {
            "slug": self._title_to_slug(title),
            "title_en": title,
            "title_ua": None,
            "lecture_date": None,
            "location_en": None,
            "location_ua": None,
            "lecture_type": "Lecture",
            "audio_url": None,
            "book_slug": None,
            "canto_lila": None,
            "chapter_number": None,
            "verse_number": None,
        }

        # Парсинг дати (перші 6 цифр)
        date_match = re.match(r"^(\d{6})", title)
        if date_match:
            date_str = date_match.group(1)
            yy, mm, dd = date_str[:2], date_str[2:4], date_str[4:6]
            year = f"19{yy}" if int(yy) > 50 else f"20{yy}"
            try:
                # Якщо день або місяць = 00, використати 01
                mm = mm if mm != "00" else "01"
                dd = dd if dd != "00" else "01"
                metadata["lecture_date"] = f"{year}-{mm}-{dd}"
            except:
                pass

        # Парсинг локації (після останнього " - ")
        parts = title.split(" - ")
        if len(parts) >= 3:
            metadata["location_en"] = parts[-1].strip()

        # Парсинг типу лекції та посилання
        lecture_part = parts[1] if len(parts) >= 2 else ""

        # Визначити тип лекції
        for code, (lecture_type, book_slug) in LECTURE_TYPE_MAP.items():
            if f" {code} " in f" {lecture_part} " or lecture_part.startswith(f"Lecture {code}"):
                metadata["lecture_type"] = lecture_type
                metadata["book_slug"] = book_slug
                break

        # Витягнути номери розділів/віршів
        # Формат: "BG 02.07-11" або "CC Madhya 20.172-244"

        # Для CC: Adi/Madhya/Antya
        cc_match = re.search(r"CC\s+(Adi|Madhya|Antya)\s+(\d+)\.(\d+(?:-\d+)?)", lecture_part, re.IGNORECASE)
        if cc_match:
            metadata["canto_lila"] = cc_match.group(1).lower()
            metadata["chapter_number"] = int(cc_match.group(2))
            metadata["verse_number"] = cc_match.group(3)
        else:
            # Для BG, SB та інших: 02.07-11
            verse_match = re.search(r"(\d+)\.(\d+(?:-\d+)?)", lecture_part)
            if verse_match:
                metadata["chapter_number"] = int(verse_match.group(1))
                metadata["verse_number"] = verse_match.group(2)

        return metadata

    def _title_to_slug(self, title: str) -> str:
        """Конвертувати заголовок в slug"""
        # Видалити "Lecture" якщо є
        slug = title.lower()
        slug = re.sub(r"\s*-\s*lecture\s*", "-", slug)
        # Замінити пробіли та спецсимволи
        slug = re.sub(r"[^a-z0-9]+", "-", slug)
        slug = slug.strip("-")
        return slug

    def _extract_audio_url(self, soup: BeautifulSoup) -> Optional[str]:
        """Витягнути URL аудіо файлу"""
        # Шукаємо audio або source теги
        audio_tag = soup.find("audio")
        if audio_tag:
            source = audio_tag.find("source")
            if source and source.get("src"):
                return source["src"]
            if audio_tag.get("src"):
                return audio_tag["src"]

        # Шукаємо прямі посилання на mp3
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if ".mp3" in href.lower():
                return href

        return None

    def _parse_content(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Парсити контент лекції"""
        paragraphs = []

        # Знайти основний контент
        content_div = soup.find("div", class_="mw-parser-output")
        if not content_div:
            content_div = soup

        # Витягнути всі текстові елементи
        paragraph_number = 0

        for element in content_div.find_all(["p", "dl"]):
            text = self._clean_text(element)

            # Пропустити порожні або дуже короткі елементи
            if not text or len(text) < 20:
                continue

            # Пропустити навігаційні елементи
            if any(skip in text.lower() for skip in [
                "category:", "retrieved from", "navigation",
                "what links here", "related changes"
            ]):
                continue

            paragraph_number += 1

            # Витягнути санскритські терміни
            sanskrit_terms = self._extract_sanskrit_terms(element, text)

            # Визначити мовця (якщо є)
            speaker = self._extract_speaker(element)

            paragraph = {
                "paragraph_number": paragraph_number,
                "content_en": text,
                "content_ua": None,  # Буде заповнено пізніше
                "audio_timecode": None,
                "sanskrit_terms": sanskrit_terms,
                "speaker": speaker,
            }

            paragraphs.append(paragraph)

        return paragraphs

    def _clean_text(self, element: Tag) -> str:
        """Очистити текст від зайвих пробілів та форматування"""
        # Отримати текст зберігаючи структуру
        text = element.get_text(separator=" ", strip=True)
        # Видалити множинні пробіли
        text = re.sub(r"\s+", " ", text)
        return text.strip()

    def _extract_speaker(self, element: Tag) -> Optional[str]:
        """Визначити мовця з елемента"""
        # Шукаємо жирний текст на початку
        bold = element.find("b")
        if bold:
            speaker_text = bold.get_text(strip=True)
            if speaker_text.endswith(":"):
                return speaker_text[:-1]  # Видалити двокрапку
        return None

    def _extract_sanskrit_terms(self, element: Tag, text: str) -> List[str]:
        """Витягнути санскритські терміни"""
        terms = []

        # 1. Слова в курсиві
        for italic in element.find_all(["i", "em"]):
            term = italic.get_text(strip=True)
            if term and len(term) > 2 and not term.startswith("http"):
                terms.append(term)
                self.sanskrit_terms.add(term)

        # 2. Слова з діакритичними знаками
        diacritic_pattern = r'\b\w*[āīūṛṝḷḹēōṃḥṇṭḍśṣĀĪŪṚṜḶḸĒŌṂḤṆṬḌŚṢ]\w*\b'
        diacritic_terms = re.findall(diacritic_pattern, text)
        for term in diacritic_terms:
            if len(term) > 2:
                terms.append(term)
                self.sanskrit_terms.add(term)

        return list(set(terms))

    def _add_ukrainian_translations(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Додати українські переклади до метаданих"""
        # Переклад типу лекції
        lecture_type = metadata.get("lecture_type", "Lecture")
        metadata["lecture_type_ua"] = LECTURE_TYPE_TRANSLATIONS.get(
            lecture_type, "Лекція"
        )

        # Переклад локації
        location_en = metadata.get("location_en", "")
        metadata["location_ua"] = LOCATION_TRANSLATIONS.get(
            location_en, location_en
        )

        # Базовий переклад заголовка
        title_en = metadata.get("title_en", "")
        metadata["title_ua"] = self._transliterate_title(title_en)

        return metadata

    def _transliterate_title(self, title: str) -> str:
        """Базова транслітерація заголовка"""
        replacements = {
            "Lecture": "Лекція",
            "Introduction": "Вступ",
            "Bhagavad-gita": "Бгаґавад-ґіта",
            "Srimad-Bhagavatam": "Шрімад-Бгаґаватам",
            "Caitanya-caritamrta": "Чайтанья-чарітамріта",
            "New York": "Нью-Йорк",
            "Los Angeles": "Лос-Анджелес",
            "London": "Лондон",
            "Adi": "Аді",
            "Madhya": "Мадх'я",
            "Antya": "Антья",
        }

        result = title
        for en, ua in replacements.items():
            result = result.replace(en, ua)
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
        description="Парсер лекцій з Vanisource.org"
    )
    parser.add_argument(
        "--page",
        type=str,
        help="Назва сторінки для парсингу (наприклад, '660219 - Lecture BG Introduction - New York')",
    )
    parser.add_argument(
        "--year",
        type=int,
        help="Рік для парсингу всіх лекцій",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=500,
        help="Максимальна кількість лекцій для парсингу (за замовчуванням: 500)",
    )
    parser.add_argument(
        "--list-only",
        action="store_true",
        help="Тільки вивести список лекцій без парсингу контенту",
    )
    parser.add_argument(
        "--output",
        type=str,
        help="Шлях до output файлу/директорії",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="Затримка між запитами в секундах (за замовчуванням: 1.0)",
    )

    args = parser.parse_args()

    if not args.page and not args.year:
        parser.error("Потрібно вказати --page або --year")

    # Ініціалізація парсера
    vs_parser = VanisourceParser(delay_seconds=args.delay)

    if args.page:
        # Парсити одну сторінку
        lecture_data = vs_parser.parse_page(args.page)

        if not lecture_data:
            print(f"[ERROR] Не вдалося парсити сторінку: {args.page}")
            sys.exit(1)

        # Визначити output файл
        if args.output:
            output_file = args.output
        else:
            slug = lecture_data["metadata"]["slug"]
            output_file = f"tools/outputs/vanisource/{slug}.json"

        vs_parser.save_to_json(lecture_data, output_file)

    elif args.year:
        # Отримати список лекцій за рік
        lectures = vs_parser.get_lectures_list(args.year, limit=args.limit)

        if args.list_only:
            # Тільки вивести список
            output_data = {
                "year": args.year,
                "count": len(lectures),
                "lectures": lectures,
            }

            if args.output:
                output_file = args.output
            else:
                output_file = f"tools/outputs/vanisource/{args.year}_lectures_list.json"

            vs_parser.save_to_json(output_data, output_file)
        else:
            # Парсити всі лекції
            output_dir = Path(args.output or f"tools/outputs/vanisource/{args.year}")
            output_dir.mkdir(parents=True, exist_ok=True)

            successful = 0
            failed = 0

            for i, lecture in enumerate(lectures):
                title = lecture["title"]
                print(f"\n[{i+1}/{len(lectures)}] Обробка: {title}")

                lecture_data = vs_parser.parse_page(title)

                if lecture_data:
                    slug = lecture_data["metadata"]["slug"]
                    output_file = output_dir / f"{slug}.json"
                    vs_parser.save_to_json(lecture_data, str(output_file))
                    successful += 1
                else:
                    failed += 1

            print(f"\n[DONE] Успішно: {successful}, Помилок: {failed}")

    print("[DONE] Парсинг завершено!")


if __name__ == "__main__":
    main()
