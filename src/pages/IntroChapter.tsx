import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
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
  const { fontSize, lineHeight, dualLanguageMode } = useReaderSettings();
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

    const paragraphsUa = parseHTMLToParagraphs(introChapter.content_uk || '');
    const paragraphsEn = parseHTMLToParagraphs(introChapter.content_en || '');

    const maxLength = Math.max(paragraphsUa.length, paragraphsEn.length);
    const synced: Array<{ uk: string; en: string }> = [];

    for (let i = 0; i < maxLength; i++) {
      synced.push({
        uk: paragraphsUa[i] || '',
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
            onClick={() => navigate(getLocalizedPath(`/lib/${bookId}`))}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Назад до книги
          </Button>
        </div>
      </div>
    );
  }

  // Mobile: Minimalist view - only chapter title and content
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        {/* Title only */}
        <div className="px-4 pt-6 pb-4">
          <h1 className="text-2xl font-bold text-primary text-center">{chapterTitle}</h1>
        </div>

        {/* Content */}
        <div className="px-4 pb-8">
          <div
            className="prose prose-slate dark:prose-invert max-w-none text-justify"
            style={{ fontSize: `${fontSize}px`, lineHeight }}
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

  // Desktop: Full view
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Бібліотека', href: '/library' },
            { label: bookTitle || '', href: `/lib/${bookId}` },
            { label: chapterTitle || '' }
          ]}
        />

        <div className="verse-surface w-full animate-fade-in py-6">
          {/* Sticky Header - Title + Edit Button */}
          <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm pb-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-1">{bookTitle}</h1>
                <h2 className="section-header text-xl text-foreground font-serif">{chapterTitle}</h2>
              </div>

              {/* Admin Edit Button */}
              {user && (
                <div className="flex gap-2">
                  {isEditingContent ? (
                    <>
                      <Button
                        onClick={() => saveContentMutation.mutate()}
                        disabled={saveContentMutation.isPending}
                        variant="default"
                        size="sm"
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {language === 'uk' ? 'Зберегти' : 'Save'}
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
                        {language === 'uk' ? 'Скасувати' : 'Cancel'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingContent(true)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      {language === 'uk' ? 'Редагувати' : 'Edit'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {isEditingContent ? (
            // Editing mode - Side-by-side EnhancedInlineEditor
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Українська</h3>
                <EnhancedInlineEditor
                  content={editedContentUk}
                  onChange={setEditedContentUk}
                />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">English</h3>
                <EnhancedInlineEditor
                  content={editedContentEn}
                  onChange={setEditedContentEn}
                />
              </div>
            </div>
          ) : (
            // Reading mode
            dualLanguageMode ? (
              // Dual language mode - synchronized paragraphs
              <div className="space-y-8">
                {synchronizedParagraphs.map((pair, index) => (
                  <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
                    {/* Ukrainian paragraph */}
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none"
                      style={{ fontSize: `${fontSize}px`, lineHeight }}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeForRender(pair.uk)
                      }}
                    />

                    {/* English paragraph */}
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none"
                      style={{ fontSize: `${fontSize}px`, lineHeight }}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeForRender(pair.en)
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Single mode - one language
              <div
                className="prose prose-slate dark:prose-invert max-w-none"
                style={{ fontSize: `${fontSize}px`, lineHeight }}
                dangerouslySetInnerHTML={{
                  __html: sanitizeForRender(
                    language === 'uk'
                      ? (introChapter?.content_uk || introChapter?.content_en || "")
                      : (introChapter?.content_en || introChapter?.content_uk || "")
                  )
                }}
              />
            )
          )}
        </div>

        {/* Navigation - ховаємо на мобільних (є свайп) */}
        {!isMobile && (
          <div className="flex justify-between items-center">
            {prevChapter ? (
              <Button
                variant="secondary"
                onClick={() => navigate(getLocalizedPath(`/lib/${bookId}/intro/${prevChapter.slug}`))}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                {language === 'uk' ? prevChapter.title_uk : prevChapter.title_en}
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => navigate(getLocalizedPath(`/lib/${bookId}`))}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Назад до книги
              </Button>
            )}

            {nextChapter ? (
              <Button
                variant="secondary"
                onClick={() => navigate(getLocalizedPath(`/lib/${bookId}/intro/${nextChapter.slug}`))}
              >
                {language === 'uk' ? nextChapter.title_uk : nextChapter.title_en}
                <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => {
                  const firstChapterPath = book?.has_cantos
                    ? `/lib/${bookId}/1/1`
                    : `/lib/${bookId}/1`;
                  navigate(firstChapterPath);
                }}
              >
                Почати читання
                <ChevronLeft className="h-4 w-4 ml-2 rotate-180" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};