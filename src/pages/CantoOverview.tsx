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
        .eq('slug', bookId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!bookId
  });

  const { data: canto, isLoading: cantoLoading } = useQuery({
    queryKey: ['canto', book?.id, cantoNumber],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cantos')
        .select('*')
        .eq('book_id', book!.id)
        .eq('canto_number', parseInt(cantoNumber!))
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!book?.id && !!cantoNumber
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

  if (!canto) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">
            Пісню не знайдено
          </p>
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
            { label: 'Бібліотека', href: '/library' },
            { label: bookTitle || '', href: `/veda-reader/${bookId}` },
            { label: `Пісня ${cantoNumber}: ${cantoTitle}` },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Пісня {cantoNumber}: {cantoTitle}
          </h1>
          {cantoDescription && (
            <p className="text-lg text-muted-foreground">{cantoDescription}</p>
          )}
        </div>

        <div className="space-y-3">
          {chapters && chapters.length > 0 ? (
            chapters.map((chapter) => (
              <Link
                key={chapter.id}
                to={`/veda-reader/${bookId}/canto/${cantoNumber}/chapter/${chapter.chapter_number}`}
                className="block"
              >
                <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer">
                  <CardHeader className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="text-primary font-semibold min-w-[80px]">
                        Глава {chapter.chapter_number}
                      </div>
                      <CardDescription className="text-base">
                        {language === 'ua' ? chapter.title_ua : chapter.title_en}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              Ще немає глав
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default CantoOverview;
