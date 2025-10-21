// src/utils/blockLabels.ts
/**
 * Централізована система назв блоків для двомовного режиму
 * Використовується у всіх компонентах читалки
 */

export type BlockType = 'sanskrit' | 'transliteration' | 'synonyms' | 'translation' | 'commentary';

export type Language = 'ua' | 'en';

interface BlockLabel {
  ua: string;
  en: string;
}

/**
 * Назви блоків для відображення
 */
export const BLOCK_LABELS: Record<BlockType, BlockLabel> = {
  sanskrit: {
    ua: 'Санскрит',
    en: 'Sanskrit',
  },
  transliteration: {
    ua: 'Транслітерація',
    en: 'Transliteration',
  },
  synonyms: {
    ua: 'Послівний переклад',
    en: 'Word-for-word',
  },
  translation: {
    ua: 'Літературний переклад',
    en: 'Translation',
  },
  commentary: {
    ua: 'Пояснення',
    en: 'Purport',
  },
};

/**
 * Отримати назву блоку відповідно до мови
 */
export function getBlockLabel(block: BlockType, language: Language): string {
  return BLOCK_LABELS[block][language];
}

/**
 * Отримати всі назви блоків для певної мови
 */
export function getAllBlockLabels(language: Language): Record<BlockType, string> {
  return {
    sanskrit: BLOCK_LABELS.sanskrit[language],
    transliteration: BLOCK_LABELS.transliteration[language],
    synonyms: BLOCK_LABELS.synonyms[language],
    translation: BLOCK_LABELS.translation[language],
    commentary: BLOCK_LABELS.commentary[language],
  };
}

/**
 * Хук для використання в компонентах
 */
export function useBlockLabels(language: Language = 'ua') {
  return {
    sanskrit: getBlockLabel('sanskrit', language),
    transliteration: getBlockLabel('transliteration', language),
    synonyms: getBlockLabel('synonyms', language),
    translation: getBlockLabel('translation', language),
    commentary: getBlockLabel('commentary', language),
  };
}
