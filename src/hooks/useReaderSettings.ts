// src/hooks/useReaderSettings.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getResponsiveBaseFontSize, FONT_SIZE_MULTIPLIERS, LINE_HEIGHTS } from "@/constants/typography";

export type TextDisplaySettings = {
  showSanskrit: boolean;
  showTransliteration: boolean;
  showSynonyms: boolean;
  showTranslation: boolean;
  showCommentary: boolean;
};

export type ContinuousReadingSettings = {
  enabled: boolean;
  showVerseNumbers: boolean;
  showSanskrit: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
  showCommentary: boolean;
};

const LS = {
  fontSize: "vv_reader_fontSize",
  fontSizeAdjustment: "vv_reader_fontSizeAdjustment", // Нова властивість для збереження корекції користувача
  lineHeight: "vv_reader_lineHeight",
  blocks: "vv_reader_blocks",
  dual: "vv_reader_dualMode",
  cont: "vv_reader_continuous",
};

function readNum(key: string, def: number) {
  const raw = localStorage.getItem(key);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : def;
}
function readBool(key: string, def: boolean) {
  const raw = localStorage.getItem(key);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return def;
}
function readJSON<T>(key: string, def: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : def;
  } catch {
    return def;
  }
}

const DEFAULT_BLOCKS: TextDisplaySettings = {
  showSanskrit: true,
  showTransliteration: true,
  showSynonyms: true,
  showTranslation: true,
  showCommentary: true,
};

const DEFAULT_CONT: ContinuousReadingSettings = {
  enabled: false,
  showVerseNumbers: true,
  showSanskrit: false,
  showTransliteration: false,
  showTranslation: true,
  showCommentary: false,
};

/**
 * Універсальний хук читання:
 *  - зберігає/читає налаштування з localStorage
 *  - автоматично адаптується до розміру екрану
 *  - синхронізує CSS змінні з React state
 *  - диспатчить подію 'vv-reader-prefs-changed'
 *  - може автоматично застосовувати line-height на контейнер з data-reader-root="true"
 */
export function useReaderSettings() {
  // Отримати базовий розмір залежно від екрану
  const [baseFontSize, setBaseFontSize] = useState<number>(() => getResponsiveBaseFontSize());

  // Зберігати корекцію користувача (наприклад, +2 або -1 від базового)
  const [fontSizeAdjustment, setFontSizeAdjustment] = useState<number>(() =>
    readNum(LS.fontSizeAdjustment, 0)
  );

  // Фактичний fontSize = base + adjustment
  const fontSize = baseFontSize + fontSizeAdjustment;

  const [lineHeight, setLineHeight] = useState<number>(() => readNum(LS.lineHeight, LINE_HEIGHTS.NORMAL));
  const [dualLanguageMode, setDualLanguageMode] = useState<boolean>(() => readBool(LS.dual, false));
  const [textDisplaySettings, setTextDisplaySettings] = useState<TextDisplaySettings>(() =>
    readJSON<TextDisplaySettings>(LS.blocks, DEFAULT_BLOCKS),
  );
  const [continuousReadingSettings, setContinuousReadingSettings] = useState<ContinuousReadingSettings>(() =>
    readJSON<ContinuousReadingSettings>(LS.cont, DEFAULT_CONT),
  );

  const rootRef = useRef<HTMLElement | null>(null);

  const dispatchPrefs = useCallback(() => {
    window.dispatchEvent(new Event("vv-reader-prefs-changed"));
  }, []);

  // Синхронізувати CSS змінні з React state
  useEffect(() => {
    document.documentElement.style.setProperty('--vv-reader-font-size', `${fontSize}px`);
    localStorage.setItem(LS.fontSize, String(fontSize));
    localStorage.setItem(LS.fontSizeAdjustment, String(fontSizeAdjustment));
    dispatchPrefs();
  }, [fontSize, fontSizeAdjustment, dispatchPrefs]);

  // Responsive listener - адаптуватися до зміни розміру екрану
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newBase = getResponsiveBaseFontSize();
        if (newBase !== baseFontSize) {
          setBaseFontSize(newBase);
        }
      }, 150); // Debounce 150ms
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [baseFontSize]);

  useEffect(() => {
    localStorage.setItem(LS.lineHeight, String(lineHeight));
    // застосувати до контейнера з data-reader-root="true"
    if (!rootRef.current) {
      rootRef.current = document.querySelector<HTMLElement>('[data-reader-root="true"]');
    }
    if (rootRef.current) {
      rootRef.current.style.lineHeight = String(lineHeight);
    }
    dispatchPrefs();
  }, [lineHeight, dispatchPrefs]);

  useEffect(() => {
    localStorage.setItem(LS.dual, String(dualLanguageMode));
    dispatchPrefs();
  }, [dualLanguageMode, dispatchPrefs]);

  useEffect(() => {
    localStorage.setItem(LS.blocks, JSON.stringify(textDisplaySettings));
    dispatchPrefs();
  }, [textDisplaySettings, dispatchPrefs]);

  useEffect(() => {
    localStorage.setItem(LS.cont, JSON.stringify(continuousReadingSettings));
    dispatchPrefs();
  }, [continuousReadingSettings, dispatchPrefs]);

  // синхронізація між вкладками
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === LS.fontSizeAdjustment) setFontSizeAdjustment(readNum(LS.fontSizeAdjustment, 0));
      if (e.key === LS.lineHeight) setLineHeight(readNum(LS.lineHeight, LINE_HEIGHTS.NORMAL));
      if (e.key === LS.dual) setDualLanguageMode(readBool(LS.dual, false));
      if (e.key === LS.blocks) setTextDisplaySettings(readJSON(LS.blocks, DEFAULT_BLOCKS));
      if (e.key === LS.cont) setContinuousReadingSettings(readJSON(LS.cont, DEFAULT_CONT));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // API для зручності - оновлено для роботи з adjustment
  const increaseFont = useCallback(() => {
    console.log('🔼 increaseFont викликано');
    setFontSizeAdjustment((adj) => {
      const newTotal = baseFontSize + adj + 1;
      console.log(`📏 baseFontSize: ${baseFontSize}, adj: ${adj}, newTotal: ${newTotal}`);
      return newTotal <= 24 ? adj + 1 : adj; // Максимум 24px
    });
  }, [baseFontSize]);

  const decreaseFont = useCallback(() => {
    console.log('🔽 decreaseFont викликано');
    setFontSizeAdjustment((adj) => {
      const newTotal = baseFontSize + adj - 1;
      console.log(`📏 baseFontSize: ${baseFontSize}, adj: ${adj}, newTotal: ${newTotal}`);
      return newTotal >= 12 ? adj - 1 : adj; // Мінімум 12px
    });
  }, [baseFontSize]);

  const increaseLH = useCallback(() => setLineHeight((l) => Math.min(2.0, Math.round((l + 0.05) * 100) / 100)), []);
  const decreaseLH = useCallback(() => setLineHeight((l) => Math.max(1.3, Math.round((l - 0.05) * 100) / 100)), []);

  const resetTypography = useCallback(() => {
    setFontSizeAdjustment(0); // Скинути корекцію до 0
    setLineHeight(LINE_HEIGHTS.NORMAL);
  }, []);

  // Експортувати також множники для використання в компонентах
  const multipliers = useMemo(() => FONT_SIZE_MULTIPLIERS, []);

  return useMemo(
    () => ({
      fontSize,
      baseFontSize,
      fontSizeAdjustment,
      setFontSize: setFontSizeAdjustment, // Тепер змінюємо adjustment, а не fontSize напряму
      lineHeight,
      setLineHeight,
      increaseFont,
      decreaseFont,
      increaseLH,
      decreaseLH,
      resetTypography,
      dualLanguageMode,
      setDualLanguageMode,
      textDisplaySettings,
      setTextDisplaySettings,
      continuousReadingSettings,
      setContinuousReadingSettings,
      multipliers, // Додати множники для зручності
    }),
    [
      fontSize,
      baseFontSize,
      fontSizeAdjustment,
      lineHeight,
      increaseFont,
      decreaseFont,
      increaseLH,
      decreaseLH,
      resetTypography,
      dualLanguageMode,
      textDisplaySettings,
      continuousReadingSettings,
      multipliers,
    ],
  );
}
