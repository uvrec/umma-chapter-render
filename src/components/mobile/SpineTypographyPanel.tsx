// src/components/mobile/SpineTypographyPanel.tsx
// Typography settings panel for Spine Navigation
// Панель налаштувань типографіки у стилі Neu Bible

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { Sun, Moon, Palette, RotateCcw, Eye, Snowflake } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_FONT = 12;
const MAX_FONT = 24;
const MIN_LH = 1.3;
const MAX_LH = 2.0;

interface SpineTypographyPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SpineTypographyPanel({ open, onClose }: SpineTypographyPanelProps) {
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const {
    fontSize,
    baseFontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    resetTypography,
    showNumbers,
    setShowNumbers,
    flowMode,
    setFlowMode,
  } = useReaderSettings();

  // Handle font size slider change
  const handleFontSizeChange = (values: number[]) => {
    const newSize = values[0];
    const adjustment = newSize - baseFontSize;
    setFontSize(adjustment);
  };

  // Handle line height slider change
  const handleLineHeightChange = (values: number[]) => {
    setLineHeight(values[0]);
  };

  // Theme options (Day/Night style + themes)
  const dayNightThemes = [
    { id: "light" as const, label: t("День", "Day"), icon: Sun, group: "day" },
    { id: "dark" as const, label: t("Ніч", "Night"), icon: Moon, group: "night" },
  ];

  const additionalThemes = [
    { id: "craft" as const, label: t("Крафт", "Craft"), icon: Palette },
    { id: "sepia" as const, label: t("Сепія", "Sepia"), icon: Palette },
    { id: "solarized-light" as const, label: "Solarized", icon: Sun },
    { id: "nord" as const, label: "Nord", icon: Snowflake },
    { id: "high-contrast" as const, label: t("Контраст", "Contrast"), icon: Eye },
  ];

  const isDayTheme = theme === "light" || theme === "craft" || theme === "sepia" || theme === "solarized-light";

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="left"
        className="w-[calc(100%-4rem)] sm:w-80 ml-16 p-0 overflow-y-auto"
      >
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="text-lg">{t("Типографіка", "Typography")}</SheetTitle>
        </SheetHeader>

        <div className="px-4 py-4 space-y-6">
          {/* Day / Night Toggle */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Режим", "Mode")}
            </Label>
            <div className="flex gap-2">
              {dayNightThemes.map((t) => {
                const Icon = t.icon;
                const isActive = t.group === "day" ? isDayTheme : !isDayTheme;
                return (
                  <Button
                    key={t.id}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 h-12",
                      isActive && "bg-brand-500 hover:bg-brand-600"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Additional Themes Grid */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Теми", "Themes")}
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {additionalThemes.map((t) => {
                const Icon = t.icon;
                return (
                  <Button
                    key={t.id}
                    variant={theme === t.id ? "default" : "outline"}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 h-auto py-2 px-1 text-xs",
                      theme === t.id && "bg-brand-500 hover:bg-brand-600"
                    )}
                    title={t.label}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate w-full text-center">{t.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Font Size Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {t("Розмір шрифта", "Font Size")}
            </Label>
            <div className="flex items-center gap-3">
              <span className="text-xs font-serif select-none opacity-60" style={{ fontSize: '12px' }}>Aa</span>
              <Slider
                value={[fontSize]}
                min={MIN_FONT}
                max={MAX_FONT}
                step={1}
                onValueChange={handleFontSizeChange}
                className="flex-1"
                aria-label={t("Розмір шрифта", "Font Size")}
              />
              <span className="text-xl font-serif select-none" style={{ fontSize: '20px' }}>Aa</span>
            </div>
            <div className="text-center text-xs text-muted-foreground">{fontSize}px</div>
          </div>

          {/* Line Height Slider */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {t("Міжряддя", "Line Spacing")}
            </Label>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4 text-muted-foreground opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
              <Slider
                value={[lineHeight]}
                min={MIN_LH}
                max={MAX_LH}
                step={0.05}
                onValueChange={handleLineHeightChange}
                className="flex-1"
                aria-label={t("Міжряддя", "Line Height")}
              />
              <svg className="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="4" x2="20" y2="4" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="20" x2="20" y2="20" />
              </svg>
            </div>
            <div className="text-center text-xs text-muted-foreground">{lineHeight.toFixed(2)}</div>
          </div>

          <Separator />

          {/* Text Options */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {t("Налаштування тексту", "Text Options")}
            </Label>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-numbers" className="cursor-pointer">
                {t("Номери віршів", "Verse Numbers")}
              </Label>
              <Switch
                id="show-numbers"
                checked={showNumbers}
                onCheckedChange={(v) => setShowNumbers(v)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="flow-mode" className="cursor-pointer">
                {t("Суцільний текст", "Continuous Text")}
              </Label>
              <Switch
                id="flow-mode"
                checked={flowMode}
                onCheckedChange={(v) => setFlowMode(v)}
              />
            </div>
          </div>

          <Separator />

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={resetTypography}
            className="w-full gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {t("Скинути", "Reset")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SpineTypographyPanel;
