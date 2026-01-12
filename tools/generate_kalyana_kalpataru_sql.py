#!/usr/bin/env python3
"""
Generate SQL migration for Kalyana Kalpataru book with proper verses table structure.
65 songs by Bhaktivinoda Thakura (1893) across 14 sections
"""

import json
import re
import unicodedata
from pathlib import Path


def convert_iast_to_ukrainian(text: str) -> str:
    if not text:
        return text
    text = unicodedata.normalize('NFC', text)
    patterns = {
        'nya': 'нйа', 'nye': 'нйе', 'nyi': 'нйі', 'nyo': 'нйо', 'nyu': 'нйу', 'jjh': 'жджх',
        'yā': 'йа̄', 'yī': 'йı̄', 'yū': 'йӯ', 'ā': 'а̄', 'ī': 'ı̄', 'ū': 'ӯ',
        'ṝ': 'р̣̄', 'ḹ': 'л̣̄', 'ṭ': 'т̣', 'ḍ': 'д̣', 'ṇ': 'н̣', 'ṣ': 'ш', 'ṛ': 'р̣',
        'ś': 'ш́', 'ñ': 'н̃', 'ṅ': 'н̇', 'ṁ': 'м̇', 'ṃ': 'м̣', 'ḥ': 'х̣', 'ḷ': 'л̣',
        'Ā': 'А̄', 'Ī': 'Ī', 'Ū': 'Ӯ',
        'bh': 'бг', 'gh': 'ґг', 'dh': 'дг', 'th': 'тх', 'ph': 'пх', 'kh': 'кх',
        'ch': 'чх', 'jh': 'джх', 'sh': 'сх', 'kṣ': 'кш', 'jñ': 'джн̃',
        'ai': 'аі', 'au': 'ау',
        'k': 'к', 'g': 'ґ', 'c': 'ч', 'j': 'дж', 't': 'т', 'd': 'д', 'p': 'п', 'b': 'б',
        'y': 'й', 'r': 'р', 'l': 'л', 'v': 'в', 'w': 'в', 'h': 'х', 'm': 'м', 'n': 'н', 's': 'с',
        'K': 'К', 'G': 'Ґ', 'C': 'Ч', 'J': 'Дж', 'T': 'Т', 'D': 'Д', 'P': 'П', 'B': 'Б',
        'Y': 'Й', 'R': 'Р', 'L': 'Л', 'V': 'В', 'W': 'В', 'H': 'Х', 'M': 'М', 'N': 'Н', 'S': 'С',
        'a': 'а', 'i': 'і', 'u': 'у', 'e': 'е', 'o': 'о',
        'A': 'А', 'I': 'І', 'U': 'У', 'E': 'Е', 'O': 'О',
    }
    result = []
    i = 0
    while i < len(text):
        matched = False
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
    if not text:
        return text
    text = text.replace('\x92', "'")
    text = re.sub(r'\n?(UPDATED|UDPATED):?[^\n]*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n?(January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{1,2},?\s*\n?\s*\d{4}', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\n\d{4}\s*$', '', text)
    text = '\n'.join(line for line in text.split('\n') if line.strip())
    return text.strip()


def escape_sql(text: str) -> str:
    if not text:
        return ""
    text = clean_artifacts(text)
    return text.replace("'", "''").replace("\\", "\\\\")


def generate_migration():
    data_path = Path(__file__).parent.parent / "src" / "data" / "kalyana-kalpataru-parsed.json"
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    sql_parts = []
    sql_parts.append("""-- Import Kalyana Kalpataru by Bhaktivinoda Thakura (1893)
-- "Desire Tree of Auspiciousness" - 65 songs across 14 sections
-- Structure: books -> cantos (sections) -> chapters (songs) -> verses

BEGIN;

INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('kalyana-kalpataru', 'Kalyana Kalpataru', 'Кальяна Калпатару', true, true)
ON CONFLICT (slug) DO UPDATE SET
  title_ua = EXCLUDED.title_ua,
  has_cantos = EXCLUDED.has_cantos;

DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'kalyana-kalpataru';
""")

    for section in data['sections']:
        section_num = section['section_number']
        section_title = escape_sql(section['title'])
        section_title_en = escape_sql(section['title_en'])
        section_title_ua = escape_sql(section['title_ua'])

        sql_parts.append(f"""
  -- Section {section_num}: {section_title}
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_ua, is_published)
  VALUES (v_book_id, {section_num}, E'{section_title_en}', E'{section_title_ua}', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_ua = EXCLUDED.title_ua;

  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = {section_num};
""")

        for song in section['songs']:
            song_num = song['song_number']
            title_en = escape_sql(song['title_en'])

            sql_parts.append(f"""
  -- Song {song_num}: {title_en}
  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_ua, chapter_type, is_published)
  VALUES (v_canto_id, {song_num}, E'{title_en}', E'', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = {song_num};
""")

            bengali = song.get('bengali', [])
            transliteration = song.get('transliteration', [])
            translation = song.get('translation', [])

            num_verses = max(len(bengali), len(transliteration), len(translation), 1)

            for i in range(num_verses):
                verse_num = i + 1
                bengali_text = escape_sql(bengali[i] if i < len(bengali) else '')
                translit_en = transliteration[i] if i < len(transliteration) else ''
                translit_en_escaped = escape_sql(translit_en)
                translit_ua = convert_iast_to_ukrainian(translit_en)
                translit_ua_escaped = escape_sql(translit_ua)
                trans_en = escape_sql(translation[i] if i < len(translation) else '')

                sql_parts.append(f"""
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_ua,
    transliteration_en, transliteration_ua,
    synonyms_en, synonyms_ua,
    translation_en, translation_ua,
    commentary_en, commentary_ua,
    is_published
  )
  VALUES (
    v_chapter_id, '{verse_num}', {verse_num},
    E'{bengali_text}', E'{bengali_text}',
    E'{translit_en_escaped}', E'{translit_ua_escaped}',
    E'', E'',
    E'{trans_en}', E'',
    E'', E'',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_ua = EXCLUDED.sanskrit_ua,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_ua = EXCLUDED.transliteration_ua,
    translation_en = EXCLUDED.translation_en;
""")

    sql_parts.append("""
END $$;

COMMIT;
""")

    return '\n'.join(sql_parts)


def main():
    output_path = Path(__file__).parent.parent / "supabase" / "migrations" / "20260112150000_import_kalyana_kalpataru.sql"
    sql = generate_migration()
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(sql)
    print(f"Generated migration: {output_path}")
    print(f"Size: {len(sql)} bytes")


if __name__ == "__main__":
    main()
