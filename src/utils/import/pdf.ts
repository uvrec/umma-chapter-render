// src/utils/import/pdf.ts
import * as pdfjsLib from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.mjs?url"; // ✅ для сучасних версій
import { sanitizeHtml } from "./normalizers";
import { extractVerseNumberFromUrl } from '@/utils/vedabaseParsers';
import { parseStructuredVerses, exportForDatabase, type StructuredVerse } from './pdfStructuredParser';

// Прив’язуємо worker
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerUrl;

// Прив’язуємо worker
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerUrl;

type Progress = { page: number; total: number };

type Options = {
  onProgress?: (p: Progress) => void;
  signal?: AbortSignal; // для скасування
  pageLimit?: number; // для дуже великих PDF
};

export async function extractTextFromPDF(file: File, opts: Options = {}): Promise<string> {
  const { onProgress, signal, pageLimit } = opts;

  const buf = await file.arrayBuffer();

  // Якщо дуже великі файли — попередження (не помилка)
  if (file.size > 40 * 1024 * 1024) {
    console.warn("[PDF] Large file:", Math.round(file.size / (1024 * 1024)), "MB");
  }

  const task = pdfjsLib.getDocument({ data: buf });
  const pdf = await task.promise;

  const totalPages = Math.min(pdf.numPages, pageLimit ?? pdf.numPages);
  let resultHTML = "";

  // лічильники для визначення «скан/без тексту»
  let pagesWithText = 0;

  for (let i = 1; i <= totalPages; i++) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const page = await pdf.getPage(i);
    // Отримуємо текстовий контент сторінки
    const textContent = await page.getTextContent();

    const items = (textContent.items as any[]) || [];
    const sb: string[] = [];

    for (const it of items) {
      const s = (it?.str as string) || "";
      if (!s) continue;
      sb.push(s);
      // приблизні переносити рядки за евристикою ширини/it.hasEOL
      if ((it as any).hasEOL) sb.push("\n");
    }

    const text = sb
      .join(" ")
      .replace(/\s+\n\s+/g, "\n")
      .trim();

    if (text.length > 0) pagesWithText++;

    // ✅ ОНОВЛЕНО: Витягуємо номери віршів з тексту (підтримка складених віршів)
    let enrichedText = '';
    const lines = text.split('\n');

    for (const line of lines) {
      // Шукаємо патерни номерів віршів у кожному рядку
      const verseNum = extractVerseNumberFromUrl(line);
      if (verseNum) {
        enrichedText += `\nВІРШ ${verseNum}\n`;
        console.log(`📌 Знайдено номер вірша в PDF: ${verseNum}`);
      }
    }

    // Перетворюємо у прості <p> з урахуванням порожніх рядків
    const asHtml =
      (enrichedText ? "<p>" + enrichedText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</p>" : "") +
      "<p>" +
      text
        .split(/\n{2,}/)
        .map((block) =>
          block
            .split("\n")
            .map((line) => line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))
            .join("<br/>"),
        )
        .join("</p><p>") +
      "</p>";

    // Санітизуємо сторінку окремо — менше шансів зависнути на величезних рядках
    resultHTML += sanitizeHtml(asHtml) + "\n";

    onProgress?.({ page: i, total: totalPages });
  }

  // Якщо PDF, скоріш за все, скан (немає тексту) — скажемо про це вище по стеку
  if (pagesWithText === 0) {
    throw new Error("Схоже, PDF — це скани без текстового шару. Спробуйте інший файл або OCR.");
  }

  // Після повного проходу — ще раз «легкий» санітизатор (на випадок склеювання)
  return sanitizeHtml(resultHTML);
}

/**
 * ✨ НОВА ФУНКЦІЯ: Витягує структуровані вірші з PDF
 * Розпізнає санскрит, транслітерацію, синоніми, переклади та пояснення
 */
export async function extractStructuredVersesFromPDF(
  file: File,
  opts: Options = {}
): Promise<ReturnType<typeof exportForDatabase>> {
  const { onProgress, signal, pageLimit } = opts;

  const buf = await file.arrayBuffer();

  if (file.size > 40 * 1024 * 1024) {
    console.warn("[PDF] Large file:", Math.round(file.size / (1024 * 1024)), "MB");
  }

  const task = pdfjsLib.getDocument({ data: buf });
  const pdf = await task.promise;

  const totalPages = Math.min(pdf.numPages, pageLimit ?? pdf.numPages);
  const allLines: string[] = [];

  console.log(`📄 Читання PDF: ${totalPages} сторінок`);

  for (let i = 1; i <= totalPages; i++) {
    if (signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }

    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    const items = (textContent.items as any[]) || [];

    // Зберігаємо кожен текстовий елемент окремо для кращого розпізнавання
    for (const item of items) {
      const str = (item?.str as string) || "";
      if (str.trim()) {
        allLines.push(str);
      }
    }

    onProgress?.({ page: i, total: totalPages });
  }

  if (allLines.length === 0) {
    throw new Error("Схоже, PDF — це скани без текстового шару. Спробуйте інший файл або OCR.");
  }

  console.log(`📝 Витягнуто ${allLines.length} рядків тексту`);

  // Парсимо структуровані вірші
  const verses = parseStructuredVerses(allLines);

  // Експортуємо в форматі для БД
  return exportForDatabase(verses);
}
