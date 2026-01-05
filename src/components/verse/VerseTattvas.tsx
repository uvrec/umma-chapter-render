/**
 * VerseTattvas - Компонент для показу таттв (категорій) вірша
 *
 * Мінімалістичний, інтегрується в VedaReader
 */

import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useVerseTattvas } from "@/hooks/useTattvas";
import { Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerseTattvasProps {
  verseId: string;
  className?: string;
}

export function VerseTattvas({ verseId, className }: VerseTattvasProps) {
  const { language, t } = useLanguage();
  const { data: tattvas, isLoading } = useVerseTattvas(verseId);

  if (isLoading || !tattvas || tattvas.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Tag className="h-3.5 w-3.5 text-muted-foreground" />
      {tattvas.map((tattva) => (
        <Link
          key={tattva.tattva_id}
          to={`/tattva/${tattva.slug}`}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {language === "ua" ? tattva.name_uk : tattva.name_en}
        </Link>
      ))}
    </div>
  );
}
