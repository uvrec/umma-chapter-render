import React from "react";
import { sanitizeForRender } from "@/utils/import/normalizers";
import { applyDropCap } from "@/utils/text/dropCap";

interface Paragraph {
  index: number;
  text: string;
  align?: string;
}

interface DualLanguageTextProps {
  ukParagraphs: Paragraph[] | null;
  enParagraphs: Paragraph[] | null;
  className?: string;
  /** Fallback якщо paragraphs відсутні */
  ukText?: string;
  enText?: string;
  /** Enable drop-cap styling for the first paragraph */
  enableDropCap?: boolean;
  /** Make text bold (for translation blocks) */
  bold?: boolean;
  /** Font size in pixels (from useReaderSettings) */
  fontSize?: number;
  /** Line height (from useReaderSettings) */
  lineHeight?: number;
}

/**
 * Розбиває HTML текст на параграфи
 * Підтримує: <p>...</p>, подвійні переноси \n\n, або комбінацію
 */
function parseTextToParagraphs(text?: string): Paragraph[] {
  if (!text) return [];

  const result: Paragraph[] = [];

  // Перевіряємо чи є HTML теги <p>
  if (text.includes("<p>") || text.includes("<p ")) {
    // Використовуємо regex щоб зберегти атрибути (text-align і т.д.)
    const pRegex = /<p([^>]*)>([\s\S]*?)<\/p>/gi;
    let match;
    while ((match = pRegex.exec(text)) !== null) {
      const attrs = match[1] || "";
      const content = match[2].trim();
      if (content.length > 0) {
        // Витягуємо text-align зі style атрибуту
        const alignMatch = attrs.match(/style\s*=\s*["'][^"']*text-align:\s*(\w+)/i);
        result.push({
          index: result.length,
          text: content.replace(/\n/g, " ").trim(),
          align: alignMatch ? alignMatch[1] : undefined,
        });
      }
    }

    // Fallback якщо regex не знайшов (некоректний HTML)
    if (result.length === 0) {
      const fallback = text
        .split(/<\/p>/i)
        .map((p) => p.replace(/<p[^>]*>/gi, "").trim())
        .filter((p) => p.length > 0);
      fallback.forEach((t, i) => {
        result.push({ index: i, text: t.replace(/\n/g, " ").trim() });
      });
    }
  } else {
    // Fallback: розбиваємо по подвійних переносах
    const paragraphs = text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    paragraphs.forEach((t, i) => {
      result.push({ index: i, text: t.replace(/\n/g, " ").trim() });
    });
  }

  return result;
}

/**
 * Компонент для синхронізованого відображення тексту двома мовами
 * Кожен параграф української мови вирівнюється з відповідним параграфом англійської
 *
 * Стилі (fontSize, lineHeight) успадковуються від батьківського компонента
 */
export const DualLanguageText: React.FC<DualLanguageTextProps> = ({
  ukParagraphs,
  enParagraphs,
  className = "",
  ukText,
  enText,
  enableDropCap = false,
  bold = false,
  fontSize,
  lineHeight,
}) => {
  // Використовуємо передані параграфи або парсимо текст
  const ukParas = ukParagraphs && ukParagraphs.length > 0 ? ukParagraphs : parseTextToParagraphs(ukText);

  const enParas = enParagraphs && enParagraphs.length > 0 ? enParagraphs : parseTextToParagraphs(enText);

  // Вирівняти кількість параграфів (додати порожні якщо потрібно)
  const maxLength = Math.max(ukParas.length, enParas.length);

  // Якщо немає тексту - нічого не рендеримо
  if (maxLength === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: maxLength }).map((_, idx) => {
        // Apply drop-cap to first paragraph only if enabled and text exists
        const ukPara = ukParas[idx];
        const enPara = enParas[idx];
        const ukContent = ukPara?.text || "&nbsp;";
        const enContent = enPara?.text || "&nbsp;";
        const isFirstParagraph = idx === 0;

        // Inline style для динамічного розміру шрифту
        const ukStyle: React.CSSProperties = fontSize ? { fontSize: `${fontSize}px`, lineHeight } : {};
        const enStyle: React.CSSProperties = fontSize ? { fontSize: `${fontSize}px`, lineHeight } : {};

        // Застосовуємо text-align зі збереженого стилю параграфа
        if (ukPara?.align) ukStyle.textAlign = ukPara.align as any;
        if (enPara?.align) enStyle.textAlign = enPara.align as any;

        // Determine purport class: first paragraph gets "purport first", others get "purport"
        const purportClass = enableDropCap
          ? (isFirstParagraph ? 'purport first' : 'purport')
          : '';

        // Використовуємо text-justify тільки коли немає явного вирівнювання
        const ukAlignClass = ukPara?.align ? '' : 'text-justify';
        const enAlignClass = enPara?.align ? '' : 'text-justify';

        return (
          <div key={idx} className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8 items-start">
            <div
              className={`${ukAlignClass} ${purportClass} ${bold ? 'font-bold' : ''}`}
              style={ukStyle}
              dangerouslySetInnerHTML={{
                __html: sanitizeForRender(
                  isFirstParagraph && enableDropCap && ukContent !== "&nbsp;"
                    ? applyDropCap(ukContent)
                    : ukContent
                ),
              }}
            />
            <div
              className={`${enAlignClass} ${purportClass} ${bold ? 'font-bold' : ''}`}
              style={enStyle}
              dangerouslySetInnerHTML={{
                __html: sanitizeForRender(
                  isFirstParagraph && enableDropCap && enContent !== "&nbsp;"
                    ? applyDropCap(enContent)
                    : enContent
                ),
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
