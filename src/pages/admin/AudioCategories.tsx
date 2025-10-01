import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface AudioCategory {
  id: string;
  name_ua: string;
  name_en: string;
  slug: string;
  description_ua?: string;
  description_en?: string;
  icon?: string;
  display_order: number;
}

export default function AudioCategories() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AudioCategory | null>(null);
  const [formData, setFormData] = useState({
    name_ua: '',
    name_en: '',
    slug: '',
    description_ua: '',
    description_en: '',
    icon: '',
    display_order: 0
  });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['audio-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as AudioCategory[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingCategory) {
        const { error } = await supabase
          .from('audio_categories')
          .update(data)
          .eq('id', editingCategory.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('audio_categories')
          .insert([data]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audio-categories'] });
      toast.success(editingCategory ? 'Категорію оновлено' : 'Категорію створено');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('Помилка: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('audio_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audio-categories'] });
      toast.success('Категорію видалено');
    },
    onError: (error) => {
      toast.error('Помилка: ' + error.message);
    }
  });

  const handleEdit = (category: AudioCategory) => {
    setEditingCategory(category);
    setFormData({
      name_ua: category.name_ua,
      name_en: category.name_en,
      slug: category.slug,
      description_ua: category.description_ua || '',
      description_en: category.description_en || '',
      icon: category.icon || '',
      display_order: category.display_order
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({
      name_ua: '',
      name_en: '',
      slug: '',
      description_ua: '',
      description_en: '',
      icon: '',
      display_order: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) return <div>Завантаження...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/admin/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Категорії аудіо</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingCategory(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Додати категорію
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Редагувати категорію' : 'Нова категорія'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name_ua">Назва (UA)</Label>
                  <Input
                    id="name_ua"
                    value={formData.name_ua}
                    onChange={(e) => setFormData({ ...formData, name_ua: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_en">Назва (EN)</Label>
                  <Input
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Іконка (Lucide)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="BookAudio, Mic, Music, Radio"
                  />
                </div>
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

              <div>
                <Label htmlFor="description_ua">Опис (UA)</Label>
                <Textarea
                  id="description_ua"
                  value={formData.description_ua}
                  onChange={(e) => setFormData({ ...formData, description_ua: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description_en">Опис (EN)</Label>
                <Textarea
                  id="description_en"
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Скасувати
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Збереження...' : 'Зберегти'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories?.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{category.name_ua} / {category.name_en}</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Видалити цю категорію?')) {
                        deleteMutation.mutate(category.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Slug: {category.slug}</p>
                {category.icon && <p>Іконка: {category.icon}</p>}
                <p>Порядок: {category.display_order}</p>
                {category.description_ua && <p>Опис: {category.description_ua}</p>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}