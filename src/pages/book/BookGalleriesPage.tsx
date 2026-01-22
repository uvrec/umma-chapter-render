/**
 * BookGalleriesPage - Route wrapper for ImageGalleries component
 */

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ImageGalleries } from "@/components/book/ImageGalleries";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/Header";

export const BookGalleriesPage = () => {
  const { bookId, cantoNumber } = useParams();
  const { language } = useLanguage();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("slug, title_uk, title_en")
        .eq("slug", bookId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!bookId,
  });

  // TODO: Fetch actual galleries from database when available
  // const { data: galleries } = useQuery({
  //   queryKey: ["book-galleries", bookId, cantoNumber],
  //   queryFn: async () => {
  //     const { data, error } = await supabase
  //       .from("book_galleries")
  //       .select("*")
  //       .eq("book_slug", bookId);
  //     if (error) throw error;
  //     return data;
  //   },
  //   enabled: !!bookId,
  // });

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
    <ImageGalleries
      bookTitle={bookTitle || ""}
      bookSlug={bookId || ""}
      cantoNumber={cantoNumber ? parseInt(cantoNumber) : undefined}
      // galleries={galleries} // Pass actual galleries when available
    />
  );
};

export default BookGalleriesPage;
