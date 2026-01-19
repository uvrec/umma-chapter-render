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

  // Font family options (like Neu Bible: Breve, Graphik, Sentinel, Texta)
  const fontFamilies = [
    { id: "serif", label: "Breve" },
    { id: "sans", label: "Graphik" },
    { id: "georgia", label: "Sentinel" },
    { id: "system", label: "Texta" },
  ];

  // Line spacing options
  const lineSpacingOptions = [
    { id: "compact", value: 1.3, icon: "compact" },
    { id: "normal", value: 1.6, icon: "normal" },
    { id: "spacious", value: 2.0, icon: "spacious" },
  ];

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[70vh] overflow-y-auto"
      >
        {/* Handle indicator */}
        <div className="flex justify-center pt-2 pb-4">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        <div className="px-4 pb-8 space-y-6">
          {/* Day / Night Toggle - Neu Bible style tabs */}
          <div className="flex border-b border-border">
            {dayNightThemes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isActive = themeOption.group === "day" ? isDayTheme : !isDayTheme;
              return (
                <button
                  key={themeOption.id}
                  onClick={() => setTheme(themeOption.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 transition-colors",
                    "border-b-2 -mb-[1px]",
                    isActive
                      ? "border-brand-500 text-brand-500"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{themeOption.label}</span>
                </button>
              );
            })}
          </div>

          {/* Font Family Selection - horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
            {fontFamilies.map((font, index) => (
              <button
                key={font.id}
                onClick={() => {
                  // TODO: implement font family change
                }}
                className={cn(
                  "font-serif text-base whitespace-nowrap transition-colors",
                  index === 0 ? "text-brand-500 font-medium" : "text-muted-foreground"
                )}
              >
                {font.label}
              </button>
            ))}
          </div>

          <Separator />

          {/* Font Size Slider - Neu Bible style with Aa indicators */}
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

          {/* Line Spacing - Neu Bible style icons */}
          <div className="flex justify-center gap-8">
            {lineSpacingOptions.map((option) => {
              const isActive = Math.abs(lineHeight - option.value) < 0.2;
              return (
                <button
                  key={option.id}
                  onClick={() => setLineHeight(option.value)}
                  className={cn(
                    "p-3 rounded-lg transition-colors",
                    isActive ? "text-brand-500" : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label={option.id}
                >
                  {/* Line spacing icons */}
                  <svg
                    className="w-8 h-6"
                    viewBox="0 0 32 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    {option.id === "compact" && (
                      <>
                        <line x1="4" y1="6" x2="28" y2="6" />
                        <line x1="4" y1="12" x2="28" y2="12" />
                        <line x1="4" y1="18" x2="28" y2="18" />
                      </>
                    )}
                    {option.id === "normal" && (
                      <>
                        <line x1="4" y1="4" x2="28" y2="4" />
                        <line x1="4" y1="12" x2="28" y2="12" />
                        <line x1="4" y1="20" x2="28" y2="20" />
                      </>
                    )}
                    {option.id === "spacious" && (
                      <>
                        <line x1="4" y1="2" x2="28" y2="2" />
                        <line x1="4" y1="12" x2="28" y2="12" />
                        <line x1="4" y1="22" x2="28" y2="22" />
                      </>
                    )}
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SpineTypographyPanel;
