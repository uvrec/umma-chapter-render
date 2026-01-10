#!/usr/bin/env python3
"""
vedabase_bulk_importer.py

Масовий імпорт лекцій та листів з Vedabase.io

Етапи:
1. Збір всіх slug'ів з сторінок переліку (пагінація)
2. Імпорт кожного матеріалу з детальної сторінки
3. Збереження прогресу для resume
4. Автопереклад на українську
5. Завантаження в Supabase

Usage:
    # Імпорт лекцій
    python tools/vedabase_bulk_importer.py --type lectures --limit 100 --batch-size 10

    # Імпорт листів
    python tools/vedabase_bulk_importer.py --type letters --limit 50

    # Resume після переривання
    python tools/vedabase_bulk_importer.py --type lectures --resume

Requirements:
    pip install requests beautifulsoup4 lxml supabase python-dotenv

НОРМАЛІЗАЦІЯ ТЕКСТУ (BBT Editorial Guidelines):
===============================================
Після імпорту застосовувати правила нормалізації з:
- tools/translit_normalizer.py - apply_ukrainian_rules() для українського тексту
- tools/pre_import_normalizer.py - mojibake, діакритика, апострофи
- src/utils/text/textNormalizationRules.ts - повний список правил (TypeScript)

МАППІНГ ПОЛІВ (для джерел EN + Sanskrit/Bengali):
=================================================
- sanskrit_en / sanskrit_ua — Bengali/Sanskrit (Devanagari script), однаковий вміст
- transliteration_en — IAST транслітерація (латинка з діакритикою)
- transliteration_ua — українська кирилична транслітерація з діакритикою
  (конвертується з IAST за допомогою tools/translit_normalizer.py)
- translation_en / purport_en — англійський переклад та пояснення
- translation_ua / purport_ua — український переклад та пояснення
"""

import os
import sys
import json
import time
import argparse
import re
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any, List, Set
from dataclasses import dataclass, asdict

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Завантажити .env
load_dotenv()

# Конфігурація
VEDABASE_BASE_URL = "https://vedabase.io"
TRANSCRIPTS_URL = f"{VEDABASE_BASE_URL}/en/library/transcripts/"
LETTERS_URL = f"{VEDABASE_BASE_URL}/en/library/letters/"

HEADERS = {
    "User-Agent": "vedavoice-bulk-importer/1.0 (+https://vedavoice.org)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

# Шляхи
PROGRESS_FILE_LECTURES = "tools/outputs/import_progress_lectures.json"
PROGRESS_FILE_LETTERS = "tools/outputs/import_progress_letters.json"
OUTPUT_DIR_LECTURES = "tools/outputs/lectures"
OUTPUT_DIR_LETTERS = "tools/outputs/letters"


@dataclass
class ImportProgress:
    """Стан імпорту для збереження/відновлення"""
    content_type: str  # "lectures" or "letters"
    total_slugs: int
    imported_slugs: List[str]
    failed_slugs: List[str]
    last_updated: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ImportProgress":
        return cls(**data)


class VedabaseBulkImporter:
    """Масовий імпортер контенту з Vedabase"""

    def __init__(
        self,
        content_type: str = "lectures",
        delay_seconds: float = 2.0,
        batch_size: int = 10,
    ):
        self.content_type = content_type
        self.delay = delay_seconds
        self.batch_size = batch_size
        self.session = requests.Session()
        self.session.headers.update(HEADERS)

        # Шляхи залежно від типу контенту
        if content_type == "lectures":
            self.list_url = TRANSCRIPTS_URL
            self.progress_file = PROGRESS_FILE_LECTURES
            self.output_dir = OUTPUT_DIR_LECTURES
        else:
            self.list_url = LETTERS_URL
            self.progress_file = PROGRESS_FILE_LETTERS
            self.output_dir = OUTPUT_DIR_LETTERS

        # Створити директорії
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)
        Path(self.progress_file).parent.mkdir(parents=True, exist_ok=True)

        # Колекція санскритських термінів
        self.sanskrit_terms: Set[str] = set()

    def fetch_url(self, url: str, retry_count: int = 3) -> Optional[str]:
        """Завантажити HTML з URL з ретраями"""
        for attempt in range(retry_count):
            try:
                time.sleep(self.delay)
                r = self.session.get(url, timeout=30)
                r.raise_for_status()
                return r.text
            except requests.RequestException as e:
                print(f"[WARN] Attempt {attempt + 1}/{retry_count} failed for {url}: {e}")
                if attempt < retry_count - 1:
                    time.sleep(self.delay * 2)  # Подвоєна затримка перед ретраєм

        print(f"[ERROR] All attempts failed for {url}")
        return None

    def collect_slugs_from_list_page(self, page_url: str) -> List[str]:
        """Витягнути slug'и з однієї сторінки списку"""
        html = self.fetch_url(page_url)
        if not html:
            return []

        soup = BeautifulSoup(html, "lxml")
        slugs = []

        # Знайти всі посилання на лекції/листи
        # Формат: /en/library/transcripts/SLUG/ або /en/library/letters/SLUG/
        pattern = re.compile(
            rf'/en/library/{self.content_type}/([^/]+)/?$'
        )

        for link in soup.find_all("a", href=True):
            href = link["href"]
            match = pattern.search(href)
            if match:
                slug = match.group(1)
                if slug and slug not in slugs:
                    slugs.append(slug)

        return slugs

    def collect_all_slugs(self, max_pages: int = 100) -> List[str]:
        """Зібрати всі slug'и з усіх сторінок пагінації"""
        all_slugs = []
        page = 1

        print(f"[INFO] Collecting {self.content_type} slugs...")

        while page <= max_pages:
            # URL з пагінацією
            page_url = f"{self.list_url}?page={page}"
            print(f"[INFO] Fetching page {page}: {page_url}")

            slugs = self.collect_slugs_from_list_page(page_url)

            if not slugs:
                print(f"[INFO] No more items found at page {page}")
                break

            all_slugs.extend(slugs)
            print(f"[INFO] Found {len(slugs)} items on page {page}, total: {len(all_slugs)}")

            page += 1

        # Видалити дублікати, зберігаючи порядок
        unique_slugs = list(dict.fromkeys(all_slugs))
        print(f"[SUCCESS] Collected {len(unique_slugs)} unique slugs")

        return unique_slugs

    def parse_lecture_metadata(self, html: str, slug: str) -> Optional[Dict[str, Any]]:
        """Витягнути метадані лекції"""
        soup = BeautifulSoup(html, "lxml")

        metadata = {
            "slug": slug,
            "title_en": None,
            "lecture_date": None,
            "location_en": None,
            "lecture_type": "Lecture",
            "audio_url": None,
            "book_slug": None,
            "chapter_number": None,
            "verse_number": None,
        }

        # Заголовок
        title_tag = soup.find("h1")
        if title_tag:
            metadata["title_en"] = title_tag.get_text(strip=True)

        # Метадані зі structured data або тексту
        page_text = soup.get_text()

        # Дата
        date_patterns = [
            r"(\w+ \d{1,2}(?:st|nd|rd|th)?,? \d{4})",
            r"(\d{4}-\d{2}-\d{2})",
        ]
        for pattern in date_patterns:
            match = re.search(pattern, page_text)
            if match:
                metadata["lecture_date"] = self._parse_date(match.group(1))
                if metadata["lecture_date"]:
                    break

        # Fallback: парсинг дати зі slug
        if not metadata["lecture_date"]:
            metadata["lecture_date"] = self._parse_date_from_slug(slug)

        # Локація
        loc_pattern = r"(?:in |at |— |, )([A-Z][a-zA-Z\s]+?)(?:\s*$|\s*\||\s*—)"
        loc_match = re.search(loc_pattern, page_text[:500])
        if loc_match:
            metadata["location_en"] = loc_match.group(1).strip()

        # Тип лекції та книга
        title_lower = (metadata["title_en"] or "").lower()
        if "bhagavad" in title_lower or "gita" in title_lower or "bg" in slug:
            metadata["lecture_type"] = "Bhagavad-gita"
            metadata["book_slug"] = "bg"
        elif "bhagavatam" in title_lower or "sb" in slug:
            metadata["lecture_type"] = "Srimad-Bhagavatam"
            metadata["book_slug"] = "sb"
        elif "caitanya" in title_lower or "cc" in slug:
            metadata["lecture_type"] = "Sri Caitanya-caritamrta"
            metadata["book_slug"] = "cc"
        elif "walk" in title_lower or "walk" in slug:
            metadata["lecture_type"] = "Morning Walk"
        elif "conversation" in title_lower or "conv" in slug:
            metadata["lecture_type"] = "Conversation"

        # Аудіо URL
        audio_tag = soup.find("audio") or soup.find("source", {"type": "audio/mpeg"})
        if audio_tag:
            metadata["audio_url"] = audio_tag.get("src")

        # Розділ/вірш
        verse_match = re.search(r"(\d+)\.(\d+(?:-\d+)?)", metadata["title_en"] or "")
        if verse_match:
            metadata["chapter_number"] = int(verse_match.group(1))
            metadata["verse_number"] = verse_match.group(2)

        return metadata

    def parse_lecture_content(self, html: str) -> List[Dict[str, Any]]:
        """Витягнути параграфи лекції"""
        soup = BeautifulSoup(html, "lxml")
        paragraphs = []

        # Знайти контент
        content_div = (
            soup.find("div", class_=re.compile(r"content|transcript|lecture-text", re.I))
            or soup.find("article")
            or soup.find("main")
            or soup.find("body")
        )

        if not content_div:
            return []

        for idx, p_tag in enumerate(content_div.find_all("p"), start=1):
            text = p_tag.get_text(separator=" ", strip=True)

            if not text or len(text) < 10:
                continue

            # Санскритські терміни
            sanskrit_terms = self._extract_sanskrit_terms(p_tag, text)

            paragraphs.append({
                "paragraph_number": idx,
                "content_en": text,
                "sanskrit_terms": sanskrit_terms,
            })

        return paragraphs

    def parse_letter_metadata(self, html: str, slug: str) -> Optional[Dict[str, Any]]:
        """Витягнути метадані листа"""
        soup = BeautifulSoup(html, "lxml")

        metadata = {
            "slug": slug,
            "recipient_en": None,
            "letter_date": None,
            "location_en": None,
            "reference": None,
        }

        # Заголовок (отримувач)
        title_tag = soup.find("h1")
        if title_tag:
            title_text = title_tag.get_text(strip=True)
            if "Letter to:" in title_text:
                metadata["recipient_en"] = title_text.replace("Letter to:", "").strip()
            else:
                metadata["recipient_en"] = title_text

        # Метадані з dl/dt/dd
        dl = soup.find("dl")
        if dl:
            for dt, dd in zip(dl.find_all("dt"), dl.find_all("dd")):
                label = dt.get_text(strip=True).lower()
                value = dd.get_text(strip=True)

                if "dated" in label:
                    metadata["letter_date"] = self._parse_date(value)
                elif "location" in label:
                    metadata["location_en"] = value
                elif "reference" in label:
                    metadata["reference"] = value

        return metadata

    def parse_letter_content(self, html: str) -> str:
        """Витягнути текст листа"""
        soup = BeautifulSoup(html, "lxml")

        content_div = (
            soup.find("div", class_=re.compile(r"content|letter-text|main", re.I))
            or soup.find("article")
            or soup.find("main")
            or soup.find("body")
        )

        if not content_div:
            return ""

        paragraphs = []
        for p_tag in content_div.find_all("p"):
            text = p_tag.get_text(separator=" ", strip=True)
            if text and len(text) > 10:
                paragraphs.append(text)
                self._extract_sanskrit_terms(p_tag, text)

        return "\n\n".join(paragraphs)

    def _extract_sanskrit_terms(self, tag, text: str) -> List[str]:
        """Витягнути санскритські терміни"""
        terms = []

        # Курсив
        for italic in tag.find_all(["i", "em"]):
            term = italic.get_text(strip=True)
            if term and len(term) > 2:
                terms.append(term)
                self.sanskrit_terms.add(term)

        # Діакритика
        diacritic_pattern = r'\b\w*[āīūṛṝḷḹēōṃḥṇṭḍśṣñ]\w*\b'
        for term in re.findall(diacritic_pattern, text, re.IGNORECASE):
            if len(term) > 2:
                terms.append(term)
                self.sanskrit_terms.add(term)

        return list(set(terms))

    def _parse_date(self, date_str: str) -> Optional[str]:
        """Парсити дату в YYYY-MM-DD"""
        cleaned = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', date_str)

        formats = [
            "%B %d, %Y", "%B %d %Y",
            "%Y-%m-%d", "%d/%m/%Y",
        ]

        for fmt in formats:
            try:
                dt = datetime.strptime(cleaned.strip(), fmt)
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                continue

        return None

    def _parse_date_from_slug(self, slug: str) -> Optional[str]:
        """Витягнути дату зі slug (YYMMDD)"""
        match = re.match(r"(\d{2})(\d{2})(\d{2})", slug)
        if match:
            yy, mm, dd = match.groups()
            year = f"19{yy}" if int(yy) > 50 else f"20{yy}"
            try:
                dt = datetime(int(year), int(mm), int(dd))
                return dt.strftime("%Y-%m-%d")
            except ValueError:
                pass
        return None

    def import_single_item(self, slug: str) -> Optional[Dict[str, Any]]:
        """Імпортувати один елемент (лекцію або лист)"""
        url = f"{self.list_url}{slug}/"
        print(f"[INFO] Importing: {url}")

        html = self.fetch_url(url)
        if not html:
            return None

        if self.content_type == "lectures":
            metadata = self.parse_lecture_metadata(html, slug)
            paragraphs = self.parse_lecture_content(html)

            if not metadata:
                return None

            # Додати українські переклади метаданих
            metadata = self._translate_lecture_metadata(metadata)

            return {
                "metadata": metadata,
                "paragraphs": paragraphs,
                "sanskrit_terms": list(self.sanskrit_terms),
            }
        else:
            metadata = self.parse_letter_metadata(html, slug)
            content_en = self.parse_letter_content(html)

            if not metadata:
                return None

            # Додати українські переклади метаданих
            metadata = self._translate_letter_metadata(metadata)

            return {
                "metadata": metadata,
                "content_en": content_en,
                "sanskrit_terms": list(self.sanskrit_terms),
            }

    def _translate_lecture_metadata(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Додати українські переклади для метаданих лекції"""
        from lectures_importer import LECTURE_TYPE_TRANSLATIONS, LOCATION_TRANSLATIONS

        result = metadata.copy()

        # Тип лекції
        lecture_type = metadata.get("lecture_type", "Lecture")
        result["lecture_type_ua"] = LECTURE_TYPE_TRANSLATIONS.get(lecture_type, lecture_type)

        # Локація
        location = metadata.get("location_en", "")
        result["location_ua"] = LOCATION_TRANSLATIONS.get(location, location)

        # Заголовок - базова транслітерація
        result["title_ua"] = self._transliterate_title(metadata.get("title_en", ""))

        return result

    def _translate_letter_metadata(self, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """Додати українські переклади для метаданих листа"""
        from letters_importer import LOCATION_TRANSLATIONS

        result = metadata.copy()

        # Локація
        location = metadata.get("location_en", "")
        result["location_ua"] = LOCATION_TRANSLATIONS.get(location, location)

        # Отримувач - базова транслітерація
        result["recipient_ua"] = metadata.get("recipient_en", "")

        return result

    def _transliterate_title(self, title: str) -> str:
        """Транслітерація заголовка"""
        replacements = {
            "Bhagavad-gita": "Бгаґавад-ґіта",
            "Bhagavad-gītā": "Бгаґавад-ґіта",
            "Srimad-Bhagavatam": "Шрімад-Бгаґаватам",
            "Śrīmad-Bhāgavatam": "Шрімад-Бгаґаватам",
            "Caitanya-caritamrta": "Чайтанья-чарітамріта",
            "Sri Caitanya-caritāmṛta": "Шрі Чайтанья-чарітамріта",
            "Lecture": "Лекція",
            "Walk": "Прогулянка",
            "Conversation": "Розмова",
        }

        result = title
        for en, ua in replacements.items():
            result = result.replace(en, ua)

        return result

    def save_item(self, data: Dict[str, Any], slug: str):
        """Зберегти елемент в JSON"""
        output_path = Path(self.output_dir) / f"{slug}.json"
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"[SUCCESS] Saved: {output_path}")

    def load_progress(self) -> Optional[ImportProgress]:
        """Завантажити прогрес імпорту"""
        if not Path(self.progress_file).exists():
            return None

        try:
            with open(self.progress_file, "r", encoding="utf-8") as f:
                data = json.load(f)
            return ImportProgress.from_dict(data)
        except Exception as e:
            print(f"[WARN] Failed to load progress: {e}")
            return None

    def save_progress(self, progress: ImportProgress):
        """Зберегти прогрес імпорту"""
        progress.last_updated = datetime.now().isoformat()
        with open(self.progress_file, "w", encoding="utf-8") as f:
            json.dump(progress.to_dict(), f, ensure_ascii=False, indent=2)

    def run_import(
        self,
        limit: Optional[int] = None,
        resume: bool = False,
        max_pages: int = 100,
    ):
        """Запустити масовий імпорт"""
        print(f"\n{'='*60}")
        print(f"  Vedabase Bulk Importer - {self.content_type.upper()}")
        print(f"{'='*60}\n")

        # Завантажити або створити прогрес
        progress = None
        if resume:
            progress = self.load_progress()
            if progress:
                print(f"[INFO] Resuming from previous run...")
                print(f"[INFO] Already imported: {len(progress.imported_slugs)}")
                print(f"[INFO] Failed: {len(progress.failed_slugs)}")

        # Зібрати slug'и якщо це новий запуск
        if not progress:
            all_slugs = self.collect_all_slugs(max_pages=max_pages)

            if limit:
                all_slugs = all_slugs[:limit]

            progress = ImportProgress(
                content_type=self.content_type,
                total_slugs=len(all_slugs),
                imported_slugs=[],
                failed_slugs=[],
                last_updated=datetime.now().isoformat(),
            )

            # Зберегти список slug'ів
            slugs_file = Path(self.output_dir) / "all_slugs.json"
            with open(slugs_file, "w", encoding="utf-8") as f:
                json.dump(all_slugs, f, ensure_ascii=False, indent=2)
            print(f"[INFO] Saved slugs list to {slugs_file}")
        else:
            # Завантажити slug'и з файлу
            slugs_file = Path(self.output_dir) / "all_slugs.json"
            with open(slugs_file, "r", encoding="utf-8") as f:
                all_slugs = json.load(f)

        # Визначити що потрібно імпортувати
        already_done = set(progress.imported_slugs) | set(progress.failed_slugs)
        remaining = [s for s in all_slugs if s not in already_done]

        if limit:
            remaining = remaining[:limit]

        print(f"\n[INFO] Remaining items to import: {len(remaining)}")
        print(f"[INFO] Batch size: {self.batch_size}")
        print(f"[INFO] Delay between requests: {self.delay}s\n")

        # Імпорт батчами
        batch_count = 0
        for i, slug in enumerate(remaining, 1):
            print(f"\n[{i}/{len(remaining)}] Processing: {slug}")

            try:
                data = self.import_single_item(slug)

                if data:
                    self.save_item(data, slug)
                    progress.imported_slugs.append(slug)
                else:
                    print(f"[WARN] No data for {slug}")
                    progress.failed_slugs.append(slug)

            except Exception as e:
                print(f"[ERROR] Failed to import {slug}: {e}")
                progress.failed_slugs.append(slug)

            # Зберегти прогрес після кожного батчу
            batch_count += 1
            if batch_count >= self.batch_size:
                self.save_progress(progress)
                batch_count = 0
                print(f"\n[CHECKPOINT] Progress saved. Imported: {len(progress.imported_slugs)}, Failed: {len(progress.failed_slugs)}")

        # Фінальне збереження прогресу
        self.save_progress(progress)

        # Зберегти всі санскритські терміни
        terms_file = Path(self.output_dir) / "all_sanskrit_terms.json"
        with open(terms_file, "w", encoding="utf-8") as f:
            json.dump(sorted(list(self.sanskrit_terms)), f, ensure_ascii=False, indent=2)

        print(f"\n{'='*60}")
        print(f"  IMPORT COMPLETE")
        print(f"{'='*60}")
        print(f"  Total items: {progress.total_slugs}")
        print(f"  Imported: {len(progress.imported_slugs)}")
        print(f"  Failed: {len(progress.failed_slugs)}")
        print(f"  Sanskrit terms collected: {len(self.sanskrit_terms)}")
        print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(
        description="Масовий імпорт лекцій та листів з Vedabase.io"
    )
    parser.add_argument(
        "--type",
        type=str,
        choices=["lectures", "letters"],
        default="lectures",
        help="Тип контенту для імпорту (lectures або letters)",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Максимальна кількість елементів для імпорту",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=10,
        help="Розмір батчу для збереження прогресу",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=2.0,
        help="Затримка між запитами (секунди)",
    )
    parser.add_argument(
        "--resume",
        action="store_true",
        help="Продовжити попередній імпорт",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=100,
        help="Максимальна кількість сторінок пагінації",
    )

    args = parser.parse_args()

    importer = VedabaseBulkImporter(
        content_type=args.type,
        delay_seconds=args.delay,
        batch_size=args.batch_size,
    )

    importer.run_import(
        limit=args.limit,
        resume=args.resume,
        max_pages=args.max_pages,
    )


if __name__ == "__main__":
    main()
