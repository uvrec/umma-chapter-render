/**
 * Утиліти для поширення та копіювання віршів
 * Реалізує функції "Copy with link" та "Share verse"
 */

// Типи для параметрів вірша
export interface VerseParams {
  bookSlug: string;
  bookTitle?: string;
  cantoNumber?: number;
  chapterNumber: number;
  verseNumber: string;
  verseText?: string; // Переклад або основний текст
  sanskritText?: string;
}

import { getBookPrefix } from "@/utils/bookPrefixes";

/**
 * Генерує посилання на вірш (формат: "БҐ 2.47" або "ШБ 1.1.1")
 */
export function getVerseReference(
  params: VerseParams,
  lang: "uk" | "en" = "uk"
): string {
  const { bookSlug, cantoNumber, chapterNumber, verseNumber } = params;
  const abbrev = getBookPrefix(bookSlug, lang);

  if (cantoNumber) {
    return `${abbrev} ${cantoNumber}.${chapterNumber}.${verseNumber}`;
  }
  return `${abbrev} ${chapterNumber}.${verseNumber}`;
}

/**
 * Генерує повний URL для вірша
 * Формат: /uk/lib/sb/1/3/19 (для книг з канто) або /uk/lib/bg/3/19 (для інших)
 */
export function getVerseUrl(params: VerseParams, baseUrl?: string, lang: "uk" | "en" = "uk"): string {
  const { bookSlug, cantoNumber, chapterNumber, verseNumber } = params;
  const base = baseUrl || "https://vedavoice.org";
  const langPrefix = `/${lang}`;

  if (cantoNumber) {
    return `${base}${langPrefix}/lib/${bookSlug}/${cantoNumber}/${chapterNumber}/${verseNumber}`;
  }
  return `${base}${langPrefix}/lib/${bookSlug}/${chapterNumber}/${verseNumber}`;
}

/**
 * Форматує текст вірша для копіювання/поширення
 */
export function formatVerseForShare(
  params: VerseParams,
  options: {
    includeSanskrit?: boolean;
    includeUrl?: boolean;
    lang?: "uk" | "en";
  } = {}
): string {
  const { includeSanskrit = false, includeUrl = true, lang = "uk" } = options;
  const { verseText, sanskritText } = params;

  const reference = getVerseReference(params, lang);
  const url = getVerseUrl(params, undefined, lang);

  const parts: string[] = [];

  // Додаємо санскрит якщо потрібно
  if (includeSanskrit && sanskritText) {
    parts.push(sanskritText.trim());
    parts.push("");
  }

  // Основний текст (переклад)
  if (verseText) {
    parts.push(verseText.trim());
    parts.push("");
  }

  // Посилання на вірш
  parts.push(`— ${reference}`);

  // URL
  if (includeUrl) {
    parts.push(url);
  }

  return parts.join("\n");
}

/**
 * Копіює вірш з посиланням у буфер обміну
 */
export async function copyVerseWithLink(
  params: VerseParams,
  options: {
    includeSanskrit?: boolean;
    lang?: "uk" | "en";
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<boolean> {
  const { onSuccess, onError, ...formatOptions } = options;

  try {
    const text = formatVerseForShare(params, { ...formatOptions, includeUrl: true });
    await navigator.clipboard.writeText(text);
    onSuccess?.();
    return true;
  } catch (error) {
    onError?.(error as Error);
    console.error("Failed to copy verse:", error);
    return false;
  }
}

/**
 * Копіює тільки URL вірша
 */
export async function copyVerseUrl(
  params: VerseParams,
  options: {
    lang?: "uk" | "en";
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<boolean> {
  const { onSuccess, onError, lang = "uk" } = options;

  try {
    const url = getVerseUrl(params, undefined, lang);
    await navigator.clipboard.writeText(url);
    onSuccess?.();
    return true;
  } catch (error) {
    onError?.(error as Error);
    console.error("Failed to copy URL:", error);
    return false;
  }
}

/**
 * Поширює вірш через Web Share API або копіює в буфер
 * Fallback до копіювання якщо Web Share API недоступний
 */
export async function shareVerse(
  params: VerseParams,
  options: {
    includeSanskrit?: boolean;
    lang?: "uk" | "en";
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onFallbackCopy?: () => void;
  } = {}
): Promise<boolean> {
  const { onSuccess, onError, onFallbackCopy, ...formatOptions } = options;

  const reference = getVerseReference(params, formatOptions.lang);
  const url = getVerseUrl(params, undefined, formatOptions.lang);
  const text = formatVerseForShare(params, { ...formatOptions, includeUrl: false });

  // Спробуємо Web Share API
  if (navigator.share) {
    try {
      await navigator.share({
        title: reference,
        text: text,
        url: url,
      });
      onSuccess?.();
      return true;
    } catch (error) {
      // Користувач відмінив поширення - це не помилка
      if ((error as Error).name === "AbortError") {
        return false;
      }
      // Інша помилка - спробуємо fallback
      console.warn("Web Share API failed, falling back to clipboard:", error);
    }
  }

  // Fallback: копіюємо в буфер
  try {
    const fullText = formatVerseForShare(params, { ...formatOptions, includeUrl: true });
    await navigator.clipboard.writeText(fullText);
    onFallbackCopy?.();
    return true;
  } catch (error) {
    onError?.(error as Error);
    console.error("Failed to share/copy verse:", error);
    return false;
  }
}

/**
 * Перевіряє чи Web Share API доступний
 */
export function canShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

/**
 * Перевіряє чи Clipboard API доступний
 */
export function canCopy(): boolean {
  return typeof navigator !== "undefined" && !!navigator.clipboard;
}
