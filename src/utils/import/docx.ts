/**
 * Чисте та безпечне перетворення DOCX → HTML
 * Використовується для імпорту текстів з Word до редактора.
 */

import { sanitizeHtml } from "./normalizers";

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

    // Очищення HTML (залишає базові теги)
    const safeHTML = sanitizeHtml(result.value);

    return safeHTML.trim();
  } catch (error) {
    console.error("Помилка під час обробки DOCX:", error);
    throw new Error("Не вдалося обробити Word документ. Перевірте формат або спробуйте інший файл.");
  }
}
