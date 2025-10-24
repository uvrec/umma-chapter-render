// CantoOverview.tsx - список глав канту з підтримкою dualMode

import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardDescription } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

export const CantoOverview = () => {
  const { bookId, cantoNumber } = useParams();
  const { language, t } = useLanguage();

  // Читаємо dualMode з localStorage
  const [dualMode, setDualMode] = useState(() => localStorage.getItem("vv_reader_dualMode") === "true");

  // Слухаємо зміни з GlobalSettingsPanel
  useEffect(() => {
    const handler = () => {
      setDualMode(localStorage.getItem("vv_reader_dualMode") === "true");
    };
    window.addEventListener("vv-reader-prefs-changed", handler);
    return () => window.removeEventListener("vv-reader-prefs-changed", handler);
  }, []);

  const { data: book } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase.from("books").select("*").eq("slug", bookId).single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookId,
  });

  const { data: canto, isLoading: cantoLoading } = useQuery({
    queryKey: ["canto", book?.id, cantoNumber],
    queryFn: async () => {
      if (!book?.id || !cantoNumber) return null;
      const { data, error } = await supabase
        .from("cantos")
        .select("*")
        .eq("book_id", book.id)
        .eq("canto_number", parseInt(cantoNumber))
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && !!cantoNumber,
  });

  const { data: chapters = [], isLoading: chaptersLoading } = useQuery({
    queryKey: ["chapters", canto?.id],
    queryFn: async () => {
      if (!canto?.id) return [];
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("book_id", book?.id)
        .like("chapter_number", `${cantoNumber}.%`)
        .order("chapter_number");
      if (error) throw error;
      return data || [];
    },
    enabled: !!canto?.id,
  });

  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;
  const cantoTitle = language === "ua" ? canto?.title_ua : canto?.title_en;
  const cantoDescription = language === "ua" ? canto?.description_ua : canto?.description_en;

  if (cantoLoading || chaptersLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p>{t("Завантаження...", "Loading...")}</p>
        </main>
      </div>
    );
  }

  if (!canto) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">{t("Пісню не знайдено", "Canto not found")}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: t("Бібліотека", "Library"), href: "/library" },
            { label: bookTitle || "", href: `/veda-reader/${bookId}` },
            {
              label: `${t("Пісня", "Canto")} ${cantoNumber}: ${cantoTitle}`,
            },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {t("Пісня", "Canto")} {cantoNumber}: {cantoTitle}
          </h1>
          {cantoDescription && <p className="text-lg text-muted-foreground">{cantoDescription}</p>}
        </div>

        <div className="space-y-1">
          {chapters && chapters.length > 0 ? (
            chapters.map((chapter) => {
              const chapterTitleUa = chapter.title_ua;
              const chapterTitleEn = chapter.title_en;
              const chapterNum = chapter.chapter_number.split(".")[1]; // Отримуємо номер глави з "2.1" -> "1"

              return dualMode ? (
                // Side-by-side для chapters
                <Link
                  key={chapter.id}
                  to={`/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapterNum}`}
                  className="block py-3 px-4 transition-all hover:bg-primary/5 rounded"
                >
                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <span className="text-lg font-bold text-primary whitespace-nowrap">Глава {chapterNum}</span>
                      <span className="text-lg text-foreground">{chapterTitleUa}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-lg font-bold text-primary whitespace-nowrap">Chapter {chapterNum}</span>
                      <span className="text-lg text-foreground">{chapterTitleEn}</span>
                    </div>
                  </div>
                </Link>
              ) : (
                // Одна мова для chapters
                <Link
                  key={chapter.id}
                  to={`/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapterNum}`}
                  className="block py-3 px-4 transition-all hover:bg-primary/5 rounded"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-primary">
                      {t("Глава", "Chapter")} {chapterNum}
                    </span>
                    <span className="text-lg text-foreground">
                      {language === "ua" ? chapterTitleUa : chapterTitleEn}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground">{t("Ще немає глав", "No chapters yet")}</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CantoOverview;
