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

// --- стилі craft paper із бурштиновою палітрою ---
const CRAFT_CSS = `
html.craft {
  --bg: 243 212 165;        /* пісочний фон */
  --fg: 48 37 25;           /* темно-коричневий текст */
  --card: 250 243 225;
  --muted: 100 85 65;

  /* бурштинові акценти */
  --primary: 210 140 40;            /* головний акцент — бурштин */
  --primary-foreground: 255 252 245;
  --accent: 200 130 35;
  --accent-foreground: 255 255 250;

  color-scheme: light;
  background-image: radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 16px 16px;
}

html.craft, html.light, html.dark {
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

/* загальний craft фон, якщо потрібен */
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

  // інжекція стилів для craft-теми
  useEffect(() => {
    let el = document.getElementById("vv-craft-css") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "vv-craft-css";
      el.textContent = CRAFT_CSS;
      document.head.appendChild(el);
    }
  }, []);

  // перемикання класу теми
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
