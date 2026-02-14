"""
Generate Vidya library.txt from Bhagavad Gita JSON data.

Reads the parsed BG data from src/data/bbt-parsed.json and generates
a library.txt file in the Vidyabase input format.

Usage:
    python vidya/generate-gita-library.py
"""

import json
import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
INPUT_JSON = os.path.join(PROJECT_ROOT, "src", "data", "bbt-parsed.json")
OUTPUT_FILE = os.path.join(SCRIPT_DIR, "input", "library.txt")


def escape_html_content(text):
    """Ensure content doesn't contain raw </div> that would break parsing."""
    return text.replace("</div>", "&lt;/div&gt;")


def div(class_name, content):
    """Create a single div line for the library.txt format."""
    content = content.replace("\n", "<br />")
    content = escape_html_content(content)
    return f'<div class="{class_name}">{content}</div>'


def extract_paragraphs(html_content):
    """Extract paragraphs from HTML content (split by <p> tags)."""
    if not html_content:
        return []

    # Split by </p> and process each part
    paragraphs = []
    # Find all <p ...>...</p> blocks
    parts = re.findall(r"<p[^>]*>(.*?)</p>", html_content, re.DOTALL)
    if parts:
        for part in parts:
            text = part.strip()
            if text:
                paragraphs.append(text)
    else:
        # No <p> tags, treat as single paragraph
        text = html_content.strip()
        if text:
            paragraphs.append(text)

    return paragraphs


def normalize_chapter_title(title):
    """Remove unwanted newlines from chapter titles."""
    return re.sub(r"\s*\n\s*", " ", title).strip()


def generate_library():
    with open(INPUT_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)

    lines = []

    # Book
    lines.append(div("book", data["title_uk"]))
    lines.append(div("code", "bg"))
    lines.append("")

    # Intro sections as chapters (before the main content chapters)
    intros = data.get("intros", [])
    for intro in intros:
        title = intro.get("title_uk", "")
        content = intro.get("content_uk", "")
        slug = intro.get("slug", "")

        if not title or not content:
            continue

        lines.append(div("chapter", title))
        lines.append(div("code", slug))
        lines.append("")

        # Extract paragraphs from HTML content
        paragraphs = extract_paragraphs(content)
        if paragraphs:
            for p in paragraphs:
                lines.append(div("paragraph", p))
        else:
            # Fallback: output as single paragraph
            lines.append(div("paragraph", content))

        lines.append("")

    # Move back up to book level after intros, before main chapters
    lines.append(div("move-up", ""))
    lines.append("")

    # Main chapters with verses
    for chapter in data["chapters"]:
        chapter_num = chapter["chapter_number"]
        chapter_title = normalize_chapter_title(chapter.get("chapter_title_uk", ""))

        lines.append(div("chapter", f"Розділ {chapter_num}"))
        lines.append(div("code", str(chapter_num)))
        if chapter_title:
            lines.append(div("chapter-title", chapter_title))
        lines.append("")

        # Verses
        for verse in chapter.get("verses", []):
            verse_num = verse.get("verse_number", "")

            # Verse title: "Вірш X" or "Вірші X-Y" for ranges
            if "-" in str(verse_num) or "–" in str(verse_num):
                verse_title = f"Вірші {verse_num}"
            else:
                verse_title = f"Вірш {verse_num}"

            lines.append(div("verse", verse_title))
            lines.append(div("code", str(verse_num)))

            # Transliteration (Ukrainian Cyrillic)
            translit = verse.get("transliteration_uk", "")
            if translit:
                lines.append(div("verse-text", translit))

            # Synonyms (word-by-word)
            synonyms = verse.get("synonyms_uk", "")
            if synonyms:
                lines.append(div("synonyms", synonyms))

            # Translation
            translation = verse.get("translation_uk", "")
            if translation:
                lines.append(div("translation", translation))

            # Commentary/Purport
            commentary = verse.get("commentary_uk", "")
            if commentary:
                paragraphs = extract_paragraphs(commentary)
                if paragraphs:
                    for p in paragraphs:
                        lines.append(div("paragraph", p))
                else:
                    lines.append(div("paragraph", commentary))

            lines.append("")

    # Write output
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Generated {OUTPUT_FILE}")
    print(f"Total lines: {len(lines)}")


if __name__ == "__main__":
    generate_library()
