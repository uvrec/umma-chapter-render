// src/pages/admin/BookExport.tsx
// Інструмент для експорту глав/віршів з HTML форматуванням
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  Copy,
  Check,
  BookOpen,
  Cloud,
  Eye,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  initializeGoogleDrive,
  uploadToGoogleDrive,
  isGoogleDriveConfigured,
  isAuthorized,
  requestAccessToken,
} from "@/services/googleDriveService";

// Types
interface Book {
  id: string;
  slug: string;
  title_uk: string;
  title_en: string;
  has_cantos: boolean;
}

interface Canto {
  id: string;
  canto_number: number;
  title_uk: string;
  title_en: string;
}

interface Chapter {
  id: string;
  chapter_number: number;
  title_uk: string;
  title_en: string;
  chapter_type: string | null;
}

interface Verse {
  id: string;
  verse_number: string;
  sanskrit: string | null;
  transliteration: string | null;
  transliteration_uk: string | null;
  synonyms_uk: string | null;
  synonyms_en: string | null;
  translation_uk: string | null;
  translation_en: string | null;
  commentary_uk: string | null;
  commentary_en: string | null;
}

interface ExportOptions {
  includeSanskrit: boolean;
  includeTransliteration: boolean;
  includeSynonyms: boolean;
  includeTranslation: boolean;
  includeCommentary: boolean;
  language: 'uk' | 'en' | 'both';
  useMarkers: boolean;
}

// Helper to strip HTML tags but preserve line breaks
function stripHtml(html: string | null): string {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Format verse for export with markers
// @ - chapter number
// @@ - verse number
// @@@ - commentary/explanation separator
function formatVerseForExport(
  verse: Verse,
  chapterNumber: number,
  options: ExportOptions,
  isFirstVerse: boolean
): string {
  const lines: string[] = [];
  const lang = options.language;

  // Chapter marker only for first verse
  if (isFirstVerse && options.useMarkers) {
    lines.push(`@${chapterNumber}`);
    lines.push('');
  }

  // Verse number marker
  if (options.useMarkers) {
    lines.push(`@@${verse.verse_number}`);
  } else {
    lines.push(`<h3>Вірш ${verse.verse_number}</h3>`);
  }
  lines.push('');

  // Sanskrit
  if (options.includeSanskrit && verse.sanskrit) {
    if (!options.useMarkers) {
      lines.push('<div class="sanskrit">');
    }
    lines.push(stripHtml(verse.sanskrit));
    if (!options.useMarkers) {
      lines.push('</div>');
    }
    lines.push('');
  }

  // Transliteration
  if (options.includeTransliteration) {
    const translit = verse.transliteration_uk || verse.transliteration;
    if (translit) {
      if (!options.useMarkers) {
        lines.push('<div class="transliteration">');
      }
      lines.push(stripHtml(translit));
      if (!options.useMarkers) {
        lines.push('</div>');
      }
      lines.push('');
    }
  }

  // Synonyms
  if (options.includeSynonyms) {
    let synonyms = '';
    if (lang === 'uk' || lang === 'both') {
      synonyms = verse.synonyms_uk || '';
    }
    if (lang === 'en' || (lang === 'both' && verse.synonyms_en)) {
      if (synonyms && lang === 'both') synonyms += '\n\n';
      synonyms += verse.synonyms_en || '';
    }
    if (synonyms) {
      if (!options.useMarkers) {
        lines.push('<div class="synonyms">');
        lines.push('<strong>Послівний переклад:</strong>');
      }
      lines.push(stripHtml(synonyms));
      if (!options.useMarkers) {
        lines.push('</div>');
      }
      lines.push('');
    }
  }

  // Translation
  if (options.includeTranslation) {
    let translation = '';
    if (lang === 'uk' || lang === 'both') {
      translation = verse.translation_uk || '';
    }
    if (lang === 'en' || (lang === 'both' && verse.translation_en)) {
      if (translation && lang === 'both') translation += '\n\n';
      translation += verse.translation_en || '';
    }
    if (translation) {
      if (!options.useMarkers) {
        lines.push('<div class="translation">');
        lines.push('<strong>Переклад:</strong>');
      }
      lines.push(stripHtml(translation));
      if (!options.useMarkers) {
        lines.push('</div>');
      }
      lines.push('');
    }
  }

  // Commentary (with @@@ marker)
  if (options.includeCommentary) {
    let commentary = '';
    if (lang === 'uk' || lang === 'both') {
      commentary = verse.commentary_uk || '';
    }
    if (lang === 'en' || (lang === 'both' && verse.commentary_en)) {
      if (commentary && lang === 'both') commentary += '\n\n';
      commentary += verse.commentary_en || '';
    }
    if (commentary) {
      if (options.useMarkers) {
        lines.push('@@@');
      } else {
        lines.push('<div class="commentary">');
        lines.push('<strong>Пояснення:</strong>');
      }
      lines.push(stripHtml(commentary));
      if (!options.useMarkers) {
        lines.push('</div>');
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

// Generate filename according to convention: UK [slug]_[canto]_@[chapter]_tAniruddha
function generateFilename(
  bookSlug: string,
  cantoNumber: number | null,
  chapterNumber: number
): string {
  const slugUpper = bookSlug.toUpperCase();

  // Map canto numbers to names (for common books)
  const cantoNames: Record<number, string> = {
    1: 'Adi',
    2: 'Madhya',
    3: 'Antya',
  };

  if (cantoNumber !== null) {
    const cantoName = cantoNames[cantoNumber] || `C${cantoNumber}`;
    return `UK ${slugUpper}_${cantoName}_@${chapterNumber}_tAniruddha`;
  }

  return `UK ${slugUpper}_@${chapterNumber}_tAniruddha`;
}

export default function BookExport() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL params for pre-selection (from reader page)
  const urlBookSlug = searchParams.get('book');
  const urlCantoId = searchParams.get('canto');
  const urlChapterId = searchParams.get('chapter');

  // Data states
  const [books, setBooks] = useState<Book[]>([]);
  const [cantos, setCantos] = useState<Canto[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [verses, setVerses] = useState<Verse[]>([]);

  // Selection states
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [selectedCantoId, setSelectedCantoId] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedVerseIds, setSelectedVerseIds] = useState<Set<string>>(new Set());
  const [selectAllVerses, setSelectAllVerses] = useState(true);

  // Track if we've applied URL params
  const [urlParamsApplied, setUrlParamsApplied] = useState(false);

  // Export options
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeSanskrit: true,
    includeTransliteration: true,
    includeSynonyms: true,
    includeTranslation: true,
    includeCommentary: true,
    language: 'uk',
    useMarkers: true,
  });

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [exportPreview, setExportPreview] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('select');

  // Google Drive states
  const [googleDriveReady, setGoogleDriveReady] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);

  // Get current selections
  const selectedBook = useMemo(() =>
    books.find(b => b.id === selectedBookId),
    [books, selectedBookId]
  );

  const selectedCanto = useMemo(() =>
    cantos.find(c => c.id === selectedCantoId),
    [cantos, selectedCantoId]
  );

  const selectedChapter = useMemo(() =>
    chapters.find(c => c.id === selectedChapterId),
    [chapters, selectedChapterId]
  );

  // Auth check
  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  // Initialize Google Drive
  useEffect(() => {
    if (isGoogleDriveConfigured()) {
      initializeGoogleDrive()
        .then(() => {
          setGoogleDriveReady(true);
        })
        .catch((error) => {
          console.warn('Google Drive initialization failed:', error);
          setGoogleDriveReady(false);
        });
    }
  }, []);

  // Load books
  useEffect(() => {
    const loadBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, slug, title_uk, title_en, has_cantos')
        .order('title_uk');

      if (error) {
        console.error('Error loading books:', error);
        toast.error('Помилка завантаження книг');
        return;
      }

      setBooks(data || []);
    };

    loadBooks();
  }, []);

  // Auto-select book from URL param (by slug)
  useEffect(() => {
    if (urlBookSlug && books.length > 0 && !urlParamsApplied) {
      const book = books.find(b => b.slug === urlBookSlug);
      if (book) {
        setSelectedBookId(book.id);
      }
    }
  }, [urlBookSlug, books, urlParamsApplied]);

  // Auto-select canto from URL param
  useEffect(() => {
    if (urlCantoId && cantos.length > 0 && !urlParamsApplied) {
      const canto = cantos.find(c => c.id === urlCantoId);
      if (canto) {
        setSelectedCantoId(canto.id);
      }
    }
  }, [urlCantoId, cantos, urlParamsApplied]);

  // Auto-select chapter from URL param
  useEffect(() => {
    if (urlChapterId && chapters.length > 0 && !urlParamsApplied) {
      const chapter = chapters.find(c => c.id === urlChapterId);
      if (chapter) {
        setSelectedChapterId(chapter.id);
        setUrlParamsApplied(true); // Mark as applied to prevent re-selection
        setActiveTab('preview'); // Go directly to preview tab
      }
    }
  }, [urlChapterId, chapters, urlParamsApplied]);

  // Load cantos when book changes
  useEffect(() => {
    if (!selectedBookId) {
      setCantos([]);
      setSelectedCantoId('');
      return;
    }

    const book = books.find(b => b.id === selectedBookId);
    if (!book?.has_cantos) {
      setCantos([]);
      setSelectedCantoId('');
      return;
    }

    const loadCantos = async () => {
      const { data, error } = await supabase
        .from('cantos')
        .select('id, canto_number, title_uk, title_en')
        .eq('book_id', selectedBookId)
        .order('canto_number');

      if (error) {
        console.error('Error loading cantos:', error);
        return;
      }

      setCantos(data || []);
    };

    loadCantos();
  }, [selectedBookId, books]);

  // Load chapters
  useEffect(() => {
    setChapters([]);
    setSelectedChapterId('');

    const loadChapters = async () => {
      let query = supabase
        .from('chapters')
        .select('id, chapter_number, title_uk, title_en, chapter_type')
        .order('chapter_number');

      if (selectedCantoId) {
        query = query.eq('canto_id', selectedCantoId);
      } else if (selectedBookId && !selectedBook?.has_cantos) {
        query = query.eq('book_id', selectedBookId);
      } else {
        return;
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading chapters:', error);
        return;
      }

      setChapters(data || []);
    };

    loadChapters();
  }, [selectedBookId, selectedCantoId, selectedBook?.has_cantos]);

  // Load verses
  useEffect(() => {
    if (!selectedChapterId) {
      setVerses([]);
      setSelectedVerseIds(new Set());
      return;
    }

    const loadVerses = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('verses')
        .select(`
          id,
          verse_number,
          sanskrit,
          transliteration,
          transliteration_uk,
          synonyms_uk,
          synonyms_en,
          translation_uk,
          translation_en,
          commentary_uk,
          commentary_en
        `)
        .eq('chapter_id', selectedChapterId)
        .is('deleted_at', null)
        .order('verse_number_sort');

      setIsLoading(false);

      if (error) {
        console.error('Error loading verses:', error);
        toast.error('Помилка завантаження віршів');
        return;
      }

      setVerses(data || []);

      // Select all by default
      if (selectAllVerses) {
        setSelectedVerseIds(new Set((data || []).map(v => v.id)));
      }
    };

    loadVerses();
  }, [selectedChapterId, selectAllVerses]);

  // Generate export preview
  const generateExport = useCallback(() => {
    if (!selectedChapter || verses.length === 0) {
      setExportPreview('');
      return;
    }

    const versesToExport = selectAllVerses
      ? verses
      : verses.filter(v => selectedVerseIds.has(v.id));

    if (versesToExport.length === 0) {
      setExportPreview('Оберіть хоча б один вірш для експорту');
      return;
    }

    const exportContent = versesToExport.map((verse, index) =>
      formatVerseForExport(
        verse,
        selectedChapter.chapter_number,
        exportOptions,
        index === 0
      )
    ).join('\n---\n\n');

    setExportPreview(exportContent);
  }, [verses, selectedChapter, selectAllVerses, selectedVerseIds, exportOptions]);

  // Update preview when options change
  useEffect(() => {
    generateExport();
  }, [generateExport]);

  // Toggle verse selection
  const toggleVerseSelection = (verseId: string) => {
    setSelectedVerseIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(verseId)) {
        newSet.delete(verseId);
      } else {
        newSet.add(verseId);
      }
      return newSet;
    });
    setSelectAllVerses(false);
  };

  // Select/deselect all verses
  const handleSelectAll = (checked: boolean) => {
    setSelectAllVerses(checked);
    if (checked) {
      setSelectedVerseIds(new Set(verses.map(v => v.id)));
    } else {
      setSelectedVerseIds(new Set());
    }
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportPreview);
      setCopied(true);
      toast.success('Скопійовано в буфер обміну');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Помилка копіювання');
    }
  };

  // Download as file
  const downloadAsFile = () => {
    if (!exportPreview || !selectedBook || !selectedChapter) return;

    const filename = generateFilename(
      selectedBook.slug,
      selectedCanto?.canto_number || null,
      selectedChapter.chapter_number
    );

    const blob = new Blob([exportPreview], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Файл ${filename}.txt завантажено`);
  };

  // Download as HTML
  const downloadAsHtml = () => {
    if (!exportPreview || !selectedBook || !selectedChapter) return;

    const filename = generateFilename(
      selectedBook.slug,
      selectedCanto?.canto_number || null,
      selectedChapter.chapter_number
    );

    const chapterTitle = selectedChapter.title_uk;
    const bookTitle = selectedBook.title_uk;
    const cantoTitle = selectedCanto?.title_uk || '';

    const htmlContent = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${bookTitle}${cantoTitle ? ` - ${cantoTitle}` : ''} - Глава ${selectedChapter.chapter_number}</title>
  <style>
    body {
      font-family: Georgia, 'Times New Roman', serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3 { color: #8B4513; }
    h1 { border-bottom: 2px solid #8B4513; padding-bottom: 0.5rem; }
    .sanskrit {
      font-size: 1.2rem;
      color: #800000;
      margin: 1rem 0;
    }
    .transliteration {
      font-style: italic;
      color: #555;
      margin: 0.5rem 0;
    }
    .synonyms {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }
    .translation {
      font-size: 1.1rem;
      margin: 1rem 0;
    }
    .commentary {
      background: #fffef0;
      padding: 1rem;
      border-left: 3px solid #8B4513;
      margin: 1rem 0;
    }
    hr { border: none; border-top: 1px dashed #ccc; margin: 2rem 0; }
  </style>
</head>
<body>
  <h1>${bookTitle}</h1>
  ${cantoTitle ? `<h2>${cantoTitle}</h2>` : ''}
  <h2>Глава ${selectedChapter.chapter_number}: ${chapterTitle}</h2>

  <div class="content">
${exportPreview.split('\n').map(line => {
  if (line.startsWith('@@@')) return '<hr><div class="commentary-marker"><strong>Пояснення:</strong></div>';
  if (line.startsWith('@@')) return `<h3>Вірш ${line.substring(2)}</h3>`;
  if (line.startsWith('@') && !line.startsWith('@@')) return `<h2>Глава ${line.substring(1)}</h2>`;
  if (line === '---') return '<hr>';
  if (line.trim() === '') return '';
  return `<p>${line}</p>`;
}).join('\n')}
  </div>

  <footer style="margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ccc; color: #666; font-size: 0.9rem;">
    <p>Експортовано з Umma • ${new Date().toLocaleDateString('uk-UA')}</p>
  </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Файл ${filename}.html завантажено`);
  };

  // Save to Google Drive
  const saveToGoogleDrive = async () => {
    if (!exportPreview || !selectedBook || !selectedChapter) {
      toast.error('Немає даних для експорту');
      return;
    }

    if (!isGoogleDriveConfigured()) {
      toast.error('Google Drive не налаштовано. Зверніться до адміністратора.');
      return;
    }

    if (!googleDriveReady) {
      toast.error('Google Drive ще завантажується. Спробуйте ще раз.');
      return;
    }

    setIsUploadingToDrive(true);

    try {
      // Request authorization if not already authorized
      if (!isAuthorized()) {
        await requestAccessToken();
      }

      const filename = generateFilename(
        selectedBook.slug,
        selectedCanto?.canto_number || null,
        selectedChapter.chapter_number
      );

      // Upload the text file
      const result = await uploadToGoogleDrive(
        exportPreview,
        `${filename}.txt`,
        'text/plain;charset=utf-8'
      );

      toast.success(
        <div className="flex flex-col gap-1">
          <span>Файл збережено в Google Drive!</span>
          <a
            href={result.webViewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm"
          >
            Відкрити файл
          </a>
        </div>,
        { duration: 5000 }
      );
    } catch (error) {
      console.error('Google Drive upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Невідома помилка';
      toast.error(`Помилка завантаження: ${errorMessage}`);
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  if (!user || !isAdmin) return null;

  const selectedVersesCount = selectAllVerses ? verses.length : selectedVerseIds.size;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold">Експорт книг</h1>
            <p className="text-sm text-muted-foreground">
              Експорт глав та віршів з HTML форматуванням
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="select" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Вибір контенту
            </TabsTrigger>
            <TabsTrigger value="options" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Налаштування
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Перегляд
              {selectedVersesCount > 0 && (
                <Badge variant="secondary" className="ml-1">{selectedVersesCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Selection Tab */}
          <TabsContent value="select">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Book/Canto/Chapter Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Оберіть джерело</CardTitle>
                  <CardDescription>
                    Виберіть книгу, канто (якщо є) та главу для експорту
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Book */}
                  <div className="space-y-2">
                    <Label>Книга</Label>
                    <Select value={selectedBookId} onValueChange={setSelectedBookId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Оберіть книгу..." />
                      </SelectTrigger>
                      <SelectContent>
                        {books.map(book => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title_uk} ({book.slug})
                            {book.has_cantos && ' - має канто'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Canto (if book has cantos) */}
                  {selectedBook?.has_cantos && cantos.length > 0 && (
                    <div className="space-y-2">
                      <Label>Канто / Пісня</Label>
                      <Select value={selectedCantoId} onValueChange={setSelectedCantoId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть канто..." />
                        </SelectTrigger>
                        <SelectContent>
                          {cantos.map(canto => (
                            <SelectItem key={canto.id} value={canto.id}>
                              {canto.canto_number}. {canto.title_uk}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Chapter */}
                  {chapters.length > 0 && (
                    <div className="space-y-2">
                      <Label>Глава</Label>
                      <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Оберіть главу..." />
                        </SelectTrigger>
                        <SelectContent>
                          {chapters.map(chapter => (
                            <SelectItem key={chapter.id} value={chapter.id}>
                              {chapter.chapter_number}. {chapter.title_uk}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Filename preview */}
                  {selectedBook && selectedChapter && (
                    <div className="mt-4 p-3 bg-muted rounded-md">
                      <Label className="text-xs text-muted-foreground">Ім'я файлу:</Label>
                      <p className="font-mono text-sm mt-1">
                        {generateFilename(
                          selectedBook.slug,
                          selectedCanto?.canto_number || null,
                          selectedChapter.chapter_number
                        )}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Verses Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Вірші</span>
                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  </CardTitle>
                  <CardDescription>
                    {verses.length > 0
                      ? `${verses.length} віршів • ${selectedVersesCount} обрано`
                      : 'Оберіть главу для завантаження віршів'
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {verses.length > 0 && (
                    <>
                      <div className="flex items-center space-x-2 mb-4 pb-4 border-b">
                        <Checkbox
                          id="select-all"
                          checked={selectAllVerses}
                          onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                        />
                        <Label htmlFor="select-all" className="cursor-pointer font-medium">
                          Обрати всі вірші
                        </Label>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto space-y-2">
                        {verses.map(verse => (
                          <div
                            key={verse.id}
                            className="flex items-start space-x-2 p-2 hover:bg-muted rounded-md"
                          >
                            <Checkbox
                              id={`verse-${verse.id}`}
                              checked={selectAllVerses || selectedVerseIds.has(verse.id)}
                              onCheckedChange={() => toggleVerseSelection(verse.id)}
                            />
                            <Label
                              htmlFor={`verse-${verse.id}`}
                              className="cursor-pointer flex-1"
                            >
                              <span className="font-medium">Вірш {verse.verse_number}</span>
                              {verse.translation_uk && (
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                  {stripHtml(verse.translation_uk).substring(0, 100)}...
                                </p>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {!selectedChapterId && (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>Оберіть главу для відображення віршів</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Options Tab */}
          <TabsContent value="options">
            <Card>
              <CardHeader>
                <CardTitle>Налаштування експорту</CardTitle>
                <CardDescription>
                  Оберіть, які елементи включити в експорт та формат виводу
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language */}
                <div className="space-y-2">
                  <Label>Мова</Label>
                  <Select
                    value={exportOptions.language}
                    onValueChange={(value: 'uk' | 'en' | 'both') =>
                      setExportOptions(prev => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uk">Українська</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="both">Обидві мови</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Format */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-markers"
                    checked={exportOptions.useMarkers}
                    onCheckedChange={(checked) =>
                      setExportOptions(prev => ({ ...prev, useMarkers: checked as boolean }))
                    }
                  />
                  <Label htmlFor="use-markers" className="cursor-pointer">
                    Використовувати маркери (@, @@, @@@)
                  </Label>
                </div>

                {/* Content sections */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Включити в експорт:</Label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-sanskrit"
                        checked={exportOptions.includeSanskrit}
                        onCheckedChange={(checked) =>
                          setExportOptions(prev => ({ ...prev, includeSanskrit: checked as boolean }))
                        }
                      />
                      <Label htmlFor="include-sanskrit" className="cursor-pointer">
                        Санскрит
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-transliteration"
                        checked={exportOptions.includeTransliteration}
                        onCheckedChange={(checked) =>
                          setExportOptions(prev => ({ ...prev, includeTransliteration: checked as boolean }))
                        }
                      />
                      <Label htmlFor="include-transliteration" className="cursor-pointer">
                        Транслітерація
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-synonyms"
                        checked={exportOptions.includeSynonyms}
                        onCheckedChange={(checked) =>
                          setExportOptions(prev => ({ ...prev, includeSynonyms: checked as boolean }))
                        }
                      />
                      <Label htmlFor="include-synonyms" className="cursor-pointer">
                        Синоніми
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-translation"
                        checked={exportOptions.includeTranslation}
                        onCheckedChange={(checked) =>
                          setExportOptions(prev => ({ ...prev, includeTranslation: checked as boolean }))
                        }
                      />
                      <Label htmlFor="include-translation" className="cursor-pointer">
                        Переклад
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="include-commentary"
                        checked={exportOptions.includeCommentary}
                        onCheckedChange={(checked) =>
                          setExportOptions(prev => ({ ...prev, includeCommentary: checked as boolean }))
                        }
                      />
                      <Label htmlFor="include-commentary" className="cursor-pointer">
                        Коментар / Пояснення
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Markers legend */}
                {exportOptions.useMarkers && (
                  <div className="p-4 bg-muted rounded-md space-y-2">
                    <Label className="font-semibold">Легенда маркерів:</Label>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li><code className="bg-background px-1 rounded">@N</code> — номер глави</li>
                      <li><code className="bg-background px-1 rounded">@@N</code> — номер вірша</li>
                      <li><code className="bg-background px-1 rounded">@@@</code> — початок пояснення (відділяє від вірша)</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Перегляд експорту</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateExport}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Оновити
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>
                  {selectedVersesCount > 0
                    ? `${selectedVersesCount} віршів готові до експорту`
                    : 'Оберіть вірші для експорту'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {exportPreview ? (
                  <>
                    <Textarea
                      value={exportPreview}
                      readOnly
                      className="font-mono text-sm min-h-[400px]"
                    />

                    <div className="flex flex-wrap gap-2">
                      <Button onClick={copyToClipboard} variant="outline">
                        {copied ? (
                          <Check className="w-4 h-4 mr-2" />
                        ) : (
                          <Copy className="w-4 h-4 mr-2" />
                        )}
                        {copied ? 'Скопійовано!' : 'Копіювати'}
                      </Button>

                      <Button onClick={downloadAsFile} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Завантажити .txt
                      </Button>

                      <Button onClick={downloadAsHtml} variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        Завантажити .html
                      </Button>

                      <Button
                        onClick={saveToGoogleDrive}
                        variant="outline"
                        disabled={!googleDriveReady || isUploadingToDrive || !isGoogleDriveConfigured()}
                      >
                        {isUploadingToDrive ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Cloud className="w-4 h-4 mr-2" />
                        )}
                        Google Drive
                        {!isGoogleDriveConfigured() && (
                          <Badge variant="secondary" className="ml-2 text-xs">Не налаштовано</Badge>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Оберіть книгу, главу та вірші для перегляду експорту</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
