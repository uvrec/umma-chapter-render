// src/contexts/SpineThemeContext.tsx
// Spine controls switching between app themes via vertical swipe
// The Spine gradient visually indicates the current theme

import { createContext, useContext, ReactNode } from "react";
import { useTheme } from "@/components/ThemeProvider";

// App themes available via Spine swipe (order matters for swipe cycling)
const APP_THEMES = [
  "craft",           // Default - craft paper
  "sepia",           // Sepia/parchment
  "light",           // Clean light
  "solarized-light", // Solarized light
  "dark",            // Dark mode
  "solarized-dark",  // Solarized dark
  "nord",            // Nord theme
  "high-contrast",   // High contrast
] as const;

type AppTheme = typeof APP_THEMES[number];

// Visual gradient for Spine based on theme
export const THEME_GRADIENTS: Record<AppTheme, string> = {
  "craft": "from-amber-400 via-orange-500 to-red-500",
  "sepia": "from-amber-300 via-yellow-400 to-orange-400",
  "light": "from-slate-300 via-gray-400 to-slate-500",
  "solarized-light": "from-yellow-300 via-amber-400 to-orange-500",
  "dark": "from-slate-600 via-gray-700 to-slate-800",
  "solarized-dark": "from-cyan-600 via-teal-700 to-slate-800",
  "nord": "from-blue-400 via-indigo-500 to-slate-600",
  "high-contrast": "from-yellow-400 via-orange-500 to-red-600",
};

interface SpineThemeContextType {
  /** Current app theme */
  appTheme: AppTheme;
  /** Gradient class for Spine visual */
  gradient: string;
  /** Index in APP_THEMES array */
  themeIndex: number;
  /** Switch to next theme */
  nextTheme: () => void;
  /** Switch to previous theme */
  prevTheme: () => void;
  /** Set specific theme by index */
  setThemeIndex: (index: number) => void;
}

const SpineThemeContext = createContext<SpineThemeContextType | undefined>(undefined);

export function SpineThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();

  // Find current theme index
  const themeIndex = APP_THEMES.indexOf(theme as AppTheme);
  const safeIndex = themeIndex >= 0 ? themeIndex : 0;

  const setThemeIndex = (index: number) => {
    const normalizedIndex = ((index % APP_THEMES.length) + APP_THEMES.length) % APP_THEMES.length;
    setTheme(APP_THEMES[normalizedIndex]);
  };

  const nextTheme = () => {
    setThemeIndex(safeIndex + 1);
  };

  const prevTheme = () => {
    setThemeIndex(safeIndex - 1);
  };

  const gradient = THEME_GRADIENTS[theme as AppTheme] || THEME_GRADIENTS.craft;

  return (
    <SpineThemeContext.Provider
      value={{
        appTheme: theme as AppTheme,
        gradient,
        themeIndex: safeIndex,
        nextTheme,
        prevTheme,
        setThemeIndex,
      }}
    >
      {children}
    </SpineThemeContext.Provider>
  );
}

export function useSpineTheme() {
  const context = useContext(SpineThemeContext);
  if (!context) {
    // Return default if not in provider
    return {
      appTheme: "craft" as AppTheme,
      gradient: THEME_GRADIENTS.craft,
      themeIndex: 0,
      nextTheme: () => {},
      prevTheme: () => {},
      setThemeIndex: () => {},
    };
  }
  return context;
}

// Export for SpineNavigation to use
export { APP_THEMES, type AppTheme };
