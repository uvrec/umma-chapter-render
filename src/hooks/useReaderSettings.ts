// src/hooks/useReaderSettings.ts - простий хук для читання глобальних налаштувань читалки
import { useEffect, useState } from "react";

const LS_KEYS = {
  fontSize: "vv_reader_fontSize",
  lineHeight: "vv_reader_lineHeight",
};

export function useReaderSettings() {
  const [fontSize, setFontSize] = useState<number>(() => {
    const s = localStorage.getItem(LS_KEYS.fontSize);
    return s ? Number(s) : 18;
  });

  const [lineHeight, setLineHeight] = useState<number>(() => {
    const s = localStorage.getItem(LS_KEYS.lineHeight);
    return s ? Number(s) : 1.6;
  });

  // Слухаємо зміни з GlobalSettingsPanel
  useEffect(() => {
    const onUpdate = () => {
      const fs = localStorage.getItem(LS_KEYS.fontSize);
      const lh = localStorage.getItem(LS_KEYS.lineHeight);
      if (fs) setFontSize(Number(fs));
      if (lh) setLineHeight(Number(lh));
    };

    window.addEventListener("vv-reader-prefs-changed", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("vv-reader-prefs-changed", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  return { fontSize, lineHeight };
}
