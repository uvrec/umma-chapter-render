import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { openExternal } from "@/lib/openExternal";

export const OtherMethods = () => {
  const paymentMethods = [
    {
      name: "PayPal",
      description: "Міжнародні платежі через PayPal",
      icon: "💳",
      action: "Відкрити PayPal",
      link: "https://paypal.me/andriiuvarov"
    },
    {
      name: "Bitcoin (BTC)",
      description: "Криптовалютний переказ Bitcoin",
      icon: "₿",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      action: "Скопіювати адресу"
    },
    {
      name: "Ethereum (ETH)",
      description: "Криптовалютний переказ Ethereum",
      icon: "Ξ",
      address: "0x742d35Cc6634C0532925a3b8D91d89B3dc32d85e",
      action: "Скопіювати адресу"
    },
    {
      name: "Tether (USDT)",
      description: "Стейблкоїн USDT (ERC-20)",
      icon: "₮",
      address: "0x742d35Cc6634C0532925a3b8D91d89B3dc32d85e",
      action: "Скопіювати адресу"
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here if needed
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/donation">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад до способів підтримки
            </Button>
          </Link>

          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Інші способи підтримки</h1>
            <p className="text-muted-foreground">
              Альтернативні методи для міжнародної підтримки проєкту
            </p>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.name} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{method.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {method.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">{method.description}</p>
                    
                    {method.address && (
                      <div className="mb-4 p-3 bg-muted rounded-md">
                        <div className="text-sm text-muted-foreground mb-1">Адреса:</div>
                        <div className="font-mono text-sm break-all">{method.address}</div>
                      </div>
                    )}
                    
                    <Button
                      onClick={() => {
                        if (method.link) {
                          openExternal(method.link);
                        } else if (method.address) {
                          copyToClipboard(method.address);
                        }
                      }}
                      className="w-full sm:w-auto"
                    >
                      {method.action}
                      {method.link && <ExternalLink className="w-4 h-4 ml-2" />}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Security Notice */}
          <Card className="p-6 mt-8 border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
            <h3 className="font-semibold text-foreground mb-2">⚠️ Важливо</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Завжди перевіряйте адресу перед відправкою криптовалюти</li>
              <li>• Починайте з невеликої тестової суми</li>
              <li>• Транзакції в блокчейні незворотні</li>
              <li>• Зберігайте hash транзакції для підтвердження</li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
};