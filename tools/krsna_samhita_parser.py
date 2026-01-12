#!/usr/bin/env python3
"""
Parser for Krsna Samhita book from kksongs.org
A philosophical treatise with Sanskrit verses, transliteration, and translation.
"""

import json
import re
import time
import requests
from bs4 import BeautifulSoup
from pathlib import Path

# Chapter data structure - 10 chapters
KRSNA_SAMHITA_CHAPTERS = [
    {"chapter": 1, "title_en": "Vaikuntha Varnanam", "title_ua": "Вайкунтга-варнанам",
     "url": "https://kksongs.org/songs/s/srikrsnatattvanirdesekrpa.html"},
    {"chapter": 2, "title_en": "Bhagavac-chakti Varnanam", "title_ua": "Бгаґавач-шакті-варнанам",
     "url": "https://kksongs.org/songs/a/atraivatattva.html"},
    {"chapter": 3, "title_en": "Avatara Lila Varnanam", "title_ua": "Аватара-ліла-варнанам",
     "url": "https://kksongs.org/songs/b/bhagavacchaktikaryesu.html"},
    {"chapter": 4, "title_en": "Krsna Lila Varnanam Part 1", "title_ua": "Крішна-ліла-варнанам (частина 1)",
     "url": "https://kksongs.org/songs/y/yadahijivavinanam.html"},
    {"chapter": 5, "title_en": "Krsna Lila Varnanam Part 2", "title_ua": "Крішна-ліла-варнанам (частина 2)",
     "url": "https://kksongs.org/songs/p/pritipravrt.html"},
    {"chapter": 6, "title_en": "Krsna Lila Varnanam Part 3", "title_ua": "Крішна-ліла-варнанам (частина 3)",
     "url": "https://kksongs.org/songs/k/karmakandasvarupoyam.html"},
    {"chapter": 7, "title_en": "Krsna Lila Tattva Vicarah", "title_ua": "Крішна-ліла-таттва-вічарах̣",
     "url": "https://kksongs.org/songs/e/esalilavibhornitya.html"},
    {"chapter": 8, "title_en": "Vraja Bhava Vicarah", "title_ua": "Враджа-бгава-вічарах̣",
     "url": "https://kksongs.org/songs/a/atraivavrajabhavanam.html"},
    {"chapter": 9, "title_en": "Krsnapti Varnanam", "title_ua": "Крішнапті-варнанам",
     "url": "https://kksongs.org/songs/v/vyasenavrajalilayam.html"},
    {"chapter": 10, "title_en": "Krsnapta Jana Caritam", "title_ua": "Крішнапта-джана-чарітам",
     "url": "https://kksongs.org/songs/y/yesamragoditahkrsne.html"},
]


def fetch_page(url: str) -> str | None:
    """Fetch page content."""
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (compatible; BookParser/1.0)'}
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return None


def preserve_line_breaks(soup):
    """Add newlines after block elements."""
    for br in soup.find_all('br'):
        br.replace_with('\n')
    for p in soup.find_all('p'):
        p.append('\n')
    return soup


def clean_text(text: str) -> str:
    """Clean whitespace while preserving line breaks."""
    if not text:
        return ""
    # Remove Windows-1252 special chars
    text = text.replace('\x92', "'")
    # Remove UPDATED/UDPATED markers
    text = re.sub(r'(UPDATED|UDPATED):?[^\n]*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'www\.kksongs\.org.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'Krsna Kirtana Songs.*$', '', text, flags=re.MULTILINE)
    # Remove standalone dates
    text = re.sub(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{1,2},?\s*\n?\s*\d{4}', '', text, flags=re.IGNORECASE)

    # Clean each line separately
    lines = []
    for line in text.split('\n'):
        cleaned = ' '.join(line.split())
        if cleaned:
            lines.append(cleaned)

    return '\n'.join(lines)


def parse_chapter_page(html: str) -> dict:
    """
    Parse a chapter page to extract Sanskrit, transliteration, and translation.
    Returns dict with 'sanskrit', 'transliteration', 'translation' lists.
    """
    soup = BeautifulSoup(html, 'html.parser')
    preserve_line_breaks(soup)

    result = {
        'sanskrit': [],
        'transliteration': [],
        'translation': []
    }

    text = soup.get_text()
    lines = text.split('\n')

    current_section = None
    current_verse = []
    verse_num = 0
    in_content = False

    for line in lines:
        line_stripped = line.strip()
        line_upper = line_stripped.upper()

        # Skip empty lines
        if not line_stripped:
            continue

        # Detect section markers
        if 'TRANSLITERATION' in line_upper or 'LYRICS' in line_upper:
            # Save previous section if any
            if current_section and current_verse:
                result[current_section].append(clean_text('\n'.join(current_verse)))
                current_verse = []
            current_section = 'transliteration'
            in_content = True
            continue

        if 'TRANSLATION' in line_upper or 'MEANING' in line_upper:
            if current_section == 'transliteration' and current_verse:
                result['transliteration'].append(clean_text('\n'.join(current_verse)))
                current_verse = []
            current_section = 'translation'
            in_content = True
            continue

        # Skip synonyms/word-for-word sections
        if 'WORD FOR WORD' in line_upper or 'SYNONYMS' in line_upper:
            if current_section and current_verse:
                result[current_section].append(clean_text('\n'.join(current_verse)))
                current_verse = []
            current_section = None
            continue

        # Skip remarks/extra info
        if 'REMARKS' in line_upper or 'EXTRA INFO' in line_upper:
            if current_section and current_verse:
                result[current_section].append(clean_text('\n'.join(current_verse)))
                current_verse = []
            break  # Stop processing after remarks

        # Check for verse number
        verse_match = re.match(r'^\s*\(?\s*(\d+)\s*\)?\s*$', line_stripped)
        if verse_match and current_section:
            if current_verse:
                result[current_section].append(clean_text('\n'.join(current_verse)))
                current_verse = []
            verse_num = int(verse_match.group(1))
            continue

        # Add content
        if current_section and line_stripped and in_content:
            # Skip site navigation
            if any(skip in line_stripped.lower() for skip in ['home', 'encyclopedia', 'song encyclopedia']):
                continue
            current_verse.append(line_stripped)

    # Save last verse
    if current_section and current_verse:
        result[current_section].append(clean_text('\n'.join(current_verse)))

    return result


def parse_sanskrit_unicode(html: str) -> list[str]:
    """
    Parse Sanskrit/Devanagari from Unicode page if available.
    """
    soup = BeautifulSoup(html, 'html.parser')
    preserve_line_breaks(soup)
    text = soup.get_text()

    # Check if it contains Devanagari script
    if not any('\u0900' <= c <= '\u097F' for c in text):
        return []

    # Split by verse numbers
    verse_pattern = re.compile(r'\((\d+)\)')
    matches = list(verse_pattern.finditer(text))

    verses = []
    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        verse_text = text[start:end].strip()
        verse_text = clean_text(verse_text)

        # Only include if it has Devanagari
        if verse_text and any('\u0900' <= c <= '\u097F' for c in verse_text):
            verses.append(verse_text)

    return verses


def parse_all_chapters():
    """Parse all chapters and create JSON."""
    print(f"Parsing {len(KRSNA_SAMHITA_CHAPTERS)} chapters from Krsna Samhita...")

    chapters = []

    for i, chapter_info in enumerate(KRSNA_SAMHITA_CHAPTERS):
        print(f"\n[{i+1}/{len(KRSNA_SAMHITA_CHAPTERS)}] Chapter {chapter_info['chapter']}: {chapter_info['title_en']}")

        chapter_data = {
            "chapter_number": chapter_info['chapter'],
            "title_en": chapter_info['title_en'],
            "title_ua": chapter_info['title_ua'],
            "sanskrit": [],
            "transliteration": [],
            "translation": []
        }

        # Fetch main page
        print(f"  Fetching chapter page...")
        main_html = fetch_page(chapter_info['url'])
        if main_html:
            parsed = parse_chapter_page(main_html)
            chapter_data['transliteration'] = parsed['transliteration']
            chapter_data['translation'] = parsed['translation']
            print(f"    Found {len(parsed['transliteration'])} transliteration verses")
            print(f"    Found {len(parsed['translation'])} translation verses")

            # Try to get Sanskrit from unicode page if exists
            unicode_url = chapter_info['url'].replace('/songs/', '/unicode/').replace('.html', '_sans.html')
            sanskrit_html = fetch_page(unicode_url)
            if sanskrit_html:
                sanskrit_verses = parse_sanskrit_unicode(sanskrit_html)
                if sanskrit_verses:
                    chapter_data['sanskrit'] = sanskrit_verses
                    print(f"    Found {len(sanskrit_verses)} Sanskrit verses")

        chapters.append(chapter_data)
        time.sleep(0.3)

    # Build final structure
    output = {
        "book_slug": "krsna-samhita",
        "book_title_en": "Krsna Samhita",
        "book_title_ua": "Крішна-самхіта",
        "author_en": "Bhaktivinoda Thakura",
        "author_ua": "Бгактівінод Тхакур",
        "year": 1879,
        "source": "https://kksongs.org/authors/literature/ks.html",
        "chapters": chapters,
        "total_chapters": len(chapters),
        "metadata": {
            "parsed_date": time.strftime("%Y-%m-%d"),
            "source_website": "kksongs.org",
            "language": "Sanskrit"
        }
    }

    return output


def main():
    output_path = Path(__file__).parent.parent / "src" / "data" / "krsna-samhita-parsed.json"

    data = parse_all_chapters()

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Saved to {output_path}")
    print(f"  Total chapters: {data['total_chapters']}")

    # Count total verses
    total_verses = sum(
        max(len(ch.get('sanskrit', [])), len(ch.get('transliteration', [])), len(ch.get('translation', [])))
        for ch in data['chapters']
    )
    print(f"  Total verses: ~{total_verses}")


if __name__ == "__main__":
    main()
