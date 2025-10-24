import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/Header';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { extractAllTerms, groupTermsByText, searchTerms, calculateTermUsage, GlossaryTerm } from '@/utils/glossaryParser';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function GlossaryDB() {
  const [searchParams] = useSearchParams();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [searchType, setSearchType] = useState<'exact' | 'contains' | 'starts'>('contains');
  const [translation, setTranslation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  // Fetch all verses with their book information
  const { data: versesData = [] } = useQuery({
    queryKey: ['glossary-verses', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verses')
        .select(`
          *,
          chapters!inner(
            chapter_number,
            book_id,
            canto_id,
            books(
              title_ua,
              title_en,
              slug
            ),
            cantos(
              canto_number,
              books(
                title_ua,
                title_en,
                slug
              )
            )
          )
        `);
      
      if (error) throw error;
      
      // Transform data to match the expected format for glossary parser
      return data.map(verse => {
        // Check if chapter belongs to a canto (Srimad-Bhagavatam structure)
        const bookData = verse.chapters.cantos?.books || verse.chapters.books;
        const cantoNumber = verse.chapters.cantos?.canto_number;
        const chapterNumber = verse.chapters.chapter_number;
        const bookSlug = bookData?.slug;
        
        // Build verse link based on book structure
        let verseLink = '';
        if (cantoNumber) {
          // Srimad-Bhagavatam structure with cantos
          verseLink = `/books/${bookSlug}/canto/${cantoNumber}/chapter/${chapterNumber}/verse/${verse.verse_number}`;
        } else {
          // Direct book-chapter structure
          verseLink = `/books/${bookSlug}/chapter/${chapterNumber}/verse/${verse.verse_number}`;
        }
        
        return {
          ...verse,
          book: language === 'ua' 
            ? bookData?.title_ua 
            : bookData?.title_en,
          bookSlug,
          cantoNumber,
          chapterNumber,
          verseLink,
          synonyms: language === 'ua' ? verse.synonyms_ua : verse.synonyms_en,
          verse_number: verse.verse_number
        };
      });
    }
  });

  // Extract and process terms
  const allTerms = extractAllTerms(versesData);
  const termsWithUsage = calculateTermUsage(allTerms);

  // Get unique categories (books) with term counts
  const categories = Array.from(new Set(allTerms.map(term => term.book))).sort();
  const categoryTermCounts = categories.reduce((acc, category) => {
    const uniqueTerms = new Set(
      allTerms.filter(t => t.book === category).map(t => t.term.toLowerCase().trim())
    );
    acc[category] = uniqueTerms.size;
    return acc;
  }, {} as { [key: string]: number });

  // Check if there's an active search
  const hasSearch = searchTerm || translation || selectedCategory !== 'all';

  // Filter and search terms
  let filteredAndSearchedTerms = allTerms;
  
  if (selectedCategory !== 'all') {
    filteredAndSearchedTerms = filteredAndSearchedTerms.filter(
      term => term.book === selectedCategory
    );
  }

  if (searchTerm || translation) {
    filteredAndSearchedTerms = searchTerms(
      filteredAndSearchedTerms,
      searchTerm || translation,
      searchType
    );
  }

  // Group filtered terms for display - only if there's a search
  const displayTerms = hasSearch ? groupTermsByText(filteredAndSearchedTerms) : {};

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {t('Глосарій', 'Glossary')}
          </h1>

          {/* Statistics - only show when search is active */}
          {hasSearch && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {Object.keys(displayTerms).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('Знайдено термінів', 'Terms found')}
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {filteredAndSearchedTerms.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('Всього використань', 'Total usages')}
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {new Set(filteredAndSearchedTerms.map(t => t.book)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t('Книг', 'Books')}
                  </div>
                </div>
              </Card>
            </div>
          )}

          <Card className="p-6 mb-8">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder={t('Шукати термін...', 'Search term...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder={t('Шукати переклад...', 'Search translation...')}
                    value={translation}
                    onChange={(e) => setTranslation(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Select value={searchType} onValueChange={(value: any) => setSearchType(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">
                      {t('Містить', 'Contains')}
                    </SelectItem>
                    <SelectItem value="exact">
                      {t('Точний збіг', 'Exact match')}
                    </SelectItem>
                    <SelectItem value="starts">
                      {t('Починається з', 'Starts with')}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button className="gap-2">
                  <Search className="h-4 w-4" />
                  {t('Шукати', 'Search')}
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-4">
              {!hasSearch ? (
                <Card className="p-8 text-center">
                  <div className="text-muted-foreground space-y-2">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold">
                      {t('Використовуйте пошук для перегляду термінів', 'Use search to view terms')}
                    </p>
                    <p className="text-sm">
                      {t('Введіть термін або переклад, або оберіть категорію', 'Enter a term or translation, or select a category')}
                    </p>
                  </div>
                </Card>
              ) : Object.keys(displayTerms).length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {t('Термінів не знайдено', 'No terms found')}
                  </p>
                </Card>
              ) : (
                Object.entries(displayTerms).map(([term, termsList]) => (
                  <Card key={term} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-primary">
                        {term}
                      </h3>
                      <Badge variant="secondary" className="ml-2">
                        {termsList.length} {t('використань', 'usages')}
                      </Badge>
                    </div>
                    
                    {/* Group meanings by book */}
                    <div className="space-y-6">
                      {Object.entries(
                        termsList.reduce((acc, t) => {
                          if (!acc[t.book]) acc[t.book] = [];
                          acc[t.book].push(t);
                          return acc;
                        }, {} as { [book: string]: GlossaryTerm[] })
                      ).map(([book, bookTerms]) => (
                        <div key={book} className="space-y-2">
                          <div className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                            {book}
                            <Badge variant="outline" className="text-xs">{bookTerms.length}</Badge>
                          </div>
                          {bookTerms.map((termItem, idx) => {
                            // Find the original verse data to get detailed reference
                            const verseData = versesData.find(v => v.verse_number === termItem.verseNumber);
                            const cantoInfo = verseData?.cantoNumber 
                              ? `${language === 'ua' ? 'Пісня' : 'Canto'} ${verseData.cantoNumber}, ` 
                              : '';
                            const detailedReference = `${cantoInfo}${language === 'ua' ? 'Розділ' : 'Chapter'} ${verseData?.chapterNumber}, ${language === 'ua' ? 'Вірш' : 'Verse'} ${termItem.verseNumber}`;
                            
                            return (
                              <div key={idx} className="border-l-2 border-primary/30 pl-4 py-1">
                                <p className="text-foreground mb-1">{termItem.meaning}</p>
                                <a 
                                  href={verseData?.verseLink || termItem.link}
                                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                                >
                                  {detailedReference}
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h3 className="font-semibold mb-4">
                  {t('Категорії', 'Categories')}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{t('Всі книги', 'All books')}</span>
                      <Badge variant={selectedCategory === 'all' ? 'outline' : 'secondary'}>
                        {termsWithUsage.length}
                      </Badge>
                    </div>
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span className="truncate">{category}</span>
                        <Badge variant={selectedCategory === category ? 'outline' : 'secondary'}>
                          {categoryTermCounts[category]}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
