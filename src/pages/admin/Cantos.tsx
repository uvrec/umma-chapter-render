import { useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';

const Cantos = () => {
  const { bookId } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/auth');
    }
  }, [user, isAdmin, navigate]);

  const { data: book } = useQuery({
    queryKey: ['admin-book', bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin && !!bookId
  });

  const { data: cantos, isLoading } = useQuery({
    queryKey: ['admin-cantos', bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cantos')
        .select('*')
        .eq('book_id', bookId)
        .order('canto_number', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin && !!bookId
  });

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/books">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад до книг
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">
                Cantos: {book?.title_ua || 'Завантаження...'}
              </h1>
            </div>
            <Button asChild>
              <Link to={`/admin/cantos/${bookId}/new`}>
                <Plus className="w-4 h-4 mr-2" />
                Додати canto
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <p>Завантаження...</p>
        ) : cantos && cantos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cantos.map((canto) => (
              <Card key={canto.id}>
                <CardHeader>
                  <CardTitle>Canto {canto.canto_number}</CardTitle>
                  <CardDescription>{canto.title_ua}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {canto.title_en}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" asChild variant="outline">
                      <Link to={`/admin/cantos/${bookId}/${canto.id}/edit`}>Редагувати</Link>
                    </Button>
                    <Button size="sm" asChild variant="outline">
                      <Link to={`/admin/chapters/canto/${canto.id}`}>Розділи</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Cantos не знайдено</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Cantos;
