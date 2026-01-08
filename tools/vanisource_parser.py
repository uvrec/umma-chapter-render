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

Вихідний формат:
- Зберігає HTML форматування (курсив для санскриту, жирний для мовців)
- Тільки англійська версія (українська заповнюється окремо)
- Інформація для зв'язку з віршами книг (book_slug, chapter, verse)
"""

import requests
from bs4 import BeautifulSoup, Tag, NavigableString
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

# Маппінг типів лекцій на book_slug
LECTURE_TYPE_MAP = {
    "BG": ("Bhagavad-gita", "bg"),
    "SB": ("Srimad-Bhagavatam", "sb"),
    "CC": ("Sri Caitanya-caritamrta", "scc"),  # scc - slug в нашій БД
    "NOD": ("Nectar of Devotion", "nod"),
    "NOI": ("Nectar of Instruction", "noi"),
    "ISO": ("Sri Isopanisad", "iso"),
    "SI": ("Sri Isopanisad", "iso"),
    "BS": ("Brahma-samhita", "bs"),
}

# Допустимі HTML теги для збереження форматування
ALLOWED_TAGS = {"i", "em", "b", "strong", "br", "sup", "sub"}


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
            "sanskrit_terms": [...],
            "verse_references": [...]  # для зв'язку з віршами
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
        audio_urls = self._extract_audio_urls(soup)
        if audio_urls:
            metadata["audio_url"] = audio_urls[0]  # Перший аудіо файл
            metadata["audio_urls"] = audio_urls  # Всі аудіо файли (може бути кілька частин)

        # Парсити параграфи зі збереженням HTML форматування
        paragraphs = self._parse_content(soup)

        # Витягнути посилання на вірші
        verse_refs = self._extract_verse_references(soup, metadata)

        return {
            "metadata": metadata,
            "paragraphs": paragraphs,
            "sanskrit_terms": list(self.sanskrit_terms),
            "verse_references": verse_refs,
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
            "lecture_date": None,
            "location_en": None,
            "lecture_type": "Lecture",
            "audio_url": None,
            "book_slug": None,
            "canto_number": None,  # Для SB (1-12) або CC lila як число
            "canto_lila": None,  # Для CC: adi, madhya, antya
            "chapter_number": None,
            "verse_start": None,  # Початковий вірш
            "verse_end": None,  # Кінцевий вірш (якщо діапазон)
            "verse_number": None,  # Оригінальний рядок (напр. "7-11")
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
        self._parse_verse_reference(lecture_part, metadata)

        return metadata

    def _parse_verse_reference(self, lecture_part: str, metadata: Dict[str, Any]):
        """Парсити посилання на вірші з назви лекції"""

        # CC: Adi/Madhya/Antya XX.YY-ZZ
        cc_match = re.search(
            r"CC\s+(Adi|Madhya|Antya)\s+(\d+)\.(\d+)(?:-(\d+))?",
            lecture_part, re.IGNORECASE
        )
        if cc_match:
            lila = cc_match.group(1).lower()
            metadata["canto_lila"] = lila
            # Конвертуємо lila в canto_number для сумісності
            lila_to_num = {"adi": 1, "madhya": 2, "antya": 3}
            metadata["canto_number"] = lila_to_num.get(lila)
            metadata["chapter_number"] = int(cc_match.group(2))
            metadata["verse_start"] = int(cc_match.group(3))
            metadata["verse_end"] = int(cc_match.group(4)) if cc_match.group(4) else None
            metadata["verse_number"] = cc_match.group(3)
            if cc_match.group(4):
                metadata["verse_number"] += f"-{cc_match.group(4)}"
            return

        # SB: X.Y.Z-W (canto.chapter.verse)
        sb_match = re.search(
            r"SB\s+(\d+)\.(\d+)\.(\d+)(?:-(\d+))?",
            lecture_part, re.IGNORECASE
        )
        if sb_match:
            metadata["canto_number"] = int(sb_match.group(1))
            metadata["chapter_number"] = int(sb_match.group(2))
            metadata["verse_start"] = int(sb_match.group(3))
            metadata["verse_end"] = int(sb_match.group(4)) if sb_match.group(4) else None
            metadata["verse_number"] = sb_match.group(3)
            if sb_match.group(4):
                metadata["verse_number"] += f"-{sb_match.group(4)}"
            return

        # BG та інші: XX.YY-ZZ
        verse_match = re.search(r"(\d+)\.(\d+)(?:-(\d+))?", lecture_part)
        if verse_match:
            metadata["chapter_number"] = int(verse_match.group(1))
            metadata["verse_start"] = int(verse_match.group(2))
            metadata["verse_end"] = int(verse_match.group(3)) if verse_match.group(3) else None
            metadata["verse_number"] = verse_match.group(2)
            if verse_match.group(3):
                metadata["verse_number"] += f"-{verse_match.group(3)}"

    def _title_to_slug(self, title: str) -> str:
        """Конвертувати заголовок в slug"""
        slug = title.lower()
        slug = re.sub(r"\s*-\s*lecture\s*", "-", slug)
        slug = re.sub(r"[^a-z0-9]+", "-", slug)
        slug = slug.strip("-")
        return slug

    def _extract_audio_urls(self, soup: BeautifulSoup) -> List[str]:
        """Витягнути всі URL аудіо файлів"""
        urls = []

        # Шукаємо audio або source теги
        for audio_tag in soup.find_all("audio"):
            source = audio_tag.find("source")
            if source and source.get("src"):
                urls.append(source["src"])
            elif audio_tag.get("src"):
                urls.append(audio_tag["src"])

        # Шукаємо прямі посилання на mp3
        for a in soup.find_all("a", href=True):
            href = a["href"]
            if ".mp3" in href.lower() and href not in urls:
                urls.append(href)

        return urls

    def _parse_content(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Парсити контент лекції зі збереженням HTML форматування"""
        paragraphs = []

        # Знайти основний контент
        content_div = soup.find("div", class_="mw-parser-output")
        if not content_div:
            content_div = soup

        paragraph_number = 0

        for element in content_div.find_all(["p", "dl"]):
            # Отримати текст для перевірок
            plain_text = element.get_text(separator=" ", strip=True)

            # Пропустити порожні або дуже короткі елементи
            if not plain_text or len(plain_text) < 20:
                continue

            # Пропустити навігаційні елементи
            if any(skip in plain_text.lower() for skip in [
                "category:", "retrieved from", "navigation",
                "what links here", "related changes", "page actions"
            ]):
                continue

            paragraph_number += 1

            # Отримати HTML зі збереженням форматування
            content_html = self._sanitize_html(element)

            # Витягнути санскритські терміни
            sanskrit_terms = self._extract_sanskrit_terms(element, plain_text)

            # Визначити мовця (якщо є)
            speaker = self._extract_speaker(element)

            paragraph = {
                "paragraph_number": paragraph_number,
                "content_en": content_html,  # HTML з форматуванням
                "speaker": speaker,
                "sanskrit_terms": sanskrit_terms,
            }

            paragraphs.append(paragraph)

        return paragraphs

    def _sanitize_html(self, element: Tag) -> str:
        """
        Очистити HTML, залишивши тільки безпечні теги форматування
        Зберігає: <i>, <em>, <b>, <strong>, <br>, <sup>, <sub>
        """
        # Клонуємо елемент щоб не модифікувати оригінал
        clone = BeautifulSoup(str(element), "lxml")
        root = clone.find(element.name) or clone

        # Видалити всі атрибути з тегів крім дозволених
        for tag in root.find_all(True):
            if tag.name not in ALLOWED_TAGS:
                # Замінити тег на його вміст
                tag.unwrap()
            else:
                # Видалити всі атрибути
                tag.attrs = {}

        # Отримати внутрішній HTML
        inner_html = "".join(str(child) for child in root.children)

        # Нормалізувати пробіли
        inner_html = re.sub(r"\s+", " ", inner_html).strip()

        return inner_html

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

        # 1. Слова в курсиві (зазвичай санскрит)
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

    def _extract_verse_references(self, soup: BeautifulSoup, metadata: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Витягнути посилання на вірші з контенту лекції
        Це допоможе зв'язати лекцію з конкретними віршами в бібліотеці
        """
        refs = []

        # Основне посилання з метаданих
        if metadata.get("book_slug") and metadata.get("chapter_number"):
            ref = {
                "book_slug": metadata["book_slug"],
                "canto_number": metadata.get("canto_number"),
                "canto_lila": metadata.get("canto_lila"),
                "chapter_number": metadata["chapter_number"],
                "verse_start": metadata.get("verse_start"),
                "verse_end": metadata.get("verse_end"),
                "is_primary": True,  # Основна тема лекції
            }
            refs.append(ref)

        # Додаткові посилання з тексту (посилання на інші вірші)
        content_div = soup.find("div", class_="mw-parser-output")
        if content_div:
            for link in content_div.find_all("a", href=True):
                href = link["href"]

                # Парсити посилання на BG
                bg_match = re.search(r"/wiki/BG_(\d+)\.(\d+)", href)
                if bg_match:
                    ref = {
                        "book_slug": "bg",
                        "chapter_number": int(bg_match.group(1)),
                        "verse_start": int(bg_match.group(2)),
                        "is_primary": False,
                    }
                    if ref not in refs:
                        refs.append(ref)

                # Парсити посилання на SB
                sb_match = re.search(r"/wiki/SB_(\d+)\.(\d+)\.(\d+)", href)
                if sb_match:
                    ref = {
                        "book_slug": "sb",
                        "canto_number": int(sb_match.group(1)),
                        "chapter_number": int(sb_match.group(2)),
                        "verse_start": int(sb_match.group(3)),
                        "is_primary": False,
                    }
                    if ref not in refs:
                        refs.append(ref)

                # Парсити посилання на CC
                cc_match = re.search(r"/wiki/CC_(Adi|Madhya|Antya)_(\d+)\.(\d+)", href, re.IGNORECASE)
                if cc_match:
                    lila = cc_match.group(1).lower()
                    lila_to_num = {"adi": 1, "madhya": 2, "antya": 3}
                    ref = {
                        "book_slug": "scc",
                        "canto_number": lila_to_num.get(lila),
                        "canto_lila": lila,
                        "chapter_number": int(cc_match.group(2)),
                        "verse_start": int(cc_match.group(3)),
                        "is_primary": False,
                    }
                    if ref not in refs:
                        refs.append(ref)

        return refs

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
