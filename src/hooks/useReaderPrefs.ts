import { useState, useEffect } from "react";

interface ReaderPrefs {
  fontSize: number;
  lineHeight: number;
  showCommentary: boolean;
  showSynonyms: boolean;
  showTransliteration: boolean;
  dualLanguageMode: boolean;
}

const DEFAULT_PREFS: ReaderPrefs = {
  fontSize: 18,
  lineHeight: 1.6,
  showCommentary: true,
  showSynonyms: true,
  showTransliteration: true,
  dualLanguageMode: false,
};

export function useReaderPrefs() {
  const [prefs, setPrefs] = useState<ReaderPrefs>(() => {
    const saved = localStorage.getItem("vv_reader_prefs");
    if (saved) {
      try {
        return { ...DEFAULT_PREFS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_PREFS;
      }
    }
    return DEFAULT_PREFS;
  });

  useEffect(() => {
    localStorage.setItem("vv_reader_prefs", JSON.stringify(prefs));
    window.dispatchEvent(new Event("vv-reader-prefs-changed"));
  }, [prefs]);

  useEffect(() => {
    const onUpdate = () => {
      const saved = localStorage.getItem("vv_reader_prefs");
      if (saved) {
        try {
          setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(saved) });
        } catch {}
      }
    };

    window.addEventListener("vv-reader-prefs-changed", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("vv-reader-prefs-changed", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const updatePref = <K extends keyof ReaderPrefs>(key: K, value: ReaderPrefs[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  return { ...prefs, updatePref };
}
