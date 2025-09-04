import { Header } from "@/components/Header";
import { User } from "lucide-react";

export const FudoKazuki = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Fudo Kazuki</h1>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-muted-foreground mb-4">
                Інформація про Fudo Kazuki та його внесок у поширення ведичних знань.
              </p>
              
              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-3">Біографія</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Детальна інформація про життя та діяльність.
                </p>
                
                <h3 className="font-semibold text-foreground mb-3">Праці</h3>
                <p className="text-sm text-muted-foreground">
                  Основні роботи та переклади ведичних текстів.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};