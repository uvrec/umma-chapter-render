// ThemeToggle.tsx
import { useEffect } from "react";
import { Moon, Sun, Palette, Snowflake, Eye, Globe, Settings, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";
import { useLanguageSwitch } from "@/hooks/useLanguageSwitch";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { language, switchLanguage, t } = useLanguageSwitch();

  // Cmd/Ctrl+J → light/dark, Cmd/Ctrl+Shift+J → craft
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "j" && !e.shiftKey) {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      } else if (k === "j" && e.shiftKey) {
        e.preventDefault();
        setTheme("craft");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [theme, setTheme]);

  // All available themes
  const themes = [
    { id: "light" as const, label: t("Світла", "Light"), icon: Sun },
    { id: "dark" as const, label: t("Темна", "Dark"), icon: Moon },
    { id: "craft" as const, label: t("Крафт", "Craft"), icon: Palette },
    { id: "sepia" as const, label: t("Сепія", "Sepia"), icon: Palette },
    { id: "solarized-light" as const, label: "Solarized Light", icon: Sun },
    { id: "solarized-dark" as const, label: "Solarized Dark", icon: Moon },
    { id: "nord" as const, label: "Nord", icon: Snowflake },
    { id: "high-contrast" as const, label: t("Контраст", "High Contrast"), icon: Eye },
  ];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={t("Налаштування", "Settings")}>
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("Налаштування", "Settings")}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={6} className="w-48 z-[100]">
        {/* Theme submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Palette className="mr-2 h-4 w-4" />
            {t("Тема", "Theme")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="z-[100]">
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              return (
                <DropdownMenuItem
                  key={themeOption.id}
                  role="menuitemradio"
                  aria-checked={theme === themeOption.id}
                  onClick={() => setTheme(themeOption.id)}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center">
                    <Icon className="mr-2 h-4 w-4" />
                    {themeOption.label}
                  </span>
                  {theme === themeOption.id && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Language submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe className="mr-2 h-4 w-4" />
            {t("Мова", "Language")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="z-[100]">
            <DropdownMenuItem
              role="menuitemradio"
              aria-checked={language === "uk"}
              onClick={() => switchLanguage("uk")}
              className="flex items-center justify-between"
            >
              <span>Українська</span>
              {language === "uk" && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              role="menuitemradio"
              aria-checked={language === "en"}
              onClick={() => switchLanguage("en")}
              className="flex items-center justify-between"
            >
              <span>English</span>
              {language === "en" && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
