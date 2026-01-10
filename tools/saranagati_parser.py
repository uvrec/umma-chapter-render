#!/usr/bin/env python3
"""
Improved parser for Saranagati book from kksongs.org
Extracts Bengali text, transliteration, translation, and purports.
"""

import json
import re
import time
import requests
from bs4 import BeautifulSoup
from html import unescape
from pathlib import Path

# Song data structure - same as before
SARANAGATI_SONGS = [
    # Section 1: Introduction
    {"section": 1, "section_title": "Introduction", "section_title_en": "Introduction",
     "song": 1, "title": "Sri Krsna Caitanya Prabhu Jive Doya Kori",
     "url": "https://kksongs.org/songs/s/srikrsnacaitanyaprabhujive.html",
     "bengali_url": "https://kksongs.org/unicode/s/srikrsnacaitanyaprabhujive_beng.html"},

    # Section 2: Dainya
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 1, "title": "Bhuliya Tomare",
     "url": "https://kksongs.org/songs/b/bhuliyatomare.html",
     "bengali_url": "https://kksongs.org/unicode/b/bhuliyatomar_beng.html",
     "purport_url": "https://kksongs.org/authors/purports/bhuliyatomare_acbsp.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 2, "title": "Vidyara Vilase Katainu Kala",
     "url": "https://kksongs.org/songs/v/vidyaravilasekatainukala.html",
     "bengali_url": "https://kksongs.org/unicode/v/vidyaravilase_beng.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 3, "title": "Yauvane Jakhon Dhana Uparjane",
     "url": "https://kksongs.org/songs/y/yauvanejakhondhana.html",
     "bengali_url": "https://kksongs.org/unicode/y/yauvanejakhondhana_beng.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 4, "title": "Amar Jivan",
     "url": "https://kksongs.org/songs/a/amarjivan.html",
     "bengali_url": "https://kksongs.org/unicode/a/amarjivan_beng.html",
     "purport_url": "https://kksongs.org/authors/purports/amarjivan_acbsp.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 5, "title": "Suno Mor Duhkher Kahini",
     "url": "https://kksongs.org/songs/s/sunomorduhkherkahani.html",
     "bengali_url": "https://kksongs.org/unicode/s/sunomorduhkherkahani_beng.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 6, "title": "Tuwa Pade E Minati Mor",
     "url": "https://kksongs.org/songs/t/tuwapadeeminatimor.html",
     "bengali_url": "https://kksongs.org/unicode/t/tuwapadeeminatimor_beng.html"},
    {"section": 2, "section_title": "Dainya", "section_title_en": "Humility",
     "song": 7, "title": "Emona Durmati",
     "url": "https://kksongs.org/songs/e/emonadurmati.html",
     "bengali_url": "https://kksongs.org/unicode/e/emonadurmati_beng.html"},

    # Section 3: Atma Nivedana
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 1, "title": "Na Korolun Karama",
     "url": "https://kksongs.org/songs/n/nakorolunkarama.html",
     "bengali_url": "https://kksongs.org/unicode/n/nakorolunkarama_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 2, "title": "Kohabun Ki Sarama Ki Bat",
     "url": "https://kksongs.org/songs/k/kohabunkisaramakibat.html",
     "bengali_url": "https://kksongs.org/unicode/k/kohabunkisaramakibat_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 3, "title": "Manasa Deho Geho Jo Kichu Mor",
     "url": "https://kksongs.org/songs/m/manasadeho.html",
     "bengali_url": "https://kksongs.org/unicode/m/manasadehogeho_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 4, "title": "Aham Mama Saba Arthe",
     "url": "https://kksongs.org/songs/a/ahammamasabdaarthe.html",
     "bengali_url": "https://kksongs.org/unicode/a/ahammamasabdaarthe_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 5, "title": "Amar Bolite Prabhu",
     "url": "https://kksongs.org/songs/a/amarboliteprabhu.html",
     "bengali_url": "https://kksongs.org/unicode/a/amarboliteprabhu_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 6, "title": "Bastutoh Sakali Tava",
     "url": "https://kksongs.org/songs/b/bastutohsakalitava.html",
     "bengali_url": "https://kksongs.org/unicode/b/bastutohsakalitava_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 7, "title": "Nivedana Kori Prabhu Tomara Carane",
     "url": "https://kksongs.org/songs/n/nivedanakoriprabhu.html",
     "bengali_url": "https://kksongs.org/unicode/n/nivedanakoriprabhu_beng.html"},
    {"section": 3, "section_title": "Atma Nivedana", "section_title_en": "Self-Surrender",
     "song": 8, "title": "Atma Nivedana Tuwa Pade",
     "url": "https://kksongs.org/songs/a/atmanivedanatuwapade.html",
     "bengali_url": "https://kksongs.org/unicode/a/atmanivedanatuwapade_beng.html"},

    # Section 4: Goptritve Varana
    {"section": 4, "section_title": "Goptritve Varana", "section_title_en": "Embracing the Lord's Guardianship",
     "song": 1, "title": "Ki Jani Ki Bale",
     "url": "https://kksongs.org/songs/k/kijanikibale.html",
     "bengali_url": "https://kksongs.org/unicode/k/kijanikibale_beng.html"},
    {"section": 4, "section_title": "Goptritve Varana", "section_title_en": "Embracing the Lord's Guardianship",
     "song": 2, "title": "Dara Putra Nijo Deho",
     "url": "https://kksongs.org/songs/d/daraputranijadeho.html",
     "bengali_url": "https://kksongs.org/unicode/d/daraputranijadeho_beng.html"},
    {"section": 4, "section_title": "Goptritve Varana", "section_title_en": "Embracing the Lord's Guardianship",
     "song": 3, "title": "Sarvasva Tomar Carane",
     "url": "https://kksongs.org/songs/s/sarvasvatomar.html",
     "bengali_url": "https://kksongs.org/unicode/s/sarvasvatomar_beng.html"},
    {"section": 4, "section_title": "Goptritve Varana", "section_title_en": "Embracing the Lord's Guardianship",
     "song": 4, "title": "Tumi Sarveswareswara Vrajendra Kumar",
     "url": "https://kksongs.org/songs/t/tumisarveswareswara.html",
     "bengali_url": "https://kksongs.org/unicode/t/tumisarveswareswara_beng.html"},

    # Section 5: Avasya Raksibe Krsna Visvasa Palana
    {"section": 5, "section_title": "Avasya Raksibe Krsna Visvasa Palana", "section_title_en": "Maintaining Faith that Krsna Will Surely Protect",
     "song": 1, "title": "Ekhona Bujhinu",
     "url": "https://kksongs.org/songs/e/ekhonabujhinu.html",
     "bengali_url": "https://kksongs.org/unicode/e/ekhonabujhinu_beng.html"},
    {"section": 5, "section_title": "Avasya Raksibe Krsna Visvasa Palana", "section_title_en": "Maintaining Faith that Krsna Will Surely Protect",
     "song": 2, "title": "Tumi To Maribe Jare",
     "url": "https://kksongs.org/songs/t/tumitomaribe.html",
     "bengali_url": "https://kksongs.org/unicode/t/tumitomaribe_beng.html"},
    {"section": 5, "section_title": "Avasya Raksibe Krsna Visvasa Palana", "section_title_en": "Maintaining Faith that Krsna Will Surely Protect",
     "song": 3, "title": "Atma Samarpane Gela Abhiman",
     "url": "https://kksongs.org/songs/a/atmasamarpanegela.html",
     "bengali_url": "https://kksongs.org/unicode/a/atmasamarpanegela_beng.html"},
    {"section": 5, "section_title": "Avasya Raksibe Krsna Visvasa Palana", "section_title_en": "Maintaining Faith that Krsna Will Surely Protect",
     "song": 4, "title": "Chorato Purusa Abhiman",
     "url": "https://kksongs.org/songs/c/choratopurusaabhiman.html",
     "bengali_url": "https://kksongs.org/unicode/c/choratopurusaabhiman_beng.html"},

    # Section 6: Bhakti Anukula Matra Karyera Svikara
    {"section": 6, "section_title": "Bhakti Anukula Matra Karyera Svikara", "section_title_en": "Acceptance Only of Activities Favorable to Devotion",
     "song": 1, "title": "Tuwa Bhakti Anukula",
     "url": "https://kksongs.org/songs/t/tuwabhaktianukula.html",
     "bengali_url": "https://kksongs.org/unicode/t/tuwabhaktianukula_beng.html"},
    {"section": 6, "section_title": "Bhakti Anukula Matra Karyera Svikara", "section_title_en": "Acceptance Only of Activities Favorable to Devotion",
     "song": 2, "title": "Godruma Dhame Bhajana",
     "url": "https://kksongs.org/songs/g/godrumadhamebhajana.html",
     "bengali_url": "https://kksongs.org/unicode/g/godrumadhamebhajana_beng.html"},
    {"section": 6, "section_title": "Bhakti Anukula Matra Karyera Svikara", "section_title_en": "Acceptance Only of Activities Favorable to Devotion",
     "song": 3, "title": "Suddha Bhakata Carana Renu",
     "url": "https://kksongs.org/songs/s/suddhabhakata.html",
     "bengali_url": "https://kksongs.org/unicode/s/suddhabhakata_beng.html"},
    {"section": 6, "section_title": "Bhakti Anukula Matra Karyera Svikara", "section_title_en": "Acceptance Only of Activities Favorable to Devotion",
     "song": 4, "title": "Radha Kunda Tata Kunja Kutir",
     "url": "https://kksongs.org/songs/r/radhakundatata.html",
     "bengali_url": "https://kksongs.org/unicode/r/radhakundatata_beng.html"},

    # Section 7: Bhakti Pratikula Bhava Varjanangikara
    {"section": 7, "section_title": "Bhakti Pratikula Bhava Varjanangikara", "section_title_en": "Rejection of Activities Unfavorable to Devotion",
     "song": 1, "title": "Kesava Tuwa Jagata Vicitra",
     "url": "https://kksongs.org/songs/k/kesavatuwajagata.html",
     "bengali_url": "https://kksongs.org/unicode/k/kesavatuwajagata_beng.html"},
    {"section": 7, "section_title": "Bhakti Pratikula Bhava Varjanangikara", "section_title_en": "Rejection of Activities Unfavorable to Devotion",
     "song": 2, "title": "Tuwa Bhakti Pratikula",
     "url": "https://kksongs.org/songs/t/tuwabhaktipratikula.html",
     "bengali_url": "https://kksongs.org/unicode/t/tuwabhaktipratikula_beng.html"},
    {"section": 7, "section_title": "Bhakti Pratikula Bhava Varjanangikara", "section_title_en": "Rejection of Activities Unfavorable to Devotion",
     "song": 3, "title": "Visaya Bimudha Ar Mayavadi",
     "url": "https://kksongs.org/songs/v/visayabimudhaar.html",
     "bengali_url": "https://kksongs.org/unicode/v/visayabimudhaar_beng.html"},
    {"section": 7, "section_title": "Bhakti Pratikula Bhava Varjanangikara", "section_title_en": "Rejection of Activities Unfavorable to Devotion",
     "song": 4, "title": "Ami To Swananda Sukhada Vasi",
     "url": "https://kksongs.org/songs/a/amitoswananda.html",
     "bengali_url": "https://kksongs.org/unicode/a/amitoswananda_beng.html"},

    # Section 8: Bhajana Lalasa
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 1, "title": "Prapance Poriya Agati",
     "url": "https://kksongs.org/songs/p/prapanceporiya.html",
     "bengali_url": "https://kksongs.org/unicode/p/prapanceporiya_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 2, "title": "Arthera Sancaye",
     "url": "https://kksongs.org/songs/a/artherasancaye.html",
     "bengali_url": "https://kksongs.org/unicode/a/artherasancaye_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 3, "title": "Bhajane Utsaha Bhaktite Visvasa",
     "url": "https://kksongs.org/songs/b/bhajaneutsaha.html",
     "bengali_url": "https://kksongs.org/unicode/b/bhajaneutsaha_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 4, "title": "Dana Pratigraha Mitho",
     "url": "https://kksongs.org/songs/d/danapratigraha.html",
     "bengali_url": "https://kksongs.org/unicode/d/danapratigraha_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 5, "title": "Sanga Dosa Sunya",
     "url": "https://kksongs.org/songs/s/sangadosasunya.html",
     "bengali_url": "https://kksongs.org/unicode/s/sangadosasunya_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 6, "title": "Nira Dharma Gata",
     "url": "https://kksongs.org/songs/n/niradharmagata.html",
     "bengali_url": "https://kksongs.org/unicode/n/niradharmagata_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 7, "title": "Ohe Vaisnava Thakura",
     "url": "https://kksongs.org/songs/o/ohevaisnava.html",
     "bengali_url": "https://kksongs.org/unicode/o/ohevaisnava_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 8, "title": "Tomare Bhuliya",
     "url": "https://kksongs.org/songs/t/tomarebhuliya.html",
     "bengali_url": "https://kksongs.org/unicode/t/tomarebhuliya_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 9, "title": "Sri Rupa Gosai Sri Guru Rupete",
     "url": "https://kksongs.org/songs/s/srirupagosaisrigururupete.html",
     "bengali_url": "https://kksongs.org/unicode/s/srirupagosaisrigururupete_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 10, "title": "Gurudeva Boro Krpa Kori",
     "url": "https://kksongs.org/songs/g/gurudeva1.html",
     "bengali_url": "https://kksongs.org/unicode/g/gurudeva1_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 11, "title": "Gurudeva Krpa Bindu Diya",
     "url": "https://kksongs.org/songs/g/gurudeva4.html",
     "bengali_url": "https://kksongs.org/unicode/g/gurudeva4_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 12, "title": "Gurudeva Kabe Mora Sei",
     "url": "https://kksongs.org/songs/g/gurudeva2.html",
     "bengali_url": "https://kksongs.org/unicode/g/gurudeva2_beng.html"},
    {"section": 8, "section_title": "Bhajana Lalasa", "section_title_en": "Longing for Devotional Service",
     "song": 13, "title": "Gurudeva Kabe Tava Karuna",
     "url": "https://kksongs.org/songs/g/gurudeva3.html",
     "bengali_url": "https://kksongs.org/unicode/g/gurudeva3_beng.html"},

    # Section 9: Siddhi Lalasa
    {"section": 9, "section_title": "Siddhi Lalasa", "section_title_en": "Longing for Spiritual Perfection",
     "song": 1, "title": "Kabe Gaura Vane",
     "url": "https://kksongs.org/songs/k/kabegauravane.html",
     "bengali_url": "https://kksongs.org/unicode/k/kabegauravane_beng.html"},
    {"section": 9, "section_title": "Siddhi Lalasa", "section_title_en": "Longing for Spiritual Perfection",
     "song": 2, "title": "Dekhite Dekhite",
     "url": "https://kksongs.org/songs/d/dekhitedekhite.html",
     "bengali_url": "https://kksongs.org/unicode/d/dekhitedekhite_beng.html"},
    {"section": 9, "section_title": "Siddhi Lalasa", "section_title_en": "Longing for Spiritual Perfection",
     "song": 3, "title": "Vrsabhanu Suta Carana Sevane",
     "url": "https://kksongs.org/songs/v/vrsabhanusutacarana.html",
     "bengali_url": "https://kksongs.org/unicode/v/vrsabhanusutacarana_beng.html"},

    # Section 10: Vijnapti
    {"section": 10, "section_title": "Vijnapti", "section_title_en": "Heartfelt Prayer",
     "song": 1, "title": "Kabe Ha'be Bolo Sei Dina Amar",
     "url": "https://kksongs.org/songs/k/kabehabebolo.html",
     "bengali_url": "https://kksongs.org/unicode/k/kabehabebolo_beng.html"},

    # Section 11: Sri Nama Mahatmya
    {"section": 11, "section_title": "Sri Nama Mahatmya", "section_title_en": "The Glories of the Holy Name",
     "song": 1, "title": "Krsna Nama Dhare Kato Bal",
     "url": "https://kksongs.org/songs/k/krsnanamadhare.html",
     "bengali_url": "https://kksongs.org/unicode/k/krsnanamadhare_beng.html"},
]


HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}


def fetch_page(url: str, retries: int = 3) -> str | None:
    """Fetch a page with retries."""
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


def preserve_line_breaks(soup):
    """Convert <br> and <p> tags to newlines before getting text."""
    # Replace <br> with newlines
    for br in soup.find_all('br'):
        br.replace_with('\n')
    # Replace </p> with newlines
    for p in soup.find_all('p'):
        p.append('\n')
    return soup


def clean_verse_preserve_lines(text: str) -> str:
    """Clean whitespace while preserving line breaks."""
    # Remove UPDATED markers and website artifacts
    text = re.sub(r'UPDATED:.*$', '', text, flags=re.MULTILINE | re.IGNORECASE)
    text = re.sub(r'www\.kksongs\.org.*$', '', text, flags=re.MULTILINE)
    text = re.sub(r'Krsna Kirtana Songs.*$', '', text, flags=re.MULTILINE)

    # Clean each line separately
    lines = []
    for line in text.split('\n'):
        cleaned = ' '.join(line.split())  # Clean horizontal whitespace only
        if cleaned:
            lines.append(cleaned)

    return '\n'.join(lines)


def parse_bengali_page(html: str) -> list[str]:
    """Extract Bengali verses from unicode page."""
    soup = BeautifulSoup(html, 'html.parser')

    # Preserve line breaks before extracting text
    preserve_line_breaks(soup)

    # Get all text content
    text = soup.get_text()

    # Split by verse numbers (১), (২), etc. or (1), (2), etc.
    # Bengali numerals: ১২৩৪৫৬৭৮৯০
    verse_pattern = re.compile(r'\(([১২৩৪৫৬৭৮৯০\d]+)\)')

    # Find all matches and their positions
    matches = list(verse_pattern.finditer(text))

    verses = []
    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        verse_text = text[start:end].strip()

        # Clean while preserving line breaks
        verse_text = clean_verse_preserve_lines(verse_text)

        # Only keep if it has Bengali characters
        if verse_text and any('\u0980' <= c <= '\u09FF' for c in verse_text):
            verses.append(verse_text)

    return verses


def parse_main_page(html: str) -> dict:
    """Extract transliteration and translation from main song page."""
    soup = BeautifulSoup(html, 'html.parser')

    # Preserve line breaks before extracting text
    preserve_line_breaks(soup)

    text = soup.get_text()

    result = {
        "transliteration": [],
        "translation": []
    }

    # Find LYRICS and TRANSLATION sections
    # Note: Some pages have "LYRICS:" with colon, others just "LYRICS" without
    lyrics_match = re.search(r'LYRICS:?\s*(.*?)(?=TRANSLATION|REMARKS|PURPORT|$)', text, re.DOTALL | re.IGNORECASE)
    trans_match = re.search(r'TRANSLATION\s*(.*?)(?=REMARKS|PURPORT|UPDATED|$)', text, re.DOTALL | re.IGNORECASE)

    if lyrics_match:
        lyrics_text = lyrics_match.group(1)
        # Split by verse numbers
        verse_pattern = re.compile(r'\((\d+)\)')
        matches = list(verse_pattern.finditer(lyrics_text))

        for i, match in enumerate(matches):
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(lyrics_text)
            verse = lyrics_text[start:end].strip()
            # Clean while preserving line breaks
            verse = clean_verse_preserve_lines(verse)
            if verse:
                result["transliteration"].append(verse)

    if trans_match:
        trans_text = trans_match.group(1)
        # Split by verse numbers like "1)", "2)", etc.
        verse_pattern = re.compile(r'(\d+)\)')
        matches = list(verse_pattern.finditer(trans_text))

        for i, match in enumerate(matches):
            start = match.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(trans_text)
            verse = trans_text[start:end].strip()
            # Clean artifacts
            verse = re.sub(r'Remarks.*$', '', verse, flags=re.MULTILINE | re.IGNORECASE)
            verse = re.sub(r'Extra Information.*$', '', verse, flags=re.MULTILINE | re.IGNORECASE)
            verse = re.sub(r'No Extra.*$', '', verse, flags=re.MULTILINE | re.IGNORECASE)
            # Clean while preserving line breaks
            verse = clean_verse_preserve_lines(verse)
            if verse and len(verse) > 10:
                result["translation"].append(verse)

    return result


def parse_purport_page(html: str) -> str:
    """Extract purport text."""
    soup = BeautifulSoup(html, 'html.parser')

    # Preserve line breaks before extracting text
    preserve_line_breaks(soup)

    # Get main content
    text = soup.get_text()

    # Find the purport content (after "Purport Author:" line)
    match = re.search(r'(?:Purport Author:.*?Swami)\s*(.*?)(?:UPDATED:|$)', text, re.DOTALL | re.IGNORECASE)
    if match:
        purport = match.group(1).strip()
        # Clean up
        purport = re.sub(r'Home.*?Page', '', purport, flags=re.DOTALL)
        purport = re.sub(r'www\.kksongs\.org', '', purport)
        purport = re.sub(r'Krsna Kirtana Songs.*?est\.\s*\d+', '', purport, flags=re.DOTALL)
        # Clean while preserving line breaks
        purport = clean_verse_preserve_lines(purport)
        return purport

    return ""


# Prabhupada's purports about specific Saranagati verses (Ukrainian)
# Key: (section_number, song_number) -> dict of verse_number -> list of purport texts
PRABHUPADA_PURPORTS_UA = {
    # Song 1: Sri Krsna Caitanya Prabhu Jive Doya Kori (Section 1, Song 1)
    (1, 1): {
        3: [
            "У своєму поясненні до Чайтанья-чарітамріти, Мадг'я-ліла 20.135, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Відданий не буде покладатися на свої матеріальні ресурси, а на милість Верховного Бога-Особи, який може дати справжній захист. Це називається ракшішьяті ті вішвасах, або "авашья ракшібе крішна"—вішваса палана».",
            "Під час лекції зі Шрімад-Бгаґаватам 6.3.16-17 (Ґоракхпур, 10 лютого 1971 року), Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Віддатися означає просто приймати сприятливе служіння Крішні та відкидати все, що несприятливе, а далі йде авашья ракшібе крішна вішваса-палана: "І бути твердо переконаним, що Крішна дасть мені весь захист"»."
        ]
    },
    # Song 11: Manasa Deho Geho Jo Kichu Mor (Section 3, Song 3)
    (3, 3): {
        1: [
            "У своєму поясненні до Чайтанья-чарітамріти, Мадг'я-ліла 10.55, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Це процес віддання себе. Як співає Шріла Бгактівінод Тхакур: манаса, деха, ґеха, йо кічху мора / арпілун туйа паде нанда-кішора! Коли людина віддається лотосним стопам Господа, вона робить це з усім, що має у своєму володінні»."
        ],
        5: [
            "У своєму поясненні до Чайтанья-чарітамріти, Антья-ліла 1.24, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Шріла Бгактівінод Тхакур також співав: кіта-джанма ха-у йатха туйа даса (Шаранаґаті 11). Немає нічого поганого в тому, щоб народжуватися знову і знову. Наше єдине бажання має бути народитися під опікою вайшнава»."
        ]
    },
    # Song 19: Sarvasva Tomar Carane (Section 4, Song 3)
    (4, 3): {
        1: [
            "У своєму поясненні до Чайтанья-чарітамріти, Антья-ліла 1.24, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Тому Шріла Бгактівінод Тхакур співав: тумі та' тхакура, томара куккура, баліййа джанаха море. Так він пропонує стати собакою вайшнава. Є багато інших прикладів, коли домашня тварина вайшнава була повернута додому, до Вайкунтхалоки»."
        ]
    },
    # Song 27: Suddha Bhakata Carana Renu (Section 6, Song 3)
    (6, 3): {
        3: [
            "У своєму поясненні до Чайтанья-чарітамріти, Антья-ліла 4.211, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Шріла Бгактівінод Тхакур пише в пісні: ґаура амара, йе саба стхане, карала бграмана ранґе / се-саба стхана, херіба амі, пранайі-бгаката-санґе. "Нехай я відвідаю всі святі місця, пов'язані з лілами Господа Чайтаньї та Його відданих"»."
        ],
        6: [
            "У своєму поясненні до Чайтанья-чарітамріти, Мадг'я-ліла 7.69, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «У своїй книзі Шаранаґаті Бгактівінод Тхакур стверджує: йе-діна ґріхе, бгаджана декхі', ґріхете ґолока бгайа. Коли сімейна людина прославляє Верховного Господа у своєму домі, її діяльність негайно перетворюється на діяльність Ґолоки Вріндавани»."
        ]
    }
}

# Ukrainian section titles
SECTION_TITLES_UA = {
    1: "Вступ",
    2: "Дайн'я (Смирення)",
    3: "Атма-нівéдана (Самовіддача)",
    4: "Ґоптрітве варана (Прийняття опіки Господа)",
    5: "Авашья ракшібе Крішна вішваса палана (Віра в захист Крішни)",
    6: "Бгакті-анукула матра кар'єра свікара (Сприятливе для відданості)",
    7: "Бгакті-пратікула бгава варджанаңґікара (Несприятливе для відданості)",
    8: "Бгаджана-лаласа (Прагнення до служіння)",
    9: "Сіддгі-лаласа (Прагнення до досконалості)",
    10: "Віджняпті (Молитва від серця)",
    11: "Шрі-нама-махатмья (Слава Святого Імені)"
}


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
                "title_en": song_info['section_title_en'],
                "title_ua": SECTION_TITLES_UA.get(section_num, ""),
                "songs": []
            }

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

        # Fetch main page for transliteration/translation
        print(f"  Fetching main page...")
        main_html = fetch_page(song_info['url'])
        if main_html:
            main_data = parse_main_page(main_html)
            song_data['transliteration'] = main_data['transliteration']
            song_data['translation'] = main_data['translation']
            print(f"    Found {len(main_data['transliteration'])} transliteration, {len(main_data['translation'])} translation")

        # Fetch purport if available
        if 'purport_url' in song_info:
            print(f"  Fetching purport...")
            purport_html = fetch_page(song_info['purport_url'])
            if purport_html:
                purport = parse_purport_page(purport_html)
                if purport:
                    song_data['purport_en'] = purport
                    print(f"    Found purport ({len(purport)} chars)")

        # Add Prabhupada's Ukrainian purports if available
        purport_key = (section_num, song_info['song'])
        if purport_key in PRABHUPADA_PURPORTS_UA:
            verse_purports = PRABHUPADA_PURPORTS_UA[purport_key]
            purport_parts = []
            for verse_num in sorted(verse_purports.keys()):
                purport_parts.append(f"Вірш {verse_num}:")
                purport_parts.extend(verse_purports[verse_num])
            song_data['purport_ua'] = "\n\n".join(purport_parts)
            print(f"    Added Prabhupada purports (UA) for verses: {list(verse_purports.keys())}")

        sections[section_num]['songs'].append(song_data)

        # Rate limiting
        time.sleep(0.3)

    # Build final structure
    output = {
        "book_slug": "saranagati",
        "book_title_en": "Saranagati",
        "book_title_bn": "শরণাগতি",
        "book_title_ua": "Шаранаґаті",
        "author_en": "Bhaktivinoda Thakura",
        "author_ua": "Бгактівінод Тхакур",
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
