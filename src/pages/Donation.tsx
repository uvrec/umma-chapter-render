import { Header } from "@/components/Header";
import { Heart, CreditCard, Banknote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

export const Donation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 mb-6">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Підтримати проєкт</h1>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Допоможіть розвитку духовної освіти
            </h2>
            <p className="text-muted-foreground mb-6">
              Ваша підтримка допомагає нам продовжувати роботу над перекладом та поширенням 
              ведичних знань українською мовою. Кожна пожертва йде на розвиток проєкту.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Temporarily hidden - Card Payment */}
            <Card className="p-6 text-center hidden">
              <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Банківська картка</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Швидкий та безпечний спосіб підтримки
              </p>
              <Button className="w-full">
                Підтримати
              </Button>
            </Card>
            
            {/* Temporarily hidden - Bank Transfer */}
            <Card className="p-6 text-center hidden">
              <Banknote className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Банківський переказ</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Переказ на банківський рахунок проєкту
              </p>
              <Button variant="outline" className="w-full">
                Реквізити
              </Button>
            </Card>
            
            {/* PayPal Payment */}
            <Card className="p-6 text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">PayPal</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Підтримайте проєкт через PayPal
              </p>
              <Button className="w-full" asChild>
                <a href="https://paypal.me/andriiuvarov" target="_blank" rel="noopener noreferrer">
                  Підтримати
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};