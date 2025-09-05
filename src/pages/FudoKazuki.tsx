import { Header } from "@/components/Header";
import { User, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import bhagavadGitaCover from "@/assets/bhagavad-gita-cover.webp";
import sriIsopanishadCover from "@/assets/sri-isopanishad-cover.webp";
import srimadBhagavatamCover from "@/assets/srimad-bhagavatam-1-cover.webp";
import nectarInstructionsCover from "@/assets/nectar-instructions-cover.webp";

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
                <p className="text-sm text-muted-foreground mb-6">
                  Основні роботи та переклади ведичних текстів.
                </p>

                <h3 className="font-semibold text-foreground mb-4">Дискографія</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[
                    {
                      title: "Бгагавад-гіта",
                      cover: bhagavadGitaCover,
                      link: "/audiobooks/bhagavad-gita"
                    },
                    {
                      title: "Шрі Ішопанішад",
                      cover: sriIsopanishadCover,
                      link: "/audiobooks/sri-isopanishad"
                    },
                    {
                      title: "Шрімад Бгагаватам",
                      cover: srimadBhagavatamCover,
                      link: "/audiobooks/srimad-bhagavatam"
                    },
                    {
                      title: "Нектар настанов",
                      cover: nectarInstructionsCover,
                      link: "/audiobooks"
                    }
                  ].map((album, index) => (
                    <Card key={index} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-square">
                        <img 
                          src={album.cover} 
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 flex items-center justify-center">
                          <Button 
                            variant="secondary" 
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-sm text-foreground truncate">{album.title}</h4>
                        <p className="text-xs text-muted-foreground">Альбом</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};