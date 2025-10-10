// src/utils/import/pdf.ts
import * as pdfjsLib from "pdfjs-dist";
import { sanitizeHtml } from "./normalizers";
import { addSanskritLineBreaks } from "../text/lineBreaks";

// якщо залишив worker через CDN – просто прибери цей рядок
// а якщо з asset-URL не спрацювало, лишай CDN:
(pdfjsLib as any).GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type Progress = (info: { page: number; total: number }) => void;

export async function extractTextFromPDF(file: File, opts?: { onProgress?: Progress }): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  } catch (e) {
    throw new Error("PDF не відкрився. Спробуй інший файл або збережи як «PDF/A».");
  }

  const total = pdf.numPages;
  let htmlAll = "";

  for (let i = 1; i <= total; i++) {
    opts?.onProgress?.({ page: i, total });

    try {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      const chunks: string[] = [];
      for (const item of textContent.items as any[]) {
        // тільки власне текст
        if (!item?.str) continue;
        chunks.push(item.str);
        if (item.hasEOL) chunks.push("\n");
      }

      // склеюємо та прибираємо зайві прогалини
      let pageText = chunks
        .join(" ")
        .replace(/[ \t]+\n/g, "\n")
        .trim();

      // мінімальна евристика для санскриту
      if (/[\u0900-\u097F]/.test(pageText)) {
        pageText = addSanskritLineBreaks(pageText);
      }

      // обгортаємо в <p> по абзацах
      const safe = sanitizeHtml(
        pageText
          .split(/\n{2,}/)
          .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
          .join("\n"),
      );

      if (safe.trim()) {
        htmlAll += safe + "\n\n";
      }
    } catch (pageErr) {
      // не валимо весь імпорт через одну сторінку
      console.warn(`[PDF] Пропущено сторінку ${i}:`, pageErr);
    }

    // дати шанс UI “дихати”
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
  }

  if (!htmlAll.trim()) {
    throw new Error("Не вдалось витягнути текст зі сторінок (ймовірно, це скани/зображення).");
  }

  return htmlAll.trim();
}
