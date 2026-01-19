import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// 'ua' for Ukrainian, 'en' for English
export type Language = 'ua' | 'en';
export type UrlLanguage = 'ua' | 'en';

// URL language codes match internal codes
const toUrlLang = (lang: Language): UrlLanguage => lang;
const fromUrlLang = (urlLang: string): Language | null => {
  if (urlLang === 'ua') return 'ua';
  if (urlLang === 'en') return 'en';
  return null;
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ua: string, en: string) => string;
  // URL helpers
  getLocalizedPath: (path: string) => string;
  urlLanguage: UrlLanguage;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// List of paths that should NOT have language prefix (admin, auth, etc.)
const NON_LOCALIZED_PATHS = [
  '/admin',
  '/auth',
  '/api',
  '/404',
];

const isLocalizedPath = (path: string): boolean => {
  return !NON_LOCALIZED_PATHS.some(prefix => path.startsWith(prefix));
};

// Extract language from URL path
const extractLangFromPath = (path: string): { lang: Language | null; pathWithoutLang: string } => {
  const match = path.match(/^\/(ua|en)(\/|$)/);
  if (match) {
    const lang = fromUrlLang(match[1]);
    const pathWithoutLang = path.replace(/^\/(ua|en)/, '') || '/';
    return { lang, pathWithoutLang };
  }
  return { lang: null, pathWithoutLang: path };
};

interface LanguageProviderProps {
  children: ReactNode;
}

// Inner provider that uses router hooks
const LanguageProviderInner = ({ children }: LanguageProviderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract language from current URL
  const { lang: urlLang, pathWithoutLang } = extractLangFromPath(location.pathname);

  const [language, setLanguageState] = useState<Language>(() => {
    // Priority: URL > localStorage > default
    if (urlLang) return urlLang;
    const stored = localStorage.getItem('language');
    return (stored === 'ua' || stored === 'en') ? stored : 'ua';
  });

  // Sync language from URL changes
  useEffect(() => {
    if (urlLang && urlLang !== language) {
      setLanguageState(urlLang);
      localStorage.setItem('language', urlLang);
    }
  }, [urlLang, language]);

  // Add language prefix to current URL if missing (only for localized paths)
  useEffect(() => {
    if (!urlLang && isLocalizedPath(location.pathname)) {
      const newPath = `/${toUrlLang(language)}${location.pathname}${location.search}${location.hash}`;
      navigate(newPath, { replace: true });
    }
  }, [urlLang, language, location.pathname, location.search, location.hash, navigate]);

  // Update URL when language changes
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);

    // Update URL if we're on a localized path
    if (isLocalizedPath(location.pathname)) {
      const newPath = `/${toUrlLang(lang)}${pathWithoutLang}${location.search}${location.hash}`;
      navigate(newPath, { replace: true });
    }
  }, [location.pathname, location.search, location.hash, pathWithoutLang, navigate]);

  const t = useCallback((ua: string, en: string) => {
    return language === 'ua' ? ua : en;
  }, [language]);

  // Generate localized path
  const getLocalizedPath = useCallback((path: string): string => {
    if (!isLocalizedPath(path)) return path;

    // Remove existing language prefix if present
    const { pathWithoutLang: cleanPath } = extractLangFromPath(path);
    return `/${toUrlLang(language)}${cleanPath}`;
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      getLocalizedPath,
      urlLanguage: toUrlLang(language)
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Outer provider for use outside Router
export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  return <LanguageProviderInner>{children}</LanguageProviderInner>;
};

// Standalone provider for use outside Router (e.g., in App.tsx before BrowserRouter)
export const LanguageProviderStandalone = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check URL first
    const urlLang = extractLangFromPath(window.location.pathname).lang;
    if (urlLang) return urlLang;

    const stored = localStorage.getItem('language');
    return (stored === 'ua' || stored === 'en') ? stored : 'ua';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (ua: string, en: string) => {
    return language === 'ua' ? ua : en;
  };

  const getLocalizedPath = (path: string): string => {
    if (!isLocalizedPath(path)) return path;
    const { pathWithoutLang: cleanPath } = extractLangFromPath(path);
    return `/${toUrlLang(language)}${cleanPath}`;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      getLocalizedPath,
      urlLanguage: toUrlLang(language)
    }}>
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
