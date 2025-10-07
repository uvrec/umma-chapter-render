import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export default function IntroChapters() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/auth');
    }
  }, [user, isAdmin, navigate]);

  // Fetch book
  const { data: book } = useQuery({
    queryKey: ['book', bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!bookId
  });

  // Fetch intro chapters
  const { data: introChapters = [], refetch } = useQuery({
    queryKey: ['intro-chapters', bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intro_chapters')
        .select('*')
        .eq('book_id', bookId)
        .order('display_order');
      if (error) throw error;
      return data || [];
    },
    enabled: !!bookId
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю главу?')) return;

    const { error } = await supabase
      .from('intro_chapters')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Помилка',
        description: 'Не вдалося видалити главу',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Успішно',
        description: 'Главу видалено'
      });
      refetch();
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/admin/books">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Назад до книг
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">
            Вступні глави: {book?.title_ua}
          </h1>
        </div>
        <Button asChild>
          <Link to={`/admin/intro-chapters/${bookId}/new`}>
            <Plus className="h-4 w-4 mr-2" />
            Додати главу
          </Link>
        </Button>
      </div>

      {introChapters.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Вступних глав поки немає</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {introChapters.map((chapter) => (
            <Card key={chapter.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="text-lg">{chapter.title_ua}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                      {chapter.title_en}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link to={`/admin/intro-chapters/${bookId}/${chapter.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(chapter.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Slug: {chapter.slug} | Порядок: {chapter.display_order}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}