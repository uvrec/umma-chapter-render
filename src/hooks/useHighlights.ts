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

export const useHighlights = (chapterId?: string) => {
  const queryClient = useQueryClient();

  const { data: highlights, isLoading } = useQuery({
    queryKey: ["highlights", chapterId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      let query = supabase
        .from("highlights")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (chapterId) {
        query = query.eq("chapter_id", chapterId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Highlight[];
    },
    enabled: !!chapterId,
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
    onError: (error) => {
      console.error("Error creating highlight:", error);
      toast.error("Помилка при збереженні виділення");
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
