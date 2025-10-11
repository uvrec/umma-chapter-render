import { useState } from "react";
import { Settings, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const GlobalSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <Settings className="h-6 w-6" />
      </Button>

      {/* Settings Panel */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-80">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle>{t("Налаштування", "Settings")}</SheetTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                {t("Тема оформлення", "Theme")}
              </Label>
              <ThemeToggle />
            </div>

            {/* Language Toggle */}
            <div>
              <Label className="text-base font-semibold mb-3 block">
                {t("Мова інтерфейсу", "Interface Language")}
              </Label>
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
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
