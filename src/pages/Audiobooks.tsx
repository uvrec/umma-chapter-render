import { Header } from "@/components/Header";
import { Headphones, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Audiobooks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <Headphones className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Аудіокниги</h1>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/src/assets/bhagavad-gita.jpg" 
                  alt="Бгагавад-гіта обкладинка" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Бгагавад-гіта як вона є</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Повна аудіоверсія з коментарями Шріли Прабгупади
              </p>
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Слухати
              </Button>
            </Card>
            
            <Card className="p-6">
              <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
                <img 
                  src="/src/assets/srimad-bhagavatam-1.webp" 
                  alt="Шрімад-Бгагаватам обкладинка" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Шрімад-Бгагаватам</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Аудіозаписи перших пісень з детальними поясненнями
              </p>
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Слухати
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};