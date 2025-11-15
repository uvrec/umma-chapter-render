// src/pages/KnowledgeCompiler.tsx
// Spiritual Knowledge Compiler - Інтелектуальна система пошуку та компіляції
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  BookOpen,
  FileText,
  Download,
  Loader2,
  BarChart3,
  BookMarked,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SearchResult {
  verse_id: string;
  verse_number: string;
  chapter_id: string;
  chapter_number: number;
  chapter_title: string;
  book_id: string;
  book_title: string;
  book_slug: string;
  canto_id: string | null;
  canto_number: number | null;
  canto_title: string | null;
  sanskrit: string | null;
  transliteration: string | null;
  synonyms: string | null;
  translation: string | null;
  commentary: string | null;
  relevance_rank: number;
  matched_in: string[];
  search_snippet: string;
}

interface TopicStats {
  book_id: string;
  book_title: string;
  book_slug: string;
  verse_count: number;
  sample_verses: string[];
}

interface CompilationVerse extends SearchResult {
  isSelected: boolean;
  customNote?: string;
}

export default function KnowledgeCompiler() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [topicStats, setTopicStats] = useState<TopicStats[]>([]);

  // Filters
  const [includeSanskrit, setIncludeSanskrit] = useState(true);
  const [includeTransliteration, setIncludeTransliteration] = useState(true);
  const [includeSynonyms, setIncludeSynonyms] = useState(true);
  const [includeTranslation, setIncludeTranslation] = useState(true);
  const [includeCommentary, setIncludeCommentary] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [limitCount, setLimitCount] = useState(50);

  // Books list
  const [books, setBooks] = useState<Array<{ id: string; title_ua: string; title_en: string; slug: string }>>([]);

  // Compilation
  const [compilation, setCompilation] = useState<CompilationVerse[]>([]);
  const [compilationTitle, setCompilationTitle] = useState("");

  // Expanded verses
  const [expandedVerses, setExpandedVerses] = useState<Set<string>>(new Set());

  // Load available books
  useEffect(() => {
    const loadBooks = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('id, title_ua, title_en, slug')
        .eq('is_published', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading books:', error);
        return;
      }

      setBooks(data || []);
    };

    loadBooks();
  }, []);

  // Search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error(language === 'ua' ? "Введіть тему для пошуку" : "Enter a search topic");
      return;
    }

    setIsSearching(true);

    try {
      console.log('Starting search with query:', searchQuery);

      // Try to call the advanced search function
      const { data, error } = await supabase.rpc('search_verses_fulltext', {
        search_query: searchQuery,
        language_code: language,
        include_sanskrit: includeSanskrit,
        include_transliteration: includeTransliteration,
        include_synonyms: includeSynonyms,
        include_translation: includeTranslation,
        include_commentary: includeCommentary,
        book_ids: selectedBooks.length > 0 ? selectedBooks : null,
        limit_count: limitCount
      });

      // If function doesn't exist, use fallback simple search
      if (error && (error.code === '42883' || error.message?.includes('function') || error.message?.includes('does not exist'))) {
        console.warn('Advanced search function not found, using fallback search');
        toast.info(
          language === 'ua'
            ? 'Використовується простий пошук (функції бази даних ще не застосовані)'
            : 'Using simple search (database functions not yet applied)'
        );

        // Fallback: simple search using ILIKE
        const searchPattern = `%${searchQuery}%`;
        const query = supabase
          .from('verses')
          .select(`
            id,
            verse_number,
            chapter_id,
            sanskrit,
            transliteration,
            synonyms_ua,
            synonyms_en,
            translation_ua,
            translation_en,
            commentary_ua,
            commentary_en,
            chapters!inner(
              id,
              chapter_number,
              title_ua,
              title_en,
              book_id,
              books!inner(
                id,
                slug,
                title_ua,
                title_en
              )
            )
          `)
          .eq('is_published', true)
          .limit(limitCount);

        // Add search conditions
        if (language === 'ua') {
          query.or(`translation_ua.ilike.${searchPattern},commentary_ua.ilike.${searchPattern},synonyms_ua.ilike.${searchPattern}`);
        } else {
          query.or(`translation_en.ilike.${searchPattern},commentary_en.ilike.${searchPattern},synonyms_en.ilike.${searchPattern}`);
        }

        const { data: fallbackData, error: fallbackError } = await query;

        if (fallbackError) {
          console.error('Fallback search error:', fallbackError);
          toast.error(language === 'ua' ? "Помилка пошуку" : "Search error");
          return;
        }

        // Transform fallback data to match expected format
        const transformedData = fallbackData?.map((verse: any) => ({
          verse_id: verse.id,
          verse_number: verse.verse_number,
          chapter_id: verse.chapter_id,
          chapter_number: verse.chapters?.chapter_number || 0,
          chapter_title: language === 'ua' ? verse.chapters?.title_ua : verse.chapters?.title_en,
          book_id: verse.chapters?.books?.id,
          book_title: language === 'ua' ? verse.chapters?.books?.title_ua : verse.chapters?.books?.title_en,
          book_slug: verse.chapters?.books?.slug,
          canto_id: null,
          canto_number: null,
          canto_title: null,
          sanskrit: verse.sanskrit,
          transliteration: verse.transliteration,
          synonyms: language === 'ua' ? verse.synonyms_ua : verse.synonyms_en,
          translation: language === 'ua' ? verse.translation_ua : verse.translation_en,
          commentary: language === 'ua' ? verse.commentary_ua : verse.commentary_en,
          relevance_rank: 1.0,
          matched_in: ['translation'],
          search_snippet: (language === 'ua' ? verse.translation_ua : verse.translation_en)?.substring(0, 150) || ''
        })) || [];

        setSearchResults(transformedData);

        if (transformedData.length > 0) {
          toast.success(
            language === 'ua'
              ? `Знайдено ${transformedData.length} віршів`
              : `Found ${transformedData.length} verses`
          );
        } else {
          toast.info(
            language === 'ua'
              ? "Нічого не знайдено. Спробуйте інший запит."
              : "No results found. Try a different query."
          );
        }
        return;
      }

      if (error) {
        console.error('Search error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        toast.error(
          language === 'ua'
            ? `Помилка пошуку: ${error.message}`
            : `Search error: ${error.message}`
        );
        return;
      }

      console.log('Search results:', data);

      setSearchResults(data || []);

      // Also get topic statistics
      const { data: statsData, error: statsError } = await supabase.rpc('get_topic_statistics', {
        search_query: searchQuery,
        language_code: language
      });

      if (!statsError) {
        setTopicStats(statsData || []);
      } else {
        console.warn('Topic statistics function not available:', statsError);
        // Skip statistics if function doesn't exist
        setTopicStats([]);
      }

      if (data && data.length > 0) {
        toast.success(
          language === 'ua'
            ? `Знайдено ${data.length} віршів`
            : `Found ${data.length} verses`
        );
      } else {
        toast.info(
          language === 'ua'
            ? "Нічого не знайдено. Спробуйте інший запит."
            : "No results found. Try a different query."
        );
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(language === 'ua' ? "Помилка пошуку" : "Search error");
    } finally {
      setIsSearching(false);
    }
  };

  // Add verse to compilation
  const addToCompilation = (verse: SearchResult) => {
    if (compilation.find(v => v.verse_id === verse.verse_id)) {
      toast.info(language === 'ua' ? "Вірш вже в збірці" : "Verse already in compilation");
      return;
    }

    setCompilation(prev => [...prev, { ...verse, isSelected: true }]);
    toast.success(language === 'ua' ? "Додано до збірки" : "Added to compilation");
  };

  // Remove verse from compilation
  const removeFromCompilation = (verseId: string) => {
    setCompilation(prev => prev.filter(v => v.verse_id !== verseId));
    toast.success(language === 'ua' ? "Видалено зі збірки" : "Removed from compilation");
  };

  // Toggle verse expansion
  const toggleVerseExpansion = (verseId: string) => {
    setExpandedVerses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(verseId)) {
        newSet.delete(verseId);
      } else {
        newSet.add(verseId);
      }
      return newSet;
    });
  };

  // Export compilation as text
  const exportAsText = () => {
    if (compilation.length === 0) {
      toast.error(language === 'ua' ? "Збірка порожня" : "Compilation is empty");
      return;
    }

    let text = `${compilationTitle || (language === 'ua' ? 'Тематична Збірка' : 'Thematic Compilation')}\n`;
    text += `${language === 'ua' ? 'Тема' : 'Topic'}: ${searchQuery}\n`;
    text += `${language === 'ua' ? 'Створено' : 'Created'}: ${new Date().toLocaleDateString()}\n`;
    text += `${'='.repeat(80)}\n\n`;

    compilation.forEach((verse, index) => {
      const reference = verse.canto_number
        ? `${verse.book_title}, Пісня ${verse.canto_number}, Розділ ${verse.chapter_number}, Вірш ${verse.verse_number}`
        : `${verse.book_title}, Розділ ${verse.chapter_number}, Вірш ${verse.verse_number}`;

      text += `${index + 1}. ${reference}\n\n`;

      if (verse.sanskrit) {
        text += `${verse.sanskrit}\n\n`;
      }

      if (verse.transliteration) {
        text += `${verse.transliteration}\n\n`;
      }

      if (verse.synonyms) {
        text += `Синоніми:\n${verse.synonyms}\n\n`;
      }

      if (verse.translation) {
        text += `Переклад:\n${verse.translation}\n\n`;
      }

      if (verse.commentary) {
        text += `Коментар:\n${verse.commentary}\n\n`;
      }

      text += `${'-'.repeat(80)}\n\n`;
    });

    // Create and download file
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${compilationTitle || 'збірка'}_${searchQuery}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(language === 'ua' ? "Збірку експортовано" : "Compilation exported");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-4">
            <BookMarked className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">
              {language === 'ua' ? 'Новий інструмент' : 'New Tool'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {language === 'ua' ? 'Ведична Тематична Збірка' : 'Spiritual Knowledge Compiler'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'ua'
              ? 'Створюйте персоналізовані тематичні збірки з священних писань'
              : 'Create personalized thematic compilations from sacred scriptures'}
          </p>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              {language === 'ua' ? 'Пошук' : 'Search'}
            </TabsTrigger>
            <TabsTrigger value="compilation" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {language === 'ua' ? 'Збірка' : 'Compilation'}
              {compilation.length > 0 && (
                <Badge variant="secondary" className="ml-1">{compilation.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {language === 'ua' ? 'Статистика' : 'Statistics'}
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  {language === 'ua' ? 'Пошук по темі' : 'Search by Topic'}
                </CardTitle>
                <CardDescription>
                  {language === 'ua'
                    ? 'Введіть тему або ключові слова для пошуку віршів'
                    : 'Enter a topic or keywords to search for verses'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Input */}
                <div className="space-y-2">
                  <Label htmlFor="search-query">
                    {language === 'ua' ? 'Про що ви хочете дізнатися?' : 'What would you like to learn about?'}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="search-query"
                      placeholder={language === 'ua' ? 'Наприклад: три гуни, Параматма, Святе Ім\'я...' : 'e.g., three modes, Supersoul, Holy Name...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      className="text-lg"
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching}
                      size="lg"
                      className="min-w-[120px]"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === 'ua' ? 'Пошук...' : 'Searching...'}
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          {language === 'ua' ? 'Шукати' : 'Search'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Filters */}
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {language === 'ua' ? 'Налаштування пошуку' : 'Search Settings'}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-4 space-y-4">
                    {/* Content filters */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        {language === 'ua' ? 'Шукати в:' : 'Search in:'}
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="filter-translation"
                            checked={includeTranslation}
                            onCheckedChange={(checked) => setIncludeTranslation(checked as boolean)}
                          />
                          <Label htmlFor="filter-translation" className="cursor-pointer">
                            {language === 'ua' ? 'Переклад' : 'Translation'}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="filter-commentary"
                            checked={includeCommentary}
                            onCheckedChange={(checked) => setIncludeCommentary(checked as boolean)}
                          />
                          <Label htmlFor="filter-commentary" className="cursor-pointer">
                            {language === 'ua' ? 'Коментар' : 'Commentary'}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="filter-synonyms"
                            checked={includeSynonyms}
                            onCheckedChange={(checked) => setIncludeSynonyms(checked as boolean)}
                          />
                          <Label htmlFor="filter-synonyms" className="cursor-pointer">
                            {language === 'ua' ? 'Синоніми' : 'Synonyms'}
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="filter-transliteration"
                            checked={includeTransliteration}
                            onCheckedChange={(checked) => setIncludeTransliteration(checked as boolean)}
                          />
                          <Label htmlFor="filter-transliteration" className="cursor-pointer">
                            {language === 'ua' ? 'Транслітерація' : 'Transliteration'}
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Book filter */}
                    <div className="space-y-2">
                      <Label htmlFor="book-filter">
                        {language === 'ua' ? 'Книги (залиште порожнім для всіх)' : 'Books (leave empty for all)'}
                      </Label>
                      <Select>
                        <SelectTrigger id="book-filter">
                          <SelectValue placeholder={language === 'ua' ? 'Всі книги' : 'All books'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{language === 'ua' ? 'Всі книги' : 'All books'}</SelectItem>
                          {books.map(book => (
                            <SelectItem key={book.id} value={book.id}>
                              {language === 'ua' ? book.title_ua : book.title_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Result limit */}
                    <div className="space-y-2">
                      <Label htmlFor="limit-count">
                        {language === 'ua' ? 'Кількість результатів' : 'Number of results'}
                      </Label>
                      <Select
                        value={limitCount.toString()}
                        onValueChange={(value) => setLimitCount(parseInt(value))}
                      >
                        <SelectTrigger id="limit-count">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="200">200</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'ua' ? 'Результати пошуку' : 'Search Results'} ({searchResults.length})
                  </CardTitle>
                  <CardDescription>
                    {language === 'ua'
                      ? 'Натисніть на вірш щоб додати його до збірки'
                      : 'Click on a verse to add it to your compilation'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {searchResults.map((verse) => {
                    const isExpanded = expandedVerses.has(verse.verse_id);
                    const isInCompilation = compilation.some(v => v.verse_id === verse.verse_id);
                    const reference = verse.canto_number
                      ? `${verse.book_title} ${verse.canto_number}.${verse.chapter_number}.${verse.verse_number}`
                      : `${verse.book_title} ${verse.chapter_number}.${verse.verse_number}`;

                    return (
                      <Card key={verse.verse_id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1 flex-1">
                              <CardTitle className="text-lg">{reference}</CardTitle>
                              <CardDescription className="text-sm">
                                {verse.chapter_title}
                              </CardDescription>
                              {verse.matched_in && verse.matched_in.length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                  {verse.matched_in.map(field => (
                                    <Badge key={field} variant="outline" className="text-xs">
                                      {field}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleVerseExpansion(verse.verse_id)}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant={isInCompilation ? "secondary" : "default"}
                                size="sm"
                                onClick={() => isInCompilation
                                  ? removeFromCompilation(verse.verse_id)
                                  : addToCompilation(verse)
                                }
                              >
                                {isInCompilation ? (
                                  <Minus className="w-4 h-4" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>

                        {isExpanded && (
                          <CardContent className="space-y-3 pt-0">
                            {verse.sanskrit && (
                              <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">
                                  {language === 'ua' ? 'Санскрит:' : 'Sanskrit:'}
                                </p>
                                <p className="font-sanskrit text-lg">{verse.sanskrit}</p>
                              </div>
                            )}

                            {verse.transliteration && (
                              <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">
                                  {language === 'ua' ? 'Транслітерація:' : 'Transliteration:'}
                                </p>
                                <p className="italic">{verse.transliteration}</p>
                              </div>
                            )}

                            {verse.translation && (
                              <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">
                                  {language === 'ua' ? 'Переклад:' : 'Translation:'}
                                </p>
                                <p>{verse.translation}</p>
                              </div>
                            )}

                            {verse.commentary && (
                              <div>
                                <p className="text-sm font-semibold text-muted-foreground mb-1">
                                  {language === 'ua' ? 'Коментар:' : 'Commentary:'}
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                  {verse.commentary.substring(0, 300)}...
                                </p>
                              </div>
                            )}
                          </CardContent>
                        )}

                        {!isExpanded && verse.search_snippet && (
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground italic"
                               dangerouslySetInnerHTML={{ __html: verse.search_snippet }}
                            />
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Compilation Tab */}
          <TabsContent value="compilation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {language === 'ua' ? 'Моя збірка' : 'My Compilation'}
                </CardTitle>
                <CardDescription>
                  {language === 'ua'
                    ? `${compilation.length} віршів у збірці`
                    : `${compilation.length} verses in compilation`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Compilation Title */}
                <div className="space-y-2">
                  <Label htmlFor="compilation-title">
                    {language === 'ua' ? 'Назва збірки' : 'Compilation Title'}
                  </Label>
                  <Input
                    id="compilation-title"
                    placeholder={language === 'ua' ? 'Наприклад: Про три гуни' : 'e.g., About the three modes'}
                    value={compilationTitle}
                    onChange={(e) => setCompilationTitle(e.target.value)}
                  />
                </div>

                {/* Export Button */}
                {compilation.length > 0 && (
                  <Button onClick={exportAsText} className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'ua' ? 'Експортувати як текст' : 'Export as Text'}
                  </Button>
                )}

                {/* Compilation List */}
                {compilation.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>{language === 'ua' ? 'Збірка порожня' : 'Compilation is empty'}</p>
                    <p className="text-sm">
                      {language === 'ua'
                        ? 'Додайте вірші з результатів пошуку'
                        : 'Add verses from search results'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {compilation.map((verse, index) => {
                      const reference = verse.canto_number
                        ? `${verse.book_title} ${verse.canto_number}.${verse.chapter_number}.${verse.verse_number}`
                        : `${verse.book_title} ${verse.chapter_number}.${verse.verse_number}`;

                      return (
                        <Card key={verse.verse_id}>
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">{index + 1}</Badge>
                                  <CardTitle className="text-base">{reference}</CardTitle>
                                </div>
                                <CardDescription className="text-sm">
                                  {verse.chapter_title}
                                </CardDescription>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCompilation(verse.verse_id)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {verse.translation && (
                              <p className="text-sm">{verse.translation}</p>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  {language === 'ua' ? 'Статистика по темі' : 'Topic Statistics'}
                </CardTitle>
                {searchQuery && (
                  <CardDescription>
                    {language === 'ua' ? 'Тема:' : 'Topic:'} <strong>{searchQuery}</strong>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {topicStats.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>
                      {language === 'ua'
                        ? 'Виконайте пошук щоб побачити статистику'
                        : 'Perform a search to see statistics'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topicStats.map((stat) => (
                      <Card key={stat.book_id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{stat.book_title}</CardTitle>
                              <CardDescription>
                                {language === 'ua'
                                  ? `${stat.verse_count} віршів знайдено`
                                  : `${stat.verse_count} verses found`}
                              </CardDescription>
                            </div>
                            <Badge variant="secondary" className="text-lg">
                              {stat.verse_count}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {language === 'ua' ? 'Приклади віршів:' : 'Sample verses:'}{' '}
                            {stat.sample_verses.slice(0, 10).join(', ')}
                            {stat.sample_verses.length > 10 && '...'}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
