// src/components/admin/RefreshFeedButton.tsx
import { RefreshFeedButton } from "@/components/admin/RefreshFeedButton";
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

      // оновлюємо повʼязані списки/фіди
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts-infinite"] });

      toast({
        title: "Фід оновлено",
        description: `Оновлено: ${new Date().toLocaleString("uk-UA")}`,
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
