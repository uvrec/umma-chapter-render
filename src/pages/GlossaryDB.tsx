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
import { extractAllTerms, groupTermsByText, searchTerms, GlossaryTerm } from '@/utils/glossaryParser';
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
            books!inner(
              title_ua,
              title_en,
              slug
            )
          )
        `);
      
      if (error) throw error;
      
      // Transform data to match the expected format for glossary parser
      return data.map(verse => ({
        ...verse,
        book: language === 'ua' 
          ? verse.chapters.books.title_ua 
          : verse.chapters.books.title_en,
        bookSlug: verse.chapters.books.slug,
        synonyms: language === 'ua' ? verse.synonyms_ua : verse.synonyms_en,
        verse_number: verse.verse_number
      }));
    }
  });

  // Extract and process terms
  const allTerms = extractAllTerms(versesData);
  const groupedTerms = groupTermsByText(allTerms);

  // Get unique categories (books)
  const categories = Array.from(new Set(allTerms.map(term => term.book))).sort();

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

  // Group filtered terms for display
  const displayTerms = groupTermsByText(filteredAndSearchedTerms);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {t('Глосарій', 'Glossary')}
          </h1>

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
              {Object.keys(displayTerms).length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    {t('Термінів не знайдено', 'No terms found')}
                  </p>
                </Card>
              ) : (
                Object.entries(displayTerms).map(([term, termsList]) => (
                  <Card key={term} className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-primary">
                      {term}
                    </h3>
                    <div className="space-y-4">
                      {termsList.map((t, idx) => (
                        <div key={idx} className="border-l-2 border-primary/30 pl-4">
                          <p className="text-foreground mb-2">{t.meaning}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span className="font-medium">{t.reference}</span>
                            <span>•</span>
                            <a 
                              href={t.link} 
                              className="text-primary hover:underline"
                            >
                              {t.book}
                            </a>
                          </div>
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
                    {t('Всі книги', 'All books')} ({allTerms.length})
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
                      {category} (
                        {allTerms.filter(t => t.book === category).length}
                      )
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
