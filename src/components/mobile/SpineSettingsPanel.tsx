// src/components/mobile/SpineSettingsPanel.tsx
// Settings panel for Spine Navigation (Neu Bible-style)
// Панель налаштувань: нагадування, читання, книги, про нас, контакти

import { useState, useRef, useEffect, useCallback } from "react";
// Sheet replaced with custom implementation for Spine offset support
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useReaderSettings } from "@/hooks/useReaderSettings";
import { useNavigate } from "react-router-dom";
import {
  Info,
  ChevronRight,
  Check,
  X,
  MessageCircle,
  Lock,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Heart,
  Wallet,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SpineSettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

// Book/Translation source definitions for VedaVoice
// Books can be: available (free/owned) or purchasable (with price)
const BOOK_SOURCES = [
  {
    id: "prabhupada-uk",
    title_uk: "Прабгупада солов'їною",
    title_en: "Prabhupada in Ukrainian",
    description_uk: "Офіційний український переклад творів Шріли Прабгупади. Безкоштовно для всіх читачів.",
    description_en: "Official Ukrainian translation of Srila Prabhupada's works. Free for all readers.",
    coverImage: "/images/books/prabhupada-uk-cover.jpg",
    bgColor: "bg-gradient-to-br from-amber-600 to-orange-700",
    available: true,
    price: null,
  },
  {
    id: "prabhupada-en",
    title_uk: "Оригінал (English)",
    title_en: "Original (English)",
    description_uk: "Оригінальні твори Шріли Прабгупади англійською мовою - класичні переклади BBT.",
    description_en: "Original works by Srila Prabhupada in English - classic BBT translations.",
    coverImage: "/images/books/prabhupada-en-cover.jpg",
    bgColor: "bg-gradient-to-br from-slate-700 to-slate-900",
    available: true,
    price: null,
  },
  {
    id: "original-1972",
    title_uk: "Оригінал 1972",
    title_en: "Original 1972 Edition",
    description_uk: "Оригінальне видання Бгаґавад-ґіти 1972 року, надруковане за життя Шріли Прабгупади.",
    description_en: "Original 1972 Bhagavad-gita edition, printed during Srila Prabhupada's lifetime.",
    coverImage: "/images/books/bg-1972-cover.jpg",
    bgColor: "bg-gradient-to-br from-red-800 to-red-950",
    available: false,
    price: "4.99 €",
    purchaseUrl: "https://store.krishna.org.ua/bg-1972",
  },
  {
    id: "visvanatha",
    title_uk: "Вішванатха Чакраварті",
    title_en: "Visvanatha Chakravarti",
    description_uk: "Коментарі Шріли Вішванатхи Чакраварті Тгакура до Бгаґавад-ґіти та Шрімад-Бгаґаватам.",
    description_en: "Commentaries by Srila Visvanatha Chakravarti Thakura on Bhagavad-gita and Srimad-Bhagavatam.",
    coverImage: "/images/books/visvanatha-cover.jpg",
    bgColor: "bg-gradient-to-br from-purple-700 to-indigo-900",
    available: false,
    price: "6.99 €",
    purchaseUrl: "https://store.krishna.org.ua/visvanatha",
  },
  {
    id: "baladeva",
    title_uk: "Баладева Відьябгушана",
    title_en: "Baladeva Vidyabhusana",
    description_uk: "Ґовінда-бгаш'я - коментар Шріли Баладеви Відьябгушани до Веданта-сутри.",
    description_en: "Govinda-bhashya - Srila Baladeva Vidyabhusana's commentary on Vedanta-sutra.",
    coverImage: "/images/books/baladeva-cover.jpg",
    bgColor: "bg-gradient-to-br from-teal-700 to-cyan-900",
    available: false,
    price: "5.99 €",
    purchaseUrl: "https://store.krishna.org.ua/baladeva",
  },
] as const;

// Reading reminders localStorage key
const REMINDERS_STORAGE_KEY = "vv_reading_reminders";

type ReminderSettings = {
  enabled: boolean;
  days: boolean[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  time: string; // "HH:MM" format
};

const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  days: [false, true, true, true, true, true, false], // Mon-Fri by default
  time: "07:00",
};

function loadReminders(): ReminderSettings {
  try {
    const saved = localStorage.getItem(REMINDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
  } catch {
    return DEFAULT_REMINDERS;
  }
}

function saveReminders(settings: ReminderSettings) {
  try {
    localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

// Social + Support links for contact section
const EXTERNAL_LINKS = [
  {
    id: "telegram",
    label: "Telegram",
    icon: Send,
    url: "https://t.me/prabhupada_ua",
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/prabhupada.ua",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: Instagram,
    url: "https://instagram.com/prabhupada_ua",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/@prabhupada_ua",
  },
  {
    id: "paypal",
    label: "PayPal",
    icon: Wallet,
    url: "https://paypal.me/andriiuvarov",
  },
  {
    id: "monobank",
    label: "Monobank",
    icon: Building2,
    url: "https://send.monobank.ua/jar/YAmYDYgti",
  },
];

export function SpineSettingsPanel({ open, onClose }: SpineSettingsPanelProps) {
  const { language, setLanguage, t, getLocalizedPath } = useLanguage();
  const navigate = useNavigate();
  const [showBooksModal, setShowBooksModal] = useState(false);
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const [showRemindersSheet, setShowRemindersSheet] = useState(false);
  const [reminders, setReminders] = useState<ReminderSettings>(loadReminders);
  const [activeBookId, setActiveBookId] = useState("prabhupada-uk");
  const carouselRef = useRef<HTMLDivElement>(null);

  const {
    showNumbers,
    setShowNumbers,
    textDisplaySettings,
    setTextDisplaySettings,
    dualLanguageMode,
    setDualLanguageMode,
  } = useReaderSettings();

  const handleNavigate = (path: string) => {
    navigate(getLocalizedPath(path));
    onClose();
  };

  const handleSelectBook = (id: string) => {
    const book = BOOK_SOURCES.find(b => b.id === id);
    if (book?.available) {
      setActiveBookId(id);
    }
  };

  const handleBookCardClick = (index: number) => {
    setSelectedBookIndex(index);
    setShowBooksModal(true);
  };

  const handleRemindersToggle = (enabled: boolean) => {
    if (enabled) {
      setShowRemindersSheet(true);
    } else {
      const newSettings = { ...reminders, enabled: false };
      setReminders(newSettings);
      saveReminders(newSettings);
    }
  };

  const handleSaveReminders = (settings: ReminderSettings) => {
    setReminders(settings);
    saveReminders(settings);
    setShowRemindersSheet(false);
  };

  const handlePurchase = (url: string) => {
    window.open(url, "_blank");
  };

  if (!open) return null;

  return (
    <>
      {/* Custom overlay - starts after Spine */}
      <div
        className="fixed inset-0 left-14 z-[50] bg-black/80 animate-in fade-in-0 duration-300"
        onClick={onClose}
      />

      {/* Custom panel content - starts after Spine */}
      <div
        className={cn(
          "fixed inset-y-0 left-14 z-[60] w-[calc(100%-56px)] sm:w-80",
          "bg-background shadow-lg",
          "animate-in slide-in-from-left duration-300",
          "overflow-y-auto"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-lg font-semibold">{t("Налаштування", "Settings")}</h2>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="px-4 py-4 space-y-6">
          {/* 0. GENERAL Section - Reading Reminders */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Загальне", "General")}
            </Label>
            <div className="flex items-center justify-between">
              <Label htmlFor="reading-reminders" className="cursor-pointer">
                {t("Час читати", "Reading Time")}
              </Label>
              <Switch
                id="reading-reminders"
                checked={reminders.enabled}
                onCheckedChange={handleRemindersToggle}
              />
            </div>
            {reminders.enabled && (
              <button
                onClick={() => setShowRemindersSheet(true)}
                className="text-sm text-muted-foreground mt-2 hover:text-foreground"
              >
                {reminders.days.filter(Boolean).length > 0
                  ? `${reminders.time} • ${reminders.days.filter(Boolean).length} ${t("днів", "days")}`
                  : t("Налаштувати", "Configure")}
              </button>
            )}
          </div>

          <Separator />

          {/* LANGUAGE Section */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Мова", "Language")}
            </Label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("uk")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                  language === "uk"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                Українська
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                  language === "en"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                English
              </button>
            </div>
          </div>

          <Separator />

          {/* READING Section */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Читання", "Reading")}
            </Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="verse-numbers" className="cursor-pointer">
                  {t("Номери віршів", "Verse Numbers")}
                </Label>
                <Switch
                  id="verse-numbers"
                  checked={showNumbers}
                  onCheckedChange={(v) => setShowNumbers(v)}
                />
              </div>
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
            </div>
          </div>

          <Separator />

          {/* TEXT BLOCKS Section */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Блоки тексту", "Text Blocks")}
            </Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-sanskrit" className="cursor-pointer">
                  {t("Санскрит", "Sanskrit")}
                </Label>
                <Switch
                  id="show-sanskrit"
                  checked={textDisplaySettings.showSanskrit}
                  onCheckedChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showSanskrit: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-translit" className="cursor-pointer">
                  {t("Транслітерація", "Transliteration")}
                </Label>
                <Switch
                  id="show-translit"
                  checked={textDisplaySettings.showTransliteration}
                  onCheckedChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showTransliteration: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-synonyms" className="cursor-pointer">
                  {t("Послівний переклад", "Synonyms")}
                </Label>
                <Switch
                  id="show-synonyms"
                  checked={textDisplaySettings.showSynonyms}
                  onCheckedChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showSynonyms: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-translation" className="cursor-pointer">
                  {t("Переклад", "Translation")}
                </Label>
                <Switch
                  id="show-translation"
                  checked={textDisplaySettings.showTranslation}
                  onCheckedChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showTranslation: v }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="show-commentary" className="cursor-pointer">
                  {t("Коментар", "Commentary")}
                </Label>
                <Switch
                  id="show-commentary"
                  checked={textDisplaySettings.showCommentary}
                  onCheckedChange={(v) => setTextDisplaySettings(prev => ({ ...prev, showCommentary: v }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* 3. BOOKS Section - Translations/Books Carousel */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Книги", "Books")}
            </Label>

            {/* See All Books link */}
            <button
              onClick={() => setShowBooksModal(true)}
              className="text-brand-500 font-medium mb-4 hover:underline"
            >
              {t("Всі книги", "See All Books")}
            </button>

            {/* Horizontal carousel of book covers */}
            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {BOOK_SOURCES.map((book, index) => {
                const isActive = activeBookId === book.id;
                return (
                  <button
                    key={book.id}
                    onClick={() => handleBookCardClick(index)}
                    className={cn(
                      "flex-shrink-0 w-28 h-40 rounded-lg overflow-hidden relative",
                      "transition-transform active:scale-95",
                      book.bgColor,
                      "shadow-md"
                    )}
                    style={{ scrollSnapAlign: "start" }}
                  >
                    {/* Book cover or placeholder */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2">
                      <span className="text-[10px] font-medium text-center leading-tight">
                        {language === "uk" ? book.title_uk : book.title_en}
                      </span>
                    </div>

                    {/* Active indicator or Lock icon */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      {isActive ? (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : !book.available ? (
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white/70" />
                        </div>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* 4. ABOUT Section */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Про нас", "About")}
            </Label>
            <div className="space-y-1">
              <button
                onClick={() => handleNavigate("/about")}
                className="w-full flex items-center justify-between px-2 py-3
                  hover:bg-muted/50 active:bg-muted rounded-lg transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <span>{t("Про «Прабгупада солов'їною»", "About the Project")}</span>
                </span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <Separator />

          {/* 5. CONTACT & SUPPORT Section - 2-column icon grid */}
          <div>
            <Label className="text-sm font-medium text-muted-foreground mb-3 block uppercase tracking-wide">
              {t("Зв'язок і підтримка", "Contact & Support")}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {EXTERNAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-3
                      hover:bg-muted/50 active:bg-muted rounded-lg transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  </a>
                );
              })}

              {/* Direct message button */}
              <button
                onClick={() => handleNavigate("/contact")}
                className="flex items-center justify-center p-3
                  hover:bg-muted/50 active:bg-muted rounded-lg transition-colors"
                aria-label={t("Написати нам", "Write to Us")}
              >
                <MessageCircle className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Version Info */}
          <div className="text-center text-xs text-muted-foreground pt-4">
            <p>VedaVoice v{import.meta.env.VITE_APP_VERSION || "1.0.0"}</p>
          </div>
        </div>
      </div>

      {/* Full-screen Books Carousel Modal */}
      {showBooksModal && (
        <BooksCarouselModal
          open={showBooksModal}
          onClose={() => setShowBooksModal(false)}
          books={BOOK_SOURCES}
          initialIndex={selectedBookIndex}
          activeId={activeBookId}
          onSelect={handleSelectBook}
          onPurchase={handlePurchase}
          language={language}
        />
      )}

      {/* Reading Reminders Sheet */}
      {showRemindersSheet && (
        <ReadingRemindersSheet
          open={showRemindersSheet}
          onClose={() => setShowRemindersSheet(false)}
          initialSettings={reminders}
          onSave={handleSaveReminders}
          language={language}
        />
      )}
    </>
  );
}

// Full-screen Books carousel modal (like Neu Bible)
interface BooksCarouselModalProps {
  open: boolean;
  onClose: () => void;
  books: typeof BOOK_SOURCES;
  initialIndex: number;
  activeId: string;
  onSelect: (id: string) => void;
  onPurchase: (url: string) => void;
  language: "uk" | "en";
}

function BooksCarouselModal({
  open,
  onClose,
  books,
  initialIndex,
  activeId,
  onSelect,
  onPurchase,
  language,
}: BooksCarouselModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const currentBook = books[currentIndex];
  const isActive = activeId === currentBook.id;
  const isAvailable = currentBook.available;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && currentIndex < books.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (deltaX < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }

    touchStartX.current = null;
  };

  const handleSelect = () => {
    if (isAvailable) {
      onSelect(currentBook.id);
      onClose();
    } else if ("purchaseUrl" in currentBook && currentBook.purchaseUrl) {
      onPurchase(currentBook.purchaseUrl);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      {/* Carousel area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center px-8"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous card preview */}
        {currentIndex > 0 && (
          <div
            className={cn(
              "absolute left-2 w-16 h-24 rounded-lg opacity-40",
              books[currentIndex - 1].bgColor
            )}
          />
        )}

        {/* Current card */}
        <div className="flex flex-col items-center max-w-xs">
          <div
            className={cn(
              "w-44 h-64 rounded-xl shadow-2xl flex items-center justify-center text-white p-4",
              currentBook.bgColor
            )}
          >
            <span className="text-sm font-medium text-center leading-tight opacity-80">
              {language === "uk" ? currentBook.title_uk : currentBook.title_en}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-white text-xl font-semibold mt-6 text-center italic">
            {language === "uk" ? currentBook.title_uk : currentBook.title_en}
          </h2>

          {/* Description */}
          <p className="text-white/70 text-sm text-center mt-3 px-4 leading-relaxed">
            {language === "uk" ? currentBook.description_uk : currentBook.description_en}
          </p>

          {/* Action button: Select (if available/active) or Buy (if not available) */}
          <div className="mt-6">
            {isActive ? (
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            ) : isAvailable ? (
              <button
                onClick={handleSelect}
                className="px-6 py-2 border border-white/30 rounded-full text-white/80
                  hover:bg-white/10 transition-colors"
              >
                {language === "uk" ? "Обрати" : "Select"}
              </button>
            ) : (
              <button
                onClick={handleSelect}
                className="px-6 py-2 border border-white/30 rounded-full text-white/80
                  hover:bg-white/10 transition-colors"
              >
                {currentBook.price}
              </button>
            )}
          </div>
        </div>

        {/* Next card preview */}
        {currentIndex < books.length - 1 && (
          <div
            className={cn(
              "absolute right-2 w-16 h-24 rounded-lg opacity-40",
              books[currentIndex + 1].bgColor
            )}
          />
        )}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 pb-4">
        {books.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-colors",
              index === currentIndex ? "bg-white" : "bg-white/30"
            )}
          />
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white"
      >
        <X className="w-8 h-8" />
      </button>
    </div>
  );
}

// Reading Reminders Sheet (swipe up from bottom)
interface ReadingRemindersSheetProps {
  open: boolean;
  onClose: () => void;
  initialSettings: ReminderSettings;
  onSave: (settings: ReminderSettings) => void;
  language: "uk" | "en";
}

const DAYS_SHORT = {
  uk: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
};

// iOS-style 3D Drum Time Picker
interface TimePickerModalProps {
  open: boolean;
  onClose: () => void;
  initialTime: string; // "HH:MM" format
  onSelect: (time: string) => void;
}

const ITEM_HEIGHT = 44; // Height of each item in the drum
const VISIBLE_ITEMS = 5; // Number of visible items
const DRUM_RADIUS = (ITEM_HEIGHT * VISIBLE_ITEMS) / Math.PI; // Radius for 3D effect

// Generate hours array (00-23)
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
// Generate minutes array (00-59)
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

interface DrumColumnProps {
  items: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
}

function DrumColumn({ items, selectedIndex, onIndexChange }: DrumColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef(false);
  const [scrollOffset, setScrollOffset] = useState(0);

  // Initialize scroll position
  useEffect(() => {
    if (containerRef.current && !isScrollingRef.current) {
      const targetScroll = selectedIndex * ITEM_HEIGHT;
      containerRef.current.scrollTop = targetScroll;
      setScrollOffset(targetScroll);
    }
  }, [selectedIndex]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollOffset(scrollTop);
    isScrollingRef.current = true;

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Snap to nearest item after scrolling stops
    scrollTimeoutRef.current = setTimeout(() => {
      const nearestIndex = Math.round(scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(nearestIndex, items.length - 1));

      if (containerRef.current) {
        containerRef.current.scrollTo({
          top: clampedIndex * ITEM_HEIGHT,
          behavior: "smooth",
        });
      }

      onIndexChange(clampedIndex);
      isScrollingRef.current = false;
    }, 100);
  }, [items.length, onIndexChange]);

  // Calculate 3D transform for each item based on its position
  const getItemStyle = (index: number): React.CSSProperties => {
    const itemCenter = index * ITEM_HEIGHT + ITEM_HEIGHT / 2;
    const viewCenter = scrollOffset + (VISIBLE_ITEMS * ITEM_HEIGHT) / 2;
    const distance = itemCenter - viewCenter;

    // Calculate rotation angle (items rotate around X axis)
    const rotationAngle = (distance / DRUM_RADIUS) * (180 / Math.PI) * 0.8;

    // Calculate translateZ for depth effect
    const absRotation = Math.abs(rotationAngle);
    const translateZ = Math.cos(absRotation * Math.PI / 180) * 20 - 20;

    // Calculate opacity based on distance from center
    const normalizedDistance = Math.abs(distance) / (ITEM_HEIGHT * 2.5);
    const opacity = Math.max(0.2, 1 - normalizedDistance * 0.5);

    // Calculate scale for depth illusion
    const scale = Math.max(0.7, 1 - Math.abs(rotationAngle) / 200);

    // Clamp rotation to prevent items from flipping
    const clampedRotation = Math.max(-70, Math.min(70, rotationAngle));

    return {
      transform: `perspective(200px) rotateX(${-clampedRotation}deg) translateZ(${translateZ}px) scale(${scale})`,
      opacity,
      transition: isScrollingRef.current ? "none" : "all 0.1s ease-out",
    };
  };

  return (
    <div className="relative h-[220px] w-[80px] overflow-hidden">
      {/* Selection indicator - center highlight */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[44px] bg-white/10 rounded-lg pointer-events-none z-10"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(255,255,255,0.1)" }}
      />

      {/* Gradient overlays for fade effect */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#2a2a2e] to-transparent pointer-events-none z-20" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#2a2a2e] to-transparent pointer-events-none z-20" />

      {/* Scrollable drum container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto scrollbar-hide"
        onScroll={handleScroll}
        style={{
          scrollSnapType: "y mandatory",
          perspective: "200px",
          perspectiveOrigin: "center center",
        }}
      >
        {/* Padding items at top */}
        <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />

        {items.map((item, index) => (
          <div
            key={index}
            className="h-[44px] flex items-center justify-center text-white text-2xl font-light select-none"
            style={{
              ...getItemStyle(index),
              scrollSnapAlign: "center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
            onClick={() => {
              if (containerRef.current) {
                containerRef.current.scrollTo({
                  top: index * ITEM_HEIGHT,
                  behavior: "smooth",
                });
                onIndexChange(index);
              }
            }}
          >
            {item}
          </div>
        ))}

        {/* Padding items at bottom */}
        <div style={{ height: `${ITEM_HEIGHT * 2}px` }} />
      </div>
    </div>
  );
}

function TimePickerModal({ open, onClose, initialTime, onSelect }: TimePickerModalProps) {
  const [hours, minutes] = initialTime.split(":");
  const [hourIndex, setHourIndex] = useState(parseInt(hours, 10));
  const [minuteIndex, setMinuteIndex] = useState(parseInt(minutes, 10));

  const handleConfirm = () => {
    const time = `${HOURS[hourIndex]}:${MINUTES[minuteIndex]}`;
    onSelect(time);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className="relative bg-[#2a2a2e] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Time picker drums */}
        <div className="flex items-center justify-center px-4 py-6 gap-2">
          <DrumColumn
            items={HOURS}
            selectedIndex={hourIndex}
            onIndexChange={setHourIndex}
          />

          {/* Colon separator */}
          <div className="text-white text-3xl font-light px-2">:</div>

          <DrumColumn
            items={MINUTES}
            selectedIndex={minuteIndex}
            onIndexChange={setMinuteIndex}
          />
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          className="w-full py-4 bg-brand-500 text-white font-medium text-lg hover:bg-brand-600 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
}

function ReadingRemindersSheet({
  open,
  onClose,
  initialSettings,
  onSave,
  language,
}: ReadingRemindersSheetProps) {
  const [days, setDays] = useState<boolean[]>(initialSettings.days);
  const [time, setTime] = useState(initialSettings.time);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDayToggle = (index: number) => {
    const newDays = [...days];
    newDays[index] = !newDays[index];
    setDays(newDays);
  };

  const handleSave = () => {
    onSave({ enabled: true, days, time });
  };

  const handleTimeSelect = (newTime: string) => {
    setTime(newTime);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Sheet content */}
      <div className="relative bg-background rounded-t-2xl animate-in slide-in-from-bottom duration-300">
        {/* Days selector */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-between">
            {DAYS_SHORT[language].map((day, index) => (
              <button
                key={index}
                onClick={() => handleDayToggle(index)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "font-medium transition-colors",
                  days[index]
                    ? "bg-brand-500 text-white"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Time display - tap to open iOS-style picker */}
        <div className="px-6 py-8 flex justify-end">
          <button
            onClick={() => setShowTimePicker(true)}
            className={cn(
              "text-lg font-medium px-4 py-2 rounded-lg",
              "bg-muted/50 text-muted-foreground",
              "hover:bg-muted transition-colors",
              "active:scale-95"
            )}
          >
            {time}
          </button>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className={cn(
            "w-full py-5 bg-brand-500 text-white font-medium text-lg",
            "hover:bg-brand-600 transition-colors",
            "safe-bottom"
          )}
        >
          {language === "uk" ? "Зберегти" : "Save"}
        </button>
      </div>

      {/* iOS-style 3D Drum Time Picker Modal */}
      <TimePickerModal
        open={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        initialTime={time}
        onSelect={handleTimeSelect}
      />
    </div>
  );
}

export default SpineSettingsPanel;
