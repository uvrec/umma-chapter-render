// src/components/admin/RefreshFeedButton.tsx
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { toast } from "@/hooks/use-toast";

export function RefreshFeedButton() {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("refresh_mv_blog_recent_published_rpc");
      if (error) throw error;

      toast({
        title: "Фід оновлено",
        description: data?.concurrent
          ? "REFRESH виконано CONCURRENTLY."
          : "REFRESH виконано (звичайний режим).",
      });
    } catch (e: any) {
      toast({
        title: "Помилка",
        description: e?.message ?? "Не вдалося оновити фід",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleRefresh} disabled={loading}>
      {loading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
      {loading ? "Оновлюю..." : "Оновити фід"}
    </Button>
  );
}
