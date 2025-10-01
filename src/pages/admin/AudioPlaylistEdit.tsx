import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function AudioPlaylistEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState({
    title_ua: '',
    title_en: '',
    description_ua: '',
    description_en: '',
    category_id: '',
    cover_image_url: '',
    author: '',
    year: new Date().getFullYear(),
    is_published: false,
    display_order: 0
  });

  const [trackDialog, setTrackDialog] = useState(false);
  const [trackForm, setTrackForm] = useState({
    title_ua: '',
    title_en: '',
    audio_url: '',
    duration: 0,
    track_number: 1
  });

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

  const { data: playlist } = useQuery({
    queryKey: ['audio-playlist', id],
    queryFn: async () => {
      if (isNew) return null;
      
      const { data, error } = await supabase
        .from('audio_playlists')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !isNew
  });

  const { data: tracks } = useQuery({
    queryKey: ['audio-tracks', id],
    queryFn: async () => {
      if (isNew) return [];
      
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('*')
        .eq('playlist_id', id)
        .order('track_number');
      
      if (error) throw error;
      return data;
    },
    enabled: !isNew
  });

  useEffect(() => {
    if (playlist) {
      setFormData({
        title_ua: playlist.title_ua || '',
        title_en: playlist.title_en || '',
        description_ua: playlist.description_ua || '',
        description_en: playlist.description_en || '',
        category_id: playlist.category_id || '',
        cover_image_url: playlist.cover_image_url || '',
        author: playlist.author || '',
        year: playlist.year || new Date().getFullYear(),
        is_published: playlist.is_published || false,
        display_order: playlist.display_order || 0
      });
    }
  }, [playlist]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (isNew) {
        const { data: newPlaylist, error } = await supabase
          .from('audio_playlists')
          .insert([data])
          .select()
          .single();
        
        if (error) throw error;
        return newPlaylist;
      } else {
        const { error } = await supabase
          .from('audio_playlists')
          .update(data)
          .eq('id', id);
        
        if (error) throw error;
        return null;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['audio-playlists'] });
      queryClient.invalidateQueries({ queryKey: ['audio-playlist', id] });
      toast.success(isNew ? 'Плейліст створено' : 'Плейліст оновлено');
      
      if (isNew && data) {
        navigate(`/admin/audio-playlists/${data.id}`);
      }
    },
    onError: (error: any) => {
      toast.error('Помилка: ' + error.message);
    }
  });

  const saveTrackMutation = useMutation({
    mutationFn: async (trackData: typeof trackForm) => {
      const { error } = await supabase
        .from('audio_tracks')
        .insert([{ ...trackData, playlist_id: id }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audio-tracks', id] });
      toast.success('Трек додано');
      setTrackDialog(false);
      setTrackForm({
        title_ua: '',
        title_en: '',
        audio_url: '',
        duration: 0,
        track_number: (tracks?.length || 0) + 1
      });
    },
    onError: (error: any) => {
      toast.error('Помилка: ' + error.message);
    }
  });

  const deleteTrackMutation = useMutation({
    mutationFn: async (trackId: string) => {
      const { error } = await supabase
        .from('audio_tracks')
        .delete()
        .eq('id', trackId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audio-tracks', id] });
      toast.success('Трек видалено');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTrackMutation.mutate(trackForm);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/admin/audio-playlists">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад до плейлістів
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Playlist Info */}
        <Card>
          <CardHeader>
            <CardTitle>{isNew ? 'Новий плейліст' : 'Редагувати плейліст'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category_id">Категорія</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть категорію" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name_ua}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_ua">Назва (UA)</Label>
                  <Input
                    id="title_ua"
                    value={formData.title_ua}
                    onChange={(e) => setFormData({ ...formData, title_ua: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="title_en">Назва (EN)</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  />
                </div>
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
                <Label htmlFor="cover_image_url">Обкладинка (URL)</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Автор</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Рік</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">Опубліковано</Label>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? 'Збереження...' : 'Зберегти'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tracks */}
        {!isNew && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Треки ({tracks?.length || 0})</CardTitle>
                <Dialog open={trackDialog} onOpenChange={setTrackDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Додати трек
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Новий трек</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTrackSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="track_title_ua">Назва треку (UA)</Label>
                        <Input
                          id="track_title_ua"
                          value={trackForm.title_ua}
                          onChange={(e) => setTrackForm({ ...trackForm, title_ua: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="audio_url">Посилання на аудіо</Label>
                        <Input
                          id="audio_url"
                          value={trackForm.audio_url}
                          onChange={(e) => setTrackForm({ ...trackForm, audio_url: e.target.value })}
                          placeholder="https://... або Spotify/SoundCloud URL"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Підтримується: MP3, Spotify, SoundCloud
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="duration">Тривалість (сек)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={trackForm.duration}
                            onChange={(e) => setTrackForm({ ...trackForm, duration: parseInt(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="track_number">Номер треку</Label>
                          <Input
                            id="track_number"
                            type="number"
                            value={trackForm.track_number}
                            onChange={(e) => setTrackForm({ ...trackForm, track_number: parseInt(e.target.value) })}
                            required
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full" disabled={saveTrackMutation.isPending}>
                        Додати
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tracks?.map((track: any) => (
                  <div
                    key={track.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                      <div>
                        <p className="font-medium">{track.title_ua}</p>
                        <p className="text-xs text-muted-foreground">
                          {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Видалити цей трек?')) {
                          deleteTrackMutation.mutate(track.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                {!tracks || tracks.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Немає треків. Додайте перший трек.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}