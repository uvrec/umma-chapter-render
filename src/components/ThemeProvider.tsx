// ThemeProvider.tsx — craft-палітра (бурштин), фікс синіх посилань у prose та звичайних <a>

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

/* HSL-змінні під shadcn/tailwind + форс кольорів для <a> і .prose */
const CRAFT_CSS = `
html.craft {
  /* base (shadcn tokens) */
  --background: 36 72% 80%;          /* пісочний фон */
  --foreground: 26 32% 18%;          /* темно-коричневий текст */

  /* бурштиновий бренд */
  --primary: 36 90% 48%;             /* AMBER */
  --primary-foreground: 48 100% 98%;
  --accent: 34 85% 45%;
  --accent-foreground: 48 100% 98%;

  --muted: 28 20% 80%;
  --muted-foreground: 26 24% 35%;
  --secondary: 28 30% 85%;
  --secondary-foreground: var(--foreground);
  --card: 40 78% 95%;
  --card-foreground: var(--foreground);
  --border: 28 24% 80%;
  --input: 28 24% 80%;
  --ring: var(--primary);

  color-scheme: light;
  background-color: hsl(var(--background));
  background-image: radial-gradient(hsl(0 0% 0% / 0.04) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* загальний текст */
html.light, html.dark, html.craft {
  color: hsl(var(--foreground, 222.2 47.4% 11.2%));
}

/* посилання за замовчуванням у craft */
html.craft a {
  color: hsl(var(--primary));
}
html.craft a:hover {
  color: hsl(var(--primary) / 0.85);
}

/* якщо використовується @tailwind/typography (.prose) */
html.craft .prose {
  --tw-prose-body: hsl(var(--foreground));
  --tw-prose-headings: hsl(var(--foreground));
  --tw-prose-links: hsl(var(--primary));                 /* <-- ключове */
  --tw-prose-bold: hsl(var(--foreground));
  --tw-prose-quotes: hsl(var(--foreground));
  --tw-prose-quote-borders: hsl(var(--primary));
  --tw-prose-counters: hsl(var(--muted-foreground));
  --tw-prose-bullets: hsl(var(--muted-foreground));
}

/* підстраховка для утиліт, якщо десь задані явно */
html.craft .text-primary { color: hsl(var(--primary)) !important; }
html.craft .hover\\:text-primary:hover { color: hsl(var(--primary)) !important; }
html.craft .bg-primary { background-color: hsl(var(--primary)) !important; }
html.craft .hover\\:bg-primary:hover { background-color: hsl(var(--primary)) !important; }
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
  border: 1px solid hsl(0 0% 0% / 0.06);
}

/* опційний контейнер craft */
.craft-paper-bg {
  background-color: hsl(var(--background));
  background-image: radial-gradient(hsl(0 0% 0% / 0.04) 1px, transparent 1px);
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

  useEffect(() => {
    let el = document.getElementById("vv-craft-css") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "vv-craft-css";
      el.textContent = CRAFT_CSS;
      document.head.appendChild(el);
    }
  }, []);

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
