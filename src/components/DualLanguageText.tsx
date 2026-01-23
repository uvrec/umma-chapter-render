import React from "react";
import { sanitizeForRender } from "@/utils/import/normalizers";
import { applyDropCap } from "@/utils/text/dropCap";

interface Paragraph {
  index: number;
  text: string;
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

  let paragraphs: string[] = [];

  // Перевіряємо чи є HTML теги <p>
  if (text.includes("<p>") || text.includes("<p ")) {
    // Розбиваємо по </p> і очищуємо
    paragraphs = text
      .split(/<\/p>/i)
      .map((p) => p.replace(/<p[^>]*>/gi, "").trim())
      .filter((p) => p.length > 0);
  } else {
    // Fallback: розбиваємо по подвійних переносах
    paragraphs = text
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }

  return paragraphs.map((text, index) => ({
    index,
    text: text.replace(/\n/g, " ").trim(),
  }));
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
        const uaContent = ukParas[idx]?.text || "&nbsp;";
        const enContent = enParas[idx]?.text || "&nbsp;";
        const isFirstParagraph = idx === 0;

        // Inline style для динамічного розміру шрифту
        const textStyle = fontSize ? { fontSize: `${fontSize}px`, lineHeight } : undefined;

        return (
          <div key={idx} className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8 items-start">
            <div
              className={`text-justify ${isFirstParagraph && enableDropCap ? 'purport first' : ''} ${bold ? 'font-bold' : ''}`}
              style={textStyle}
              dangerouslySetInnerHTML={{
                __html: sanitizeForRender(
                  isFirstParagraph && enableDropCap && uaContent !== "&nbsp;"
                    ? applyDropCap(uaContent)
                    : uaContent
                ),
              }}
            />
            <div
              className={`text-justify ${isFirstParagraph && enableDropCap ? 'purport first' : ''} ${bold ? 'font-bold' : ''}`}
              style={textStyle}
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
