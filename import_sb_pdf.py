#!/usr/bin/env python3
"""
Імпорт Шрімад-Бхаґаватам Пісня 3 з PDF (UA) + Vedabase (EN)

Використання:
    python3 import_sb_pdf.py --pdf UK_SB_3_2_2024_text_r14.pdf --canto 3 --chapters 17-33

Формат PDF:
    ГЛАВА ВІСІМНАДЦЯТА

    ВІРШ 1
    देवनागरी текст
    IAST transliteration (ПРОПУСКАЄМО - буде з Vedabase)
    Ukrainian translit (ПРОПУСКАЄМО - генерується)
    слово – переклад; слово2 – переклад2 (ПРОПУСКАЄМО - буде з Vedabase)
    Український переклад віршу.

    ПОЯСНЕННЯ: Коментар...
"""

import re
import sys
import os
import argparse
import time
from typing import List, Dict, Optional
from dataclasses import dataclass
from pathlib import Path

# PDF reading - використовуємо pdfplumber замість PyPDF2 для правильних пробілів
try:
    import pdfplumber
except ImportError:
    print("❌ pdfplumber not installed. Run: pip install pdfplumber")
    sys.exit(1)

try:
    import requests
except ImportError:
    print("❌ requests not installed. Run: pip install requests")
    sys.exit(1)

# Supabase client
try:
    from supabase import create_client, Client
except ImportError:
    print("❌ supabase-py not installed. Run: pip install supabase")
    sys.exit(1)

# Normalization utilities (reuse from existing tools)
project_root = Path(__file__).parent
tools_path = project_root / "tools"
if str(tools_path) not in sys.path:
    sys.path.insert(0, str(tools_path))

try:
    from pre_import_normalizer import normalize_verse, normalize_verse_field
except ImportError:
    print("❌ Cannot import from pre_import_normalizer.py")
    print(f"Make sure the file exists at: {tools_path / 'pre_import_normalizer.py'}")
    sys.exit(1)

# ============================================================================
# Ukrainian chapter names
# ============================================================================

CHAPTER_NAMES_UA = {
    'перша': 1, 'друга': 2, 'третя': 3, 'четверта': 4, "п'ята": 5,
    'шоста': 6, 'сьома': 7, 'восьма': 8, "дев'ята": 9, 'десята': 10,
    'одинадцята': 11, 'дванадцята': 12, 'тринадцята': 13, 'чотирнадцята': 14,
    "п'ятнадцята": 15, 'шістнадцята': 16, 'сімнадцята': 17, 'вісімнадцята': 18,
    "дев'ятнадцята": 19, 'двадцята': 20, 'двадцять перша': 21, 'двадцять друга': 22,
    'двадцять третя': 23, 'двадцять четверта': 24, "двадцять п'ята": 25,
    'двадцять шоста': 26, 'двадцять сьома': 27, 'двадцять восьма': 28,
    "двадцять дев'ята": 29, 'тридцята': 30, 'тридцять перша': 31,
    'тридцять друга': 32, 'тридцять третя': 33
}

# ============================================================================
# Data structures
# ============================================================================

@dataclass
class Verse:
    """Parsed verse - PDF дає Sanskrit, Translation_UA, Commentary_UA"""
    verse_number: str
    sanskrit: str  # З PDF (Devanagari)
    transliteration_en: str  # З Vedabase (IAST)
    transliteration_ua: str  # Генерується з transliteration_en
    synonyms_en: str  # З Vedabase (IAST)
    synonyms_ua: str  # Генерується з synonyms_en
    translation_ua: str  # З PDF
    translation_en: str  # З Vedabase
    commentary_ua: str  # З PDF
    commentary_en: str  # З Vedabase

@dataclass
class Chapter:
    """Parsed chapter"""
    canto_number: int
    chapter_number: int
    title_ua: str
    title_en: str
    verses: List[Verse]

# ============================================================================
# PDF Parsing
# ============================================================================

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract all text from PDF file using pdfplumber"""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text = ''
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + '\n'
            return text
    except Exception as e:
        print(f"❌ PDF extraction failed: {e}")
        return ''

def extract_chapter_number(title: str) -> int:
    """Extract chapter number from Ukrainian title"""
    normalized = title.lower().strip()

    # Check Ukrainian names
    for name, num in CHAPTER_NAMES_UA.items():
        if name in normalized:
            return num

    # Try digit
    match = re.search(r'\d+', title)
    return int(match.group(0)) if match else 0

def is_sanskrit_text(text: str) -> bool:
    """Check if text contains Devanagari or Bengali characters"""
    return bool(re.search(r'[\u0900-\u097F\u0980-\u09FF।॥]', text))

def is_iast_text(text: str) -> bool:
    """Check if text is IAST transliteration (Latin with diacritics)"""
    return bool(re.search(r'[a-zA-Z]', text)) and bool(re.search(r'[āīūṛṝḷḹēōṃḥśṣṇṭḍñṅ]', text))

def is_ukrainian_translit(text: str) -> bool:
    """Check if text is Ukrainian transliteration (Cyrillic with diacritics)"""
    return bool(re.search(r'[а-яґєії]', text, re.I)) and bool(re.search(r'[а̄ӯīх̣м̇н̣т̣д̣ш́н̃н̇]', text, re.I))

def split_into_verses(text: str) -> List[Dict[str, str]]:
    """Split text into verse blocks"""
    verses = []

    # Find verse headers: "ВІРШ 1" or "ВІРШІ 22-23"
    verse_regex = re.compile(r'ВІРШ[ІІI]?\s+(\d+(?:\s*[-–—]\s*\d+)?)', re.I)

    matches = list(verse_regex.finditer(text))

    for i, match in enumerate(matches):
        verse_number = re.sub(r'\s+', '', match.group(1))  # "22-23" or "1"
        start_pos = match.end()
        end_pos = matches[i + 1].start() if i < len(matches) - 1 else len(text)

        content = text[start_pos:end_pos].strip()
        verses.append({'number': verse_number, 'content': content})

    return verses

def parse_verse_from_pdf(number: str, content: str) -> Verse:
    """
    Parse single verse from PDF content
    ВАЖЛИВО: Витягуємо тільки Sanskrit, Translation_UA та Commentary_UA
    Все інше буде з Vedabase + нормалізація

    Структура PDF:
    1. Sanskrit (Devanagari/Bengali) - БЕРЕМО
    2. IAST transliteration - пропускаємо
    3. UA transliteration - пропускаємо
    4. Synonyms (мають " – ") - пропускаємо
    5. Translation (починається з великої літери) - БЕРЕМО
    6. ПОЯСНЕННЯ: Commentary - БЕРЕМО
    """
    lines = [l.strip() for l in content.split('\n') if l.strip()]

    sanskrit = ''
    translation_ua = ''
    commentary_ua = ''

    in_sanskrit = True
    in_translation = False
    in_commentary = False

    for line in lines:
        # Commentary marker (найвищий пріоритет)
        if re.match(r'^ПОЯСНЕННЯ\s*:', line, re.I):
            in_commentary = True
            in_translation = False
            in_sanskrit = False
            continue

        # Sanskrit (Devanagari/Bengali)
        if in_sanskrit and is_sanskrit_text(line):
            sanskrit += (' ' if sanskrit else '') + line
            continue

        # Після Sanskrit переходимо до пошуку перекладу
        if in_sanskrit and not is_sanskrit_text(line):
            in_sanskrit = False

        # Переклад: рядок починається з великої літери, БЕЗ " – " на початку
        # і це НЕ синоніми (синоніми містять " – ")
        if not in_translation and not in_commentary and re.match(r'^[А-ЯҐЄІЇ]', line):
            # Перевірка: це не синоніми (синоніми мають " – " в першій половині рядка)
            first_half = line[:len(line)//2] if len(line) > 10 else line
            if ' – ' not in first_half:
                in_translation = True

        # Збирання тексту
        if in_translation:
            translation_ua += (' ' if translation_ua else '') + line
        elif in_commentary:
            commentary_ua += (' ' if commentary_ua else '') + line

    return Verse(
        verse_number=number,
        sanskrit=sanskrit,
        transliteration_en='',  # Буде з Vedabase
        transliteration_ua='',  # Буде згенеровано
        synonyms_en='',  # Буде з Vedabase
        synonyms_ua='',  # Буде згенеровано
        translation_ua=translation_ua,
        translation_en='',  # Буде з Vedabase
        commentary_ua=commentary_ua,
        commentary_en=''  # Буде з Vedabase
    )

def parse_chapter_from_pdf(pdf_text: str, canto_number: int, chapter_filter: Optional[int] = None) -> Optional[Chapter]:
    """Parse specific chapter from PDF text"""
    # Find chapter header
    chapter_regex = re.compile(r'ГЛАВА\s+([А-ЯҐЄІЇ\'\s]+)', re.I)
    matches = list(chapter_regex.finditer(pdf_text))

    if not matches:
        print('❌ No chapter headers found')
        return None

    for i, match in enumerate(matches):
        chapter_title = match.group(1).strip()
        chapter_number = extract_chapter_number(chapter_title)

        # Skip if filtering and doesn't match
        if chapter_filter and chapter_number != chapter_filter:
            continue

        if not chapter_number:
            print(f'⚠️ Could not extract chapter number from: {chapter_title}')
            continue

        print(f'\n📖 Found chapter: {chapter_number} - {chapter_title}')

        # Extract chapter text
        start_pos = match.start()
        end_pos = matches[i + 1].start() if i < len(matches) - 1 else len(pdf_text)
        chapter_text = pdf_text[start_pos:end_pos]

        # Split into verses
        verse_blocks = split_into_verses(chapter_text)
        print(f'📝 Found {len(verse_blocks)} verses')

        # Parse each verse
        verses = []
        for block in verse_blocks:
            try:
                verse = parse_verse_from_pdf(block['number'], block['content'])
                verses.append(verse)
                print(f"✅ Parsed verse {block['number']}")
            except Exception as e:
                print(f"❌ Failed to parse verse {block['number']}: {e}")

        return Chapter(
            canto_number=canto_number,
            chapter_number=chapter_number,
            title_ua=chapter_title,
            title_en='',  # Will be filled from Vedabase
            verses=verses
        )

    return None

def parse_all_chapters_from_pdf(pdf_text: str, canto_number: int, chapter_range: Optional[tuple] = None) -> List[Chapter]:
    """Parse all chapters from PDF"""
    chapters = []

    # Split by chapter headers
    chapter_regex = re.compile(r'ГЛАВА\s+[А-ЯҐЄІЇ\'\s]+', re.I)
    matches = list(chapter_regex.finditer(pdf_text))

    for i, match in enumerate(matches):
        chapter_title = match.group(0).replace('ГЛАВА', '').strip()
        chapter_number = extract_chapter_number(chapter_title)

        # Filter by range if specified
        if chapter_range:
            start, end = chapter_range
            if not (start <= chapter_number <= end):
                continue

        start_pos = match.start()
        end_pos = matches[i + 1].start() if i < len(matches) - 1 else len(pdf_text)

        chapter_text = pdf_text[start_pos:end_pos]
        chapter = parse_chapter_from_pdf(chapter_text, canto_number)

        if chapter:
            chapters.append(chapter)

    return chapters

# ============================================================================
# Vedabase Integration
# ============================================================================

def fetch_vedabase_verse(canto: int, chapter: int, verse: str) -> Dict[str, str]:
    """Fetch English data from Vedabase"""
    # Handle compound verses like "22-23"
    if '-' in verse:
        verse_num = verse.split('-')[0]  # Use first number
    else:
        verse_num = verse

    url = f"https://vedabase.io/en/library/sb/{canto}/{chapter}/{verse_num}/"

    try:
        response = requests.get(url, timeout=30)
        if response.status_code != 200:
            print(f"⚠️ Vedabase returned {response.status_code} for verse {verse}")
            return {}

        html = response.text

        # Extract data using regex (simple approach)
        result = {}

        # IAST transliteration (look for lines with diacritics)
        iast_pattern = r'<p[^>]*class="[^"]*verse-text[^"]*"[^>]*>([^<]+)</p>'
        iast_match = re.search(iast_pattern, html)
        if iast_match:
            iast_text = iast_match.group(1).strip()
            # Remove HTML entities
            iast_text = re.sub(r'&nbsp;', ' ', iast_text)
            result['transliteration_en'] = iast_text

        # Synonyms
        syn_pattern = r'<h3[^>]*>SYNONYMS</h3>\s*<p[^>]*>([^<]+(?:<[^>]+>[^<]*</[^>]+>[^<]*)*)</p>'
        syn_match = re.search(syn_pattern, html, re.I | re.S)
        if syn_match:
            syn_text = syn_match.group(1)
            syn_text = re.sub(r'<[^>]+>', ' ', syn_text)  # Remove HTML tags
            syn_text = re.sub(r'&nbsp;', ' ', syn_text)
            syn_text = re.sub(r'\s+', ' ', syn_text).strip()
            result['synonyms_en'] = syn_text

        # Translation
        trans_pattern = r'<h3[^>]*>TRANSLATION</h3>\s*<p[^>]*>((?:[^<]|<em>|</em>|<i>|</i>)+)</p>'
        trans_match = re.search(trans_pattern, html, re.I | re.S)
        if trans_match:
            trans_text = trans_match.group(1)
            trans_text = re.sub(r'<[^>]+>', '', trans_text)  # Remove HTML tags
            trans_text = re.sub(r'&nbsp;', ' ', trans_text)
            trans_text = re.sub(r'\s+', ' ', trans_text).strip()
            result['translation_en'] = trans_text

        # Purport/Commentary
        purport_pattern = r'<h3[^>]*>PURPORT</h3>(.*?)(?:<h3|<div class="verse-nav|$)'
        purport_match = re.search(purport_pattern, html, re.I | re.S)
        if purport_match:
            purport_text = purport_match.group(1)
            # Remove all HTML tags
            purport_text = re.sub(r'<[^>]+>', ' ', purport_text)
            purport_text = re.sub(r'&nbsp;', ' ', purport_text)
            # Remove multiple spaces and newlines
            purport_text = re.sub(r'\s+', ' ', purport_text).strip()
            # Remove footer artifacts
            purport_text = re.split(r'(?:Bhaktivedanta|VedaBase|vedabase\.io|© \d{4})', purport_text, flags=re.I)[0].strip()
            result['commentary_en'] = purport_text

        return result

    except Exception as e:
        print(f"❌ Error fetching Vedabase verse {verse}: {e}")
        return {}

# ============================================================================
# Database Integration
# ============================================================================

def get_supabase_client() -> Client:
    """Create Supabase client"""
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_SERVICE_KEY')  # Use service key for imports

    if not url or not key:
        print("❌ SUPABASE_URL or SUPABASE_SERVICE_KEY not set in environment")
        sys.exit(1)

    return create_client(url, key)

def save_chapter_to_db(supabase: Client, chapter: Chapter, book_slug: str = 'bhagavatam'):
    """Save chapter and verses to Supabase"""
    print(f"\n💾 Saving chapter {chapter.chapter_number} to database...")

    # Get book ID
    book_result = supabase.table('books').select('id').eq('slug', book_slug).execute()
    if not book_result.data:
        print(f"❌ Book '{book_slug}' not found in database")
        return

    book_db_id = book_result.data[0]['id']

    # Get or create canto
    canto_result = supabase.table('cantos')\
        .select('id')\
        .eq('book_id', book_db_id)\
        .eq('canto_number', chapter.canto_number)\
        .execute()

    if canto_result.data:
        canto_id = canto_result.data[0]['id']
    else:
        # Create canto
        canto_insert = supabase.table('cantos').insert({
            'book_id': book_db_id,
            'canto_number': chapter.canto_number,
            'title_ua': f'Пісня {chapter.canto_number}',
            'title_en': f'Canto {chapter.canto_number}'
        }).execute()
        canto_id = canto_insert.data[0]['id']
        print(f"✅ Created canto {chapter.canto_number}")

    # Create or update chapter
    chapter_data = {
        'book_id': book_db_id,
        'canto_id': canto_id,
        'chapter_number': chapter.chapter_number,
        'chapter_type': 'verses',
        'title_ua': chapter.title_ua,
        'title_en': chapter.title_en or f'Chapter {chapter.chapter_number}'
    }

    chapter_result = supabase.table('chapters')\
        .select('id')\
        .eq('canto_id', canto_id)\
        .eq('chapter_number', chapter.chapter_number)\
        .execute()

    if chapter_result.data:
        chapter_id = chapter_result.data[0]['id']
        supabase.table('chapters').update(chapter_data).eq('id', chapter_id).execute()
        print(f"✅ Updated chapter {chapter.chapter_number}")
    else:
        chapter_insert = supabase.table('chapters').insert(chapter_data).execute()
        chapter_id = chapter_insert.data[0]['id']
        print(f"✅ Created chapter {chapter.chapter_number}")

    # Insert verses
    print(f"📝 Inserting {len(chapter.verses)} verses...")
    for verse in chapter.verses:
        # Prepare verse data for normalization
        verse_dict = {
            'sanskrit': verse.sanskrit,
            'transliteration_en': verse.transliteration_en,
            'transliteration_ua': verse.transliteration_ua,
            'synonyms_en': verse.synonyms_en,
            'synonyms_ua': verse.synonyms_ua,
            'translation_ua': verse.translation_ua,
            'translation_en': verse.translation_en,
            'commentary_ua': verse.commentary_ua,
            'commentary_en': verse.commentary_en
        }

        # Normalize all fields
        normalized = normalize_verse(verse_dict)

        verse_data = {
            'chapter_id': chapter_id,
            'verse_number': verse.verse_number,
            'sanskrit': normalized.get('sanskrit', ''),
            'transliteration_en': normalized.get('transliteration_en', ''),
            'transliteration_ua': normalized.get('transliteration_ua', ''),
            'synonyms_en': normalized.get('synonyms_en', ''),
            'synonyms_ua': normalized.get('synonyms_ua', ''),
            'translation_ua': normalized.get('translation_ua', ''),
            'translation_en': normalized.get('translation_en', ''),
            'commentary_ua': normalized.get('commentary_ua', ''),
            'commentary_en': normalized.get('commentary_en', '')
        }

        # Check if verse exists
        existing = supabase.table('verses')\
            .select('id')\
            .eq('chapter_id', chapter_id)\
            .eq('verse_number', verse.verse_number)\
            .execute()

        if existing.data:
            supabase.table('verses').update(verse_data).eq('id', existing.data[0]['id']).execute()
            print(f"  ✅ Updated verse {verse.verse_number}")
        else:
            supabase.table('verses').insert(verse_data).execute()
            print(f"  ✅ Inserted verse {verse.verse_number}")

    print(f"✅ Chapter {chapter.chapter_number} saved successfully!")

# ============================================================================
# Main
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description='Import Śrīmad-Bhāgavatam from PDF + Vedabase')
    parser.add_argument('--pdf', required=True, help='Path to PDF file')
    parser.add_argument('--canto', type=int, required=True, help='Canto number (e.g., 3)')
    parser.add_argument('--chapters', help='Chapter number or range (e.g., "17" or "17-33")')
    parser.add_argument('--skip-vedabase', action='store_true', help='Skip fetching from Vedabase')
    parser.add_argument('--dry-run', action='store_true', help='Parse but do not save to database')

    args = parser.parse_args()

    # Read PDF
    print(f"\n📄 Reading PDF: {args.pdf}")
    pdf_text = extract_text_from_pdf(args.pdf)

    if not pdf_text:
        print("❌ Failed to extract text from PDF")
        sys.exit(1)

    print(f"✅ Extracted {len(pdf_text)} characters")

    # Determine chapter range
    chapter_range = None
    if args.chapters:
        if '-' in args.chapters:
            start, end = map(int, args.chapters.split('-'))
            chapter_range = (start, end)
            print(f"📋 Will import chapters {start} to {end}")
        else:
            chapter_num = int(args.chapters)
            chapter_range = (chapter_num, chapter_num)
            print(f"📋 Will import chapter {chapter_num}")

    # Parse chapters
    print(f"\n🔍 Parsing chapters from canto {args.canto}...")
    chapters = parse_all_chapters_from_pdf(pdf_text, args.canto, chapter_range)

    if not chapters:
        print("❌ No chapters found in PDF")
        sys.exit(1)

    print(f"\n✅ Found {len(chapters)} chapters: {[c.chapter_number for c in chapters]}")

    # Fetch from Vedabase
    if not args.skip_vedabase:
        print(f"\n🌐 Fetching English data from Vedabase...")
        for chapter in chapters:
            print(f"\n  📖 Chapter {chapter.chapter_number}:")
            for verse in chapter.verses:
                print(f"    🔄 Fetching verse {verse.verse_number}...", end=' ')
                vedabase_data = fetch_vedabase_verse(args.canto, chapter.chapter_number, verse.verse_number)

                # Merge data (prefer PDF Sanskrit over Vedabase if available)
                if not verse.sanskrit and 'sanskrit' in vedabase_data:
                    verse.sanskrit = vedabase_data['sanskrit']

                # English data from Vedabase
                verse.transliteration_en = vedabase_data.get('transliteration_en', '')
                verse.synonyms_en = vedabase_data.get('synonyms_en', '')
                verse.translation_en = vedabase_data.get('translation_en', '')
                verse.commentary_en = vedabase_data.get('commentary_en', '')

                # Note: transliteration_ua and synonyms_ua will be generated by normalize_verse()

                print(f"✅")

                # Rate limiting - wait 1 second between requests
                time.sleep(1)

    # Save to database
    if not args.dry_run:
        print(f"\n💾 Saving to database...")
        supabase = get_supabase_client()

        for chapter in chapters:
            save_chapter_to_db(supabase, chapter)
    else:
        print(f"\n🔍 Dry run - skipping database save")

        # Print summary
        for chapter in chapters:
            print(f"\n📖 Chapter {chapter.chapter_number}: {chapter.title_ua}")
            print(f"   Verses: {len(chapter.verses)}")
            for verse in chapter.verses[:3]:  # First 3 verses
                preview = verse.translation_ua[:60] + '...' if len(verse.translation_ua) > 60 else verse.translation_ua
                print(f"   • {verse.verse_number}: {preview}")

    print(f"\n✅ Import complete!")

if __name__ == '__main__':
    main()
