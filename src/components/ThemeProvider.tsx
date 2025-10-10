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

/* Палітра craft (HSL під shadcn/tailwind) + фікси посилань і prose */
const CRAFT_CSS = `
html.craft {
  /* базові токени */
  --background: 39 58% 86%;        /* пісочний фон #F1E4CC */
  --foreground: 26 36% 16%;        /* темно-горіховий текст */

  --card: 41 70% 96%;              /* #FBF6EA */
  --card-foreground: var(--foreground);

  --border: 35 28% 78%;            /* #E1D6C2 */
  --input: var(--border);

  --muted: 36 25% 84%;
  --muted-foreground: 26 22% 38%;

  --secondary: 36 30% 90%;
  --secondary-foreground: 26 34% 22%;

  /* бурштинові акценти */
  --primary: 33 76% 42%;           /* глибокий бурштин #C47A16 */
  --primary-foreground: 48 100% 98%;
  --accent: 31 70% 40%;            /* #B06F1A */
  --accent-foreground: 48 100% 98%;
  --ring: var(--primary);

  --destructive: 8 74% 46%;
  --destructive-foreground: 48 100% 98%;

  color-scheme: light;
  background-color: hsl(var(--background));
  background-image: radial-gradient(hsl(0 0% 0% / 0.035) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* дефолтний текст */
html.light, html.dark, html.craft {
  color: hsl(var(--foreground, 222.2 47.4% 11.2%));
}

/* посилання (щоб не були сині) */
html.craft a { color: hsl(var(--primary)); }
html.craft a:hover { color: hsl(var(--primary) / 0.9); }

/* підтримка @tailwind/typography */
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

/* утиліти підстраховки */
html.craft .text-primary { color: hsl(var(--primary)) !important; }
html.craft .hover\\:text-primary:hover { color: hsl(var(--primary) / 0.9) !important; }
html.craft .bg-primary { background-color: hsl(var(--primary)) !important; color: hsl(var(--primary-foreground)) !important; }
html.craft .hover\\:bg-primary:hover { background-color: hsl(var(--primary) / 0.92) !important; }
html.craft .border-primary { border-color: hsl(var(--primary)) !important; }
html.craft .ring-primary { --tw-ring-color: hsl(var(--primary)) !important; }

/* поверхня вірша/карток */
html.craft .verse-surface {
  background-color: hsl(var(--card));
  color: hsl(var(--foreground));
  box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.35), 0 1px 1px hsl(0 0% 0% / 0.06);
  background-image:
    radial-gradient(hsl(0 0% 0% / 0.05) 1px, transparent 1px),
    linear-gradient(transparent 0, hsl(0 0% 100% / 0.12) 100%);
  background-size: 16px 16px, 100% 100%;
  border: 1px solid hsl(var(--border));
}

/* опційний контейнерний фон craft */
.craft-paper-bg {
  background-color: hsl(var(--background));
  background-image: radial-gradient(hsl(0 0% 0% / 0.035) 1px, transparent 1px);
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

  // інжекція craft-стилів
  useEffect(() => {
    let el = document.getElementById("vv-craft-css") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "vv-craft-css";
      el.textContent = CRAFT_CSS;
      document.head.appendChild(el);
    }
  }, []);

  // клас теми на <html>
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
