// src/pages/admin/DailyQuotes.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDailyQuotesAdmin } from "@/hooks/useDailyQuote";
import { VerseSelector } from "@/components/admin/VerseSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Edit, Trash2, Quote, BookOpen, Settings, Shuffle, ListOrdered, MousePointer } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type QuoteFormData = {
  quote_type: 'verse' | 'custom';
  verse_id?: string;
  quote_ua?: string;
  quote_en?: string;
  author_ua?: string;
  author_en?: string;
  source_ua?: string;
  source_en?: string;
  priority: number;
  is_active: boolean;
};

export default function DailyQuotes() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { quotes, isLoading, createQuote, updateQuote, deleteQuote, updateSettings } = useDailyQuotesAdmin();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [formData, setFormData] = useState<QuoteFormData>({
    quote_type: 'custom',
    priority: 50,
    is_active: true,
  });

  // Завантажуємо налаштування
  const { data: settings, refetch: refetchSettings } = useQuery({
    queryKey: ["verse_of_the_day_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "verse_of_the_day")
        .single();

      if (error) throw error;
      return data?.value as {
        enabled: boolean;
        rotation_mode: 'sequential' | 'random' | 'custom';
        current_index: number;
        last_updated: string | null;
      };
    },
  });

  const [settingsForm, setSettingsForm] = useState({
    enabled: true,
    rotation_mode: 'sequential' as 'sequential' | 'random' | 'custom',
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        enabled: settings.enabled ?? true,
        rotation_mode: settings.rotation_mode ?? 'sequential',
      });
    }
  }, [settings]);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валідація
    if (formData.quote_type === 'custom') {
      if (!formData.quote_ua?.trim() || !formData.quote_en?.trim()) {
        toast({
          title: "Помилка",
          description: "Введіть цитати українською та англійською",
          variant: "destructive",
        });
        return;
      }
    } else if (formData.quote_type === 'verse') {
      if (!formData.verse_id) {
        toast({
          title: "Помилка",
          description: "Оберіть вірш з бази даних",
          variant: "destructive",
        });
        return;
      }
    }

    if (editingQuote) {
      updateQuote({ id: editingQuote.id, ...formData });
      toast({ title: "Успіх", description: "Цитату оновлено" });
    } else {
      createQuote(formData);
      toast({ title: "Успіх", description: "Цитату додано" });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      ...settings,
      ...settingsForm,
      last_updated: new Date().toISOString(),
    });

    toast({ title: "Успіх", description: "Налаштування збережено" });
    setIsSettingsOpen(false);
    refetchSettings();
  };

  const resetForm = () => {
    setFormData({
      quote_type: 'custom',
      priority: 50,
      is_active: true,
    });
    setEditingQuote(null);
  };

  const handleEdit = (quote: any) => {
    setEditingQuote(quote);
    setFormData({
      quote_type: quote.quote_type,
      verse_id: quote.verse_id,
      quote_ua: quote.quote_ua,
      quote_en: quote.quote_en,
      author_ua: quote.author_ua,
      author_en: quote.author_en,
      source_ua: quote.source_ua,
      source_en: quote.source_en,
      priority: quote.priority,
      is_active: quote.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Видалити цю цитату?")) {
      deleteQuote(id);
      toast({ title: "Успіх", description: "Цитату видалено" });
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/admin/dashboard">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">Щоденні цитати</h1>
            </div>
            <p className="text-muted-foreground">
              Управління цитатами для головної сторінки (вірші та кастомні тексти)
            </p>
          </div>

          <div className="flex gap-2">
            {/* Кнопка налаштувань */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Налаштування
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Налаштування відображення</DialogTitle>
                  <DialogDescription>
                    Налаштуйте режим ротації цитат на головній сторінці
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                  {/* Увімкнено/Вимкнено */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enabled">Показувати банер цитат</Label>
                      <p className="text-sm text-muted-foreground">
                        Відображати банер з цитатою на головній сторінці
                      </p>
                    </div>
                    <Switch
                      id="enabled"
                      checked={settingsForm.enabled}
                      onCheckedChange={(checked) =>
                        setSettingsForm({ ...settingsForm, enabled: checked })
                      }
                    />
                  </div>

                  {/* Режим ротації */}
                  <div className="space-y-3">
                    <Label>Режим ротації</Label>
                    <div className="grid gap-3">
                      <Card
                        className={`cursor-pointer transition-colors ${
                          settingsForm.rotation_mode === 'sequential'
                            ? 'border-primary border-2'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSettingsForm({ ...settingsForm, rotation_mode: 'sequential' })}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <ListOrdered className="w-5 h-5" />
                            <CardTitle className="text-base">Послідовно</CardTitle>
                          </div>
                          <CardDescription className="text-xs">
                            Показувати цитати по черзі, від найстарішої до найновішої
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-colors ${
                          settingsForm.rotation_mode === 'random'
                            ? 'border-primary border-2'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSettingsForm({ ...settingsForm, rotation_mode: 'random' })}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Shuffle className="w-5 h-5" />
                            <CardTitle className="text-base">Випадково</CardTitle>
                          </div>
                          <CardDescription className="text-xs">
                            Випадковий вибір з топ-10 цитат з найвищим пріоритетом
                          </CardDescription>
                        </CardHeader>
                      </Card>

                      <Card
                        className={`cursor-pointer transition-colors ${
                          settingsForm.rotation_mode === 'custom'
                            ? 'border-primary border-2'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSettingsForm({ ...settingsForm, rotation_mode: 'custom' })}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <MousePointer className="w-5 h-5" />
                            <CardTitle className="text-base">Вибірково</CardTitle>
                          </div>
                          <CardDescription className="text-xs">
                            Показувати лише цитату з найвищим пріоритетом
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsSettingsOpen(false)}>
                      Скасувати
                    </Button>
                    <Button type="submit">
                      Зберегти
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            {/* Кнопка додати цитату */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="w-4 h-4 mr-2" />
                  Додати цитату
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingQuote ? "Редагувати цитату" : "Додати нову цитату"}
                </DialogTitle>
                <DialogDescription>
                  Цитата буде відображатись на головній сторінці
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Тип цитати */}
                <div className="space-y-2">
                  <Label>Тип цитати</Label>
                  <Select
                    value={formData.quote_type}
                    onValueChange={(value: 'verse' | 'custom') =>
                      setFormData({ ...formData, quote_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">
                        <div className="flex items-center gap-2">
                          <Quote className="w-4 h-4" />
                          <span>Кастомна цитата</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="verse">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>Вірш з бази даних</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Кастомна цитата */}
                {formData.quote_type === 'custom' && (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quote_ua">Цитата (українською) *</Label>
                        <Textarea
                          id="quote_ua"
                          value={formData.quote_ua || ''}
                          onChange={(e) => setFormData({ ...formData, quote_ua: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quote_en">Цитата (англійською) *</Label>
                        <Textarea
                          id="quote_en"
                          value={formData.quote_en || ''}
                          onChange={(e) => setFormData({ ...formData, quote_en: e.target.value })}
                          rows={4}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="author_ua">Автор (українською)</Label>
                        <Input
                          id="author_ua"
                          value={formData.author_ua || ''}
                          onChange={(e) => setFormData({ ...formData, author_ua: e.target.value })}
                          placeholder="Шріла Прабгупада"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="author_en">Автор (англійською)</Label>
                        <Input
                          id="author_en"
                          value={formData.author_en || ''}
                          onChange={(e) => setFormData({ ...formData, author_en: e.target.value })}
                          placeholder="Srila Prabhupada"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="source_ua">Джерело (українською)</Label>
                        <Input
                          id="source_ua"
                          value={formData.source_ua || ''}
                          onChange={(e) => setFormData({ ...formData, source_ua: e.target.value })}
                          placeholder="Лист, Лекція, тощо"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="source_en">Джерело (англійською)</Label>
                        <Input
                          id="source_en"
                          value={formData.source_en || ''}
                          onChange={(e) => setFormData({ ...formData, source_en: e.target.value })}
                          placeholder="Letter, Lecture, etc"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Вірш з БД */}
                {formData.quote_type === 'verse' && (
                  <div className="space-y-2">
                    <Label>Вірш з бази даних</Label>
                    <VerseSelector
                      selectedVerseId={formData.verse_id}
                      onVerseSelect={(verseId) => setFormData({ ...formData, verse_id: verseId })}
                    />
                  </div>
                )}

                {/* Пріоритет */}
                <div className="space-y-2">
                  <Label htmlFor="priority">
                    Пріоритет (0-100, більше = частіше показується)
                  </Label>
                  <Input
                    id="priority"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Активність */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_active">Активна</Label>
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Скасувати
                  </Button>
                  <Button type="submit">
                    {editingQuote ? "Зберегти зміни" : "Додати цитату"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Список цитат */}
        {isLoading ? (
          <div className="text-center py-12">Завантаження...</div>
        ) : !quotes || quotes.length === 0 ? (
          <Card className="p-12 text-center">
            <Quote className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Цитат ще немає</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Додати першу цитату
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {quotes.map((quote) => (
              <Card key={quote.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          {quote.quote_type === 'verse' ? (
                            <span className="flex items-center gap-2">
                              <BookOpen className="w-5 h-5" />
                              Вірш: {quote.verse?.chapter?.book?.title_ua} {quote.verse?.chapter?.chapter_number}.{quote.verse?.verse_number}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Quote className="w-5 h-5" />
                              {quote.author_ua || "Кастомна цитата"}
                            </span>
                          )}
                        </CardTitle>
                        <Badge variant={quote.is_active ? "default" : "secondary"}>
                          {quote.is_active ? "Активна" : "Неактивна"}
                        </Badge>
                        <Badge variant="outline">
                          Пріоритет: {quote.priority}
                        </Badge>
                      </div>
                      <CardDescription>
                        Показувалась {quote.display_count} разів
                        {quote.last_displayed_at && (
                          <> • Остання: {new Date(quote.last_displayed_at).toLocaleDateString('uk-UA')}</>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(quote)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(quote.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {quote.quote_type === 'verse' ? (
                    <blockquote className="border-l-4 border-primary pl-4 italic">
                      {quote.verse?.translation_ua}
                    </blockquote>
                  ) : (
                    <blockquote className="border-l-4 border-primary pl-4 italic">
                      {quote.quote_ua}
                    </blockquote>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
