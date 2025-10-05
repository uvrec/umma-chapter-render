import { Header } from "@/components/Header";
import { Heart, CreditCard, Banknote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";

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
            <Card className="p-6 text-center">
              <CreditCard className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Банківська картка</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Швидкий та безпечний спосіб підтримки
              </p>
              <Button className="w-full" asChild>
                <Link to="/payment/card">Підтримати</Link>
              </Button>
            </Card>
            
            <Card className="p-6 text-center">
              <Banknote className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Банківський переказ</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Переказ на банківський рахунок проєкту
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/payment/bank">Реквізити</Link>
              </Button>
            </Card>
            
            <Card className="p-6 text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Інші способи</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Криптовалюти та інші методи підтримки
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/payment/other">Дізнатися</Link>
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};