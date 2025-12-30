import React from "react";
import { applyDropCap } from "@/utils/text/dropCap";

interface Paragraph {
  index: number;
  text: string;
}

interface DualLanguageTextProps {
  uaParagraphs: Paragraph[] | null;
  enParagraphs: Paragraph[] | null;
  className?: string;
  /** Fallback якщо paragraphs відсутні */
  uaText?: string;
  enText?: string;
  /** Enable drop-cap styling for the first paragraph */
  enableDropCap?: boolean;
  /** Make text bold (for translation blocks) */
  bold?: boolean;
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
  uaParagraphs,
  enParagraphs,
  className = "",
  uaText,
  enText,
  enableDropCap = false,
  bold = false,
}) => {
  // Використовуємо передані параграфи або парсимо текст
  const uaParas = uaParagraphs && uaParagraphs.length > 0 ? uaParagraphs : parseTextToParagraphs(uaText);

  const enParas = enParagraphs && enParagraphs.length > 0 ? enParagraphs : parseTextToParagraphs(enText);

  // Вирівняти кількість параграфів (додати порожні якщо потрібно)
  const maxLength = Math.max(uaParas.length, enParas.length);

  // Якщо немає тексту - нічого не рендеримо
  if (maxLength === 0) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: maxLength }).map((_, idx) => {
        // Apply drop-cap to first paragraph only if enabled and text exists
        const uaContent = uaParas[idx]?.text || "&nbsp;";
        const enContent = enParas[idx]?.text || "&nbsp;";
        const isFirstParagraph = idx === 0;

        return (
          <div key={idx} className="grid grid-cols-2 gap-2 sm:gap-4 lg:gap-8 items-start">
            <p
              className={`text-justify text-sm sm:text-base ${isFirstParagraph && enableDropCap ? 'purport first' : ''} ${bold ? 'font-bold' : ''}`}
              dangerouslySetInnerHTML={{
                __html: isFirstParagraph && enableDropCap && uaContent !== "&nbsp;"
                  ? applyDropCap(uaContent)
                  : uaContent,
              }}
            />
            <p
              className={`text-justify text-sm sm:text-base ${isFirstParagraph && enableDropCap ? 'purport first' : ''} ${bold ? 'font-bold' : ''}`}
              dangerouslySetInnerHTML={{
                __html: isFirstParagraph && enableDropCap && enContent !== "&nbsp;"
                  ? applyDropCap(enContent)
                  : enContent,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
