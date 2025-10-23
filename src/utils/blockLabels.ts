// src/utils/blockLabels.ts
/**
 * Централізована система назв блоків для двомовного режиму
 * Використовується у всіх компонентах читалки
 */

export type BlockType = 
  | 'sanskrit_ua' 
  | 'sanskrit_en' 
  | 'transliteration_ua' 
  | 'transliteration_en' 
  | 'synonyms' 
  | 'translation' 
  | 'commentary';

export type Language = 'ua' | 'en';

interface BlockLabel {
  ua: string;
  en: string;
}

/**
 * Назви блоків для відображення
 */
export const BLOCK_LABELS: Record<BlockType, BlockLabel> = {
  sanskrit_ua: {
    ua: 'Санскрит (УКР)',
    en: 'Sanskrit (UA)',
  },
  sanskrit_en: {
    ua: 'Санскрит (АНГЛ)',
    en: 'Sanskrit (EN)',
  },
  transliteration_ua: {
    ua: 'Транслітерація (УКР)',
    en: 'Transliteration (UA)',
  },
  transliteration_en: {
    ua: 'Транслітерація (АНГЛ)',
    en: 'Transliteration (EN)',
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
    sanskrit_ua: BLOCK_LABELS.sanskrit_ua[language],
    sanskrit_en: BLOCK_LABELS.sanskrit_en[language],
    transliteration_ua: BLOCK_LABELS.transliteration_ua[language],
    transliteration_en: BLOCK_LABELS.transliteration_en[language],
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
    sanskrit_ua: getBlockLabel('sanskrit_ua', language),
    sanskrit_en: getBlockLabel('sanskrit_en', language),
    transliteration_ua: getBlockLabel('transliteration_ua', language),
    transliteration_en: getBlockLabel('transliteration_en', language),
    synonyms: getBlockLabel('synonyms', language),
    translation: getBlockLabel('translation', language),
    commentary: getBlockLabel('commentary', language),
  };
}
