/**
 * EkadashiList - Список усіх екадаші з описами
 */

import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEkadashis, useVaishnavMonths } from "@/hooks/useCalendar";
import { Moon, ChevronRight, BookOpen, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EkadashiInfo, VaishnavMonth } from "@/types/calendar";

export default function EkadashiList() {
  const { t, language } = useLanguage();
  const { ekadashis, groupedByMonth, isLoading, error } = useEkadashis();
  const { months } = useVaishnavMonths();

  // Отримати назву місяця
  const getMonthName = (monthId: number): string => {
    const month = months.find((m) => m.id === monthId);
    if (!month) return "";
    return language === "uk" ? month.name_uk : month.name_en;
  };

  // Отримати назву пакші
  const getPakshaName = (paksha: string): string => {
    if (paksha === "shukla") {
      return language === "uk" ? "Шукла (зростаючий місяць)" : "Shukla (waxing moon)";
    }
    return language === "uk" ? "Крішна (спадний місяць)" : "Krishna (waning moon)";
  };

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <p className="text-destructive">
          {language === "uk" ? "Помилка завантаження" : "Failed to load"}
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Заголовок */}
      <div className="space-y-2">
        <Link
          to="/calendar"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === "uk" ? "Назад до календаря" : "Back to calendar"}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Moon className="h-8 w-8 text-purple-600" />
          {language === "uk" ? "Екадаші" : "Ekadashi"}
        </h1>
        <p className="text-muted-foreground">
          {language === "uk"
            ? "Усі 26 екадаші року з описами слави з Падма Пурани"
            : "All 26 Ekadashis of the year with glory descriptions from Padma Purana"}
        </p>
      </div>

      {/* Вступ */}
      <Card className="border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <BookOpen className="h-8 w-8 text-purple-600 flex-shrink-0" />
            <div className="space-y-2">
              <h2 className="font-semibold">
                {language === "uk" ? "Що таке Екадаші?" : "What is Ekadashi?"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {language === "uk"
                  ? "Екадаші — це одинадцятий день місячного циклу, як під час зростаючого (Шукла), так і спадного (Крішна) Місяця. Відповідно до ведичних писань, піст на екадаші — це одна з найважливіших духовних практик для відданих Господа Вішну."
                  : "Ekadashi is the eleventh day of the lunar cycle, both during the waxing (Shukla) and waning (Krishna) moon. According to Vedic scriptures, fasting on Ekadashi is one of the most important spiritual practices for devotees of Lord Vishnu."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Список екадаші по місяцях */}
      <div className="space-y-8">
        {Array.from(groupedByMonth.entries()).map(([monthId, monthEkadashis]) => (
          <div key={monthId} className="space-y-3">
            {/* Заголовок місяця */}
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold">
                {getMonthName(monthId)}
              </h2>
            </div>

            {/* Екадаші місяця */}
            <div className="grid gap-3">
              {monthEkadashis.map((ekadashi) => (
                <EkadashiCard
                  key={ekadashi.id}
                  ekadashi={ekadashi}
                  language={language}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Якщо даних немає */}
      {ekadashis.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Moon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {language === "uk"
                ? "Дані про екадаші незабаром будуть додані"
                : "Ekadashi data will be added soon"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Компонент картки екадаші
interface EkadashiCardProps {
  ekadashi: EkadashiInfo;
  language: "uk" | "en";
}

function EkadashiCard({ ekadashi, language }: EkadashiCardProps) {
  const name = language === "uk" ? ekadashi.name_uk : ekadashi.name_en;
  const gloryTitle =
    language === "uk" ? ekadashi.glory_title_uk : ekadashi.glory_title_en;
  const presidingDeity =
    language === "uk"
      ? ekadashi.presiding_deity_uk
      : ekadashi.presiding_deity_en;

  const pakshaLabel =
    ekadashi.paksha === "shukla"
      ? language === "uk"
        ? "Шукла-пакша"
        : "Shukla Paksha"
      : language === "uk"
      ? "Крішна-пакша"
      : "Krishna Paksha";

  return (
    <Link to={`/calendar/ekadashi/${ekadashi.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              {/* Іконка */}
              <div
                className={`p-2 rounded-lg ${
                  ekadashi.paksha === "shukla"
                    ? "bg-amber-100 dark:bg-amber-900"
                    : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                <Moon
                  className={`h-5 w-5 ${
                    ekadashi.paksha === "shukla"
                      ? "text-amber-600"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                />
              </div>

              {/* Контент */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                  {ekadashi.is_major && (
                    <Badge variant="secondary" className="text-xs">
                      {language === "uk" ? "Головний" : "Major"}
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">{pakshaLabel}</p>

                {gloryTitle && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {gloryTitle}
                  </p>
                )}

                {presidingDeity && (
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {language === "uk" ? "Божество: " : "Deity: "}
                    {presidingDeity}
                  </p>
                )}
              </div>
            </div>

            {/* Стрілка */}
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
