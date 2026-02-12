import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useReaderSettings } from '@/hooks/useReaderSettings';
import { EnhancedInlineEditor } from '@/components/EnhancedInlineEditor';
import { toast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { sanitizeForRender } from '@/utils/import/normalizers';
import { useIsMobile } from '@/hooks/use-mobile';

// Функція для розбиття HTML на параграфи
const parseHTMLToParagraphs = (html: string): string[] => {
  if (!html) return [];
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = DOMPurify.sanitize(html);

  const paragraphs: string[] = [];
  const elements = tempDiv.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, pre');

  elements.forEach((el) => {
    paragraphs.push(el.outerHTML);
  });

  return paragraphs.length > 0 ? paragraphs : [html];
};

export const IntroChapter = () => {
  const { bookId, slug, p2 } = useParams();
  const navigate = useNavigate();
  // Support both /veda-reader/:bookId/intro/:slug and /lib/:bookId/intro/:slug (where slug is p2)
  const introSlug = slug || p2;
  const { language, getLocalizedPath } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { fontSize, lineHeight, dualLanguageMode, setDualLanguageMode } = useReaderSettings();
  const isMobile = useIsMobile();

  // Editing state
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContentUk, setEditedContentUk] = useState("");
  const [editedContentEn, setEditedContentEn] = useState("");

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
    queryKey: ['intro-chapter', book?.id, introSlug],
    queryFn: async () => {
      if (!book?.id || !introSlug) return null;
      const { data, error } = await supabase
        .from('intro_chapters')
        .select('*')
        .eq('book_id', book.id)
        .eq('slug', introSlug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && !!introSlug
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

  const bookTitle = language === 'uk' ? book?.title_uk : book?.title_en;
  const chapterTitle = language === 'uk' ? introChapter?.title_uk : introChapter?.title_en;

  const currentIndex = allIntroChapters.findIndex(ch => ch.slug === introSlug);
  const prevChapter = currentIndex > 0 ? allIntroChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allIntroChapters.length - 1 ? allIntroChapters[currentIndex + 1] : null;

  // Initialize edited content when intro chapter loads
  useEffect(() => {
    if (introChapter) {
      setEditedContentUk(introChapter.content_uk || "");
      setEditedContentEn(introChapter.content_en || "");
    }
  }, [introChapter]);

  // Синхронізовані параграфи для двомовного режиму
  const synchronizedParagraphs = useMemo(() => {
    if (!introChapter || !dualLanguageMode) return [];

    const paragraphsUk = parseHTMLToParagraphs(introChapter.content_uk || '');
    const paragraphsEn = parseHTMLToParagraphs(introChapter.content_en || '');

    const maxLength = Math.max(paragraphsUk.length, paragraphsEn.length);
    const synced: Array<{ uk: string; en: string }> = [];

    for (let i = 0; i < maxLength; i++) {
      synced.push({
        uk: paragraphsUk[i] || '',
        en: paragraphsEn[i] || '',
      });
    }

    return synced;
  }, [introChapter, dualLanguageMode]);

  // Save content mutation
  const saveContentMutation = useMutation({
    mutationFn: async () => {
      if (!introChapter?.id) return;
      const { error } = await supabase
        .from("intro_chapters")
        .update({
          content_uk: editedContentUk,
          content_en: editedContentEn
        })
        .eq("id", introChapter.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["intro-chapter"] });
      setIsEditingContent(false);
      toast({ title: "Зміни збережено" });
    },
    onError: () => {
      toast({ title: "Помилка збереження", variant: "destructive" });
    }
  });

  const readerTextStyle = {
    fontSize: `${fontSize}px`,
    lineHeight,
  };

  const handleBack = () => {
    navigate(getLocalizedPath(`/lib/${bookId}`));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background py-8">
          <div className="container mx-auto max-w-6xl px-4">
            <Skeleton className="mb-4 h-8 w-48" />
            <Skeleton className="mb-8 h-12 w-96" />
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!introChapter) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 bg-background py-8">
          <div className="container mx-auto max-w-6xl px-4 text-center">
            <p className="text-muted-foreground mb-4">
              {language === 'uk' ? 'Глава не знайдена' : 'Chapter not found'}
            </p>
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {language === 'uk' ? 'Назад до книги' : 'Back to book'}
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mobile: Minimalist view - only chapter title and content
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-primary text-center font-serif">{chapterTitle}</h1>
        </div>

        <div className="px-4 pb-8">
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-justify"
            style={readerTextStyle}
            dangerouslySetInnerHTML={{
              __html: sanitizeForRender(
                language === 'uk'
                  ? (introChapter?.content_uk || introChapter?.content_en || "")
                  : (introChapter?.content_en || introChapter?.content_uk || "")
              )
            }}
          />
        </div>
      </div>
    );
  }

  // Desktop: Full view — matches ChapterVersesList layout
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background py-4 sm:py-8">
        <div className="container mx-auto max-w-6xl px-3 sm:px-4">
          {/* Sticky toolbar — matches ChapterVersesList */}
          <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2 sticky top-0 lg:top-[65px] z-40 bg-background/95 backdrop-blur-sm py-2 -mx-3 px-3 sm:-mx-4 sm:px-4">
            <Button variant="ghost" onClick={handleBack} className="gap-2" size="sm">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden xs:inline">{language === 'uk' ? 'Назад' : 'Back'}</span>
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Prev/Next intro chapter navigation */}
              {prevChapter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(getLocalizedPath(`/lib/${bookId}/intro/${prevChapter.slug}`))}
                  className="gap-1 flex-1 sm:flex-none"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === 'uk' ? 'Попередня' : 'Previous'}</span>
                </Button>
              )}
              {nextChapter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(getLocalizedPath(`/lib/${bookId}/intro/${nextChapter.slug}`))}
                  className="gap-1 flex-1 sm:flex-none"
                >
                  <span className="hidden sm:inline">{language === 'uk' ? 'Наступна' : 'Next'}</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}

              {/* Admin edit controls */}
              {user && !isEditingContent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingContent(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">{language === 'uk' ? 'Редагувати' : 'Edit'}</span>
                </Button>
              )}
              {user && isEditingContent && (
                <>
                  <Button
                    onClick={() => saveContentMutation.mutate()}
                    disabled={saveContentMutation.isPending}
                    size="sm"
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === 'uk' ? 'Зберегти' : 'Save'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingContent(false);
                      setEditedContentUk(introChapter?.content_uk || "");
                      setEditedContentEn(introChapter?.content_en || "");
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === 'uk' ? 'Скасувати' : 'Cancel'}</span>
                  </Button>
                </>
              )}

              {/* Dual language toggle */}
              <Button
                variant={dualLanguageMode ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setDualLanguageMode(!dualLanguageMode)}
                title={language === 'uk' ? 'Двомовний режим' : 'Dual language'}
              >
                <BookOpen className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Title block — matches ChapterVersesList */}
          <div className="mb-6 sm:mb-8">
            <div className="mb-2 gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap flex items-center justify-center">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">{bookTitle}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold break-words text-center md:text-4xl font-serif text-primary">
              {chapterTitle}
            </h1>
          </div>

          {/* Content */}
          {isEditingContent ? (
            <div className="mb-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <EnhancedInlineEditor content={editedContentUk} onChange={setEditedContentUk} label="Українська" />
                <EnhancedInlineEditor content={editedContentEn} onChange={setEditedContentEn} label="English" />
              </div>
            </div>
          ) : dualLanguageMode ? (
            <div className="mb-8 space-y-4" style={readerTextStyle}>
              {synchronizedParagraphs.map((pair, index) => (
                <div key={index} className="grid gap-6 md:grid-cols-2">
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none"
                    style={readerTextStyle}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeForRender(pair.uk || '<span class="italic text-muted-foreground">—</span>')
                    }}
                  />
                  <div
                    className="prose prose-slate dark:prose-invert max-w-none"
                    style={readerTextStyle}
                    dangerouslySetInnerHTML={{
                      __html: sanitizeForRender(pair.en || '<span class="italic text-muted-foreground">—</span>')
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="mb-8 prose prose-slate dark:prose-invert max-w-none"
              style={readerTextStyle}
              dangerouslySetInnerHTML={{
                __html: sanitizeForRender(
                  language === 'uk'
                    ? (introChapter?.content_uk || introChapter?.content_en || "")
                    : (introChapter?.content_en || introChapter?.content_uk || "")
                )
              }}
            />
          )}

          {/* Bottom navigation — matches ChapterVersesList */}
          {(prevChapter || nextChapter) && (
            <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
              {prevChapter ? (
                <Button
                  variant="outline"
                  onClick={() => navigate(getLocalizedPath(`/lib/${bookId}/intro/${prevChapter.slug}`))}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">
                      {language === 'uk' ? 'Попередній розділ' : 'Previous section'}
                    </div>
                    <div className="font-medium">
                      {language === 'uk' ? prevChapter.title_uk : prevChapter.title_en}
                    </div>
                  </div>
                </Button>
              ) : (
                <Button variant="outline" onClick={handleBack} className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">
                      {language === 'uk' ? 'Назад' : 'Back'}
                    </div>
                    <div className="font-medium">
                      {bookTitle}
                    </div>
                  </div>
                </Button>
              )}

              {nextChapter ? (
                <Button
                  variant="outline"
                  onClick={() => navigate(getLocalizedPath(`/lib/${bookId}/intro/${nextChapter.slug}`))}
                  className="gap-2"
                >
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">
                      {language === 'uk' ? 'Наступний розділ' : 'Next section'}
                    </div>
                    <div className="font-medium">
                      {language === 'uk' ? nextChapter.title_uk : nextChapter.title_en}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => {
                    const firstChapterPath = book?.has_cantos
                      ? getLocalizedPath(`/lib/${bookId}/1/1`)
                      : getLocalizedPath(`/lib/${bookId}/1`);
                    navigate(firstChapterPath);
                  }}
                  className="gap-2"
                >
                  <div className="text-right">
                    <div className="text-xs">
                      {language === 'uk' ? 'Почати читання' : 'Start reading'}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};
