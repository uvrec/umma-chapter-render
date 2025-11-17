#!/usr/bin/env node
/**
 * Перевірка стану бази даних Supabase
 * Показує, які книги та глави зараз є в БД
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qeplxgqadcbwlrbgydlb.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlcGx4Z3FhZGNid2xyYmd5ZGxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMDcyNzUsImV4cCI6MjA3MzY4MzI3NX0.fiA58EYJWNtAzEeG341t98QHmLcY6cwtpgC-TfKx6G0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkDatabaseState() {
  console.log('📊 Перевірка стану бази даних Supabase...\n');
  console.log('URL:', SUPABASE_URL);
  console.log('Key type:', process.env.SUPABASE_SERVICE_KEY ? 'SERVICE_ROLE' : 'ANON', '\n');

  try {
    // 1. Перевірити книги
    const { data: books, error: booksError } = await supabase
      .from('books')
      .select('id, slug, title_ua, title_en, has_cantos, is_published')
      .order('display_order', { ascending: true });

    if (booksError) {
      console.error('❌ Помилка при отриманні книг:', booksError.message);
      return;
    }

    console.log(`📚 Книги (всього ${books?.length || 0}):`);
    books?.forEach(book => {
      console.log(`  • ${book.slug} - ${book.title_ua} (cantos: ${book.has_cantos ? 'так' : 'ні'}, published: ${book.is_published ? 'так' : 'ні'})`);
    });
    console.log('');

    // 2. Перевірити Śrīmad-Bhāgavatam specifically
    const sbBook = books?.find(b => b.slug === 'srimad-bhagavatam');
    if (!sbBook) {
      console.log('❌ Śrīmad-Bhāgavatam НЕ ЗНАЙДЕНО в таблиці books!\n');
    } else {
      console.log(`✅ Śrīmad-Bhāgavatam знайдено: ${sbBook.id}\n`);

      // 3. Перевірити cantos для SB
      const { data: cantos, error: cantosError } = await supabase
        .from('cantos')
        .select('id, canto_number, title_ua, title_en')
        .eq('book_id', sbBook.id)
        .order('canto_number', { ascending: true });

      if (cantosError) {
        console.error('❌ Помилка при отриманні пісень:', cantosError.message);
      } else {
        console.log(`🎵 Пісні Śrīmad-Bhāgavatam (всього ${cantos?.length || 0}):`);
        if (cantos && cantos.length > 0) {
          cantos.forEach(canto => {
            console.log(`  • Пісня ${canto.canto_number}: ${canto.title_ua || canto.title_en || '(без назви)'}`);
          });
        } else {
          console.log('  ⚠️  Пісні НЕ ЗНАЙДЕНО');
        }
        console.log('');

        // 4. Для кожної пісні перевірити глави
        if (cantos && cantos.length > 0) {
          for (const canto of cantos) {
            const { data: chapters, error: chaptersError } = await supabase
              .from('chapters')
              .select('id, chapter_number, title_ua, chapter_type')
              .eq('canto_id', canto.id)
              .order('chapter_number', { ascending: true });

            if (!chaptersError && chapters) {
              console.log(`  📖 Пісня ${canto.canto_number}: ${chapters.length} глав`);

              // Перевірити вірші для перших 3 глав
              for (const chapter of chapters.slice(0, 3)) {
                const { count, error: versesError } = await supabase
                  .from('verses')
                  .select('id', { count: 'exact', head: true })
                  .eq('chapter_id', chapter.id)
                  .is('deleted_at', null);

                if (!versesError) {
                  console.log(`    • Глава ${chapter.chapter_number}: ${count || 0} віршів (${chapter.chapter_type})`);
                }
              }

              if (chapters.length > 3) {
                console.log(`    ... ще ${chapters.length - 3} глав`);
              }
            }
          }
        }
      }
    }

    // 5. Перевірити загальну кількість віршів
    const { count: totalVerses, error: versesCountError } = await supabase
      .from('verses')
      .select('id', { count: 'exact', head: true })
      .is('deleted_at', null);

    if (!versesCountError) {
      console.log(`\n📝 Всього віршів в БД: ${totalVerses || 0}`);
    }

    // 6. Перевірити Śrīmad-Bhāgavatam verses specifically (через chapters)
    if (sbBook) {
      const { data: sbChapters, error: sbChaptersError } = await supabase
        .from('chapters')
        .select('id')
        .or(`book_id.eq.${sbBook.id},canto_id.not.is.null`);

      if (!sbChaptersError && sbChapters && sbChapters.length > 0) {
        const chapterIds = sbChapters.map(ch => ch.id);

        const { count: sbVerses, error: sbVersesError } = await supabase
          .from('verses')
          .select('id', { count: 'exact', head: true })
          .in('chapter_id', chapterIds)
          .is('deleted_at', null);

        if (!sbVersesError) {
          console.log(`📝 Віршів Śrīmad-Bhāgavatam: ${sbVerses || 0}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Неочікувана помилка:', error);
  }

  console.log('\n✅ Перевірка завершена');
}

checkDatabaseState();
