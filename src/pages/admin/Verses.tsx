import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Edit } from 'lucide-react';

const Verses = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/auth');
    }
  }, [user, isAdmin, navigate]);

  const { data: books } = useQuery({
    queryKey: ['admin-books'],
    queryFn: async () => {
      const { data, error } = await supabase.from('books').select('*');
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin
  });

  const { data: chapters } = useQuery({
    queryKey: ['admin-chapters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*, books!inner(title_ua)')
        .order('chapter_number');
      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin
  });

  const { data: verses, isLoading } = useQuery({
    queryKey: ['admin-verses', selectedChapterId],
    queryFn: async () => {
      if (!selectedChapterId) return [];
      const { data, error } = await supabase
        .from('verses')
        .select('*')
        .eq('chapter_id', selectedChapterId)
        .order('verse_number');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedChapterId
  });

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Назад
                </Link>
              </Button>
              <h1 className="text-2xl font-bold">Вірші</h1>
            </div>
            {selectedChapterId && (
              <Button asChild>
                <Link to={`/admin/verses/new?chapter=${selectedChapterId}`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Додати вірш
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Оберіть розділ</label>
          <Select value={selectedChapterId} onValueChange={setSelectedChapterId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Виберіть розділ" />
            </SelectTrigger>
            <SelectContent>
              {chapters?.map((chapter) => (
                <SelectItem key={chapter.id} value={chapter.id}>
                  {chapter.books?.title_ua} - Розділ {chapter.chapter_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedChapterId && (
          <>
            {isLoading ? (
              <p>Завантаження...</p>
            ) : verses && verses.length > 0 ? (
              <div className="space-y-4">
                {verses.map((verse) => (
                  <Card key={verse.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{verse.verse_number}</h3>
                          {verse.sanskrit && (
                            <p className="text-sm text-muted-foreground mb-2">{verse.sanskrit}</p>
                          )}
                          {verse.translation_ua && (
                            <p className="text-sm mb-2">{verse.translation_ua.substring(0, 100)}...</p>
                          )}
                          {verse.translation_en ? (
                            <span className="inline-block px-2 py-1 text-xs bg-green-500/10 text-green-500 rounded">
                              Є англійський переклад
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-1 text-xs bg-orange-500/10 text-orange-500 rounded">
                              Немає англійського перекладу
                            </span>
                          )}
                        </div>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/admin/verses/${verse.id}/edit`}>
                            <Edit className="w-4 h-4 mr-2" />
                            Редагувати
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">Віршів не знайдено в цьому розділі</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Verses;
