import mammoth from "mammoth";
import { sanitizeHtml } from "./normalizers";

export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    
    if (!result.value) {
      throw new Error("Failed to extract content from DOCX file");
    }
    
    // Sanitize the HTML to keep formatting but remove unsafe content
    const safeHTML = sanitizeHtml(result.value);
    
    return safeHTML;
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    throw new Error("Не вдалося обробити Word документ. Перевірте формат файлу.");
  }
}
