--- a/src/pages/NewHome.tsx
+++ b/src/pages/NewHome.tsx
@@
-import React, { useMemo, useRef, useState } from "react";
-import { useQuery } from "@tanstack/react-query";
-import { supabase } from "@/integrations/supabase/client";
+import React, { useMemo, useRef, useState } from "react";
+import { useQuery } from "@tanstack/react-query";
+import { supabase } from "@/integrations/supabase/client";
+import { useLanguage } from "@/contexts/LanguageContext";
@@
-// --- Hero Section (з карткою "Продовжити") ---
-function Hero() {
-  const { currentTrack, isPlaying, togglePlay, currentTime, duration } = useAudio();
-
-  // Функція для форматування часу
-  const formatTime = (seconds: number) => {
-    if (!Number.isFinite(seconds)) return "00:00";
-    const m = Math.floor(seconds / 60);
-    const s = Math.floor(seconds % 60);
-    return `${m}:${s.toString().padStart(2, "0")}`;
-  };
-
-  return (
-    <section
-      className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
-      style={{
-        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png)`,
-      }}
-    >
-      <div className="container mx-auto px-4 text-center text-white">
-        <div className="max-w-4xl mx-auto">
-          {/* Logo */}
-          <div className="flex flex-col items-center mb-6">
-            <div className="w-64 h-64 md:w-80 md:h-80 mb-4">
-              <img
-                src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png"
-                alt="Прабгупада солов'їною"
-                className="w-full h-full object-contain"
-              />
-            </div>
-          </div>
-
-          {/* Subtitle */}
-          <p className="text-xl md:text-2xl mb-8 text-white/90 font-medium">Бібліотека ведичних аудіокниг</p>
-
-          {/* Quote */}
-          <div className="mb-8 p-6 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20">
-            <p className="text-base md:text-lg leading-relaxed text-white/90 mb-4">
-              За моєї відсутності читайте книжки. Все, про що я говорю, я написав у книжках. Ви можете підтримувати
-              зв'язок зі мною через мої книги.
-            </p>
-            <p className="text-sm text-white/70 text-right">
-              — Шріла Прабгупада
-              <br />7 серпня 1975 року, Торонто
-            </p>
-          </div>
-
-          {/* CTA Buttons - ПЕРЕЙМЕНОВАНО як ти просив */}
-          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
-            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
-              <a href="/library">
-                <BookOpen className="w-5 h-5 mr-2" />
-                Читати
-              </a>
-            </Button>
-            <Button
-              asChild
-              size="lg"
-              variant="outline"
-              className="border-white text-white hover:bg-white hover:text-black"
-            >
-              <a href="/audiobooks">
-                <Headphones className="w-5 h-5 mr-2" />
-                Слухати
-              </a>
-            </Button>
-          </div>
-
-          {/* Картка "Продовжити прослуховування" (інтеграція з GlobalAudioPlayer) */}
-          {currentTrack && (
-            <div className="max-w-xl mx-auto">
-              <Card className="bg-card/90 backdrop-blur border-white/20">
-                <CardContent className="p-5">
-                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
-                    <Clock className="h-4 w-4" /> Продовжити прослуховування
-                  </div>
-
-                  <div className="rounded-xl border border-border bg-background/50 p-4">
-                    <div className="mb-2 text-base font-semibold text-foreground">{currentTrack.title}</div>
-
-                    <div className="flex items-center justify-between gap-4">
-                      <div className="min-w-0 flex-1">
-                        <div className="truncate text-sm text-foreground">
-                          {currentTrack.verseNumber ? `Вірш ${currentTrack.verseNumber}` : "Аудіо"}
-                        </div>
-                        <div className="truncate text-xs text-muted-foreground">
-                          {formatTime(duration)} ·{" "}
-                          {isPlaying
-                            ? `Відтворюється ${formatTime(currentTime)}`
-                            : `Пауза на ${formatTime(currentTime)}`}
-                        </div>
-                      </div>
-
-                      <Button size="sm" onClick={togglePlay} className="gap-2 relative z-10">
-                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
-                        {isPlaying ? "Пауза" : "Продовжити"}
-                      </Button>
-                    </div>
-                  </div>
-
-                  {/* Опційно: Продовжити читання */}
-                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
-                    <BookOpen className="h-4 w-4" /> Продовжити читання
-                  </div>
-                  <div className="mt-2 rounded-xl border border-border bg-background/50 p-4">
-                    <div className="truncate text-sm font-medium text-foreground">Останній прочитаний вірш</div>
-                    <div className="truncate text-xs text-muted-foreground">Відкрийте бібліотеку для продовження</div>
-                    <a href="/library" className="mt-3 inline-flex items-center gap-2 text-sm hover:underline">
-                      Відкрити <ArrowRight className="h-4 w-4" />
-                    </a>
-                  </div>
-                </CardContent>
-              </Card>
-            </div>
-          )}
-        </div>
-      </div>
-
-      {/* Scroll indicator */}
-      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
-        <ChevronDown className="w-8 h-8 text-white/70" />
-      </div>
-    </section>
-  );
-}
+// --- Hero Section (з карткою "Продовжити") ---
+function Hero() {
+  const { currentTrack, isPlaying, togglePlay, currentTime, duration } = useAudio();
+  const { language } = useLanguage();
+
+  // Завантаження налаштувань з БД
+  const { data: settingsData } = useQuery({
+    queryKey: ["site-settings", "home_hero"],
+    queryFn: async () => {
+      const { data, error } = await supabase
+        .from("site_settings")
+        .select("value")
+        .eq("key", "home_hero")
+        .single();
+
+      if (error) throw error;
+      return data?.value as {
+        background_image: string;
+        logo_image: string;
+        subtitle_ua: string;
+        subtitle_en: string;
+        quote_ua: string;
+        quote_en: string;
+        quote_author_ua: string;
+        quote_author_en: string;
+      };
+    },
+  });
+
+  // Дефолтні значення якщо дані ще не завантажились
+  const settings = settingsData || {
+    background_image: "/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png",
+    logo_image: "/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png",
+    subtitle_ua: "Бібліотека ведичних аудіокниг",
+    subtitle_en: "Library of Vedic audiobooks",
+    quote_ua:
+      "За моєї відсутності читайте книжки. Все, про що я говорю, я написав у книжках. Ви можете підтримувати зв'язок зі мною через мої книги.",
+    quote_en:
+      "In my absence, read the books. Everything I speak is written in the books. You can associate with me through my books.",
+    quote_author_ua: "Шріла Прабгупада",
+    quote_author_en: "Srila Prabhupada",
+  };
+
+  // Функція для форматування часу
+  const formatTime = (seconds: number) => {
+    if (!Number.isFinite(seconds)) return "00:00";
+    const m = Math.floor(seconds / 60);
+    const s = Math.floor(seconds % 60);
+    return `${m}:${s.toString().padStart(2, "0")}`;
+  };
+
+  const subtitle = language === "ua" ? settings.subtitle_ua : settings.subtitle_en;
+  const quote = language === "ua" ? settings.quote_ua : settings.quote_en;
+  const author = language === "ua" ? settings.quote_author_ua : settings.quote_author_en;
+
+  return (
+    <section
+      className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
+      style={{
+        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${settings.background_image})`,
+      }}
+    >
+      <div className="container mx-auto px-4 text-center text-white">
+        <div className="max-w-4xl mx-auto">
+          {/* Logo */}
+          <div className="flex flex-col items-center mb-6">
+            <div className="w-64 h-64 md:w-80 md:h-80 mb-4">
+              <img src={settings.logo_image} alt="Прабгупада соловʼїною" className="w-full h-full object-contain" />
+            </div>
+          </div>
+
+          {/* Subtitle */}
+          <p className="text-xl md:text-2xl mb-8 text-white/90 font-medium">{subtitle}</p>
+
+          {/* Quote */}
+          <div className="mb-8 p-6 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20">
+            <p className="text-base md:text-lg leading-relaxed text-white/90 mb-4">{quote}</p>
+            <p className="text-sm text-white/70 italic">— {author}</p>
+          </div>
+
+          {/* Continue Listening Card */}
+          {currentTrack && (
+            <div className="mt-8">
+              <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur">
+                <CardContent className="p-6">
+                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
+                    <Headphones className="h-4 w-4" /> Продовжити прослуховування
+                  </div>
+
+                  <div className="flex items-center justify-between gap-4">
+                    <div className="flex-1 min-w-0 text-left">
+                      <div className="truncate text-base font-semibold text-foreground mb-1">
+                        {currentTrack.title}
+                      </div>
+                      <div className="truncate text-sm text-muted-foreground">
+                        {currentTrack.album || "Vedavoice · Аудіо"}
+                      </div>
+                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
+                        <Clock className="h-3 w-3" />
+                        {isPlaying
+                          ? `Відтворюється ${formatTime(currentTime)}`
+                          : `Пауза на ${formatTime(currentTime)}`}
+                      </div>
+                    </div>
+
+                    <Button size="sm" onClick={togglePlay} className="gap-2">
+                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
+                      {isPlaying ? "Пауза" : "Продовжити"}
+                    </Button>
+                  </div>
+                </CardContent>
+              </Card>
+            </div>
+          )}
+        </div>
+      </div>
+
+      {/* Scroll indicator */}
+      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
+        <ChevronDown className="w-8 h-8 text-white/70" />
+      </div>
+    </section>
+  );
+}