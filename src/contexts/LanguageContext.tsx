import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

type Language = 'uk' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (uk: string, en: string) => string;
  getLocalizedPath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Paths that should NOT have language prefix
const NON_LOCALIZED_PREFIXES = ['/admin', '/auth', '/api', '/404'];

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    // Migration: convert old 'ua' to 'uk'
    if (stored === 'ua') {
      localStorage.setItem('language', 'uk');
      return 'uk';
    }
    return (stored === 'uk' || stored === 'en') ? stored : 'uk';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = useCallback((uk: string, en: string) => {
    return language === 'uk' ? uk : en;
  }, [language]);

  const getLocalizedPath = useCallback((path: string): string => {
    // Non-localized paths stay as-is
    if (NON_LOCALIZED_PREFIXES.some(prefix => path.startsWith(prefix))) {
      return path;
    }

    // Already has language prefix - return as-is
    if (path.startsWith('/uk/') || path.startsWith('/en/') || path === '/uk' || path === '/en') {
      return path;
    }

    // Normalize path
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Handle root path
    if (normalizedPath === '/') {
      return `/${language}/`;
    }

    return `/${language}${normalizedPath}`;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getLocalizedPath }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
