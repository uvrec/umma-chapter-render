/**
 * Чисте та безпечне перетворення DOCX → HTML
 * Використовується для імпорту текстів з Word до редактора.
 */

import { sanitizeHtml } from "./normalizers";
import { extractVerseNumberFromUrl } from '@/utils/vedabaseParsers';

/**
 * Витягує текст із DOCX-файлу й повертає безпечний HTML.
 */
export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    // Динамічний імпорт для сумісності з Vite/Next.js
    const mammoth = await import("mammoth");

    // Зчитуємо файл як ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Конвертація DOCX → HTML (Mammoth)
    const result = await mammoth.convertToHtml({ arrayBuffer });

    if (!result?.value || result.value.trim().length === 0) {
      throw new Error("Файл не містить розпізнаного тексту");
    }

    // ✅ ОНОВЛЕНО: Витягуємо номери віршів з HTML (підтримка складених віршів)
    const parser = new DOMParser();
    const doc = parser.parseFromString(result.value, 'text/html');

    let enrichedText = '';

    // Шукаємо заголовки та параграфи з номерами віршів
    const elements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, p, strong, b');
    elements.forEach((element) => {
      const elementText = element.textContent || '';
      const verseNum = extractVerseNumberFromUrl(elementText);
      if (verseNum) {
        enrichedText += `<p><strong>ВІРШ ${verseNum}</strong></p>\n`;
        console.log(`📌 Знайдено номер вірша в DOCX: ${verseNum}`);
      }
    });

    // Об'єднуємо збагачений текст з оригінальним HTML
    const finalHTML = enrichedText ? enrichedText + result.value : result.value;

    // Очищення HTML (залишає базові теги)
    const safeHTML = sanitizeHtml(finalHTML);

    return safeHTML.trim();
  } catch (error) {
    console.error("Помилка під час обробки DOCX:", error);
    throw new Error("Не вдалося обробити Word документ. Перевірте формат або спробуйте інший файл.");
  }
}
