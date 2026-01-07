#!/usr/bin/env python3
"""
Parser for Saranagati book from kksongs.org
Extracts Bengali text, transliteration, translation, and purports.
"""

import json
import re
import time
import requests
from bs4 import BeautifulSoup
from pathlib import Path

# Song data structure
SARANAGATI_SONGS = [
    # Section 1: Introduction
    {"section": 1, "section_title": "Introduction", "section_title_en": "Introduction",
     "song": 1, "title": "Sri Krsna Caitanya Prabhu Jive Doya Kori",
     "url": "http://kksongs.org/songs/s/srikrsnacaitanyaprabhujive.html",
     "bengali_url": "http://kksongs.org/unicode/s/srikrsnacaitanyaprabhujive_beng.html"},

    # Section 2: Dainya
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 1, "title": "Bhuliya Tomare",
     "url": "http://kksongs.org/songs/b/bhuliyatomare.html",
     "bengali_url": "http://kksongs.org/unicode/b/bhuliyatomar_beng.html",
     "purport_url": "http://kksongs.org/authors/purports/bhuliyatomare_acbsp.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 2, "title": "Vidyara Vilase Katainu Kala",
     "url": "http://kksongs.org/songs/v/vidyaravilasekatainukala.html",
     "bengali_url": "http://kksongs.org/unicode/v/vidyaravilase_beng.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 3, "title": "Yauvane Jakhon Dhana Uparjane",
     "url": "http://kksongs.org/songs/y/yauvanejakhondhana.html",
     "bengali_url": "http://kksongs.org/unicode/y/yauvanejakhondhana_beng.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 4, "title": "Amar Jivan",
     "url": "http://kksongs.org/songs/a/amarjivan.html",
     "bengali_url": "http://kksongs.org/unicode/a/amarjivan_beng.html",
     "purport_url": "http://kksongs.org/authors/purports/amarjivan_acbsp.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 5, "title": "Suno Mor Duhkher Kahini",
     "url": "http://kksongs.org/songs/s/sunomorduhkherkahani.html",
     "bengali_url": "http://kksongs.org/unicode/s/sunomorduhkherkahani_beng.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 6, "title": "Tuwa Pade E Minati Mor",
     "url": "http://kksongs.org/songs/t/tuwapadeeminatimor.html",
     "bengali_url": "http://kksongs.org/unicode/t/tuwapadeeminatimor_beng.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 7, "title": "Emona Durmati",
     "url": "http://kksongs.org/songs/e/emonadurmati.html",
     "bengali_url": "http://kksongs.org/unicode/e/emonadurmati_beng.html"},

    # Section 3: Atma Nivedana
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 1, "title": "Na Korolun Karama",
     "url": "http://kksongs.org/songs/n/nakorolunkarama.html",
     "bengali_url": "http://kksongs.org/unicode/n/nakorolunkarama_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 2, "title": "Kohabun Ki Sarama Ki Bat",
     "url": "http://kksongs.org/songs/k/kohabunkisaramakibat.html",
     "bengali_url": "http://kksongs.org/unicode/k/kohabunkisaramakibat_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 3, "title": "Manasa Deho Geho Jo Kichu Mor",
     "url": "http://kksongs.org/songs/m/manasadeho.html",
     "bengali_url": "http://kksongs.org/unicode/m/manasadehogeho_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 4, "title": "Aham Mama Saba Arthe",
     "url": "http://kksongs.org/songs/a/ahammamasabdaarthe.html",
     "bengali_url": "http://kksongs.org/unicode/a/ahammamasabdaarthe_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 5, "title": "Amar Bolite Prabhu",
     "url": "http://kksongs.org/songs/a/amarboliteprabhu.html",
     "bengali_url": "http://kksongs.org/unicode/a/amarboliteprabhu_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 6, "title": "Bastutoh Sakali Tava",
     "url": "http://kksongs.org/songs/b/bastutohsakalitava.html",
     "bengali_url": "http://kksongs.org/unicode/b/bastutohsakalitava_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 7, "title": "Nivedana Kori Prabhu Tomara Carane",
     "url": "http://kksongs.org/songs/n/nivedanakoriprabhu.html",
     "bengali_url": "http://kksongs.org/unicode/n/nivedanakoriprabhu_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 8, "title": "Atma Nivedana Tuwa Pade",
     "url": "http://kksongs.org/songs/a/atmanivedanatuwapade.html",
     "bengali_url": "http://kksongs.org/unicode/a/atmanivedanatuwapade_beng.html"},

    # Section 4: Goptritve Varana
    {"section": 4, "section_title": "Goptritve Varana", "section_title_en": "Embracing the Lord's Guardianship",
     "song": 1, "title": "Ki Jani Ki Bale",
     "url": "http://kksongs.org/songs/k/kijanikibale.html",
     "bengali_url": "http://kksongs.org/unicode/k/kijanikibale_beng.html"},
    {"section": 4, "section_title": "Goptritve Varana", "section_title_en": "Embracing the Lord's Guardianship",
     "song": 2, "title": "Dara Putra Nijo Deho",
     "url": "http://kksongs.org/songs/d/daraputranijadeho.html",
     "bengali_url": "http://kksongs.org/unicode/d/daraputranijadeho_beng.html"},
    {"section": 4, "section_title": "Goptritve Varana", "section_title_en": "Embracing the Lord's Guardianship",
     "song": 3, "title": "Sarvasva Tomar Carane",
     "url": "http://kksongs.org/songs/s/sarvasvatomar.html",
     "bengali_url": "http://kksongs.org/unicode/s/sarvasvatomar_beng.html"},
    {"section": 4, "section_title": "Goptritve Varana", "section_title_en": "Embracing the Lord's Guardianship",
     "song": 4, "title": "Tumi Sarveswareswara Vrajendra Kumar",
     "url": "http://kksongs.org/songs/t/tumisarveswareswara.html",
     "bengali_url": "http://kksongs.org/unicode/t/tumisarveswareswara_beng.html"},

    # Section 5: Avasya Raksibe Krsna Visvasa Palana
    {"section": 5, "section_title": "Avasya Raksibe Krsna Visvasa Palana", "section_title_en": "Maintaining Faith that Krsna Will Surely Protect",
     "song": 1, "title": "Ekhona Bujhinu",
     "url": "http://kksongs.org/songs/e/ekhonabujhinu.html",
     "bengali_url": "http://kksongs.org/unicode/e/ekhonabujhinu_beng.html"},
    {"section": 5, "section_title": "Avasya Raksibe Krsna Visvasa Palana", "section_title_en": "Maintaining Faith that Krsna Will Surely Protect",
     "song": 2, "title": "Tumi To Maribe Jare",
     "url": "http://kksongs.org/songs/t/tumitomaribe.html",
     "bengali_url": "http://kksongs.org/unicode/t/tumitomaribe_beng.html"},
    {"section": 5, "section_title": "Avasya Raksibe Krsna Visvasa Palana", "section_title_en": "Maintaining Faith that Krsna Will Surely Protect",
     "song": 3, "title": "Atma Samarpane Gela Abhiman",
     "url": "http://kksongs.org/songs/a/atmasamarpanegela.html",
     "bengali_url": "http://kksongs.org/unicode/a/atmasamarpanegela_beng.html"},
    {"section": 5, "section_title": "Avasya Raksibe Krsna Visvasa Palana", "section_title_en": "Maintaining Faith that Krsna Will Surely Protect",
     "song": 4, "title": "Chorato Purusa Abhiman",
     "url": "http://kksongs.org/songs/c/choratopurusaabhiman.html",
     "bengali_url": "http://kksongs.org/unicode/c/choratopurusaabhiman_beng.html"},

    # Section 6: Bhakti Anukula Matra Karyera Svikara
    {"section": 6, "section_title": "Bhakti Anukula Matra Karyera Svikara", "section_title_en": "Acceptance Only of Activities Favorable to Devotion",
     "song": 1, "title": "Tuwa Bhakti Anukula",
     "url": "http://kksongs.org/songs/t/tuwabhaktianukula.html",
     "bengali_url": "http://kksongs.org/unicode/t/tuwabhaktianukula_beng.html"},
    {"section": 6, "section_title": "Bhakti Anukula Matra Karyera Svikara", "section_title_en": "Acceptance Only of Activities Favorable to Devotion",
     "song": 2, "title": "Godruma Dhame Bhajana",
     "url": "http://kksongs.org/songs/g/godrumadhamebhajana.html",
     "bengali_url": "http://kksongs.org/unicode/g/godrumadhamebhajana_beng.html"},
    {"section": 6, "section_title": "Bhakti Anukula Matra Karyera Svikara", "section_title_en": "Acceptance Only of Activities Favorable to Devotion",
     "song": 3, "title": "Suddha Bhakata Carana Renu",
     "url": "http://kksongs.org/songs/s/suddhabhakata.html",
     "bengali_url": "http://kksongs.org/unicode/s/suddhabhakata_beng.html"},
    {"section": 6, "section_title": "Bhakti Anukula Matra Karyera Svikara", "section_title_en": "Acceptance Only of Activities Favorable to Devotion",
     "song": 4, "title": "Radha Kunda Tata Kunja Kutir",
     "url": "http://kksongs.org/songs/r/radhakundatata.html",
     "bengali_url": "http://kksongs.org/unicode/r/radhakundatata_beng.html"},

    # Section 7: Bhakti Pratikula Bhava Varjanangikara
    {"section": 7, "section_title": "Bhakti Pratikula Bhava Varjanangikara", "section_title_en": "Rejection of Activities Unfavorable to Devotion",
     "song": 1, "title": "Kesava Tuwa Jagata Vicitra",
     "url": "http://kksongs.org/songs/k/kesavatuwajagata.html",
     "bengali_url": "http://kksongs.org/unicode/k/kesavatuwajagata_beng.html"},
    {"section": 7, "section_title": "Bhakti Pratikula Bhava Varjanangikara", "section_title_en": "Rejection of Activities Unfavorable to Devotion",
     "song": 2, "title": "Tuwa Bhakti Pratikula",
     "url": "http://kksongs.org/songs/t/tuwabhaktipratikula.html",
     "bengali_url": "http://kksongs.org/unicode/t/tuwabhaktipratikula_beng.html"},
    {"section": 7, "section_title": "Bhakti Pratikula Bhava Varjanangikara", "section_title_en": "Rejection of Activities Unfavorable to Devotion",
     "song": 3, "title": "Visaya Bimudha Ar Mayavadi",
     "url": "http://kksongs.org/songs/v/visayabimudhaar.html",
     "bengali_url": "http://kksongs.org/unicode/v/visayabimudhaar_beng.html"},
    {"section": 7, "section_title": "Bhakti Pratikula Bhava Varjanangikara", "section_title_en": "Rejection of Activities Unfavorable to Devotion",
     "song": 4, "title": "Ami To Swananda Sukhada Vasi",
     "url": "http://kksongs.org/songs/a/amitoswananda.html",
     "bengali_url": "http://kksongs.org/unicode/a/amitoswananda_beng.html"},

    # Section 8: Bhajana Lalasa
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 1, "title": "Prapance Poriya Agati",
     "url": "http://kksongs.org/songs/p/prapanceporiya.html",
     "bengali_url": "http://kksongs.org/unicode/p/prapanceporiya_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 2, "title": "Arthera Sancaye",
     "url": "http://kksongs.org/songs/a/artherasancaye.html",
     "bengali_url": "http://kksongs.org/unicode/a/artherasancaye_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 3, "title": "Bhajane Utsaha Bhaktite Visvasa",
     "url": "http://kksongs.org/songs/b/bhajaneutsaha.html",
     "bengali_url": "http://kksongs.org/unicode/b/bhajaneutsaha_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 4, "title": "Dana Pratigraha Mitho",
     "url": "http://kksongs.org/songs/d/danapratigraha.html",
     "bengali_url": "http://kksongs.org/unicode/d/danapratigraha_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 5, "title": "Sanga Dosa Sunya",
     "url": "http://kksongs.org/songs/s/sangadosasunya.html",
     "bengali_url": "http://kksongs.org/unicode/s/sangadosasunya_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 6, "title": "Nira Dharma Gata",
     "url": "http://kksongs.org/songs/n/niradharmagata.html",
     "bengali_url": "http://kksongs.org/unicode/n/niradharmagata_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 7, "title": "Ohe Vaisnava Thakura",
     "url": "http://kksongs.org/songs/o/ohevaisnava.html",
     "bengali_url": "http://kksongs.org/unicode/o/ohevaisnava_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 8, "title": "Tomare Bhuliya",
     "url": "http://kksongs.org/songs/t/tomarebhuliya.html",
     "bengali_url": "http://kksongs.org/unicode/t/tomarebhuliya_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 9, "title": "Sri Rupa Gosai Sri Guru Rupete",
     "url": "http://kksongs.org/songs/s/srirupagosaisrigururupete.html",
     "bengali_url": "http://kksongs.org/unicode/s/srirupagosaisrigururupete_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 10, "title": "Gurudeva Boro Krpa Kori",
     "url": "http://kksongs.org/songs/g/gurudeva1.html",
     "bengali_url": "http://kksongs.org/unicode/g/gurudeva6_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 11, "title": "Gurudeva Krpa Bindu Diya",
     "url": "http://kksongs.org/songs/g/gurudeva4.html",
     "bengali_url": "http://kksongs.org/unicode/g/gurudeva4_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 12, "title": "Gurudeva Kabe Mora Sei",
     "url": "http://kksongs.org/songs/g/gurudeva2.html",
     "bengali_url": "http://kksongs.org/unicode/g/gurudeva2_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 13, "title": "Gurudeva Kabe Tava Karuna",
     "url": "http://kksongs.org/songs/g/gurudeva3.html",
     "bengali_url": "http://kksongs.org/unicode/g/gurudeva3_beng.html"},

    # Section 9: Siddhi Lalasa
    {"section": 9, "section_title": "Siddhi Lalasa", "section_title_en": "Longing for Spiritual Perfection",
     "song": 1, "title": "Kabe Gaura Vane",
     "url": "http://kksongs.org/songs/k/kabegauravane.html",
     "bengali_url": "http://kksongs.org/unicode/k/kabegauravane_beng.html"},
    {"section": 9, "section_title": "Siddhi Lalasa", "section_title_en": "Longing for Spiritual Perfection",
     "song": 2, "title": "Dekhite Dekhite",
     "url": "http://kksongs.org/songs/d/dekhitedekhite.html",
     "bengali_url": "http://kksongs.org/unicode/d/dekhitedekhite_beng.html"},
    {"section": 9, "section_title": "Siddhi Lalasa", "section_title_en": "Longing for Spiritual Perfection",
     "song": 3, "title": "Vrsabhanu Suta Carana Sevane",
     "url": "http://kksongs.org/songs/v/vrsabhanusutacarana.html",
     "bengali_url": "http://kksongs.org/unicode/v/vrsabhanusutacarana_beng.html"},

    # Section 10: Vijnapti
    {"section": 10, "section_title": "Vijnapti", "section_title_en": "Heartfelt Prayer",
     "song": 1, "title": "Kabe Ha'be Bolo Sei Dina Amar",
     "url": "http://kksongs.org/songs/k/kabehabebolo.html",
     "bengali_url": "http://kksongs.org/unicode/k/kabehabebolo_beng.html"},

    # Section 11: Sri Nama Mahatmya
    {"section": 11, "section_title": "Sri Nama Mahatmya", "section_title_en": "The Glories of the Holy Name",
     "song": 1, "title": "Krsna Nama Dhare Kato Bal",
     "url": "http://kksongs.org/songs/k/krsnanamadhare.html",
     "bengali_url": "http://kksongs.org/unicode/k/krsnanamadhare_beng.html"},
]


HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}


def fetch_page(url: str, retries: int = 3) -> str | None:
    """Fetch a page with retries."""
    # Always use https
    url = url.replace('http://', 'https://')
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=HEADERS, timeout=30)
            response.raise_for_status()
            return response.text
        except Exception as e:
            print(f"  Attempt {attempt + 1} failed for {url}: {e}")
            if attempt < retries - 1:
                time.sleep(2)
    return None


def parse_bengali_page(html: str) -> list[str]:
    """Extract Bengali verses from unicode page."""
    soup = BeautifulSoup(html, 'html.parser')

    # Find the lyrics section
    verses = []

    # Look for text containing Bengali numerals (১, ২, ৩, etc.)
    text = soup.get_text()

    # Split by verse numbers
    verse_pattern = re.compile(r'\(([০-৯]+)\)')
    parts = verse_pattern.split(text)

    current_verse = ""
    for i, part in enumerate(parts):
        if verse_pattern.match(f"({part})"):
            if current_verse.strip():
                verses.append(current_verse.strip())
            current_verse = ""
        else:
            current_verse += part

    if current_verse.strip():
        verses.append(current_verse.strip())

    # Clean up verses
    cleaned = []
    for v in verses:
        # Remove extra whitespace
        v = ' '.join(v.split())
        if v and any('\u0980' <= c <= '\u09FF' for c in v):  # Contains Bengali
            cleaned.append(v)

    return cleaned


def parse_main_page(html: str) -> dict:
    """Extract transliteration and translation from main song page."""
    soup = BeautifulSoup(html, 'html.parser')

    result = {
        "transliteration": [],
        "translation": []
    }

    # Find lyrics section
    lyrics_section = soup.find('div', class_='lyrics') or soup.find(id='lyrics')
    if not lyrics_section:
        # Try finding by text pattern
        lyrics_section = soup

    text = lyrics_section.get_text() if lyrics_section else soup.get_text()

    # Find transliteration (lines with diacritics like ā, ī, ū, etc.)
    lines = text.split('\n')

    in_transliteration = False
    in_translation = False
    current_translit = []
    current_trans = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Check for verse numbers
        verse_match = re.match(r'^\((\d+)\)', line)
        if verse_match:
            if current_translit:
                result["transliteration"].append('\n'.join(current_translit))
                current_translit = []
            if current_trans:
                result["translation"].append('\n'.join(current_trans))
                current_trans = []

        # Detect transliteration by diacritics
        has_diacritics = any(c in line for c in 'āīūṛṝḷḹēōṃḥṅñṭḍṇśṣ')
        has_latin = any('a' <= c.lower() <= 'z' for c in line)

        if has_diacritics and has_latin:
            current_translit.append(line)
        elif has_latin and not has_diacritics and len(line) > 20:
            # Likely translation
            current_trans.append(line)

    # Add last verses
    if current_translit:
        result["transliteration"].append('\n'.join(current_translit))
    if current_trans:
        result["translation"].append('\n'.join(current_trans))

    return result


def parse_purport_page(html: str) -> str:
    """Extract purport text."""
    soup = BeautifulSoup(html, 'html.parser')

    # Find main content
    content = soup.find('div', class_='content') or soup.find('body')
    if content:
        # Remove navigation and headers
        for tag in content.find_all(['nav', 'header', 'footer', 'script', 'style']):
            tag.decompose()

        text = content.get_text()
        # Clean up
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        return '\n\n'.join(lines)

    return ""


def parse_all_songs():
    """Parse all songs and create JSON."""
    print(f"Parsing {len(SARANAGATI_SONGS)} songs from Saranagati...")

    sections = {}

    for i, song_info in enumerate(SARANAGATI_SONGS):
        print(f"\n[{i+1}/{len(SARANAGATI_SONGS)}] {song_info['title']}")

        section_num = song_info['section']
        if section_num not in sections:
            sections[section_num] = {
                "section_number": section_num,
                "title": song_info['section_title'],
                "title_english": song_info['section_title_en'],
                "songs": []
            }

        song_data = {
            "song_number": song_info['song'],
            "title": song_info['title'],
            "url": song_info['url'],
            "bengali_url": song_info['bengali_url'],
        }

        # Fetch Bengali text
        print(f"  Fetching Bengali...")
        bengali_html = fetch_page(song_info['bengali_url'])
        if bengali_html:
            bengali_verses = parse_bengali_page(bengali_html)
            song_data['bengali'] = bengali_verses
            print(f"    Found {len(bengali_verses)} Bengali verses")

        # Fetch main page for transliteration/translation
        print(f"  Fetching main page...")
        main_html = fetch_page(song_info['url'])
        if main_html:
            main_data = parse_main_page(main_html)
            song_data['transliteration'] = main_data['transliteration']
            song_data['translation'] = main_data['translation']
            print(f"    Found {len(main_data['transliteration'])} transliteration verses")
            print(f"    Found {len(main_data['translation'])} translation verses")

        # Fetch purport if available
        if 'purport_url' in song_info:
            print(f"  Fetching purport...")
            song_data['purport_url'] = song_info['purport_url']
            purport_html = fetch_page(song_info['purport_url'])
            if purport_html:
                purport = parse_purport_page(purport_html)
                if purport:
                    song_data['purport'] = purport
                    print(f"    Found purport ({len(purport)} chars)")

        sections[section_num]['songs'].append(song_data)

        # Rate limiting
        time.sleep(0.5)

    # Build final structure
    output = {
        "book_slug": "saranagati",
        "book_title_en": "Saranagati",
        "book_title_bn": "শরণাগতি",
        "author": "Bhaktivinoda Thakura",
        "source": "https://kksongs.org/authors/literature/saranagati.html",
        "sections": [sections[i] for i in sorted(sections.keys())],
        "total_songs": len(SARANAGATI_SONGS),
        "metadata": {
            "parsed_date": time.strftime("%Y-%m-%d"),
            "source_website": "kksongs.org"
        }
    }

    return output


def main():
    output_path = Path(__file__).parent.parent / "src" / "data" / "saranagati-parsed.json"

    data = parse_all_songs()

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\n✓ Saved to {output_path}")
    print(f"  Total sections: {len(data['sections'])}")
    print(f"  Total songs: {data['total_songs']}")


if __name__ == "__main__":
    main()
