#!/usr/bin/env python3
"""
Generate smaller SQL migration files for Transcendental Diary.
Splits into separate files:
1. intro_chapters (all 5 intro pages)
2. One file per chapter (chapters 2-12)
3. Large chapters (>100KB) split into parts
"""

import json
import re
from pathlib import Path

# Paths
DATA_PATH = Path(__file__).parent.parent / "src" / "data" / "transcendental-diary-v1-parsed.json"
SQL_OUTPUT_DIR = Path(__file__).parent.parent / "supabase" / "migrations"

BOOK_SLUG = "td"

# Max size for SQL file content (in characters, ~100KB)
MAX_CONTENT_SIZE = 80000


def escape_sql(text: str) -> str:
    """Escape text for SQL string literal."""
    if not text:
        return ""
    return text.replace("'", "''").replace("\\", "\\\\")


def generate_intro_chapters_sql(parsed_data: dict) -> str:
    """Generate SQL for intro_chapters only."""
    sql_parts = []

    sql_parts.append(f"""-- ============================================
-- Transcendental Diary - Intro Chapters
-- dedication, acknowledgments, introduction, foreword, preface
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = '{BOOK_SLUG}';

  IF v_book_id IS NULL THEN
    RAISE EXCEPTION 'Book "{BOOK_SLUG}" not found. Create the book first.';
  END IF;
""")

    for intro in parsed_data.get('intro_pages', []):
        slug = intro['slug']
        title_en = escape_sql(intro['title_en'])
        content_en = escape_sql(intro['content_en'])
        display_order = intro['display_order']

        sql_parts.append(f"""
  -- {title_en}
  INSERT INTO public.intro_chapters (book_id, slug, title_en, title_ua, content_en, content_ua, display_order)
  VALUES (
    v_book_id,
    '{slug}',
    E'{title_en}',
    '',
    E'{content_en}',
    '',
    {display_order}
  )
  ON CONFLICT (book_id, slug) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    content_en = EXCLUDED.content_en,
    display_order = EXCLUDED.display_order,
    updated_at = now();
""")

    sql_parts.append("""
END $$;
""")

    return '\n'.join(sql_parts)


def generate_chapter_sql(volume: dict, chapter: dict, content_override: str = None) -> str:
    """Generate SQL for a single chapter."""
    vol_num = volume['volume_number']
    ch_num = chapter['chapter_number']
    ch_title_en = escape_sql(chapter['title_en'])
    ch_subtitle = escape_sql(chapter.get('subtitle', ''))

    # Use override content if provided, otherwise use chapter content
    content = content_override if content_override is not None else chapter['content_en']
    ch_content_en = escape_sql(content)

    # Add subtitle to title if present
    full_title = ch_title_en
    if ch_subtitle:
        full_title = f"{ch_title_en}: {ch_subtitle}"

    return f"""-- ============================================
-- Transcendental Diary - Volume {vol_num}, Chapter {ch_num}
-- {full_title}
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = '{BOOK_SLUG}';

  IF v_book_id IS NULL THEN
    RAISE EXCEPTION 'Book "{BOOK_SLUG}" not found';
  END IF;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = {vol_num};

  IF v_canto_id IS NULL THEN
    RAISE EXCEPTION 'Volume {vol_num} not found for book "{BOOK_SLUG}"';
  END IF;

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, content_en, content_ua, chapter_type, is_published)
  VALUES (
    v_canto_id,
    {ch_num},
    E'{escape_sql(full_title)}',
    '',
    E'{ch_content_en}',
    '',
    'text',
    true
  )
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    content_en = EXCLUDED.content_en,
    chapter_type = EXCLUDED.chapter_type,
    updated_at = now();

END $$;
"""


def generate_chapter_part_sql(volume: dict, chapter: dict, part_num: int, content_part: str) -> str:
    """Generate SQL for appending content to existing chapter (for split chapters)."""
    vol_num = volume['volume_number']
    ch_num = chapter['chapter_number']
    ch_title_en = chapter['title_en']
    ch_subtitle = chapter.get('subtitle', '')
    full_title = f"{ch_title_en}: {ch_subtitle}" if ch_subtitle else ch_title_en

    ch_content_escaped = escape_sql(content_part)

    return f"""-- ============================================
-- Transcendental Diary - Volume {vol_num}, Chapter {ch_num} (Part {part_num})
-- {full_title}
-- ============================================

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
  v_existing_content text;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = '{BOOK_SLUG}';

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = {vol_num};

  SELECT id, content_en INTO v_chapter_id, v_existing_content
  FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = {ch_num};

  -- Append content to existing chapter
  UPDATE public.chapters
  SET content_en = v_existing_content || E'

{ch_content_escaped}',
      updated_at = now()
  WHERE id = v_chapter_id;

END $$;
"""


def split_content_by_paragraphs(content: str, max_size: int) -> list:
    """Split content into chunks at paragraph boundaries."""
    # Split by double newline (paragraph separator)
    paragraphs = content.split('\n\n')

    chunks = []
    current_chunk = []
    current_size = 0

    for para in paragraphs:
        para_size = len(para) + 2  # +2 for \n\n

        if current_size + para_size > max_size and current_chunk:
            # Save current chunk and start new one
            chunks.append('\n\n'.join(current_chunk))
            current_chunk = [para]
            current_size = para_size
        else:
            current_chunk.append(para)
            current_size += para_size

    # Don't forget the last chunk
    if current_chunk:
        chunks.append('\n\n'.join(current_chunk))

    return chunks


def main():
    print("=" * 60)
    print("Generating TD SQL chunks")
    print("=" * 60)

    # Load parsed data
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        parsed_data = json.load(f)

    # Remove old migrations
    for old_file in SQL_OUTPUT_DIR.glob("20260113*_td_*.sql"):
        old_file.unlink()
        print(f"🗑️  Removed: {old_file.name}")

    # 1. Generate intro_chapters SQL
    intro_sql = generate_intro_chapters_sql(parsed_data)
    intro_path = SQL_OUTPUT_DIR / "20260113120001_td_intro_chapters.sql"
    with open(intro_path, 'w', encoding='utf-8') as f:
        f.write(intro_sql)
    print(f"✅ {intro_path.name} ({len(intro_sql)//1024}KB)")

    # Track file sequence number
    file_seq = 2

    # 2. Generate per-chapter SQL files
    for volume in parsed_data.get('volumes', []):
        vol_num = volume['volume_number']

        for chapter in volume.get('chapters', []):
            ch_num = chapter['chapter_number']

            # Skip chapter 1 (already exists)
            if ch_num == 1:
                print(f"⏭️  Skipping Chapter 1 (already exists)")
                continue

            content = chapter['content_en']
            content_size = len(content)

            # Check if chapter needs splitting
            if content_size > MAX_CONTENT_SIZE:
                print(f"📦 Chapter {ch_num} is large ({content_size//1024}KB), splitting...")

                # Split content into chunks
                chunks = split_content_by_paragraphs(content, MAX_CONTENT_SIZE)
                print(f"   Split into {len(chunks)} parts")

                for part_idx, chunk in enumerate(chunks):
                    part_num = part_idx + 1

                    if part_idx == 0:
                        # First part: INSERT
                        chapter_sql = generate_chapter_sql(volume, chapter, content_override=chunk)
                    else:
                        # Subsequent parts: UPDATE (append)
                        chapter_sql = generate_chapter_part_sql(volume, chapter, part_num, chunk)

                    filename = f"20260113120{file_seq:03d}_td_v{vol_num}_ch{ch_num:02d}_p{part_num}.sql"
                    chapter_path = SQL_OUTPUT_DIR / filename

                    with open(chapter_path, 'w', encoding='utf-8') as f:
                        f.write(chapter_sql)

                    print(f"   ✅ {filename} ({len(chapter_sql)//1024}KB)")
                    file_seq += 1
            else:
                # Normal size chapter
                chapter_sql = generate_chapter_sql(volume, chapter)

                filename = f"20260113120{file_seq:03d}_td_v{vol_num}_ch{ch_num:02d}.sql"
                chapter_path = SQL_OUTPUT_DIR / filename

                with open(chapter_path, 'w', encoding='utf-8') as f:
                    f.write(chapter_sql)

                print(f"✅ {filename} ({len(chapter_sql)//1024}KB)")
                file_seq += 1

    print("\n" + "=" * 60)
    print("Done! Files created in supabase/migrations/")
    print("=" * 60)


if __name__ == "__main__":
    main()
