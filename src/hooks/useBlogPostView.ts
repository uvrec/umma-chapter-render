import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBlogPostView = (postId?: string) => {
  useEffect(() => {
    if (!postId) return;

    const viewKey = `blog_post_viewed_${postId}`;
    const hasViewed = sessionStorage.getItem(viewKey);

    // якщо вже дивилися у цій сесії — нічого не робимо
    if (hasViewed) return;

    // робимо лічильник лише якщо вкладка активна
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const timer = setTimeout(async () => {
          try {
            const { error } = await supabase.rpc("increment_blog_post_views", {
              post_id: postId,
            });

            if (!error) {
              sessionStorage.setItem(viewKey, "true");
            }
          } catch (err) {
            console.error("Error tracking view:", err);
          }
        }, 3000);

        // очищення, якщо користувач покине сторінку раніше
        return () => clearTimeout(timer);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    // викликати одразу, якщо вкладка активна
    handleVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [postId]);
};
