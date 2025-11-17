import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useReaderSettings } from '@/hooks/useReaderSettings';
import { InlineTiptapEditor } from '@/components/InlineTiptapEditor';
import { toast } from '@/hooks/use-toast';
import { useState, useMemo, useEffect } from 'react';
import DOMPurify from 'dompurify';

export const IntroChapter = () => {
  const { bookId, slug } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { fontSize, lineHeight } = useReaderSettings();
  const [dualMode, setDualMode] = useState(() => 
    localStorage.getItem("vv_reader_dualMode") === "true"
  );

  useEffect(() => {
    const handler = () => {
      setDualMode(localStorage.getItem("vv_reader_dualMode") === "true");
    };
    window.addEventListener("vv-reader-prefs-changed", handler);
    return () => window.removeEventListener("vv-reader-prefs-changed", handler);
  }, []);

  // Editing state
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContentUa, setEditedContentUa] = useState("");
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

  const currentIndex = allIntroChapters.findIndex(ch => ch.slug === slug);
  const prevChapter = currentIndex > 0 ? allIntroChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allIntroChapters.length - 1 ? allIntroChapters[currentIndex + 1] : null;

  // Initialize edited content when intro chapter loads
  useEffect(() => {
    if (introChapter) {
      setEditedContentUa(introChapter.content_ua || "");
      setEditedContentEn(introChapter.content_en || "");
    }
  }, [introChapter]);

  // Save content mutation
  const saveContentMutation = useMutation({
    mutationFn: async () => {
      if (!introChapter?.id) return;
      const { error } = await supabase
        .from("intro_chapters")
        .update({
          content_ua: editedContentUa,
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
          <h1 className="text-4xl font-bold text-foreground mb-2">{bookTitle}</h1>
          <h2 className="text-2xl text-muted-foreground">{chapterTitle}</h2>
        </div>

        <Card className="p-8 mb-8">
          {/* Admin Edit Button */}
          {user && !isEditingContent && (
            <div className="mb-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingContent(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                {language === 'ua' ? 'Редагувати' : 'Edit'}
              </Button>
            </div>
          )}

          {isEditingContent ? (
            // Editing mode - InlineTiptapEditor
            <div className="space-y-4">
              <InlineTiptapEditor
                content={editedContentUa}
                onChange={setEditedContentUa}
                label="Українська"
              />
              <InlineTiptapEditor
                content={editedContentEn}
                onChange={setEditedContentEn}
                label="English"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => saveContentMutation.mutate()}
                  disabled={saveContentMutation.isPending}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {language === 'ua' ? 'Зберегти' : 'Save'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditingContent(false);
                    setEditedContentUa(introChapter?.content_ua || "");
                    setEditedContentEn(introChapter?.content_en || "");
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  {language === 'ua' ? 'Скасувати' : 'Cancel'}
                </Button>
              </div>
            </div>
          ) : (
            // Reading mode
            dualMode ? (
              // Dual mode - two columns with full HTML
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                {/* Ukrainian column */}
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none"
                  style={{ fontSize: `${fontSize}px`, lineHeight }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(introChapter?.content_ua || "")
                  }}
                />
                
                {/* English column */}
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none border-l border-border pl-6"
                  style={{ fontSize: `${fontSize}px`, lineHeight }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(introChapter?.content_en || "")
                  }}
                />
              </div>
            ) : (
              // Single mode - one language
              <div
                className="prose prose-slate dark:prose-invert max-w-none"
                style={{ fontSize: `${fontSize}px`, lineHeight }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    language === 'ua'
                      ? (introChapter?.content_ua || introChapter?.content_en || "")
                      : (introChapter?.content_en || introChapter?.content_ua || "")
                  )
                }}
              />
            )
          )}
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