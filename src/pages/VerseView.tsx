import { useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VersesDisplay } from "@/components/VersesDisplay";
import type { VerseData } from "@/types/verse-display";
import { useLanguage } from "@/contexts/LanguageContext";

// Renders a single verse page using the universal VersesDisplay
export default function VerseView() {
  const { bookId, verseNumber } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  // Derive chapter/verse indexes from a code like SB.1.1.1 or use plain number
  const parsed = useMemo(() => {
    const raw = verseNumber || "";
    const m = raw.match(/(\d+)\.(\d+)\.(\d+)/);
    if (m) return { chapter: parseInt(m[2], 10), idx: parseInt(m[3], 10) };
    // fallback: treat verseNumber as chapter-idx with hyphen e.g. 1-2
    const parts = raw.split(/[.-]/).map((x) => parseInt(x, 10)).filter((n) => !isNaN(n));
    return { chapter: parts[0] || 1, idx: parts[1] || 1 };
  }, [verseNumber]);

  // Fetch book
  const { data: book } = useQuery({
    queryKey: ["book", bookId],
    enabled: !!bookId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, slug, title_ua, title_en, has_cantos")
        .eq("slug", bookId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Fetch matching chapter (assume simple structure without cantos for this route)
  const { data: chapter } = useQuery({
    queryKey: ["chapter-for-verse", book?.id, parsed.chapter],
    enabled: !!book?.id && !!parsed.chapter,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("id, chapter_number, title_ua, title_en")
        .eq("book_id", book!.id)
        .eq("chapter_number", parsed.chapter)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Fetch verses of the chapter to locate one by index
  const { data: verses = [], isLoading } = useQuery({
    queryKey: ["verses-for-verse-view", chapter?.id],
    enabled: !!chapter?.id,
    queryFn: async () => {
      // Cast to any to include display_blocks not present in generated types yet
      const { data, error } = await (supabase as any)
        .from("verses")
        .select(
          "id, verse_number, sanskrit, transliteration, synonyms_ua, synonyms_en, translation_ua, translation_en, commentary_ua, commentary_en, display_blocks"
        )
        .eq("chapter_id", chapter!.id);
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const target = useMemo(() => {
    if (!verses.length) return null;
    // verse_number format can be 1.1.1 / 1.2 etc; pick element with matching last segment
    const candidate = verses.find((v) => {
      const last = String(v.verse_number || "").split(/\./).pop();
      return parseInt(last || "0", 10) === parsed.idx;
    });
    return candidate || null;
  }, [verses, parsed.idx]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [verseNumber]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
          {t("Завантаження...", "Loading...")}
        </div>
      </div>
    );
  }

  if (!book || !chapter || !target) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("Вірш не знайдено", "Verse not found")}</h1>
          <Link to={`/verses/${bookId}`}>
            <Button variant="outline">{t("Повернутися до читання", "Back to reading")}</Button>
          </Link>
        </main>
      </div>
    );
  }

  // Simple previous/next within the chapter based on parsed.idx
  const sorted = [...verses].sort((a, b) => {
    const pa = String(a.verse_number || "").split(".").map((n) => parseInt(n, 10));
    const pb = String(b.verse_number || "").split(".").map((n) => parseInt(n, 10));
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const av = pa[i] || 0;
      const bv = pb[i] || 0;
      if (av !== bv) return av - bv;
    }
    return 0;
  });
  const idx = sorted.findIndex((v) => v.id === target.id);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const title = language === "ua" ? chapter.title_ua : chapter.title_en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold">{title} • {verseNumber}</h1>
        </div>

        <VersesDisplay
          language={language === 'ua' ? 'ua' : 'en'}
          verse={target as VerseData}
        />

        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Button
            variant="secondary"
            disabled={!prev}
            onClick={() => {
              if (!prev) return; const last = String(prev.verse_number || '').split('.').pop();
              navigate(`/verses/${bookId}/${parsed.chapter}.${last}`);
            }}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-5 w-5" /> {t("Попередній вірш", "Previous verse")}
          </Button>

          <Button
            variant="secondary"
            disabled={!next}
            onClick={() => {
              if (!next) return; const last = String(next.verse_number || '').split('.').pop();
              navigate(`/verses/${bookId}/${parsed.chapter}.${last}`);
            }}
            className="flex items-center gap-2"
          >
            {t("Наступний вірш", "Next verse")} <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </main>
    </div>
  );
}
