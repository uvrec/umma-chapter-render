import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Відстеження перегляду блогу через RPC increment_blog_post_views
 * - Одноразово за сесію (через sessionStorage)
 * - Опціонально викликає onIncrement для миттєвого оновлення UI
 */
export const useBlogPostView = (postId: string | undefined, onIncrement?: () => void) => {
  useEffect(() => {
    if (!postId) return;

    const viewKey = `blog_post_viewed_${postId}`;
    const hasViewed = sessionStorage.getItem(viewKey);

    if (!hasViewed) {
      const timer = setTimeout(async () => {
        try {
          const { error } = await supabase.rpc("increment_blog_post_views", {
            post_id: postId,
          });

          if (!error) {
            sessionStorage.setItem(viewKey, "true");
            onIncrement?.(); // миттєво збільшити на фронті
          }
        } catch (err) {
          console.error("Error tracking blog view:", err);
        }
      }, 3000); // викликається через 3 секунди перебування на сторінці

      return () => clearTimeout(timer);
    }
  }, [postId, onIncrement]);
};
