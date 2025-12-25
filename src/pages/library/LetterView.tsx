/**
 * Перегляд окремого листа Прабгупади
 *
 * Маршрут: /library/letters/:slug
 *
 * Функціонал:
 * - Відображення метаданих (отримувач, дата, локація, адреса)
 * - Повний текст листа
 * - Підсвітка санскритських термінів
 * - Мовний переключач (UA/EN)
 */

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Loader2,
} from "lucide-react";
import type { Letter } from "@/types/letter";


export const LetterView = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Мовні налаштування
  const [language, setLanguage] = useState<"ua" | "en">("ua");

  // Завантажити лист
  const { data: letter, isLoading } = useQuery({
    queryKey: ["letter", slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("letters")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as Letter;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Лист не знайдено</h2>
            <Button onClick={() => navigate("/library/letters")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Повернутися до списку
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const recipient = language === "ua" && letter.recipient_ua
    ? letter.recipient_ua
    : letter.recipient_en;

  const location = language === "ua" && letter.location_ua
    ? letter.location_ua
    : letter.location_en;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Навігація */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/library/letters")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            До списку листів
          </Button>

          <div className="flex gap-2">
            <Button
              variant={language === "ua" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("ua")}
            >
              Українська
            </Button>
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
            >
              English
            </Button>
          </div>
        </div>

        {/* Метадані листа */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-start gap-3">
              <User className="w-6 h-6 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-2xl mb-2">Лист до {recipient}</div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-normal">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(letter.letter_date).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {location}
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          {/* Reference та адреса */}
          {(letter.reference || letter.address_block) && (
            <CardContent className="space-y-4">
              {letter.reference && (
                <div>
                  <Badge variant="outline">Reference: {letter.reference}</Badge>
                </div>
              )}

              {letter.address_block && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">
                    АДРЕСА:
                  </div>
                  <div className="text-sm whitespace-pre-line font-mono">
                    {letter.address_block}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Текст листа */}
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground whitespace-pre-wrap leading-relaxed">
              {language === "ua" && letter.content_ua
                ? letter.content_ua
                : letter.content_en}
            </div>
          </CardContent>
        </Card>

        {/* Додаткова інформація */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Це історичний лист А.Ч. Бгактіведанти Свамі Прабгупади
          </p>
          <p className="mt-1">
            Джерело:{" "}
            <a
              href={`https://vedabase.io/en/library/letters/${letter.slug}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Vedabase
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};
