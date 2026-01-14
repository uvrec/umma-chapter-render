/**
 * LibRouter - розумний маршрутизатор для спрощених URL
 *
 * Формати URL:
 * - /lib/bg/3/19 → BG глава 3, вірш 19
 * - /lib/sb/1/3/19 → SB канто 1, глава 3, вірш 19
 * - /lib/sb/1/3 → SB канто 1, глава 3 (список віршів)
 * - /lib/sb/1 → SB канто 1 (огляд канто)
 * - /lib/bg/3 → BG глава 3 (список віршів)
 * - /lib/bg → BG (огляд книги)
 *
 * Книги з канто-структурою (has_cantos=true в БД) автоматично підхоплюються.
 */

import { useParams, Navigate } from "react-router-dom";
import { useBooks } from "@/contexts/BooksContext";

/**
 * Роутер для /lib/:bookId/:p1
 * - Для книг з канто: p1 = canto → CantoOverview
 * - Для інших: p1 = chapter → ChapterVersesList
 */
export function LibOneParamRouter() {
  const { bookId, p1 } = useParams<{ bookId: string; p1: string }>();
  const { hasCantoStructure } = useBooks();

  if (!bookId || !p1) {
    return <Navigate to="/library" replace />;
  }

  if (hasCantoStructure(bookId)) {
    // SB/CC/etc: /lib/sb/1 → /veda-reader/sb/canto/1
    return <Navigate to={`/veda-reader/${bookId}/canto/${p1}`} replace />;
  }

  // BG/ISO/NOI: /lib/bg/3 → /veda-reader/bg/3
  return <Navigate to={`/veda-reader/${bookId}/${p1}`} replace />;
}

/**
 * Роутер для /lib/:bookId/:p1/:p2
 * - Для книг з канто: p1 = canto, p2 = chapter → ChapterVersesList
 * - Для інших: p1 = chapter, p2 = verse → VedaReaderDB
 */
export function LibTwoParamRouter() {
  const { bookId, p1, p2 } = useParams<{ bookId: string; p1: string; p2: string }>();
  const { hasCantoStructure } = useBooks();

  if (!bookId || !p1 || !p2) {
    return <Navigate to="/library" replace />;
  }

  if (hasCantoStructure(bookId)) {
    // SB/CC/etc: /lib/sb/1/3 → /veda-reader/sb/canto/1/chapter/3
    return <Navigate to={`/veda-reader/${bookId}/canto/${p1}/chapter/${p2}`} replace />;
  }

  // BG/ISO/NOI: /lib/bg/3/19 → /veda-reader/bg/3/19
  return <Navigate to={`/veda-reader/${bookId}/${p1}/${p2}`} replace />;
}

/**
 * Роутер для /lib/:bookId/:p1/:p2/:p3
 * - Для книг з канто: p1 = canto, p2 = chapter, p3 = verse → VedaReaderDB
 * - Для інших: некоректний URL → redirect to book
 */
export function LibThreeParamRouter() {
  const { bookId, p1, p2, p3 } = useParams<{ bookId: string; p1: string; p2: string; p3: string }>();
  const { hasCantoStructure } = useBooks();

  if (!bookId || !p1 || !p2 || !p3) {
    return <Navigate to="/library" replace />;
  }

  if (hasCantoStructure(bookId)) {
    // SB/CC/etc: /lib/sb/1/3/19 → /veda-reader/sb/canto/1/chapter/3/19
    return <Navigate to={`/veda-reader/${bookId}/canto/${p1}/chapter/${p2}/${p3}`} replace />;
  }

  // Для книг без канто 3 параметри некоректні - редирект на книгу
  return <Navigate to={`/veda-reader/${bookId}`} replace />;
}
