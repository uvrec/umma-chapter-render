#!/usr/bin/env python3
"""
Імпорт Śrīmad-Bhāgavatam з EPUB → Supabase

Використання:
    python3 import_sb_epub.py --epub UK_SB_3_epub_r1.epub --canto 3 --chapters 17 --dry-run
    python3 import_sb_epub.py --epub UK_SB_3_epub_r1.epub --canto 3 --chapters 17-33
"""

import argparse
import re
import os
import sys
from dataclasses import dataclass
from typing import List, Optional, Tuple

import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
import requests
from supabase import create_client

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY', '')

# Vedabase API (з User-Agent як в cc_importer_final.py)
VEDABASE_SESSION = requests.Session()
VEDABASE_SESSION.headers.update({
    'User-Agent': 'vedavoice-sb-importer/1.0 (+https://vedavoice.org)'
})


@dataclass
class ParsedVerse:
    """Структура для вірша з EPUB"""
    verse_number: str
    sanskrit: str              # З EPUB (Devanagari)
    transliteration_ua: str    # З EPUB (IAST українською)
    synonyms_ua: str           # З EPUB ("Послівний переклад")
    translation_ua: str        # З EPUB ("Переклад")
    commentary_ua: str         # З EPUB ("Пояснення")
    transliteration_en: str    # З Vedabase (IAST)
    synonyms_en: str           # З Vedabase (IAST)
    translation_en: str        # З Vedabase
    commentary_en: str         # З Vedabase


@dataclass
class ParsedChapter:
    """Структура для глави"""
    canto_number: int
    chapter_number: int
    title_ua: str
    title_en: str
    verses: List[ParsedVerse]


# Словник українських назв глав (ASCII apostrophes; apostrophes normalized in extract function)
CHAPTER_NAMES_UA = {
    'перша': 1, 'друга': 2, 'третя': 3, 'четверта': 4, "п'ята": 5,
    'шоста': 6, 'сьома': 7, 'восьма': 8, "дев'ята": 9, 'десята': 10,
    'одинадцята': 11, 'дванадцята': 12, 'тринадцята': 13, 'чотирнадцята': 14,
    "п'ятнадцята": 15, 'шістнадцята': 16, 'сімнадцята': 17, 'вісімнадцята': 18,
    "дев'ятнадцята": 19, 'двадцята': 20,
    # Compound forms with "Ь" (двадцять)
    'двадцять перша': 21, 'двадцять друга': 22, 'двадцять третя': 23,
    'двадцять четверта': 24, "двадцять п'ята": 25, 'двадцять шоста': 26,
    'двадцять сьома': 27, 'двадцять восьма': 28, "двадцять дев'ята": 29,
    # Compound forms with "А" (двадцята) - as they appear in EPUB
    'двадцята перша': 21, 'двадцята друга': 22, 'двадцята третя': 23,
    'двадцята четверта': 24, "двадцята п'ята": 25, 'двадцята шоста': 26,
    'двадцята сьома': 27, 'двадцята восьма': 28, "двадцята дев'ята": 29,
    # 30+
    'тридцята': 30,
    'тридцять перша': 31, 'тридцять друга': 32, 'тридцять третя': 33,
    'тридцята перша': 31, 'тридцята друга': 32, 'тридцята третя': 33,
}


def extract_chapter_number(title: str) -> int:
    """Витягує номер глави з заголовка типу 'СІМНАДЦЯТА'"""
    normalized = title.lower().strip()

    # Normalize all apostrophe variants to ASCII apostrophe
    # U+2019 ('), U+0027 ('), U+02BC (ʼ) → '
    normalized = normalized.replace('\u2019', "'").replace('\u02BC', "'")

    # Sort by length DESC to match longer names first
    # Це важливо бо "вісімнадцята" містить "сімнадцята" як підрядок
    for name, num in sorted(CHAPTER_NAMES_UA.items(), key=lambda x: len(x[0]), reverse=True):
        if name in normalized:
            return num

    # Якщо не знайдено, спробувати числа
    match = re.search(r'\d+', title)
    return int(match.group()) if match else 0


def is_sanskrit_text(text: str) -> bool:
    """Визначає, чи містить текст Devanagari або Bengali"""
    return bool(re.search(r'[\u0900-\u097F\u0980-\u09FF।॥]', text))


def normalize_text(text: str) -> str:
    """Нормалізує текст: прибирає зайві пробіли, об'єднує рядки"""
    # Замінити multiple spaces на один
    text = re.sub(r'\s+', ' ', text)
    # Прибрати пробіли на початку/кінці
    text = text.strip()
    # Прибрати пробіли перед розділовими знаками
    text = re.sub(r'\s+([.,;:!?])', r'\1', text)
    return text


def parse_verse_from_html(verse_html: str, verse_number: str) -> ParsedVerse:
    """
    Парсить вірш з HTML блоку

    Структура EPUB:
    1. Sanskrit (Devanagari) - беремо
    2. Transliteration UA (IAST українською) - беремо
    3. "Послівний переклад" - synonyms UA - беремо
    4. "Переклад" - translation UA - беремо
    5. "Пояснення" - commentary UA - беремо
    """
    lines = [line.strip() for line in verse_html.split('\n') if line.strip()]

    sanskrit = ''
    transliteration_ua = ''
    synonyms_ua = ''
    translation_ua = ''
    commentary_ua = ''

    state = 'sanskrit'  # sanskrit -> translit -> synonyms -> translation -> commentary

    for line in lines:
        # Пропустити маркери віршів
        if re.match(r'^Вірш\s+\d+', line, re.I):
            continue

        # Маркери секцій
        if re.match(r'^Послівний переклад', line, re.I):
            state = 'synonyms'
            continue
        if re.match(r'^Переклад$', line, re.I):
            state = 'translation'
            continue
        if re.match(r'^Пояснення', line, re.I):
            state = 'commentary'
            continue

        # Збирання тексту
        if state == 'sanskrit' and is_sanskrit_text(line):
            sanskrit += (' ' if sanskrit else '') + line
        elif state == 'sanskrit' and not is_sanskrit_text(line):
            # Після Sanskrit йде transliteration
            state = 'translit'
            transliteration_ua += line
        elif state == 'translit':
            transliteration_ua += ' ' + line
        elif state == 'synonyms':
            synonyms_ua += (' ' if synonyms_ua else '') + line
        elif state == 'translation':
            translation_ua += (' ' if translation_ua else '') + line
        elif state == 'commentary':
            commentary_ua += (' ' if commentary_ua else '') + line

    # Нормалізація
    sanskrit = normalize_text(sanskrit)
    transliteration_ua = normalize_text(transliteration_ua)
    synonyms_ua = normalize_text(synonyms_ua)
    translation_ua = normalize_text(translation_ua)
    commentary_ua = normalize_text(commentary_ua)

    return ParsedVerse(
        verse_number=verse_number,
        sanskrit=sanskrit,
        transliteration_ua=transliteration_ua,
        synonyms_ua=synonyms_ua,
        translation_ua=translation_ua,
        commentary_ua=commentary_ua,
        transliteration_en='',  # Буде з Vedabase
        synonyms_en='',         # Буде з Vedabase
        translation_en='',      # Буде з Vedabase
        commentary_en='',       # Буде з Vedabase
    )


def parse_chapter_from_epub(book: epub.EpubBook, chapter_file: str, canto_number: int) -> Optional[ParsedChapter]:
    """Парсить одну главу з EPUB"""
    # Знайти документ
    item = None
    for doc in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        if doc.file_name == chapter_file:
            item = doc
            break

    if not item:
        print(f"❌ Chapter file not found: {chapter_file}")
        return None

    # Розбір HTML
    soup = BeautifulSoup(item.get_content(), 'html.parser')
    text = soup.get_text()

    # Знайти заголовок глави (допускаємо всі символи до кінця рядка)
    title_match = re.search(r'глава\s+(.+?)(?:\n|$)', text, re.I)
    if not title_match:
        print(f"❌ Chapter title not found in {chapter_file}")
        return None

    title_ua = title_match.group(1).strip().upper()
    chapter_number = extract_chapter_number(title_ua)

    print(f"📖 Found chapter: {chapter_number} - {title_ua}")

    # Розбити на вірші
    verse_pattern = re.compile(r'Вірш\s+(\d+(?:\s*[-–—]\s*\d+)?)', re.I)
    verse_matches = list(verse_pattern.finditer(text))

    verses = []
    for i, match in enumerate(verse_matches):
        verse_number = match.group(1).replace(' ', '')  # "22-23" або "1"
        start_pos = match.end()
        end_pos = verse_matches[i + 1].start() if i < len(verse_matches) - 1 else len(text)

        verse_html = text[start_pos:end_pos]

        try:
            verse = parse_verse_from_html(verse_html, verse_number)
            verses.append(verse)
            print(f"✅ Parsed verse {verse_number}")
        except Exception as e:
            print(f"❌ Failed to parse verse {verse_number}: {e}")

    return ParsedChapter(
        canto_number=canto_number,
        chapter_number=chapter_number,
        title_ua=title_ua,
        title_en='',  # Буде з Vedabase
        verses=verses,
    )


def fetch_vedabase_verse(canto: int, chapter: int, verse: str) -> Optional[dict]:
    """Отримує дані вірша з Vedabase API"""
    try:
        url = f"https://vedabase.io/en/library/sb/{canto}/{chapter}/{verse}/?format=json"
        response = VEDABASE_SESSION.get(url, timeout=10)

        if response.status_code == 200:
            data = response.json()
            return {
                'transliteration_en': data.get('transliteration', ''),
                'synonyms_en': data.get('synonyms', ''),
                'translation_en': data.get('translation', ''),
                'commentary_en': data.get('purport', ''),
                'title_en': data.get('chapter_title', ''),
            }
        else:
            print(f"  ⚠️  Vedabase returned {response.status_code} for {canto}.{chapter}.{verse}")
            return None
    except Exception as e:
        print(f"  ❌ Error fetching from Vedabase: {e}")
        return None


def enrich_with_vedabase(chapters: List[ParsedChapter], skip_vedabase: bool = False) -> None:
    """Додає англійські дані з Vedabase"""
    if skip_vedabase:
        print("⏭️  Skipping Vedabase enrichment")
        return

    print("\n🌐 Fetching English data from Vedabase...")

    for chapter in chapters:
        print(f"  📖 Chapter {chapter.chapter_number}:")

        for verse in chapter.verses:
            # Обробка composite verses (e.g., "22-23")
            verse_nums = verse.verse_number.split('-')
            verse_num = verse_nums[0]  # Беремо перший номер

            print(f"    🔄 Fetching verse {verse.verse_number}...", end=' ')

            vedabase_data = fetch_vedabase_verse(
                chapter.canto_number,
                chapter.chapter_number,
                verse_num
            )

            if vedabase_data:
                verse.transliteration_en = vedabase_data['transliteration_en']
                verse.synonyms_en = vedabase_data['synonyms_en']
                verse.translation_en = vedabase_data['translation_en']
                verse.commentary_en = vedabase_data['commentary_en']

                if not chapter.title_en and vedabase_data['title_en']:
                    chapter.title_en = vedabase_data['title_en']

                print("✅")
            else:
                print("❌")


def save_to_supabase(chapters: List[ParsedChapter], dry_run: bool = False) -> None:
    """Зберігає глави та вірші в Supabase"""
    if dry_run:
        print("\n🔍 Dry run - skipping database save")
        return

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables")
        return

    print("\n💾 Saving to Supabase...")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    for chapter in chapters:
        print(f"  📖 Saving chapter {chapter.chapter_number}...")

        # TODO: Implement Supabase save logic
        # 1. Get or create canto
        # 2. Get or create chapter
        # 3. Insert verses

        print(f"  ✅ Saved chapter {chapter.chapter_number}")


def print_summary(chapters: List[ParsedChapter]) -> None:
    """Виводить підсумок парсингу"""
    print("\n" + "="*60)
    print("📊 Import Summary:")
    print("="*60)

    for chapter in chapters:
        print(f"\n📖 Chapter {chapter.chapter_number}: {chapter.title_ua}")
        if chapter.title_en:
            print(f"   EN: {chapter.title_en}")
        print(f"   Verses: {len(chapter.verses)}")

        for verse in chapter.verses[:3]:  # Show first 3 verses
            print(f"   • {verse.verse_number}: {verse.translation_ua[:100]}...")


def parse_chapter_range(chapters_arg: str) -> Tuple[int, int]:
    """Парсить діапазон глав з аргумента: '17' або '17-33'"""
    if '-' in chapters_arg:
        start, end = chapters_arg.split('-')
        return int(start), int(end)
    else:
        num = int(chapters_arg)
        return num, num


def find_chapter_file(book: epub.EpubBook, chapter_number: int) -> Optional[str]:
    """Знаходить XHTML файл глави за її номером"""
    # Формат файлів: UKS317XT.xhtml для глави 17
    # UKS3 + chapter_number (2 digits) + XT.xhtml
    filename = f"UKS3{chapter_number:02d}XT.xhtml"

    # Перевірити, чи існує файл
    for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
        if item.file_name == filename:
            return filename

    return None


def main():
    parser = argparse.ArgumentParser(
        description='Import Śrīmad-Bhāgavatam from EPUB to Supabase'
    )
    parser.add_argument('--epub', required=True, help='Path to EPUB file')
    parser.add_argument('--canto', type=int, required=True, help='Canto number (e.g., 3)')
    parser.add_argument('--chapters', required=True, help='Chapter number or range (e.g., 17 or 17-33)')
    parser.add_argument('--dry-run', action='store_true', help='Parse but do not save to database')
    parser.add_argument('--skip-vedabase', action='store_true', help='Skip fetching English data from Vedabase')

    args = parser.parse_args()

    # Читання EPUB
    print(f"📚 Reading EPUB: {args.epub}")
    try:
        book = epub.read_epub(args.epub)
    except Exception as e:
        print(f"❌ Failed to read EPUB: {e}")
        sys.exit(1)

    # Парсинг діапазону глав
    start_chapter, end_chapter = parse_chapter_range(args.chapters)
    print(f"🔍 Parsing chapters {start_chapter}-{end_chapter} from canto {args.canto}...")

    # Парсинг глав
    chapters = []
    for chapter_num in range(start_chapter, end_chapter + 1):
        chapter_file = find_chapter_file(book, chapter_num)

        if not chapter_file:
            print(f"⚠️  Chapter {chapter_num} not found in EPUB")
            continue

        chapter = parse_chapter_from_epub(book, chapter_file, args.canto)
        if chapter:
            chapters.append(chapter)

    if not chapters:
        print("❌ No chapters found")
        sys.exit(1)

    print(f"\n✅ Found {len(chapters)} chapters")

    # Збагачення з Vedabase
    enrich_with_vedabase(chapters, args.skip_vedabase)

    # Збереження в БД
    save_to_supabase(chapters, args.dry_run)

    # Підсумок
    print_summary(chapters)

    print("\n✅ Import complete!")


if __name__ == '__main__':
    main()
