import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AudioPlaylists() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: categories } = useQuery({
    queryKey: ['audio-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audio_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['audio-playlists', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('audio_playlists')
        .select(`
          *,
          category:audio_categories(id, name_ua, name_en, slug),
          tracks:audio_tracks(count)
        `)
        .order('display_order');

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });

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
        <h1 className="text-3xl font-bold">Аудіо плейлісти</h1>
        <Link to="/admin/audio-playlists/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Додати плейліст
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Фільтр за категорією" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Всі категорії</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name_ua}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {playlists?.map((playlist: any) => (
          <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              {playlist.cover_image_url && (
                <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                  <img
                    src={playlist.cover_image_url}
                    alt={playlist.title_ua}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardTitle className="flex justify-between items-start">
                <span className="line-clamp-2">{playlist.title_ua}</span>
                <Badge variant={playlist.is_published ? 'default' : 'secondary'}>
                  {playlist.is_published ? 'Опубліковано' : 'Чернетка'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="line-clamp-2">{playlist.description_ua}</p>
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    <span>{playlist.tracks?.[0]?.count || 0} треків</span>
                  </div>
                  <Badge variant="outline">
                    {playlist.category?.name_ua}
                  </Badge>
                </div>
                {playlist.author && (
                  <p className="text-xs">Автор: {playlist.author}</p>
                )}
              </div>
              <div className="mt-4">
                <Link to={`/admin/audio-playlists/${playlist.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Редагувати / Треки
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!playlists || playlists.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Немає плейлістів</p>
          <Link to="/admin/audio-playlists/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Створити перший плейліст
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}