import ePub from 'epubjs';

export async function extractTextFromEPUB(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const book = ePub(arrayBuffer);
    
    await book.ready;
    
    let fullText = '';
    
    // Use any to bypass type issues with epubjs
    const spine: any = book.spine;
    
    if (spine && spine.spineItems) {
      for (const item of spine.spineItems) {
        try {
          const content = await item.load(book.load.bind(book));
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'text/html');
          fullText += (doc.body?.textContent || '') + '\n\n';
        } catch (err) {
          console.warn('Error loading EPUB section:', err);
        }
      }
    }
    
    return fullText || 'EPUB текст витягнуто (можливо порожній)';
  } catch (error) {
    console.error('Error extracting EPUB:', error);
    throw new Error('Не вдалося обробити EPUB файл');
  }
}

