// src/pages/admin/UniversalImportFixed.tsx
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  Upload, FileText, Globe, BookOpen, Eye, 
  CheckCircle, AlertTriangle, Download 
} from "lucide-react";
import { ParserStatus } from "@/components/admin/ParserStatus";
import { parseVedabaseCC } from "@/utils/vedabaseParser";

import { supabase } from "@/integrations/supabase/client";

// Мапінг Vedabase slug → VedaVoice slug
const VEDABASE_TO_SITE_SLUG: Record<string, string> = {
  'sb': 'bhagavatam',
  'bg': 'gita',
  'cc': 'scc',
  'transcripts': 'lectures',
  'letters': 'letters'
};

type ImportSource = 'file' | 'vedabase' | 'gitabase';
type Step = 'source' | 'process' | 'preview' | 'save';

interface ImportData {
  source: ImportSource;
  rawText: string;
  processedText: string;
  chapters: any[];
  metadata: {
    title_ua: string;
    title_en: string;
    author: string;
    book_slug?: string;
    volume?: string;
    canto?: string;
    source_url?: string;
  };
}

export default function UniversalImportFixed() {
  const [currentStep, setCurrentStep] = useState<Step>('source');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parserOnline, setParserOnline] = useState<boolean | null>(null);
  const [importData, setImportData] = useState<ImportData>({
    source: 'file',
    rawText: '',
    processedText: '',
    chapters: [],
    metadata: {
      title_ua: '',
      title_en: '',
      author: 'Шріла Прабгупада'
    }
  });

  // Vedabase стейти
  const [vedabaseBook, setVedabaseBook] = useState('bg');
  const [vedabaseCanto, setVedabaseCanto] = useState('');
  const [vedabaseChapter, setVedabaseChapter] = useState('');
  const [vedabaseVerse, setVedabaseVerse] = useState('');
  const [vedabaseLanguage, setVedabaseLanguage] = useState('en');

  // Gitabase стейти
  const [gitabaseUrl, setGitabaseUrl] = useState('');
  const [gitabaseMode, setGitabaseMode] = useState('text-only');
  const [gitabaseNormalize, setGitabaseNormalize] = useState(true);

  // Розширений каталог Vedabase
  const VEDABASE_BOOKS: Record<string, { 
    name: string; 
    isMultiVolume: boolean; 
    volumeLabel: string; 
    cantos?: (string | number)[] 
  }> = {
    'bg': { name: 'Бгаґавад-ґіта як вона є', isMultiVolume: false, volumeLabel: 'Глава' },
    'sb': { name: 'Шрімад-Бгаґаватам', isMultiVolume: true, volumeLabel: 'Пісня', cantos: Array.from({length: 12}, (_, i) => i + 1) },
    'cc': { name: 'Шрі Чайтанья-чарітамріта', isMultiVolume: true, volumeLabel: 'Ліла', cantos: ['adi', 'madhya', 'antya'] },
    'iso': { name: 'Шрі Ішопанішад', isMultiVolume: false, volumeLabel: 'Мантра' },
    'noi': { name: 'Нектар наставлень', isMultiVolume: false, volumeLabel: 'Текст' },
    'kb': { name: 'Крішна - Верховна Особистість Бога', isMultiVolume: false, volumeLabel: 'Глава' },
    'tlk': { name: 'Наука самоусвідомлення', isMultiVolume: false, volumeLabel: 'Глава' },
    'nod': { name: 'Нектар відданості', isMultiVolume: false, volumeLabel: 'Глава' },
    'lec': { name: 'Лекції', isMultiVolume: false, volumeLabel: 'Лекція' },
    'let': { name: 'Листи', isMultiVolume: false, volumeLabel: 'Лист' }
  };

  // Імпорт файлу
  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      let extractedText = '';
      const fileName = file.name.toLowerCase();
      
      setProgress(25);
      
      if (fileName.endsWith('.pdf')) {
        toast({ title: "PDF парсинг", description: "Обробка PDF файлу..." });
        extractedText = await file.text(); // Тимчасово - потрібен правильний PDF парсер
        setProgress(75);
      } else if (fileName.endsWith('.epub')) {
        toast({ title: "EPUB парсинг", description: "Обробка EPUB файлу..." });
        extractedText = await file.text(); // Тимчасово - потрібен правильний EPUB парсер
        setProgress(75);
      } else if (fileName.endsWith('.html') || fileName.endsWith('.htm')) {
        toast({ title: "HTML парсинг", description: "Обробка HTML файлу..." });
        const html = await file.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        extractedText = doc.body?.textContent || html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        setProgress(75);
      } else if (fileName.endsWith('.txt')) {
        extractedText = await file.text();
        setProgress(75);
      } else {
        throw new Error('Непідтримуваний формат файлу');
      }
      
      setProgress(100);
      
      setImportData(prev => ({
        ...prev,
        rawText: extractedText,
        metadata: { ...prev.metadata, title_ua: file.name.replace(/\.[^/.]+$/, '') }
      }));
      
      toast({ title: "Файл завантажено", description: `${extractedText.length} символів` });
      setCurrentStep('process');
      
    } catch (error: any) {
      toast({ 
        title: "Помилка завантаження", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, []);

  // Імпорт з Vedabase - з автоматичним fallback на клієнтський парсер
  const handleVedabaseImport = useCallback(async () => {
    if (!vedabaseChapter) {
      toast({ 
        title: "Заповніть всі поля", 
        description: "Вкажіть главу",
        variant: "destructive" 
      });
      return;
    }
    
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const bookInfo = VEDABASE_BOOKS[vedabaseBook as keyof typeof VEDABASE_BOOKS];
      const lila = bookInfo?.isMultiVolume ? vedabaseCanto : '';
      
      if (vedabaseBook === 'cc') {
        // Chaitanya-charitamrita
        const siteSlug = VEDABASE_TO_SITE_SLUG[vedabaseBook] || vedabaseBook;
        const lilaMap: Record<string, number> = { 'adi': 1, 'madhya': 2, 'antya': 3 };
        const lilaNum = lilaMap[lila.toLowerCase()] || 1;
        
        setProgress(25);
        
        let result: any = null;
        let usedClientParser = false;

        // ✅ СПРОБА 1: Python parser server
        try {
          toast({ title: "Пробую Python parser", description: "Завантаження..." });
          const response = await fetch('http://127.0.0.1:5003/admin/parse-web-chapter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lila: lilaNum,
              chapter: parseInt(vedabaseChapter),
              verse_ranges: vedabaseVerse || '1-100',
              vedabase_base: `https://vedabase.io/en/library/cc/${lila}/${vedabaseChapter}/`,
              gitabase_base: `https://gitabase.com/ukr/CC/${lilaNum}/${vedabaseChapter}`
            })
          });
          
          if (response.ok) {
            result = await response.json();
            setParserOnline(true);
            toast({ title: "✅ Python parser", description: "Успішно підключено" });
          } else {
            throw new Error('Server returned error');
          }
        } catch (serverError) {
          // ✅ FALLBACK: Клієнтський парсер
          console.warn('Python parser недоступний, використовую клієнтський:', serverError);
          setParserOnline(false);
          toast({ title: "⚠️ Fallback режим", description: "Використовую вбудований парсер" });
          usedClientParser = true;
          
          setProgress(40);
          const verseRange = vedabaseVerse || '1-10';
          const [startVerse, endVerse] = verseRange.includes('-') 
            ? verseRange.split('-').map(Number) 
            : [parseInt(verseRange), parseInt(verseRange)];
          
          const verses = [];
          for (let v = startVerse; v <= endVerse; v++) {
            try {
              const url = `https://vedabase.io/en/library/cc/${lila}/${vedabaseChapter}/${v}`;
              const html = await fetch(url).then(r => r.text());
              const verseData = parseVedabaseCC(html, url);
              if (verseData) {
                verses.push({
                  verse_number: v.toString(),
                  sanskrit: verseData.bengali,
                  transliteration: verseData.transliteration,
                  synonyms_en: verseData.synonyms,
                  translation_en: verseData.translation,
                  commentary_en: verseData.purport
                });
              }
            } catch (e) {
              console.error(`Помилка парсингу вірша ${v}:`, e);
            }
            setProgress(40 + ((v - startVerse) / (endVerse - startVerse + 1)) * 35);
          }
          
          result = { verses };
        }
        
        if (!result?.verses || result.verses.length === 0) {
          throw new Error('Не вдалося отримати вірші');
        }
        
        // Структуруємо дані
        setImportData(prev => ({
          ...prev,
          source: 'vedabase',
          rawText: JSON.stringify(result.verses, null, 2).slice(0, 2000),
          processedText: JSON.stringify(result, null, 2),
          chapters: [{
            chapter_number: parseInt(vedabaseChapter),
            title_ua: `${bookInfo.name} ${lila} ${vedabaseChapter}`,
            title_en: `Chaitanya-charitamrita ${lila} ${vedabaseChapter}`,
            chapter_type: 'verses',
            verses: result.verses
          }],
          metadata: { 
            ...prev.metadata, 
            source_url: result.summary?.vedabase_base || '',
            title_ua: bookInfo.name,
            title_en: 'Chaitanya-charitamrita',
            book_slug: siteSlug, // ✅ scc
            vedabase_slug: vedabaseBook, // cc
            volume: lila, // "adi" (текстова назва)
            canto: lilaNum.toString(), // ✅ "1", "2", "3" (НОМЕР, НЕ назва!)
            lila_name: lila // зберігаємо назву окремо
          }
        }));
        
        setProgress(100);
        setCurrentStep('preview');
        toast({ 
          title: "✅ Розпарсено", 
          description: `${result.verses.length} віршів з Vedabase та Gitabase` 
        });
        
      } else {
        throw new Error('Поки що підтримується тільки CC');
      }
      
    } catch (error: any) {
      toast({ 
        title: "Помилка парсингу", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [vedabaseBook, vedabaseCanto, vedabaseChapter, vedabaseVerse]);

  // Gitabase - ВИМКНЕНО, використовуємо тільки Python parser для обох джерел
  const handleGitabaseImport = useCallback(async () => {
    toast({ 
      title: "Використовуйте Vedabase імпорт", 
      description: "Python parser автоматично парсить і Vedabase, і Gitabase",
      variant: "default" 
    });
  }, []);

  // Обробка тексту
  const processText = useCallback(async () => {
    setIsProcessing(true);
    setProgress(0);
    
    try {
      setProgress(50);
      
      // Проста обробка - розбиваємо на глави
      const chapters = [{
        chapter_number: 1,
        title_ua: importData.metadata.title_ua || 'Глава 1',
        chapter_type: 'verses',
        verses: [{
          verse_number: '1',
          translation_ua: importData.rawText.slice(0, 200) + '...'
        }]
      }];
      
      setProgress(100);
      
      setImportData(prev => ({
        ...prev,
        processedText: prev.rawText,
        chapters
      }));
      
      setCurrentStep('preview');
      toast({ title: "Обробка завершена", description: `1 глава створена` });
      
    } catch (error: any) {
      toast({ 
        title: "Помилка обробки", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [importData.rawText, importData.metadata.title_ua]);

  // ✅ РЕАЛЬНЕ ЗБЕРЕЖЕННЯ В SUPABASE
  const saveToDatabase = useCallback(async () => {
    if (!importData.chapters.length) {
      toast({ 
        title: "Немає даних", 
        description: "Спочатку імпортуйте та обробіть дані",
        variant: "destructive" 
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // 1. СТВОРЕННЯ/ОНОВЛЕННЯ КНИГИ
      setProgress(10);
      toast({ title: "Крок 1/3", description: "Створення запису книги..." });

      // Спочатку перевіряємо чи книга існує
      const targetBookSlug = importData.metadata.book_slug || 'imported-book';
      
      const { data: existingBook } = await supabase
        .from('books')
        .select('id')
        .eq('slug', targetBookSlug)
        .single();

      let bookId: string;

      if (existingBook) {
        // Книга існує - використовуємо її ID
        bookId = existingBook.id;
        toast({ title: "✅ Книга знайдена", description: `Використовуємо slug: ${targetBookSlug}` });
      } else {
        // Створюємо нову книгу
        const { data: newBook, error: bookError } = await supabase
          .from('books')
          .insert({
            slug: targetBookSlug,
            title_ua: importData.metadata.title_ua || 'Імпортована книга',
            title_en: importData.metadata.title_en || 'Imported Book',
            is_published: true
          })
          .select('id')
          .single();

        if (bookError) throw bookError;
        if (!newBook) throw new Error('Не вдалося створити книгу');
        
        bookId = newBook.id;
        toast({ title: "📚 Книга створена", description: `Новий slug: ${targetBookSlug}` });
      }

      // 2. ЗНАЙТИ CANTO (якщо є)
      setProgress(35);
      let cantoId: string | null = null;
      const cantoNumber = importData.metadata.canto || importData.metadata.volume;
      
      if (cantoNumber && bookId) {
        const { data: cantoData, error: cantoError } = await supabase
          .from('cantos')
          .select('id')
          .eq('book_id', bookId)
          .eq('canto_number', parseInt(cantoNumber as string))
          .single();
        
        if (cantoData) {
          cantoId = cantoData.id;
          toast({ title: "📖 Canto знайдено", description: `Canto ${cantoNumber}` });
        } else {
          console.warn(`Canto ${cantoNumber} не знайдено для книги ${bookId}`);
        }
      }

      // 3. СТВОРЕННЯ ГЛАВ
      setProgress(40);
      toast({ title: "Крок 3/4", description: `Створення ${importData.chapters.length} глав...` });

      const chapterInserts = importData.chapters.map(ch => ({
        book_id: bookId,
        canto_id: cantoId, // Додаємо canto_id
        chapter_number: ch.chapter_number,
        title_ua: ch.title_ua || `Глава ${ch.chapter_number}`,
        title_en: ch.title_en || `Chapter ${ch.chapter_number}`,
        chapter_type: ch.chapter_type || 'verses'
      }));

      // ✅ Використовуємо тільки book_id,chapter_number (це єдиний існуючий constraint)
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('chapters')
        .upsert(chapterInserts, { onConflict: 'book_id,chapter_number' })
        .select('id, chapter_number');

      if (chaptersError) throw chaptersError;
      if (!chaptersData) throw new Error('Не вдалося створити глави');

      // Мапа chapter_number → chapter_id
      const chapterIdMap = new Map(
        chaptersData.map(ch => [ch.chapter_number, ch.id])
      );

      // 3. СТВОРЕННЯ ВІРШІВ
      setProgress(70);
      const totalVerses = importData.chapters.reduce((sum, ch) => sum + (ch.verses?.length || 0), 0);
      toast({ title: "Крок 3/3", description: `Створення ${totalVerses} віршів...` });

      const verseInserts = importData.chapters.flatMap(ch => {
        const chapterId = chapterIdMap.get(ch.chapter_number);
        if (!chapterId) return [];

        return (ch.verses || []).map(v => ({
          chapter_id: chapterId,
          verse_number: v.verse_number || '1',
          sanskrit: v.sanskrit || '',
          transliteration_ua: v.transliteration || v.transliteration_ua || '',
          transliteration_en: v.transliteration_en || '',
          synonyms_en: v.synonyms_en || '',
          synonyms_ua: v.synonyms_ua || '',
          translation_en: v.translation_en || '',
          translation_ua: v.translation_ua || '',
          commentary_en: v.commentary_en || '',
          commentary_ua: v.commentary_ua || ''
        }));
      });

      if (verseInserts.length > 0) {
        const { error: versesError } = await supabase
          .from('verses')
          .upsert(verseInserts, { onConflict: 'chapter_id,verse_number' });

        if (versesError) throw versesError;
      }

      setProgress(100);
      
      toast({ 
        title: "✅ Успішно збережено!", 
        description: `Книга: ${importData.metadata.title_ua}, Глав: ${importData.chapters.length}, Віршів: ${totalVerses}`,
        variant: "default"
      });

      // Редірект на відповідну сторінку
      const bookSlug = importData.metadata.book_slug;
      const firstChapter = importData.chapters[0]?.chapter_number || 1;
      const canto = importData.metadata.canto || importData.metadata.volume || '1';
      const firstVerse = importData.chapters[0]?.verses?.[0]?.verse_number || '1';
      
      setTimeout(() => {
        if (bookSlug) {
          // Для книг з Canto/Lila структурою (CC, SB)
          if (canto) {
            window.location.href = `/veda-reader/${bookSlug}/canto/${canto}/chapter/${firstChapter}/${firstVerse}`;
          } else {
            // Для книг без Canto (BG, ISO, etc.)
            window.location.href = `/${bookSlug}/${firstChapter}`;
          }
        }
      }, 2000);

      // Скидаємо стан
      setTimeout(() => {
        setImportData({
          source: 'file',
          rawText: '',
          processedText: '',
          chapters: [],
          metadata: {
            title_ua: '',
            title_en: '',
            author: 'Шріла Прабгупада'
          }
        });
        setCurrentStep('source');
      }, 3000);

    } catch (error: any) {
      console.error('Database save error:', error);
      toast({ 
        title: "Помилка збереження", 
        description: error.message || 'Невідома помилка',
        variant: "destructive" 
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [importData]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Universal Book Import (Fixed)
        </CardTitle>
        <ParserStatus className="mt-4" />
      </CardHeader>
        <CardContent>
          {isProcessing && (
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-1">Обробка... {progress}%</p>
            </div>
          )}

          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="source">Джерело</TabsTrigger>
              <TabsTrigger value="process" disabled={currentStep === 'source'}>Обробка</TabsTrigger>
              <TabsTrigger value="preview" disabled={!['preview', 'save'].includes(currentStep)}>Перегляд</TabsTrigger>
              <TabsTrigger value="save" disabled={currentStep !== 'save'}>Збереження</TabsTrigger>
            </TabsList>

            {/* ДЖЕРЕЛО */}
            <TabsContent value="source" className="space-y-4">
              <Tabs value={importData.source} onValueChange={(v) => setImportData(prev => ({ ...prev, source: v as ImportSource }))}>
                <TabsList>
                  <TabsTrigger value="file">Файл</TabsTrigger>
                  <TabsTrigger value="vedabase">Vedabase</TabsTrigger>
                  <TabsTrigger value="gitabase">Gitabase</TabsTrigger>
                </TabsList>

                <TabsContent value="file">
                  <div className="space-y-4">
                    <Label>Завантажити файл (PDF, EPUB, TXT, HTML)</Label>
                    <Input 
                      type="file" 
                      accept=".pdf,.epub,.txt,.html,.htm"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      disabled={isProcessing}
                    />
                    <p className="text-sm text-muted-foreground">
                      Підтримуються формати: PDF, EPUB, TXT, HTML
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="vedabase">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Книга</Label>
                        <select 
                          value={vedabaseBook}
                          onChange={(e) => setVedabaseBook(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          {Object.entries(VEDABASE_BOOKS).map(([slug, info]) => (
                            <option key={slug} value={slug}>{info.name} ({slug.toUpperCase()})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Мова</Label>
                        <select 
                          value={vedabaseLanguage}
                          onChange={(e) => setVedabaseLanguage(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="en">English</option>
                          <option value="ua">Українська</option>
                        </select>
                      </div>
                    </div>

                    {VEDABASE_BOOKS[vedabaseBook as keyof typeof VEDABASE_BOOKS]?.isMultiVolume && (
                      <div>
                        <Label>{VEDABASE_BOOKS[vedabaseBook as keyof typeof VEDABASE_BOOKS]?.volumeLabel}</Label>
                        <select 
                          value={vedabaseCanto}
                          onChange={(e) => setVedabaseCanto(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Оберіть {VEDABASE_BOOKS[vedabaseBook as keyof typeof VEDABASE_BOOKS]?.volumeLabel?.toLowerCase()}</option>
                          {VEDABASE_BOOKS[vedabaseBook as keyof typeof VEDABASE_BOOKS]?.cantos?.map((canto) => (
                            <option key={canto} value={canto}>
                              {vedabaseBook === 'cc' ? 
                                `${String(canto).charAt(0).toUpperCase() + String(canto).slice(1)}-ліла` : 
                                `${VEDABASE_BOOKS[vedabaseBook as keyof typeof VEDABASE_BOOKS]?.volumeLabel} ${canto}`
                              }
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Глава (опціонально)</Label>
                        <Input 
                          placeholder="1"
                          value={vedabaseChapter}
                          onChange={(e) => setVedabaseChapter(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Вірші (опціонально)</Label>
                        <Input 
                          placeholder="1-10, 1, або залишити пусто"
                          value={vedabaseVerse}
                          onChange={(e) => setVedabaseVerse(e.target.value)}
                        />
                      </div>
                    </div>

                    <Button onClick={handleVedabaseImport} disabled={isProcessing}>
                      <Globe className="w-4 h-4 mr-2" />
                      Імпортувати з Vedabase
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Всі поля опціональні - можна залишити порожніми для імпорту всієї книги
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="gitabase">
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">⚠️ Gitabase.com імпорт</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Тільки CC (ліли) та NoI, тільки українською мовою
                      </p>
                      <div>
                        <Label>URL сторінки (опціонально)</Label>
                        <Input 
                          placeholder="https://gitabase.com/ukr/CC/adi/1/1" 
                          value={gitabaseUrl}
                          onChange={(e) => setGitabaseUrl(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleGitabaseImport} disabled={isProcessing} className="mt-4">
                        <Globe className="w-4 h-4 mr-2" />
                        Імпортувати з Gitabase
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* ОБРОБКА */}
            <TabsContent value="process" className="space-y-4">
              <div className="space-y-4">
                {importData.rawText && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Сирий текст для обробки</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea 
                        value={importData.rawText}
                        onChange={(e) => setImportData(prev => ({ ...prev, rawText: e.target.value }))}
                        rows={8}
                        className="font-mono text-sm"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Символів: {importData.rawText.length}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Назва книги (українська)</Label>
                    <Input 
                      value={importData.metadata.title_ua}
                      onChange={(e) => setImportData(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, title_ua: e.target.value }
                      }))}
                      placeholder="Наприклад: Бгаґавад-ґіта як вона є"
                    />
                  </div>
                  <div>
                    <Label>Назва книги (English) - опціонально</Label>
                    <Input 
                      value={importData.metadata.title_en}
                      onChange={(e) => setImportData(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, title_en: e.target.value }
                      }))}
                      placeholder="Example: Bhagavad-gita As It Is"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Slug книги - опціонально</Label>
                    <Input 
                      value={importData.metadata.book_slug || ''}
                      onChange={(e) => setImportData(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, book_slug: e.target.value }
                      }))}
                      placeholder="gita, bhagavatam, scc..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Якщо slug існує - додасть до книги, якщо ні - створить нову
                    </p>
                  </div>
                  <div>
                    <Label>Том/Пісня/Ліла - опціонально</Label>
                    <Input 
                      value={importData.metadata.volume || ''}
                      onChange={(e) => setImportData(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, volume: e.target.value }
                      }))}
                      placeholder="1, Аді-ліла, Перша пісня..."
                    />
                  </div>
                  <div>
                    <Label>Автор</Label>
                    <Input 
                      value={importData.metadata.author}
                      onChange={(e) => setImportData(prev => ({
                        ...prev,
                        metadata: { ...prev.metadata, author: e.target.value }
                      }))}
                      placeholder="Шріла Прабгупада"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('source')}>
                    ← Назад до джерела
                  </Button>
                  <Button onClick={processText} disabled={isProcessing || !importData.rawText}>
                    <FileText className="w-4 h-4 mr-2" />
                    Обробити текст
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* ПЕРЕГЛЯД */}
            <TabsContent value="preview" className="space-y-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Результат обробки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Глав: {importData.chapters.length}</p>
                    <p>Символів: {importData.processedText.length}</p>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('process')}>
                    ← Назад до обробки
                  </Button>
                  <Button onClick={() => setCurrentStep('save')}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Готово до збереження
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* ЗБЕРЕЖЕННЯ */}
            <TabsContent value="save" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                    <h3 className="text-xl font-semibold">Готово до збереження</h3>
                    <div className="bg-muted p-4 rounded-lg text-left">
                      <h4 className="font-semibold mb-2">Куди буде збережено:</h4>
                      <ul className="space-y-1 text-sm">
                        <li>📚 <strong>Таблиця books:</strong> {importData.metadata.title_ua || 'Назва книги'}</li>
                        <li>📖 <strong>Таблиця chapters:</strong> {importData.chapters.length} глав{importData.chapters.filter(ch => ch.chapter_type === 'intro').length > 0 && ` (включно з ${importData.chapters.filter(ch => ch.chapter_type === 'intro').length} передмовами в intro_chapters)`}</li>
                        <li>📝 <strong>Таблиця verses:</strong> {importData.chapters.reduce((sum, ch) => sum + (ch.verses?.length || 0), 0)} віршів</li>
                        <li>🔖 <strong>Slug:</strong> {importData.metadata.book_slug || '(буде створено автоматично)'}</li>
                        {importData.metadata.volume && <li>📚 <strong>Том:</strong> {importData.metadata.volume}</li>}
                      </ul>
                    </div>
                    <Button size="lg" onClick={saveToDatabase} disabled={isProcessing}>
                      <Download className="w-4 h-4 mr-2" />
                      Зберегти в базу даних Supabase
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
