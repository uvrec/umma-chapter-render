import { useEffect } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

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

  const Icon = theme === "craft" ? Palette : theme === "dark" ? Moon : Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Перемикач теми">
          <Icon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Змінити тему</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={6}>
        <DropdownMenuLabel>Тема</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem role="menuitemradio" aria-checked={theme === "light"} onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Світла
        </DropdownMenuItem>
        <DropdownMenuItem role="menuitemradio" aria-checked={theme === "dark"} onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Темна
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem role="menuitemradio" aria-checked={theme === "craft"} onClick={() => setTheme("craft")}>
          <Palette className="mr-2 h-4 w-4" />
          Крафт-папір
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
