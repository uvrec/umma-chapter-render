"""
Generate a .uk book file — Vedavoice's portable book format.

The .uk format is a SQLite database containing:
- Complete book content (verses, intros, glossary)
- Pre-built FTS5 index with weighted columns
- Navigation hierarchy
- Metadata

Usage:
    python tools/generate-uk-book.py [--input src/data/bbt-parsed.json] [--output bhagavad-gita.uk]

The generated .uk file can be distributed as a standalone offline book.
"""

import json
import re
import os
import sys
import sqlite3
import argparse
from datetime import datetime


SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def strip_html(text: str) -> str:
    """Remove HTML tags and normalize whitespace for FTS indexing."""
    if not text:
        return ""
    # Replace block tags with spaces
    text = re.sub(r"<(?:br|p|div|li|h[1-6])[^>]*>", " ", text, flags=re.IGNORECASE)
    text = re.sub(r"</(?:p|div|li|h[1-6])>", " ", text, flags=re.IGNORECASE)
    # Remove all remaining tags
    text = re.sub(r"<[^>]+>", "", text)
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()
    return text


def extract_paragraphs(html: str) -> list[str]:
    """Extract text content from <p> tags. Falls back to whole string."""
    if not html:
        return []
    parts = re.findall(r"<p[^>]*>(.*?)</p>", html, re.DOTALL)
    if parts:
        return [p.strip() for p in parts if p.strip()]
    return [html.strip()] if html.strip() else []


def parse_glossary_ts(filepath: str) -> list[dict]:
    """Parse glossary terms from a TypeScript file."""
    terms = []
    if not os.path.exists(filepath):
        return terms

    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    for m in re.finditer(
        r'\{\s*term:\s*"([^"]+)"\s*,\s*definition:\s*"([^"]+)"\s*\}',
        content,
    ):
        terms.append({"term": m.group(1), "definition": m.group(2)})

    return terms


# ---------------------------------------------------------------------------
# Schema
# ---------------------------------------------------------------------------

SCHEMA = """
-- Metadata
CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Chapters (includes intros as chapter_type='intro')
CREATE TABLE IF NOT EXISTS chapters (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_number INTEGER,
    title_uk      TEXT,
    title_en      TEXT,
    slug          TEXT,
    chapter_type  TEXT NOT NULL DEFAULT 'chapter',  -- 'intro' | 'chapter'
    sort_order    INTEGER NOT NULL DEFAULT 0
);

-- Verses
CREATE TABLE IF NOT EXISTS verses (
    id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id         INTEGER NOT NULL REFERENCES chapters(id),
    verse_number       TEXT NOT NULL,
    transliteration_uk TEXT,
    synonyms_uk        TEXT,
    translation_uk     TEXT,
    commentary_uk      TEXT,
    sort_order         INTEGER NOT NULL DEFAULT 0
);

-- Intro content (paragraphs within intro chapters)
CREATE TABLE IF NOT EXISTS intro_content (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    chapter_id INTEGER NOT NULL REFERENCES chapters(id),
    content    TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

-- Glossary
CREATE TABLE IF NOT EXISTS glossary (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    term       TEXT NOT NULL,
    definition TEXT NOT NULL
);

-- Navigation tree (for quick chapter/verse navigation)
CREATE TABLE IF NOT EXISTS nav_tree (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id   INTEGER REFERENCES nav_tree(id),
    nav_type    TEXT NOT NULL,  -- 'book' | 'chapter' | 'verse'
    ref_id      INTEGER,       -- chapters.id or verses.id
    code        TEXT,           -- URL path segment
    title       TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_verses_chapter ON verses(chapter_id);
CREATE INDEX IF NOT EXISTS idx_intro_content_chapter ON intro_content(chapter_id);
CREATE INDEX IF NOT EXISTS idx_nav_tree_parent ON nav_tree(parent_id);

-- FTS5: weighted full-text search over verse content
-- Columns ordered by search weight: translation > synonyms > commentary > transliteration
CREATE VIRTUAL TABLE IF NOT EXISTS verses_fts USING fts5(
    verse_id     UNINDEXED,
    chapter_num  UNINDEXED,
    verse_num    UNINDEXED,
    translation,
    synonyms,
    commentary,
    transliteration,
    tokenize='unicode61 remove_diacritics 2'
);

-- FTS over intro content
CREATE VIRTUAL TABLE IF NOT EXISTS intros_fts USING fts5(
    chapter_id UNINDEXED,
    title,
    content,
    tokenize='unicode61 remove_diacritics 2'
);

-- FTS over glossary
CREATE VIRTUAL TABLE IF NOT EXISTS glossary_fts USING fts5(
    glossary_id UNINDEXED,
    term,
    definition,
    tokenize='unicode61 remove_diacritics 2'
);
"""


# ---------------------------------------------------------------------------
# Generator
# ---------------------------------------------------------------------------

class UkBookGenerator:
    def __init__(self, db_path: str):
        self.conn = sqlite3.connect(db_path)
        self.conn.execute("PRAGMA journal_mode=WAL")
        self.conn.execute("PRAGMA foreign_keys=ON")
        self.conn.executescript(SCHEMA)
        self.stats = {
            "chapters": 0,
            "intros": 0,
            "verses": 0,
            "glossary": 0,
            "fts_verses": 0,
            "fts_intros": 0,
            "fts_glossary": 0,
        }

    def set_meta(self, key: str, value):
        self.conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)",
            (key, json.dumps(value, ensure_ascii=False) if not isinstance(value, str) else value),
        )

    def add_chapter(self, chapter_number: int, title_uk: str, title_en: str,
                    slug: str, chapter_type: str, sort_order: int) -> int:
        cur = self.conn.execute(
            "INSERT INTO chapters (chapter_number, title_uk, title_en, slug, chapter_type, sort_order) VALUES (?,?,?,?,?,?)",
            (chapter_number, title_uk, title_en, slug, chapter_type, sort_order),
        )
        return cur.lastrowid

    def add_verse(self, chapter_id: int, verse_number: str,
                  transliteration_uk: str, synonyms_uk: str,
                  translation_uk: str, commentary_uk: str,
                  sort_order: int) -> int:
        cur = self.conn.execute(
            "INSERT INTO verses (chapter_id, verse_number, transliteration_uk, synonyms_uk, translation_uk, commentary_uk, sort_order) VALUES (?,?,?,?,?,?,?)",
            (chapter_id, verse_number, transliteration_uk, synonyms_uk,
             translation_uk, commentary_uk, sort_order),
        )
        return cur.lastrowid

    def add_intro_content(self, chapter_id: int, content: str, sort_order: int):
        self.conn.execute(
            "INSERT INTO intro_content (chapter_id, content, sort_order) VALUES (?,?,?)",
            (chapter_id, content, sort_order),
        )

    def add_glossary_term(self, term: str, definition: str) -> int:
        cur = self.conn.execute(
            "INSERT INTO glossary (term, definition) VALUES (?,?)",
            (term, definition),
        )
        return cur.lastrowid

    def add_nav_node(self, parent_id, nav_type: str, ref_id: int,
                     code: str, title: str, sort_order: int) -> int:
        cur = self.conn.execute(
            "INSERT INTO nav_tree (parent_id, nav_type, ref_id, code, title, sort_order) VALUES (?,?,?,?,?,?)",
            (parent_id, nav_type, ref_id, code, title, sort_order),
        )
        return cur.lastrowid

    def index_verse_fts(self, verse_id: int, chapter_num: int, verse_num: str,
                        translation: str, synonyms: str, commentary: str,
                        transliteration: str):
        self.conn.execute(
            "INSERT INTO verses_fts (verse_id, chapter_num, verse_num, translation, synonyms, commentary, transliteration) VALUES (?,?,?,?,?,?,?)",
            (verse_id, chapter_num, verse_num,
             strip_html(translation), strip_html(synonyms),
             strip_html(commentary), strip_html(transliteration)),
        )
        self.stats["fts_verses"] += 1

    def index_intro_fts(self, chapter_id: int, title: str, content: str):
        self.conn.execute(
            "INSERT INTO intros_fts (chapter_id, title, content) VALUES (?,?,?)",
            (chapter_id, title, strip_html(content)),
        )
        self.stats["fts_intros"] += 1

    def index_glossary_fts(self, glossary_id: int, term: str, definition: str):
        self.conn.execute(
            "INSERT INTO glossary_fts (glossary_id, term, definition) VALUES (?,?,?)",
            (glossary_id, term, strip_html(definition)),
        )
        self.stats["fts_glossary"] += 1

    def finalize(self):
        self.conn.commit()
        # Optimize FTS
        self.conn.execute("INSERT INTO verses_fts(verses_fts) VALUES('optimize')")
        self.conn.execute("INSERT INTO intros_fts(intros_fts) VALUES('optimize')")
        self.conn.execute("INSERT INTO glossary_fts(glossary_fts) VALUES('optimize')")
        self.conn.commit()
        self.conn.execute("VACUUM")
        self.conn.close()


def generate(input_json: str, glossary_ts: str, output_path: str):
    with open(input_json, "r", encoding="utf-8") as f:
        data = json.load(f)

    gen = UkBookGenerator(output_path)

    # Metadata
    gen.set_meta("format", "uk-book")
    gen.set_meta("format_version", "1.0")
    gen.set_meta("title_uk", data.get("title_uk", ""))
    gen.set_meta("title_en", data.get("title_en", ""))
    gen.set_meta("language", "uk")
    gen.set_meta("created_at", datetime.utcnow().isoformat())
    gen.set_meta("source", "vedavoice.org")
    gen.set_meta("fts", "true")
    gen.set_meta("fts_tokenizer", "unicode61 remove_diacritics 2")

    book_slug = "bg"
    gen.set_meta("slug", book_slug)

    # Nav root
    book_nav_id = gen.add_nav_node(
        None, "book", 0, book_slug, data.get("title_uk", ""), 0
    )

    sort_counter = 0

    # --- Intro sections ---
    for intro in data.get("intros", []):
        sort_counter += 1
        slug = intro.get("slug", f"intro-{sort_counter}")
        title_uk = intro.get("title_uk", "")
        content_uk = intro.get("content_uk", "")

        ch_id = gen.add_chapter(
            chapter_number=0,
            title_uk=title_uk,
            title_en="",
            slug=slug,
            chapter_type="intro",
            sort_order=sort_counter,
        )
        gen.stats["intros"] += 1

        # Add paragraphs
        paragraphs = extract_paragraphs(content_uk)
        for i, p in enumerate(paragraphs):
            gen.add_intro_content(ch_id, p, i)

        # FTS
        gen.index_intro_fts(ch_id, title_uk, content_uk)

        # Nav
        gen.add_nav_node(book_nav_id, "chapter", ch_id, slug, title_uk, sort_counter)

    # --- Main chapters ---
    for chapter in data.get("chapters", []):
        sort_counter += 1
        ch_num = chapter["chapter_number"]
        title_uk = re.sub(r"\s*\n\s*", " ", chapter.get("chapter_title_uk", "")).strip()
        title_en = re.sub(r"\s*\n\s*", " ", chapter.get("chapter_title_en", "")).strip()

        ch_id = gen.add_chapter(
            chapter_number=ch_num,
            title_uk=title_uk,
            title_en=title_en,
            slug=str(ch_num),
            chapter_type="chapter",
            sort_order=sort_counter,
        )
        gen.stats["chapters"] += 1

        ch_nav_id = gen.add_nav_node(
            book_nav_id, "chapter", ch_id, str(ch_num), title_uk, sort_counter
        )

        for v_idx, verse in enumerate(chapter.get("verses", [])):
            v_num = verse.get("verse_number", str(v_idx + 1))
            translit = verse.get("transliteration_uk", "")
            synonyms = verse.get("synonyms_uk", "")
            translation = verse.get("translation_uk", "")
            commentary = verse.get("commentary_uk", "")

            v_id = gen.add_verse(
                ch_id, v_num, translit, synonyms, translation, commentary, v_idx
            )
            gen.stats["verses"] += 1

            # FTS
            gen.index_verse_fts(v_id, ch_num, v_num, translation, synonyms, commentary, translit)

            # Nav
            v_title = f"Вірші {v_num}" if ("-" in str(v_num) or "–" in str(v_num)) else f"Вірш {v_num}"
            gen.add_nav_node(ch_nav_id, "verse", v_id, str(v_num), v_title, v_idx)

    # --- Glossary ---
    glossary_terms = parse_glossary_ts(glossary_ts)
    for term_data in glossary_terms:
        g_id = gen.add_glossary_term(term_data["term"], term_data["definition"])
        gen.index_glossary_fts(g_id, term_data["term"], term_data["definition"])
        gen.stats["glossary"] += 1

    # Write chapter/verse counts to meta
    gen.set_meta("chapters_count", str(gen.stats["chapters"]))
    gen.set_meta("intros_count", str(gen.stats["intros"]))
    gen.set_meta("verses_count", str(gen.stats["verses"]))
    gen.set_meta("glossary_count", str(gen.stats["glossary"]))

    gen.finalize()

    print(f"Generated: {output_path}")
    print(f"  Chapters:  {gen.stats['chapters']}")
    print(f"  Intros:    {gen.stats['intros']}")
    print(f"  Verses:    {gen.stats['verses']}")
    print(f"  Glossary:  {gen.stats['glossary']}")
    print(f"  FTS verses:  {gen.stats['fts_verses']}")
    print(f"  FTS intros:  {gen.stats['fts_intros']}")
    print(f"  FTS glossary: {gen.stats['fts_glossary']}")


def main():
    parser = argparse.ArgumentParser(description="Generate .uk book file")
    parser.add_argument(
        "--input", "-i",
        default=os.path.join(PROJECT_ROOT, "src", "data", "bbt-parsed.json"),
        help="Path to parsed JSON data",
    )
    parser.add_argument(
        "--glossary", "-g",
        default=os.path.join(PROJECT_ROOT, "src", "data", "glossaries", "gita-glossary.ts"),
        help="Path to glossary TypeScript file",
    )
    parser.add_argument(
        "--output", "-o",
        default=os.path.join(PROJECT_ROOT, "vidya", "bhagavad-gita.uk"),
        help="Output .uk file path",
    )
    args = parser.parse_args()

    if os.path.exists(args.output):
        os.remove(args.output)

    generate(args.input, args.glossary, args.output)


if __name__ == "__main__":
    main()
