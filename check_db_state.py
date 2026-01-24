#!/usr/bin/env python3
"""
Перевірка стану бази даних Supabase
Показує, які книги та глави зараз є в БД
"""

import os
import sys
from supabase import create_client

SUPABASE_URL = 'https://qeplxgqadcbwlrbgydlb.supabase.co'
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY') or \
               'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcGx4Z3FhZGNid2xyYmd5ZGxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDcyNzUsImV4cCI6MjA3MzY4MzI3NX0.fiA58EYJWNtAzEeG341t98QHmLcY6cwtpgC-TfKx6G0'


def check_database_state():
    print('📊 Перевірка стану бази даних Supabase...\n')
    print(f'URL: {SUPABASE_URL}')
    key_type = 'SERVICE_ROLE' if os.getenv('SUPABASE_SERVICE_KEY') else 'ANON'
    print(f'Key type: {key_type}\n')

    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

        # 1. Перевірити книги
        books_response = supabase.table('books') \
            .select('id, slug, title_uk, title_en, has_cantos, is_published') \
            .order('display_order', desc=False) \
            .execute()

        books = books_response.data

        print(f'📚 Книги (всього {len(books)}):\n')
        for book in books:
            cantos_str = 'так' if book.get('has_cantos') else 'ні'
            pub_str = 'так' if book.get('is_published') else 'ні'
            print(f"  • {book['slug']} - {book['title_uk']}")
            print(f"    (cantos: {cantos_str}, published: {pub_str})")

        print('')

        # 2. Знайти Śrīmad-Bhāgavatam
        sb_book = next((b for b in books if b['slug'] == 'srimad-bhagavatam'), None)

        if not sb_book:
            print('❌ Śrīmad-Bhāgavatam НЕ ЗНАЙДЕНО в таблиці books!\n')
            return
        else:
            print(f"✅ Śrīmad-Bhāgavatam знайдено: {sb_book['id']}\n")

        # 3. Перевірити cantos для SB
        cantos_response = supabase.table('cantos') \
            .select('id, canto_number, title_uk, title_en') \
            .eq('book_id', sb_book['id']) \
            .order('canto_number', desc=False) \
            .execute()

        cantos = cantos_response.data

        print(f"🎵 Пісні Śrīmad-Bhāgavatam (всього {len(cantos)}):\n")
        if cantos:
            for canto in cantos:
                title = canto.get('title_uk') or canto.get('title_en') or '(без назви)'
                print(f"  • Пісня {canto['canto_number']}: {title}")
        else:
            print('  ⚠️  Пісні НЕ ЗНАЙДЕНО')

        print('')

        # 4. Для кожної пісні перевірити глави
        if cantos:
            for canto in cantos:
                chapters_response = supabase.table('chapters') \
                    .select('id, chapter_number, title_uk, chapter_type') \
                    .eq('canto_id', canto['id']) \
                    .order('chapter_number', desc=False) \
                    .execute()

                chapters = chapters_response.data

                if chapters:
                    print(f"  📖 Пісня {canto['canto_number']}: {len(chapters)} глав")

                    # Перевірити вірші для перших 3 глав
                    for chapter in chapters[:3]:
                        verses_response = supabase.table('verses') \
                            .select('id', count='exact') \
                            .eq('chapter_id', chapter['id']) \
                            .is_('deleted_at', 'null') \
                            .execute()

                        verse_count = verses_response.count if hasattr(verses_response, 'count') else 0

                        chapter_type = chapter.get('chapter_type', 'unknown')
                        print(f"    • Глава {chapter['chapter_number']}: {verse_count} віршів ({chapter_type})")

                    if len(chapters) > 3:
                        print(f"    ... ще {len(chapters) - 3} глав")

                    print('')

        # 5. Перевірити загальну кількість віршів
        total_verses_response = supabase.table('verses') \
            .select('id', count='exact') \
            .is_('deleted_at', 'null') \
            .execute()

        total_count = total_verses_response.count if hasattr(total_verses_response, 'count') else 0
        print(f'\n📝 Всього віршів в БД: {total_count}')

        # 6. Перевірити Śrīmad-Bhāgavatam verses specifically
        if cantos:
            canto_ids = [c['id'] for c in cantos]

            # Отримати всі глави для цих cantos
            all_sb_chapters = supabase.table('chapters') \
                .select('id') \
                .in_('canto_id', canto_ids) \
                .execute()

            if all_sb_chapters.data:
                chapter_ids = [ch['id'] for ch in all_sb_chapters.data]

                sb_verses_response = supabase.table('verses') \
                    .select('id', count='exact') \
                    .in_('chapter_id', chapter_ids) \
                    .is_('deleted_at', 'null') \
                    .execute()

                sb_count = sb_verses_response.count if hasattr(sb_verses_response, 'count') else 0
                print(f'📝 Віршів Śrīmad-Bhāgavatam: {sb_count}')

        print('\n✅ Перевірка завершена')

    except Exception as e:
        print(f'❌ Помилка: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    check_database_state()
