// ThemeToggle.tsx
// Один файл із усім: ThemeProvider + useTheme + ThemeToggle (меню + хоткеї)
// «Крафт-папір» застосовується глобально (html.craft) І ДОДАТКОВО до блоків віршів,
// якщо контейнер блоку має клас .verse-surface (див. інжекцію стилів у провайдері).

import * as React from "react";
import { useEffect, useLayoutEffect, useState, useCallback, useMemo, useContext } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "craft" | "system";

type ThemeCtx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const Ctx = React.createContext<ThemeCtx>({ theme: "system", setTheme: () => {} });

export const useTheme = () => useContext(Ctx);

/** Внутрішній CSS для крафту — інжектується, коли активна тема craft */
const CRAFT_VERSE_CSS = `
/* Глобальна «крафт» тема */
html.craft {
  --bg: 243 212 165; /* #F3D4A5 */
  --card: 250 244 232;
  --fg: 51 41 32;
  --muted: 92 76 61;
  --primary: 190 120 50;
  background-image: radial-gradient(rgba(0,0,0,0.03) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* Прив’язка до елементів сторінки */
body { background-color: rgb(var(--bg)); color: rgb(var(--fg)); }

/* ДОДАТКОВО: крафтове оформлення для поверхонь вірша */
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

/* Якщо вірш — це <Card>, можна просто додати className="verse-surface" до кореня */
`;

/** Провайдер теми з підтримкою 'light' | 'dark' | 'system' | 'craft' */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("vv_theme") as Theme) || "system";
  });

  // Інжекція craft-стилів 1 раз
  useLayoutEffect(() => {
    let styleEl = document.getElementById("vv-craft-styles") as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "vv-craft-styles";
      styleEl.textContent = CRAFT_VERSE_CSS;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Застосування класів теми до <html> та реакція на system
  useEffect(() => {
    const root = document.documentElement;

    const apply = (t: Theme) => {
      root.classList.remove("light", "dark", "craft");
      if (t === "system") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.add(prefersDark ? "dark" : "light");
        root.setAttribute("data-theme", prefersDark ? "dark" : "light");
      } else {
        root.classList.add(t);
        root.setAttribute("data-theme", t);
      }
    };

    apply(theme);
    localStorage.setItem("vv_theme", theme);

    if (theme === "system") {
      const mm = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => apply("system");
      mm.addEventListener("change", handler);
      return () => mm.removeEventListener("change", handler);
    }
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Кнопка/меню перемикання теми + хоткеї: Ctrl/Cmd+J (light/dark), Ctrl/Cmd+Shift+J (craft) */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;

      const k = e.key.toLowerCase();
      if (k === "j" && !e.shiftKey) {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      } else if (k === "j" && e.shiftKey) {
        e.preventDefault();
        setTheme("craft");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [theme, setTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Перемикач теми">
          {/* Сонце/Місяць із плавною анімацією */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Змінити тему</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={6}>
        <DropdownMenuLabel>Тема</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme("light")} role="menuitemradio" aria-checked={theme === "light"}>
          <Sun className="mr-2 h-4 w-4" />
          Світла
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} role="menuitemradio" aria-checked={theme === "dark"}>
          <Moon className="mr-2 h-4 w-4" />
          Темна
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} role="menuitemradio" aria-checked={theme === "system"}>
          <span className="mr-2 inline-block h-4 w-4 rounded border" />
          Системна
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme("craft")} role="menuitemradio" aria-checked={theme === "craft"}>
          <Palette className="mr-2 h-4 w-4" />
          Крафт-папір
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* 
ВАЖЛИВО для «крафт-паперу» у ВІРШІ:
— Просто додай className="verse-surface" на кореневий контейнер блоку вірша (наприклад, Card у VerseCard).
— Тоді при активній темі craft він отримає крафтове тло/рамку (інжектований CSS вище).
Так, таким чином «крафт» застосовується не лише до загального фону, а й до самих блоків віршів.
*/
