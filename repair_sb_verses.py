#!/usr/bin/env python3
"""
🔧 Виправлення віршів Śrīmad-Bhāgavatam

Відновлює вірші що були помилково позначені як видалені або неопубліковані.

Використання:
    # Dry-run (перегляд без змін):
    python3 repair_sb_verses.py --dry-run

    # Виправити вірші:
    python3 repair_sb_verses.py

    # Виправити тільки конкретну пісню:
    python3 repair_sb_verses.py --canto 2

    # Виправити тільки конкретну главу:
    python3 repair_sb_verses.py --canto 2 --chapter 10
"""

import os
import sys
import argparse
from datetime import datetime
from supabase import create_client

SUPABASE_URL = 'https://qeplxgqadcbwlrbgydlb.supabase.co'
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_KEY')

if not SUPABASE_KEY:
    print('❌ ПОМИЛКА: Встановіть змінну оточення SUPABASE_SERVICE_KEY')
    print('   export SUPABASE_SERVICE_KEY="eyJ..."')
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description='Відновлення віршів Śrīmad-Bhāgavatam'
    )
    parser.add_argument('--dry-run', action='store_true', help='Показати що буде виправлено без фактичних змін')
    parser.add_argument('--canto', type=int, help='Виправити тільки конкретну пісню (наприклад, 2)')
    parser.add_argument('--chapter', type=int, help='Виправити тільки конкретну главу (потрібно вказати --canto)')

    args = parser.parse_args()

    if args.chapter and not args.canto:
        print('❌ ПОМИЛКА: --chapter потребує --canto')
        sys.exit(1)

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    print('🔍 Пошук книги Śrīmad-Bhāgavatam...')

    # Знайти книгу
    book_response = supabase.table('books') \
        .select('id, slug, title_ua') \
        .eq('slug', 'srimad-bhagavatam') \
        .maybeSingle() \
        .execute()

    book = book_response.data
    if not book:
        print('❌ Книга не знайдена! Спробуйте інший slug.')
        sys.exit(1)

    print(f"✅ Знайдено: {book['title_ua']} (ID: {book['id']})\n")

    # Знайти всі cantos
    cantos_query = supabase.table('cantos') \
        .select('id, canto_number, title_ua') \
        .eq('book_id', book['id']) \
        .order('canto_number')

    if args.canto:
        cantos_query = cantos_query.eq('canto_number', args.canto)

    cantos_response = cantos_query.execute()
    cantos = cantos_response.data

    if not cantos:
        print('❌ Пісні не знайдені!')
        sys.exit(1)

    print(f"📚 Знайдено {len(cantos)} пісень")

    total_deleted = 0
    total_unpublished = 0
    total_restored = 0

    for canto in cantos:
        print(f"\n🎵 Пісня {canto['canto_number']}: {canto['title_ua']}")

        # Знайти chapters для цієї canto
        chapters_query = supabase.table('chapters') \
            .select('id, chapter_number, title_ua') \
            .eq('canto_id', canto['id']) \
            .order('chapter_number')

        if args.chapter:
            chapters_query = chapters_query.eq('chapter_number', args.chapter)

        chapters_response = chapters_query.execute()
        chapters = chapters_response.data

        if not chapters:
            print(f"  ⚠️  Глави не знайдені")
            continue

        chapter_ids = [ch['id'] for ch in chapters]

        # Діагностика - скільки проблемних віршів
        verses_response = supabase.table('verses') \
            .select('id, chapter_id, verse_number, deleted_at, is_published') \
            .in_('chapter_id', chapter_ids) \
            .execute()

        verses = verses_response.data

        deleted_verses = [v for v in verses if v.get('deleted_at') is not None]
        unpublished_verses = [v for v in verses if v.get('is_published') is False]

        if not deleted_verses and not unpublished_verses:
            print(f"  ✅ Всі {len(verses)} віршів в порядку")
            continue

        print(f"  📊 Статистика:")
        print(f"     Всього віршів: {len(verses)}")
        print(f"     Видалені (deleted_at): {len(deleted_verses)}")
        print(f"     Неопубліковані (is_published=false): {len(unpublished_verses)}")

        total_deleted += len(deleted_verses)
        total_unpublished += len(unpublished_verses)

        if args.dry_run:
            print(f"  🔍 DRY RUN: Було б виправлено {len(deleted_verses) + len(unpublished_verses)} віршів")
            continue

        # Виправлення
        print(f"  🔧 Виправлення...")

        # Відновити deleted вірші
        if deleted_verses:
            deleted_ids = [v['id'] for v in deleted_verses]
            update_response = supabase.table('verses') \
                .update({'deleted_at': None}) \
                .in_('id', deleted_ids) \
                .execute()

            print(f"     ✅ Відновлено {len(deleted_ids)} видалених віршів")
            total_restored += len(deleted_ids)

        # Опублікувати unpublished вірші
        if unpublished_verses:
            unpublished_ids = [v['id'] for v in unpublished_verses]
            update_response = supabase.table('verses') \
                .update({'is_published': True}) \
                .in_('id', unpublished_ids) \
                .execute()

            print(f"     ✅ Опубліковано {len(unpublished_ids)} віршів")
            total_restored += len(unpublished_ids)

    print('\n' + '='*60)
    if args.dry_run:
        print('🔍 DRY RUN - ЗМІНИ НЕ ЗБЕРЕЖЕНО')
        print(f'📊 Знайдено проблем:')
        print(f'   • Видалені вірші: {total_deleted}')
        print(f'   • Неопубліковані вірші: {total_unpublished}')
        print(f'\n▶️  Запустіть без --dry-run щоб виправити')
    else:
        print('✅ ВИПРАВЛЕННЯ ЗАВЕРШЕНО')
        print(f'📊 Результат:')
        print(f'   • Відновлено/Опубліковано віршів: {total_restored}')
        print(f'\n🌐 Перевірте сайт: вірші мають відображатися')

    print('='*60)


if __name__ == '__main__':
    main()
