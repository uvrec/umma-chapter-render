import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  onCategoryChange?: (categorySlug: string | null) => void;
  selectedCategory?: string | null;
}

export const CategoryFilter = ({ onCategoryChange, selectedCategory }: CategoryFilterProps) => {
  const [selected, setSelected] = useState<string | null>(selectedCategory || null);

  // Завантажити категорії
  const { data: categories, isLoading } = useQuery({
    queryKey: ["audio-categories"],
    staleTime: 10 * 60 * 1000, // 10 хвилин
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audio_categories")
        .select("id, name_ua, slug, icon")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  const handleCategoryClick = (slug: string | null) => {
    setSelected(slug);
    onCategoryChange?.(slug);
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === null ? "default" : "outline"}
        size="sm"
        onClick={() => handleCategoryClick(null)}
        className="rounded-full"
      >
        Всі
      </Button>

      {categories?.map((category) => (
        <Button
          key={category.id}
          variant={selected === category.slug ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryClick(category.slug)}
          className="rounded-full"
        >
          {category.icon && <span className="mr-2">{category.icon}</span>}
          {category.name_ua}
        </Button>
      ))}
    </div>
  );
};
