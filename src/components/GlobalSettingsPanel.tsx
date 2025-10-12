import { useEffect, useMemo, useState } from "react";
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

// ключі локальних налаштувань читалки
const LS_KEYS = {
  fontSize: "vv_reader_fontSize",
  lineHeight: "vv_reader_lineHeight",
  dual: "vv_reader_dualMode",
  blocks: "vv_reader_blocks", // {sanskrit, translit, synonyms, translation, commentary}
};

type BlocksState = {
  sanskrit: boolean;
  translit: boolean;
  synonyms: boolean;
  translation: boolean;
  commentary: boolean;
};

function readBlocks(): BlocksState {
  try {
    const raw = localStorage.getItem(LS_KEYS.blocks);
    if (raw)
      return {
        sanskrit: true,
        translit: true,
        synonyms: true,
        translation: true,
        commentary: true,
        ...JSON.parse(raw),
      };
  } catch {}
  return { sanskrit: true, translit: true, synonyms: true, translation: true, commentary: true };
}

export const GlobalSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  // читальні prefs
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

  // збереження + повідомлення читалці
  const bumpReader = () => {
    window.dispatchEvent(new CustomEvent("vv-reader-prefs-changed"));
  };

  useEffect(() => {
    localStorage.setItem(LS_KEYS.fontSize, String(fontSize));
    bumpReader();
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.lineHeight, String(lineHeight));
    bumpReader();
  }, [lineHeight]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.dual, String(dualMode));
    bumpReader();
  }, [dualMode]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.blocks, JSON.stringify(blocks));
    bumpReader();
  }, [blocks]);

  // утиліти
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
  className="fixed bottom-20 right-6 z-40 h-14 w-14 rounded-full shadow-lg"
  size="icon"
>

      {/* Settings Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-96">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle>{t("Налаштування", "Settings")}</SheetTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} aria-label={t("Закрити", "Close")}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* Тема */}
            <div>
              <Label className="text-base font-semibold mb-3 block">{t("Тема оформлення", "Theme")}</Label>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  variant={craftSwitchChecked ? "default" : "outline"}
                  onClick={() => setTheme("craft")}
                  className="gap-2"
                >
                  <Palette className="h-4 w-4" />
                  Крафт
                </Button>
              </div>
            </div>

            {/* Мова інтерфейсу */}
            <div>
              <Label className="text-base font-semibold mb-3 block">{t("Мова інтерфейсу", "Interface Language")}</Label>
              <div className="flex gap-2">
                <Button
                  variant={language === "ua" ? "default" : "outline"}
                  onClick={() => setLanguage("ua")}
                  className="flex-1"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Українська
                </Button>
                <Button
                  variant={language === "en" ? "default" : "outline"}
                  onClick={() => setLanguage("en")}
                  className="flex-1"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  English
                </Button>
              </div>
            </div>

            <Separator />

            {/* Налаштування читання (глобальні, працюють у читачі) */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Відображення тексту</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Розмір шрифта</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decreaseFont}
                      disabled={fontSize <= MIN_FONT}
                      aria-label="Зменшити"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-10 text-center text-sm tabular-nums">{fontSize}px</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={increaseFont}
                      disabled={fontSize >= MAX_FONT}
                      aria-label="Збільшити"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Міжряддя</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decreaseLH}
                      disabled={lineHeight <= MIN_LH}
                      aria-label="Зменшити"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center text-sm tabular-nums">{lineHeight.toFixed(2)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={increaseLH}
                      disabled={lineHeight >= MAX_LH}
                      aria-label="Збільшити"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="dual-language">Двомовний режим</Label>
                  <Switch id="dual-language" checked={dualMode} onCheckedChange={(v) => setDualMode(v)} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Елементи тексту</h3>
              <div className="space-y-3">
                <RowToggle
                  label="Санскрит / Деванагарі"
                  checked={blocks.sanskrit}
                  onChange={(v) => setBlocks({ ...blocks, sanskrit: v })}
                />
                <RowToggle
                  label="Транслітерація"
                  checked={blocks.translit}
                  onChange={(v) => setBlocks({ ...blocks, translit: v })}
                />
                <RowToggle
                  label="Послівний переклад"
                  checked={blocks.synonyms}
                  onChange={(v) => setBlocks({ ...blocks, synonyms: v })}
                />
                <RowToggle
                  label="Переклад"
                  checked={blocks.translation}
                  onChange={(v) => setBlocks({ ...blocks, translation: v })}
                />
                <RowToggle
                  label="Пояснення"
                  checked={blocks.commentary}
                  onChange={(v) => setBlocks({ ...blocks, commentary: v })}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
  
  );
};

function RowToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
