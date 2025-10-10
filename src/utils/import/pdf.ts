import * as pdfjsLib from "pdfjs-dist";
import { sanitizeHtml } from "./normalizers";
import { addSanskritLineBreaks } from "../text/lineBreaks";

// Налаштовуємо worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Розпізнає текст у PDF і формує чистий HTML з відновленими рядками.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let output = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    // Сортуємо елементи за координатами
    const items = content.items as any[];
    const lines: Record<number, string[]> = {};

    for (const it of items) {
      const str = (it.str || "").trim();
      if (!str) continue;
      const y = Math.round(it.transform[5]); // Y координата
      if (!lines[y]) lines[y] = [];
      lines[y].push(str);
    }

    // Відсортуємо рядки зверху вниз (менше y -> вище на сторінці)
    const sortedY = Object.keys(lines)
      .map((n) => parseFloat(n))
      .sort((a, b) => b - a);

    // Зберемо сторінку як суцільний текст
    const pageLines = sortedY.map((y) => lines[y].join(" "));
    let pageText = pageLines.join("\n").trim();

    if (pageText) {
      // Санскритські PDF часто містять данди — обробимо їх
      pageText = addSanskritLineBreaks(pageText);

      // Обертаємо в параграфи
      const html = pageText
        .split("\n")
        .map((ln) => `<p>${ln}</p>`)
        .join("");

      output += sanitizeHtml(html) + "\n\n";
    }
  }

  return output.trim();
}
