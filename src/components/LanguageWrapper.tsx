import { useEffect } from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

type ValidLang = 'uk' | 'en';

const isValidLang = (lang: string | undefined): lang is ValidLang => {
  return lang === 'uk' || lang === 'en';
};

/**
 * Wrapper component that extracts language from URL and syncs with context.
 * Used as a layout route for all localized pages.
 */
export function LanguageWrapper() {
  const { lang } = useParams<{ lang: string }>();
  const { setLanguage, language } = useLanguage();

  // Validate language parameter
  if (!isValidLang(lang)) {
    // Invalid language - redirect to current language
    const currentPath = window.location.pathname.replace(/^\/[^/]+/, '');
    return <Navigate to={`/${language}${currentPath || '/'}`} replace />;
  }

  // Sync URL language with context when URL changes (e.g., direct navigation, back/forward)
  // We check localStorage (not context state) to avoid race conditions during user-initiated switches
  useEffect(() => {
    const storedLang = localStorage.getItem('language');
    // Only sync if URL language differs from stored language
    // This means it's an external navigation, not a user switch
    if (lang && lang !== storedLang) {
      setLanguage(lang);
    }
  }, [lang, setLanguage]);

  return <Outlet />;
}

/**
 * Redirects from root to language-prefixed path.
 * Uses current language from context (which reads from localStorage).
 */
export function LanguageRedirect() {
  const { language } = useLanguage();
  return <Navigate to={`/${language}/`} replace />;
}

/**
 * Redirects any path without language prefix to language-prefixed version.
 */
export function PathLanguageRedirect() {
  const { language } = useLanguage();
  const path = window.location.pathname;

  // Don't redirect admin, auth, api paths
  if (path.startsWith('/admin') || path.startsWith('/auth') || path.startsWith('/api')) {
    return null;
  }

  return <Navigate to={`/${language}${path}`} replace />;
}
