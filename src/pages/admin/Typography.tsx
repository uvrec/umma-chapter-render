// src/pages/admin/Typography.tsx
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminTypographyPanel } from "@/components/AdminTypographyPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TypographyAdmin() {
  const { language } = useLanguage();

  const breadcrumbs = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Типографіка та стилі" },
  ];

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Типографіка та стилі</h1>
          <p className="text-muted-foreground">
            Налаштування шрифтів та стилів для віршів на всьому сайті
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Глобальні стилі типографіки</CardTitle>
            <CardDescription>
              Налаштуйте шрифти, розміри та стилі для санскриту, транслітерації, синонімів, перекладу та пояснень.
              Зміни застосовуються до всього сайту миттєво.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminTypographyPanel language={language as 'uk' | 'en'} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
