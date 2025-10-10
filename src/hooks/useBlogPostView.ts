import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBlogPostView = (postId: string | undefined) => {
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
          }
        } catch (error) {
          console.error("Error tracking view:", error);
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [postId]);
};
