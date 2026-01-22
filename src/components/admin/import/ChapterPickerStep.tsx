import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParsedChapter, ParsedVerse } from "@/types/book-import";
import { BookOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";

interface ChapterPickerStepProps {
  chapters: ParsedChapter[];
  onNext: (chapter: ParsedChapter) => void;
  onBack: () => void;
}

export function ChapterPickerStep({ chapters, onNext, onBack }: ChapterPickerStepProps) {
  const [selectedChapter, setSelectedChapter] = useState<ParsedChapter | null>(null);

  // Побудова видимого списку: текстові інтродукторні глави + віршові
  const { visibleChapters, versesCount, introCount } = useMemo(() => {
    const verseChapters = [...chapters.filter((c) => c.chapter_type === "verses")].sort(
      (a, b) => a.chapter_number - b.chapter_number,
    );
    const textChapters = chapters.filter((c) => c.chapter_type === "text");
    const verseNumbers = new Set(verseChapters.map((c) => c.chapter_number));
    const introTextChapters = [...textChapters]
      .filter((c) => !verseNumbers.has(c.chapter_number))
      .sort((a, b) => a.chapter_number - b.chapter_number);

    return {
      visibleChapters: [...introTextChapters, ...verseChapters],
      versesCount: verseChapters.length,
      introCount: introTextChapters.length,
    };
  }, [chapters]);

  const handleChoose = () => {
    if (selectedChapter) onNext(selectedChapter);
  };

  if (visibleChapters.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-2">Крок 3: Вибір глави для імпорту</h2>
          <p className="text-destructive">
            ❌ Не знайдено жодної глави з віршами. Перевірте формат файлу або налаштування шаблону.
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Назад
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Крок 3: Вибір глави для імпорту</h2>
        <p className="text-muted-foreground">
          Знайдено {visibleChapters.length} глав ({versesCount} з віршами, {introCount} текстових вступних). Оберіть
          одну главу для імпорту — праворуч побачите міні-прев’ю.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Ліва колонка — список глав */}
        <Card className="p-4">
          <ScrollArea className="max-h-[520px]">
            <div className="grid gap-3 pr-2">
              {visibleChapters.map((chapter) => {
                const isSelected =
                  selectedChapter?.chapter_number === chapter.chapter_number &&
                  selectedChapter?.chapter_type === chapter.chapter_type;

                return (
                  <button
                    type="button"
                    key={`${chapter.chapter_type}-${chapter.chapter_number}`}
                    onClick={() => setSelectedChapter(chapter)}
                    className={cn(
                      "w-full text-left rounded-lg border p-4 transition-colors",
                      "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/30",
                      isSelected ? "border-primary bg-primary/5" : "border-border",
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {chapter.chapter_type === "text" ? (
                          <FileText className="mt-0.5 h-5 w-5 text-blue-500" />
                        ) : (
                          <BookOpen className="mt-0.5 h-5 w-5 text-primary" />
                        )}
                        <div>
                          <p className="mb-1 text-sm text-muted-foreground">
                            Глава {chapter.chapter_number}
                            {chapter.chapter_type === "text" && " (текстова)"}
                          </p>
                          <h3 className="font-semibold">{chapter.title_uk || `Глава ${chapter.chapter_number}`}</h3>
                          <p className="text-sm text-muted-foreground">
                            {chapter.chapter_type === "verses"
                              ? `${chapter.verses?.length ?? 0} віршів`
                              : `Текстова глава (${(chapter.content_uk || "").length} символів)`}
                          </p>
                        </div>
                      </div>
                      <Badge variant={chapter.chapter_type === "text" ? "secondary" : "default"}>
                        {chapter.chapter_type === "text" ? "Текст" : "Вірші"}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </Card>

        {/* Права колонка — міні-прев’ю */}
        <Card className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Міні-прев’ю</h3>
            {selectedChapter && (
              <Badge variant={selectedChapter.chapter_type === "text" ? "secondary" : "default"}>
                {selectedChapter.chapter_type === "text" ? "Текстова" : "Віршова"}
              </Badge>
            )}
          </div>

          {!selectedChapter ? (
            <p className="text-sm text-muted-foreground">
              Оберіть главу ліворуч, щоб переглянути вміст перед імпортом.
            </p>
          ) : selectedChapter.chapter_type === "text" ? (
            <ScrollArea className="max-h-[460px] pr-2">
              <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2">
                {/* Рендеримо HTML з санітизацією для безпеки */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      selectedChapter.content_uk || '<p class="text-muted-foreground">Порожній текст</p>',
                      {
                        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'div', 'span'],
                        ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
                        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
                      }
                    ),
                  }}
                />
              </div>
            </ScrollArea>
          ) : (
            <ScrollArea className="max-h-[460px] pr-2">
              <div className="space-y-4">
                {(selectedChapter.verses || [])
                  .slice(0, 3) // показуємо перші 2-3 вірші як прев’ю
                  .map((v, i) => (
                    <PreviewVerse key={`${v.verse_number}-${i}`} verse={v} />
                  ))}

                {(selectedChapter.verses?.length ?? 0) > 3 && (
                  <p className="text-xs text-muted-foreground">Показано 3 з {selectedChapter.verses?.length} віршів…</p>
                )}
              </div>
            </ScrollArea>
          )}
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Назад
        </Button>
        <Button onClick={handleChoose} disabled={!selectedChapter}>
          Далі: Попередній перегляд
        </Button>
      </div>
    </div>
  );
}

/** Маленький прев’ю-блок одного вірша */
function PreviewVerse({ verse }: { verse: ParsedVerse }) {
  const num = verse.verse_number ? String(verse.verse_number) : "—";
  const sans = (verse.sanskrit || "").trim();
  const tr = (verse.translation_uk || "").trim();

  return (
    <div className="rounded-md border p-3">
      <div className="mb-2 text-center font-semibold">Вірш {num}</div>
      {sans && <div className="mb-2 font-sanskrit text-base leading-relaxed">{sans}</div>}
      {tr ? (
        <div className="text-sm leading-relaxed">{tr}</div>
      ) : (
        <div className="text-sm text-muted-foreground italic">Переклад відсутній</div>
      )}
      {/* Якщо є пояснення (HTML), покажемо коротку підказку */}
      {verse.commentary_ua && (
        <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {/* грубий зріз без повного рендера HTML */}
          {stripHtml(verse.commentary_ua).slice(0, 160)}…
        </div>
      )}
    </div>
  );
}

function stripHtml(html: string) {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
