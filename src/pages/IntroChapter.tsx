import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { TiptapRenderer } from '@/components/blog/TiptapRenderer';

export const IntroChapter = () => {
  const { bookId, slug } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();

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

  // Fetch intro chapter
  const { data: introChapter, isLoading } = useQuery({
    queryKey: ['intro-chapter', book?.id, slug],
    queryFn: async () => {
      if (!book?.id || !slug) return null;
      const { data, error } = await supabase
        .from('intro_chapters')
        .select('*')
        .eq('book_id', book.id)
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && !!slug
  });

  // Fetch all intro chapters for navigation
  const { data: allIntroChapters = [] } = useQuery({
    queryKey: ['all-intro-chapters', book?.id],
    queryFn: async () => {
      if (!book?.id) return [];
      const { data, error } = await supabase
        .from('intro_chapters')
        .select('*')
        .eq('book_id', book.id)
        .order('display_order');
      if (error) throw error;
      return data || [];
    },
    enabled: !!book?.id
  });

  const bookTitle = language === 'ua' ? book?.title_ua : book?.title_en;
  const chapterTitle = language === 'ua' ? introChapter?.title_ua : introChapter?.title_en;
  const content = language === 'ua' ? introChapter?.content_ua : introChapter?.content_en;

  const currentIndex = allIntroChapters.findIndex(ch => ch.slug === slug);
  const prevChapter = currentIndex > 0 ? allIntroChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allIntroChapters.length - 1 ? allIntroChapters[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!introChapter) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground mb-4">Глава не знайдена</p>
          <Button
            variant="outline"
            onClick={() => navigate(`/veda-reader/${bookId}`)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Назад до книги
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Бібліотека', href: '/library' },
            { label: bookTitle || '', href: `/veda-reader/${bookId}` },
            { label: chapterTitle || '' }
          ]}
        />

        <div className="mt-6 mb-8">
          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-2">{bookTitle}</h1>
          <h2 className="text-3xl md:text-4xl text-muted-foreground">{chapterTitle}</h2>
        </div>

        <Card className="p-8 mb-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <TiptapRenderer content={content || ''} />
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          {prevChapter ? (
            <Button
              variant="secondary"
              onClick={() => navigate(`/veda-reader/${bookId}/intro/${prevChapter.slug}`)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {language === 'ua' ? prevChapter.title_ua : prevChapter.title_en}
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => navigate(`/veda-reader/${bookId}`)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Назад до книги
            </Button>
          )}

          {nextChapter ? (
            <Button
              variant="secondary"
              onClick={() => navigate(`/veda-reader/${bookId}/intro/${nextChapter.slug}`)}
            >
              {language === 'ua' ? nextChapter.title_ua : nextChapter.title_en}
              <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={() => {
                const firstChapterPath = book?.has_cantos 
                  ? `/veda-reader/${bookId}/canto/1/chapter/1`
                  : `/veda-reader/${bookId}/1`;
                navigate(firstChapterPath);
              }}
            >
              Почати читання
              <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};