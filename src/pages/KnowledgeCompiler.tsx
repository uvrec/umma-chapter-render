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
import jsPDF from "jspdf";
import "jspdf-autotable";
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

// Helper function to create highlighted snippet
function createHighlightedSnippet(text: string, searchQuery: string, maxLength: number = 250): string {
  if (!text || !searchQuery) return text?.substring(0, maxLength) || '';

  // Split search query into terms (min 2 chars to avoid highlighting small words)
  const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(term => term.length >= 2);
  const lowerText = text.toLowerCase();

  // Find the first occurrence of any search term
  let firstIndex = -1;
  let foundTerm = '';

  for (const term of searchTerms) {
    const index = lowerText.indexOf(term);
    if (index !== -1 && (firstIndex === -1 || index < firstIndex)) {
      firstIndex = index;
      foundTerm = term;
    }
  }

  // If no match found, return beginning of text
  if (firstIndex === -1) {
    const preview = text.substring(0, maxLength);
    return preview + (text.length > maxLength ? '...' : '');
  }

  // Calculate snippet bounds with context
  const contextBefore = 80;
  const contextAfter = 150;
  const start = Math.max(0, firstIndex - contextBefore);
  const end = Math.min(text.length, firstIndex + foundTerm.length + contextAfter);

  let snippet = text.substring(start, end);

  // Add ellipsis
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  // Escape special regex characters in search terms
  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Highlight all search terms in the snippet (case-insensitive, whole words or parts)
  searchTerms.forEach(term => {
    const escapedTerm = escapeRegex(term);
    // Match the term as part of a word (useful for Ukrainian word forms)
    const regex = new RegExp(`(${escapedTerm}[а-яієїґ]*)`, 'gi');
    snippet = snippet.replace(regex, '<mark style="background-color: #fef08a; padding: 2px 4px; border-radius: 2px; font-weight: 600;">$1</mark>');
  });

  return snippet;
}

// Helper function to find which field contains the match
function findMatchedFields(verse: any, searchQuery: string): string[] {
  const matched: string[] = [];
  const searchLower = searchQuery.toLowerCase();

  if (verse.translation_ua?.toLowerCase().includes(searchLower) ||
      verse.translation_en?.toLowerCase().includes(searchLower)) {
    matched.push('translation');
  }
  if (verse.commentary_ua?.toLowerCase().includes(searchLower) ||
      verse.commentary_en?.toLowerCase().includes(searchLower)) {
    matched.push('commentary');
  }
  if (verse.synonyms_ua?.toLowerCase().includes(searchLower) ||
      verse.synonyms_en?.toLowerCase().includes(searchLower)) {
    matched.push('synonyms');
  }

  return matched.length > 0 ? matched : ['translation'];
}

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
        const transformedData = fallbackData?.map((verse: any) => {
          const translation = language === 'ua' ? verse.translation_ua : verse.translation_en;
          const commentary = language === 'ua' ? verse.commentary_ua : verse.commentary_en;
          const synonyms = language === 'ua' ? verse.synonyms_ua : verse.synonyms_en;

          // Find which field has the match and create snippet from it
          const matchedFields = findMatchedFields(verse, searchQuery);
          let snippetText = translation || '';

          // Prefer creating snippet from the field that actually contains the match
          if (matchedFields.includes('commentary') && commentary) {
            snippetText = commentary;
          } else if (matchedFields.includes('translation') && translation) {
            snippetText = translation;
          } else if (matchedFields.includes('synonyms') && synonyms) {
            snippetText = synonyms;
          }

          return {
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
            synonyms,
            translation,
            commentary,
            relevance_rank: 1.0,
            matched_in: matchedFields,
            search_snippet: createHighlightedSnippet(snippetText, searchQuery, 250)
          };
        }) || [];

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

      // Add highlighting to snippets from database results
      const enhancedResults = data?.map((verse: any) => {
        const translation = language === 'ua' ? verse.translation : verse.translation;
        const commentary = language === 'ua' ? verse.commentary : verse.commentary;

        // Create highlighted snippet from the field that contains the match
        let snippetSource = '';
        if (verse.matched_in?.includes('commentary') && commentary) {
          snippetSource = commentary;
        } else if (verse.matched_in?.includes('translation') && translation) {
          snippetSource = translation;
        } else if (translation) {
          snippetSource = translation;
        } else if (commentary) {
          snippetSource = commentary;
        }

        return {
          ...verse,
          search_snippet: createHighlightedSnippet(snippetSource, searchQuery, 250)
        };
      }) || [];

      setSearchResults(enhancedResults);

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

  // Export compilation as PDF
  const exportAsPDF = () => {
    if (compilation.length === 0) {
      toast.error(language === 'ua' ? "Збірка порожня" : "Compilation is empty");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Helper to add new page if needed
      const checkPageBreak = (neededSpace: number) => {
        if (yPosition + neededSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
      };

      // Helper to wrap and add text
      const addWrappedText = (text: string, fontSize: number, fontStyle: string = 'normal', color: number[] = [0, 0, 0]) => {
        doc.setFontSize(fontSize);
        doc.setFont('helvetica', fontStyle);
        doc.setTextColor(color[0], color[1], color[2]);

        const lines = doc.splitTextToSize(text, maxWidth);
        const lineHeight = fontSize * 0.5;

        checkPageBreak(lines.length * lineHeight);

        lines.forEach((line: string) => {
          doc.text(line, margin, yPosition);
          yPosition += lineHeight;
        });
      };

      // Title page
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      const title = compilationTitle || (language === 'ua' ? 'Тематична Збірка' : 'Thematic Compilation');
      doc.text(title, pageWidth / 2, 40, { align: 'center' });

      yPosition = 60;

      // Metadata
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`${language === 'ua' ? 'Тема' : 'Topic'}: ${searchQuery}`, margin, yPosition);
      yPosition += 7;
      doc.text(`${language === 'ua' ? 'Дата створення' : 'Created'}: ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += 7;
      doc.text(`${language === 'ua' ? 'Кількість віршів' : 'Number of verses'}: ${compilation.length}`, margin, yPosition);
      yPosition += 15;

      // Separator line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Add each verse
      compilation.forEach((verse, index) => {
        checkPageBreak(40);

        // Verse number and reference
        const reference = verse.canto_number
          ? `${verse.book_title}, ${language === 'ua' ? 'Пісня' : 'Canto'} ${verse.canto_number}, ${language === 'ua' ? 'Розділ' : 'Chapter'} ${verse.chapter_number}, ${language === 'ua' ? 'Вірш' : 'Verse'} ${verse.verse_number}`
          : `${verse.book_title}, ${language === 'ua' ? 'Розділ' : 'Chapter'} ${verse.chapter_number}, ${language === 'ua' ? 'Вірш' : 'Verse'} ${verse.verse_number}`;

        // Verse header with background
        doc.setFillColor(245, 245, 245);
        doc.rect(margin - 2, yPosition - 5, maxWidth + 4, 10, 'F');

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text(`${index + 1}. ${reference}`, margin, yPosition);
        yPosition += 12;

        // Sanskrit (if exists)
        if (verse.sanskrit) {
          checkPageBreak(15);
          doc.setFontSize(11);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 60, 60);
          const sanskritLines = doc.splitTextToSize(verse.sanskrit, maxWidth);
          sanskritLines.forEach((line: string) => {
            doc.text(line, margin, yPosition);
            yPosition += 5;
          });
          yPosition += 3;
        }

        // Transliteration (if exists)
        if (verse.transliteration) {
          checkPageBreak(15);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(120, 120, 120);
          const translitLines = doc.splitTextToSize(verse.transliteration, maxWidth);
          translitLines.forEach((line: string) => {
            doc.text(line, margin, yPosition);
            yPosition += 4.5;
          });
          yPosition += 3;
        }

        // Synonyms (if exists)
        if (verse.synonyms) {
          checkPageBreak(20);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(60, 60, 60);
          doc.text(language === 'ua' ? 'Синоніми:' : 'Synonyms:', margin, yPosition);
          yPosition += 5;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(80, 80, 80);
          const synonymLines = doc.splitTextToSize(verse.synonyms, maxWidth);
          synonymLines.forEach((line: string) => {
            checkPageBreak(5);
            doc.text(line, margin, yPosition);
            yPosition += 4;
          });
          yPosition += 3;
        }

        // Translation
        if (verse.translation) {
          checkPageBreak(20);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(60, 60, 60);
          doc.text(language === 'ua' ? 'Переклад:' : 'Translation:', margin, yPosition);
          yPosition += 5;

          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          const translationLines = doc.splitTextToSize(verse.translation, maxWidth);
          translationLines.forEach((line: string) => {
            checkPageBreak(5);
            doc.text(line, margin, yPosition);
            yPosition += 5;
          });
          yPosition += 3;
        }

        // Commentary (if exists)
        if (verse.commentary) {
          checkPageBreak(20);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(60, 60, 60);
          doc.text(language === 'ua' ? 'Коментар:' : 'Commentary:', margin, yPosition);
          yPosition += 5;

          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(40, 40, 40);
          const commentaryLines = doc.splitTextToSize(verse.commentary, maxWidth);
          commentaryLines.forEach((line: string) => {
            checkPageBreak(4.5);
            doc.text(line, margin, yPosition);
            yPosition += 4.5;
          });
          yPosition += 5;
        }

        // Separator between verses
        if (index < compilation.length - 1) {
          checkPageBreak(5);
          doc.setDrawColor(220, 220, 220);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 8;
        }
      });

      // Footer on each page
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(
          `${language === 'ua' ? 'Сторінка' : 'Page'} ${i} ${language === 'ua' ? 'з' : 'of'} ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Save PDF
      const fileName = `${compilationTitle || 'збірка'}_${searchQuery.substring(0, 20)}.pdf`;
      doc.save(fileName);

      toast.success(language === 'ua' ? "PDF експортовано успішно" : "PDF exported successfully");
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error(language === 'ua' ? "Помилка при експорті PDF" : "Error exporting PDF");
    }
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

                        {!isExpanded && (
                          <CardContent className="pt-0 space-y-2">
                            {verse.search_snippet && (
                              <div className="bg-muted/50 p-3 rounded-md border border-border">
                                <p className="text-xs text-muted-foreground mb-1 font-semibold">
                                  {language === 'ua' ? 'Знайдено:' : 'Found:'}
                                </p>
                                <p className="text-sm"
                                   dangerouslySetInnerHTML={{ __html: verse.search_snippet }}
                                />
                              </div>
                            )}
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
                  <Button onClick={exportAsPDF} className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'ua' ? 'Експортувати як PDF' : 'Export as PDF'}
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
