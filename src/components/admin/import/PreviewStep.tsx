import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ParsedChapter, ParsedVerse } from "@/types/book-import";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InlineTiptapEditor } from "@/components/InlineTiptapEditor";
import { normalizeSynonyms } from "@/utils/import/normalizers"; // якщо ще десь використовуєте
import { importSingleChapter, importBook } from "@/utils/import/importer";

interface PreviewStepProps {
  /** Вибрана глава для імпорту (редагована у формі) */
  chapter: ParsedChapter;
  /** Увесь масив розпарсених глав — щоб за потреби імпортувати всю книгу */
  allChapters?: ParsedChapter[];
  onBack: () => void;
  onComplete: () => void;
}

export function PreviewStep({ chapter, allChapters, onBack, onComplete }: PreviewStepProps) {
  const [editedChapter, setEditedChapter] = useState<ParsedChapter>({
    ...chapter,
    title_ua: chapter.title_ua || `Глава ${chapter.chapter_number}`,
    title_en: chapter.title_en || `Chapter ${chapter.chapter_number}`,
  });
  const [isImporting, setIsImporting] = useState(false);
  const [isImportingBook, setIsImportingBook] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [selectedCantoId, setSelectedCantoId] = useState<string>("");

  const { data: books } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, title_ua, title_en, has_cantos")
        .order("title_ua");
      if (error) throw error;
      return data;
    },
  });

  const { data: cantos } = useQuery({
    queryKey: ["cantos", selectedBookId],
    enabled: !!selectedBookId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cantos")
        .select("id, canto_number, title_ua")
        .eq("book_id", selectedBookId)
        .order("canto_number");
      if (error) throw error;
      return data;
    },
  });

  const selectedBook = books?.find((b) => b.id === selectedBookId);
  const needsCanto = selectedBook?.has_cantos ?? false;

  const validateTarget = () => {
    if (!selectedBookId) {
      toast.error("Оберіть книгу");
      return false;
    }
    if (needsCanto && !selectedCantoId) {
      toast.error("Оберіть пісню (canto)");
      return false;
    }
    return true;
  };

  const handleImportChapter = async () => {
    if (!validateTarget()) return;

    // валідації
    if (!editedChapter.verseStart && editedChapter.chapter_type !== "text") {
      // не обов'язково, лише приклад
    }

    setIsImporting(true);
    try {
      // якщо віршова глава — приберемо дублікати перед збереженням (м’яко)
      if ((editedChapter.chapter_type ?? "verses") === "verses") {
        const seen = new Set<string>();
        editedChapter.verses = (editedChapter.verses || []).filter((v) => {
          const num = (v.verse_number || "").trim();
          if (!num) return true;
          if (seen.has(num)) return false;
          seen.add(num);
          return true;
        });
      }

      await importSingleChapter(supabase, {
        bookId: selectedBookId,
        cantoId: needsCanto ? selectedCantoId : null,
        chapter: editedChapter,
      });

      toast.success(`Глава ${editedChapter.chapter_number} імпортована (оновлено/створено)`);
      onComplete();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Помилка при імпорті глави");
    } finally {
      setIsImporting(false);
    }
  };

  const handleImportWholeBook = async () => {
    if (!allChapters?.length) {
      toast.error("Немає повної розмітки книги (передайте allChapters)");
      return;
    }
    if (!validateTarget()) return;

    setIsImportingBook(true);
    try {
      await importBook(supabase, {
        bookId: selectedBookId,
        cantoId: needsCanto ? selectedCantoId : null,
        chapters: allChapters,
        onProgress: ({ index, total, chapter }) => {
          toast.message(`Імпорт розділу ${chapter.chapter_number}… (${index}/${total})`);
        },
      });

      toast.success(`Книгу імпортовано: ${allChapters.length} розділів`);
      onComplete();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Помилка при масовому імпорті");
    } finally {
      setIsImportingBook(false);
    }
  };

  const updateVerse = (index: number, field: keyof ParsedVerse, value: string) => {
    const verses = [...(editedChapter.verses || [])];
    verses[index] = { ...verses[index], [field]: value };
    setEditedChapter({ ...editedChapter, verses });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Крок 4: Попередній перегляд та імпорт</h2>
        <p className="text-muted-foreground">Перевірте та відредагуйте дані перед імпортом</p>
      </div>

      <div className="p-4 border rounded-lg space-y-4">
        <div>
          <Label>Книга</Label>
          <Select value={selectedBookId} onValueChange={setSelectedBookId}>
            <SelectTrigger>
              <SelectValue placeholder="Оберіть книгу" />
            </SelectTrigger>
            <SelectContent>
              {books?.map((book) => (
                <SelectItem key={book.id} value={book.id}>
                  {book.title_ua}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {needsCanto && (
          <div>
            <Label>Пісня (Canto)</Label>
            <Select value={selectedCantoId} onValueChange={setSelectedCantoId}>
              <SelectTrigger>
                <SelectValue placeholder="Оберіть пісню" />
              </SelectTrigger>
              <SelectContent>
                {cantos?.map((canto) => (
                  <SelectItem key={canto.id} value={canto.id}>
                    Пісня {canto.canto_number}: {canto.title_ua}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label>Назва глави (UA)</Label>
          <Input
            value={editedChapter.title_ua || ""}
            onChange={(e) => setEditedChapter({ ...editedChapter, title_ua: e.target.value })}
          />
        </div>

        <div>
          <Label>Назва глави (EN)</Label>
          <Input
            value={editedChapter.title_en || ""}
            onChange={(e) => setEditedChapter({ ...editedChapter, title_en: e.target.value })}
          />
        </div>
      </div>

      {editedChapter.chapter_type === "text" ? (
        <>
          <h3 className="font-semibold">Текст глави</h3>
          <div className="p-4 border rounded-lg">
            <InlineTiptapEditor
              content={editedChapter.content_ua || ""}
              onChange={(html) => setEditedChapter({ ...editedChapter, content_ua: html })}
              label="Текст українською (форматування зберігається)"
            />
          </div>
        </>
      ) : (
        <>
          <h3 className="font-semibold">Вірші ({editedChapter.verses?.length ?? 0})</h3>
          <Accordion type="single" collapsible className="space-y-2">
            {(editedChapter.verses || []).map((verse, index) => (
              <AccordionItem key={index} value={`verse-${index}`}>
                <AccordionTrigger className="hover:no-underline text-left">
                  Вірш {verse.verse_number}
                  {verse.sanskrit && (
                    <span className="text-sm text-muted-foreground ml-2">({verse.sanskrit.substring(0, 30)}…)</span>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    <div>
                      <Label className="text-xs">Санскрит</Label>
                      <Textarea
                        value={verse.sanskrit || ""}
                        onChange={(e) => updateVerse(index, "sanskrit", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Транслітерація</Label>
                      <Textarea
                        value={verse.transliteration || ""}
                        onChange={(e) => updateVerse(index, "transliteration", e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Синоніми (UA)</Label>
                      <Textarea
                        value={verse.synonyms_ua || ""}
                        onChange={(e) => updateVerse(index, "synonyms_ua", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Переклад (UA)</Label>
                      <Textarea
                        value={verse.translation_ua || ""}
                        onChange={(e) => updateVerse(index, "translation_ua", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Пояснення (UA)</Label>
                      <InlineTiptapEditor
                        content={verse.commentary_ua || ""}
                        onChange={(html) => updateVerse(index, "commentary_ua", html)}
                        label="Пояснення (UA) — форматування зберігається"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={onBack} disabled={isImporting || isImportingBook}>
          Назад
        </Button>

        <div className="flex gap-2">
          {allChapters?.length ? (
            <Button onClick={handleImportWholeBook} disabled={isImporting || isImportingBook}>
              {isImportingBook ? "Імпортування книги…" : `Імпортувати всю книгу (${allChapters.length})`}
            </Button>
          ) : null}

          <Button onClick={handleImportChapter} disabled={isImporting || isImportingBook}>
            {isImporting ? "Імпортування…" : "Імпортувати главу"}
          </Button>
        </div>
      </div>
    </div>
  );
}
