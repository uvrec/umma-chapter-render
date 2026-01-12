#!/usr/bin/env python3
"""
Parser for Baul Sangit book from kksongs.org
12 songs by Bhaktivinoda Thakura (1893) written under pen name "Chand Baul"
"""

import json
import re
import time
import requests
from bs4 import BeautifulSoup
from pathlib import Path

# 12 songs in Baul Sangit
BAUL_SANGIT_SONGS = [
    {"song": 1, "title": "Ami Tomar Duhkher Duhkhi",
     "url": "https://kksongs.org/songs/a/amitomarduhkher.html",
     "bengali_url": "https://kksongs.org/unicode/a/amitomarduhkher_beng.html"},
    {"song": 2, "title": "Dharma Pathe Thaki",
     "url": "https://kksongs.org/songs/d/dharmapathethaki.html",
     "bengali_url": "https://kksongs.org/unicode/d/dharmapathethaki_beng.html"},
    {"song": 3, "title": "Asa Loko Tha Bolte",
     "url": "https://kksongs.org/songs/a/asalokothabolte.html",
     "bengali_url": "https://kksongs.org/unicode/a/asalokothabolte_beng.html"},
    {"song": 4, "title": "Baul Baul Bolche Sabe",
     "url": "https://kksongs.org/songs/b/baulbaulbolchesabe.html",
     "bengali_url": "https://kksongs.org/unicode/b/baulbaulbolchesabe_beng.html"},
    {"song": 5, "title": "Manusa Bhajana Korcho",
     "url": "https://kksongs.org/songs/m/manusabhajankorcho.html",
     "bengali_url": "https://kksongs.org/unicode/m/manusabhajankorcho_beng.html"},
    {"song": 6, "title": "Eo To Eka Kalir Cela",
     "url": "https://kksongs.org/songs/e/eotoekakalircela.html",
     "bengali_url": "https://kksongs.org/unicode/e/eotoekakalircela_beng.html"},
    {"song": 7, "title": "Hunsar Theko Bhulo Nako",
     "url": "https://kksongs.org/songs/h/hunsarthekobhulonako.html",
     "bengali_url": "https://kksongs.org/unicode/h/hunsarthekobhulonako_beng.html"},
    {"song": 8, "title": "Maner Mala Japa Bij Akhon",
     "url": "https://kksongs.org/songs/m/manermalajapbijakhon.html",
     "bengali_url": "https://kksongs.org/unicode/m/manermalajapbijakhon_beng.html"},
    {"song": 9, "title": "Ghore Bose Baul Haore Mon",
     "url": "https://kksongs.org/songs/g/ghorebosebaulhaoremon.html",
     "bengali_url": "https://kksongs.org/unicode/g/ghorebosebaulhaoremon_beng.html"},
    {"song": 10, "title": "Balavan Vairagi Thakura",
     "url": "https://kksongs.org/songs/b/balavanvairagithakura.html",
     "bengali_url": "https://kksongs.org/unicode/b/balavanvairagithakura_beng.html"},
    {"song": 11, "title": "Keno Bheker Prayas",
     "url": "https://kksongs.org/songs/k/kenobhekerprayas.html",
     "bengali_url": "https://kksongs.org/unicode/k/kenobhekerprayas_beng.html"},
    {"song": 12, "title": "Hoye Visaye Avesa",
     "url": "https://kksongs.org/songs/h/hoyevisayeavesa.html",
     "bengali_url": "https://kksongs.org/unicode/h/hoyevisayeavesa_beng.html"},
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


def clean_verse_preserve_lines(text: str) -> str:
    """Clean whitespace while preserving line breaks."""
    text = text.replace('\x92', "'")
    text = re.sub(r'(UPDATED|UDPATED):?[^\n]*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'www\.kksongs\.org.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'Krsna Kirtana Songs.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{1,2},?\s*\n?\s*\d{4}', '', text, flags=re.IGNORECASE)

    lines = []
    for line in text.split('\n'):
        cleaned = ' '.join(line.split())
        if cleaned:
            lines.append(cleaned)

    return '\n'.join(lines)


def parse_bengali_page(html: str) -> list[str]:
    """Extract Bengali verses from unicode page."""
    soup = BeautifulSoup(html, 'html.parser')
    preserve_line_breaks(soup)
    text = soup.get_text()

    verse_pattern = re.compile(r'\(([১২৩৪৫৬৭৮৯০\d]+)\)')
    matches = list(verse_pattern.finditer(text))

    verses = []
    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        verse_text = text[start:end].strip()
        verse_text = clean_verse_preserve_lines(verse_text)

        if verse_text and any('\u0980' <= c <= '\u09FF' for c in verse_text):
            verses.append(verse_text)

    return verses


def parse_main_page(html: str) -> dict:
    """Extract transliteration and translation from main page."""
    soup = BeautifulSoup(html, 'html.parser')
    preserve_line_breaks(soup)

    result = {
        'transliteration': [],
        'translation': []
    }

    text = soup.get_text()
    lines = text.split('\n')

    current_section = None
    current_verse = []

    transliteration_markers = ['LYRICS', 'TRANSLITERATION']
    translation_markers = ['TRANSLATION', 'MEANING']

    for line in lines:
        line_upper = line.strip().upper()

        if any(marker in line_upper for marker in transliteration_markers):
            current_section = 'transliteration'
            continue
        elif any(marker in line_upper for marker in translation_markers):
            if current_section == 'transliteration' and current_verse:
                result['transliteration'].append('\n'.join(current_verse))
                current_verse = []
            current_section = 'translation'
            continue
        elif 'WORD FOR WORD' in line_upper or 'SYNONYMS' in line_upper:
            if current_section and current_verse:
                result[current_section].append('\n'.join(current_verse))
                current_verse = []
            current_section = None
            continue

        verse_match = re.match(r'^\s*\(?\s*(\d+)\s*\)?\s*$', line.strip())
        if verse_match and current_section:
            if current_verse:
                result[current_section].append('\n'.join(current_verse))
                current_verse = []
            continue

        if current_section and line.strip():
            cleaned = clean_verse_preserve_lines(line.strip())
            if cleaned:
                current_verse.append(cleaned)

    if current_section and current_verse:
        result[current_section].append('\n'.join(current_verse))

    return result


def parse_all_songs():
    """Parse all songs and create JSON."""
    print(f"Parsing {len(BAUL_SANGIT_SONGS)} songs from Baul Sangit...")

    songs = []

    for i, song_info in enumerate(BAUL_SANGIT_SONGS):
        print(f"\n[{i+1}/{len(BAUL_SANGIT_SONGS)}] {song_info['title']}")

        song_data = {
            "song_number": song_info['song'],
            "title_en": song_info['title'],
            "title_ua": "",
        }

        # Fetch Bengali text
        print(f"  Fetching Bengali...")
        bengali_html = fetch_page(song_info['bengali_url'])
        if bengali_html:
            bengali_verses = parse_bengali_page(bengali_html)
            song_data['bengali'] = bengali_verses
            print(f"    Found {len(bengali_verses)} Bengali verses")

        # Fetch main page
        print(f"  Fetching main page...")
        main_html = fetch_page(song_info['url'])
        if main_html:
            main_data = parse_main_page(main_html)
            song_data['transliteration'] = main_data['transliteration']
            song_data['translation'] = main_data['translation']
            print(f"    Found {len(main_data['transliteration'])} transliteration, {len(main_data['translation'])} translation")

        songs.append(song_data)
        time.sleep(0.3)

    # Build final structure
    output = {
        "book_slug": "baul-sangit",
        "book_title_en": "Baul Sangit",
        "book_title_bn": "বাউল সংগীত",
        "book_title_ua": "Баул Санґіт",
        "author_en": "Bhaktivinoda Thakura",
        "author_ua": "Бгактівінод Тхакур",
        "pen_name": "Chand Baul",
        "year": 1893,
        "source": "https://kksongs.org/authors/literature/baulsangit.html",
        "songs": songs,
        "total_songs": len(songs),
        "metadata": {
            "parsed_date": time.strftime("%Y-%m-%d"),
            "source_website": "kksongs.org"
        }
    }

    return output


def main():
    output_path = Path(__file__).parent.parent / "src" / "data" / "baul-sangit-parsed.json"

    data = parse_all_songs()

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Saved to {output_path}")
    print(f"  Total songs: {data['total_songs']}")


if __name__ == "__main__":
    main()
