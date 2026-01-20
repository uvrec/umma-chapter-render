import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Highlight {
  id: string;
  user_id: string;
  book_id: string;
  canto_id?: string;
  chapter_id: string;
  verse_id?: string;
  verse_number?: string;
  selected_text: string;
  context_before?: string;
  context_after?: string;
  highlight_color: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  book?: {
    slug: string;
    title_uk?: string;
    title_en?: string;
  };
  chapter?: {
    chapter_number: number;
    title_uk?: string;
    title_en?: string;
  };
}

export interface CreateHighlightParams {
  book_id: string;
  canto_id?: string;
  chapter_id: string;
  verse_id?: string;
  verse_number?: string;
  selected_text: string;
  context_before?: string;
  context_after?: string;
  highlight_color?: string;
  notes?: string;
}

// ✅ REMEMBER BETTER: Group highlights by time period (session/day)
export interface HighlightGroup {
  date: string; // ISO date string
  label: string; // "Today", "Yesterday", "Jan 15, 2025"
  highlights: Highlight[];
}

// ✅ Smart grouping: highlights made within SESSION_THRESHOLD are grouped together
const SESSION_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Group highlights by reading sessions (highlights made within 30 min of each other)
 * and then by date for timeline display
 */
export function groupHighlightsByTimeline(highlights: Highlight[], language: "uk" | "en" = "uk"): HighlightGroup[] {
  if (!highlights || highlights.length === 0) return [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  // Sort by created_at descending
  const sorted = [...highlights].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const groups: HighlightGroup[] = [];
  let currentGroup: HighlightGroup | null = null;
  let lastTimestamp: number | null = null;

  for (const highlight of sorted) {
    const timestamp = new Date(highlight.created_at).getTime();
    const highlightDate = new Date(highlight.created_at);
    const dateKey = highlightDate.toISOString().split("T")[0];

    // Format date label
    let label: string;
    if (highlightDate >= today) {
      const time = highlightDate.toLocaleTimeString(language === "uk" ? "uk-UA" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      label = language === "uk" ? `Сьогодні | ${time}` : `Today | ${time}`;
    } else if (highlightDate >= yesterday) {
      const time = highlightDate.toLocaleTimeString(language === "uk" ? "uk-UA" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      label = language === "uk" ? `Вчора | ${time}` : `Yesterday | ${time}`;
    } else {
      label = highlightDate.toLocaleDateString(language === "uk" ? "uk-UA" : "en-US", {
        month: "short",
        day: "numeric",
        year: highlightDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Check if this highlight belongs to current session (within 30 min)
    const isSameSession = lastTimestamp && (lastTimestamp - timestamp) < SESSION_THRESHOLD_MS;
    const isSameDate = currentGroup?.date === dateKey;

    if (isSameSession && isSameDate && currentGroup) {
      // Add to current session group
      currentGroup.highlights.push(highlight);
    } else {
      // Start new group
      currentGroup = {
        date: dateKey,
        label,
        highlights: [highlight],
      };
      groups.push(currentGroup);
    }

    lastTimestamp = timestamp;
  }

  return groups;
}

/**
 * Get verse reference string for display
 */
export function getHighlightReference(highlight: Highlight, language: "uk" | "en" = "uk"): string {
  const bookName = highlight.book
    ? (language === "uk" ? highlight.book.title_uk : highlight.book.title_en) || highlight.book.slug.toUpperCase()
    : "";

  const chapterNum = highlight.chapter?.chapter_number || "";
  const verseNum = highlight.verse_number || "";

  if (verseNum) {
    return `${bookName} ${chapterNum}.${verseNum}`;
  } else if (chapterNum) {
    return `${bookName} ${language === "uk" ? "Глава" : "Chapter"} ${chapterNum}`;
  }
  return bookName;
}

export const useHighlights = (chapterId?: string, fetchAll?: boolean) => {
  const queryClient = useQueryClient();

  // ✅ Enhanced query with book/chapter joins for timeline display
  const { data: highlights, isLoading } = useQuery({
    queryKey: ["highlights", chapterId, fetchAll],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // FK constraints exist in DB but TypeScript types are outdated (Relationships: [])
      // Using `as unknown as` to bypass type checking until types.ts is regenerated
      let query = supabase
        .from("highlights")
        .select(`
          *,
          book:books(slug, title_uk, title_en),
          chapter:chapters(chapter_number, title_uk, title_en)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (chapterId && !fetchAll) {
        query = query.eq("chapter_id", chapterId);
      }

      const { data, error } = await query;
      if (error) throw error;
      // Bypass TypeScript - FK exists in DB, types.ts just needs regeneration
      return data as unknown as Highlight[];
    },
    enabled: fetchAll || !!chapterId,
  });

  const createHighlight = useMutation({
    mutationFn: async (params: CreateHighlightParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("highlights")
        .insert({
          user_id: user.id,
          ...params,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
      toast.success("Виділення збережено");
    },
    onError: (error: Error) => {
      console.error("Error creating highlight:", error);
      if (error.message === "Not authenticated") {
        toast.error("Увійдіть в акаунт, щоб зберігати виділення");
      } else {
        toast.error("Помилка при збереженні виділення");
      }
    },
  });

  const deleteHighlight = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("highlights")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
      toast.success("Виділення видалено");
    },
    onError: (error) => {
      console.error("Error deleting highlight:", error);
      toast.error("Помилка при видаленні виділення");
    },
  });

  const updateHighlight = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase
        .from("highlights")
        .update({ notes })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["highlights"] });
      toast.success("Нотатку оновлено");
    },
    onError: (error) => {
      console.error("Error updating highlight:", error);
      toast.error("Помилка при оновленні нотатки");
    },
  });

  return {
    highlights,
    isLoading,
    createHighlight: createHighlight.mutate,
    deleteHighlight: deleteHighlight.mutate,
    updateHighlight: updateHighlight.mutate,
  };
};
