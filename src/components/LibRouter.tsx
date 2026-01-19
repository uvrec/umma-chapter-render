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
 *
 * Тепер /lib/ є основним форматом URL (рендерить компоненти напряму).
 */

import { useParams, Navigate } from "react-router-dom";
import { useBooks } from "@/contexts/BooksContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { VedaReaderDB } from "@/components/VedaReaderDB";
import { ChapterVersesList } from "@/pages/ChapterVersesList";
import CantoOverview from "@/pages/CantoOverview";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { IntroChapter } from "@/pages/IntroChapter";

/**
 * Роутер для /lib/:bookId/:p1
 * - Для книг з канто: p1 = canto → CantoOverview
 * - Для інших: p1 = chapter → ChapterVersesList
 */
export function LibOneParamRouter() {
  const { bookId, p1 } = useParams<{ bookId: string; p1: string }>();
  const { hasCantoStructure } = useBooks();
  const { getLocalizedPath } = useLanguage();

  if (!bookId || !p1) {
    return <Navigate to={getLocalizedPath("/library")} replace />;
  }

  if (hasCantoStructure(bookId)) {
    // SB/CC/etc: /lib/sb/1 → CantoOverview
    return <CantoOverview />;
  }

  // BG/ISO/NOI: /lib/bg/3 → ChapterVersesList
  return <ChapterVersesList />;
}

/**
 * Роутер для /lib/:bookId/:p1/:p2
 * - Для intro chapters: p1 = "intro", p2 = slug → IntroChapter
 * - Для книг з канто: p1 = canto, p2 = chapter → ChapterVersesList
 * - Для інших: p1 = chapter, p2 = verse → VedaReaderDB
 */
export function LibTwoParamRouter() {
  const { bookId, p1, p2 } = useParams<{ bookId: string; p1: string; p2: string }>();
  const { hasCantoStructure } = useBooks();
  const { getLocalizedPath } = useLanguage();

  if (!bookId || !p1 || !p2) {
    return <Navigate to={getLocalizedPath("/library")} replace />;
  }

  // Handle intro chapters: /lib/sb/intro/preface → IntroChapter
  if (p1 === "intro") {
    return <IntroChapter />;
  }

  if (hasCantoStructure(bookId)) {
    // SB/CC/etc: /lib/sb/1/3 → ChapterVersesList
    return <ChapterVersesList />;
  }

  // BG/ISO/NOI: /lib/bg/3/19 → VedaReaderDB
  return (
    <RouteErrorBoundary routeName="VedaReader">
      <VedaReaderDB />
    </RouteErrorBoundary>
  );
}

/**
 * Роутер для /lib/:bookId/:p1/:p2/:p3
 * - Для книг з канто: p1 = canto, p2 = chapter, p3 = verse → VedaReaderDB
 * - Для інших: некоректний URL → redirect to book
 */
export function LibThreeParamRouter() {
  const { bookId, p1, p2, p3 } = useParams<{ bookId: string; p1: string; p2: string; p3: string }>();
  const { hasCantoStructure } = useBooks();
  const { getLocalizedPath } = useLanguage();

  if (!bookId || !p1 || !p2 || !p3) {
    return <Navigate to={getLocalizedPath("/library")} replace />;
  }

  if (hasCantoStructure(bookId)) {
    // SB/CC/etc: /lib/sb/1/3/19 → VedaReaderDB
    return (
      <RouteErrorBoundary routeName="VedaReader">
        <VedaReaderDB />
      </RouteErrorBoundary>
    );
  }

  // Для книг без канто 3 параметри некоректні - редирект на книгу
  return <Navigate to={getLocalizedPath(`/lib/${bookId}`)} replace />;
}
