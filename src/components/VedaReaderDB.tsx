import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VerseCard } from '@/components/VerseCard';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { TiptapRenderer } from '@/components/blog/TiptapRenderer';

export const VedaReaderDB = () => {
  const { bookId, chapterId, cantoNumber, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [craftPaperMode, setCraftPaperMode] = useState(false);
  const [dualLanguageMode, setDualLanguageMode] = useState(false);
  const [originalLanguage, setOriginalLanguage] = useState('sanskrit');
  const [textDisplaySettings, setTextDisplaySettings] = useState({
    showSanskrit: true,
    showTransliteration: true,
    showSynonyms: true,
    showTranslation: true,
    showCommentary: true
  });
  const [continuousReadingSettings, setContinuousReadingSettings] = useState({
    enabled: false,
    showVerseNumbers: true,
    showSanskrit: true,
    showTransliteration: true,
    showTranslation: true,
    showCommentary: true
  });

  // Utility to extract numeric verse number from formats like "ШБ 1.1.10" or "1.1.10"
  const getDisplayVerseNumber = (verseNumber: string): string => {
    const parts = verseNumber.split(/[\s.]+/);
    return parts[parts.length - 1] || verseNumber;
  };

  // Determine if we're in canto mode
  const isCantoMode = !!cantoNumber;
  const effectiveChapterParam = isCantoMode ? chapterNumber : chapterId;

  // Fetch book
  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('slug', bookId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!bookId
  });

  // Fetch canto (only in canto mode)
  const { data: canto } = useQuery({
    queryKey: ['canto', book?.id, cantoNumber],
    queryFn: async () => {
      if (!book?.id || !cantoNumber) return null;
      const { data, error } = await supabase
        .from('cantos')
        .select('*')
        .eq('book_id', book.id)
        .eq('canto_number', parseInt(cantoNumber))
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isCantoMode && !!book?.id && !!cantoNumber
  });

  // Fetch chapter
  const { data: chapter } = useQuery({
    queryKey: ['chapter', bookId, canto?.id, effectiveChapterParam, isCantoMode],
    queryFn: async () => {
      if (!book?.id || !effectiveChapterParam) return null;
      
      const query = supabase
        .from('chapters')
        .select('*')
        .eq('chapter_number', parseInt(effectiveChapterParam));
      
      // In canto mode, filter by canto_id; otherwise by book_id
      if (isCantoMode && canto?.id) {
        query.eq('canto_id', canto.id);
      } else {
        query.eq('book_id', book.id);
      }
      
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!effectiveChapterParam && (isCantoMode ? !!canto?.id : !!book?.id)
  });

  // Fetch all chapters for navigation
  const { data: allChapters = [] } = useQuery({
    queryKey: ['allChapters', book?.id, canto?.id, isCantoMode],
    queryFn: async () => {
      if (!book?.id) return [];
      
      const query = supabase
        .from('chapters')
        .select('*')
        .order('chapter_number');
      
      // In canto mode, get chapters for this canto only
      if (isCantoMode && canto?.id) {
        query.eq('canto_id', canto.id);
      } else {
        query.eq('book_id', book.id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: (isCantoMode ? !!canto?.id : !!book?.id)
  });

  // Redirect helper: if user opened non-canto URL for a book with cantos
  useEffect(() => {
    if (!isCantoMode && book?.has_cantos && effectiveChapterParam && chapter === null) {
      navigate(`/veda-reader/${bookId}/canto/1/chapter/${effectiveChapterParam}`, { replace: true });
    }
  }, [isCantoMode, book?.has_cantos, effectiveChapterParam, chapter, bookId, navigate]);

  // Helper function to parse verse number for numeric sorting
  const parseVerseNumber = (verseNumber: string): number[] => {
    // Extract numbers from formats like "ШБ 1.1.10" or "1.1.10"
    const match = verseNumber.match(/(\d+)\.(\d+)\.(\d+)/);
    if (match) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    }
    // Try simpler format like "1.10" or just "10"
    const parts = verseNumber.split('.').map(p => parseInt(p.match(/\d+/)?.[0] || '0'));
    return parts.length > 0 ? parts : [0];
  };

  // Fetch verses
  const { data: rawVerses = [], isLoading } = useQuery({
    queryKey: ['verses', chapter?.id],
    queryFn: async () => {
      if (!chapter?.id) return [];
      const { data, error } = await supabase
        .from('verses')
        .select('*')
        .eq('chapter_id', chapter.id);
      if (error) throw error;
      return data;
    },
    enabled: !!chapter?.id
  });

  // Sort verses numerically
  const verses = [...rawVerses].sort((a, b) => {
    const aParts = parseVerseNumber(a.verse_number);
    const bParts = parseVerseNumber(b.verse_number);
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aVal = aParts[i] || 0;
      const bVal = bParts[i] || 0;
      if (aVal !== bVal) return aVal - bVal;
    }
    return 0;
  });

  // Mutation to update verse
  const updateVerseMutation = useMutation({
    mutationFn: async ({ verseId, updates }: { verseId: string; updates: any }) => {
      const { data, error } = await supabase
        .from('verses')
        .update({
          sanskrit: updates.sanskrit,
          transliteration: updates.transliteration,
          synonyms_ua: updates.synonyms,
          translation_ua: updates.translation,
          commentary_ua: updates.commentary,
        })
        .eq('id', verseId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verses'] });
      toast({
        title: "Успішно збережено",
        description: "Вірш оновлено",
      });
    },
    onError: (error) => {
      toast({
        title: "Помилка",
        description: "Не вдалося зберегти зміни",
        variant: "destructive",
      });
    },
  });

  const currentVerse = verses[currentVerseIndex];
  const bookTitle = language === 'ua' ? book?.title_ua : book?.title_en;
  const chapterTitle = language === 'ua' ? chapter?.title_ua : chapter?.title_en;

  const currentChapterIndex = allChapters.findIndex(
    ch => ch.chapter_number === parseInt(effectiveChapterParam || '1')
  );

  const handlePrevVerse = () => {
    if (currentVerseIndex > 0) {
      setCurrentVerseIndex(currentVerseIndex - 1);
    }
  };

  const handleNextVerse = () => {
    if (currentVerseIndex < verses.length - 1) {
      setCurrentVerseIndex(currentVerseIndex + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      const prevChapter = allChapters[currentChapterIndex - 1];
      const path = isCantoMode 
        ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${prevChapter.chapter_number}`
        : `/veda-reader/${bookId}/${prevChapter.chapter_number}`;
      navigate(path);
      setCurrentVerseIndex(0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      const path = isCantoMode 
        ? `/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${nextChapter.chapter_number}`
        : `/veda-reader/${bookId}/${nextChapter.chapter_number}`;
      navigate(path);
      setCurrentVerseIndex(0);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            {t('Завантаження...', 'Loading...')}
          </p>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">
            {t('Немає даних для цієї глави', 'No data for this chapter')}
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(isCantoMode ? `/veda-reader/${bookId}/canto/${cantoNumber}` : `/veda-reader/${bookId}`)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t('Назад', 'Back')}
          </Button>
        </div>
      </div>
    );
  }

  // Check if this is a text-only chapter (no verses)
  const isTextChapter = chapter.chapter_type === 'text' || verses.length === 0;

  return (
    <div className={`min-h-screen ${craftPaperMode ? 'bg-craft-paper' : 'bg-background'}`}>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={isCantoMode ? [
            { label: t('Бібліотека', 'Library'), href: '/library' },
            { label: bookTitle || '', href: `/veda-reader/${bookId}` },
            { label: `Пісня ${cantoNumber}`, href: `/veda-reader/${bookId}/canto/${cantoNumber}` },
            { label: chapterTitle || '' }
          ] : [
            { label: t('Бібліотека', 'Library'), href: '/library' },
            { label: bookTitle || '', href: `/veda-reader/${bookId}` },
            { label: chapterTitle || '' }
          ]}
        />

        <div className="flex justify-between items-center mb-8 mt-4">
          <h1 className="text-3xl font-bold">{bookTitle}</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {isTextChapter ? (
          <Card className="p-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <TiptapRenderer 
                content={language === 'ua' ? chapter.content_ua || '' : chapter.content_en || chapter.content_ua || ''} 
              />
            </div>
            
            {/* Chapter navigation for text chapters */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t">
              <Button
                variant="secondary"
                onClick={handlePrevChapter}
                disabled={currentChapterIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {t('Попередня глава', 'Previous Chapter')}
              </Button>
              
              <span className="text-sm text-muted-foreground">
                {t('Глава', 'Chapter')} {currentChapterIndex + 1} {t('з', 'of')} {allChapters.length}
              </span>

              <Button
                variant="secondary"
                onClick={handleNextChapter}
                disabled={currentChapterIndex === allChapters.length - 1}
              >
                {t('Наступна глава', 'Next Chapter')}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        ) : continuousReadingSettings.enabled ? (
          <div className="space-y-8">
            {verses.map((verse) => {
              const verseIdx = getDisplayVerseNumber(verse.verse_number);
              const fullVerseNumber = isCantoMode 
                ? `${cantoNumber}.${chapterNumber}.${verseIdx}`
                : `${chapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;
              
              return (
              <VerseCard
                key={verse.id}
                verseId={verse.id}
                verseNumber={fullVerseNumber}
                bookName={chapterTitle}
                sanskritText={verse.sanskrit || ''}
                transliteration={verse.transliteration || ''}
                synonyms={language === 'ua' ? verse.synonyms_ua || '' : verse.synonyms_en || ''}
                translation={language === 'ua' ? verse.translation_ua || '' : verse.translation_en || ''}
                commentary={language === 'ua' ? verse.commentary_ua || '' : verse.commentary_en || ''}
                audioUrl={verse.audio_url || ''}
                textDisplaySettings={textDisplaySettings}
                isAdmin={isAdmin}
                onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({ verseId, updates })}
              />
            )})}
          </div>
        ) : (
          <>
            {currentVerse && (() => {
              const verseIdx = getDisplayVerseNumber(currentVerse.verse_number);
              const fullVerseNumber = isCantoMode 
                ? `${cantoNumber}.${chapterNumber}.${verseIdx}`
                : `${chapter?.chapter_number || effectiveChapterParam}.${verseIdx}`;
              
              return (
              <div className="space-y-6">
                {dualLanguageMode ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <VerseCard
                      verseId={currentVerse.id}
                      verseNumber={fullVerseNumber}
                      bookName={chapter?.title_ua}
                      sanskritText={currentVerse.sanskrit || ''}
                      transliteration={currentVerse.transliteration || ''}
                      synonyms={currentVerse.synonyms_ua || ''}
                      translation={currentVerse.translation_ua || ''}
                      commentary={currentVerse.commentary_ua || ''}
                      audioUrl={currentVerse.audio_url || ''}
                      textDisplaySettings={textDisplaySettings}
                      isAdmin={isAdmin}
                      onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({ verseId, updates })}
                    />
                    <VerseCard
                      verseId={currentVerse.id}
                      verseNumber={fullVerseNumber}
                      bookName={book?.title_en}
                      sanskritText={currentVerse.sanskrit || ''}
                      transliteration={currentVerse.transliteration || ''}
                      synonyms={currentVerse.synonyms_en || ''}
                      translation={currentVerse.translation_en || ''}
                      commentary={currentVerse.commentary_en || ''}
                      audioUrl={currentVerse.audio_url || ''}
                      textDisplaySettings={textDisplaySettings}
                      isAdmin={false}
                      onVerseUpdate={() => {}}
                    />
                  </div>
                ) : (
                  <VerseCard
                    verseId={currentVerse.id}
                    verseNumber={fullVerseNumber}
                    bookName={chapterTitle}
                    sanskritText={currentVerse.sanskrit || ''}
                    transliteration={currentVerse.transliteration || ''}
                    synonyms={language === 'ua' ? currentVerse.synonyms_ua || '' : currentVerse.synonyms_en || ''}
                    translation={language === 'ua' ? currentVerse.translation_ua || '' : currentVerse.translation_en || ''}
                    commentary={language === 'ua' ? currentVerse.commentary_ua || '' : currentVerse.commentary_en || ''}
                    audioUrl={currentVerse.audio_url || ''}
                    textDisplaySettings={textDisplaySettings}
                    isAdmin={isAdmin}
                    onVerseUpdate={(verseId, updates) => updateVerseMutation.mutate({ verseId, updates })}
                  />
                )}

                {/* Verse navigation */}
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={handlePrevVerse}
                    disabled={currentVerseIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    {t('Попередній', 'Previous')}
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    {currentVerseIndex + 1} {t('з', 'of')} {verses.length}
                  </span>

                  <Button
                    variant="outline"
                    onClick={handleNextVerse}
                    disabled={currentVerseIndex === verses.length - 1}
                  >
                    {t('Наступний', 'Next')}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>

                {/* Chapter navigation */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    variant="secondary"
                    onClick={handlePrevChapter}
                    disabled={currentChapterIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    {t('Попередня глава', 'Previous Chapter')}
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    {t('Глава', 'Chapter')} {currentChapterIndex + 1} {t('з', 'of')} {allChapters.length}
                  </span>

                  <Button
                    variant="secondary"
                    onClick={handleNextChapter}
                    disabled={currentChapterIndex === allChapters.length - 1}
                  >
                    {t('Наступна глава', 'Next Chapter')}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                </div>
              )})()}
            </>
          )}
        </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        craftPaperMode={craftPaperMode}
        onCraftPaperToggle={setCraftPaperMode}
        verses={verses.map(v => ({
          number: v.verse_number,
          book: bookTitle,
          translation: language === 'ua' ? v.translation_ua : v.translation_en
        }))}
        currentVerse={currentVerse?.verse_number || ''}
        onVerseSelect={(verseNum) => {
          const index = verses.findIndex(v => v.verse_number === verseNum);
          if (index !== -1) setCurrentVerseIndex(index);
        }}
        dualLanguageMode={dualLanguageMode}
        onDualLanguageModeToggle={setDualLanguageMode}
        textDisplaySettings={textDisplaySettings}
        onTextDisplaySettingsChange={setTextDisplaySettings}
        originalLanguage={originalLanguage}
        onOriginalLanguageChange={setOriginalLanguage}
        continuousReadingSettings={continuousReadingSettings}
        onContinuousReadingSettingsChange={setContinuousReadingSettings}
      />
    </div>
  );
};
