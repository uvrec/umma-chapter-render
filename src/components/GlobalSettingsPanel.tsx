// src/components/GlobalSettingsPanel.tsx
import { useEffect, useMemo, useState } from "react";
import { Settings, Palette, Type, AlignJustify, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/ThemeProvider";

// Прості інпут-слайдери, щоб не залежати від інших ui-компонентів
function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="range"
      className="w-full cursor-pointer"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number((e.target as HTMLInputElement).value))}
    />
  );
}

type Prefs = {
  fontSize: number; // px
  lineHeight: number; // 1.xx
  maxWidth: number; // ch
  theme: "light" | "dark" | "craft";
};

const LS_KEY = "veda-reader-prefs";
const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);

export function GlobalSettingsPanel() {
  const { theme, setTheme } = useTheme();

  // 1) зчитуємо prefs з localStorage один раз
  const initial: Prefs = useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { fontSize: 20, lineHeight: 1.6, maxWidth: 68, theme: "craft" };
  }, []);

  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState(initial.fontSize);
  const [lineHeight, setLineHeight] = useState(initial.lineHeight);
  const [maxWidth, setMaxWidth] = useState(initial.maxWidth);
  const [localTheme, setLocalTheme] = useState<Prefs["theme"]>(initial.theme);

  // 2) застосовуємо prefs до :root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--vv-reader-font-size", `${clamp(fontSize, 14, 28)}px`);
    root.style.setProperty("--vv-reader-line-height", String(clamp(lineHeight, 1.2, 2)));
    root.style.setProperty("--vv-reader-max-width", `${clamp(maxWidth, 52, 86)}ch`);
  }, [fontSize, lineHeight, maxWidth]);

  // 3) застосовуємо тему через ThemeProvider + зберігаємо prefs
  useEffect(() => {
    if (localTheme !== theme) setTheme(localTheme);
    const prefs: Prefs = { fontSize, lineHeight, maxWidth, theme: localTheme };
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(prefs));
    } catch {}
  }, [fontSize, lineHeight, maxWidth, localTheme, setTheme, theme]);

  // 4) синхронізуємо локальний селектор теми, якщо тему змінено з іншого місця
  useEffect(() => {
    if (theme !== localTheme) setLocalTheme(theme);
  }, [theme]); // eslint-disable-line

  return (
    <>
      {/* Плаваюча кнопка відкриття */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button aria-label="Налаштування читання" className="rounded-full shadow-lg" onClick={() => setOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Налаштування
        </Button>
      </div>

      {/* Панель — проста картка поверх контенту */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-end bg-black/20"
          onClick={() => setOpen(false)}
        >
          <Card
            className="w-full sm:w-[420px] max-h-[90vh] overflow-auto p-4 m-0 sm:m-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Налаштування читання</h3>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Закрити
              </Button>
            </div>

            {/* Тема */}
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <h4 className="font-medium">Тема</h4>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button variant={localTheme === "craft" ? "default" : "outline"} onClick={() => setLocalTheme("craft")}>
                  Craft-папір
                </Button>
                <Button variant={localTheme === "light" ? "default" : "outline"} onClick={() => setLocalTheme("light")}>
                  Світла
                </Button>
                <Button variant={localTheme === "dark" ? "default" : "outline"} onClick={() => setLocalTheme("dark")}>
                  Темна
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Тема зберігається та застосовується глобально, не “злітатиме” між сторінками.
              </p>
            </section>

            {/* Кегль */}
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                <h4 className="font-medium">Розмір шрифту</h4>
              </div>
              <Label className="text-xs text-muted-foreground">Кегль: {fontSize}px</Label>
              <Slider min={14} max={28} step={1} value={fontSize} onChange={setFontSize} />
            </section>

            {/* Міжряддя */}
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <AlignJustify className="w-4 h-4" />
                <h4 className="font-medium">Міжряддя</h4>
              </div>
              <Label className="text-xs text-muted-foreground">Коефіцієнт: {lineHeight.toFixed(2)}</Label>
              <Slider min={1.2} max={2} step={0.05} value={lineHeight} onChange={setLineHeight} />
            </section>

            {/* Ширина колонки */}
            <section className="space-y-2">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4" />
                <h4 className="font-medium">Ширина колонки</h4>
              </div>
              <Label className="text-xs text-muted-foreground">Макс. ширина: {maxWidth}ch</Label>
              <Slider min={52} max={86} step={1} value={maxWidth} onChange={setMaxWidth} />
            </section>

            <p className="text-xs text-muted-foreground">
              Налаштування діють для елементів з класом <code>.prose-reader</code> (читалка/вміст).
            </p>
          </Card>
        </div>
      )}
    </>
  );
}

export default GlobalSettingsPanel;
