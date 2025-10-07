import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { BookOpen, Headphones, Book, ChevronDown, Play, Clock, User, ExternalLink } from "lucide-react";
import templeBackground from "@/assets/temple-background.jpg";
import { openExternal } from "@/lib/openExternal";

export const NewHome = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - inspired by gaudiobooks.ru */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png)`
        }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-4xl mx-auto">
            {/* Site Logo and Title */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-64 h-64 md:w-80 md:h-80 mb-4">
                <img 
                  src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png" 
                  alt="Прабгупада солов'їною" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-medium">
              Бібліотека ведичних аудіокниг
            </p>
            
            {/* Verse Quote */}
            <div className="mb-8 p-6 bg-black/20 backdrop-blur-sm rounded-lg border border-white/20">
              <p className="text-base md:text-lg leading-relaxed text-white/90">
                Бесіди про діяння та величність Творця Благих Справ — найдорожче надбання людства.
                У своїх творах великі мудреці з такою досконалістю описали Його діяння, що,
                коли ми слухаємо їх, наш слух виконує своє істинне призначення.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                <Link to="/library">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Переглянути бібліотеку
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                <Link to="/audio/audiobooks">
                  <Headphones className="w-5 h-5 mr-2" />
                  Аудіокниги
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/70" />
        </div>
      </section>
      
      
      {/* Support Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Підтримати проєкт
            </h2>
            <p className="text-lg text-muted-foreground mb-6 text-center">
              Якщо у Вас є баження підтримати цей проєкт, це можна зробити фінансово, або допомогти із редакцією аудіо чи перевіркою вже записаного матеріалу.
            </p>
            <p className="text-base text-muted-foreground mb-8 text-center">
              Якщо ви хочете підтримати цей проект, ви можете зробити це фінансово або допомогти з редагуванням аудіозаписів чи перевіркою вже записаного матеріалу. Всі пожертви йдуть на розвиток проєкту.
            </p>
            <div className="flex justify-center">
              <Button 
                size="lg"
                onClick={() => openExternal('https://paypal.me/andriiuvarov')}
                className="gap-2"
              >
                PayPal
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};