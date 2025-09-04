import { Header } from "@/components/Header";
import { Book, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Glossary = () => {
  const glossaryTerms = [
    {
      term: "Крішна",
      definition: "Верховна Божественна Особистість, джерело всіх аватар"
    },
    {
      term: "Дхарма",
      definition: "Релігійні обов'язки; принципи релігії; природа живої істоти"
    },
    {
      term: "Мокша",
      definition: "Звільнення від матеріального існування"
    },
    {
      term: "Сансара",
      definition: "Цикл народження, смерті та перенародження"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <Book className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Глосарій</h1>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Input 
                placeholder="Пошук термінів..." 
                className="pr-10"
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {glossaryTerms.map((item, index) => (
              <Card key={index} className="p-4">
                <h3 className="font-semibold text-foreground mb-2">{item.term}</h3>
                <p className="text-sm text-muted-foreground">{item.definition}</p>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};