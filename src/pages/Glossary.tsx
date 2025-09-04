import { Header } from "@/components/Header";
import { Book, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("contains");
  const [translation, setTranslation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const glossaryTerms = [
    {
      term: "ом̇",
      definitions: [
        {
          meaning: "сполучення букв ом̇ (ом̇ка̄ра)",
          reference: "Бг. 8.13",
          link: "/verses/bg/8/13"
        },
        {
          meaning: "позначення Всевишнього", 
          reference: "Бг. 17.23",
          link: "/verses/bg/17/23"
        },
        {
          meaning: "що починається із складу ом̇",
          reference: "Бг. 17.24", 
          link: "/verses/bg/17/24"
        },
        {
          meaning: "всеосяжне довершене ціле",
          reference: "Īш́о Звернення",
          link: "/verses/iso/invocation"
        }
      ],
      category: "Бгаґавад-ґіта"
    },
    {
      term: "крішна",
      definitions: [
        {
          meaning: "Верховна Божественна Особистість",
          reference: "Бг. 7.7", 
          link: "/verses/bg/7/7"
        },
        {
          meaning: "Всепривабливий",
          reference: "Шб. 1.1.1",
          link: "/verses/sb/1/1/1"
        }
      ],
      category: "Шрімад-бгаґаватам"
    },
    {
      term: "дхарма",
      definitions: [
        {
          meaning: "релігійні обов'язки; принципи релігії",
          reference: "Бг. 4.7",
          link: "/verses/bg/4/7"
        },
        {
          meaning: "природа живої істоти",
          reference: "Шб. 1.2.6",
          link: "/verses/sb/1/2/6"
        }
      ],
      category: "Бгаґавад-ґіта"
    },
    {
      term: "мокша",
      definitions: [
        {
          meaning: "звільнення від матеріального існування",
          reference: "Бг. 18.66",
          link: "/verses/bg/18/66"
        }
      ],
      category: "Бгаґавад-ґіта"
    },
    {
      term: "сансара",
      definitions: [
        {
          meaning: "цикл народження, смерті та перенародження",
          reference: "Шб. 2.1.4", 
          link: "/verses/sb/2/1/4"
        }
      ],
      category: "Шрімад-бгаґаватам"
    }
  ];

  const categories = [
    { name: "Всі категорії", value: "all", count: glossaryTerms.length },
    { name: "Бгаґавад-ґіта як вона є", value: "Бгаґавад-ґіта", count: 3 },
    { name: "Шрімад-бгаґаватам", value: "Шрімад-бгаґаватам", count: 2 }
  ];

  const filteredTerms = glossaryTerms.filter(item => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
    
    if (!searchTerm) return categoryMatch;
    
    const termLower = item.term.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    let termMatch = false;
    switch (searchType) {
      case "exact":
        termMatch = termLower === searchLower;
        break;
      case "starts":
        termMatch = termLower.startsWith(searchLower);
        break;
      default: // contains
        termMatch = termLower.includes(searchLower);
    }
    
    return categoryMatch && termMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <Book className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Словник термінів</h1>
            </div>
            
            {/* Search Section */}
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input 
                  placeholder="Введіть термін..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Тип пошуку" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact">Точне слово</SelectItem>
                    <SelectItem value="contains">Містить</SelectItem>
                    <SelectItem value="starts">Починається з</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Переклад..."
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                />
              </div>
              <Button 
                className="w-full md:w-auto"
                onClick={() => {/* Search functionality */}}
              >
                <Search className="w-4 h-4 mr-2" />
                Пошук
              </Button>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {filteredTerms.length > 0 ? (
                filteredTerms.map((item, index) => (
                  <Card key={index} className="p-6">
                    <h2 className="text-2xl font-bold text-primary mb-4">{item.term}</h2>
                    <div className="space-y-4">
                      {item.definitions.map((def, defIndex) => (
                        <div key={defIndex} className="border-l-2 border-muted pl-4">
                          <p className="text-foreground mb-2">{def.meaning}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">—</span>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-primary hover:underline"
                              onClick={() => {/* Navigate to reference */}}
                            >
                              {def.reference}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Термінів не знайдено</p>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 hidden lg:block">
            <Card className="p-6 sticky top-8">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Ієрархія
              </h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={index}>
                    <Button
                      variant={selectedCategory === category.value ? "secondary" : "ghost"}
                      className="w-full justify-between text-left"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                    {index < categories.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};