import * as pdfjsLib from 'pdfjs-dist';
import { sanitizeHtml } from './normalizers';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    let htmlChunks: string[] = [];
    (textContent.items as any[]).forEach((it: any) => {
      let t = it.str || '';
      if (!t) return;
      const font = (it.fontName || '') as string;
      let wrapped = t;
      if (/Bold/i.test(font)) wrapped = `<strong>${wrapped}</strong>`;
      if (/(Italic|Oblique)/i.test(font)) wrapped = `<em>${wrapped}</em>`;
      htmlChunks.push(wrapped);
      if (it.hasEOL) htmlChunks.push('<br/>');
    });
    let pageHtml = htmlChunks.join(' ');
    if (pageHtml.trim().length > 0) {
      // Convert multiple line breaks to paragraph separators
      pageHtml = `<p>${pageHtml.replace(/(?:\s*<br\s*\/>\s*){2,}/g, '</p><p>')}</p>`;
      const safeHTML = sanitizeHtml(pageHtml);
      fullText += safeHTML + '\n\n';
    }
  }
  
  return fullText;
}
