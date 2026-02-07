/**
 * Офлайн-пошук з SQLite FTS5
 *
 * Натхненний архітектурою vidya-builder (https://github.com/vidyabase/vidya-builder):
 * - FTS5 віртуальна таблиця з UNINDEXED метаданими
 * - Індексація тексту при завантаженні глав
 * - Швидкий повнотекстовий пошук без мережі
 *
 * Нативні застосунки: SQLite FTS5 через @capacitor-community/sqlite
 * Веб fallback: простий текстовий пошук по IndexedDB
 */

import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

// ============================================================================
// TYPES
// ============================================================================

export interface OfflineSearchResult {
  verseId: string;
  chapterId: string;
  bookId: string;
  bookSlug: string;
  verseNumber: string;
  chapterNumber: number;
  cantoNumber?: number;
  snippet: string;
  matchedField: string;
  rank: number;
}

export interface IndexableVerse {
  id: string;
  chapterId: string;
  bookId: string;
  bookSlug: string;
  verseNumber: string;
  chapterNumber: number;
  cantoNumber?: number;
  translationUk?: string;
  translationEn?: string;
  commentaryUk?: string;
  commentaryEn?: string;
  synonymsUk?: string;
  synonymsEn?: string;
  sanskrit?: string;
  transliteration?: string;
}

export interface OfflineSearchStats {
  totalIndexedVerses: number;
  totalIndexedChapters: number;
  indexSizeEstimate: string;
  lastIndexedAt: number | null;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const SEARCH_DB_NAME = 'vedavoice_search_fts';
const SEARCH_DB_VERSION = 1;

// ============================================================================
// SQLITE FTS5 IMPLEMENTATION (Native)
// ============================================================================

let searchDbConnection: SQLiteConnection | null = null;
let searchDb: SQLiteDBConnection | null = null;

/**
 * Ініціалізація бази для FTS5 пошуку
 */
async function initSearchDb(): Promise<SQLiteDBConnection | null> {
  if (searchDb) return searchDb;

  try {
    searchDbConnection = new SQLiteConnection(CapacitorSQLite);

    const ret = await searchDbConnection.checkConnectionsConsistency();
    const isConn = (await searchDbConnection.isConnection(SEARCH_DB_NAME, false)).result;

    if (ret.result && isConn) {
      searchDb = await searchDbConnection.retrieveConnection(SEARCH_DB_NAME, false);
    } else {
      searchDb = await searchDbConnection.createConnection(
        SEARCH_DB_NAME,
        false,
        'no-encryption',
        SEARCH_DB_VERSION,
        false
      );
    }

    await searchDb.open();

    // Створюємо таблицю метаданих
    await searchDb.execute(`
      CREATE TABLE IF NOT EXISTS search_meta (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);

    // Створюємо таблицю для відслідковування проіндексованих глав
    await searchDb.execute(`
      CREATE TABLE IF NOT EXISTS indexed_chapters (
        chapter_id TEXT PRIMARY KEY NOT NULL,
        book_id TEXT NOT NULL,
        indexed_at INTEGER NOT NULL
      );
    `);

    // Створюємо FTS5 віртуальну таблицю
    // Натхнення з vidya-builder: item_type та item_id як UNINDEXED
    await searchDb.execute(`
      CREATE VIRTUAL TABLE IF NOT EXISTS verse_fts USING fts5(
        verse_id UNINDEXED,
        chapter_id UNINDEXED,
        book_id UNINDEXED,
        book_slug UNINDEXED,
        verse_number UNINDEXED,
        chapter_number UNINDEXED,
        canto_number UNINDEXED,
        matched_field UNINDEXED,
        plain_text,
        tokenize='unicode61 remove_diacritics 2'
      );
    `);

    // Зберігаємо версію
    await searchDb.run(
      `INSERT OR REPLACE INTO search_meta (key, value) VALUES ('db_version', ?)`,
      [String(SEARCH_DB_VERSION)]
    );

    return searchDb;
  } catch (error) {
    console.error('[OfflineSearch] SQLite init error:', error);
    return null;
  }
}

// ============================================================================
// HTML / TEXT UTILITIES
// ============================================================================

/**
 * Очистити HTML теги з тексту (за прикладом vidya-builder)
 * Block-level теги замінюються пробілами для збереження меж слів
 */
function stripHtml(text: string): string {
  // Теги що створюють пробіли між словами
  const spacingTags = /<(?:br|p|div|tr|td|th|li|h[1-6]|blockquote|section|article|header|footer|nav|aside|details|summary|figure|figcaption|main|pre|ol|ul|dl|dt|dd)[^>]*>/gi;
  let result = text.replace(spacingTags, ' ');
  // Видаляємо решту тегів
  result = result.replace(/<[^>]+>/g, '');
  // Нормалізуємо пробіли
  result = result.replace(/\s+/g, ' ');
  return result.trim();
}

/**
 * Підготувати текст для індексації
 */
function prepareTextForIndex(text: string | undefined | null): string {
  if (!text) return '';
  return stripHtml(text);
}

// ============================================================================
// INDEXING (Native SQLite)
// ============================================================================

/**
 * Індексувати вірші глави в FTS5
 */
async function indexVersesNative(
  verses: IndexableVerse[],
  chapterId: string,
  bookId: string
): Promise<boolean> {
  const db = await initSearchDb();
  if (!db) return false;

  try {
    // Перевіряємо чи глава вже проіндексована
    const existing = await db.query(
      'SELECT chapter_id FROM indexed_chapters WHERE chapter_id = ?',
      [chapterId]
    );
    if (existing.values && existing.values.length > 0) {
      // Видаляємо стару індексацію перед повторною
      await db.run('DELETE FROM verse_fts WHERE chapter_id = ?', [chapterId]);
    }

    // Індексуємо кожен вірш по полях
    for (const verse of verses) {
      const fields: Array<{ field: string; text: string }> = [];

      if (verse.translationUk) {
        fields.push({ field: 'translation_uk', text: prepareTextForIndex(verse.translationUk) });
      }
      if (verse.translationEn) {
        fields.push({ field: 'translation_en', text: prepareTextForIndex(verse.translationEn) });
      }
      if (verse.commentaryUk) {
        fields.push({ field: 'commentary_uk', text: prepareTextForIndex(verse.commentaryUk) });
      }
      if (verse.commentaryEn) {
        fields.push({ field: 'commentary_en', text: prepareTextForIndex(verse.commentaryEn) });
      }
      if (verse.synonymsUk) {
        fields.push({ field: 'synonyms_uk', text: prepareTextForIndex(verse.synonymsUk) });
      }
      if (verse.synonymsEn) {
        fields.push({ field: 'synonyms_en', text: prepareTextForIndex(verse.synonymsEn) });
      }
      if (verse.sanskrit) {
        fields.push({ field: 'sanskrit', text: prepareTextForIndex(verse.sanskrit) });
      }
      if (verse.transliteration) {
        fields.push({ field: 'transliteration', text: prepareTextForIndex(verse.transliteration) });
      }

      for (const { field, text } of fields) {
        if (!text) continue;
        await db.run(
          `INSERT INTO verse_fts (verse_id, chapter_id, book_id, book_slug, verse_number, chapter_number, canto_number, matched_field, plain_text)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            verse.id,
            verse.chapterId,
            verse.bookId,
            verse.bookSlug,
            verse.verseNumber,
            String(verse.chapterNumber),
            verse.cantoNumber != null ? String(verse.cantoNumber) : null,
            field,
            text,
          ]
        );
      }
    }

    // Позначаємо главу як проіндексовану
    await db.run(
      `INSERT OR REPLACE INTO indexed_chapters (chapter_id, book_id, indexed_at) VALUES (?, ?, ?)`,
      [chapterId, bookId, Date.now()]
    );

    return true;
  } catch (error) {
    console.error('[OfflineSearch] Index error:', error);
    return false;
  }
}

/**
 * Пошук у FTS5 (нативний SQLite)
 */
async function searchNative(
  query: string,
  options: {
    language?: 'uk' | 'en';
    bookIds?: string[];
    limit?: number;
  } = {}
): Promise<OfflineSearchResult[]> {
  const db = await initSearchDb();
  if (!db) return [];

  const { language = 'uk', bookIds, limit = 50 } = options;

  try {
    // Побудова FTS5 запиту
    const ftsQuery = buildFtsQuery(query);
    if (!ftsQuery) return [];

    let sql = `
      SELECT
        verse_id, chapter_id, book_id, book_slug,
        verse_number, chapter_number, canto_number,
        matched_field,
        snippet(verse_fts, 8, '<mark>', '</mark>', '...', 40) as snippet,
        rank
      FROM verse_fts
      WHERE verse_fts MATCH ?
    `;
    const params: (string | number)[] = [ftsQuery];

    // Фільтр за мовою - шукаємо лише в полях потрібної мови + мовно-незалежні
    const langSuffix = `_${language}`;
    sql += ` AND (matched_field LIKE '%${langSuffix}' OR matched_field = 'sanskrit' OR matched_field = 'transliteration')`;

    // Фільтр по книгах
    if (bookIds && bookIds.length > 0) {
      const placeholders = bookIds.map(() => '?').join(',');
      sql += ` AND book_id IN (${placeholders})`;
      params.push(...bookIds);
    }

    sql += ` ORDER BY rank LIMIT ?`;
    params.push(limit);

    const result = await db.query(sql, params);

    if (!result.values) return [];

    // Дедуплікація за verse_id (один вірш може збігтися в кількох полях)
    const seenVerses = new Map<string, OfflineSearchResult>();
    for (const row of result.values) {
      const verseId = row.verse_id as string;
      const existing = seenVerses.get(verseId);
      if (!existing || (row.rank as number) < existing.rank) {
        seenVerses.set(verseId, {
          verseId,
          chapterId: row.chapter_id as string,
          bookId: row.book_id as string,
          bookSlug: row.book_slug as string,
          verseNumber: row.verse_number as string,
          chapterNumber: Number(row.chapter_number),
          cantoNumber: row.canto_number ? Number(row.canto_number) : undefined,
          snippet: row.snippet as string,
          matchedField: row.matched_field as string,
          rank: row.rank as number,
        });
      }
    }

    return Array.from(seenVerses.values()).sort((a, b) => a.rank - b.rank).slice(0, limit);
  } catch (error) {
    console.error('[OfflineSearch] Search error:', error);
    return [];
  }
}

/**
 * Побудувати FTS5 запит з користувацького введення
 */
function buildFtsQuery(userQuery: string): string {
  const trimmed = userQuery.trim();
  if (!trimmed) return '';

  // Якщо запит вже у лапках — фразовий пошук
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed;
  }

  // Розділяємо на токени та обгортаємо кожен у лапки з *
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return '';

  if (tokens.length === 1) {
    // Один токен — пошук з prefix
    const escaped = tokens[0].replace(/"/g, '');
    return `"${escaped}"*`;
  }

  // Кілька токенів — шукаємо всі (AND)
  return tokens
    .map(t => {
      const escaped = t.replace(/"/g, '');
      return `"${escaped}"*`;
    })
    .join(' AND ');
}

/**
 * Видалити індекс глави (нативний SQLite)
 */
async function removeChapterIndexNative(chapterId: string): Promise<void> {
  const db = await initSearchDb();
  if (!db) return;

  try {
    await db.run('DELETE FROM verse_fts WHERE chapter_id = ?', [chapterId]);
    await db.run('DELETE FROM indexed_chapters WHERE chapter_id = ?', [chapterId]);
  } catch (error) {
    console.error('[OfflineSearch] Remove index error:', error);
  }
}

/**
 * Очистити весь пошуковий індекс (нативний SQLite)
 */
async function clearIndexNative(): Promise<void> {
  const db = await initSearchDb();
  if (!db) return;

  try {
    await db.run('DELETE FROM verse_fts');
    await db.run('DELETE FROM indexed_chapters');
  } catch (error) {
    console.error('[OfflineSearch] Clear index error:', error);
  }
}

/**
 * Статистика індексу (нативний SQLite)
 */
async function getStatsNative(): Promise<OfflineSearchStats> {
  const db = await initSearchDb();
  if (!db) {
    return { totalIndexedVerses: 0, totalIndexedChapters: 0, indexSizeEstimate: '0 KB', lastIndexedAt: null };
  }

  try {
    const versesResult = await db.query('SELECT COUNT(DISTINCT verse_id) as cnt FROM verse_fts');
    const chaptersResult = await db.query('SELECT COUNT(*) as cnt FROM indexed_chapters');
    const lastResult = await db.query('SELECT MAX(indexed_at) as last_at FROM indexed_chapters');

    const totalVerses = versesResult.values?.[0]?.cnt || 0;
    const totalChapters = chaptersResult.values?.[0]?.cnt || 0;
    const lastAt = lastResult.values?.[0]?.last_at || null;

    // Приблизна оцінка: ~2KB на вірш в індексі
    const estimatedBytes = Number(totalVerses) * 2048;
    const estimatedKB = (estimatedBytes / 1024).toFixed(0);

    return {
      totalIndexedVerses: Number(totalVerses),
      totalIndexedChapters: Number(totalChapters),
      indexSizeEstimate: `~${estimatedKB} KB`,
      lastIndexedAt: lastAt ? Number(lastAt) : null,
    };
  } catch (error) {
    console.error('[OfflineSearch] Stats error:', error);
    return { totalIndexedVerses: 0, totalIndexedChapters: 0, indexSizeEstimate: '0 KB', lastIndexedAt: null };
  }
}

// ============================================================================
// WEB FALLBACK (IndexedDB text search)
// ============================================================================

/**
 * Пошук по закешованих даних у IndexedDB (веб-fallback)
 * Простий текстовий пошук без FTS5
 */
async function searchWeb(
  query: string,
  options: {
    language?: 'uk' | 'en';
    bookIds?: string[];
    limit?: number;
  } = {}
): Promise<OfflineSearchResult[]> {
  const { language = 'uk', bookIds, limit = 50 } = options;

  try {
    // Динамічний імпорт для веб-версії
    const { getAllCachedChapters } = await import('./offlineCache');
    const chapters = await getAllCachedChapters();

    if (chapters.length === 0) return [];

    const queryLower = query.toLowerCase().trim();
    const queryTokens = queryLower.split(/\s+/).filter(Boolean);
    if (queryTokens.length === 0) return [];

    const results: OfflineSearchResult[] = [];

    for (const chapter of chapters) {
      // Фільтр по книгах
      if (bookIds && bookIds.length > 0 && !bookIds.includes(chapter.bookId)) continue;

      let verses: Record<string, string | undefined>[];
      try {
        verses = JSON.parse(chapter.versesJson || '[]');
      } catch {
        continue;
      }

      for (const verse of verses) {
        const searchFields: Array<{ field: string; text: string }> = [];

        if (language === 'uk') {
          if (verse.translation_uk) searchFields.push({ field: 'translation_uk', text: verse.translation_uk });
          if (verse.commentary_uk) searchFields.push({ field: 'commentary_uk', text: verse.commentary_uk });
          if (verse.synonyms_uk) searchFields.push({ field: 'synonyms_uk', text: verse.synonyms_uk });
        } else {
          if (verse.translation_en) searchFields.push({ field: 'translation_en', text: verse.translation_en });
          if (verse.commentary_en) searchFields.push({ field: 'commentary_en', text: verse.commentary_en });
          if (verse.synonyms_en) searchFields.push({ field: 'synonyms_en', text: verse.synonyms_en });
        }

        // Мовно-незалежні поля
        if (verse.sanskrit_uk || verse.sanskrit_en) {
          searchFields.push({ field: 'sanskrit', text: verse.sanskrit_uk || verse.sanskrit_en || '' });
        }
        if (verse.transliteration_uk || verse.transliteration_en) {
          searchFields.push({ field: 'transliteration', text: verse.transliteration_uk || verse.transliteration_en || '' });
        }

        for (const { field, text } of searchFields) {
          const plainText = stripHtml(text).toLowerCase();
          const matches = queryTokens.every(token => plainText.includes(token));

          if (matches) {
            // Створюємо snippet
            const firstTokenIdx = plainText.indexOf(queryTokens[0]);
            const start = Math.max(0, firstTokenIdx - 40);
            const end = Math.min(plainText.length, firstTokenIdx + queryTokens[0].length + 80);
            let snippetText = plainText.substring(start, end);
            if (start > 0) snippetText = '...' + snippetText;
            if (end < plainText.length) snippetText = snippetText + '...';

            // Підсвічуємо збіги
            for (const token of queryTokens) {
              const regex = new RegExp(`(${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
              snippetText = snippetText.replace(regex, '<mark>$1</mark>');
            }

            results.push({
              verseId: verse.id,
              chapterId: chapter.id,
              bookId: chapter.bookId,
              bookSlug: chapter.bookSlug,
              verseNumber: verse.verse_number,
              chapterNumber: chapter.chapterNumber,
              cantoNumber: undefined,
              snippet: snippetText,
              matchedField: field,
              rank: results.length, // простий порядок
            });
            break; // один збіг на вірш
          }
        }

        if (results.length >= limit) break;
      }

      if (results.length >= limit) break;
    }

    return results.slice(0, limit);
  } catch (error) {
    console.error('[OfflineSearch] Web search error:', error);
    return [];
  }
}

// ============================================================================
// PUBLIC API
// ============================================================================

const isNative = () => Capacitor.isNativePlatform();

/**
 * Індексувати вірші глави для офлайн-пошуку
 */
export async function indexChapterVerses(
  verses: IndexableVerse[],
  chapterId: string,
  bookId: string
): Promise<boolean> {
  if (isNative()) {
    return indexVersesNative(verses, chapterId, bookId);
  }
  // Веб: не потрібно окремо індексувати, пошук іде напряму по кешу
  return true;
}

/**
 * Пошук у офлайн-індексі
 */
export async function offlineSearch(
  query: string,
  options: {
    language?: 'uk' | 'en';
    bookIds?: string[];
    limit?: number;
  } = {}
): Promise<OfflineSearchResult[]> {
  if (isNative()) {
    return searchNative(query, options);
  }
  return searchWeb(query, options);
}

/**
 * Видалити індекс глави
 */
export async function removeChapterIndex(chapterId: string): Promise<void> {
  if (isNative()) {
    return removeChapterIndexNative(chapterId);
  }
  // Веб: нічого не треба — пошук іде по кешу
}

/**
 * Очистити весь пошуковий індекс
 */
export async function clearSearchIndex(): Promise<void> {
  if (isNative()) {
    return clearIndexNative();
  }
}

/**
 * Перевірити чи глава проіндексована
 */
export async function isChapterIndexed(chapterId: string): Promise<boolean> {
  if (!isNative()) return false;

  const db = await initSearchDb();
  if (!db) return false;

  try {
    const result = await db.query(
      'SELECT chapter_id FROM indexed_chapters WHERE chapter_id = ?',
      [chapterId]
    );
    return (result.values?.length || 0) > 0;
  } catch {
    return false;
  }
}

/**
 * Отримати статистику пошукового індексу
 */
export async function getSearchIndexStats(): Promise<OfflineSearchStats> {
  if (isNative()) {
    return getStatsNative();
  }

  // Веб-fallback: підрахувати з кешу
  try {
    const { getAllCachedChapters } = await import('./offlineCache');
    const chapters = await getAllCachedChapters();
    let totalVerses = 0;
    for (const ch of chapters) {
      try {
        const verses = JSON.parse(ch.versesJson || '[]');
        totalVerses += verses.length;
      } catch {
        // skip
      }
    }
    return {
      totalIndexedVerses: totalVerses,
      totalIndexedChapters: chapters.length,
      indexSizeEstimate: `~${((totalVerses * 2048) / 1024).toFixed(0)} KB`,
      lastIndexedAt: chapters.length > 0 ? Math.max(...chapters.map(c => c.cachedAt)) : null,
    };
  } catch {
    return { totalIndexedVerses: 0, totalIndexedChapters: 0, indexSizeEstimate: '0 KB', lastIndexedAt: null };
  }
}

/**
 * Перевірити чи офлайн-пошук доступний (є проіндексовані дані)
 */
export async function isOfflineSearchAvailable(): Promise<boolean> {
  const stats = await getSearchIndexStats();
  return stats.totalIndexedVerses > 0;
}
