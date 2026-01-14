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

// Скорочення для книг
const BOOK_ABBREVIATIONS: Record<string, { uk: string; en: string }> = {
  bg: { uk: "БГ", en: "BG" },
  sb: { uk: "ШБ", en: "SB" },
  cc: { uk: "ЧЧ", en: "CC" },
  iso: { uk: "Ішо", en: "ISO" },
  noi: { uk: "НВ", en: "NOI" },
  nod: { uk: "НВ", en: "NOD" },
  tlk: { uk: "ВНК", en: "TLK" },
  kb: { uk: "КБ", en: "KB" },
  easy: { uk: "БГЛЧ", en: "BGEW" },
};

/**
 * Генерує посилання на вірш (формат: "БГ 2.47" або "ШБ 1.1.1")
 */
export function getVerseReference(
  params: VerseParams,
  lang: "uk" | "en" = "uk"
): string {
  const { bookSlug, cantoNumber, chapterNumber, verseNumber } = params;
  const abbrev = BOOK_ABBREVIATIONS[bookSlug.toLowerCase()]?.[lang] || bookSlug.toUpperCase();

  if (cantoNumber) {
    return `${abbrev} ${cantoNumber}.${chapterNumber}.${verseNumber}`;
  }
  return `${abbrev} ${chapterNumber}.${verseNumber}`;
}

/**
 * Генерує повний URL для вірша
 */
export function getVerseUrl(params: VerseParams, baseUrl?: string): string {
  const { bookSlug, cantoNumber, chapterNumber, verseNumber } = params;
  const base = baseUrl || window.location.origin;

  if (cantoNumber) {
    return `${base}/veda-reader/${bookSlug}/canto/${cantoNumber}/chapter/${chapterNumber}/${verseNumber}`;
  }
  return `${base}/veda-reader/${bookSlug}/${chapterNumber}/${verseNumber}`;
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
  const url = getVerseUrl(params);

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
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  } = {}
): Promise<boolean> {
  const { onSuccess, onError } = options;

  try {
    const url = getVerseUrl(params);
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
  const url = getVerseUrl(params);
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
