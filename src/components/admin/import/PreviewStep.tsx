import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ParsedChapter, ParsedVerse } from '@/types/book-import';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InlineTiptapEditor } from '@/components/InlineTiptapEditor';
import { sanitizeHtml } from '@/utils/import/normalizers';
import { normalizeSynonyms } from '@/utils/import/normalizers';
interface PreviewStepProps {
  chapter: ParsedChapter;
  onBack: () => void;
  onComplete: () => void;
}

export function PreviewStep({ chapter, onBack, onComplete }: PreviewStepProps) {
  const [editedChapter, setEditedChapter] = useState<ParsedChapter>({
    ...chapter,
    title_ua: chapter.title_ua || `Глава ${chapter.chapter_number}`,
    title_en: chapter.title_en || `Chapter ${chapter.chapter_number}`
  });
  const [isImporting, setIsImporting] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedCantoId, setSelectedCantoId] = useState<string>('');

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, title_ua, title_en, has_cantos')
        .order('title_ua');
      if (error) throw error;
      return data;
    },
  });

  const { data: cantos } = useQuery({
    queryKey: ['cantos', selectedBookId],
    queryFn: async () => {
      if (!selectedBookId) return [];
      const { data, error } = await supabase
        .from('cantos')
        .select('id, canto_number, title_ua')
        .eq('book_id', selectedBookId)
        .order('canto_number');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedBookId,
  });

  const selectedBook = books?.find(b => b.id === selectedBookId);
  const needsCanto = selectedBook?.has_cantos ?? false;

  const handleImport = async () => {
    if (!selectedBookId) {
      toast.error('Оберіть книгу');
      return;
    }

    if (needsCanto && !selectedCantoId) {
      toast.error('Оберіть пісню (canto)');
      return;
    }

    // Validate verses
    const invalidVerses = editedChapter.verses.filter(v => !v.verse_number?.trim());
    if (invalidVerses.length > 0) {
      toast.error(`Знайдено ${invalidVerses.length} віршів без номера`);
      return;
    }

    const versesWithoutContent = editedChapter.verses.filter(
      v => !v.sanskrit?.trim() && !v.translation_ua?.trim()
    );
    if (versesWithoutContent.length > 0) {
      toast.warning(`${versesWithoutContent.length} віршів без тексту будуть імпортовані`);
    }

    setIsImporting(true);
    try {
      // Create/get chapter with proper canto filtering
      let query = supabase
        .from('chapters')
        .select('id')
        .eq('chapter_number', editedChapter.chapter_number);

      // Filter by canto_id OR book_id (not both)
      if (needsCanto && selectedCantoId) {
        query = query.eq('canto_id', selectedCantoId);
      } else {
        query = query.eq('book_id', selectedBookId);
      }

      const { data: existingChapter } = await query.maybeSingle();

      let chapterId: string;

      if (existingChapter) {
        chapterId = existingChapter.id;
      } else {
        const chapterInsert: any = {
          chapter_number: editedChapter.chapter_number,
          title_ua: editedChapter.title_ua,
          title_en: editedChapter.title_en,
        };

        // Set ONLY canto_id OR book_id (not both - constraint violation)
        if (needsCanto && selectedCantoId) {
          chapterInsert.canto_id = selectedCantoId;
        } else {
          chapterInsert.book_id = selectedBookId;
        }

        const { data: newChapter, error: chapterError } = await supabase
          .from('chapters')
          .insert(chapterInsert)
          .select('id')
          .single();

        if (chapterError) throw chapterError;
        chapterId = newChapter.id;
      }

      // Insert verses
      const versesToInsert = editedChapter.verses.map((verse) => ({
        chapter_id: chapterId,
        verse_number: verse.verse_number,
        sanskrit: verse.sanskrit,
        transliteration: verse.transliteration,
        synonyms_ua: normalizeSynonyms(verse.synonyms_ua || ''),
        synonyms_en: verse.synonyms_en,
        translation_ua: verse.translation_ua,
        translation_en: verse.translation_en,
        commentary_ua: sanitizeHtml(verse.commentary_ua || ''),
        commentary_en: sanitizeHtml(verse.commentary_en || ''),
      }));

      const { error: versesError } = await supabase
        .from('verses')
        .upsert(versesToInsert, {
          onConflict: 'chapter_id,verse_number',
          ignoreDuplicates: false,
        });

      if (versesError) throw versesError;

      toast.success(`Імпортовано главу ${editedChapter.chapter_number} з ${editedChapter.verses.length} віршами`);
      onComplete();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Помилка при імпорті');
    } finally {
      setIsImporting(false);
    }
  };

  const updateVerse = (index: number, field: keyof ParsedVerse, value: string) => {
    const newVerses = [...editedChapter.verses];
    newVerses[index] = { ...newVerses[index], [field]: value };
    setEditedChapter({ ...editedChapter, verses: newVerses });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-2">Крок 4: Попередній перегляд та імпорт</h2>
        <p className="text-muted-foreground">
          Перевірте та відредагуйте дані перед імпортом
        </p>
      </div>

      <Card className="p-4">
        <div className="space-y-4">
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
              value={editedChapter.title_ua}
              onChange={(e) => setEditedChapter({ ...editedChapter, title_ua: e.target.value })}
            />
          </div>

          <div>
            <Label>Назва глави (EN)</Label>
            <Input
              value={editedChapter.title_en || ''}
              onChange={(e) => setEditedChapter({ ...editedChapter, title_en: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <div>
        <h3 className="font-semibold mb-3">
          Вірші ({editedChapter.verses.length})
        </h3>
        <Accordion type="single" collapsible className="space-y-2">
          {editedChapter.verses.map((verse, index) => (
            <AccordionItem key={index} value={`verse-${index}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="text-left">
                  Вірш {verse.verse_number}
                  {verse.sanskrit && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({verse.sanskrit.substring(0, 30)}...)
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div>
                    <Label className="text-xs">Санскрит</Label>
                    <Textarea
                      value={verse.sanskrit || ''}
                      onChange={(e) => updateVerse(index, 'sanskrit', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Транслітерація</Label>
                    <Textarea
                      value={verse.transliteration || ''}
                      onChange={(e) => updateVerse(index, 'transliteration', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Синоніми (UA)</Label>
                    <Textarea
                      value={verse.synonyms_ua || ''}
                      onChange={(e) => updateVerse(index, 'synonyms_ua', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Переклад (UA)</Label>
                    <Textarea
                      value={verse.translation_ua || ''}
                      onChange={(e) => updateVerse(index, 'translation_ua', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Пояснення (UA)</Label>
                    <InlineTiptapEditor
                      content={verse.commentary_ua || ''}
                      onChange={(html) => updateVerse(index, 'commentary_ua', html)}
                      label="Пояснення (UA)"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isImporting}>
          Назад
        </Button>
        <Button onClick={handleImport} disabled={isImporting}>
          {isImporting ? 'Імпортування...' : 'Імпортувати главу'}
        </Button>
      </div>
    </div>
  );
}
