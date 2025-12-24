/**
 * BookSettingsPage - Extended settings page for book reader
 * Based on BBT reference app design, adapted to VedaVOICE amber/craft theme
 */

import { useState, useEffect } from "react";
import {
  Sun,
  Moon,
  Palette,
  Type,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  Minus,
  Plus,
  RotateCcw,
  Smartphone,
  Monitor,
  BookOpen,
} from "lucide-react";
import { BookReaderHeader } from "@/components/BookReaderHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/components/ThemeProvider";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { cn } from "@/lib/utils";

interface BookSettingsPageProps {
  bookTitle: string;
  bookSlug: string;
  cantoNumber?: number;
}

// Color theme presets
const COLOR_THEMES = [
  { id: "light", name: "День", nameEn: "Day", bg: "#ffffff", text: "#1a1a1a", icon: Sun },
  { id: "dark", name: "Ніч", nameEn: "Night", bg: "#1a1a1a", text: "#f5f5f5", icon: Moon },
  { id: "craft", name: "Крафт", nameEn: "Craft", bg: "#e8d5b7", text: "#5c4033", icon: Palette },
  { id: "sepia", name: "Сепія", nameEn: "Sepia", bg: "#f4ecd8", text: "#5b4636", icon: BookOpen },
];

// Font family options
const FONT_FAMILIES = [
  { id: "system", name: "Системний", nameEn: "System", family: "system-ui, sans-serif" },
  { id: "serif", name: "Serif", nameEn: "Serif", family: "Georgia, 'Times New Roman', serif" },
  { id: "sans", name: "Sans-serif", nameEn: "Sans-serif", family: "Inter, system-ui, sans-serif" },
  { id: "mono", name: "Моно", nameEn: "Mono", family: "'JetBrains Mono', monospace" },
];

// Text alignment options
const TEXT_ALIGNMENTS = [
  { id: "left", icon: AlignLeft },
  { id: "center", icon: AlignCenter },
  { id: "justify", icon: AlignJustify },
];

export const BookSettingsPage = ({
  bookTitle,
  bookSlug,
  cantoNumber,
}: BookSettingsPageProps) => {
  const { language, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const {
    fontSize,
    lineHeight,
    increaseFont,
    decreaseFont,
    increaseLH,
    decreaseLH,
    resetTypography,
    textDisplaySettings,
    setTextDisplaySettings,
    flowMode,
    setFlowMode,
    mobileSafeMode,
    setMobileSafeMode,
  } = useReaderSettings();

  // Local settings state
  const [brightness, setBrightness] = useState(100);
  const [fontFamily, setFontFamily] = useState("system");
  const [textAlign, setTextAlign] = useState("left");
  const [marginSize, setMarginSize] = useState(16);
  const [paragraphSpacing, setParagraphSpacing] = useState(1.5);

  // Load settings from localStorage
  useEffect(() => {
    const savedBrightness = localStorage.getItem("vv_reader_brightness");
    const savedFontFamily = localStorage.getItem("vv_reader_fontFamily");
    const savedTextAlign = localStorage.getItem("vv_reader_textAlign");
    const savedMargin = localStorage.getItem("vv_reader_margin");
    const savedParagraphSpacing = localStorage.getItem("vv_reader_paragraphSpacing");

    if (savedBrightness) setBrightness(parseInt(savedBrightness));
    if (savedFontFamily) setFontFamily(savedFontFamily);
    if (savedTextAlign) setTextAlign(savedTextAlign);
    if (savedMargin) setMarginSize(parseInt(savedMargin));
    if (savedParagraphSpacing) setParagraphSpacing(parseFloat(savedParagraphSpacing));
  }, []);

  // Save settings to localStorage
  const saveSetting = (key: string, value: string | number) => {
    localStorage.setItem(`vv_reader_${key}`, String(value));
  };

  const handleBrightnessChange = (value: number[]) => {
    setBrightness(value[0]);
    saveSetting("brightness", value[0]);
  };

  const handleFontFamilyChange = (family: string) => {
    setFontFamily(family);
    saveSetting("fontFamily", family);
  };

  const handleTextAlignChange = (align: string) => {
    setTextAlign(align);
    saveSetting("textAlign", align);
  };

  const handleMarginChange = (value: number[]) => {
    setMarginSize(value[0]);
    saveSetting("margin", value[0]);
  };

  const handleParagraphSpacingChange = (value: number[]) => {
    setParagraphSpacing(value[0]);
    saveSetting("paragraphSpacing", value[0]);
  };

  const resetAllSettings = () => {
    resetTypography();
    setBrightness(100);
    setFontFamily("system");
    setTextAlign("left");
    setMarginSize(16);
    setParagraphSpacing(1.5);
    localStorage.removeItem("vv_reader_brightness");
    localStorage.removeItem("vv_reader_fontFamily");
    localStorage.removeItem("vv_reader_textAlign");
    localStorage.removeItem("vv_reader_margin");
    localStorage.removeItem("vv_reader_paragraphSpacing");
  };

  // Get current font family for preview
  const currentFontFamily = FONT_FAMILIES.find(f => f.id === fontFamily)?.family || FONT_FAMILIES[0].family;

  return (
    <div className="min-h-screen bg-background">
      <BookReaderHeader
        bookTitle={bookTitle}
        bookSlug={bookSlug}
        cantoNumber={cantoNumber}
        introTitle={t("Налаштування", "Settings")}
      />

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <Accordion type="multiple" defaultValue={["colors", "typography", "elements"]} className="space-y-2">
          {/* Brightness */}
          <AccordionItem value="brightness" className="bg-card rounded-lg border">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <Sun className="h-5 w-5 text-primary" />
                <span className="font-medium">{t("Яскравість", "Brightness")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="flex items-center gap-4">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[brightness]}
                  onValueChange={handleBrightnessChange}
                  min={50}
                  max={150}
                  step={5}
                  className="flex-1"
                />
                <Sun className="h-4 w-4 text-muted-foreground" />
                <span className="w-12 text-sm text-right tabular-nums">{brightness}%</span>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Color Theme */}
          <AccordionItem value="colors" className="bg-card rounded-lg border">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-primary" />
                <span className="font-medium">{t("Кольорова тема", "Color Theme")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-3">
                {COLOR_THEMES.map((colorTheme) => {
                  const Icon = colorTheme.icon;
                  const isActive = theme === colorTheme.id;
                  return (
                    <button
                      key={colorTheme.id}
                      onClick={() => setTheme(colorTheme.id as any)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                        isActive
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div
                        className="w-10 h-10 rounded-lg border flex items-center justify-center"
                        style={{ backgroundColor: colorTheme.bg }}
                      >
                        <Icon className="h-5 w-5" style={{ color: colorTheme.text }} />
                      </div>
                      <span className="font-medium">
                        {language === "ua" ? colorTheme.name : colorTheme.nameEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Typography */}
          <AccordionItem value="typography" className="bg-card rounded-lg border">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <Type className="h-5 w-5 text-primary" />
                <span className="font-medium">{t("Типографіка", "Typography")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              {/* Font Family */}
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  {t("Шрифт", "Font Family")}
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {FONT_FAMILIES.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => handleFontFamilyChange(font.id)}
                      className={cn(
                        "p-2 rounded-lg border text-sm transition-all",
                        fontFamily === font.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                      style={{ fontFamily: font.family }}
                    >
                      {language === "ua" ? font.name : font.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="flex items-center justify-between">
                <Label>{t("Розмір шрифта", "Font Size")}</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={decreaseFont}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-sm tabular-nums">{fontSize}px</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={increaseFont}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Line Height */}
              <div className="flex items-center justify-between">
                <Label>{t("Міжряддя", "Line Height")}</Label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={decreaseLH}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-sm tabular-nums">{lineHeight.toFixed(2)}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={increaseLH}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Text Alignment */}
              <div className="flex items-center justify-between">
                <Label>{t("Вирівнювання", "Alignment")}</Label>
                <div className="flex gap-1">
                  {TEXT_ALIGNMENTS.map((align) => {
                    const Icon = align.icon;
                    return (
                      <Button
                        key={align.id}
                        variant={textAlign === align.id ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleTextAlignChange(align.id)}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Layout */}
          <AccordionItem value="layout" className="bg-card rounded-lg border">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-primary" />
                <span className="font-medium">{t("Розташування", "Layout")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              {/* Margins */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>{t("Відступи", "Margins")}</Label>
                  <span className="text-sm text-muted-foreground">{marginSize}px</span>
                </div>
                <Slider
                  value={[marginSize]}
                  onValueChange={handleMarginChange}
                  min={0}
                  max={48}
                  step={4}
                />
              </div>

              {/* Paragraph Spacing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>{t("Відстань між абзацами", "Paragraph Spacing")}</Label>
                  <span className="text-sm text-muted-foreground">{paragraphSpacing.toFixed(1)}em</span>
                </div>
                <Slider
                  value={[paragraphSpacing]}
                  onValueChange={handleParagraphSpacingChange}
                  min={0.5}
                  max={3}
                  step={0.1}
                />
              </div>

              {/* Flow Mode */}
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t("Суцільний текст", "Continuous Text")}</Label>
                  <p className="text-xs text-muted-foreground">
                    {t("Без рамок між елементами", "No borders between elements")}
                  </p>
                </div>
                <Switch checked={flowMode} onCheckedChange={setFlowMode} />
              </div>

              {/* Mobile Safe Mode */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label>{t("Мобільний режим", "Mobile Mode")}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t("Спрощені ефекти", "Simplified effects")}
                    </p>
                  </div>
                </div>
                <Switch checked={mobileSafeMode} onCheckedChange={setMobileSafeMode} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Text Elements */}
          <AccordionItem value="elements" className="bg-card rounded-lg border">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium">{t("Елементи тексту", "Text Elements")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t("Санскрит (Деванагарі)", "Sanskrit (Devanagari)")}</Label>
                <Switch
                  checked={textDisplaySettings.showSanskrit}
                  onCheckedChange={(v) => setTextDisplaySettings({ ...textDisplaySettings, showSanskrit: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t("Транслітерація", "Transliteration")}</Label>
                <Switch
                  checked={textDisplaySettings.showTransliteration}
                  onCheckedChange={(v) => setTextDisplaySettings({ ...textDisplaySettings, showTransliteration: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t("Послівний переклад", "Synonyms")}</Label>
                <Switch
                  checked={textDisplaySettings.showSynonyms}
                  onCheckedChange={(v) => setTextDisplaySettings({ ...textDisplaySettings, showSynonyms: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t("Літературний переклад", "Translation")}</Label>
                <Switch
                  checked={textDisplaySettings.showTranslation}
                  onCheckedChange={(v) => setTextDisplaySettings({ ...textDisplaySettings, showTranslation: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>{t("Пояснення", "Purport")}</Label>
                <Switch
                  checked={textDisplaySettings.showCommentary}
                  onCheckedChange={(v) => setTextDisplaySettings({ ...textDisplaySettings, showCommentary: v })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Sample Text Preview */}
        <div className="mt-6 bg-card rounded-lg border p-4">
          <Label className="text-sm text-muted-foreground mb-3 block">
            {t("Попередній перегляд", "Preview")}
          </Label>
          <div
            className="p-4 rounded-lg border bg-background"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              fontFamily: currentFontFamily,
              textAlign: textAlign as any,
              filter: `brightness(${brightness}%)`,
              paddingLeft: `${marginSize}px`,
              paddingRight: `${marginSize}px`,
            }}
          >
            <p className="text-muted-foreground italic mb-2" style={{ marginBottom: `${paragraphSpacing}em` }}>
              oṁ ajñāna-timirāndhasya
            </p>
            <p style={{ marginBottom: `${paragraphSpacing}em` }}>
              {language === "ua"
                ? "Я народився в найглибшій темряві невігластва, і мій духовний учитель відкрив мені очі світлом знання. Йому мої шанобливі поклони."
                : "I was born in the darkest ignorance, and my spiritual master opened my eyes with the torch of knowledge. I offer my respectful obeisances unto him."}
            </p>
          </div>
        </div>

        {/* Reset Button */}
        <Button
          variant="outline"
          onClick={resetAllSettings}
          className="w-full mt-6 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {t("Скинути всі налаштування", "Reset All Settings")}
        </Button>
      </main>
    </div>
  );
};

export default BookSettingsPage;
