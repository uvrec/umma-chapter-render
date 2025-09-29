import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { VerseCard } from '@/components/VerseCard';
import { SettingsPanel } from '@/components/SettingsPanel';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export const VedaReaderDB = () => {
  const { bookId, chapterId } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
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

  // Fetch book
  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('slug', bookId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookId
  });

  // Fetch chapter
  const { data: chapter } = useQuery({
    queryKey: ['chapter', bookId, chapterId],
    queryFn: async () => {
      if (!book?.id) return null;
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', book.id)
        .eq('chapter_number', parseInt(chapterId || '1'))
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!chapterId && !!book?.id
  });

  // Fetch all chapters for navigation
  const { data: allChapters = [] } = useQuery({
    queryKey: ['allChapters', book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('book_id', book.id)
        .order('chapter_number');
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id
  });

  // Fetch verses
  const { data: verses = [], isLoading } = useQuery({
    queryKey: ['verses', chapter?.id],
    queryFn: async () => {
      if (!chapter?.id) return [];
      const { data, error } = await supabase
        .from('verses')
        .select('*')
        .eq('chapter_id', chapter.id)
        .order('verse_number');
      if (error) throw error;
      return data;
    },
    enabled: !!chapter?.id
  });

  const currentVerse = verses[currentVerseIndex];
  const bookTitle = language === 'ua' ? book?.title_ua : book?.title_en;
  const chapterTitle = language === 'ua' ? chapter?.title_ua : chapter?.title_en;

  const currentChapterIndex = allChapters.findIndex(
    ch => ch.chapter_number === parseInt(chapterId || '1')
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
      navigate(`/veda-reader/${bookId}/${prevChapter.chapter_number}`);
      setCurrentVerseIndex(0);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentChapterIndex + 1];
      navigate(`/veda-reader/${bookId}/${nextChapter.chapter_number}`);
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

  return (
    <div className={`min-h-screen ${craftPaperMode ? 'bg-craft-paper' : 'bg-background'}`}>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
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

        {continuousReadingSettings.enabled ? (
          <div className="space-y-8">
            {verses.map((verse) => (
              <VerseCard
                key={verse.id}
                verseNumber={verse.verse_number}
                bookName={bookTitle}
                sanskritText={verse.sanskrit || ''}
                transliteration={verse.transliteration || ''}
                synonyms={language === 'ua' ? verse.synonyms_ua || '' : verse.synonyms_en || ''}
                translation={language === 'ua' ? verse.translation_ua || '' : verse.translation_en || ''}
                commentary={language === 'ua' ? verse.commentary_ua || '' : verse.commentary_en || ''}
                audioUrl={verse.audio_url || ''}
                textDisplaySettings={textDisplaySettings}
              />
            ))}
          </div>
        ) : (
          <>
            {currentVerse && (
              <div className="space-y-6">
                {dualLanguageMode ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <VerseCard
                      verseNumber={currentVerse.verse_number}
                      bookName={book?.title_ua}
                      sanskritText={currentVerse.sanskrit || ''}
                      transliteration={currentVerse.transliteration || ''}
                      synonyms={currentVerse.synonyms_ua || ''}
                      translation={currentVerse.translation_ua || ''}
                      commentary={currentVerse.commentary_ua || ''}
                      audioUrl={currentVerse.audio_url || ''}
                      textDisplaySettings={textDisplaySettings}
                    />
                    <VerseCard
                      verseNumber={currentVerse.verse_number}
                      bookName={book?.title_en}
                      sanskritText={currentVerse.sanskrit || ''}
                      transliteration={currentVerse.transliteration || ''}
                      synonyms={currentVerse.synonyms_en || ''}
                      translation={currentVerse.translation_en || ''}
                      commentary={currentVerse.commentary_en || ''}
                      audioUrl={currentVerse.audio_url || ''}
                      textDisplaySettings={textDisplaySettings}
                    />
                  </div>
                ) : (
                  <VerseCard
                    verseNumber={currentVerse.verse_number}
                    bookName={bookTitle}
                    sanskritText={currentVerse.sanskrit || ''}
                    transliteration={currentVerse.transliteration || ''}
                    synonyms={language === 'ua' ? currentVerse.synonyms_ua || '' : currentVerse.synonyms_en || ''}
                    translation={language === 'ua' ? currentVerse.translation_ua || '' : currentVerse.translation_en || ''}
                    commentary={language === 'ua' ? currentVerse.commentary_ua || '' : currentVerse.commentary_en || ''}
                    audioUrl={currentVerse.audio_url || ''}
                    textDisplaySettings={textDisplaySettings}
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
            )}
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
