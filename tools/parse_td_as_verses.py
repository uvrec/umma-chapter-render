#!/usr/bin/env python3
"""
Parser for Transcendental Diary - converts to verses structure.

Each date entry becomes a verse:
- verse_number = date (e.g., "January 17th, 1976")
- commentary_en = content for that date

This allows using the same UI as Srimad-Bhagavatam but showing only commentary.
"""

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup
from typing import Optional, List, Dict

# Path to SiteSucker downloaded files
HTML_SOURCE_DIR = Path("/Users/mymac/Downloads/us.sitesucker.mac.sitesucker-pro/prabhupadavani.org/bio/transcendental-diary")

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / "src" / "data"
SQL_OUTPUT_DIR = Path(__file__).parent.parent / "supabase" / "migrations"

# Book configuration
BOOK_SLUG = "td"

# Intro pages order
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
        "title_uk": "Том 1",
        "subtitle_en": "November 1975 – April 1976",
        "chapters": 12,
    },
]


def clean_html_content(html: str) -> str:
    """Clean and normalize HTML content."""
    if not html:
        return ""
    html = re.sub(r'\n\s*\n', '\n\n', html)
    html = re.sub(r'[ \t]+', ' ', html)
    return html.strip()


def process_inner_html(element) -> str:
    """Process element's inner HTML, preserving em, strong tags."""
    inner_html = ''.join(str(child) for child in element.children)

    # Normalize tags
    inner_html = re.sub(r'<i\b', '<em', inner_html)
    inner_html = re.sub(r'</i>', '</em>', inner_html)
    inner_html = re.sub(r'<b\b', '<strong', inner_html)
    inner_html = re.sub(r'</b>', '</strong>', inner_html)

    # Remove unwanted tags
    inner_html = re.sub(r'</?(?:span|div|a)[^>]*>', '', inner_html)
    inner_html = re.sub(r'\s+', ' ', inner_html)

    return inner_html.strip()


def parse_chapter_to_verses(file_path: Path, chapter_num: int) -> Dict:
    """Parse chapter HTML and split by dates into verses."""
    if not file_path.exists():
        return {"title": "", "subtitle": "", "verses": []}

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')

    # Extract title
    title_el = soup.select_one('h2.title')
    title = title_el.get_text(strip=True) if title_el else f"Chapter {chapter_num}"

    # Extract content
    content_el = soup.select_one('article.post-content')
    if not content_el:
        return {"title": title, "subtitle": "", "verses": []}

    verses = []
    current_date = None
    current_content = []

    # Date pattern: "January 17th, 1976" or "<strong>January 17th, 1976</strong>"
    date_pattern = re.compile(
        r'^(?:<strong>)?'
        r'((?:January|February|March|April|May|June|July|August|September|October|November|December)'
        r'\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4})'
        r'(?:</strong>)?$',
        re.IGNORECASE
    )

    def save_current_verse():
        """Save accumulated content as a verse."""
        if current_date and current_content:
            commentary = '\n\n'.join(current_content)
            verses.append({
                "verse_number": current_date,
                "commentary_en": clean_html_content(commentary),
            })

    # Process all elements
    for element in content_el.find_all(['p', 'h2', 'h3', 'h4', 'blockquote', 'ul', 'ol']):
        tag_name = element.name
        text = element.get_text(strip=True)

        if not text:
            continue

        # Skip navigation
        if re.match(r'^(Previous|Next|←|→)$', text, re.IGNORECASE):
            continue

        inner_html = process_inner_html(element)

        # Check if this is a date heading (h3 with date)
        if tag_name == 'h3':
            # Check if content is a date
            date_match = date_pattern.match(inner_html)
            if date_match:
                # Save previous verse
                save_current_verse()
                # Start new verse with this date
                current_date = date_match.group(1)
                current_content = []
                continue

        # Check if this is a date in strong tags within content
        if tag_name == 'p':
            strong_match = re.match(r'^<strong>(.*?)</strong>$', inner_html)
            if strong_match:
                potential_date = strong_match.group(1)
                date_match = date_pattern.match(f"<strong>{potential_date}</strong>")
                if date_match:
                    save_current_verse()
                    current_date = date_match.group(1)
                    current_content = []
                    continue

        # Regular content - add to current verse
        if current_date is None:
            # Content before first date - create intro verse
            current_date = "Introduction"

        css_classes = element.get('class', [])

        if tag_name in ['h2', 'h3', 'h4']:
            current_content.append(f'<{tag_name}>{inner_html}</{tag_name}>')
        elif tag_name == 'blockquote':
            quote_text = element.get_text(strip=True)
            current_content.append(f'<blockquote><p>{quote_text}</p></blockquote>')
        elif tag_name in ['ul', 'ol']:
            list_items = []
            for li in element.find_all('li'):
                li_text = li.get_text(strip=True)
                if li_text:
                    list_items.append(f'<li>{li_text}</li>')
            if list_items:
                current_content.append(f'<{tag_name}>{"".join(list_items)}</{tag_name}>')
        else:
            if 'r-verse' in css_classes:
                current_content.append(f'<p class="verse">{inner_html}</p>')
            else:
                current_content.append(f'<p>{inner_html}</p>')

    # Don't forget the last verse
    save_current_verse()

    # Extract subtitle from title if present (location name)
    subtitle = ""
    title_parts = title.split(':')
    if len(title_parts) > 1:
        subtitle = title_parts[1].strip()

    return {
        "title": title,
        "subtitle": subtitle,
        "verses": verses,
    }


def parse_intro_page(file_path: Path) -> Optional[Dict]:
    """Parse an intro page."""
    if not file_path.exists():
        return None

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    soup = BeautifulSoup(html, 'html.parser')

    title_el = soup.select_one('h2.title')
    title = title_el.get_text(strip=True) if title_el else ""

    content_el = soup.select_one('article.post-content')
    if not content_el:
        return {"title": title, "content": ""}

    content_parts = []
    for element in content_el.find_all(['p', 'h2', 'h3', 'blockquote']):
        text = element.get_text(strip=True)
        if not text:
            continue
        if re.match(r'^(Previous|Next)$', text, re.IGNORECASE):
            continue

        inner_html = process_inner_html(element)
        tag_name = element.name
        css_classes = element.get('class', [])

        if tag_name in ['h2', 'h3']:
            content_parts.append(f'<{tag_name}>{inner_html}</{tag_name}>')
        elif tag_name == 'blockquote':
            content_parts.append(f'<blockquote><p>{inner_html}</p></blockquote>')
        elif 'r-verse' in css_classes:
            content_parts.append(f'<p class="verse">{inner_html}</p>')
        else:
            content_parts.append(f'<p>{inner_html}</p>')

    return {
        "title": title,
        "content": '\n\n'.join(content_parts),
    }


def escape_sql(text: str) -> str:
    """Escape text for SQL."""
    if not text:
        return ""
    return text.replace("'", "''").replace("\\", "\\\\")


def main():
    print("=" * 60)
    print("Transcendental Diary Parser (Verses Structure)")
    print("=" * 60)

    parsed_data = {
        "book_slug": BOOK_SLUG,
        "intro_pages": [],
        "volumes": [],
    }

    vol_config = VOLUMES[0]
    vol_num = vol_config['number']
    vol_dir = HTML_SOURCE_DIR / f"volume-{vol_num}"

    print(f"\n📖 Parsing Volume {vol_num}")

    # Parse intro pages
    print(f"\n📄 Parsing intro pages...")
    for slug, title_en, title_uk, display_order in INTRO_PAGES:
        file_path = vol_dir / slug / "index.html"
        result = parse_intro_page(file_path)
        if result:
            parsed_data['intro_pages'].append({
                "slug": slug,
                "title_en": result['title'] or title_en,
                "title_uk": title_uk,
                "content_en": result['content'],
                "display_order": display_order,
            })
            print(f"  ✅ {slug}: {len(result['content'])} chars")

    # Parse chapters to verses
    print(f"\n📚 Parsing chapters as verses...")
    volume_data = {
        "volume_number": vol_num,
        "title_en": vol_config['title_en'],
        "title_uk": vol_config['title_uk'],
        "subtitle_en": vol_config['subtitle_en'],
        "chapters": [],
    }

    for ch_num in range(1, vol_config['chapters'] + 1):
        file_path = vol_dir / f"chapter-{ch_num}" / "index.html"
        result = parse_chapter_to_verses(file_path, ch_num)

        if result['verses']:
            volume_data['chapters'].append({
                "chapter_number": ch_num,
                "title_en": result['title'],
                "subtitle": result['subtitle'],
                "verses": result['verses'],
            })
            print(f"  ✅ Chapter {ch_num}: \"{result['title']}\" ({len(result['verses'])} verses)")

    parsed_data['volumes'].append(volume_data)

    # Write JSON
    json_path = OUTPUT_DIR / "transcendental-diary-verses.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(parsed_data, f, ensure_ascii=False, indent=2)
    print(f"\n✅ JSON saved: {json_path}")

    # Summary
    total_verses = sum(
        len(ch['verses'])
        for v in parsed_data['volumes']
        for ch in v['chapters']
    )
    print(f"\n" + "=" * 60)
    print("Summary:")
    print(f"  Intro pages: {len(parsed_data['intro_pages'])}")
    print(f"  Chapters: {len(volume_data['chapters'])}")
    print(f"  Total verses (date entries): {total_verses}")
    print("=" * 60)


if __name__ == "__main__":
    main()
