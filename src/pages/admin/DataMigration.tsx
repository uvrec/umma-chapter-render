// src/pages/admin/DataMigration.tsx
// DEPRECATED: This page used local data file which no longer exists.
// Use VedabaseImportV3 or UniversalImportFixed instead.

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DataMigration() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    if (user && !isAdmin) navigate("/");
    if (!user) navigate("/auth");
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Data Migration</h1>
        </div>

        <Card className="p-6 max-w-2xl">
          <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
                Ця сторінка застаріла
              </h2>
              <p className="text-amber-700 dark:text-amber-300 mb-4">
                Функція імпорту з локального файлу більше недоступна.
                Використовуйте один з наступних інструментів:
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/universal-import")}
                  className="justify-start"
                >
                  Universal Import — універсальний імпорт
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/import-wizard")}
                  className="justify-start"
                >
                  Import Wizard — покроковий імпорт
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
