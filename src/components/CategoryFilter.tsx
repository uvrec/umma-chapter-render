import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  className?: string;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  className,
}: CategoryFilterProps) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["audio-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_categories")
        .select("id, name_ua, slug")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !categories || categories.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(null)}
      >
        Усі категорії
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
        >
          {category.name_ua}
        </Button>
      ))}
    </div>
  );
}
