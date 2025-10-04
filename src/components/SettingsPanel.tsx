import { useState } from "react";
import { X, Minus, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TextDisplaySettings {
  showSanskrit: boolean;
  showTransliteration: boolean;
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
  verses: any[];
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
  onContinuousReadingSettingsChange
}: SettingsPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVerses = verses.filter(verse => 
    verse.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (verse.translation && verse.translation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const increaseFontSize = () => {
    if (fontSize < 24) {
      onFontSizeChange(fontSize + 1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) {
      onFontSizeChange(fontSize - 1);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>Настройки</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Font Size Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Відображення тексту</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Розмір шрифта</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={decreaseFontSize}
                    disabled={fontSize <= 12}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center text-sm">{fontSize}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={increaseFontSize}
                    disabled={fontSize >= 24}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="craft-paper">Фон для читання</Label>
                <Switch
                  id="craft-paper"
                  checked={craftPaperMode}
                  onCheckedChange={onCraftPaperToggle}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dual-language">Двомовний режим</Label>
                <Switch
                  id="dual-language"
                  checked={dualLanguageMode}
                  onCheckedChange={onDualLanguageModeToggle}
                />
              </div>

              {dualLanguageMode && (
                <div>
                  <Label>Оригінальна мова</Label>
                  <select 
                    className="w-full mt-2 p-2 rounded-md border border-input bg-background"
                    value={originalLanguage}
                    onChange={(e) => onOriginalLanguageChange(e.target.value)}
                  >
                    <option value="sanskrit">Санскрит</option>
                    <option value="english">Англійська</option>
                    <option value="bengali">Бенгалі</option>
                  </select>
                </div>
              )}
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
                    onContinuousReadingSettingsChange({...continuousReadingSettings, enabled: checked})
                  }
                />
              </div>

              {continuousReadingSettings.enabled && (
                <div className="space-y-3 ml-4 border-l-2 border-muted pl-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-verse-numbers">Номери віршів</Label>
                    <Switch
                      id="show-verse-numbers"
                      checked={continuousReadingSettings.showVerseNumbers}
                      onCheckedChange={(checked) => 
                        onContinuousReadingSettingsChange({...continuousReadingSettings, showVerseNumbers: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="cont-sanskrit">Санскрит</Label>
                    <Switch
                      id="cont-sanskrit"
                      checked={continuousReadingSettings.showSanskrit}
                      onCheckedChange={(checked) => 
                        onContinuousReadingSettingsChange({...continuousReadingSettings, showSanskrit: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="cont-transliteration">Транслітерація</Label>
                    <Switch
                      id="cont-transliteration"
                      checked={continuousReadingSettings.showTransliteration}
                      onCheckedChange={(checked) => 
                        onContinuousReadingSettingsChange({...continuousReadingSettings, showTransliteration: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="cont-translation">Переклад</Label>
                    <Switch
                      id="cont-translation"
                      checked={continuousReadingSettings.showTranslation}
                      onCheckedChange={(checked) => 
                        onContinuousReadingSettingsChange({...continuousReadingSettings, showTranslation: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="cont-commentary">Коментар</Label>
                    <Switch
                      id="cont-commentary"
                      checked={continuousReadingSettings.showCommentary}
                      onCheckedChange={(checked) => 
                        onContinuousReadingSettingsChange({...continuousReadingSettings, showCommentary: checked})
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-sanskrit">Санскрит/Деванагарі</Label>
                <Switch
                  id="show-sanskrit"
                  checked={textDisplaySettings.showSanskrit}
                  onCheckedChange={(checked) => 
                    onTextDisplaySettingsChange({...textDisplaySettings, showSanskrit: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-transliteration">Транслітерація</Label>
                <Switch
                  id="show-transliteration"
                  checked={textDisplaySettings.showTransliteration}
                  onCheckedChange={(checked) => 
                    onTextDisplaySettingsChange({...textDisplaySettings, showTransliteration: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-synonyms">Послівний переклад</Label>
                <Switch
                  id="show-synonyms"
                  checked={textDisplaySettings.showSynonyms}
                  onCheckedChange={(checked) => 
                    onTextDisplaySettingsChange({...textDisplaySettings, showSynonyms: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-translation">Переклад</Label>
                <Switch
                  id="show-translation"
                  checked={textDisplaySettings.showTranslation}
                  onCheckedChange={(checked) => 
                    onTextDisplaySettingsChange({...textDisplaySettings, showTranslation: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-commentary">Коментар</Label>
                <Switch
                  id="show-commentary"
                  checked={textDisplaySettings.showCommentary}
                  onCheckedChange={(checked) => 
                    onTextDisplaySettingsChange({...textDisplaySettings, showCommentary: checked})
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Search and Navigation */}
          <div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Пошук"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredVerses.map((verse, index) => (
                <button
                  key={verse.number}
                  onClick={() => {
                    onVerseSelect(verse.number);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentVerse === verse.number
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{verse.number}</span>
                    <span className="text-sm opacity-75">{verse.book}</span>
                  </div>
                  <p className="text-sm mt-1 opacity-80 line-clamp-2">
                    {verse.translation ? `${verse.translation.substring(0, 100)}...` : 'Переклад відсутній'}
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