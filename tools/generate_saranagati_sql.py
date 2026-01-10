#!/usr/bin/env python3
"""
Generate SQL migration for Saranagati book with proper verses table structure.
"""

import json
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


def escape_sql(text: str) -> str:
    """Escape text for SQL string literal."""
    if not text:
        return ""
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

BEGIN;

-- 1. Create/update the book
INSERT INTO public.books (slug, title_en, title_ua, is_published, has_cantos)
VALUES ('saranagati', 'Saranagati', 'Шаранаґаті', true, true)
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
  SELECT id INTO v_book_id FROM public.books WHERE slug = 'saranagati';
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
  ON CONFLICT (canto_id, chapter_number) DO UPDATE SET
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
            purport_en = song.get('purport_en', '')

            # Get verse-specific Ukrainian purports
            purport_key = (section_num, song_num)
            verse_purports_ua = PRABHUPADA_PURPORTS_UA.get(purport_key, {})

            # Determine number of verses
            num_verses = max(len(bengali), len(transliteration), len(translation))

            for i in range(num_verses):
                verse_num = i + 1

                # Get verse components (with fallbacks for missing data)
                sanskrit = escape_sql(bengali[i] if i < len(bengali) else '')
                translit = escape_sql(transliteration[i] if i < len(transliteration) else '')
                trans_en = escape_sql(translation[i] if i < len(translation) else '')

                # English purport goes on the last verse
                verse_comm_en = escape_sql(purport_en) if verse_num == num_verses else ''

                # Ukrainian purport - distribute to specific verses
                if verse_num in verse_purports_ua:
                    verse_comm_ua = escape_sql("\n\n".join(verse_purports_ua[verse_num]))
                else:
                    verse_comm_ua = ''

                sql_parts.append(f"""
  -- Verse {verse_num}
  INSERT INTO public.verses (chapter_id, verse_number, verse_number_sort, sanskrit, transliteration, translation_en, commentary_en, commentary_ua, is_published)
  VALUES (v_chapter_id, '{verse_num}', {verse_num}, E'{sanskrit}', E'{translit}', E'{trans_en}', E'{verse_comm_en}', E'{verse_comm_ua}', true)
  ON CONFLICT (chapter_id, verse_number) DO UPDATE SET
    sanskrit = EXCLUDED.sanskrit,
    transliteration = EXCLUDED.transliteration,
    translation_en = EXCLUDED.translation_en,
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
    output_path = Path(__file__).parent.parent / "supabase" / "migrations" / "20260110120000_import_saranagati.sql"

    sql = generate_migration()

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(sql)

    print(f"Generated migration: {output_path}")
    print(f"Size: {len(sql)} bytes")


if __name__ == "__main__":
    main()
