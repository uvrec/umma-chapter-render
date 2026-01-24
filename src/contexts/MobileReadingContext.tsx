// src/contexts/MobileReadingContext.tsx
// Контекст для управління мобільним режимом читання
// Fullscreen mode, пошук через подвійний тап

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface TranslationTooltip {
  visible: boolean;
  text: string;
  position: { x: number; y: number };
}

interface MobileReadingContextValue {
  /** Is fullscreen reading mode active (Spine hidden) */
  isFullscreen: boolean;
  /** Toggle fullscreen mode */
  toggleFullscreen: () => void;
  /** Enter fullscreen mode */
  enterFullscreen: () => void;
  /** Exit fullscreen mode */
  exitFullscreen: () => void;
  /** Should search panel open */
  shouldOpenSearch: boolean;
  /** Trigger search panel open */
  triggerSearch: () => void;
  /** Reset search trigger */
  resetSearchTrigger: () => void;
  /** Selected text for search */
  selectedText: string;
  /** Set selected text */
  setSelectedText: (text: string) => void;
  /** Translation tooltip state */
  tooltip: TranslationTooltip;
  /** Show translation tooltip */
  showTooltip: (text: string, position: { x: number; y: number }) => void;
  /** Hide translation tooltip */
  hideTooltip: () => void;
}

const MobileReadingContext = createContext<MobileReadingContextValue | null>(null);

interface MobileReadingProviderProps {
  children: ReactNode;
}

export function MobileReadingProvider({ children }: MobileReadingProviderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shouldOpenSearch, setShouldOpenSearch] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [tooltip, setTooltip] = useState<TranslationTooltip>({
    visible: false,
    text: "",
    position: { x: 0, y: 0 },
  });

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const enterFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const exitFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  const triggerSearch = useCallback(() => {
    setShouldOpenSearch(true);
  }, []);

  const resetSearchTrigger = useCallback(() => {
    setShouldOpenSearch(false);
  }, []);

  const showTooltip = useCallback((text: string, position: { x: number; y: number }) => {
    setTooltip({ visible: true, text, position });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <MobileReadingContext.Provider
      value={{
        isFullscreen,
        toggleFullscreen,
        enterFullscreen,
        exitFullscreen,
        shouldOpenSearch,
        triggerSearch,
        resetSearchTrigger,
        selectedText,
        setSelectedText,
        tooltip,
        showTooltip,
        hideTooltip,
      }}
    >
      {children}
    </MobileReadingContext.Provider>
  );
}

export function useMobileReading() {
  const context = useContext(MobileReadingContext);
  if (!context) {
    // Return default values for non-mobile or when context isn't available
    return {
      isFullscreen: false,
      toggleFullscreen: () => {},
      enterFullscreen: () => {},
      exitFullscreen: () => {},
      shouldOpenSearch: false,
      triggerSearch: () => {},
      resetSearchTrigger: () => {},
      selectedText: "",
      setSelectedText: () => {},
      tooltip: { visible: false, text: "", position: { x: 0, y: 0 } },
      showTooltip: () => {},
      hideTooltip: () => {},
    };
  }
  return context;
}
