// src/components/ThemeProvider.tsx
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

/**
 * Ключовий момент:
 * 1) Робимо craft дефолтною палітрою.
 * 2) Підтягуємо light/dark на ту ж палітру (щоб бічна панель і кнопки виглядали як у craft).
 *    За потреби згодом можна відтінити light/dark трохи інакше — зараз головне стабільність UI.
 * 3) Додаємо змінні керування читанням (розмір шрифту / міжряддя), щоб бічне меню працювало.
 */
const THEME_CSS =
  `
/* === БАЗОВІ ЗМІННІ ДЛЯ КРАФТ-ПАПЕР (ЄДИНЕ ДЖЕРЕЛО) === */
:root.theme-craft {
  --background: 39 58% 86%;
  --foreground: 26 36% 16%;

  --card: 41 70% 96%;
  --card-foreground: var(--foreground);

  --border: 35 28% 78%;
  --input: var(--border);

  --muted: 36 25% 84%;
  --muted-foreground: 26 22% 38%;

  --secondary: 36 30% 90%;
  --secondary-foreground: 26 34% 22%;

  --primary: 33 76% 42%;
  --primary-foreground: 48 100% 98%;
  --accent: 31 70% 40%;
  --accent-foreground: 48 100% 98%;
  --ring: var(--primary);

  --destructive: 8 74% 46%;
  --destructive-foreground: 48 100% 98%;

  /* Додаткові токени, якщо їх очікують компоненти */
  --popover: var(--card);
  --popover-foreground: var(--foreground);

  /* тіні */
  --shadow-card: 0 1px 1px hsl(0 0% 0% / 0.06);
  --shadow-verse: inset 0 1px 0 hsl(0 0% 100% / .35), 0 1px 1px hsl(0 0% 0% /.06);
  --shadow-header: 0 8px 24px -12px hsl(0 0% 0% / .18);

  color-scheme: light;
}

/* === ПРИВ'ЯЗКА КЛАСІВ ТЕМИ НА <html> ДО ПАЛІТРИ CRAFT ===
   Щоб меню/кнопки не ламались у light/dark, зараз і вони наслідують craft.
   Пізніше можна зробити варіації: :root.theme-light / :root.theme-dark з іншими відтінками. */
html.craft    { @apply bg-background; }
html.light    { @apply bg-background; }
html.dark     { @apply bg-background; }
html.craft,
html.light,
html.dark {
  /* Наслідуємо craft-токени */
}
html.craft    { }
html.light    { }
html.dark     { }

/* Примаплюємо всі три до однієї палітри craft-паперу */
html.craft,
html.light,
html.dark {
  /* підключаємо craft-токени на :root через клас theme-craft */
}
html.craft    { }
html.light    { }
html.dark     { }
` +
  `
/* Трюк: додаємо theme-craft клас на <html> разом з поточним (craft/light/dark),
   щоб мати єдину палітру без дублювання змінних */
html.theme-craft {
  background-color: hsl(var(--background));
  background-image: radial-gradient(hsl(0 0% 0% / 0.035) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* Посилання/typography в craft-палітрі */
html.theme-craft a { color: hsl(var(--primary)); }
html.theme-craft a:hover { color: hsl(var(--primary) / .9); }

html.theme-craft .prose {
  --tw-prose-body: hsl(var(--foreground));
  --tw-prose-headings: hsl(var(--foreground));
  --tw-prose-links: hsl(var(--primary));
  --tw-prose-bold: hsl(var(--foreground));
  --tw-prose-quotes: hsl(var(--foreground));
  --tw-prose-quote-borders: hsl(var(--primary));
  --tw-prose-counters: hsl(var(--muted-foreground));
  --tw-prose-bullets: hsl(var(--muted-foreground));
}

/* Кнопки/стіни під craft */
html.theme-craft .bg-primary { background-color: hsl(var(--primary)) !important; color: hsl(var(--primary-foreground)) !important; }
html.theme-craft .hover\\:bg-primary:hover { background-color: hsl(var(--primary) / 0.92) !important; }
html.theme-craft .text-primary { color: hsl(var(--primary)) !important; }
html.theme-craft .hover\\:text-primary:hover { color: hsl(var(--primary) / 0.9) !important; }
html.theme-craft .border-primary { border-color: hsl(var(--primary)) !important; }
html.theme-craft .ring-primary { --tw-ring-color: hsl(var(--primary)) !important; }

/* Поверхня віршів/карток */
html.theme-craft .verse-surface {
  background-color: hsl(var(--card));
  color: hsl(var(--foreground));
  box-shadow: var(--shadow-verse);
  background-image:
    radial-gradient(hsl(0 0% 0% / 0.05) 1px, transparent 1px),
    linear-gradient(transparent 0, hsl(0 0% 100% / 0.12) 100%);
  background-size: 16px 16px, 100% 100%;
  border: 1px solid hsl(var(--border));
}

/* === КОНТРОЛІ ЧИТАННЯ (лінійна висота й розмір шрифту) ===
   Компонент бічного меню може просто ставити data-атрибути на <html> або на кореневий контейнер з текстом. */
html[data-reading-lineheight="tight"] .reading-body { line-height: 1.4; }
html[data-reading-lineheight="normal"] .reading-body { line-height: 1.65; }
html[data-reading-lineheight="loose"] .reading-body { line-height: 1.9; }

html[data-reading-size="sm"]  .reading-body { font-size: 0.95rem; }
html[data-reading-size="md"]  .reading-body { font-size: 1.05rem; }
html[data-reading-size="lg"]  .reading-body { font-size: 1.15rem; }
html[data-reading-size="xl"]  .reading-body { font-size: 1.25rem; }

/* Підстраховка контрасту для будь-яких темних елементів */
html.theme-craft .text-muted-foreground { color: hsl(var(--muted-foreground)); }
`;

const ThemeCtx = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children, defaultTheme = "craft", storageKey = "veda-ui-theme" }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // інжект стилі один раз
  useEffect(() => {
    let el = document.getElementById("vv-theme-css") as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = "vv-theme-css";
      el.textContent = THEME_CSS;
      document.head.appendChild(el);
    }
  }, []);

  // вішай клас теми та "theme-craft" для єдиної палітри
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "craft");
    root.classList.add(theme);
    // даємо токени craft будь-якій активній темі
    root.classList.add("theme-craft");

    try {
      localStorage.setItem(storageKey, theme);
    } catch {}
  }, [theme, storageKey]);

  // Не даємо сторінкам “перевизначати” тему при навігації/рендері
  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      if (!root.classList.contains(theme)) {
        root.classList.remove("light", "dark", "craft");
        root.classList.add(theme);
      }
      if (!root.classList.contains("theme-craft")) {
        root.classList.add("theme-craft");
      }
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);
  const value = useMemo<ThemeProviderState>(() => ({ theme, setTheme }), [theme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
