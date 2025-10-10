// src/utils/import/pdf.ts
import * as pdfjsLib from "pdfjs-dist/webpack";
import { sanitizeHtml } from "./normalizers";
import { addSanskritLineBreaks } from "../text/lineBreaks";

// Надійний воркер для Lovable/Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Акуратно витягує текст з PDF і повертає безпечний HTML:
 * - групує символи у рядки за hasEOL
 * - абзаци — за порожніми рядками
 * - для деванагарі додає перенос рядків по дандах
 * - усе санітизує
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  let pdf;
  try {
    const arrayBuffer = await file.arrayBuffer();
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  } catch (e) {
    console.error("[PDF] Failed to open document:", e);
    throw new Error("Неможливо відкрити PDF (може бути пошкоджений або захищений).");
  }

  const out: string[] = [];

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    try {
      const page = await pdf.getPage(pageNo);
      const content = await page.getTextContent();

      // 1) Склеюємо символи в рядки
      const lines: string[] = [];
      let buf: string[] = [];

      (content.items as any[]).forEach((it: any) => {
        const s = (it?.str ?? "").trim();
        if (!s) return;

        buf.push(s);

        // pdf.js виставляє hasEOL на кінці логічного рядка
        if ((it as any).hasEOL) {
          lines.push(buf.join(" "));
          buf = [];
        }
      });
      if (buf.length) lines.push(buf.join(" "));

      // 2) Нормалізація: прибираємо зайві пробіли/порожні рядки
      const pageText = lines
        .map((l) => l.replace(/[ \t]+/g, " ").trim())
        .filter(Boolean)
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      if (!pageText) continue;

      // 3) Ділимо на абзаци за подвійними переносами
      const blocks = pageText
        .split(/\n{2,}/)
        .map((b) => b.trim())
        .filter(Boolean);

      // 4) Для деванагарі додаємо перенос рядків по дандах; \n -> <br/>
      const htmlBlocks = blocks.map((block) => {
        const hasDevanagari = /[\u0900-\u097F]/.test(block);
        const processed = hasDevanagari ? addSanskritLineBreaks(block) : block;
        return `<p>${processed.replace(/\n/g, "<br/>")}</p>`;
      });

      // 5) Санітизуємо сторінку і додаємо до результату
      const safe = sanitizeHtml(htmlBlocks.join(""));
      if (safe) out.push(safe);
    } catch (e) {
      console.error(`[PDF] Failed on page ${pageNo}:`, e);
      // продовжуємо інші сторінки
    }
  }

  if (!out.length) {
    throw new Error("Не вдалося витягти текст із PDF. Спробуйте інший файл або конвертуйте у DOCX.");
  }

  return out.join("\n");
}
