// src/components/AdvancedVerseReader.tsx
// Cutting-edge reading experience for Vedic literature

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  BookmarkIcon, 
  Share2Icon, 
  TypeIcon, 
  SunIcon, 
  MoonIcon,
  Columns2Icon,
  SettingsIcon,
  ChevronLeft,
  ChevronRight,
  EyeIcon,
  CopyIcon
} from 'lucide-react';
import { toast } from 'sonner';

interface Verse {
  id: string;
  verse_number: string;
  sanskrit: string;
  transliteration: string;
  synonyms_en?: string;
  synonyms_ua?: string;
  translation_en?: string;
  translation_ua?: string;
  commentary_en?: string;
  commentary_ua?: string;
}

interface ReadingPreferences {
  fontSize: number; // 14-24
  lineHeight: number; // 1.5-2.5
  displayBlocks: {
    sanskrit: boolean;
    transliteration: boolean;
    synonyms: boolean;
    translation: boolean;
    commentary: boolean;
  };
  language: 'en' | 'ua' | 'both';
  theme: 'light' | 'sepia' | 'dark';
  layout: 'single' | 'dual';
}

const defaultPreferences: ReadingPreferences = {
  fontSize: 17,
  lineHeight: 1.75,
  displayBlocks: {
    sanskrit: true,
    transliteration: true,
    synonyms: false,
    translation: true,
    commentary: true,
  },
  language: 'en',
  theme: 'sepia',
  layout: 'single',
};

export const AdvancedVerseReader = ({ 
  verse, 
  onNext, 
  onPrevious,
  hasNext,
  hasPrevious 
}: {
  verse: Verse;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}) => {
  const [prefs, setPrefs] = useState<ReadingPreferences>(() => {
    const saved = localStorage.getItem('vedavoice-reading-prefs');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  const [showSettings, setShowSettings] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  // Save preferences
  useEffect(() => {
    localStorage.setItem('vedavoice-reading-prefs', JSON.stringify(prefs));
  }, [prefs]);

  // Track reading time
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [verse.id]);

  // Check bookmark status
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('vedavoice-bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(verse.id));
  }, [verse.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrevious) onPrevious();
      if (e.key === 'b' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleBookmark();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasNext, hasPrevious, verse.id]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('vedavoice-bookmarks') || '[]');
    const updated = isBookmarked
      ? bookmarks.filter((id: string) => id !== verse.id)
      : [...bookmarks, verse.id];
    localStorage.setItem('vedavoice-bookmarks', JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Закладку видалено' : 'Закладку додано');
  };

  const shareVerse = async () => {
    const text = `${verse.translation_en || verse.translation_ua}\n\n— Вірш ${verse.verse_number}`;
    if (navigator.share) {
      await navigator.share({ text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Скопійовано в буфер обміну');
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} скопійовано`);
  };

  const themeStyles = {
    light: 'bg-white text-gray-900',
    sepia: 'bg-[#FAF7F0] text-[#1A1A1A]',
    dark: 'bg-gray-900 text-gray-100',
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${themeStyles[prefs.theme]}`}
      style={{
        fontSize: `${prefs.fontSize}px`,
        lineHeight: prefs.lineHeight,
      }}
    >
      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onPrevious}
              disabled={!hasPrevious}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <span className="font-semibold text-lg px-4">
              Вірш {verse.verse_number}
            </span>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onNext}
              disabled={!hasNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBookmark}
              className={isBookmarked ? 'text-amber-600' : ''}
            >
              <BookmarkIcon className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={shareVerse}>
              <Share2Icon className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSettings(!showSettings)}
            >
              <SettingsIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 dark:bg-gray-800 border-b"
          >
            <div className="container mx-auto px-4 py-6 space-y-6">
              {/* Font Size */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <TypeIcon className="w-4 h-4" />
                  Розмір тексту: {prefs.fontSize}px
                </label>
                <Slider
                  value={[prefs.fontSize]}
                  onValueChange={([value]) => setPrefs(p => ({ ...p, fontSize: value }))}
                  min={14}
                  max={24}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Line Height */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Міжрядковий інтервал: {prefs.lineHeight.toFixed(2)}
                </label>
                <Slider
                  value={[prefs.lineHeight]}
                  onValueChange={([value]) => setPrefs(p => ({ ...p, lineHeight: value }))}
                  min={1.5}
                  max={2.5}
                  step={0.1}
                  className="w-full"
                />
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Тема</label>
                <div className="flex gap-2">
                  {(['light', 'sepia', 'dark'] as const).map(theme => (
                    <Button
                      key={theme}
                      variant={prefs.theme === theme ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPrefs(p => ({ ...p, theme }))}
                    >
                      {theme === 'light' && <SunIcon className="w-4 h-4 mr-2" />}
                      {theme === 'dark' && <MoonIcon className="w-4 h-4 mr-2" />}
                      {theme === 'sepia' ? 'Сепія' : theme === 'light' ? 'Світла' : 'Темна'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Display Blocks */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <EyeIcon className="w-4 h-4" />
                  Відображати
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(prefs.displayBlocks).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setPrefs(p => ({
                          ...p,
                          displayBlocks: { ...p.displayBlocks, [key]: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm">
                        {key === 'sanskrit' && 'Санскрит'}
                        {key === 'transliteration' && 'Транслітерація'}
                        {key === 'synonyms' && 'Синоніми'}
                        {key === 'translation' && 'Переклад'}
                        {key === 'commentary' && 'Коментар'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Layout */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Макет</label>
                <div className="flex gap-2">
                  <Button
                    variant={prefs.layout === 'single' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPrefs(p => ({ ...p, layout: 'single' }))}
                  >
                    Одна колонка
                  </Button>
                  <Button
                    variant={prefs.layout === 'dual' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPrefs(p => ({ ...p, layout: 'dual' }))}
                  >
                    <Columns2Icon className="w-4 h-4 mr-2" />
                    Дві мови
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verse Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.article
          key={verse.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Sanskrit */}
          {prefs.displayBlocks.sanskrit && verse.sanskrit && (
            <section className="relative group">
              <div className="text-center">
                <p 
                  className="text-2xl md:text-3xl font-serif leading-loose"
                  lang="sa"
                  style={{ fontFamily: "'Noto Sans Devanagari', serif" }}
                >
                  {verse.sanskrit}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyText(verse.sanskrit, 'Санскрит')}
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
            </section>
          )}

          {/* Transliteration */}
          {prefs.displayBlocks.transliteration && verse.transliteration && (
            <section className="relative group">
              <p className="text-center italic text-amber-800 dark:text-amber-300">
                {verse.transliteration}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyText(verse.transliteration, 'Транслітерація')}
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
            </section>
          )}

          {/* Synonyms */}
          {prefs.displayBlocks.synonyms && (
            <section className="bg-gray-50/50 dark:bg-gray-800/50 rounded-lg p-6">
              {prefs.layout === 'dual' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {verse.synonyms_en && (
                    <div>
                      <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide">
                        Word for Word
                      </h3>
                      <p className="text-sm">{verse.synonyms_en}</p>
                    </div>
                  )}
                  {verse.synonyms_ua && (
                    <div>
                      <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide">
                        Послівний переклад
                      </h3>
                      <p className="text-sm">{verse.synonyms_ua}</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {(prefs.language === 'en' || prefs.language === 'both') && verse.synonyms_en && (
                    <p className="text-sm">{verse.synonyms_en}</p>
                  )}
                  {(prefs.language === 'ua' || prefs.language === 'both') && verse.synonyms_ua && (
                    <p className="text-sm">{verse.synonyms_ua}</p>
                  )}
                </>
              )}
            </section>
          )}

          {/* Translation */}
          {prefs.displayBlocks.translation && (
            <section className="relative group">
              {prefs.layout === 'dual' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {verse.translation_en && (
                    <div className="prose dark:prose-invert">
                      <h3 className="font-semibold mb-3 text-base">Translation</h3>
                      <p>{verse.translation_en}</p>
                    </div>
                  )}
                  {verse.translation_ua && (
                    <div className="prose dark:prose-invert">
                      <h3 className="font-semibold mb-3 text-base">Переклад</h3>
                      <p>{verse.translation_ua}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {(prefs.language === 'en' || prefs.language === 'both') && verse.translation_en && (
                    <p className="font-medium">{verse.translation_en}</p>
                  )}
                  {(prefs.language === 'ua' || prefs.language === 'both') && verse.translation_ua && (
                    <p className="font-medium">{verse.translation_ua}</p>
                  )}
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => copyText(
                  verse.translation_en || verse.translation_ua || '', 
                  'Переклад'
                )}
              >
                <CopyIcon className="w-4 h-4" />
              </Button>
            </section>
          )}

          {/* Commentary */}
          {prefs.displayBlocks.commentary && (
            <section className="relative group">
              {prefs.layout === 'dual' ? (
                <div className="grid md:grid-cols-2 gap-8">
                  {verse.commentary_en && (
                    <div className="prose dark:prose-invert">
                      <h3 className="font-semibold mb-4">Purport</h3>
                      <div className="text-justify hyphens-auto">
                        {verse.commentary_en}
                      </div>
                    </div>
                  )}
                  {verse.commentary_ua && (
                    <div className="prose dark:prose-invert">
                      <h3 className="font-semibold mb-4">Коментар</h3>
                      <div className="text-justify hyphens-auto">
                        {verse.commentary_ua}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <div className="text-justify hyphens-auto">
                    {(prefs.language === 'en' || prefs.language === 'both') && verse.commentary_en}
                    {(prefs.language === 'ua' || prefs.language === 'both') && verse.commentary_ua}
                  </div>
                </div>
              )}
            </section>
          )}
        </motion.article>

        {/* Reading Stats */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Час читання: {Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}</p>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t p-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={!hasPrevious}
            className="flex-1 mr-2"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Попередній
          </Button>
          <Button
            variant="outline"
            onClick={onNext}
            disabled={!hasNext}
            className="flex-1 ml-2"
          >
            Наступний
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedVerseReader;
