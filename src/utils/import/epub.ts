import ePub from 'epubjs';
import { normalizeText } from './normalizers';

export async function extractTextFromEPUB(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const book = ePub(arrayBuffer);
    
    await book.ready;
    
    let fullText = '';
    let sectionsProcessed = 0;
    
    // Use any to bypass type issues with epubjs
    const spine: any = book.spine;
    
    // Try different methods to access content
    if (spine && spine.spineItems && Array.isArray(spine.spineItems)) {
      console.log(`Processing ${spine.spineItems.length} EPUB sections`);
      
      for (const item of spine.spineItems) {
        try {
          const content = await item.load(book.load.bind(book));
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          
          // Use textContent for clean text extraction
          const bodyText = doc.body?.textContent || '';
          const cleanText = normalizeText(bodyText);
          if (cleanText.trim().length > 0) {
            fullText += cleanText + '\n\n';
            sectionsProcessed++;
            console.log(`📄 Section ${sectionsProcessed}: ${cleanText.substring(0, 100)}...`);
          }
        } catch (err) {
          console.warn('Error loading EPUB section:', err);
        }
      }
    } else {
      console.warn('EPUB spine structure not recognized, trying alternative method');
      
      // Fallback: try to get manifest items
      const manifest = (book as any).packaging?.manifest;
      if (manifest) {
      for (const [id, item] of Object.entries(manifest)) {
          try {
            const section = (book as any).section(id);
            if (section) {
              const content = await section.load();
              // Handle both string and DOM content
              const textContent = typeof content === 'string' 
                ? content 
                : (content?.textContent || String(content));
              const cleanText = normalizeText(textContent);
              if (cleanText.trim().length > 0) {
                fullText += cleanText + '\n\n';
                sectionsProcessed++;
                console.log(`📄 Fallback section ${sectionsProcessed}: ${cleanText.substring(0, 100)}...`);
              }
            }
          } catch (err) {
            console.warn(`Error loading section ${id}:`, err);
          }
        }
      }
    }
    
    console.log(`EPUB extraction complete: ${sectionsProcessed} sections, ${fullText.length} characters`);
    
    if (fullText.trim().length === 0) {
      throw new Error('EPUB файл порожній або має непідтримуваний формат');
    }
    
    return fullText;
  } catch (error) {
    console.error('Error extracting EPUB:', error);
    throw new Error('Не вдалося обробити EPUB файл: ' + (error as Error).message);
  }
}

