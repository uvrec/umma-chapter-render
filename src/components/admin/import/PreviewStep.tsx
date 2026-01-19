import { useState, useEffect } from "react";
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
import { EnhancedInlineEditor } from "@/components/EnhancedInlineEditor";
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
    title_uk: chapter.title_uk || `Глава ${chapter.chapter_number}`,
    title_en: chapter.title_en || `Chapter ${chapter.chapter_number}`,
  });
  const [isImporting, setIsImporting] = useState(false);
  const [isImportingBook, setIsImportingBook] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [selectedCantoId, setSelectedCantoId] = useState<string>("");
  const [originalTitles, setOriginalTitles] = useState<{ uk?: string; en?: string }>({});
  
  type ImportStrategy = 'replace' | 'upsert';
  const [importStrategy, setImportStrategy] = useState<ImportStrategy>('upsert');

  const { data: books } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("id, title_uk, title_en, has_cantos")
        .order("title_uk");
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
        .select("id, canto_number, title_uk")
        .eq("book_id", selectedBookId)
        .order("canto_number");
      if (error) throw error;
      return data;
    },
  });

  // ✅ Завантажити існуючу главу з бази, якщо вона є
  const { data: existingChapter } = useQuery({
    queryKey: ["existing-chapter", selectedBookId, selectedCantoId, editedChapter.chapter_number],
    enabled: !!selectedBookId && editedChapter.chapter_number > 0,
    queryFn: async () => {
      let query = supabase
        .from("chapters")
        .select("id, title_uk, title_en")
        .eq("chapter_number", editedChapter.chapter_number);
      
      if (selectedCantoId) {
        query = query.eq("canto_id", selectedCantoId);
      } else {
        query = query.eq("book_id", selectedBookId);
      }
      
      const { data } = await query.maybeSingle();
      return data;
    },
  });

  // ✅ Коли завантажилася існуюча глава - зберегти її оригінальні назви
  useEffect(() => {
    if (existingChapter?.title_uk || existingChapter?.title_en) {
      setOriginalTitles({
        ua: existingChapter.title_uk,
        en: existingChapter.title_en,
      });
    }
  }, [existingChapter]);

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

    const safeChapter = { ...editedChapter } as any;
    
    // ✅ КРИТИЧНО: Якщо назва НЕ змінювалася користувачем - НЕ передавати її!
    // Це дозволить зберегти існуючі назви в базі
    const isFallbackOrUnchanged = (t?: string, original?: string) => {
      const s = (t || "").trim();
      const n = editedChapter.chapter_number;
      if (!s) return true;
      
      // Якщо співпадає з оригінальною назвою з бази - значить користувач НЕ міняв
      if (original && s === original) return true;
      
      console.log('🔍 PreviewStep: Перевірка назви', { title: s, original, chapterNum: n });
      
      // Отримуємо назви книги/канто для перевірки
      const bookName = selectedBook?.title_uk || selectedBook?.title_en || '';
      const cantoData = cantos?.find(c => c.id === selectedCantoId);
      const cantoName = cantoData?.title_uk || '';
      
      // Стандартні fallback формати
      const patterns = [
        `^(Глава|Розділ|Chapter|Song|Пісня)\\s*${n}(?:\\s*[.:—-])?$`,
        // Формати типу "CC madhya 24", "SB 1.1", "BG 2", тощо
        `^[A-Z]{1,4}\\s+(madhya|adi|antya|lila|canto)?\\s*${n}$`,
        // Формати з назвою lila
        `(madhya|adi|antya)\\s*lila\\s*${n}$`,
        `(madhya|adi|antya)\\s*${n}$`,
        // Формати типу "Canto 1", "Madhya 24"
        `^(Canto|Madhya|Adi|Antya)\\s*${n}$`,
      ];
      
      // Перевірка по всіх патернах
      const matchesPattern = patterns.some(p => new RegExp(p, "i").test(s));
      if (matchesPattern) {
        console.log('🔍 Назва розпізнана як fallback pattern');
        return true;
      }
      
      // Перевірка чи назва містить фрагменти назви книги + номер
      if (bookName) {
        const bookWords = bookName.toLowerCase().split(/\s+/);
        const titleLower = s.toLowerCase();
        const hasBookFragment = bookWords.some(word => 
          word.length > 3 && titleLower.includes(word) && titleLower.includes(String(n))
        );
        if (hasBookFragment) {
          console.log('🔍 Назва містить фрагмент назви книги + номер');
          return true;
        }
      }
      
      // Перевірка чи назва містить фрагменти назви канто + номер
      if (cantoName) {
        const cantoWords = cantoName.toLowerCase().split(/\s+/);
        const titleLower = s.toLowerCase();
        const hasCantoFragment = cantoWords.some(word => 
          word.length > 3 && titleLower.includes(word) && titleLower.includes(String(n))
        );
        if (hasCantoFragment) {
          console.log('🔍 Назва містить фрагмент назви канто + номер');
          return true;
        }
      }
      
      console.log('🔍 Назва НЕ є fallback');
      return false;
    };

    // Видалити назви якщо вони не змінені або є fallback
    if (isFallbackOrUnchanged(safeChapter.title_uk, originalTitles.uk)) {
      console.log('🔍 PreviewStep: Видаляємо title_uk (fallback/unchanged)');
      delete safeChapter.title_uk;
    }
    if (isFallbackOrUnchanged(safeChapter.title_en, originalTitles.en)) {
      console.log('🔍 PreviewStep: Видаляємо title_en (fallback/unchanged)');
      delete safeChapter.title_en;
    }
    
    console.log('🔍 PreviewStep: Відправляю главу', {
      chapter_number: safeChapter.chapter_number,
      title_uk: safeChapter.title_uk,
      title_en: safeChapter.title_en,
      title_uk_deleted: !safeChapter.title_uk,
      title_en_deleted: !safeChapter.title_en,
      strategy: importStrategy,
      verses_count: safeChapter.verses?.length
    });

    setIsImporting(true);
    try {
      // якщо віршова глава — приберемо дублікати перед збереженням (м’яко)
      if ((safeChapter.chapter_type ?? "verses") === "verses") {
        const seen = new Set<string>();
        safeChapter.verses = (safeChapter.verses || []).filter((v: any) => {
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
        chapter: safeChapter,
        strategy: importStrategy,
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

    // Санітуємо fallback-назви для всієї книги
    const sanitize = (ch: ParsedChapter) => {
      const s = { ...ch } as any;
      const n = ch.chapter_number;
      const isFallback = (t?: string) => {
        const v = (t || "").trim();
        if (!v) return true;
        const re = new RegExp(`^(Глава|Розділ|Chapter|Song|Пісня)\\s*${n}(?:\\s*[.:—-])?$`, "i");
        return re.test(v);
      };
      if (isFallback(s.title_uk)) delete s.title_uk;
      if (isFallback(s.title_en)) delete s.title_en;
      return s as ParsedChapter;
    };

    const chaptersToImport = allChapters.map(sanitize);

    setIsImportingBook(true);
    try {
      await importBook(supabase, {
        bookId: selectedBookId,
        cantoId: needsCanto ? selectedCantoId : null,
        chapters: chaptersToImport,
        strategy: importStrategy,
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
                  {book.title_uk}
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
                    Пісня {canto.canto_number}: {canto.title_uk}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <Label>Стратегія імпорту</Label>
          <Select value={importStrategy} onValueChange={(v) => setImportStrategy(v as ImportStrategy)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upsert">
                Оновити існуючі (безпечно)
              </SelectItem>
              <SelectItem value="replace">
                Повна заміна (видалить старі)
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {importStrategy === 'upsert' 
              ? 'Створить нові вірші або оновить існуючі. Не видалить наявні дані.'
              : 'УВАГА: Видалить всі існуючі вірші глави перед імпортом!'}
          </p>
        </div>

        <div>
          <Label>Назва глави (UK)</Label>
          <Input
            value={editedChapter.title_uk || ""}
            onChange={(e) => setEditedChapter({ ...editedChapter, title_uk: e.target.value })}
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
            <EnhancedInlineEditor
              content={editedChapter.content_uk || ""}
              onChange={(html) => setEditedChapter({ ...editedChapter, content_uk: html })}
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
                      <Label className="text-xs">Синоніми (UK)</Label>
                      <Textarea
                        value={verse.synonyms_uk || ""}
                        onChange={(e) => updateVerse(index, "synonyms_uk", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Переклад (UK)</Label>
                      <Textarea
                        value={verse.translation_uk || ""}
                        onChange={(e) => updateVerse(index, "translation_uk", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Пояснення (UK)</Label>
                      <EnhancedInlineEditor
                        content={verse.commentary_uk || ""}
                        onChange={(html) => updateVerse(index, "commentary_uk", html)}
                        label="Пояснення (UK) — форматування зберігається"
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
