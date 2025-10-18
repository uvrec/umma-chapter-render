// src/pages/LectureReader.tsx
// Оновлена сторінка для читання лекцій з inline editing

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { UniversalInlineEditor } from "@/components/UniversalInlineEditor";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

export default function LectureReader() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const supabase = useSupabaseClient();
  const { language } = useLanguage();

  // Завантажуємо главу (лекцію)
  const { data: chapter, isLoading } = useQuery({
    queryKey: ["chapter", chapterId],
    enabled: !!chapterId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select(`
          *,
          book:books(
            id,
            title_ua,
            title_en,
            slug
          )
        `)
        .eq("id", chapterId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Лекцію не знайдено</h1>
            <p className="text-muted-foreground">
              Перевірте URL або поверніться на головну
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const title = language === "ua" ? chapter.title_ua : chapter.title_en;
  const content = language === "ua" ? chapter.content_ua : chapter.content_en;
  const bookTitle = language === "ua" 
    ? chapter.book?.title_ua 
    : chapter.book?.title_en;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {/* Хлібні крихти */}
        <div className="text-sm text-muted-foreground mb-4">
          <span>{bookTitle}</span>
          {" / "}
          <span>Лекція {chapter.chapter_number}</span>
        </div>

        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {title || `Лекція ${chapter.chapter_number}`}
          </h1>
          
          {chapter.title_en && language === "ua" && (
            <p className="text-muted-foreground italic">
              {chapter.title_en}
            </p>
          )}
        </div>

        {/* Контент з inline editing */}
        <div className="prose prose-lg max-w-none">
          {content ? (
            <UniversalInlineEditor
              table="chapters"
              recordId={chapter.id}
              field={language === "ua" ? "content_ua" : "content_en"}
              initialValue={content}
              label={`Контент лекції (${language.toUpperCase()})`}
              language={language}
              showToggle={true}
              className="min-h-[400px]"
            />
          ) : (
            <div className="p-8 text-center border rounded-lg bg-muted/20">
              <p className="text-muted-foreground mb-4">
                Контент ще не завантажено
              </p>
              <p className="text-sm text-muted-foreground">
                Використайте поетапний імпортер для завантаження лекції
              </p>
            </div>
          )}
        </div>

        {/* Метадані */}
        <div className="mt-8 pt-8 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Книга:</span>
              <span className="ml-2 font-medium">{bookTitle}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Номер:</span>
              <span className="ml-2 font-medium">{chapter.chapter_number}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Тип:</span>
              <span className="ml-2 font-medium">
                {chapter.chapter_type === "text" ? "Лекція" : "Глава"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Слів:</span>
              <span className="ml-2 font-medium">
                {content ? content.split(/\s+/).length : 0}
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
