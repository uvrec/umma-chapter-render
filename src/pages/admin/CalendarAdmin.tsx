// src/pages/admin/CalendarAdmin.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, Calendar, Moon, Star, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

// Use database types directly
type Ekadashi = {
  id: string;
  name_sanskrit: string | null;
  name_uk: string | null;
  name_en: string | null;
  slug: string;
  glory_text_uk?: string | null;
  glory_text_en?: string | null;
  presiding_deity_uk?: string | null;
  presiding_deity_en?: string | null;
  fasting_rules_uk: string | null;
  fasting_rules_en: string | null;
  benefits_uk: string | null;
  benefits_en: string | null;
  [key: string]: any;
};

type Festival = {
  id: string;
  name_uk: string | null;
  name_en: string | null;
  description_uk: string | null;
  description_en: string | null;
  category_id: number | null;
  fasting_level?: string | null;
  [key: string]: any;
};

export default function CalendarAdmin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("ekadashis");
  const [editingEkadashi, setEditingEkadashi] = useState<Ekadashi | null>(null);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch ekadashis
  const { data: ekadashis, isLoading: loadingEkadashis } = useQuery({
    queryKey: ["admin-ekadashis"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ekadashi_info")
        .select("*")
        .order("name_uk");
      if (error) throw error;
      return (data || []) as Ekadashi[];
    },
  });

  // Fetch festivals
  const { data: festivals, isLoading: loadingFestivals } = useQuery({
    queryKey: ["admin-festivals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vaishnava_festivals")
        .select("*")
        .order("name_uk");
      if (error) throw error;
      return (data || []) as Festival[];
    },
  });

  // Update ekadashi mutation
  const updateEkadashiMutation = useMutation({
    mutationFn: async (ekadashi: Partial<Ekadashi> & { id: string }) => {
      const { error } = await supabase
        .from("ekadashi_info")
        .update(ekadashi)
        .eq("id", ekadashi.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ekadashis"] });
      toast.success("Екадаші оновлено");
      setIsDialogOpen(false);
      setEditingEkadashi(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Помилка оновлення");
    },
  });

  // Update festival mutation
  const updateFestivalMutation = useMutation({
    mutationFn: async (festival: Partial<Festival> & { id: string }) => {
      const { error } = await supabase
        .from("vaishnava_festivals")
        .update(festival)
        .eq("id", festival.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-festivals"] });
      toast.success("Фестиваль оновлено");
      setIsDialogOpen(false);
      setEditingFestival(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Помилка оновлення");
    },
  });

  const handleEditEkadashi = (ekadashi: Ekadashi) => {
    setEditingEkadashi(ekadashi);
    setEditingFestival(null);
    setIsDialogOpen(true);
  };

  const handleEditFestival = (festival: Festival) => {
    setEditingFestival(festival);
    setEditingEkadashi(null);
    setIsDialogOpen(true);
  };

  const handleSaveEkadashi = () => {
    if (editingEkadashi) {
      updateEkadashiMutation.mutate(editingEkadashi);
    }
  };

  const handleSaveFestival = () => {
    if (editingFestival) {
      updateFestivalMutation.mutate(editingFestival);
    }
  };

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Вайшнавський календар" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Вайшнавський календар</h1>
          <p className="text-muted-foreground">
            Управління екадаші, фестивалями та подіями календаря
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="ekadashis" className="gap-2">
              <Moon className="h-4 w-4" />
              Екадаші ({ekadashis?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="festivals" className="gap-2">
              <Star className="h-4 w-4" />
              Фестивалі ({festivals?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ekadashis" className="mt-6">
            {loadingEkadashis ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {ekadashis?.map((ekadashi) => (
                  <Card key={ekadashi.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{ekadashi.name_uk || ekadashi.name_sanskrit}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditEkadashi(ekadashi)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                      <CardDescription>{ekadashi.name_en}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {ekadashi.deity && (
                          <p>
                            <span className="text-muted-foreground">Божество:</span>{" "}
                            {ekadashi.deity}
                          </p>
                        )}
                        {ekadashi.glory_uk && (
                          <p className="line-clamp-2 text-muted-foreground">
                            {ekadashi.glory_uk}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="festivals" className="mt-6">
            {loadingFestivals ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {festivals?.map((festival) => (
                  <Card key={festival.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>{festival.name_uk}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditFestival(festival)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {festival.name_en}
                        {festival.is_fasting_day && (
                          <Badge variant="secondary">Піст</Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {festival.description_uk && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {festival.description_uk}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Ekadashi Dialog */}
      <Dialog open={isDialogOpen && !!editingEkadashi} onOpenChange={(open) => {
        if (!open) {
          setIsDialogOpen(false);
          setEditingEkadashi(null);
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редагувати екадаші: {editingEkadashi?.name_uk}</DialogTitle>
          </DialogHeader>
          {editingEkadashi && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Назва (UK)</Label>
                  <Input
                    value={editingEkadashi.name_uk || ""}
                    onChange={(e) => setEditingEkadashi({ ...editingEkadashi, name_uk: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Назва (EN)</Label>
                  <Input
                    value={editingEkadashi.name_en || ""}
                    onChange={(e) => setEditingEkadashi({ ...editingEkadashi, name_en: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Санскрит</Label>
                  <Input
                    value={editingEkadashi.name_sanskrit || ""}
                    onChange={(e) => setEditingEkadashi({ ...editingEkadashi, name_sanskrit: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Божество</Label>
                  <Input
                    value={editingEkadashi.deity || ""}
                    onChange={(e) => setEditingEkadashi({ ...editingEkadashi, deity: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Слава (UK)</Label>
                <Textarea
                  rows={4}
                  value={editingEkadashi.glory_uk || ""}
                  onChange={(e) => setEditingEkadashi({ ...editingEkadashi, glory_uk: e.target.value })}
                />
              </div>
              <div>
                <Label>Слава (EN)</Label>
                <Textarea
                  rows={4}
                  value={editingEkadashi.glory_en || ""}
                  onChange={(e) => setEditingEkadashi({ ...editingEkadashi, glory_en: e.target.value })}
                />
              </div>
              <div>
                <Label>Правила посту (UK)</Label>
                <Textarea
                  rows={3}
                  value={editingEkadashi.fasting_rules_uk || ""}
                  onChange={(e) => setEditingEkadashi({ ...editingEkadashi, fasting_rules_uk: e.target.value })}
                />
              </div>
              <div>
                <Label>Благословення (UK)</Label>
                <Textarea
                  rows={3}
                  value={editingEkadashi.benefits_uk || ""}
                  onChange={(e) => setEditingEkadashi({ ...editingEkadashi, benefits_uk: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Скасувати
            </Button>
            <Button onClick={handleSaveEkadashi} disabled={updateEkadashiMutation.isPending}>
              {updateEkadashiMutation.isPending ? "Збереження..." : "Зберегти"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Festival Dialog */}
      <Dialog open={isDialogOpen && !!editingFestival} onOpenChange={(open) => {
        if (!open) {
          setIsDialogOpen(false);
          setEditingFestival(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Редагувати фестиваль: {editingFestival?.name_uk}</DialogTitle>
          </DialogHeader>
          {editingFestival && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Назва (UK)</Label>
                  <Input
                    value={editingFestival.name_uk || ""}
                    onChange={(e) => setEditingFestival({ ...editingFestival, name_uk: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Назва (EN)</Label>
                  <Input
                    value={editingFestival.name_en || ""}
                    onChange={(e) => setEditingFestival({ ...editingFestival, name_en: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Опис (UK)</Label>
                <Textarea
                  rows={4}
                  value={editingFestival.description_uk || ""}
                  onChange={(e) => setEditingFestival({ ...editingFestival, description_uk: e.target.value })}
                />
              </div>
              <div>
                <Label>Опис (EN)</Label>
                <Textarea
                  rows={4}
                  value={editingFestival.description_en || ""}
                  onChange={(e) => setEditingFestival({ ...editingFestival, description_en: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Скасувати
            </Button>
            <Button onClick={handleSaveFestival} disabled={updateFestivalMutation.isPending}>
              {updateFestivalMutation.isPending ? "Збереження..." : "Зберегти"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
