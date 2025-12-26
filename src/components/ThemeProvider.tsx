// src/contexts/ThemeProvider.tsx
// Оновлено: додано Sepia тему

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "craft" | "sepia";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeCtx = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "light", // За замовчуванням світла тема
  storageKey = "veda-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return ((localStorage.getItem(storageKey) as Theme) ?? defaultTheme) as Theme;
    } catch {
      return defaultTheme;
    }
  });

  // Застосовуємо клас теми на <html> і зберігаємо в localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "craft", "sepia");
    root.classList.add(theme);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // localStorage may be unavailable in private browsing mode
    }
  }, [theme, storageKey]);

  const value = useMemo<ThemeProviderState>(
    () => ({ theme, setTheme: setThemeState }),
    [theme]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
