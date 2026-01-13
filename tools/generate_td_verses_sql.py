#!/usr/bin/env python3
"""
Generate SQL migrations for Transcendental Diary using verses structure.

Each date entry becomes a verse in the verses table:
- verse_number = date string (e.g., "November 26th, 1975")
- verse_number_sort = sequential number for ordering
- event_date = parsed date (YYYY-MM-DD) for indexing
- commentary_en = content for that date
- All other fields (sanskrit, transliteration, synonyms, translation) = empty

chapter_type = 'verses' (same as Srimad-Bhagavatam)
"""

import json
import re
from datetime import datetime
from pathlib import Path

DATA_PATH = Path(__file__).parent.parent / "src" / "data" / "transcendental-diary-verses.json"
SQL_OUTPUT_DIR = Path(__file__).parent.parent / "supabase" / "migrations"

BOOK_SLUG = "td"

# Max content size per SQL file (~60KB to be safe)
MAX_CONTENT_SIZE = 50000


def escape_sql(text: str) -> str:
    """Escape text for SQL."""
    if not text:
        return ""
    return text.replace("'", "''").replace("\\", "\\\\")


def parse_date(date_str: str) -> str:
    """Parse date string like 'November 26th, 1975' to 'YYYY-MM-DD' or NULL."""
    if not date_str or date_str == "Introduction":
        return "NULL"

    # Remove ordinal suffixes
    clean = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', date_str)

    # Try parsing
    for fmt in ['%B %d, %Y', '%B %d %Y']:
        try:
            dt = datetime.strptime(clean, fmt)
            return f"'{dt.strftime('%Y-%m-%d')}'"
        except ValueError:
            continue

    return "NULL"


def generate_intro_sql(parsed_data: dict) -> str:
    """Generate SQL for intro_chapters."""
    sql_parts = []
    sql_parts.append(f"""-- ============================================
-- Transcendental Diary - Intro Chapters
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = '{BOOK_SLUG}';

  IF v_book_id IS NULL THEN
    RAISE EXCEPTION 'Book "{BOOK_SLUG}" not found';
  END IF;
""")

    for intro in parsed_data.get('intro_pages', []):
        slug = intro['slug']
        title_en = escape_sql(intro['title_en'])
        content_en = escape_sql(intro['content_en'])
        display_order = intro['display_order']

        sql_parts.append(f"""
  INSERT INTO public.intro_chapters (book_id, slug, title_en, title_ua, content_en, content_ua, display_order)
  VALUES (v_book_id, '{slug}', E'{title_en}', '', E'{content_en}', '', {display_order})
  ON CONFLICT (book_id, slug) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    content_en = EXCLUDED.content_en,
    display_order = EXCLUDED.display_order;
""")

    sql_parts.append("""
END $$;
""")
    return '\n'.join(sql_parts)


def generate_chapter_sql(vol_num: int, chapter: dict) -> str:
    """Generate SQL for chapter header (without verses)."""
    ch_num = chapter['chapter_number']
    title_en = escape_sql(chapter['title_en'])
    subtitle = escape_sql(chapter.get('subtitle', ''))

    full_title = f"{title_en}: {subtitle}" if subtitle else title_en

    return f"""-- ============================================
-- TD Volume {vol_num}, Chapter {ch_num}: {full_title}
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = '{BOOK_SLUG}';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = {vol_num};

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, {ch_num}, E'{escape_sql(full_title)}', '', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = 'verses';

END $$;
"""


def generate_verses_sql(vol_num: int, ch_num: int, verses: list, start_idx: int = 0) -> str:
    """Generate SQL for verses."""
    sql_parts = []
    sql_parts.append(f"""-- ============================================
-- TD Volume {vol_num}, Chapter {ch_num} - Verses
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = '{BOOK_SLUG}';
  SELECT id INTO v_canto_id FROM public.cantos WHERE book_id = v_book_id AND canto_number = {vol_num};
  SELECT id INTO v_chapter_id FROM public.chapters WHERE canto_id = v_canto_id AND chapter_number = {ch_num};
""")

    for idx, verse in enumerate(verses):
        verse_num = escape_sql(verse['verse_number'])
        verse_sort = start_idx + idx + 1
        commentary = escape_sql(verse['commentary_en'])
        event_date = parse_date(verse['verse_number'])

        sql_parts.append(f"""
  -- {verse_num}
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua, transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua, translation_en, translation_ua,
    commentary_en, commentary_ua, event_date, is_published
  ) VALUES (
    v_chapter_id, E'{verse_num}', {verse_sort},
    '', '', '', '',
    '', '', '', '',
    E'{commentary}', '', {event_date}, true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    verse_number_sort = EXCLUDED.verse_number_sort,
    commentary_en = EXCLUDED.commentary_en,
    event_date = EXCLUDED.event_date;
""")

    sql_parts.append("""
END $$;
""")
    return '\n'.join(sql_parts)


def split_verses_by_size(verses: list, max_size: int) -> list:
    """Split verses into chunks that fit within size limit."""
    chunks = []
    current_chunk = []
    current_size = 0

    for verse in verses:
        verse_size = len(verse['commentary_en']) + 500  # overhead for SQL

        if current_size + verse_size > max_size and current_chunk:
            chunks.append(current_chunk)
            current_chunk = [verse]
            current_size = verse_size
        else:
            current_chunk.append(verse)
            current_size += verse_size

    if current_chunk:
        chunks.append(current_chunk)

    return chunks


def main():
    print("=" * 60)
    print("Generating TD SQL (Verses Structure)")
    print("=" * 60)

    with open(DATA_PATH, 'r') as f:
        parsed_data = json.load(f)

    # Remove old TD migrations
    for old_file in SQL_OUTPUT_DIR.glob("20260113*_td_*.sql"):
        old_file.unlink()
        print(f"🗑️  Removed: {old_file.name}")

    file_seq = 1

    # 1. Intro chapters
    intro_sql = generate_intro_sql(parsed_data)
    intro_path = SQL_OUTPUT_DIR / f"20260113120{file_seq:03d}_td_intro.sql"
    with open(intro_path, 'w') as f:
        f.write(intro_sql)
    print(f"✅ {intro_path.name} ({len(intro_sql)//1024}KB)")
    file_seq += 1

    # 2. Chapters and verses
    for volume in parsed_data.get('volumes', []):
        vol_num = volume['volume_number']

        for chapter in volume.get('chapters', []):
            ch_num = chapter['chapter_number']
            verses = chapter['verses']

            # Skip chapter 1 header (already exists), but add verses
            if ch_num != 1:
                # Chapter header
                ch_sql = generate_chapter_sql(vol_num, chapter)
                ch_path = SQL_OUTPUT_DIR / f"20260113120{file_seq:03d}_td_v{vol_num}_ch{ch_num:02d}.sql"
                with open(ch_path, 'w') as f:
                    f.write(ch_sql)
                print(f"✅ {ch_path.name} ({len(ch_sql)//1024}KB)")
                file_seq += 1

            # Verses - split if needed
            verse_chunks = split_verses_by_size(verses, MAX_CONTENT_SIZE)

            verse_start_idx = 0
            for part_idx, chunk in enumerate(verse_chunks):
                verses_sql = generate_verses_sql(vol_num, ch_num, chunk, verse_start_idx)

                if len(verse_chunks) > 1:
                    filename = f"20260113120{file_seq:03d}_td_v{vol_num}_ch{ch_num:02d}_verses_p{part_idx+1}.sql"
                else:
                    filename = f"20260113120{file_seq:03d}_td_v{vol_num}_ch{ch_num:02d}_verses.sql"

                verses_path = SQL_OUTPUT_DIR / filename
                with open(verses_path, 'w') as f:
                    f.write(verses_sql)
                print(f"   ✅ {filename} ({len(verses_sql)//1024}KB, {len(chunk)} verses)")
                file_seq += 1
                verse_start_idx += len(chunk)

    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)


if __name__ == "__main__":
    main()
