/**
 * VedaReaderRedirects - компоненти редіректу зі старих /veda-reader/ URL на нові /lib/
 *
 * Конвертація:
 * /veda-reader/bg/3/19 → /lib/bg/3/19
 * /veda-reader/sb/canto/1/chapter/3/19 → /lib/sb/1/3/19
 */

import { Navigate, useParams } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Редірект /veda-reader/:bookId → /lib/:bookId
 */
export function VedaReaderBookRedirect() {
  const { bookId } = useParams<{ bookId: string }>();
  const { getLocalizedPath } = useLanguage();
  return <Navigate to={getLocalizedPath(`/lib/${bookId}`)} replace />;
}

/**
 * Редірект /veda-reader/:bookId/:chapterNumber → /lib/:bookId/:chapterNumber
 */
export function VedaReaderChapterRedirect() {
  const { bookId, chapterNumber } = useParams<{ bookId: string; chapterNumber: string }>();
  const { getLocalizedPath } = useLanguage();
  return <Navigate to={getLocalizedPath(`/lib/${bookId}/${chapterNumber}`)} replace />;
}

/**
 * Редірект /veda-reader/:bookId/:chapterNumber/:verseNumber → /lib/:bookId/:chapterNumber/:verseNumber
 */
export function VedaReaderVerseRedirect() {
  const { bookId, chapterNumber, verseNumber } = useParams<{
    bookId: string;
    chapterNumber: string;
    verseNumber: string;
  }>();
  const { getLocalizedPath } = useLanguage();
  return <Navigate to={getLocalizedPath(`/lib/${bookId}/${chapterNumber}/${verseNumber}`)} replace />;
}

/**
 * Редірект /veda-reader/:bookId/canto/:cantoNumber → /lib/:bookId/:cantoNumber
 */
export function VedaReaderCantoRedirect() {
  const { bookId, cantoNumber } = useParams<{ bookId: string; cantoNumber: string }>();
  const { getLocalizedPath } = useLanguage();
  return <Navigate to={getLocalizedPath(`/lib/${bookId}/${cantoNumber}`)} replace />;
}

/**
 * Редірект /veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber → /lib/:bookId/:cantoNumber/:chapterNumber
 */
export function VedaReaderCantoChapterRedirect() {
  const { bookId, cantoNumber, chapterNumber } = useParams<{
    bookId: string;
    cantoNumber: string;
    chapterNumber: string;
  }>();
  const { getLocalizedPath } = useLanguage();
  return <Navigate to={getLocalizedPath(`/lib/${bookId}/${cantoNumber}/${chapterNumber}`)} replace />;
}

/**
 * Редірект /veda-reader/:bookId/canto/:cantoNumber/chapter/:chapterNumber/:verseNumber → /lib/:bookId/:cantoNumber/:chapterNumber/:verseNumber
 */
export function VedaReaderCantoVerseRedirect() {
  const { bookId, cantoNumber, chapterNumber, verseNumber, verseId } = useParams<{
    bookId: string;
    cantoNumber: string;
    chapterNumber: string;
    verseNumber?: string;
    verseId?: string;
  }>();
  const { getLocalizedPath } = useLanguage();
  const verse = verseNumber ?? verseId;
  return <Navigate to={getLocalizedPath(`/lib/${bookId}/${cantoNumber}/${chapterNumber}/${verse}`)} replace />;
}
