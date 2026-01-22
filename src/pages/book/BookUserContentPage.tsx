/**
 * BookUserContentPage - Route wrapper for UserContentPage component
 * Handles bookmarks, notes, and highlights tabs
 */

import { useParams, useSearchParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserContentPage } from "@/components/book/UserContentPage";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";

type ContentTab = "bookmarks" | "notes" | "highlights";

export const BookUserContentPage = () => {
  const { bookId, cantoNumber } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { language } = useLanguage();

  // Determine initial tab from URL path or query param
  const getTabFromPath = (): ContentTab => {
    const path = location.pathname;
    if (path.endsWith("/notes")) return "notes";
    if (path.endsWith("/highlights")) return "highlights";
    return "bookmarks";
  };

  const initialTab = (searchParams.get("tab") as ContentTab) || getTabFromPath();

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

  const bookTitle = language === "uk" ? book?.title_uk : book?.title_en;

  return (
    <UserContentPage
      bookTitle={bookTitle || ""}
      bookSlug={bookId || ""}
      cantoNumber={cantoNumber ? parseInt(cantoNumber) : undefined}
      initialTab={initialTab}
    />
  );
};

export default BookUserContentPage;
