import ePub from 'epubjs';
import { normalizeText } from './normalizers';

export async function extractTextFromEPUB(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const book = ePub(arrayBuffer);
    
    await book.ready;
    
    const sectionPromises: Promise<string>[] = [];
    let sectionsCount = 0;
    
    // Use book.spine.each to iterate through all sections
    book.spine.each((section: any) => {
      sectionsCount++;
      const sectionPromise = (async () => {
        try {
          // Load the section using book.load(section.href)
          const doc = await book.load(section.href);
          
          // Check if doc is a Document object
          if (doc instanceof Document && doc.body?.textContent) {
            const cleanText = normalizeText(doc.body.textContent);
            console.log(`📄 Section ${sectionsCount}: ${cleanText.substring(0, 100)}...`);
            return cleanText;
          }
          
          // Fallback: if it's a string, parse it
          if (typeof doc === 'string') {
            const parser = new DOMParser();
            const parsedDoc = parser.parseFromString(doc, 'text/html');
            const cleanText = normalizeText(parsedDoc.body?.textContent || '');
            console.log(`📄 Section ${sectionsCount} (parsed): ${cleanText.substring(0, 100)}...`);
            return cleanText;
          }
          
          return '';
        } catch (err) {
          console.warn(`Error loading section ${section.href}:`, err);
          return '';
        }
      })();
      
      sectionPromises.push(sectionPromise);
    });
    
    console.log(`Processing ${sectionsCount} EPUB sections`);
    
    // Wait for all sections to be processed
    const sections = await Promise.all(sectionPromises);
    const fullText = sections
      .filter(text => text.trim().length > 0)
      .join('\n\n');
    
    console.log(`EPUB extraction complete: ${sections.length} sections, ${fullText.length} characters`);
    
    if (fullText.trim().length === 0) {
      throw new Error('EPUB файл порожній або має непідтримуваний формат');
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting EPUB:', error);
    throw new Error('Не вдалося обробити EPUB файл: ' + (error as Error).message);
  }
}

