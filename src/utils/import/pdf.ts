// src/utils/import/pdf.ts
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
import { sanitizeHtml } from "./normalizers"; // 👈 бо файл у тій самій теці
import { addSanskritLineBreaks } from "../text/lineBreaks"; // 👈 піднялися на рівень вище

// Привʼязуємо воркер до pdf.js (бандлиться в один білд)
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;

type TextItem = {
  str: string;
  hasEOL?: boolean;
  fontName?: string;
  transform?: number[];
};

/**
 * Групація текстових елементів у рядки за Y-координатою
 * (коли PDF не виставляє hasEOL)
 */
function groupByLines(items: TextItem[], yTolerance = 2) {
  const lines: TextItem[][] = [];
  const used = new Array(items.length).fill(false);

  for (let i = 0; i < items.length; i++) {
    if (used[i]) continue;
    const row: TextItem[] = [items[i]];
    used[i] = true;

    const y = items[i]?.transform?.[5] ?? 0;

    for (let j = i + 1; j < items.length; j++) {
      if (used[j]) continue;
      const yj = items[j]?.transform?.[5] ?? 0;
      if (Math.abs(y - yj) <= yTolerance) {
        row.push(items[j]);
        used[j] = true;
      }
    }

    // Сортуємо по X (transform[4])
    row.sort((a, b) => {
      const ax = a?.transform?.[4] ?? 0;
      const bx = b?.transform?.[4] ?? 0;
      return ax - bx;
    });

    lines.push(row);
  }

  // Порядок рядків зверху-вниз
  lines.sort((a, b) => {
    const ya = a[0]?.transform?.[5] ?? 0;
    const yb = b[0]?.transform?.[5] ?? 0;
    return yb - ya; // PDF координати зростають донизу
  });

  return lines;
}

/**
 * Безпечне видобування тексту з PDF з мінімальним форматуванням (strong/em + <p>)
 * і спробою проставити рядки для санскриту.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
      // деякі PDF падають на XFA — вимикаємо
      useXfa: false,
    }).promise;

    let fullHtml = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      const items = (textContent.items as TextItem[]) ?? [];

      // 1) якщо є hasEOL — простий шлях
      const hasAnyEol = items.some((it) => it.hasEOL);
      let linesAsHtml: string[] = [];

      if (hasAnyEol) {
        const parts: string[] = [];
        for (const it of items) {
          let t = it.str || "";
          if (!t) continue;

          // Мінімальне форматування по назві шрифта
          if (it.fontName?.match(/Bold/i)) t = `<strong>${t}</strong>`;
          if (it.fontName?.match(/(Italic|Oblique)/i)) t = `<em>${t}</em>`;

          parts.push(t);
          if (it.hasEOL) parts.push("\n");
        }

        const raw = parts
          .join(" ")
          .replace(/\s*\n\s*/g, "\n")
          .trim();
        linesAsHtml = raw
          .split("\n")
          .map((ln) => ln.trim())
          .filter(Boolean)
          .map((ln) => ln);
      } else {
        // 2) інакше групуємо власноруч у рядки по Y
        const lines = groupByLines(items);
        linesAsHtml = lines.map((line) =>
          line
            .map((it) => {
              let t = it.str || "";
              if (!t) return "";
              if (it.fontName?.match(/Bold/i)) t = `<strong>${t}</strong>`;
              if (it.fontName?.match(/(Italic|Oblique)/i)) t = `<em>${t}</em>`;
              return t;
            })
            .filter(Boolean)
            .join(" "),
        );
      }

      // Склеюємо рядки у <p> блоки (порожні та шум — геть)
      const cleanedLines = linesAsHtml.map((l) => l.replace(/\s+/g, " ").trim()).filter((l) => l.length > 0);

      // Робимо грубу спробу: якщо строка має деванагарі — проганяємо через addSanskritLineBreaks
      const devanagari = /[\u0900-\u097F]/;
      const pageHtml = cleanedLines
        .map((line) => {
          if (devanagari.test(line)) {
            try {
              const broken = addSanskritLineBreaks(line);
              // Кожен рядок-строфа у власному <p>
              return broken
                .split("\n")
                .map((ln) => `<p>${ln}</p>`)
                .join("");
            } catch {
              return `<p>${line}</p>`;
            }
          }
          return `<p>${line}</p>`;
        })
        .join("");

      if (pageHtml.trim()) {
        fullHtml += sanitizeHtml(pageHtml) + "\n";
      }
    }

    if (!fullHtml.trim()) {
      throw new Error("Порожній результат розпізнавання PDF");
    }

    return fullHtml;
  } catch (err) {
    console.error("[PDF import] error:", err);
    throw new Error("Не вдалося обробити PDF. Спробуйте інший файл або експортуйте з джерела як DOCX/EPUB/TXT.");
  }
}
