import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Eye, EyeOff, Edit, Plus } from "lucide-react";

export const Pages = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate("/auth");
    }
  }, [user, isAdmin, navigate]);

  const {
    data: pages,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pages").select("*").order("slug");

      if (error) throw error;
      return data;
    },
    enabled: !!user && isAdmin,
  });

  if (!user || !isAdmin) return null;

  if (isLoading) {
    return <div className="p-8">Завантаження...</div>;
  }

  if (isError) {
    return (
      <div className="p-8 text-destructive">Помилка завантаження сторінок: {(error as any)?.message || "невідомо"}</div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Управління сторінками</h1>
            <p className="text-muted-foreground">Редагуйте контент будь-якої сторінки сайту</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
              Назад до Dashboard
            </Button>
            <Button onClick={() => navigate("/admin/pages/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Нова сторінка
            </Button>
          </div>
        </div>

        {!pages?.length ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">Сторінок ще немає. Створіть першу сторінку.</p>
            <Button onClick={() => navigate("/admin/pages/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Створити сторінку
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {pages.map((page) => (
              <Card key={page.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{page.title_uk}</h3>
                      <Badge variant={page.is_published ? "default" : "secondary"}>
                        {page.is_published ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" /> Опубліковано
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" /> Чернетка
                          </>
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Slug: /{page.slug}</p>
                    <p className="text-sm text-muted-foreground">{page.title_en}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open(`/${page.slug}`, "_blank")}>
                      Переглянути
                    </Button>
                    <Button onClick={() => navigate(`/admin/pages/${page.slug}/edit`)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Редагувати
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pages;
