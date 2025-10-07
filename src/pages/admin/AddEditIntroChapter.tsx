import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { InlineTiptapEditor } from '@/components/InlineTiptapEditor';

export default function AddEditIntroChapter() {
  const { bookId, id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title_ua: '',
    title_en: '',
    content_ua: '',
    content_en: '',
    slug: '',
    display_order: 0
  });

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

  // Fetch intro chapter if editing
  const { data: introChapter } = useQuery({
    queryKey: ['intro-chapter', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('intro_chapters')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: isEdit && !!id
  });

  useEffect(() => {
    if (introChapter) {
      setFormData({
        title_ua: introChapter.title_ua || '',
        title_en: introChapter.title_en || '',
        content_ua: introChapter.content_ua || '',
        content_en: introChapter.content_en || '',
        slug: introChapter.slug || '',
        display_order: introChapter.display_order || 0
      });
    }
  }, [introChapter]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isEdit) {
        const { error } = await supabase
          .from('intro_chapters')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('intro_chapters')
          .insert({
            ...formData,
            book_id: bookId
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intro-chapters'] });
      toast({
        title: 'Успішно',
        description: isEdit ? 'Главу оновлено' : 'Главу створено'
      });
      navigate(`/admin/intro-chapters/${bookId}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Помилка',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link to={`/admin/intro-chapters/${bookId}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Назад
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Редагувати' : 'Додати'} вступну главу - {book?.title_ua}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Інформація про главу</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title_ua">Назва (українською)</Label>
                <Input
                  id="title_ua"
                  value={formData.title_ua}
                  onChange={(e) => setFormData({ ...formData, title_ua: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="title_en">Назва (англійською)</Label>
                <Input
                  id="title_en"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="preface"
                  required
                />
              </div>
              <div>
                <Label htmlFor="display_order">Порядок відображення</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <Label>Контент (українською)</Label>
              <InlineTiptapEditor
                content={formData.content_ua}
                onChange={(html) => setFormData({ ...formData, content_ua: html })}
                label="Редагувати контент українською"
              />
            </div>

            <div>
              <Label>Контент (англійською)</Label>
              <InlineTiptapEditor
                content={formData.content_en}
                onChange={(html) => setFormData({ ...formData, content_en: html })}
                label="Редагувати контент англійською"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Збереження...' : 'Зберегти'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/admin/intro-chapters/${bookId}`)}
              >
                Скасувати
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}