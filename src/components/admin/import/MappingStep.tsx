import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { BOOK_TEMPLATES, ImportTemplate, ParsedChapter } from "@/types/book-import";
import { splitIntoChapters } from "@/utils/import/splitters";
import { toast } from "sonner";

interface MappingStepProps {
  extractedText: string;
  onNext: (template: ImportTemplate, chapters: ParsedChapter[]) => void;
  onBack: () => void;
}

const STORAGE_KEY = "vv_mapping_step_state";

type PersistedState = {
  useCustom: boolean;
  templateId: string;
  regex: {
    verse: string;
    synonyms: string;
    translation: string;
    commentary: string;
  };
};

export function MappingStep({ extractedText, onNext, onBack }: MappingStepProps) {
  // initial persisted state
  const initial: PersistedState = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) throw new Error("no state");
      const parsed = JSON.parse(raw) as PersistedState;
      return {
        useCustom: parsed.useCustom ?? false,
        templateId: parsed.templateId || "bhagavad-gita",
        regex: {
          verse: parsed.regex?.verse ?? "^(?:ТЕКСТ|TEXT)\\s+(\\d+)",
          synonyms: parsed.regex?.synonyms ?? "^(?:ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD)",
          translation: parsed.regex?.translation ?? "^(?:ПЕРЕКЛАД|TRANSLATION)",
          commentary: parsed.regex?.commentary ?? "^(?:ПОЯСНЕННЯ|PURPORT)",
        },
      };
    } catch {
      return {
        useCustom: false,
        templateId: "bhagavad-gita",
        regex: {
          verse: "^(?:ТЕКСТ|TEXT)\\s+(\\d+)",
          synonyms: "^(?:ПОСЛІВНИЙ ПЕРЕКЛАД|WORD FOR WORD)",
          translation: "^(?:ПЕРЕКЛАД|TRANSLATION)",
          commentary: "^(?:ПОЯСНЕННЯ|PURPORT)",
        },
      };
    }
  }, []);

  const [templateId, setTemplateId] = useState<string>(initial.templateId);
  const [isCustom, setIsCustom] = useState<boolean>(initial.useCustom);
  const [customRegex, setCustomRegex] = useState(initial.regex);
  const [parsing, setParsing] = useState(false);

  // live preview state
  const [previewComputing, setPreviewComputing] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewChapters, setPreviewChapters] = useState<ParsedChapter[] | null>(null);

  // persist state
  useEffect(() => {
    const state: PersistedState = {
      useCustom: isCustom,
      templateId,
      regex: customRegex,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [isCustom, templateId, customRegex]);

  // debounce live preview on changes
  useEffect(() => {
    let cancelled = false;
    setPreviewComputing(true);
    setPreviewError(null);

    const t = setTimeout(() => {
      try {
        let tpl: ImportTemplate | undefined;

        if (isCustom) {
          // validate regex first
          new RegExp(customRegex.verse, "mi");
          new RegExp(customRegex.synonyms, "mi");
          new RegExp(customRegex.translation, "mi");
          new RegExp(customRegex.commentary, "mi");

          tpl = {
            id: "custom",
            name: "Користувацький",
            versePattern: new RegExp(customRegex.verse, "mi"),
            synonymsPattern: new RegExp(customRegex.synonyms, "mi"),
            translationPattern: new RegExp(customRegex.translation, "mi"),
            commentaryPattern: new RegExp(customRegex.commentary, "mi"),
            chapterPattern: /^(?:РОЗДІЛ|CHAPTER)\s+(\d+)/im,
          };
        } else {
          tpl = BOOK_TEMPLATES.find((t) => t.id === templateId);
          if (!tpl) throw new Error("Обраний шаблон не знайдено.");
        }

        const chapters = splitIntoChapters(extractedText, tpl!);
        if (!cancelled) {
          setPreviewChapters(chapters);
        }
      } catch (err: any) {
        if (!cancelled) {
          setPreviewChapters(null);
          setPreviewError(err?.message || "Помилка при попередньому аналізі");
        }
      } finally {
        if (!cancelled) setPreviewComputing(false);
      }
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [extractedText, isCustom, templateId, customRegex]);

  const handleNext = async () => {
    try {
      setParsing(true);

      // Validate custom regex patterns (якщо custom-режим)
      if (isCustom) {
        try {
          new RegExp(customRegex.verse, "mi");
          new RegExp(customRegex.synonyms, "mi");
          new RegExp(customRegex.translation, "mi");
          new RegExp(customRegex.commentary, "mi");
        } catch (regexError) {
          toast.error("Невалідний regex патерн: " + (regexError as Error).message);
          setParsing(false);
          return;
        }
      }

      let chapters: ParsedChapter[] = [];
      let template: ImportTemplate;

      if (isCustom) {
        template = {
          id: "custom",
          name: "Користувацький",
          versePattern: new RegExp(customRegex.verse, "mi"),
          synonymsPattern: new RegExp(customRegex.synonyms, "mi"),
          translationPattern: new RegExp(customRegex.translation, "mi"),
          commentaryPattern: new RegExp(customRegex.commentary, "mi"),
          chapterPattern: /^(?:РОЗДІЛ|CHAPTER)\s+(\d+)/im,
        };
        chapters = splitIntoChapters(extractedText, template);
      } else {
        const found = BOOK_TEMPLATES.find((t) => t.id === templateId);
        if (!found) {
          toast.error("Обраний шаблон не знайдено");
          setParsing(false);
          return;
        }
        template = found;
        chapters = splitIntoChapters(extractedText, template);
      }

      if (chapters.length === 0) {
        toast.error("Не вдалося знайти жодної глави. Спробуйте інший шаблон або текст.");
        setParsing(false);
        return;
      }

      const totalVerses = chapters.reduce((sum, ch) => sum + (ch.verses?.length || 0), 0);
      if (totalVerses === 0) {
        toast.error("Не вдалося знайти вірші. Перевірте налаштування шаблону.");
        setParsing(false);
        return;
      }

      const first = chapters[0]?.verses?.[0];
      if (first) {
        toast.message(
          `Попередній перегляд: вірш ${first.verse_number ?? "—"}${first.translation_ua ? " (є переклад)" : ""}`,
        );
      }

      toast.success(`Знайдено ${chapters.length} розділів із ${totalVerses} віршами`);
      onNext(template, chapters);
    } catch (error) {
      console.error("Error parsing text:", error);
      toast.error("Помилка при обробці тексту: " + (error as Error).message);
    } finally {
      setParsing(false);
    }
  };

  // derived preview info
  const previewInfo = useMemo(() => {
    if (!previewChapters || previewChapters.length === 0) {
      return { chapters: 0, verses: 0, first: null as any };
    }
    const chapters = previewChapters.length;
    const verses = previewChapters.reduce((s, ch) => s + (ch.verses?.length || 0), 0);
    const firstChapter = previewChapters[0];
    const firstVerse = firstChapter?.verses?.[0] ?? null;
    return { chapters, verses, first: firstVerse, firstChapter };
  }, [previewChapters]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-xl font-bold">Крок 2: Налаштування структури</h2>
        <p className="text-muted-foreground">Оберіть шаблон книги або налаштуйте власні правила розбору</p>
      </div>

      <RadioGroup value={isCustom ? "custom" : "template"} onValueChange={(v) => setIsCustom(v === "custom")}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="template" id="template" />
            <Label htmlFor="template">Використати готовий шаблон</Label>
          </div>

          {!isCustom && (
            <div className="ml-6 space-y-2">
              {BOOK_TEMPLATES.map((tpl) => (
                <Card
                  key={tpl.id}
                  className={`cursor-pointer p-4 transition-colors ${
                    templateId === tpl.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setTemplateId(tpl.id)}
                >
                  <h3 className="font-semibold">{tpl.name}</h3>
                </Card>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="custom" id="custom" />
            <Label htmlFor="custom">Налаштувати власні правила (regex)</Label>
          </div>

          {isCustom && (
            <div className="ml-6 space-y-4">
              <div>
                <Label>Початок вірша (regex)</Label>
                <Input
                  value={customRegex.verse}
                  onChange={(e) => setCustomRegex({ ...customRegex, verse: e.target.value })}
                  placeholder="^ТЕКСТ\s+(\d+)"
                />
              </div>
              <div>
                <Label>Початок синонімів (regex)</Label>
                <Input
                  value={customRegex.synonyms}
                  onChange={(e) => setCustomRegex({ ...customRegex, synonyms: e.target.value })}
                  placeholder="^ПОСЛІВНИЙ ПЕРЕКЛАД"
                />
              </div>
              <div>
                <Label>Початок перекладу (regex)</Label>
                <Input
                  value={customRegex.translation}
                  onChange={(e) => setCustomRegex({ ...customRegex, translation: e.target.value })}
                  placeholder="^ПЕРЕКЛАД"
                />
              </div>
              <div>
                <Label>Початок пояснення (regex)</Label>
                <Input
                  value={customRegex.commentary}
                  onChange={(e) => setCustomRegex({ ...customRegex, commentary: e.target.value })}
                  placeholder="^ПОЯСНЕННЯ"
                />
              </div>
            </div>
          )}
        </div>
      </RadioGroup>

      {/* МІНІ-ПРЕВ’Ю */}
      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">Попередній перегляд</h3>
          {previewComputing && <span className="text-xs text-muted-foreground">аналіз…</span>}
        </div>

        {previewError ? (
          <p className="text-sm text-destructive">{previewError}</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              {previewChapters
                ? `Знайдено розділів: ${previewInfo.chapters}, віршів: ${previewInfo.verses}`
                : "Ще немає даних для попереднього перегляду"}
            </p>

            {previewInfo.first && (
              <div className="mt-3 rounded-md border p-3">
                <div className="mb-1 text-xs text-muted-foreground">
                  Перший збіг • Глава {previewInfo.firstChapter?.chapter_number ?? "—"}
                </div>
                <div className="text-sm">
                  <div className="mb-1">
                    <span className="font-medium">Вірш: </span>
                    <span>{previewInfo.first.verse_number ?? "—"}</span>
                  </div>
                  {previewInfo.first.sanskrit && (
                    <div className="mb-1">
                      <span className="font-medium">Санскрит: </span>
                      <span className="opacity-80">
                        {previewInfo.first.sanskrit.slice(0, 120)}
                        {previewInfo.first.sanskrit.length > 120 ? "…" : ""}
                      </span>
                    </div>
                  )}
                  {previewInfo.first.translation_ua && (
                    <div className="mb-1">
                      <span className="font-medium">Переклад: </span>
                      <span className="opacity-80">
                        {previewInfo.first.translation_ua.slice(0, 140)}
                        {previewInfo.first.translation_ua.length > 140 ? "…" : ""}
                      </span>
                    </div>
                  )}
                  {!previewInfo.first.translation_ua && (
                    <div className="text-xs text-muted-foreground">Переклад не знайдено</div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={parsing}>
          Назад
        </Button>
        <Button onClick={handleNext} disabled={parsing || previewComputing}>
          {parsing ? "Обробка…" : "Далі: Вибір глави"}
        </Button>
      </div>
    </div>
  );
}
