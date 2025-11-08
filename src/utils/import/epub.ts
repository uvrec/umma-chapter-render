import ePub from 'epubjs';
import { normalizeText } from './normalizers';
import { extractVerseNumberFromUrl } from '@/utils/vedabaseParsers';

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
            // ✅ ОНОВЛЕНО: Спробуємо витягти номери віршів з заголовків та анкорів
            let enrichedText = '';

            // Шукаємо заголовки з номерами віршів
            const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="title"], [class*="heading"]');
            headings.forEach((heading) => {
              const headingText = heading.textContent || '';
              const verseNum = extractVerseNumberFromUrl(headingText);
              if (verseNum) {
                enrichedText += `\nВІРШ ${verseNum}\n`;
                console.log(`📌 Знайдено номер вірша в заголовку: ${verseNum}`);
              }
            });

            // Шукаємо анкори з ID віршів (наприклад, <a id="verse-3-5">)
            const anchors = doc.querySelectorAll('a[id*="verse"], [id*="verse"]');
            anchors.forEach((anchor) => {
              const anchorId = anchor.getAttribute('id') || '';
              const verseNum = extractVerseNumberFromUrl(anchorId);
              if (verseNum) {
                enrichedText += `\nВІРШ ${verseNum}\n`;
                console.log(`📌 Знайдено номер вірша в anchor: ${verseNum}`);
              }
            });

            const cleanText = normalizeText(doc.body.textContent);
            const finalText = enrichedText ? enrichedText + '\n' + cleanText : cleanText;
            console.log(`📄 Section ${sectionsCount}: ${finalText.substring(0, 100)}...`);
            return finalText;
          }

          // Fallback: if it's a string, parse it
          if (typeof doc === 'string') {
            const parser = new DOMParser();
            const parsedDoc = parser.parseFromString(doc, 'text/html');

            // ✅ ОНОВЛЕНО: те саме для string варіанту
            let enrichedText = '';
            const headings = parsedDoc.querySelectorAll('h1, h2, h3, h4, h5, h6, [class*="title"], [class*="heading"]');
            headings.forEach((heading) => {
              const headingText = heading.textContent || '';
              const verseNum = extractVerseNumberFromUrl(headingText);
              if (verseNum) {
                enrichedText += `\nВІРШ ${verseNum}\n`;
                console.log(`📌 Знайдено номер вірша в заголовку (parsed): ${verseNum}`);
              }
            });

            const anchors = parsedDoc.querySelectorAll('a[id*="verse"], [id*="verse"]');
            anchors.forEach((anchor) => {
              const anchorId = anchor.getAttribute('id') || '';
              const verseNum = extractVerseNumberFromUrl(anchorId);
              if (verseNum) {
                enrichedText += `\nВІРШ ${verseNum}\n`;
                console.log(`📌 Знайдено номер вірша в anchor (parsed): ${verseNum}`);
              }
            });

            const cleanText = normalizeText(parsedDoc.body?.textContent || '');
            const finalText = enrichedText ? enrichedText + '\n' + cleanText : cleanText;
            console.log(`📄 Section ${sectionsCount} (parsed): ${finalText.substring(0, 100)}...`);
            return finalText;
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

