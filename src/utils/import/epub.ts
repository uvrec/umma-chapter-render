import ePub from 'epubjs';

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
          
          const bodyText = doc.body?.textContent || '';
          if (bodyText.trim().length > 0) {
            fullText += bodyText + '\n\n';
            sectionsProcessed++;
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
              fullText += content + '\n\n';
              sectionsProcessed++;
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

