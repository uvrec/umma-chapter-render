/**
 * ContentToolbar - Shared toolbar for Letters, Lectures, and Blog posts
 *
 * Provides reader-like functionality:
 * - Share content
 * - Copy link / Copy content with link
 * - Dual language mode toggle
 * - Zen mode
 * - Fullscreen mode
 * - Settings panel
 * - Keyboard shortcuts
 */

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Share2,
  Link as LinkIcon,
  Copy,
  BookOpen,
  Leaf,
  Maximize2,
  Minimize2,
  Settings,
  Keyboard,
  Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { GlobalSettingsPanel } from "@/components/GlobalSettingsPanel";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface ContentToolbarProps {
  /** Title of the content for sharing */
  title: string;
  /** Content type for formatting */
  contentType: "letter" | "lecture" | "blog";
  /** Optional excerpt for sharing */
  excerpt?: string;
  /** Callback for custom share action */
  onShare?: () => void;
  /** Callback for custom copy action */
  onCopy?: () => void;
  /** Show on mobile (default: false) */
  showOnMobile?: boolean;
  /** Custom class name */
  className?: string;
  /** Edit URL - shows edit button when provided (admin only) */
  editUrl?: string;
}

export const ContentToolbar = ({
  title,
  contentType,
  excerpt,
  onShare,
  onCopy,
  showOnMobile = false,
  className = "",
  editUrl,
}: ContentToolbarProps) => {
  const { language } = useLanguage();
  const {
    dualLanguageMode,
    setDualLanguageMode,
    zenMode,
    setZenMode,
    fullscreenMode,
    setFullscreenMode,
  } = useReaderSettings();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [copied, setCopied] = useState(false);

  // Content type labels
  const contentTypeLabels = {
    letter: { uk: "Лист", en: "Letter" },
    lecture: { uk: "Лекція", en: "Lecture" },
    blog: { uk: "Стаття", en: "Article" },
  };

  const contentLabel = contentTypeLabels[contentType][language] || contentTypeLabels[contentType].en;

  // Handle share
  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }

    const shareData = {
      title,
      text: excerpt || title,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(language === "uk" ? "Посилання скопійовано" : "Link copied");
      }
    } catch (error) {
      // User cancelled or error
      if ((error as Error).name !== "AbortError") {
        console.error("Share error:", error);
      }
    }
  };

  // Handle copy URL
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success(language === "uk" ? "Посилання скопійовано" : "Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error(language === "uk" ? "Помилка копіювання" : "Copy failed");
    }
  };

  // Handle copy with link
  const handleCopyWithLink = async () => {
    if (onCopy) {
      onCopy();
      return;
    }

    const text = `${contentLabel}: ${title}\n\n${window.location.href}`;

    try {
      await navigator.clipboard.writeText(text);
      toast.success(language === "uk" ? "Скопійовано з посиланням" : "Copied with link");
    } catch (error) {
      toast.error(language === "uk" ? "Помилка копіювання" : "Copy failed");
    }
  };

  // Toggle dual language mode
  const toggleDualLanguage = () => {
    setDualLanguageMode(!dualLanguageMode);
    toast.success(
      dualLanguageMode
        ? language === "uk" ? "Одномовний режим" : "Single language mode"
        : language === "uk" ? "Двомовний режим" : "Dual language mode"
    );
  };

  // Toggle zen mode
  const toggleZenMode = () => {
    setZenMode(!zenMode);
  };

  // Toggle fullscreen mode
  const toggleFullscreenMode = () => {
    setFullscreenMode(!fullscreenMode);
  };

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if in input/textarea
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    // Ignore if modifier keys are pressed (except for some shortcuts)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case "d":
        e.preventDefault();
        toggleDualLanguage();
        break;
      case "z":
        e.preventDefault();
        toggleZenMode();
        break;
      case "f":
        e.preventDefault();
        toggleFullscreenMode();
        break;
      case "?":
        e.preventDefault();
        setShowKeyboardShortcuts(true);
        break;
      case "escape":
        if (zenMode) {
          setZenMode(false);
        }
        if (fullscreenMode) {
          setFullscreenMode(false);
        }
        break;
    }
  }, [dualLanguageMode, zenMode, fullscreenMode]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Keyboard shortcuts config for modal
  const shortcuts = [
    { key: "D", description: language === "uk" ? "Двомовний режим" : "Dual language mode", handler: toggleDualLanguage, category: "modes" as const },
    { key: "Z", description: language === "uk" ? "Режим зен" : "Zen mode", handler: toggleZenMode, category: "modes" as const },
    { key: "F", description: language === "uk" ? "Повний екран" : "Fullscreen", handler: toggleFullscreenMode, category: "modes" as const },
    { key: "?", description: language === "uk" ? "Показати шорткати" : "Show shortcuts", handler: () => setShowKeyboardShortcuts(true), category: "help" as const },
    { key: "Escape", description: language === "uk" ? "Вийти з режиму" : "Exit mode", handler: () => { setZenMode(false); setFullscreenMode(false); }, category: "help" as const },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <div className={`flex items-center gap-1 ${showOnMobile ? "" : "hidden md:flex"} ${className}`}>
        {/* Edit (admin only) */}
        {editUrl && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link to={editUrl}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {language === "uk" ? "Редагувати" : "Edit"}
              </TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="h-6 mx-1" />
          </>
        )}

        {/* Share */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {language === "uk" ? "Поділитися" : "Share"}
          </TooltipContent>
        </Tooltip>

        {/* Copy Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleCopyUrl}>
              <LinkIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {language === "uk" ? "Копіювати посилання" : "Copy link"}
          </TooltipContent>
        </Tooltip>

        {/* Copy with Link */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleCopyWithLink}>
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {language === "uk" ? "Копіювати з посиланням" : "Copy with link"}
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Dual Language Mode */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={dualLanguageMode ? "secondary" : "ghost"}
              size="icon"
              onClick={toggleDualLanguage}
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {language === "uk" ? "Двомовний режим (D)" : "Dual language (D)"}
          </TooltipContent>
        </Tooltip>

        {/* Zen Mode - desktop only */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={zenMode ? "secondary" : "ghost"}
              size="icon"
              onClick={toggleZenMode}
              className="hidden md:inline-flex"
            >
              <Leaf className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {language === "uk" ? "Режим зен (Z)" : "Zen mode (Z)"}
          </TooltipContent>
        </Tooltip>

        {/* Fullscreen Mode - desktop only */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={fullscreenMode ? "secondary" : "ghost"}
              size="icon"
              onClick={toggleFullscreenMode}
              className="hidden md:inline-flex"
            >
              {fullscreenMode ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {language === "uk" ? "Повний екран (F)" : "Fullscreen (F)"}
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Keyboard Shortcuts */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowKeyboardShortcuts(true)}
            >
              <Keyboard className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {language === "uk" ? "Клавіатурні скорочення (?)" : "Keyboard shortcuts (?)"}
          </TooltipContent>
        </Tooltip>

        {/* Settings */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {language === "uk" ? "Налаштування" : "Settings"}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Settings Panel */}
      <GlobalSettingsPanel isOpen={settingsOpen} onOpenChange={setSettingsOpen} showFloatingButton={false} />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
        shortcuts={shortcuts}
      />
    </TooltipProvider>
  );
};

export default ContentToolbar;
