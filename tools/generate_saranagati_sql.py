#!/usr/bin/env python3
"""
Generate SQL migration for Saranagati book with proper verses table structure.

Структура полів:
- sanskrit_en / sanskrit_uk — Bengali/Sanskrit (однаковий вміст)
- transliteration_en — IAST транслітерація (латинка з діакритикою)
- transliteration_uk — українська кирилична транслітерація з діакритикою
- synonyms_en / synonyms_uk — слово-за-словом (не маємо)
- translation_en / translation_uk — переклад
- commentary_en / commentary_uk — пояснення
"""

import json
import re
import unicodedata
from pathlib import Path

# Prabhupada's purports for specific verses (Ukrainian)
# Key: (section_number, song_number) -> dict of verse_number -> list of purport texts
PRABHUPADA_PURPORTS_UA = {
    (1, 1): {
        3: [
            "У своєму поясненні до **«Чайтанья-чарітамріта»**, Мадг'я-ліла 20.135, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Відданий не буде покладатися на свої матеріальні ресурси, а на милість Верховного Бога-Особи, який може дати справжній захист. Це називається *ракшішьяті ті вішвасах*, або \"*авашья ракшібе крішна*\"—*вішваса палана*».",
            "Під час лекції зі **«Шрімад-Бгаґаватам»** 6.3.16-17 (Ґоракхпур, 10 лютого 1971 року), Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Віддатися означає просто приймати сприятливе служіння Крішні та відкидати все, що несприятливе, а далі йде *авашья ракшібе крішна вішваса-палана*: \"І бути твердо переконаним, що Крішна дасть мені весь захист\"»."
        ]
    },
    (3, 3): {
        1: [
            "У своєму поясненні до **«Чайтанья-чарітамріта»**, Мадг'я-ліла 10.55, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Це процес віддання себе. Як співає Шріла Бгактівінод Тхакур: *манаса, деха, ґеха, йо кічху мора / арпілун туйа паде нанда-кішора!* Коли людина віддається лотосним стопам Господа, вона робить це з усім, що має у своєму володінні»."
        ],
        5: [
            "У своєму поясненні до **«Чайтанья-чарітамріта»**, Антья-ліла 1.24, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Шріла Бгактівінод Тхакур також співав: *кіта-джанма ха-у йатха туйа даса* (**«Шаранаґаті»** 11). Немає нічого поганого в тому, щоб народжуватися знову і знову. Наше єдине бажання має бути народитися під опікою вайшнава»."
        ]
    },
    (4, 3): {
        1: [
            "У своєму поясненні до **«Чайтанья-чарітамріта»**, Антья-ліла 1.24, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Тому Шріла Бгактівінод Тхакур співав: *тумі та' тхакура, томара куккура, баліййа джанаха море*. Так він пропонує стати собакою вайшнава. Є багато інших прикладів, коли домашня тварина вайшнава була повернута додому, до Вайкунтхалоки»."
        ]
    },
    (6, 3): {
        3: [
            "У своєму поясненні до **«Чайтанья-чарітамріта»**, Антья-ліла 4.211, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «Шріла Бгактівінод Тхакур пише в пісні: *ґаура амара, йе саба стхане, карала бграмана ранґе / се-саба стхана, херіба амі, пранайі-бгаката-санґе*. \"Нехай я відвідаю всі святі місця, пов'язані з лілами Господа Чайтаньї та Його відданих\"»."
        ],
        6: [
            "У своєму поясненні до **«Чайтанья-чарітамріта»**, Мадг'я-ліла 7.69, Його Божественна Милість А.Ч. Бгактіведанта Свамі Прабгупада каже: «У своїй книзі **«Шаранаґаті»** Бгактівінод Тхакур стверджує: *йе-діна ґріхе, бгаджана декхі', ґріхете ґолока бгайа*. Коли сімейна людина прославляє Верховного Господа у своєму домі, її діяльність негайно перетворюється на діяльність Ґолоки Вріндавани»."
        ]
    }
}


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
    data_path = Path(__file__).parent.parent / "src" / "data" / "saranagati-parsed.json"
    with open(data_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    sql_parts = []

    # Header
    sql_parts.append("""-- Import Saranagati by Bhaktivinoda Thakura
-- Proper structure: books -> cantos -> chapters -> verses
-- Fields: sanskrit_en/uk, transliteration_en/uk, synonyms_en/uk, translation_en/uk, commentary_en/uk

BEGIN;

-- 1. Create/update the book
INSERT INTO public.books (slug, title_en, title_uk, is_published, has_cantos)
VALUES ('saranagati', 'Saranagati', 'Шаранаґаті', true, true)
ON CONFLICT (slug) DO UPDATE SET
  title_uk = EXCLUDED.title_uk,
  has_cantos = EXCLUDED.has_cantos;

-- Get book ID
DO $$
DECLARE
  v_book_id uuid;
  v_canto_id uuid;
  v_chapter_id uuid;
BEGIN
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'saranagati';
""")

    # Generate cantos (sections)
    for section in data['sections']:
        section_num = section['section_number']
        title_en = escape_sql(section.get('title_en', section['title']))
        title_uk = escape_sql(section.get('title_uk', ''))

        sql_parts.append(f"""
  -- Canto {section_num}: {title_en}
  INSERT INTO public.cantos (book_id, canto_number, title_en, title_uk, is_published)
  VALUES (v_book_id, {section_num}, E'{title_en}', E'{title_uk}', true)
  ON CONFLICT (book_id, canto_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk;
""")

    # Generate chapters and verses
    for section in data['sections']:
        section_num = section['section_number']

        for song in section['songs']:
            song_num = song['song_number']
            title_en = escape_sql(song['title_en'])
            title_uk = escape_sql(song.get('title_uk', ''))

            sql_parts.append(f"""
  -- Section {section_num}, Song {song_num}: {title_en}
  SELECT id INTO v_canto_id FROM public.cantos
  WHERE book_id = v_book_id AND canto_number = {section_num};

  INSERT INTO public.chapters (canto_id, chapter_number, title_en, title_uk, chapter_type, is_published)
  VALUES (v_canto_id, {song_num}, E'{title_en}', E'{title_uk}', 'verses', true)
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
    title_en = EXCLUDED.title_en,
    title_uk = EXCLUDED.title_uk,
    chapter_type = EXCLUDED.chapter_type;

  SELECT id INTO v_chapter_id FROM public.chapters
  WHERE canto_id = v_canto_id AND chapter_number = {song_num};
""")

            # Get verse data
            bengali = song.get('bengali', [])
            transliteration = song.get('transliteration', [])
            translation = song.get('translation', [])
            purport_en = song.get('purport_en', '')

            # Get verse-specific Ukrainian purports
            purport_key = (section_num, song_num)
            verse_purports_uk = PRABHUPADA_PURPORTS_UA.get(purport_key, {})

            # Determine number of verses
            num_verses = max(len(bengali), len(transliteration), len(translation))

            for i in range(num_verses):
                verse_num = i + 1

                # sanskrit_en and sanskrit_uk - both contain Bengali text
                sanskrit_text = escape_sql(bengali[i] if i < len(bengali) else '')

                # transliteration_en - IAST (Latin with diacritics)
                translit_en = transliteration[i] if i < len(transliteration) else ''
                translit_en_escaped = escape_sql(translit_en)

                # transliteration_uk - Ukrainian cyrillic (converted from IAST)
                translit_uk = convert_iast_to_ukrainian(translit_en)
                translit_uk_escaped = escape_sql(translit_uk)

                # translation_en
                trans_en = escape_sql(translation[i] if i < len(translation) else '')

                # translation_uk - not available yet, empty
                trans_uk = ''

                # synonyms_en / synonyms_uk - not available
                synonyms_en = ''
                synonyms_uk = ''

                # commentary_en - English purport goes on the last verse
                verse_comm_en = escape_sql(purport_en) if verse_num == num_verses else ''

                # commentary_uk - Ukrainian purport - distribute to specific verses
                if verse_num in verse_purports_uk:
                    verse_comm_uk = escape_sql("\n\n".join(verse_purports_uk[verse_num]))
                else:
                    verse_comm_uk = ''

                sql_parts.append(f"""
  -- Verse {verse_num}
  INSERT INTO public.verses (
    chapter_id, verse_number, verse_number_sort,
    sanskrit_en, sanskrit_uk,
    transliteration_en, transliteration_uk,
    synonyms_en, synonyms_uk,
    translation_en, translation_uk,
    commentary_en, commentary_uk,
    is_published
  )
  VALUES (
    v_chapter_id, '{verse_num}', {verse_num},
    E'{sanskrit_text}', E'{sanskrit_text}',
    E'{translit_en_escaped}', E'{translit_uk_escaped}',
    E'{synonyms_en}', E'{synonyms_uk}',
    E'{trans_en}', E'{trans_uk}',
    E'{verse_comm_en}', E'{verse_comm_uk}',
    true
  )
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit_en = EXCLUDED.sanskrit_en,
    sanskrit_uk = EXCLUDED.sanskrit_uk,
    transliteration_en = EXCLUDED.transliteration_en,
    transliteration_uk = EXCLUDED.transliteration_uk,
    synonyms_en = EXCLUDED.synonyms_en,
    synonyms_uk = EXCLUDED.synonyms_uk,
    translation_en = EXCLUDED.translation_en,
    translation_uk = EXCLUDED.translation_uk,
    commentary_en = EXCLUDED.commentary_en,
    commentary_uk = EXCLUDED.commentary_uk;
""")

    # Close the DO block
    sql_parts.append("""
END $$;

COMMIT;
""")

    return '\n'.join(sql_parts)


def main():
    output_path = Path(__file__).parent.parent / "supabase" / "migrations" / "20260110120000_import_saranagati.sql"

    sql = generate_migration()

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(sql)

    print(f"Generated migration: {output_path}")
    print(f"Size: {len(sql)} bytes")


if __name__ == "__main__":
    main()
