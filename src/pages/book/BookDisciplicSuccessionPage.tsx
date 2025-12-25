/**
 * BookDisciplicSuccessionPage - Route wrapper for DisciplicSuccessionPage component
 */

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DisciplicSuccessionPage } from "@/components/book/DisciplicSuccessionPage";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";

export const BookDisciplicSuccessionPage = () => {
  const { bookId, cantoNumber } = useParams();
  const { language } = useLanguage();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("slug, title_ua, title_en")
        .eq("slug", bookId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Завантаження...</p>
        </div>
      </div>
    );
  }

  const bookTitle = language === "ua" ? book?.title_ua : book?.title_en;

  return (
    <DisciplicSuccessionPage
      bookTitle={bookTitle || ""}
      bookSlug={bookId || ""}
      cantoNumber={cantoNumber ? parseInt(cantoNumber) : undefined}
    />
  );
};

export default BookDisciplicSuccessionPage;
