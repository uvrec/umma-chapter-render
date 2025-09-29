import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddEditCanto = () => {
  const { bookId, id } = useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [cantoNumber, setCantoNumber] = useState('');
  const [titleUa, setTitleUa] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionUa, setDescriptionUa] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/auth');
    }
  }, [user, isAdmin, navigate]);

  const { data: canto } = useQuery({
    queryKey: ['admin-canto', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cantos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user && isAdmin
  });

  useEffect(() => {
    if (canto) {
      setCantoNumber(canto.canto_number.toString());
      setTitleUa(canto.title_ua);
      setTitleEn(canto.title_en || '');
      setDescriptionUa(canto.description_ua || '');
      setDescriptionEn(canto.description_en || '');
    }
  }, [canto]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (id) {
        const { error } = await supabase
          .from('cantos')
          .update(data)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cantos')
          .insert([{ ...data, book_id: bookId }]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-cantos'] });
      toast({
        title: id ? 'Canto оновлено' : 'Canto створено',
      });
      navigate(`/admin/cantos/${bookId}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Помилка',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cantoNumber || !titleUa || !titleEn) {
      toast({
        title: 'Помилка',
        description: 'Заповніть всі обов\'язкові поля',
        variant: 'destructive',
      });
      return;
    }

    mutation.mutate({
      canto_number: parseInt(cantoNumber),
      title_ua: titleUa,
      title_en: titleEn,
      description_ua: descriptionUa || null,
      description_en: descriptionEn || null,
    });
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/admin/cantos/${bookId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">
              {id ? 'Редагувати Canto' : 'Додати Canto'}
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{id ? 'Редагувати Canto' : 'Новий Canto'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cantoNumber">Номер Canto *</Label>
                <Input
                  id="cantoNumber"
                  type="number"
                  value={cantoNumber}
                  onChange={(e) => setCantoNumber(e.target.value)}
                  placeholder="1"
                  required
                />
              </div>

              <Tabs defaultValue="ua" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ua">Українська</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ua" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleUa">Назва (UA) *</Label>
                    <Input
                      id="titleUa"
                      value={titleUa}
                      onChange={(e) => setTitleUa(e.target.value)}
                      placeholder="Перша пісня"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descriptionUa">Опис (UA)</Label>
                    <Textarea
                      id="descriptionUa"
                      value={descriptionUa}
                      onChange={(e) => setDescriptionUa(e.target.value)}
                      placeholder="Опис canto українською"
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titleEn">Title (EN) *</Label>
                    <Input
                      id="titleEn"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      placeholder="First Canto"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descriptionEn">Description (EN)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={descriptionEn}
                      onChange={(e) => setDescriptionEn(e.target.value)}
                      placeholder="Canto description in English"
                      rows={4}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-4">
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Збереження...' : 'Зберегти'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/admin/cantos/${bookId}`)}
                >
                  Скасувати
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddEditCanto;
