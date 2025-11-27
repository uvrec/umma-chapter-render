import React from "react";

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
}) => {
  // Fallback: якщо paragraphs відсутні, парсимо text на льоту
  const getParagraphs = (paragraphs: Paragraph[] | null, text?: string): Paragraph[] => {
    if (paragraphs && paragraphs.length > 0) {
      return paragraphs;
    }
    if (text) {
      return text
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .map((text, index) => ({ index, text }));
    }
    return [];
  };

  const uaParas = getParagraphs(uaParagraphs, uaText);
  const enParas = getParagraphs(enParagraphs, enText);

  // Вирівняти кількість параграфів (додати порожні якщо потрібно)
  const maxLength = Math.max(uaParas.length, enParas.length);

  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: maxLength }).map((_, idx) => (
        <div key={idx} className="grid grid-cols-2 gap-8 items-start">
          <p
            className="text-justify"
            dangerouslySetInnerHTML={{
              __html: uaParas[idx]?.text || "&nbsp;",
            }}
          />
          <p
            className="text-justify"
            dangerouslySetInnerHTML={{
              __html: enParas[idx]?.text || "&nbsp;",
            }}
          />
        </div>
      ))}
    </div>
  );
};
