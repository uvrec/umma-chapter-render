// ThemeProvider.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "craft";

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

// інжектуємо мінімальні стилі для craft + verse-surface
const CRAFT_CSS = `
html.craft {
  --bg: 243 212 165;       /* #F3D4A5 */
  --fg: 51 41 32;
  --card: 250 244 232;
  --muted: 92 76 61;
  --primary: 190 120 50;
  background-image: radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 16px 16px;
}
html.light, html.dark, html.craft {
  color: rgb(var(--fg, 17 24 39));
}
body {
  background-color: rgb(var(--bg, 255 255 255));
}
html.craft .verse-surface {
  background-color: rgb(var(--card));
  color: rgb(var(--fg));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 0 1px 1px rgba(0,0,0,0.06);
  background-image:
    radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(transparent 0, rgba(255,255,255,0.12) 100%);
  background-size: 16px 16px, 100% 100%;
  border: 1px solid rgba(0,0,0,0.06);
}
/* опційно: клас для загального тла сторінки, якщо хочеш форснути крафтовий фон у контейнері */
.craft-paper-bg {
  background-color: rgb(var(--bg, 243 212 165));
  background-image: radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 16px 16px;
}
`;

export function ThemeProvider({ children, defaultTheme = "light", storageKey = "vite-ui-theme" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // інжектуємо craft CSS один раз
  useEffect(() => {
    let el = document.getElementById("vv-craft-css") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "vv-craft-css";
      el.textContent = CRAFT_CSS;
      document.head.appendChild(el);
    }
  }, []);

  // застосовуємо клас теми на <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "craft");
    root.classList.add(theme);
    try {
      localStorage.setItem(storageKey, theme);
    } catch {}
  }, [theme, storageKey]);

  const value = useMemo<ThemeProviderState>(
    () => ({
      theme,
      setTheme: (t) => setThemeState(t),
    }),
    [theme],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
