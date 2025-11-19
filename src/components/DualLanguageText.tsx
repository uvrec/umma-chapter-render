import React from 'react';
import { Paragraph, splitIntoParagraphs, alignParagraphs, jsonbToParagraphs } from '@/utils/paragraphs';

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
 */
export const DualLanguageText: React.FC<DualLanguageTextProps> = ({
  uaParagraphs,
  enParagraphs,
  className = '',
  uaText,
  enText,
}) => {
  // Використовуємо утиліти для обробки параграфів
  const getParagraphs = (paragraphs: Paragraph[] | null, text?: string): Paragraph[] => {
    if (paragraphs && paragraphs.length > 0) {
      return paragraphs;
    }
    if (text) {
      return splitIntoParagraphs(text);
    }
    return [];
  };

  const uaParas = getParagraphs(uaParagraphs, uaText);
  const enParas = getParagraphs(enParagraphs, enText);

  // Вирівняти кількість параграфів використовуючи утиліту
  const [alignedUa, alignedEn] = alignParagraphs(uaParas, enParas);
  const maxLength = alignedUa.length;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-x-8 ${className}`}>
      {/* Українська колонка */}
      <div className="space-y-4">
        {alignedUa.map((para, idx) => (
          <p
            key={`ua-${idx}`}
            className="leading-relaxed text-base"
            dangerouslySetInnerHTML={{
              __html: para.text || '&nbsp;'
            }}
          />
        ))}
      </div>

      {/* English column */}
      <div className="space-y-4">
        {alignedEn.map((para, idx) => (
          <p
            key={`en-${idx}`}
            className="leading-relaxed text-base"
            dangerouslySetInnerHTML={{
              __html: para.text || '&nbsp;'
            }}
          />
        ))}
      </div>
    </div>
  );
};
