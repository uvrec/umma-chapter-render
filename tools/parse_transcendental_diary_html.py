#!/usr/bin/env python3
"""
Parser for Transcendental Diary HTML files from prabhupadavani.org

Parses HTML files downloaded via SiteSucker and generates:
1. JSON with parsed content
2. SQL migration for intro_chapters and chapters

Structure:
- intro_chapters: dedication, acknowledgments, introduction, foreword, preface
- chapters: chapter 1-12 per volume (chapter_type: "text")

Content format:
- Preserves <em>, <strong> HTML tags for formatting
- Uses <p> for paragraphs
- Uses <h2>, <h3> for subheadings (dates)
- Uses CSS classes: r-verse (verse/poetry), r-paragraph, r-subheading
"""

import json
import re
import os
from pathlib import Path
from bs4 import BeautifulSoup
from typing import Optional

# Path to SiteSucker downloaded files
HTML_SOURCE_DIR = Path("/Users/mymac/Downloads/us.sitesucker.mac.sitesucker-pro/prabhupadavani.org/bio/transcendental-diary")

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / "src" / "data"
SQL_OUTPUT_DIR = Path(__file__).parent.parent / "supabase" / "migrations"

# Book configuration
BOOK_SLUG = "td"
BOOK_TITLE_EN = "Transcendental Diary"
BOOK_TITLE_UA = "Трансцендентний щоденник"
AUTHOR_EN = "Hari Sauri dasa"
AUTHOR_UA = "Харі Шаурі дас"

# Intro pages order (as they appear in the book)
INTRO_PAGES = [
    ("dedication", "Dedication", "Присвята", 1),
    ("acknowledgments", "Acknowledgments", "Подяки", 2),
    ("introduction", "Introduction", "Вступ", 3),
    ("foreword", "Foreword", "Передмова", 4),
    ("preface", "Preface", "Передслово", 5),
]

# Volume configuration
VOLUMES = [
    {
        "number": 1,
        "title_en": "Volume 1",
        "title_ua": "Том 1",
        "subtitle_en": "November 1975 – April 1976",
        "subtitle_ua": "Листопад 1975 – Квітень 1976",
        "chapters": 12,
    },
]


def clean_html_content(html: str) -> str:
    """Clean and normalize HTML content while preserving formatting tags."""
    if not html:
        return ""

    # Remove excessive whitespace but preserve structure
    html = re.sub(r'\n\s*\n', '\n\n', html)
    html = re.sub(r'[ \t]+', ' ', html)

    return html.strip()


def parse_html_file(file_path: Path) -> dict:
    """Parse an HTML file and extract title and content."""
    if not file_path.exists():
        return {"title": "", "content": ""}

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')

    # Extract title
    title_el = soup.select_one('h2.title')
    title = title_el.get_text(strip=True) if title_el else ""

    # Extract chapter subtitle (location) if present
    subtitle_el = soup.select_one('h3.chapter-title')
    subtitle = subtitle_el.get_text(strip=True) if subtitle_el else ""

    # Extract main content
    content_el = soup.select_one('article.post-content')
    if not content_el:
        return {"title": title, "subtitle": subtitle, "content": ""}

    # Parse content preserving formatting
    content_parts = []

    # Find all paragraph-level elements within rich-text divs
    for element in content_el.find_all(['p', 'h2', 'h3', 'h4', 'blockquote', 'ul', 'ol']):
        tag_name = element.name

        # Skip empty elements
        text = element.get_text(strip=True)
        if not text:
            continue

        # Skip navigation elements
        if re.match(r'^(Previous|Next|←|→)$', text, re.IGNORECASE):
            continue

        # Get CSS classes for special formatting
        css_classes = element.get('class', [])

        # Process inner HTML to preserve em, strong, i, b tags
        inner_html = process_inner_html(element)

        if not inner_html.strip():
            continue

        # Handle different element types
        if tag_name in ['h2', 'h3', 'h4']:
            content_parts.append(f'<{tag_name}>{inner_html}</{tag_name}>')
        elif tag_name == 'blockquote':
            # Get text from blockquote, handling nested p tags
            quote_text = element.get_text(strip=True)
            content_parts.append(f'<blockquote><p>{quote_text}</p></blockquote>')
        elif tag_name in ['ul', 'ol']:
            list_items = []
            for li in element.find_all('li'):
                li_text = li.get_text(strip=True)
                if li_text:
                    list_items.append(f'<li>{li_text}</li>')
            if list_items:
                content_parts.append(f'<{tag_name}>{"".join(list_items)}</{tag_name}>')
        else:
            # Regular paragraph
            if 'r-verse' in css_classes:
                # Verse/poetry line - preserve as separate line
                content_parts.append(f'<p class="verse">{inner_html}</p>')
            elif 'r-subheading' in css_classes:
                # Subheading (usually dates)
                content_parts.append(f'<h3>{inner_html}</h3>')
            else:
                content_parts.append(f'<p>{inner_html}</p>')

    content = '\n\n'.join(content_parts)

    return {
        "title": title,
        "subtitle": subtitle,
        "content": clean_html_content(content)
    }


def process_inner_html(element) -> str:
    """Process element's inner HTML, preserving em, strong, i, b tags."""
    # Get inner HTML
    inner_html = ''.join(str(child) for child in element.children)

    # Normalize tag names
    inner_html = re.sub(r'<i\b', '<em', inner_html)
    inner_html = re.sub(r'</i>', '</em>', inner_html)
    inner_html = re.sub(r'<b\b', '<strong', inner_html)
    inner_html = re.sub(r'</b>', '</strong>', inner_html)

    # Remove unwanted tags but keep content
    inner_html = re.sub(r'</?(?:span|div|a)[^>]*>', '', inner_html)

    # Clean up nested divs from rich-text structure
    inner_html = re.sub(r'</?div[^>]*>', '', inner_html)

    # Normalize whitespace
    inner_html = re.sub(r'\s+', ' ', inner_html)

    return inner_html.strip()


def parse_intro_page(volume_dir: Path, slug: str) -> Optional[dict]:
    """Parse an intro page (dedication, foreword, etc.)."""
    file_path = volume_dir / slug / "index.html"
    if not file_path.exists():
        print(f"  ⚠️ Intro page not found: {file_path}")
        return None

    result = parse_html_file(file_path)
    print(f"  ✅ {slug}: {len(result['content'])} chars")
    return result


def parse_chapter(volume_dir: Path, chapter_num: int) -> Optional[dict]:
    """Parse a chapter file."""
    file_path = volume_dir / f"chapter-{chapter_num}" / "index.html"
    if not file_path.exists():
        print(f"  ⚠️ Chapter not found: {file_path}")
        return None

    result = parse_html_file(file_path)
    result['chapter_number'] = chapter_num
    print(f"  ✅ Chapter {chapter_num}: \"{result['title']}\" ({len(result['content'])} chars)")
    return result


def escape_sql(text: str) -> str:
    """Escape text for SQL string literal."""
    if not text:
        return ""
    return text.replace("'", "''").replace("\\", "\\\\")


def generate_sql_migration(parsed_data: dict) -> str:
    """Generate SQL migration for intro_chapters and chapters."""
    sql_parts = []

    sql_parts.append(f"""-- ============================================
-- Import Transcendental Diary Volume 1
-- intro_chapters + chapters (skip chapter 1)
-- Generated by parse_transcendental_diary_html.py
-- ============================================

BEGIN;

-- Ensure book exists
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('{BOOK_SLUG}', '{escape_sql(BOOK_TITLE_EN)}', '{escape_sql(BOOK_TITLE_UA)}', true, true)
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = '{BOOK_SLUG}';

  IF v_book_id IS NULL THEN
    RAISE EXCEPTION 'Book "{BOOK_SLUG}" not found';
  END IF;
""")

    # Generate intro_chapters
    if parsed_data.get('intro_pages'):
        sql_parts.append("""
  -- ============================================
  -- Intro chapters (dedication, acknowledgments, etc.)
  -- ============================================
""")
        for intro in parsed_data['intro_pages']:
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

    # Generate cantos (volumes) and chapters
    for volume in parsed_data.get('volumes', []):
        vol_num = volume['volume_number']
        vol_title_en = escape_sql(volume['title_en'])
        vol_title_ua = escape_sql(volume['title_ua'])
        vol_subtitle_en = escape_sql(volume.get('subtitle_en', ''))

        sql_parts.append(f"""
  -- ============================================
  -- Volume {vol_num}: {vol_title_en}
  -- ============================================

  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, description_en, is_published)
  VALUES (v_book_id, {vol_num}, E'{vol_title_en}', E'{vol_title_ua}', E'{vol_subtitle_en}', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    description_en = EXCLUDED.description_en;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = {vol_num};
""")

        # Skip chapter 1 (already exists)
        for chapter in volume.get('chapters', []):
            ch_num = chapter['chapter_number']
            if ch_num == 1:
                print(f"  ⏭️ Skipping Chapter 1 (already exists)")
                continue

            ch_title_en = escape_sql(chapter['title_en'])
            ch_subtitle = escape_sql(chapter.get('subtitle', ''))
            ch_content_en = escape_sql(chapter['content_en'])

            # Add subtitle to title if present
            full_title = ch_title_en
            if ch_subtitle:
                full_title = f"{ch_title_en}: {ch_subtitle}"

            sql_parts.append(f"""
  -- Chapter {ch_num}: {ch_title_en}
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
""")

    sql_parts.append("""
END $$;

COMMIT;
""")

    return '\n'.join(sql_parts)


def main():
    print("=" * 60)
    print("Transcendental Diary HTML Parser")
    print("=" * 60)

    parsed_data = {
        "book_slug": BOOK_SLUG,
        "book_title_en": BOOK_TITLE_EN,
        "book_title_ua": BOOK_TITLE_UA,
        "author_en": AUTHOR_EN,
        "author_ua": AUTHOR_UA,
        "intro_pages": [],
        "volumes": [],
    }

    # Parse Volume 1
    vol_config = VOLUMES[0]
    vol_num = vol_config['number']
    vol_dir = HTML_SOURCE_DIR / f"volume-{vol_num}"

    print(f"\n📖 Parsing Volume {vol_num}")
    print(f"   Source: {vol_dir}")

    # Parse intro pages
    print(f"\n📄 Parsing intro pages...")
    for slug, title_en, title_ua, display_order in INTRO_PAGES:
        result = parse_intro_page(vol_dir, slug)
        if result:
            parsed_data['intro_pages'].append({
                "slug": slug,
                "title_en": result['title'] or title_en,
                "title_ua": title_ua,
                "content_en": result['content'],
                "display_order": display_order,
            })

    # Parse chapters
    print(f"\n📚 Parsing {vol_config['chapters']} chapters...")
    volume_data = {
        "volume_number": vol_num,
        "title_en": vol_config['title_en'],
        "title_ua": vol_config['title_ua'],
        "subtitle_en": vol_config['subtitle_en'],
        "subtitle_ua": vol_config['subtitle_ua'],
        "chapters": [],
    }

    for ch_num in range(1, vol_config['chapters'] + 1):
        result = parse_chapter(vol_dir, ch_num)
        if result:
            volume_data['chapters'].append({
                "chapter_number": ch_num,
                "title_en": result['title'],
                "subtitle": result.get('subtitle', ''),
                "content_en": result['content'],
            })

    parsed_data['volumes'].append(volume_data)

    # Write JSON output
    json_path = OUTPUT_DIR / "transcendental-diary-v1-parsed.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(parsed_data, f, ensure_ascii=False, indent=2)
    print(f"\n✅ JSON saved: {json_path}")

    # Generate SQL migration
    sql = generate_sql_migration(parsed_data)
    sql_path = SQL_OUTPUT_DIR / "20260113120000_import_td_volume1.sql"
    with open(sql_path, 'w', encoding='utf-8') as f:
        f.write(sql)
    print(f"✅ SQL saved: {sql_path}")

    # Summary
    print(f"\n" + "=" * 60)
    print("Summary:")
    print(f"  Intro pages: {len(parsed_data['intro_pages'])}")
    print(f"  Volumes: {len(parsed_data['volumes'])}")
    total_chapters = sum(len(v['chapters']) for v in parsed_data['volumes'])
    print(f"  Total chapters: {total_chapters}")
    print("=" * 60)


if __name__ == "__main__":
    main()
