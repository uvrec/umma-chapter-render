import { useState } from "react";
import { X, Minus, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
  onVerseSelect
}: SettingsPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVerses = verses.filter(verse => 
    verse.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    verse.translation.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h3 className="text-lg font-semibold mb-4">Переклад</h3>
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
                <Label htmlFor="craft-paper">Фон крафтового паперу</Label>
                <Switch
                  id="craft-paper"
                  checked={craftPaperMode}
                  onCheckedChange={onCraftPaperToggle}
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
                    {verse.translation.substring(0, 100)}...
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