// src/components/mobile/SpineSettingsPanel.tsx
// Settings panel for Spine Navigation (Neu Bible-style)
// Панель налаштувань: мова, блоки тексту, про застосунок

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Maximize,
  Smartphone,
  Square,
  Info,
  FileText,
  Shield,
  HelpCircle,
  ChevronRight,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SpineSettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SpineSettingsPanel({ open, onClose }: SpineSettingsPanelProps) {
  const { language, setLanguage, t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();

  const {
    textDisplaySettings,
    setTextDisplaySettings,
    dualLanguageMode,
    setDualLanguageMode,
    mobileSafeMode,
    setMobileSafeMode,
    showVerseContour,
    setShowVerseContour,
    fullscreenMode,
    setFullscreenMode,
    zenMode,
    setZenMode,
  } = useReaderSettings();

  const handleNavigate = (path: string) => {
    navigate(getLocalizedPath(path));
    onClose();
  };

  // About section links
  const aboutLinks = [
    {
      id: "about",
      label: t("Про застосунок", "About"),
      icon: Info,
      path: "/about",
    },
    {
      id: "terms",
      label: t("Умови використання", "Terms of Service"),
      icon: FileText,
      path: "/terms",
    },
    {
      id: "privacy",
      label: t("Політика конфіденційності", "Privacy Policy"),
      icon: Shield,
      path: "/privacy",
    },
    {
      id: "help",
      label: t("Допомога", "Help"),
      icon: HelpCircle,
      path: "/help",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="left"
        className="w-[calc(100%-4rem)] sm:w-80 ml-16 p-0 overflow-y-auto"
      >
        <SheetHeader className="px-4 py-4 border-b">
          <SheetTitle className="text-lg">{t("Налаштування", "Settings")}</SheetTitle>
        </SheetHeader>

        <div className="px-4 py-4 space-y-6">
          {/* Language Selection */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Мова", "Language")}
            </Label>
            <div className="flex gap-2">
              <Button
                variant={language === "uk" ? "default" : "outline"}
                onClick={() => setLanguage("uk")}
                className={cn(
                  "flex-1 h-12",
                  language === "uk" && "bg-brand-500 hover:bg-brand-600"
                )}
              >
                <Globe className="w-4 h-4 mr-2" />
                Українська
              </Button>
              <Button
                variant={language === "en" ? "default" : "outline"}
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex-1 h-12",
                  language === "en" && "bg-brand-500 hover:bg-brand-600"
                )}
              >
                <Globe className="w-4 h-4 mr-2" />
                English
              </Button>
            </div>
          </div>

          <Separator />

          {/* Reading Options */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Читання", "Reading")}
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dual-lang" className="cursor-pointer">
                  {t("Двомовний режим", "Dual Language")}
                </Label>
                <Switch
                  id="dual-lang"
                  checked={dualLanguageMode}
                  onCheckedChange={(v) => setDualLanguageMode(v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="verse-contour" className="cursor-pointer">
                    {t("Контур тексту", "Text Contour")}
                  </Label>
                </div>
                <Switch
                  id="verse-contour"
                  checked={showVerseContour}
                  onCheckedChange={(v) => setShowVerseContour(v)}
                />
              </div>

              <div className="flex items-center justify-between bg-primary/5 p-3 rounded-lg -mx-3">
                <div className="flex items-center gap-2">
                  <Maximize className="h-4 w-4 text-brand-500" />
                  <div>
                    <Label htmlFor="fullscreen" className="cursor-pointer">
                      {t("Повний екран", "Fullscreen")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("Ховає меню", "Hides menus")}
                    </p>
                  </div>
                </div>
                <Switch
                  id="fullscreen"
                  checked={fullscreenMode}
                  onCheckedChange={(v) => setFullscreenMode(v)}
                />
              </div>

              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg -mx-3">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <div>
                    <Label htmlFor="zen" className="cursor-pointer">
                      {t("Zen режим", "Zen Mode")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("Мінімум відволікань", "Minimal distractions")}
                    </p>
                  </div>
                </div>
                <Switch
                  id="zen"
                  checked={zenMode}
                  onCheckedChange={(v) => setZenMode(v)}
                />
              </div>

              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg -mx-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="mobile-safe" className="cursor-pointer">
                      {t("Safe режим", "Safe Mode")}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t("Вимикає blur ефекти", "Disables blur effects")}
                    </p>
                  </div>
                </div>
                <Switch
                  id="mobile-safe"
                  checked={mobileSafeMode}
                  onCheckedChange={(v) => setMobileSafeMode(v)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Text Blocks */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Блоки тексту", "Text Blocks")}
            </Label>
            <div className="space-y-3">
              <RowToggle
                label={t("Санскрит", "Sanskrit")}
                checked={textDisplaySettings.showSanskrit}
                onChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showSanskrit: v }))}
              />
              <RowToggle
                label={t("Транслітерація", "Transliteration")}
                checked={textDisplaySettings.showTransliteration}
                onChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showTransliteration: v }))}
              />
              <RowToggle
                label={t("Послівний переклад", "Synonyms")}
                checked={textDisplaySettings.showSynonyms}
                onChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showSynonyms: v }))}
              />
              <RowToggle
                label={t("Переклад", "Translation")}
                checked={textDisplaySettings.showTranslation}
                onChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showTranslation: v }))}
              />
              <RowToggle
                label={t("Пояснення", "Commentary")}
                checked={textDisplaySettings.showCommentary}
                onChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showCommentary: v }))}
              />
            </div>
          </div>

          <Separator />

          {/* About Section */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Про застосунок", "About")}
            </Label>
            <div className="space-y-1">
              {aboutLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavigate(link.path)}
                    className="w-full flex items-center justify-between px-2 py-3
                      hover:bg-muted/50 active:bg-muted rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <span>{link.label}</span>
                    </span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center text-xs text-muted-foreground pt-4">
            <p>VedaVoice v{import.meta.env.VITE_APP_VERSION || "1.0.0"}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function RowToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="cursor-pointer">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default SpineSettingsPanel;
