import { Header } from "@/components/Header";
import { User, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// Real Fudo Kazuki albums from Bandcamp
import theGloriesOfRadhaKunda from "@/assets/albums/the-glories-of-radha-kunda.jpg";
import gauranga from "@/assets/albums/gauranga.jpg";
import reliefGopiGita from "@/assets/albums/relief-gopi-gita.jpg";
import childhoodPremaBhakti from "@/assets/albums/childhood-prema-bhakti.jpg";
import theSixGoswamis from "@/assets/albums/the-six-goswamis.jpg";
import hikikomori from "@/assets/albums/hikikomori.jpg";
import blackish from "@/assets/albums/blackish.jpg";
import color from "@/assets/albums/color.jpg";
import ykish from "@/assets/albums/ykish.jpg";
import mantraPrayer from "@/assets/albums/mantra-prayer.jpg";

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
                  Fudo Kazuki — український музичний продюсер та композитор, відомий своїми унікальними інтерпретаціями духовної музики та мантр. Його творчість поєднує традиційні ведичні тексти з сучасними електронними аранжуваннями.
                </p>
                
                <h3 className="font-semibold text-foreground mb-3">Музичний стиль</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Експериментальна духовна музика, ambient, електроніка з елементами традиційних мантр та ведичних текстів.
                </p>

                <h3 className="font-semibold text-foreground mb-4">Дискографія</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {[
                    {
                      title: "The Glories of Rādhā-Kuṇḍa",
                      cover: theGloriesOfRadhaKunda,
                      link: "https://fudokazuki.bandcamp.com/track/the-glories-of-r-dh-ku-a"
                    },
                    {
                      title: "Gauranga",
                      cover: gauranga,
                      link: "https://fudokazuki.bandcamp.com/track/gauranga"
                    },
                    {
                      title: "Relief (Gopi Gita)",
                      cover: reliefGopiGita,
                      link: "https://fudokazuki.bandcamp.com/track/relief-gopi-gita"
                    },
                    {
                      title: "Childhood (Prema Bhakti Candrika)",
                      cover: childhoodPremaBhakti,
                      link: "https://fudokazuki.bandcamp.com/track/childhood-prema-bhakti-candrika"
                    },
                    {
                      title: "The Six Goswamis",
                      cover: theSixGoswamis,
                      link: "https://fudokazuki.bandcamp.com/track/the-six-goswamis"
                    },
                    {
                      title: "引きこもり (feat. Aindra dasa)",
                      cover: hikikomori,
                      link: "https://fudokazuki.bandcamp.com/track/feat-aindra-dasa"
                    },
                    {
                      title: "Blackish",
                      cover: blackish,
                      link: "https://fudokazuki.bandcamp.com/track/blackish"
                    },
                    {
                      title: "Color",
                      cover: color,
                      link: "https://fudokazuki.bandcamp.com/track/color"
                    },
                    {
                      title: "Ykish",
                      cover: ykish,
                      link: "https://fudokazuki.bandcamp.com/album/ykish"
                    },
                    {
                      title: "Mantra prayer to A. C. Bhaktivedanta Swami Prabhupada",
                      cover: mantraPrayer,
                      link: "https://fudokazuki.bandcamp.com/track/mantra-prayer-to-a-c-bhaktivedanta-swami-prabhupada"
                    }
                  ].map((album, index) => (
                    <Card key={index} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                      <a href={album.link} target="_blank" rel="noopener noreferrer">
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
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Трек</p>
                            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </a>
                    </Card>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Слухайте на Bandcamp</h4>
                      <p className="text-sm text-muted-foreground">Повна дискографія та підтримка артиста</p>
                    </div>
                    <Button asChild>
                      <a href="https://fudokazuki.bandcamp.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        Відвідати Bandcamp
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};