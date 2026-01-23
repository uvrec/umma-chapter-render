import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ResponseLevelBadgeProps {
  level: 'direct' | 'synthesis' | 'insufficient';
  className?: string;
}

const levelConfig = {
  direct: {
    labelUk: 'Пряма цитата',
    labelEn: 'Direct Quote',
    icon: '🟢',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  synthesis: {
    labelUk: 'Синтез',
    labelEn: 'Synthesis',
    icon: '🟡',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  },
  insufficient: {
    labelUk: 'Недостатньо даних',
    labelEn: 'Insufficient Data',
    icon: '🔴',
    className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800',
  },
};

export function ResponseLevelBadge({ level, className }: ResponseLevelBadgeProps) {
  const { language } = useLanguage();
  const config = levelConfig[level];

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium border",
        config.className,
        className
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {language === 'uk' ? config.labelUk : config.labelEn}
    </Badge>
  );
}
