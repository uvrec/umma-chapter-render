// ThemeProvider.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "craft";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme; // ← тепер craft за замовченням нижче
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeCtx = createContext<ThemeProviderState | undefined>(undefined);

/* стилі craft (ваші — без змін) */
const CRAFT_CSS = `/* … ваш CRAFT_CSS як є … */`;

export function ThemeProvider({
  children,
  defaultTheme = "craft", // ← було "light"
  storageKey = "veda-ui-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(storageKey) as Theme | null;
      return saved ?? defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // інжекція craft стилів 1 раз
  useEffect(() => {
    let el = document.getElementById("vv-craft-css") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "vv-craft-css";
      el.textContent = CRAFT_CSS;
      document.head.appendChild(el);
    }
  }, []);

  // застосувати клас теми на <html> і зберегти
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "craft");
    root.classList.add(theme);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {}
  }, [theme, storageKey]);

  const value = useMemo<ThemeProviderState>(() => ({ theme, setTheme: (t) => setThemeState(t) }), [theme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
