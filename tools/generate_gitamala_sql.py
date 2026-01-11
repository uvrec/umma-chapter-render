#!/usr/bin/env python3
"""
Generate SQL migration for Gitamala book with proper verses table structure.

Структура полів:
- sanskrit_en / sanskrit_ua — Bengali/Sanskrit (однаковий вміст)
- transliteration_en — IAST транслітерація (латинка з діакритикою)
- transliteration_ua — українська кирилична транслітерація з діакритикою
- synonyms_en / synonyms_ua — слово-за-словом (не маємо)
- translation_en / translation_ua — переклад
- commentary_en / commentary_ua — пояснення
"""

import json
import re
import unicodedata
from pathlib import Path


def convert_iast_to_ukrainian(text: str) -> str:
    """
    Конвертує IAST транслітерацію в українську кирилицю з діакритикою.
    Базується на import_gita_transliteration.py
    """
    if not text:
        return text

    # Unicode нормалізація
    text = unicodedata.normalize('NFC', text)

    # Паттерни заміни (від довших до коротших)
    patterns = {
        # 3+ символи
        'nya': 'нйа',
        'nye': 'нйе',
        'nyi': 'нйі',
        'nyo': 'нйо',
        'nyu': 'нйу',
        'jjh': 'жджх',

        # Довгі голосні (precomposed)
        'yā': 'йа̄',
        'yī': 'йı̄',
        'yū': 'йӯ',
        'ā': 'а̄',
        'ī': 'ı̄',
        'ū': 'ӯ',
        'ṝ': 'р̣̄',
        'ḹ': 'л̣̄',
        'ṭ': 'т̣',
        'ḍ': 'д̣',
        'ṇ': 'н̣',
        'ṣ': 'ш',
        'ṛ': 'р̣',
        'ś': 'ш́',
        'ñ': 'н̃',
        'ṅ': 'н̇',
        'ṁ': 'м̇',
        'ṃ': 'м̣',
        'ḥ': 'х̣',
        'ḷ': 'л̣',

        # Великі літери
        'Ā': 'А̄',
        'Ī': 'Ī',
        'Ū': 'Ӯ',

        # 2 символи - придихові
        'bh': 'бг',
        'gh': 'ґг',
        'dh': 'дг',
        'th': 'тх',
        'ph': 'пх',
        'kh': 'кх',
        'ch': 'чх',
        'jh': 'джх',
        'sh': 'сх',
        'kṣ': 'кш',
        'jñ': 'джн̃',

        # Дифтонги
        'ai': 'аі',
        'au': 'ау',

        # Прості приголосні
        'k': 'к',
        'g': 'ґ',
        'c': 'ч',
        'j': 'дж',
        't': 'т',
        'd': 'д',
        'p': 'п',
        'b': 'б',
        'y': 'й',
        'r': 'р',
        'l': 'л',
        'v': 'в',
        'w': 'в',
        'h': 'х',
        'm': 'м',
        'n': 'н',
        's': 'с',

        # Великі приголосні
        'K': 'К',
        'G': 'Ґ',
        'C': 'Ч',
        'J': 'Дж',
        'T': 'Т',
        'D': 'Д',
        'P': 'П',
        'B': 'Б',
        'Y': 'Й',
        'R': 'Р',
        'L': 'Л',
        'V': 'В',
        'W': 'В',
        'H': 'Х',
        'M': 'М',
        'N': 'Н',
        'S': 'С',

        # Прості голосні
        'a': 'а',
        'i': 'і',
        'u': 'у',
        'e': 'е',
        'o': 'о',
        'A': 'А',
        'I': 'І',
        'U': 'У',
        'E': 'Е',
        'O': 'О',
    }

    result = []
    i = 0

    while i < len(text):
        matched = False

        # Пробуємо найдовші підрядки першими (3, 2, 1)
        for length in [3, 2, 1]:
            if i + length <= len(text):
                substr = text[i:i + length]
                if substr in patterns:
                    result.append(patterns[substr])
                    i += length
                    matched = True
                    break

        if not matched:
            result.append(text[i])
            i += 1

    return ''.join(result)


def clean_artifacts(text: str) -> str:
    """Remove website artifacts from text."""
    if not text:
        return text
    # Remove Windows-1252 special chars
    text = text.replace('\x92', "'")
    # Remove UPDATED/UDPATED (typo) line - matches UD[P]ATED or UP[D]ATED
    text = re.sub(r'\n?(UPDATED|UDPATED):?[^\n]*', '', text, flags=re.IGNORECASE)
    # Remove standalone dates "September 27,\n2016" (month + day + optional year on next line)
    text = re.sub(r'\n?(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{1,2},?\s*\n?\s*\d{4}', '', text, flags=re.IGNORECASE)
    # Remove orphan year lines
    text = re.sub(r'\n\d{4}\s*$', '', text)
    # Clean up extra whitespace and empty lines
    text = '\n'.join(line for line in text.split('\n') if line.strip())
    return text.strip()


def escape_sql(text: str) -> str:
    """Escape text for SQL string literal."""
    if not text:
        return ""
    # Clean artifacts first
    text = clean_artifacts(text)
    return text.replace("'", "''").replace("\\", "\\\\")


def generate_migration():
    # Load parsed data
    data_path = Path(__file__).parent.parent / "src" / "data" / "gitamala-parsed.json"
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    sql_parts = []

    # Header
    sql_parts.append("""-- Import Gitamala by Bhaktivinoda Thakura
-- Proper structure: books -> cantos -> chapters -> verses
-- Fields: sanskrit_en/ua, transliteration_en/ua, synonyms_en/ua, translation_en/ua, commentary_en/ua

BEGIN;

-- 1. Create/update the book
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('gitamala', 'Gitamala', E'Ґіта-мала̄', true, true)
ON CONFLICT (slug) DO UPDATE SET
  title_ua = EXCLUDED.title_ua,
  has_cantos = EXCLUDED.has_cantos;

-- Get book ID
DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'gitamala';
""")

    # Generate cantos (sections)
    for section in data['sections']:
        section_num = section['section_number']
        title_en = escape_sql(section.get('title_en', section['title']))
        title_ua = escape_sql(section.get('title_ua', ''))

        sql_parts.append(f"""
  -- Canto {section_num}: {title_en}
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, {section_num}, E'{title_en}', E'{title_ua}', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;
""")

    # Generate chapters and verses
    for section in data['sections']:
        section_num = section['section_number']

        for song in section['songs']:
            song_num = song['song_number']
            title_en = escape_sql(song['title_en'])
            title_ua = escape_sql(song.get('title_ua', ''))

            sql_parts.append(f"""
  -- Section {section_num}, Song {song_num}: {title_en}
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = {section_num};

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, {song_num}, E'{title_en}', E'{title_ua}', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) WHERE canto_id IS NOT NULL DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = {song_num};
""")

            # Get verse data
            bengali = song.get('bengali', [])
            transliteration = song.get('transliteration', [])
            translation = song.get('translation', [])

            # Determine number of verses
            num_verses = max(len(bengali), len(transliteration), len(translation))

            for i in range(num_verses):
                verse_num = i + 1

                # sanskrit_en and sanskrit_ua - both contain Bengali text
                sanskrit_text = escape_sql(bengali[i] if i < len(bengali) else '')

                # transliteration_en - IAST (Latin with diacritics)
                translit_en = transliteration[i] if i < len(transliteration) else ''
                translit_en_escaped = escape_sql(translit_en)

                # transliteration_ua - Ukrainian cyrillic (converted from IAST)
                translit_ua = convert_iast_to_ukrainian(translit_en)
                translit_ua_escaped = escape_sql(translit_ua)

                # translation_en
                trans_en = escape_sql(translation[i] if i < len(translation) else '')

                # translation_ua - not available yet, empty
                trans_ua = ''

                # synonyms_en / synonyms_ua - not available
                synonyms_en = ''
                synonyms_ua = ''

                # commentary_en / commentary_ua - not available for Gitamala
                commentary_en = ''
                commentary_ua = ''

                sql_parts.append(f"""
  -- Verse {verse_num}
  INSERT INTO public.verses (
    chapter_id, verse_number,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '{verse_num}',
    E'{sanskrit_text}', E'{sanskrit_text}',
    E'{translit_en_escaped}', E'{translit_ua_escaped}',
    E'{synonyms_en}', E'{synonyms_ua}',
    E'{trans_en}', E'{trans_ua}',
    E'{commentary_en}', E'{commentary_ua}',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_ua = EXCLUDED.synonyms_ua,
    translation_en = EXCLUDED.translation_en,
    translation_ua = EXCLUDED.translation_ua,
    commentary_en = EXCLUDED.commentary_en,
    commentary_ua = EXCLUDED.commentary_ua;
""")

    # Close the DO block
    sql_parts.append("""
END $$;

COMMIT;
""")

    return '\n'.join(sql_parts)


def main():
    output_path = Path(__file__).parent.parent / "supabase" / "migrations" / "20260111120000_import_gitamala.sql"

    sql = generate_migration()

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(sql)

    print(f"Generated migration: {output_path}")
    print(f"Size: {len(sql)} bytes")


if __name__ == "__main__":
    main()
