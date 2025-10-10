// src/components/admin/RefreshFeedButton.tsx
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function RefreshFeedButton() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    try {
      setLoading(true);

      // можна викликати RPC (якщо треба безпосереднє оновлення MV):
      const { data, error } = await supabase.rpc("refresh_blog_feed");
      if (error) throw error;

      // оновлюємо кешовані списки
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts-infinite"] });

      toast({
        title: "Фід оновлено",
        description: `Оновлено: ${new Date(data?.refreshed_at || Date.now()).toLocaleString(
          "uk-UA",
        )} (≈${data?.duration_ms ?? 0} мс)`,
      });
    } catch (e: any) {
      toast({
        title: "Помилка оновлення",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleRefresh} disabled={loading} variant="outline">
      <RefreshCcw className="w-4 h-4 mr-2" />
      {loading ? "Оновлюю..." : "Оновити фід"}
    </Button>
  );
}
