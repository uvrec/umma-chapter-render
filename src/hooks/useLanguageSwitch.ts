import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCallback } from 'react';

type Language = 'uk' | 'en';

/**
 * Hook for switching language with proper React Router navigation.
 *
 * This hook solves the conflict between window.history.replaceState and React Router:
 * - replaceState changes URL but doesn't notify React Router
 * - LanguageWrapper's useEffect then sees URL mismatch and reverts the change
 *
 * By using navigate() with replace: true, React Router stays in sync with URL changes.
 * We also write to localStorage synchronously to prevent race conditions.
 */
export function useLanguageSwitch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage: setLanguageState, t, getLocalizedPath } = useLanguage();

  const switchLanguage = useCallback((newLang: Language) => {
    if (newLang === language) return;

    // IMPORTANT: Write to localStorage SYNCHRONOUSLY before navigation
    // This prevents LanguageWrapper's useEffect from reverting the change
    localStorage.setItem('language', newLang);

    // Update React state
    setLanguageState(newLang);

    // Update URL through React Router (not replaceState)
    const currentPath = location.pathname;
    if (
      currentPath.startsWith('/uk/') ||
      currentPath.startsWith('/en/') ||
      currentPath === '/uk' ||
      currentPath === '/en'
    ) {
      const pathWithoutLang = currentPath.replace(/^\/(uk|en)/, '');
      const newPath = `/${newLang}${pathWithoutLang || '/'}`;
      // Use replace: true to avoid adding to history stack
      navigate(newPath + location.search + location.hash, { replace: true });
    }
  }, [language, location.pathname, location.search, location.hash, navigate, setLanguageState]);

  return {
    language,
    switchLanguage,
    t,
    getLocalizedPath,
  };
}
