import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Heart } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Дякуємо за підтримку!
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              Ваш платіж успішно оброблено
            </p>
            <p className="text-muted-foreground">
              Ваша підтримка допомагає нам розвивати проєкт та ділитися ведичними знаннями з усім світом.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-2 text-primary mb-4">
              <Heart className="w-5 h-5 fill-current" />
              <span className="font-medium">Харе Крішна!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Підтвердження платежу надіслано на вашу електронну пошту.
              {sessionId && (
                <span className="block mt-2 text-xs opacity-70">
                  ID сесії: {sessionId.slice(0, 20)}...
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                На головну
              </Button>
            </Link>
            <Link to="/payment/card">
              <Button>
                Історія платежів
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
