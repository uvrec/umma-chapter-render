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
  showSynonyms: boolean;
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
  showNumbers: "vv_reader_showNumbers",
  flowMode: "vv_reader_flowMode",
  mobileSafeMode: "vv_reader_mobileSafeMode",
  showVerseContour: "vv_reader_showVerseContour",
  fullscreenMode: "vv_reader_fullscreenMode",
  zenMode: "vv_reader_zenMode",
  presentationMode: "vv_reader_presentationMode",
};

// Перевірка доступності localStorage (Firefox private mode, Enhanced Tracking Protection)
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__ls_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const localStorageAvailable = typeof window !== 'undefined' && isLocalStorageAvailable();

function safeGetItem(key: string): string | null {
  if (!localStorageAvailable) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (!localStorageAvailable) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore - localStorage is not available
  }
}

function readNum(key: string, def: number) {
  const raw = safeGetItem(key);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : def;
}
function readBool(key: string, def: boolean) {
  const raw = safeGetItem(key);
  if (raw === "true") return true;
  if (raw === "false") return false;
  return def;
}
function readJSON<T>(key: string, def: T): T {
  try {
    const raw = safeGetItem(key);
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
  showSynonyms: true,
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
  const [showNumbers, setShowNumbers] = useState<boolean>(() => readBool(LS.showNumbers, true));
  const [flowMode, setFlowMode] = useState<boolean>(() => readBool(LS.flowMode, false));
  const [mobileSafeMode, setMobileSafeMode] = useState<boolean>(() => readBool(LS.mobileSafeMode, false));
  const [showVerseContour, setShowVerseContour] = useState<boolean>(() => readBool(LS.showVerseContour, true));
  const [fullscreenMode, setFullscreenMode] = useState<boolean>(() => readBool(LS.fullscreenMode, false));
  const [zenMode, setZenMode] = useState<boolean>(() => readBool(LS.zenMode, false));
  const [presentationMode, setPresentationMode] = useState<boolean>(() => readBool(LS.presentationMode, false));

  const rootRef = useRef<HTMLElement | null>(null);

  // Refs для відстеження поточних значень без перереєстрації listener
  const stateRefs = useRef({
    fontSizeAdjustment,
    lineHeight,
    dualLanguageMode,
    textDisplaySettings,
    continuousReadingSettings,
    showNumbers,
    flowMode,
    mobileSafeMode,
    showVerseContour,
    fullscreenMode,
    zenMode,
    presentationMode,
  });

  // Оновлюємо refs при кожній зміні
  useEffect(() => {
    stateRefs.current = {
      fontSizeAdjustment,
      lineHeight,
      dualLanguageMode,
      textDisplaySettings,
      continuousReadingSettings,
      showNumbers,
      flowMode,
      mobileSafeMode,
      showVerseContour,
      fullscreenMode,
      zenMode,
      presentationMode,
    };
  }, [fontSizeAdjustment, lineHeight, dualLanguageMode, textDisplaySettings, continuousReadingSettings, showNumbers, flowMode, mobileSafeMode, showVerseContour, fullscreenMode, zenMode, presentationMode]);

  const dispatchPrefs = useCallback(() => {
    window.dispatchEvent(new Event("vv-reader-prefs-changed"));
  }, []);

  // Синхронізувати CSS змінні з React state
  useEffect(() => {
    document.documentElement.style.setProperty('--vv-reader-font-size', `${fontSize}px`);
    safeSetItem(LS.fontSize, String(fontSize));
    safeSetItem(LS.fontSizeAdjustment, String(fontSizeAdjustment));
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
    // Оновити CSS змінну для глобального використання
    document.documentElement.style.setProperty('--vv-reader-line-height', String(lineHeight));
    safeSetItem(LS.lineHeight, String(lineHeight));
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
    safeSetItem(LS.dual, String(dualLanguageMode));
    dispatchPrefs();
  }, [dualLanguageMode, dispatchPrefs]);

  useEffect(() => {
    safeSetItem(LS.blocks, JSON.stringify(textDisplaySettings));
    dispatchPrefs();
  }, [textDisplaySettings, dispatchPrefs]);

  useEffect(() => {
    safeSetItem(LS.cont, JSON.stringify(continuousReadingSettings));
    dispatchPrefs();
  }, [continuousReadingSettings, dispatchPrefs]);

  useEffect(() => {
    safeSetItem(LS.showNumbers, String(showNumbers));
    dispatchPrefs();
  }, [showNumbers, dispatchPrefs]);

  useEffect(() => {
    safeSetItem(LS.flowMode, String(flowMode));
    dispatchPrefs();
  }, [flowMode, dispatchPrefs]);

  useEffect(() => {
    safeSetItem(LS.mobileSafeMode, String(mobileSafeMode));
    // Додаємо/видаляємо data-атрибут для CSS
    document.documentElement.setAttribute('data-mobile-safe-mode', String(mobileSafeMode));
    dispatchPrefs();
  }, [mobileSafeMode, dispatchPrefs]);

  useEffect(() => {
    safeSetItem(LS.showVerseContour, String(showVerseContour));
    dispatchPrefs();
  }, [showVerseContour, dispatchPrefs]);

  useEffect(() => {
    safeSetItem(LS.fullscreenMode, String(fullscreenMode));
    // Додаємо/видаляємо data-атрибут для CSS
    document.documentElement.setAttribute('data-fullscreen-reading', String(fullscreenMode));
    dispatchPrefs();
  }, [fullscreenMode, dispatchPrefs]);

  useEffect(() => {
    safeSetItem(LS.zenMode, String(zenMode));
    // Zen Mode атрибут для CSS - ховає ВСЕ окрім тексту
    document.documentElement.setAttribute('data-zen-mode', String(zenMode));
    // Zen mode автоматично вмикає fullscreen
    if (zenMode && !fullscreenMode) {
      setFullscreenMode(true);
    }
    dispatchPrefs();
  }, [zenMode, fullscreenMode, dispatchPrefs]);

  useEffect(() => {
    safeSetItem(LS.presentationMode, String(presentationMode));
    // Presentation Mode атрибут для CSS - великий шрифт, центрування
    document.documentElement.setAttribute('data-presentation-mode', String(presentationMode));
    // Presentation mode автоматично вмикає fullscreen
    if (presentationMode && !fullscreenMode) {
      setFullscreenMode(true);
    }
    dispatchPrefs();
  }, [presentationMode, fullscreenMode, dispatchPrefs]);

  // синхронізація між вкладками
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key === LS.fontSizeAdjustment) setFontSizeAdjustment(readNum(LS.fontSizeAdjustment, 0));
      if (e.key === LS.lineHeight) setLineHeight(readNum(LS.lineHeight, LINE_HEIGHTS.NORMAL));
      if (e.key === LS.dual) setDualLanguageMode(readBool(LS.dual, false));
      if (e.key === LS.blocks) setTextDisplaySettings(readJSON(LS.blocks, DEFAULT_BLOCKS));
      if (e.key === LS.cont) setContinuousReadingSettings(readJSON(LS.cont, DEFAULT_CONT));
      if (e.key === LS.showNumbers) setShowNumbers(readBool(LS.showNumbers, true));
      if (e.key === LS.flowMode) setFlowMode(readBool(LS.flowMode, false));
      if (e.key === LS.mobileSafeMode) setMobileSafeMode(readBool(LS.mobileSafeMode, false));
      if (e.key === LS.showVerseContour) setShowVerseContour(readBool(LS.showVerseContour, true));
      if (e.key === LS.fullscreenMode) setFullscreenMode(readBool(LS.fullscreenMode, false));
      if (e.key === LS.zenMode) setZenMode(readBool(LS.zenMode, false));
      if (e.key === LS.presentationMode) setPresentationMode(readBool(LS.presentationMode, false));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Слухаємо зміни з GlobalSettingsPanel (без циклу)
  // Використовуємо refs щоб listener не перереєстровувався
  useEffect(() => {
    const handlePrefsChanged = () => {
      // Читаємо з localStorage нові значення
      const newAdjustment = readNum(LS.fontSizeAdjustment, 0);
      const newLineHeight = readNum(LS.lineHeight, LINE_HEIGHTS.NORMAL);
      const newDual = readBool(LS.dual, false);
      const newBlocks = readJSON(LS.blocks, DEFAULT_BLOCKS);
      const newCont = readJSON(LS.cont, DEFAULT_CONT);
      const newShowNumbers = readBool(LS.showNumbers, true);
      const newFlowMode = readBool(LS.flowMode, false);
      const newMobileSafeMode = readBool(LS.mobileSafeMode, false);
      const newShowVerseContour = readBool(LS.showVerseContour, true);
      const newFullscreenMode = readBool(LS.fullscreenMode, false);
      const newZenMode = readBool(LS.zenMode, false);
      const newPresentationMode = readBool(LS.presentationMode, false);

      // Порівнюємо з поточними значеннями через refs (уникаємо циклу)
      const current = stateRefs.current;

      if (newAdjustment !== current.fontSizeAdjustment) setFontSizeAdjustment(newAdjustment);
      if (newLineHeight !== current.lineHeight) setLineHeight(newLineHeight);
      if (newDual !== current.dualLanguageMode) setDualLanguageMode(newDual);
      if (JSON.stringify(newBlocks) !== JSON.stringify(current.textDisplaySettings)) setTextDisplaySettings(newBlocks);
      if (JSON.stringify(newCont) !== JSON.stringify(current.continuousReadingSettings)) setContinuousReadingSettings(newCont);
      if (newShowNumbers !== current.showNumbers) setShowNumbers(newShowNumbers);
      if (newFlowMode !== current.flowMode) setFlowMode(newFlowMode);
      if (newMobileSafeMode !== current.mobileSafeMode) setMobileSafeMode(newMobileSafeMode);
      if (newShowVerseContour !== current.showVerseContour) setShowVerseContour(newShowVerseContour);
      if (newFullscreenMode !== current.fullscreenMode) setFullscreenMode(newFullscreenMode);
      if (newZenMode !== current.zenMode) setZenMode(newZenMode);
      if (newPresentationMode !== current.presentationMode) setPresentationMode(newPresentationMode);
    };

    window.addEventListener("vv-reader-prefs-changed", handlePrefsChanged);
    return () => window.removeEventListener("vv-reader-prefs-changed", handlePrefsChanged);
  }, []); // Порожній масив - listener реєструється один раз

  // API для зручності - оновлено для роботи з adjustment
  const increaseFont = useCallback(() => {
    setFontSizeAdjustment((adj) => {
      const newTotal = baseFontSize + adj + 1;
      return newTotal <= 24 ? adj + 1 : adj; // Максимум 24px
    });
  }, [baseFontSize]);

  const decreaseFont = useCallback(() => {
    setFontSizeAdjustment((adj) => {
      const newTotal = baseFontSize + adj - 1;
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

  return {
    fontSize,
    baseFontSize,
    fontSizeAdjustment,
    setFontSize: setFontSizeAdjustment,
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
    showNumbers,
    setShowNumbers,
    flowMode,
    setFlowMode,
    mobileSafeMode,
    setMobileSafeMode,
    showVerseContour,
    setShowVerseContour,
    fullscreenMode,
    setFullscreenMode,
    zenMode,
    setZenMode,
    presentationMode,
    setPresentationMode,
    multipliers,
  };
}
