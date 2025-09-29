import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const CantoOverview = () => {
  const { bookId, cantoNumber } = useParams();
  const { language } = useLanguage();

  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!bookId
  });

  const { data: canto, isLoading: cantoLoading } = useQuery({
    queryKey: ['canto', bookId, cantoNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cantos')
        .select('*')
        .eq('book_id', bookId)
        .eq('canto_number', parseInt(cantoNumber!))
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!bookId && !!cantoNumber
  });

  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ['canto-chapters', canto?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('canto_id', canto!.id)
        .order('chapter_number', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!canto?.id
  });

  const bookTitle = language === 'ua' ? book?.title_ua : book?.title_en;
  const cantoTitle = language === 'ua' ? canto?.title_ua : canto?.title_en;
  const cantoDescription = language === 'ua' ? canto?.description_ua : canto?.description_en;

  if (cantoLoading || chaptersLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p>Завантаження...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: language === 'ua' ? 'Бібліотека' : 'Library', href: '/library' },
            { label: bookTitle || '', href: `/veda-reader/${bookId}` },
            { label: `Canto ${cantoNumber}: ${cantoTitle}` },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Canto {cantoNumber}: {cantoTitle}
          </h1>
          {cantoDescription && (
            <p className="text-lg text-muted-foreground">{cantoDescription}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {chapters?.map((chapter) => (
            <Link
              key={chapter.id}
              to={`/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapter.chapter_number}`}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>
                    {language === 'ua' ? 'Розділ' : 'Chapter'} {chapter.chapter_number}
                  </CardTitle>
                  <CardDescription>
                    {language === 'ua' ? chapter.title_ua : chapter.title_en}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CantoOverview;
