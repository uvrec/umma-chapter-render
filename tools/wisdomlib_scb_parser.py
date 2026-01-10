#!/usr/bin/env python3
"""
Wisdomlib Parser for Sri Chaitanya Bhagavata (SCB)
Parses verses from wisdomlib.org and generates SQL for import

Usage:
    python wisdomlib_scb_parser.py --khanda adi --chapter 1
    python wisdomlib_scb_parser.py --all

НОРМАЛІЗАЦІЯ ТЕКСТУ (BBT Editorial Guidelines):
===============================================
Після парсингу застосовувати правила нормалізації з:
- tools/translit_normalizer.py - apply_ukrainian_rules() для українського тексту
- tools/pre_import_normalizer.py - mojibake, діакритика, апострофи
- src/utils/text/textNormalizationRules.ts - повний список правил (TypeScript)
"""

import re
import time
import json
import argparse
from dataclasses import dataclass, field, asdict
from typing import Optional, List, Dict
from urllib.parse import urljoin

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    print("Install dependencies: pip install requests beautifulsoup4")
    exit(1)

# ============================================================================
# CONFIGURATION
# ============================================================================

BASE_URL = "https://www.wisdomlib.org"
BOOK_URL = f"{BASE_URL}/hinduism/book/chaitanya-bhagavata"

KHANDA_CONFIG = {
    "adi": {
        "number": 1,
        "title_en": "Ādi-khaṇḍa",
        "title_ua": "Аді-кханда",
        "index_url": f"{BASE_URL}/hinduism/book/chaitanya-bhagavata/d/doc1092508.html",
    },
    "madhya": {
        "number": 2,
        "title_en": "Madhya-khaṇḍa",
        "title_ua": "Мадг'я-кханда",
        "index_url": f"{BASE_URL}/hinduism/book/chaitanya-bhagavata/d/doc1098648.html",
    },
    "antya": {
        "number": 3,
        "title_en": "Antya-khaṇḍa",
        "title_ua": "Антья-кханда",
        "index_url": f"{BASE_URL}/hinduism/book/chaitanya-bhagavata/d/doc1108917.html",
    },
}

# Request delay to be polite to the server
REQUEST_DELAY = 1.0

# ============================================================================
# TEXT NORMALIZATION
# ============================================================================

def normalize_dandas(text: str) -> str:
    """
    Normalize dandas in Sanskrit/Bengali text:
    - Two single dandas (।।) → one double danda (॥)
    - Normalize spaces around double danda with number: ॥ १२ ॥ or ॥ ১২ ॥

    NOTE: Original script uses ONLY Devanagari (०-९) or Bengali (০-৯) numerals
          NEVER Arabic/Roman numerals!
    """
    if not text:
        return text
    
    # Two single dandas → double danda
    text = text.replace('।।', '॥')
    
    # Normalize double danda with number (Devanagari or Bengali numerals ONLY)
    # ॥१२॥ or ॥ १२॥ → ॥ १२ ॥
    # ॥১২॥ or ॥ ১২॥ → ॥ ১২ ॥
    text = re.sub(r'॥\s*([०-९\u09E6-\u09EF]+)\s*॥', r'॥ \1 ॥', text)
    
    return text


def add_line_breaks_after_double_danda(text: str) -> str:
    """
    Add line breaks after double danda with verse number (॥ १ ॥ or ॥ ১ ॥)
    Based on SQL normalization rule:
    regexp_replace(sanskrit, '(॥\\s*[०-९]+\\s*॥)([^\\n])', E'\\1\\n\\2', 'g')
    
    Supports ONLY Devanagari (०-९) and Bengali (০-৯) numerals - NEVER Arabic!
    """
    if not text:
        return text
    
    # Add \n after ॥ N ॥ if followed by non-newline character
    # Pattern: (॥ + optional spaces + Devanagari/Bengali numerals + optional spaces + ॥) followed by non-newline
    text = re.sub(
        r'(॥\s*[०-९\u09E6-\u09EF]+\s*॥)([^\n])',
        r'\1\n\2',
        text
    )
    
    return text


def process_bengali_text(text: str) -> str:
    """
    Process Bengali original text:
    1. Normalize dandas (।। → ॥)
    2. Add line breaks after ॥ N ॥
    3. Remove English text in quotes (Wisdomlib sometimes includes English in Bengali fields)
    """
    if not text:
        return text
    
    # Remove English text in quotes (e.g., "Worshiping My devotees...")
    # This happens when Wisdomlib mixes English translation in Bengali field
    text = re.sub(r'"[^"]*"', '', text)
    
    text = normalize_dandas(text)
    text = add_line_breaks_after_double_danda(text)
    
    # Clean up: trim lines, remove extra whitespace
    lines = [line.strip() for line in text.split('\n')]
    lines = [line for line in lines if line]
    
    return '\n'.join(lines)


def process_transliteration(text: str) -> str:
    """
    Process IAST transliteration:
    - Normalize spaces around || N ||
    - Add line breaks after || N || if needed
    
    Format on Wisdomlib: "text text || 1 ||"
    """
    if not text:
        return text
    
    # Normalize || N || spacing: ||1|| or || 1|| → || 1 ||
    text = re.sub(r'\|\|\s*(\d+(?:-\d+)?)\s*\|\|', r'|| \1 ||', text)
    
    # Clean up whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

# ============================================================================
# DATA CLASSES
# ============================================================================

@dataclass
class Verse:
    verse_number: str
    bengali: Optional[str] = None
    transliteration_en: Optional[str] = None
    translation_en: Optional[str] = None
    commentary_en: Optional[str] = None
    url: Optional[str] = None


@dataclass
class Chapter:
    chapter_number: int
    khanda_number: int
    khanda_name: str
    title_en: str
    title_ua: str = ""
    content_en: Optional[str] = None  # Introduction
    verses: List[Verse] = field(default_factory=list)
    url: Optional[str] = None


# ============================================================================
# PARSING FUNCTIONS
# ============================================================================

def fetch_page(url: str) -> Optional[str]:
    """Fetch HTML content from URL"""
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (compatible; VedaReader/1.0; +https://vedareader.org)"
        }
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        time.sleep(REQUEST_DELAY)
        return response.text
    except Exception as e:
        print(f"❌ Error fetching {url}: {e}")
        return None


def is_bengali(text: str) -> bool:
    """Check if text contains Bengali characters (U+0980–U+09FF)"""
    return bool(re.search(r'[\u0980-\u09FF]', text))


def is_devanagari(text: str) -> bool:
    """Check if text contains Devanagari characters (U+0900–U+097F)"""
    return bool(re.search(r'[\u0900-\u097F]', text))


def has_iast_diacritics(text: str) -> bool:
    """Check if text has IAST diacritical marks"""
    return bool(re.search(r'[āīūṛṝḷḹṃḥśṣṇṭḍñṅ]', text.lower()))


def extract_chapter_urls(html: str, khanda_name: str) -> List[Dict]:
    """Extract chapter URLs from khanda index page"""
    soup = BeautifulSoup(html, 'html.parser')
    chapters = []
    content = soup.select_one('#scontent') or soup.select_one('#pageContent') or soup.body
    if not content:
        return chapters

    # Use regex-based href matching because hrefs may include the book path
    for link in content.find_all('a', href=re.compile(r'/d/doc')):
        href = link.get('href', '')
        text = link.get_text(strip=True)

        # Match "Chapter X - Title" or just "Chapter X"
        match = re.match(r'Chapter\s+(\d+)(?:\s*[-–]\s*(.+))?', text, re.IGNORECASE)
        if match:
            chapter_num = int(match.group(1))
            title = match.group(2) or f"Chapter {chapter_num}"

            full_url = urljoin(BASE_URL, href)
            chapters.append({
                "number": chapter_num,
                "title": title.strip(),
                "url": full_url,
            })
    
    # Sort by chapter number
    chapters.sort(key=lambda x: x["number"])
    print(f"✅ Found {len(chapters)} chapters in {khanda_name}")
    return chapters


def extract_links_from_subcontents(html: str) -> List[Dict]:
    """Extract anchors from a 'Sub-Contents' block on a khanda index page.
    Returns list of dicts: {'text': text, 'url': full_url}
    """
    soup = BeautifulSoup(html, 'html.parser')
    results = []

    # Find any text node that mentions 'Sub-Contents' (case-insensitive)
    nodes = soup.find_all(string=re.compile(r'Sub-Contents', re.I))
    for node in nodes:
        parent = node.parent
        # Search upward a few levels to find a container with links
        container = parent
        found = False
        for _ in range(4):
            if container is None:
                break
            anchors = container.find_all('a', href=re.compile(r'/d/doc\d+\.html'))
            if anchors:
                for a in anchors:
                    text = a.get_text(strip=True)
                    href = a.get('href')
                    results.append({'text': text, 'url': urljoin(BASE_URL, href)})
                found = True
                break
            container = container.parent

        if found:
            continue

        # If not found upward, scan following siblings for a short range
        sib = parent.next_sibling
        steps = 0
        while sib and steps < 10:
            if isinstance(sib, (str,)):
                sib = sib.next_sibling
                steps += 1
                continue
            anchors = sib.find_all('a', href=re.compile(r'/d/doc\d+\.html'))
            if anchors:
                for a in anchors:
                    text = a.get_text(strip=True)
                    href = a.get('href')
                    results.append({'text': text, 'url': urljoin(BASE_URL, href)})
                break
            sib = sib.next_sibling
            steps += 1

    # Deduplicate preserving order
    seen = set()
    out = []
    for item in results:
        key = (item['text'], item['url'])
        if key in seen:
            continue
        seen.add(key)
        out.append(item)
    return out


def extract_verse_urls(html: str, chapter_url: str) -> List[Dict]:
    """Extract verse URLs from chapter page"""
    soup = BeautifulSoup(html, 'html.parser')
    verses = []
    
    content = soup.select_one('#scontent') or soup.select_one('#pageContent') or soup.body
    if not content:
        return verses

    for link in content.find_all('a', href=re.compile(r'/d/doc')):
        href = link.get('href', '')
        text = link.get_text(strip=True)

        # Match "Verse X.Y.Z" or "Verse X.Y.Z-W"
        match = re.match(r'Verse\s+(\d+)\.(\d+)\.(\d+(?:-\d+)?)', text, re.IGNORECASE)
        if match:
            verse_num = match.group(3)
            # Normalize dashes
            verse_num = verse_num.replace('–', '-').replace('—', '-').replace(' ', '')
            full_url = urljoin(BASE_URL, href)
            verses.append({
                "number": verse_num,
                "url": full_url,
            })
    
    # Sort by verse number (handle "352-353" format)
    def sort_key(v):
        num = v["number"].split("-")[0]
        return int(num)
    
    verses.sort(key=sort_key)
    return verses


def parse_verse_page(html: str, verse_url: str) -> Optional[Verse]:
    """Parse a single verse page"""
    soup = BeautifulSoup(html, 'html.parser')
    full_text = soup.get_text()
    
    # Extract verse number from URL or content
    verse_num = "1"
    match = re.search(r'Verse\s+\d+\.\d+\.(\d+(?:-\d+)?)', full_text, re.IGNORECASE)
    if match:
        verse_num = match.group(1)
    
    # Normalize dashes (en-dash, em-dash → regular dash)
    verse_num = verse_num.replace('–', '-').replace('—', '-').replace(' ', '')
    
    verse = Verse(verse_number=verse_num, url=verse_url)

    # First, try the specific Wisdomlib structure: Bengali often sits in
    # '#scontent > blockquote > p:nth-child(2)', transliteration in the first <p>
    content_node = soup.select_one('#scontent') or soup.select_one('#pageContent') or soup.body
    if content_node:
        bq = content_node.select_one('blockquote')
        if bq:
            p_nodes = bq.find_all('p')
            # Prefer explicit structure: Bengali often in p:nth-child(2),
            # transliteration in p:nth-child(4) > em (user-provided selector).
            if len(p_nodes) >= 2:
                second_p = p_nodes[1].get_text(strip=True)
                # Accept Bengali even if the paragraph contains stray Devanagari
                # characters (some pages include mixed scripts). Remove any
                # Devanagari letters and keep the Bengali portion.
                if is_bengali(second_p):
                    # Remove Devanagari *letters* but preserve common punctuation
                    # shared between scripts such as danda (\u0964) and double-danda (\u0965).
                    # Keep any Bengali letters/numerals intact.
                    cleaned = ''.join(
                        c for c in second_p
                        if not ('\u0900' <= c <= '\u097F' and c not in ('\u0964', '\u0965'))
                    )
                    if is_bengali(cleaned):
                        verse.bengali = process_bengali_text(cleaned)

            # Look for transliteration in the 4th <p> inside blockquote, inside <em>
            if len(p_nodes) >= 4:
                fourth_p = p_nodes[3]
                em_tag = fourth_p.find('em')
                if em_tag:
                    em_text = em_tag.get_text(strip=True)
                    if has_iast_diacritics(em_text):
                        verse.transliteration_en = process_transliteration(em_text)
            else:
                # Fallback: possible transliteration in the first paragraph
                if len(p_nodes) >= 1 and not verse.transliteration_en:
                    first_p = p_nodes[0].get_text(strip=True)
                    if has_iast_diacritics(first_p) and '||' in first_p:
                        verse.transliteration_en = process_transliteration(first_p)

    lines = [line.strip() for line in full_text.split('\n') if line.strip()]
    
    # 1. BENGALI TEXT
    # Must have Bengali chars, verse marker ॥, and NOT be Devanagari
    for line in lines:
        if is_bengali(line) and not is_devanagari(line):
            # Check for verse marker ॥ with Bengali numerals
            if re.search(r'॥\s*[\u09E6-\u09EF\d]+(?:-[\u09E6-\u09EF\d]+)?\s*॥', line):
                # Process: normalize dandas + add line breaks
                verse.bengali = process_bengali_text(line)
                break
    
    # 2. IAST TRANSLITERATION
    # Has diacritics, ends with || number ||, starts with lowercase
    # Example: "ājānu-lambita-bhujau kanakāvadātau ... || 1 ||"
    for line in lines:
        if not has_iast_diacritics(line):
            continue
        if not re.search(r'\|\|', line):
            continue
        if not re.match(r'^[a-zāīūṛṝḷḹṃḥśṣṇṭḍñṅ]', line):
            continue
        if re.search(r'\|\|\s*\d+(?:-\d+)?\s*\|\|', line):
            verse.transliteration_en = process_transliteration(line)
            break
    
    # 3. ENGLISH TRANSLATION
    # Pattern: starts with (number) after "English translation:" marker
    found_marker = False
    for line in lines:
        if re.search(r'English\s*translation\s*:', line, re.IGNORECASE):
            found_marker = True
            continue
        
        match = re.match(r'^\((\d+(?:-\d+)?)\)\s*(.+)', line)
        if match:
            text = match.group(2)
            if len(text) > 20 and re.search(r'[a-zA-Z]{3,}', text):
                verse.translation_en = line
                break
    
    # 4. COMMENTARY - Gauḍīya-bhāṣya
    commentary_parts = []
    in_commentary = False
    
    for line in lines:
        if not in_commentary:
            if re.search(r'Commentary:|Gauḍīya-bhāṣya', line, re.IGNORECASE):
                in_commentary = True
                # Get text after marker if on same line
                after = re.split(r'Commentary:\s*Gauḍīya-bhāṣya[^:]*:|Commentary:', line, flags=re.IGNORECASE)
                if len(after) > 1 and len(after[-1].strip()) > 20:
                    commentary_parts.append(after[-1].strip())
                continue
        else:
            # Stop conditions
            if re.match(r'^(Previous|Next|Like what you read|Let\'s grow together|parent:|source:)', line, re.IGNORECASE):
                break
            if re.match(r'^Verse\s+\d+\.\d+\.\d+', line, re.IGNORECASE):
                break
            if len(line) < 20:
                continue
            if is_bengali(line) or is_devanagari(line):
                continue
            
            commentary_parts.append(line)
    
    if commentary_parts:
        verse.commentary_en = "\n\n".join(commentary_parts)
    
    # Log result
    print(f"  ✅ Verse {verse_num}: "
          f"Bengali={'✓' if verse.bengali else '✗'} "
          f"Translit={'✓' if verse.transliteration_en else '✗'} "
          f"Trans={'✓' if verse.translation_en else '✗'} "
          f"Comm={'✓' if verse.commentary_en else '✗'}")
    
    if not verse.bengali and not verse.translation_en:
        print(f"  ⚠️ No content for verse {verse_num}")
        return None
    
    return verse


def parse_chapter_intro(html: str, khanda_num: int, chapter_num: int) -> Optional[str]:
    """Parse chapter introduction from 'Introduction to chapter X' page"""
    soup = BeautifulSoup(html, 'html.parser')
    full_text = soup.get_text()
    lines = [line.strip() for line in full_text.split('\n') if line.strip()]
    
    content_parts = []
    in_intro = False
    
    for line in lines:
        if re.search(r'Introduction to chapter\s+\d+', line, re.IGNORECASE):
            in_intro = True
            continue
        
        if not in_intro:
            continue
        
        # Stop conditions
        if re.match(r'^(Previous|Next|Like what you read|Let\'s grow together|parent:|source:)', line, re.IGNORECASE):
            break
        if re.match(r'^Verse\s+\d+\s*[-–]', line, re.IGNORECASE):
            break
        if re.match(r'^Chapter\s+\d+\s*[-–]', line, re.IGNORECASE):
            break
        
        if len(line) < 30:
            continue
        if re.search(r'by Bhumipati|1,349,850 words|16th century', line, re.IGNORECASE):
            continue
        
        content_parts.append(line)
    
    if content_parts:
        return "\n".join(f"<p>{p}</p>" for p in content_parts)
    return None


# ============================================================================
# SQL GENERATION
# ============================================================================

def escape_sql(s: str) -> str:
    """Escape string for SQL"""
    if s is None:
        return ""
    return s.replace("'", "''").replace("\\", "\\\\")


def generate_cantos_sql(book_id: str) -> str:
    """Generate SQL to create cantos for SCB"""
    lines = [
        "-- Create cantos (khaṇḍas) for Sri Chaitanya Bhagavata",
        "-- Run this FIRST before importing chapters",
        ""
    ]
    
    for name, config in KHANDA_CONFIG.items():
        lines.append(f"-- {config['title_en']}")
        lines.append(f"""INSERT INTO cantos (book_id, canto_number, title_en, title_ua, is_published)
VALUES ('{book_id}', {config['number']}, '{escape_sql(config['title_en'])}', '{escape_sql(config['title_ua'])}', true)
ON CONFLICT (book_id, canto_number) DO UPDATE SET 
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;
""")
    
    return "\n".join(lines)


def generate_chapter_sql(chapter: Chapter, book_id: str, canto_id: str) -> str:
    """Generate SQL to insert chapter and verses"""
    lines = [
        f"-- Chapter {chapter.khanda_number}.{chapter.chapter_number}: {chapter.title_en}",
        f"-- {len(chapter.verses)} verses",
        ""
    ]
    
    # Chapter insert
    content_en = escape_sql(chapter.content_en) if chapter.content_en else ""
    lines.append(f"""DO $$
DECLARE
    v_chapter_id UUID;
BEGIN
    -- Insert chapter
    INSERT INTO chapters (book_id, canto_id, chapter_number, title_en, title_ua, content_en, is_published)
    VALUES ('{book_id}', '{canto_id}', {chapter.chapter_number}, '{escape_sql(chapter.title_en)}', '{escape_sql(chapter.title_ua)}', '{content_en}', true)
    ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
        title_en = EXCLUDED.title_en,
        content_en = EXCLUDED.content_en
    RETURNING id INTO v_chapter_id;
    
    -- Insert verses""")
    
    for i, verse in enumerate(chapter.verses):
        sanskrit = escape_sql(verse.bengali) if verse.bengali else ""
        translit = escape_sql(verse.transliteration_en) if verse.transliteration_en else ""
        translation = escape_sql(verse.translation_en) if verse.translation_en else ""
        commentary = escape_sql(verse.commentary_en) if verse.commentary_en else ""
        sort_key = (i + 1) * 10
        
        lines.append(f"""    INSERT INTO verses (chapter_id, verse_number, sanskrit, transliteration_en, translation_en, commentary_en, sort_key, is_published)
    VALUES (v_chapter_id, '{verse.verse_number}', '{sanskrit}', '{translit}', '{translation}', '{commentary}', {sort_key}, true)
    ON CONFLICT DO NOTHING;
""")
    
    lines.append("END $$;")
    lines.append("")
    
    return "\n".join(lines)


# ============================================================================
# MAIN PARSING FLOW
# ============================================================================

def parse_chapter(khanda_name: str, chapter_num: int, chapter_url: str) -> Optional[Chapter]:
    """Parse a single chapter with all its verses"""
    config = KHANDA_CONFIG[khanda_name]
    
    print(f"\n📖 Parsing {config['title_en']} Chapter {chapter_num}...")
    
    # Fetch chapter page
    html = fetch_page(chapter_url)
    if not html:
        return None
    
    # Extract verse URLs
    verse_urls = extract_verse_urls(html, chapter_url)
    print(f"  Found {len(verse_urls)} verses")

    # Fallback: if the chapter page itself contains no verse links,
    # try scanning the khanda index page for verse links that belong to this chapter.
    if not verse_urls:
        print("  ℹ️ No verse links on chapter page — scanning khanda index for verse links...")
        index_html = fetch_page(config['index_url'])
        if index_html:
            # find verse links in the khanda index 'Sub-Contents' area and filter by chapter number
            candidate_links = []
            sub_links = extract_links_from_subcontents(index_html)
            for item in sub_links:
                text = item.get('text', '')
                href = item.get('url')
                m = re.match(r'Verse\s+(\d+)\.(\d+)\.(\d+(?:-\d+)?)', text, re.IGNORECASE)
                if m:
                    ch = int(m.group(2))
                    if ch == chapter_num:
                        verse_num = m.group(3).replace('–', '-').replace('—', '-').replace(' ', '')
                        candidate_links.append({'number': verse_num, 'url': href})
            # sort and adopt
            candidate_links.sort(key=lambda v: int(v['number'].split('-')[0]))
            verse_urls = candidate_links
            print(f"  Found {len(verse_urls)} verse links in khanda index for chapter {chapter_num}")
    
    # Extract chapter title from URL or page
    soup = BeautifulSoup(html, 'html.parser')
    title_el = soup.select_one('h1, h2, .title')
    title = title_el.get_text(strip=True) if title_el else f"Chapter {chapter_num}"
    
    chapter = Chapter(
        chapter_number=chapter_num,
        khanda_number=config["number"],
        khanda_name=khanda_name,
        title_en=title,
        url=chapter_url,
        verses=[]
    )
    
    # Parse each verse
    for v_info in verse_urls:
        v_html = fetch_page(v_info["url"])
        if v_html:
            verse = parse_verse_page(v_html, v_info["url"])
            if verse:
                chapter.verses.append(verse)
    
    print(f"  ✅ Parsed {len(chapter.verses)}/{len(verse_urls)} verses")
    return chapter


def parse_khanda(khanda_name: str) -> List[Chapter]:
    """Parse all chapters in a khanda"""
    config = KHANDA_CONFIG[khanda_name]
    
    print(f"\n📚 Parsing {config['title_en']}...")
    
    # Fetch khanda index
    html = fetch_page(config["index_url"])
    if not html:
        return []
    
    # Extract chapter URLs
    chapter_urls = extract_chapter_urls(html, khanda_name)
    
    chapters = []
    for ch_info in chapter_urls:
        chapter = parse_chapter(khanda_name, ch_info["number"], ch_info["url"])
        if chapter:
            chapter.title_en = ch_info["title"]
            chapters.append(chapter)
    
    return chapters


def main():
    parser = argparse.ArgumentParser(description="Parse Chaitanya Bhagavata from Wisdomlib")
    parser.add_argument("--khanda", choices=["adi", "madhya", "antya"], help="Khanda to parse")
    parser.add_argument("--chapter", type=int, help="Chapter number to parse")
    parser.add_argument("--all", action="store_true", help="Parse all khandas")
    parser.add_argument("--book-id", required=True, help="Book UUID from database")
    parser.add_argument("--canto-id", help="Canto UUID (required if parsing single chapter)")
    parser.add_argument("--output", default="scb_import.sql", help="Output SQL file")
    
    args = parser.parse_args()
    
    if args.all:
        # Parse everything
        all_chapters = []
        for khanda_name in ["adi", "madhya", "antya"]:
            chapters = parse_khanda(khanda_name)
            all_chapters.extend(chapters)
        
        # Generate SQL
        sql_parts = [generate_cantos_sql(args.book_id)]
        
        # Note: canto IDs need to be fetched from DB after cantos are created
        print("\n⚠️ After running cantos SQL, get canto IDs and run chapter imports")
        
    elif args.khanda and args.chapter:
        if not args.canto_id:
            print("❌ --canto-id required when parsing single chapter")
            return
        
        config = KHANDA_CONFIG[args.khanda]
        
        # First get chapter URL from index
        html = fetch_page(config["index_url"])
        if not html:
            return
        
        chapter_urls = extract_chapter_urls(html, args.khanda)
        ch_info = next((c for c in chapter_urls if c["number"] == args.chapter), None)
        
        if not ch_info:
            print(f"❌ Chapter {args.chapter} not found in {args.khanda}")
            return
        
        chapter = parse_chapter(args.khanda, args.chapter, ch_info["url"])
        if chapter:
            chapter.title_en = ch_info["title"]
            sql = generate_chapter_sql(chapter, args.book_id, args.canto_id)
            
            with open(args.output, 'w', encoding='utf-8') as f:
                f.write(sql)
            
            print(f"\n✅ SQL written to {args.output}")
    
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
