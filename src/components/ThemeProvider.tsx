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

/** ===== Craft theme CSS (інжектується один раз у <head>) ===== */
const CRAFT_CSS = `
html.craft {
  /* базові токени */
  --background: 39 58% 86%;       /* піщаний фон */
  --foreground: 26 36% 16%;

  --card: 41 70% 96%;
  --card-foreground: var(--foreground);

  --border: 35 28% 78%;
  --input: var(--border);

  --muted: 36 25% 84%;
  --muted-foreground: 26 22% 38%;

  --secondary: 36 30% 90%;
  --secondary-foreground: 26 34% 22%;

  --primary: 33 76% 42%;          /* бурштин */
  --primary-foreground: 48 100% 98%;
  --accent: 31 70% 40%;
  --accent-foreground: 48 100% 98%;
  --ring: var(--primary);

  --destructive: 8 74% 46%;
  --destructive-foreground: 48 100% 98%;

  color-scheme: light;
  background-color: hsl(var(--background));
  background-image: radial-gradient(hsl(0 0% 0% / 0.035) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* типографіка/посилання/typography plugin */
html.craft a { color: hsl(var(--primary)); }
html.craft a:hover { color: hsl(var(--primary) / 0.9); }

html.craft .prose {
  --tw-prose-body: hsl(var(--foreground));
  --tw-prose-headings: hsl(var(--foreground));
  --tw-prose-links: hsl(var(--primary));
  --tw-prose-bold: hsl(var(--foreground));
  --tw-prose-quotes: hsl(var(--foreground));
  --tw-prose-quote-borders: hsl(var(--primary));
  --tw-prose-counters: hsl(var(--muted-foreground));
  --tw-prose-bullets: hsl(var(--muted-foreground));
}

/* єдиний колір для блоків віршів/перекладів/пояснень */
html.craft .verse-surface,
html.craft .reader-block,
html.craft .card,
html.craft .prose-reader .verse-container {
  background-color: hsl(var(--card));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
  box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.35), 0 1px 1px hsl(0 0% 0% / 0.06);
}

/* утиліти craft (щоб кнопки/кільця поводились послідовно) */
html.craft .text-primary { color: hsl(var(--primary)) !important; }
html.craft .bg-primary { background-color: hsl(var(--primary)) !important; color: hsl(var(--primary-foreground)) !important; }
html.craft .ring-primary { --tw-ring-color: hsl(var(--primary)) !important; }
`;

/** ===== Глобальні змінні читача (font-size/line-height/max-width) ===== */
const READER_CSS = `
:root {
  --vv-reader-font-size: 20px;
  --vv-reader-line-height: 1.6;
  --vv-reader-max-width: 68ch;
}
html .prose-reader {
  font-size: var(--vv-reader-font-size);
  line-height: var(--vv-reader-line-height);
  margin: 0 auto; max-width: var(--vv-reader-max-width);
  text-align: left;
}
html .prose-reader .sanskrit, html .sanskrit-text {
  font-family: var(--sanskrit-font, "Noto Sans Devanagari", serif);
  font-size: calc(var(--vv-reader-font-size) * 1.6);
  line-height: 1.4; text-align: center;
}
html .prose-reader .translit { font-style: italic; }
`;

export function ThemeProvider({ children, defaultTheme = "craft", storageKey = "veda-ui-theme" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(storageKey) as Theme | null;
      return saved ?? defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // інжект стилів craft + reader один раз
  useEffect(() => {
    const ensureStyle = (id: string, css: string) => {
      let el = document.getElementById(id) as HTMLStyleElement | null;
      if (!el) {
        el = document.createElement("style");
        el.id = id;
        el.textContent = css;
        document.head.appendChild(el);
      }
    };
    ensureStyle("vv-craft-css", CRAFT_CSS);
    ensureStyle("vv-reader-css", READER_CSS);
  }, []);

  // клас теми на <html> + збереження
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
