/**
 * Офлайн-кеш для читання
 * - Capacitor SQLite для нативних застосунків
 * - IndexedDB як fallback для веб
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

// Types
export interface CachedChapter {
  id: string;
  bookId: string;
  bookSlug: string;
  cantoId?: string;
  chapterNumber: number;
  titleUa: string;
  titleEn: string;
  contentUa?: string;
  contentEn?: string;
  versesJson: string; // JSON stringified verses array
  cachedAt: number; // timestamp
  lastReadAt?: number;
}

export interface CachedVerse {
  id: string;
  chapterId: string;
  verseNumber: string;
  sanskrit?: string;
  transliteration?: string;
  synonymsUa?: string;
  synonymsEn?: string;
  translationUa?: string;
  translationEn?: string;
  commentaryUa?: string;
  commentaryEn?: string;
}

// IndexedDB Schema
interface OfflineCacheDB extends DBSchema {
  chapters: {
    key: string;
    value: CachedChapter;
    indexes: {
      'by-book': string;
      'by-cached-at': number;
      'by-last-read': number;
    };
  };
}

// Constants
const DB_NAME = 'vedavoice_offline_cache';
const DB_VERSION = 1;
const MAX_CACHED_CHAPTERS = 50; // Максимум глав у кеші

// Singleton instance
let dbInstance: IDBPDatabase<OfflineCacheDB> | null = null;
let sqliteConnection: SQLiteConnection | null = null;
let sqliteDb: SQLiteDBConnection | null = null;

// Check if running in native app
const isNative = () => Capacitor.isNativePlatform();

// ========================
// IndexedDB Implementation (Web fallback)
// ========================

async function getIndexedDB(): Promise<IDBPDatabase<OfflineCacheDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<OfflineCacheDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const chapterStore = db.createObjectStore('chapters', { keyPath: 'id' });
      chapterStore.createIndex('by-book', 'bookId');
      chapterStore.createIndex('by-cached-at', 'cachedAt');
      chapterStore.createIndex('by-last-read', 'lastReadAt');
    },
  });

  return dbInstance;
}

// ========================
// SQLite Implementation (Native)
// ========================

async function initSQLite(): Promise<SQLiteDBConnection | null> {
  if (sqliteDb) return sqliteDb;

  try {
    sqliteConnection = new SQLiteConnection(CapacitorSQLite);
    
    // Create database
    const ret = await sqliteConnection.checkConnectionsConsistency();
    const isConn = (await sqliteConnection.isConnection(DB_NAME, false)).result;
    
    if (ret.result && isConn) {
      sqliteDb = await sqliteConnection.retrieveConnection(DB_NAME, false);
    } else {
      sqliteDb = await sqliteConnection.createConnection(
        DB_NAME,
        false,
        'no-encryption',
        DB_VERSION,
        false
      );
    }

    await sqliteDb.open();

    // Create tables
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS chapters (
        id TEXT PRIMARY KEY NOT NULL,
        bookId TEXT NOT NULL,
        bookSlug TEXT NOT NULL,
        cantoId TEXT,
        chapterNumber INTEGER NOT NULL,
        titleUa TEXT NOT NULL,
        titleEn TEXT NOT NULL,
        contentUa TEXT,
        contentEn TEXT,
        versesJson TEXT NOT NULL,
        cachedAt INTEGER NOT NULL,
        lastReadAt INTEGER
      );
      CREATE INDEX IF NOT EXISTS idx_chapters_book ON chapters(bookId);
      CREATE INDEX IF NOT EXISTS idx_chapters_cached ON chapters(cachedAt);
      CREATE INDEX IF NOT EXISTS idx_chapters_read ON chapters(lastReadAt);
    `;

    await sqliteDb.execute(createTableQuery);
    
    return sqliteDb;
  } catch (error) {
    console.error('SQLite init error:', error);
    return null;
  }
}

// ========================
// Public API
// ========================

/**
 * Зберегти главу в офлайн-кеш
 */
export async function cacheChapter(chapter: CachedChapter): Promise<void> {
  const chapterWithTimestamp = {
    ...chapter,
    cachedAt: Date.now(),
  };

  if (isNative()) {
    const db = await initSQLite();
    if (!db) {
      // Fallback to IndexedDB
      const idb = await getIndexedDB();
      await idb.put('chapters', chapterWithTimestamp);
      await cleanupOldChapters();
      return;
    }

    const query = `
      INSERT OR REPLACE INTO chapters 
      (id, bookId, bookSlug, cantoId, chapterNumber, titleUa, titleEn, contentUa, contentEn, versesJson, cachedAt, lastReadAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.run(query, [
      chapterWithTimestamp.id,
      chapterWithTimestamp.bookId,
      chapterWithTimestamp.bookSlug,
      chapterWithTimestamp.cantoId || null,
      chapterWithTimestamp.chapterNumber,
      chapterWithTimestamp.titleUa,
      chapterWithTimestamp.titleEn,
      chapterWithTimestamp.contentUa || null,
      chapterWithTimestamp.contentEn || null,
      chapterWithTimestamp.versesJson,
      chapterWithTimestamp.cachedAt,
      chapterWithTimestamp.lastReadAt || null,
    ]);

    await cleanupOldChapters();
  } else {
    const db = await getIndexedDB();
    await db.put('chapters', chapterWithTimestamp);
    await cleanupOldChapters();
  }
}

/**
 * Отримати главу з кешу
 */
export async function getCachedChapter(chapterId: string): Promise<CachedChapter | null> {
  if (isNative()) {
    const db = await initSQLite();
    if (!db) {
      const idb = await getIndexedDB();
      return (await idb.get('chapters', chapterId)) || null;
    }

    const result = await db.query('SELECT * FROM chapters WHERE id = ?', [chapterId]);
    if (result.values && result.values.length > 0) {
      return result.values[0] as CachedChapter;
    }
    return null;
  } else {
    const db = await getIndexedDB();
    return (await db.get('chapters', chapterId)) || null;
  }
}

/**
 * Оновити час останнього читання
 */
export async function updateLastReadTime(chapterId: string): Promise<void> {
  const now = Date.now();

  if (isNative()) {
    const db = await initSQLite();
    if (!db) {
      const idb = await getIndexedDB();
      const chapter = await idb.get('chapters', chapterId);
      if (chapter) {
        chapter.lastReadAt = now;
        await idb.put('chapters', chapter);
      }
      return;
    }

    await db.run('UPDATE chapters SET lastReadAt = ? WHERE id = ?', [now, chapterId]);
  } else {
    const db = await getIndexedDB();
    const chapter = await db.get('chapters', chapterId);
    if (chapter) {
      chapter.lastReadAt = now;
      await db.put('chapters', chapter);
    }
  }
}

/**
 * Отримати всі закешовані глави
 */
export async function getAllCachedChapters(): Promise<CachedChapter[]> {
  if (isNative()) {
    const db = await initSQLite();
    if (!db) {
      const idb = await getIndexedDB();
      return idb.getAll('chapters');
    }

    const result = await db.query('SELECT * FROM chapters ORDER BY lastReadAt DESC, cachedAt DESC');
    return (result.values || []) as CachedChapter[];
  } else {
    const db = await getIndexedDB();
    const chapters = await db.getAll('chapters');
    return chapters.sort((a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0));
  }
}

/**
 * Отримати останні прочитані глави
 */
export async function getRecentlyReadChapters(limit: number = 5): Promise<CachedChapter[]> {
  const all = await getAllCachedChapters();
  return all.filter(c => c.lastReadAt).slice(0, limit);
}

/**
 * Видалити главу з кешу
 */
export async function removeCachedChapter(chapterId: string): Promise<void> {
  if (isNative()) {
    const db = await initSQLite();
    if (!db) {
      const idb = await getIndexedDB();
      await idb.delete('chapters', chapterId);
      return;
    }

    await db.run('DELETE FROM chapters WHERE id = ?', [chapterId]);
  } else {
    const db = await getIndexedDB();
    await db.delete('chapters', chapterId);
  }
}

/**
 * Очистити старі глави якщо перевищено ліміт
 */
async function cleanupOldChapters(): Promise<void> {
  const chapters = await getAllCachedChapters();
  
  if (chapters.length > MAX_CACHED_CHAPTERS) {
    // Сортуємо за часом кешування (старі спочатку)
    const sortedByAge = [...chapters].sort((a, b) => a.cachedAt - b.cachedAt);
    const toRemove = sortedByAge.slice(0, chapters.length - MAX_CACHED_CHAPTERS);
    
    for (const chapter of toRemove) {
      await removeCachedChapter(chapter.id);
    }
  }
}

/**
 * Перевірити чи глава є в кеші
 */
export async function isChapterCached(chapterId: string): Promise<boolean> {
  const chapter = await getCachedChapter(chapterId);
  return chapter !== null;
}

/**
 * Отримати розмір кешу
 */
export async function getCacheSize(): Promise<number> {
  const chapters = await getAllCachedChapters();
  return chapters.length;
}

/**
 * Очистити весь кеш
 */
export async function clearAllCache(): Promise<void> {
  if (isNative()) {
    const db = await initSQLite();
    if (!db) {
      const idb = await getIndexedDB();
      await idb.clear('chapters');
      return;
    }

    await db.run('DELETE FROM chapters');
  } else {
    const db = await getIndexedDB();
    await db.clear('chapters');
  }
}
