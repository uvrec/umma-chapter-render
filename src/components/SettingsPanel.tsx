// src/components/SettingsPanel.tsx
import { useEffect, useMemo, useState } from "react";
import { X, Minus, Plus, Search, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/components/ThemeProvider";

interface TextDisplaySettings {
  showSanskritUa: boolean;
  showSanskritEn: boolean;
  showTransliterationUa: boolean;
  showTransliterationEn: boolean;
  showSynonyms: boolean;
  showTranslation: boolean;
  showCommentary: boolean;
}

export interface ContinuousReadingSettings {
  enabled: boolean;
  showVerseNumbers: boolean;
  showSanskrit: boolean;
  showTransliteration: boolean;
  showTranslation: boolean;
  showCommentary: boolean;
}

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  craftPaperMode: boolean;
  onCraftPaperToggle: (enabled: boolean) => void;
  verses: Array<{ number: string; book?: string; translation?: string }>;
  currentVerse: string;
  onVerseSelect: (verse: string) => void;
  dualLanguageMode: boolean;
  onDualLanguageModeToggle: (enabled: boolean) => void;
  textDisplaySettings: TextDisplaySettings;
  onTextDisplaySettingsChange: (settings: TextDisplaySettings) => void;
  originalLanguage: string;
  onOriginalLanguageChange: (language: string) => void;
  continuousReadingSettings: ContinuousReadingSettings;
  onContinuousReadingSettingsChange: (settings: ContinuousReadingSettings) => void;
}

const MIN_FONT = 12;
const MAX_FONT = 24;
const MIN_LH = 1.3;
const MAX_LH = 2.0;

export const SettingsPanel = ({
  isOpen,
  onClose,
  fontSize,
  onFontSizeChange,
  craftPaperMode,
  onCraftPaperToggle,
  verses,
  currentVerse,
  onVerseSelect,
  dualLanguageMode,
  onDualLanguageModeToggle,
  textDisplaySettings,
  onTextDisplaySettingsChange,
  originalLanguage,
  onOriginalLanguageChange,
  continuousReadingSettings,
  onContinuousReadingSettingsChange,
}: SettingsPanelProps) => {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [lineHeight, setLineHeight] = useState<number>(() => {
    const saved = localStorage.getItem("vv_reader_lineHeight");
    return saved ? Number(saved) : 1.6;
  });

  // зберігаємо line-height + нотифікуємо інші екрани
  useEffect(() => {
    localStorage.setItem("vv_reader_lineHeight", String(lineHeight));
    window.dispatchEvent(new Event("vv-reader-prefs-changed"));
    const root = document.querySelector<HTMLElement>('[data-reader-root="true"]');
    if (root) root.style.lineHeight = String(lineHeight);
  }, [lineHeight]);

  const filteredVerses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return verses;
    return verses.filter(
      (v) => v.number.toLowerCase().includes(q) || (v.translation && v.translation.toLowerCase().includes(q)),
    );
  }, [verses, searchQuery]);

  const increaseFontSize = () => onFontSizeChange(Math.min(MAX_FONT, fontSize + 1));
  const decreaseFontSize = () => onFontSizeChange(Math.max(MIN_FONT, fontSize - 1));
  const increaseLH = () => setLineHeight((l) => Math.min(MAX_LH, Math.round((l + 0.05) * 100) / 100));
  const decreaseLH = () => setLineHeight((l) => Math.max(MIN_LH, Math.round((l - 0.05) * 100) / 100));
  const resetTypography = () => {
    onFontSizeChange(18);
    setLineHeight(1.6);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 h-svh overflow-y-auto max-h-screen">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Налаштування</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Закрити">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Theme */}
          <div>
            <h3 className="mb-4 flex items-center text-lg font-semibold">
              <Palette className="mr-2 h-4 w-4" /> Тема
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => {
                  setTheme("light");
                  onCraftPaperToggle(false);
                }}
              >
                Світла
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => {
                  setTheme("dark");
                  onCraftPaperToggle(false);
                }}
              >
                Темна
              </Button>
              <Button
                variant={theme === "craft" ? "default" : "outline"}
                onClick={() => {
                  setTheme("craft");
                  onCraftPaperToggle(true);
                }}
              >
                Крафт
              </Button>
            </div>
          </div>

          <Separator />

          {/* Font Size + Line Height */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Відображення тексту</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Розмір шрифту</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseFontSize}
                    disabled={fontSize <= MIN_FONT}
                    aria-label="Зменшити шрифт"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center text-sm tabular-nums">{fontSize}px</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseFontSize}
                    disabled={fontSize >= MAX_FONT}
                    aria-label="Збільшити шрифт"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label>Міжряддя</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseLH}
                    disabled={lineHeight <= MIN_LH}
                    aria-label="Зменшити міжряддя"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-10 text-center text-sm tabular-nums">{lineHeight.toFixed(2)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseLH}
                    disabled={lineHeight >= MAX_LH}
                    aria-label="Збільшити міжряддя"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="craft-paper">Фон для читання (крафт)</Label>
                <Switch
                  id="craft-paper"
                  checked={craftPaperMode}
                  onCheckedChange={(checked) => {
                    onCraftPaperToggle(checked);
                    setTheme(checked ? "craft" : "light");
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dual-language">Двомовний режим</Label>
                <Switch id="dual-language" checked={dualLanguageMode} onCheckedChange={onDualLanguageModeToggle} />
              </div>

              {dualLanguageMode && (
                <div>
                  <Label htmlFor="orig-lang">Мова оригіналу</Label>
                  <select
                    id="orig-lang"
                    className="mt-2 w-full rounded-md border border-input bg-background p-2"
                    value={originalLanguage}
                    onChange={(e) => onOriginalLanguageChange(e.target.value)}
                  >
                    <option value="sanskrit">Санскрит</option>
                    <option value="bengali">Бенгалі</option>
                  </select>
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={resetTypography}>
                  Скинути типографіку
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Continuous Reading Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Режим читання</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="continuous-reading">Неперервний текст</Label>
                <Switch
                  id="continuous-reading"
                  checked={continuousReadingSettings.enabled}
                  onCheckedChange={(checked) =>
                    onContinuousReadingSettingsChange({ ...continuousReadingSettings, enabled: checked })
                  }
                />
              </div>

              {continuousReadingSettings.enabled && (
                <div className="ml-4 space-y-3 border-l-2 border-muted pl-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-verse-numbers">Номери віршів</Label>
                    <Switch
                      id="show-verse-numbers"
                      checked={continuousReadingSettings.showVerseNumbers}
                      onCheckedChange={(checked) =>
                        onContinuousReadingSettingsChange({ ...continuousReadingSettings, showVerseNumbers: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="cont-sanskrit">Санскрит</Label>
                    <Switch
                      id="cont-sanskrit"
                      checked={continuousReadingSettings.showSanskrit}
                      onCheckedChange={(checked) =>
                        onContinuousReadingSettingsChange({ ...continuousReadingSettings, showSanskrit: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="cont-transliteration">Транслітерація</Label>
                    <Switch
                      id="cont-transliteration"
                      checked={continuousReadingSettings.showTransliteration}
                      onCheckedChange={(checked) =>
                        onContinuousReadingSettingsChange({
                          ...continuousReadingSettings,
                          showTransliteration: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="cont-translation">Переклад</Label>
                    <Switch
                      id="cont-translation"
                      checked={continuousReadingSettings.showTranslation}
                      onCheckedChange={(checked) =>
                        onContinuousReadingSettingsChange({ ...continuousReadingSettings, showTranslation: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="cont-commentary">Пояснення</Label>
                    <Switch
                      id="cont-commentary"
                      checked={continuousReadingSettings.showCommentary}
                      onCheckedChange={(checked) =>
                        onContinuousReadingSettingsChange({ ...continuousReadingSettings, showCommentary: checked })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Text Display Settings */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Елементи тексту</h3>
            <div className="space-y-4">
              
              {/* Санскрит */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Санскрит/Деванагарі</Label>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-sanskrit-ua" className="text-sm font-normal">Українська</Label>
                    <Switch
                      id="show-sanskrit-ua"
                      checked={textDisplaySettings.showSanskritUa}
                      onCheckedChange={(checked) =>
                        onTextDisplaySettingsChange({ ...textDisplaySettings, showSanskritUa: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-sanskrit-en" className="text-sm font-normal">Англійська</Label>
                    <Switch
                      id="show-sanskrit-en"
                      checked={textDisplaySettings.showSanskritEn}
                      onCheckedChange={(checked) =>
                        onTextDisplaySettingsChange({ ...textDisplaySettings, showSanskritEn: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Транслітерація */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Транслітерація</Label>
                <div className="ml-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-transliteration-ua" className="text-sm font-normal">Українська</Label>
                    <Switch
                      id="show-transliteration-ua"
                      checked={textDisplaySettings.showTransliterationUa}
                      onCheckedChange={(checked) =>
                        onTextDisplaySettingsChange({ ...textDisplaySettings, showTransliterationUa: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-transliteration-en" className="text-sm font-normal">Англійська</Label>
                    <Switch
                      id="show-transliteration-en"
                      checked={textDisplaySettings.showTransliterationEn}
                      onCheckedChange={(checked) =>
                        onTextDisplaySettingsChange({ ...textDisplaySettings, showTransliterationEn: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="show-synonyms">Послівний переклад</Label>
                <Switch
                  id="show-synonyms"
                  checked={textDisplaySettings.showSynonyms}
                  onCheckedChange={(checked) =>
                    onTextDisplaySettingsChange({ ...textDisplaySettings, showSynonyms: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-translation">Літературний переклад</Label>
                <Switch
                  id="show-translation"
                  checked={textDisplaySettings.showTranslation}
                  onCheckedChange={(checked) =>
                    onTextDisplaySettingsChange({ ...textDisplaySettings, showTranslation: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-commentary">Пояснення</Label>
                <Switch
                  id="show-commentary"
                  checked={textDisplaySettings.showCommentary}
                  onCheckedChange={(checked) =>
                    onTextDisplaySettingsChange({ ...textDisplaySettings, showCommentary: checked })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Search and Navigation */}
          <div>
            <div className="relative mb-4">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Пошук"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Пошук по віршах"
              />
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto">
              {filteredVerses.map((verse) => (
                <button
                  key={verse.number}
                  onClick={() => {
                    onVerseSelect(verse.number);
                    onClose();
                  }}
                  className={`w-full rounded-lg p-3 text-left transition-colors ${
                    currentVerse === verse.number ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                  }`}
                  aria-current={currentVerse === verse.number ? "true" : "false"}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{verse.number}</span>
                    {verse.book && <span className="text-sm opacity-75">{verse.book}</span>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm opacity-80">
                    {verse.translation ? `${verse.translation}` : "Переклад відсутній"}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;
