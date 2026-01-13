#!/usr/bin/env python3
"""
Generate SQL for prabhupada_events table from Transcendental Diary.

Each date entry becomes an event with:
- Parsed date (for sorting/filtering)
- Location extracted from chapter title
- Content preview
- Link to source (book/volume/chapter/verse)
"""

import json
import re
from datetime import datetime
from pathlib import Path

DATA_PATH = Path(__file__).parent.parent / "src" / "data" / "transcendental-diary-verses.json"
SQL_OUTPUT_DIR = Path(__file__).parent.parent / "supabase" / "migrations"

BOOK_SLUG = "td"

# Chapter locations (extracted from chapter titles)
CHAPTER_LOCATIONS = {
    1: "New Delhi / Kurukṣetra, India",
    2: "Vṛndāvana, India",
    3: "New Delhi, India",
    4: "Bombay, India",
    5: "Māyāpur / Calcutta, India",
    6: "Māyāpur, India",
    7: "Māyāpur, India",
    8: "Calcutta, India",
    9: "Māyāpur, India",
    10: "Calcutta / Hong Kong, India/Hong Kong",
    11: "Melbourne / Auckland, Australia/New Zealand",
    12: "Fiji / Hawaii, Fiji/USA",
}


def parse_date(date_str: str) -> tuple:
    """Parse date string like 'November 26th, 1975' to (date, display)."""
    # Remove ordinal suffixes
    clean = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', date_str)

    # Try parsing
    try:
        dt = datetime.strptime(clean, '%B %d, %Y')
        return dt.strftime('%Y-%m-%d'), date_str
    except ValueError:
        try:
            dt = datetime.strptime(clean, '%B %d %Y')
            return dt.strftime('%Y-%m-%d'), date_str
        except ValueError:
            return None, date_str


def escape_sql(text: str) -> str:
    """Escape text for SQL."""
    if not text:
        return ""
    return text.replace("'", "''").replace("\\", "\\\\")


def extract_preview(content: str, max_len: int = 500) -> str:
    """Extract plain text preview from HTML content."""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', content)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    # Truncate
    if len(text) > max_len:
        text = text[:max_len-3] + "..."
    return text


def main():
    print("=" * 60)
    print("Generating Prabhupada Events from TD")
    print("=" * 60)

    with open(DATA_PATH, 'r') as f:
        parsed_data = json.load(f)

    events = []

    for volume in parsed_data.get('volumes', []):
        vol_num = volume['volume_number']

        for chapter in volume.get('chapters', []):
            ch_num = chapter['chapter_number']
            location = CHAPTER_LOCATIONS.get(ch_num, "India")

            for verse in chapter.get('verses', []):
                verse_num = verse['verse_number']
                commentary = verse['commentary_en']

                # Skip intro entries without real dates
                if verse_num == "Introduction":
                    continue

                # Parse date
                date_sql, date_display = parse_date(verse_num)

                if not date_sql:
                    print(f"  ⚠️ Could not parse date: {verse_num}")
                    continue

                # Extract preview
                preview = extract_preview(commentary)

                events.append({
                    'date_sql': date_sql,
                    'date_display': date_display,
                    'location': location,
                    'vol_num': vol_num,
                    'ch_num': ch_num,
                    'verse_num': verse_num,
                    'preview': preview,
                })

    print(f"\n📊 Found {len(events)} events")

    # Generate SQL
    sql_parts = []
    sql_parts.append(f"""-- ============================================
-- Prabhupada Events from Transcendental Diary Volume 1
-- {len(events)} events
-- ============================================

DO $$
BEGIN
""")

    for event in events:
        sql_parts.append(f"""
  INSERT INTO public.prabhupada_events (
    event_date, date_display, location_en,
    source_type, source_book_slug, source_volume, source_chapter, source_verse,
    content_preview_en, is_published
  ) VALUES (
    '{event['date_sql']}',
    E'{escape_sql(event['date_display'])}',
    E'{escape_sql(event['location'])}',
    'diary',
    '{BOOK_SLUG}',
    {event['vol_num']},
    {event['ch_num']},
    E'{escape_sql(event['verse_num'])}',
    E'{escape_sql(event['preview'])}',
    true
  )
  ON CONFLICT (event_date, source_type, source_book_slug, source_volume, source_chapter, source_verse)
  DO UPDATE SET
    date_display = EXCLUDED.date_display,
    location_en = EXCLUDED.location_en,
    content_preview_en = EXCLUDED.content_preview_en;
""")

    sql_parts.append("""
END $$;
""")

    sql = '\n'.join(sql_parts)

    # Save
    output_path = SQL_OUTPUT_DIR / "20260113100001_td_events.sql"
    with open(output_path, 'w') as f:
        f.write(sql)

    print(f"✅ Saved: {output_path.name} ({len(sql)//1024}KB)")

    # Summary by month
    print("\n📅 Events by month:")
    from collections import Counter
    months = Counter()
    for e in events:
        month = e['date_sql'][:7]  # YYYY-MM
        months[month] += 1
    for month, count in sorted(months.items()):
        print(f"   {month}: {count} events")


if __name__ == "__main__":
    main()
