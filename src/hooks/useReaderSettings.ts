// src/hooks/useReaderSettings.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
 *  - диспатчить подію 'vv-reader-prefs-changed'
 *  - може автоматично застосовувати line-height на контейнер з data-reader-root="true"
 */
export function useReaderSettings() {
  const [fontSize, setFontSize] = useState<number>(() => readNum(LS.fontSize, 18));
  const [lineHeight, setLineHeight] = useState<number>(() => readNum(LS.lineHeight, 1.6));
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

  // запис у LS + подія
  useEffect(() => {
    localStorage.setItem(LS.fontSize, String(fontSize));
    dispatchPrefs();
  }, [fontSize, dispatchPrefs]);

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
      if (e.key === LS.fontSize) setFontSize(readNum(LS.fontSize, 18));
      if (e.key === LS.lineHeight) setLineHeight(readNum(LS.lineHeight, 1.6));
      if (e.key === LS.dual) setDualLanguageMode(readBool(LS.dual, false));
      if (e.key === LS.blocks) setTextDisplaySettings(readJSON(LS.blocks, DEFAULT_BLOCKS));
      if (e.key === LS.cont) setContinuousReadingSettings(readJSON(LS.cont, DEFAULT_CONT));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // API для зручності
  const increaseFont = useCallback(() => setFontSize((n) => Math.min(24, n + 1)), []);
  const decreaseFont = useCallback(() => setFontSize((n) => Math.max(12, n - 1)), []);
  const increaseLH = useCallback(() => setLineHeight((l) => Math.min(2.0, Math.round((l + 0.05) * 100) / 100)), []);
  const decreaseLH = useCallback(() => setLineHeight((l) => Math.max(1.3, Math.round((l - 0.05) * 100) / 100)), []);
  const resetTypography = useCallback(() => {
    setFontSize(18);
    setLineHeight(1.6);
  }, []);

  return useMemo(
    () => ({
      fontSize,
      setFontSize,
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
    }),
    [
      fontSize,
      lineHeight,
      increaseFont,
      decreaseFont,
      increaseLH,
      decreaseLH,
      resetTypography,
      dualLanguageMode,
      textDisplaySettings,
      continuousReadingSettings,
    ],
  );
}
