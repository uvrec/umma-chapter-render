import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "craft";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme; // craft за замовчуванням (див. нижче)
  storageKey?: string; // єдиний ключ зберігання теми
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeCtx = createContext<ThemeProviderState | undefined>(undefined);

/** ===== Craft-paper тема (HSL токени під Tailwind/Shadcn) =====
 *  Головне: card/popover = background, щоб блоки були в одному тоні з фоном.
 */
const CRAFT_CSS = `
html.craft {
  /* базовий тон */
  --background: 39 58% 86%;            /* пісочний фон #F1E4CC */
  --foreground: 26 36% 16%;            /* темно-горіховий текст */

  /* поверхні = як фон (щоб картки/вірші не були світліші) */
  --card: 39 58% 86%;
  --card-foreground: var(--foreground);
  --popover: 39 58% 86%;
  --popover-foreground: var(--foreground);

  --border: 35 28% 72%;                /* м’якша рамка */
  --input: var(--border);

  --muted: 36 25% 84%;
  --muted-foreground: 26 22% 38%;

  --secondary: 36 30% 90%;
  --secondary-foreground: 26 34% 22%;

  /* бурштинові акценти */
  --primary: 33 76% 42%;
  --primary-foreground: 48 100% 98%;
  --accent: 31 70% 40%;
  --accent-foreground: 48 100% 98%;
  --ring: var(--primary);

  --destructive: 8 74% 46%;
  --destructive-foreground: 48 100% 98%;

  /* sidebar (якщо використовуєш) */
  --sidebar-background: var(--background);
  --sidebar-foreground: var(--foreground);
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-accent: var(--accent);
  --sidebar-accent-foreground: var(--accent-foreground);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);

  color-scheme: light;

  /* крапковий “крафт” фон */
  background-color: hsl(var(--background));
  background-image: radial-gradient(hsl(0 0% 0% / 0.03) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* загальний текст */
html.light, html.dark, html.craft {
  color: hsl(var(--foreground, 222.2 47.4% 11.2%));
}

/* посилання в craft */
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

/* поверхня вірша/карток (в один тон з фоном) */
html.craft .verse-surface,
html.craft .card,
html.craft .shadcn-card {
  background-color: hsl(var(--card));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
  box-shadow:
    inset 0 1px 0 hsl(0 0% 100% / 0.35),
    0 1px 1px hsl(0 0% 0% / 0.06);
}

/* утиліти-підстраховки */
html.craft .text-primary { color: hsl(var(--primary)) !important; }
html.craft .bg-primary { background-color: hsl(var(--primary)) !important; color: hsl(var(--primary-foreground)) !important; }
html.craft .border-primary { border-color: hsl(var(--primary)) !important; }
html.craft .ring-primary { --tw-ring-color: hsl(var(--primary)) !important; }
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

  // підключаємо craft-CSS 1 раз
  useEffect(() => {
    let el = document.getElementById("vv-craft-css") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "vv-craft-css";
      el.textContent = CRAFT_CSS;
      document.head.appendChild(el);
    }
  }, []);

  // ставимо клас теми на <html> і зберігаємо вибір
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
