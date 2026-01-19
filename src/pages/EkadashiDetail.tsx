/**
 * EkadashiDetail - Детальна сторінка екадаші з текстами Падма Пурани
 */

import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEkadashi } from "@/hooks/useCalendar";
import {
  Moon,
  ArrowLeft,
  BookOpen,
  Calendar,
  Utensils,
  Gift,
  Clock,
  Star,
  ScrollText,
} from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

export default function EkadashiDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { ekadashi, formattedEkadashi, upcomingDates, isLoading, error } =
    useEkadashi(slug || "");

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-96" />
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  if (error || !ekadashi || !formattedEkadashi) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <Link
          to="/calendar/ekadashi"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {language === "uk" ? "Назад до списку" : "Back to list"}
        </Link>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-destructive">
              {language === "uk"
                ? "Екадаші не знайдено"
                : "Ekadashi not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Пакша
  const pakshaLabel =
    ekadashi.paksha === "shukla"
      ? language === "uk"
        ? "Шукла-пакша (зростаючий місяць)"
        : "Shukla Paksha (waxing moon)"
      : language === "uk"
      ? "Крішна-пакша (спадний місяць)"
      : "Krishna Paksha (waning moon)";

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Навігація */}
      <Link
        to="/calendar/ekadashi"
        className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        {language === "uk" ? "Усі екадаші" : "All Ekadashis"}
      </Link>

      {/* Заголовок */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-xl ${
              ekadashi.paksha === "shukla"
                ? "bg-amber-100 dark:bg-amber-900"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <Moon
              className={`h-8 w-8 ${
                ekadashi.paksha === "shukla"
                  ? "text-amber-600"
                  : "text-slate-600 dark:text-slate-300"
              }`}
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {formattedEkadashi.name}
            </h1>
            <p className="text-muted-foreground">{pakshaLabel}</p>
          </div>
        </div>

        {/* Мітки */}
        <div className="flex flex-wrap gap-2">
          {ekadashi.is_major && (
            <Badge className="bg-purple-600">
              <Star className="h-3 w-3 mr-1" />
              {language === "uk" ? "Головний екадаші" : "Major Ekadashi"}
            </Badge>
          )}
          {formattedEkadashi.presidingDeity && (
            <Badge variant="outline">
              {language === "uk" ? "Божество: " : "Deity: "}
              {formattedEkadashi.presidingDeity}
            </Badge>
          )}
        </div>
      </div>

      {/* Слава екадаші (з Падма Пурани) */}
      {(formattedEkadashi.gloryTitle || formattedEkadashi.gloryText) && (
        <Card className="border-purple-200 dark:border-purple-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <ScrollText className="h-5 w-5" />
              {formattedEkadashi.gloryTitle ||
                (language === "uk"
                  ? "Слава екадаші"
                  : "Glory of Ekadashi")}
            </CardTitle>
            {ekadashi.glory_source && (
              <p className="text-sm text-muted-foreground">
                {ekadashi.glory_source}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {formattedEkadashi.gloryText && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {formattedEkadashi.gloryText}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Історія */}
      {formattedEkadashi.story && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {language === "uk" ? "Історія" : "Story"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {formattedEkadashi.story}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Правила посту */}
      {formattedEkadashi.fastingRules && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              {language === "uk" ? "Правила посту" : "Fasting Rules"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {formattedEkadashi.fastingRules}
              </p>
            </div>

            {ekadashi.breaking_fast_time && (
              <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>
                    {language === "uk" ? "Парана: " : "Breaking fast: "}
                  </strong>
                  {ekadashi.breaking_fast_time}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Рекомендовані активності */}
      {formattedEkadashi.recommendedActivities && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              {language === "uk"
                ? "Рекомендовані активності"
                : "Recommended Activities"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {formattedEkadashi.recommendedActivities}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Благословення */}
      {formattedEkadashi.benefits && (
        <Card className="border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <Gift className="h-5 w-5" />
              {language === "uk" ? "Благословення" : "Benefits"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed">
                {formattedEkadashi.benefits}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Мантри */}
      {ekadashi.mantras && ekadashi.mantras.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "uk" ? "Мантри" : "Mantras"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ekadashi.mantras.map((mantra, i) => (
                <p
                  key={i}
                  className="font-mono text-sm bg-muted p-2 rounded"
                >
                  {mantra}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Наступні дати */}
      {upcomingDates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {language === "uk" ? "Наступні дати" : "Upcoming Dates"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {upcomingDates.map((date) => (
                <Badge key={date} variant="secondary" className="text-sm">
                  {format(new Date(date), "d MMMM yyyy", {
                    locale: language === "uk" ? uk : undefined,
                  })}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Навігація */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" asChild>
          <Link to="/calendar/ekadashi">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === "uk" ? "Усі екадаші" : "All Ekadashis"}
          </Link>
        </Button>
        <Button asChild>
          <Link to="/calendar">
            <Calendar className="h-4 w-4 mr-2" />
            {language === "uk" ? "До календаря" : "To Calendar"}
          </Link>
        </Button>
      </div>
    </div>
  );
}
