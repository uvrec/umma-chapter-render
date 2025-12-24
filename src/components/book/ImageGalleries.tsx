/**
 * ImageGalleries - Image galleries for book
 * Based on BBT reference app design, adapted to VedaVOICE amber/craft theme
 */

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn, Download } from "lucide-react";
import { BookReaderHeader } from "@/components/BookReaderHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  captionEn?: string;
}

interface Gallery {
  id: string;
  title: string;
  titleEn: string;
  description?: string;
  descriptionEn?: string;
  coverImage: string;
  images: GalleryImage[];
}

interface ImageGalleriesProps {
  bookTitle: string;
  bookSlug: string;
  cantoNumber?: number;
  galleries?: Gallery[];
}

// Sample galleries data (can be replaced with database data)
const SAMPLE_GALLERIES: Gallery[] = [
  {
    id: "paintings",
    title: "Картини",
    titleEn: "Paintings",
    description: "Ілюстрації до книг Шріли Прабгупади",
    descriptionEn: "Illustrations from Srila Prabhupada's books",
    coverImage: "/placeholder.svg",
    images: [
      {
        id: "1",
        src: "/placeholder.svg",
        alt: "Painting 1",
        caption: "Крішна грає на флейті",
        captionEn: "Krishna playing flute",
      },
      {
        id: "2",
        src: "/placeholder.svg",
        alt: "Painting 2",
        caption: "Арджуна і Крішна на полі битви",
        captionEn: "Arjuna and Krishna on the battlefield",
      },
    ],
  },
  {
    id: "photos",
    title: "Фотографії",
    titleEn: "Photos",
    description: "Історичні фотографії",
    descriptionEn: "Historical photos",
    coverImage: "/placeholder.svg",
    images: [
      {
        id: "1",
        src: "/placeholder.svg",
        alt: "Photo 1",
        caption: "Шріла Прабгупада",
        captionEn: "Srila Prabhupada",
      },
    ],
  },
];

export const ImageGalleries = ({
  bookTitle,
  bookSlug,
  cantoNumber,
  galleries = SAMPLE_GALLERIES,
}: ImageGalleriesProps) => {
  const { language, t } = useLanguage();
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (gallery: Gallery, imageIndex: number) => {
    setSelectedGallery(gallery);
    setSelectedImageIndex(imageIndex);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToPrevious = () => {
    if (selectedGallery) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? selectedGallery.images.length - 1 : prev - 1
      );
    }
  };

  const goToNext = () => {
    if (selectedGallery) {
      setSelectedImageIndex((prev) =>
        prev === selectedGallery.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "Escape") closeLightbox();
  };

  return (
    <div className="min-h-screen bg-background">
      <BookReaderHeader
        bookTitle={bookTitle}
        bookSlug={bookSlug}
        cantoNumber={cantoNumber}
        introTitle={t("Галерея зображень", "Image Galleries")}
      />

      <main className="container mx-auto px-4 py-6">
        {galleries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <ZoomIn className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {t("Немає галерей", "No Galleries")}
            </h2>
            <p className="text-muted-foreground max-w-md">
              {t(
                "Галереї зображень для цієї книги ще не додані.",
                "Image galleries for this book have not been added yet."
              )}
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">
              {t("Галереї", "Galleries")}
            </h1>

            {/* Gallery grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleries.map((gallery) => (
                <button
                  key={gallery.id}
                  onClick={() => openLightbox(gallery, 0)}
                  className="group relative overflow-hidden rounded-lg border bg-card hover:border-primary transition-colors"
                >
                  {/* Cover image */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={gallery.coverImage}
                      alt={language === "ua" ? gallery.title : gallery.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Gallery info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {language === "ua" ? gallery.title : gallery.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {gallery.images.length}{" "}
                      {t("зображень", "images")}
                    </p>
                    {(gallery.description || gallery.descriptionEn) && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {language === "ua" ? gallery.description : gallery.descriptionEn}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Gallery view - shows all images in selected gallery */}
            {selectedGallery && !isLightboxOpen && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {language === "ua" ? selectedGallery.title : selectedGallery.titleEn}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedGallery(null)}
                  >
                    {t("Закрити", "Close")}
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedGallery.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => openLightbox(selectedGallery, index)}
                      className="group relative aspect-square overflow-hidden rounded-lg border hover:border-primary transition-colors"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent
          className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 border-0 bg-black/95"
          onKeyDown={handleKeyDown}
        >
          {selectedGallery && (
            <div className="relative w-full h-full flex flex-col">
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                <div className="text-white">
                  <h3 className="font-medium">
                    {language === "ua" ? selectedGallery.title : selectedGallery.titleEn}
                  </h3>
                  <p className="text-sm opacity-80">
                    {selectedImageIndex + 1} / {selectedGallery.images.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => {
                      // Download functionality could be added here
                    }}
                  >
                    <Download className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={closeLightbox}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Image */}
              <div className="flex-1 flex items-center justify-center p-4">
                <img
                  src={selectedGallery.images[selectedImageIndex].src}
                  alt={selectedGallery.images[selectedImageIndex].alt}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Caption */}
              {(selectedGallery.images[selectedImageIndex].caption ||
                selectedGallery.images[selectedImageIndex].captionEn) && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                  <p className="text-white text-center">
                    {language === "ua"
                      ? selectedGallery.images[selectedImageIndex].caption
                      : selectedGallery.images[selectedImageIndex].captionEn}
                  </p>
                </div>
              )}

              {/* Navigation arrows */}
              {selectedGallery.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                    onClick={goToPrevious}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                    onClick={goToNext}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}

              {/* Thumbnail strip */}
              {selectedGallery.images.length > 1 && (
                <div className="absolute bottom-16 left-0 right-0 px-4">
                  <div className="flex justify-center gap-2 overflow-x-auto py-2">
                    {selectedGallery.images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          "w-12 h-12 rounded overflow-hidden border-2 transition-all flex-shrink-0",
                          index === selectedImageIndex
                            ? "border-primary opacity-100"
                            : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGalleries;
