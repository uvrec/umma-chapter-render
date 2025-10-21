// src/components/GlobalSettingsPanel.tsx
/**
 * ПОВНІСТЮ ВИПРАВЛЕНА ПАНЕЛЬ НАЛАШТУВАНЬ
 *
 * ✅ Правильна синхронізація з localStorage
 * ✅ Всі перемикачі працюють
 * ✅ Події vv-reader-prefs-changed спрацьовують
 */

import { useEffect, useState } from "react";
import { Settings, X, Globe, Palette, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";

const MIN_FONT = 12;
const MAX_FONT = 24;
const MIN_LH = 1.3;
const MAX_LH = 2.0;

const LS_KEYS = {
  fontSize: "vv_reader_fontSize",
  lineHeight: "vv_reader_lineHeight",
  dual: "vv_reader_dualMode",
  blocks: "vv_reader_blocks",
  continuous: "vv_reader_continuous",
};

type BlocksState = {
  showSanskrit: boolean;
  showTransliteration: boolean;
  showSynonyms: boolean;
  showTranslation: boolean;
  showCommentary: boolean;
};

type ContinuousState = {
  enabled: boolean;
  showVerseNumbers: boolean;
  showSanskrit: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
  showCommentary: boolean;
};

function readBlocks(): BlocksState {
  try {
    const raw = localStorage.getItem(LS_KEYS.blocks);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        showSanskrit: parsed.showSanskrit ?? true,
        showTransliteration: parsed.showTransliteration ?? true,
        showSynonyms: parsed.showSynonyms ?? true,
        showTranslation: parsed.showTranslation ?? true,
        showCommentary: parsed.showCommentary ?? true,
      };
    }
  } catch {}
  return {
    showSanskrit: true,
    showTransliteration: true,
    showSynonyms: true,
    showTranslation: true,
    showCommentary: true,
  };
}

function readContinuous(): ContinuousState {
  try {
    const raw = localStorage.getItem(LS_KEYS.continuous);
    if (raw) {
      return {
        enabled: false,
        showVerseNumbers: true,
        showSanskrit: false,
        showTransliteration: false,
        showTranslation: true,
        showCommentary: false,
        ...JSON.parse(raw),
      };
    }
  } catch {}
  return {
    enabled: false,
    showVerseNumbers: true,
    showSanskrit: false,
    showTransliteration: false,
    showTranslation: true,
    showCommentary: false,
  };
}

export const GlobalSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [fontSize, setFontSize] = useState<number>(() => {
    const s = localStorage.getItem(LS_KEYS.fontSize);
    return s ? Number(s) : 18;
  });

  const [lineHeight, setLineHeight] = useState<number>(() => {
    const s = localStorage.getItem(LS_KEYS.lineHeight);
    return s ? Number(s) : 1.6;
  });

  const [dualMode, setDualMode] = useState<boolean>(() => localStorage.getItem(LS_KEYS.dual) === "true");

  const [blocks, setBlocks] = useState<BlocksState>(() => readBlocks());
  const [continuous, setContinuous] = useState<ContinuousState>(() => readContinuous());

  // Функція для оповіщення про зміни
  const bumpReader = () => {
    console.log("🔧 [GlobalSettingsPanel] Dispatching vv-reader-prefs-changed event");
    window.dispatchEvent(new CustomEvent("vv-reader-prefs-changed"));
  };

  // Синхронізація fontSize
  useEffect(() => {
    console.log("🔧 [GlobalSettingsPanel] fontSize changed:", fontSize);
    localStorage.setItem(LS_KEYS.fontSize, String(fontSize));

    // Оновлюємо CSS змінну
    document.documentElement.style.setProperty("--vv-reader-font-size", `${fontSize}px`);

    setTimeout(() => bumpReader(), 10);
  }, [fontSize]);

  // Синхронізація lineHeight
  useEffect(() => {
    console.log("🔧 [GlobalSettingsPanel] lineHeight changed:", lineHeight);
    localStorage.setItem(LS_KEYS.lineHeight, String(lineHeight));

    // Оновлюємо CSS змінну
    document.documentElement.style.setProperty("--vv-reader-line-height", String(lineHeight));

    setTimeout(() => bumpReader(), 10);
  }, [lineHeight]);

  // Синхронізація dualMode
  useEffect(() => {
    console.log("🔧 [GlobalSettingsPanel] dualMode changed:", dualMode);
    localStorage.setItem(LS_KEYS.dual, String(dualMode));
    setTimeout(() => bumpReader(), 10);
  }, [dualMode]);

  // Синхронізація blocks
  useEffect(() => {
    console.log("🔧 [GlobalSettingsPanel] blocks changed:", blocks);
    localStorage.setItem(LS_KEYS.blocks, JSON.stringify(blocks));
    setTimeout(() => bumpReader(), 10);
  }, [blocks]);

  // Синхронізація continuous
  useEffect(() => {
    console.log("🔧 [GlobalSettingsPanel] continuous changed:", continuous);
    localStorage.setItem(LS_KEYS.continuous, JSON.stringify(continuous));
    setTimeout(() => bumpReader(), 10);
  }, [continuous]);

  const decreaseFont = () => setFontSize((v) => Math.max(MIN_FONT, v - 1));
  const increaseFont = () => setFontSize((v) => Math.min(MAX_FONT, v + 1));
  const decreaseLH = () => setLineHeight((v) => Math.max(MIN_LH, Math.round((v - 0.05) * 100) / 100));
  const increaseLH = () => setLineHeight((v) => Math.min(MAX_LH, Math.round((v + 0.05) * 100) / 100));

  const craftSwitchChecked = theme === "craft";

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Settings Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              <span>Налаштування</span>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Мова інтерфейсу */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Мова інтерфейсу
              </h3>
              <div className="flex gap-2">
                <Button
                  variant={language === "ua" ? "default" : "outline"}
                  onClick={() => setLanguage("ua")}
                  className="flex-1"
                >
                  Українська
                </Button>
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  onClick={() => setLanguage("en")}
                  className="flex-1"
                >
                  English
                </Button>
              </div>
            </div>

            <Separator />

            {/* Тема */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Тема оформлення
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Крафтова тема</Label>
                  <Switch
                    checked={craftSwitchChecked}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? "craft" : "light");
                    }}
                  />
                </div>
                <ThemeToggle />
              </div>
            </div>

            <Separator />

            {/* Типографіка */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Відображення тексту</h3>

              {/* Розмір шрифта */}
              <div className="space-y-3">
                <div>
                  <Label className="mb-2 block">Розмір шрифта: {fontSize}px</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={decreaseFont} disabled={fontSize <= MIN_FONT}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <input
                      type="range"
                      min={MIN_FONT}
                      max={MAX_FONT}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={increaseFont} disabled={fontSize >= MAX_FONT}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Міжряддя */}
                <div>
                  <Label className="mb-2 block">Міжряддя: {lineHeight.toFixed(2)}</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={decreaseLH} disabled={lineHeight <= MIN_LH}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <input
                      type="range"
                      min={MIN_LH}
                      max={MAX_LH}
                      step="0.05"
                      value={lineHeight}
                      onChange={(e) => setLineHeight(Number(e.target.value))}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={increaseLH} disabled={lineHeight >= MAX_LH}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Двомовний режим */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Режим перекладу</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="dual-language">Двомовний режим</Label>
                <Switch id="dual-language" checked={dualMode} onCheckedChange={setDualMode} />
              </div>
            </div>

            <Separator />

            {/* Елементи тексту */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Елементи тексту</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-sanskrit">Санскрит / Деванагарі</Label>
                  <Switch
                    id="show-sanskrit"
                    checked={blocks.showSanskrit}
                    onCheckedChange={(checked) => setBlocks((prev) => ({ ...prev, showSanskrit: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-translit">Транслітерація</Label>
                  <Switch
                    id="show-translit"
                    checked={blocks.showTransliteration}
                    onCheckedChange={(checked) => setBlocks((prev) => ({ ...prev, showTransliteration: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-synonyms">Послівний переклад</Label>
                  <Switch
                    id="show-synonyms"
                    checked={blocks.showSynonyms}
                    onCheckedChange={(checked) => setBlocks((prev) => ({ ...prev, showSynonyms: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-translation">Переклад</Label>
                  <Switch
                    id="show-translation"
                    checked={blocks.showTranslation}
                    onCheckedChange={(checked) => setBlocks((prev) => ({ ...prev, showTranslation: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show-commentary">Пояснення</Label>
                  <Switch
                    id="show-commentary"
                    checked={blocks.showCommentary}
                    onCheckedChange={(checked) => setBlocks((prev) => ({ ...prev, showCommentary: checked }))}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Режим безперервного читання */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Режим читання</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="continuous-reading">Безперервне читання</Label>
                  <Switch
                    id="continuous-reading"
                    checked={continuous.enabled}
                    onCheckedChange={(checked) => setContinuous((prev) => ({ ...prev, enabled: checked }))}
                  />
                </div>

                {continuous.enabled && (
                  <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-verse-nums">Номери віршів</Label>
                      <Switch
                        id="cont-verse-nums"
                        checked={continuous.showVerseNumbers}
                        onCheckedChange={(checked) => setContinuous((prev) => ({ ...prev, showVerseNumbers: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-sanskrit">Санскрит</Label>
                      <Switch
                        id="cont-sanskrit"
                        checked={continuous.showSanskrit}
                        onCheckedChange={(checked) => setContinuous((prev) => ({ ...prev, showSanskrit: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-translit">Транслітерація</Label>
                      <Switch
                        id="cont-translit"
                        checked={continuous.showTransliteration}
                        onCheckedChange={(checked) =>
                          setContinuous((prev) => ({ ...prev, showTransliteration: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-translation">Переклад</Label>
                      <Switch
                        id="cont-translation"
                        checked={continuous.showTranslation}
                        onCheckedChange={(checked) => setContinuous((prev) => ({ ...prev, showTranslation: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="cont-commentary">Пояснення</Label>
                      <Switch
                        id="cont-commentary"
                        checked={continuous.showCommentary}
                        onCheckedChange={(checked) => setContinuous((prev) => ({ ...prev, showCommentary: checked }))}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
