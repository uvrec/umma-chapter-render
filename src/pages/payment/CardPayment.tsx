import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export const CardPayment = () => {
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
            <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Оплата карткою</h1>
            <p className="text-muted-foreground">
              Безпечна оплата банківською карткою через захищені платіжні системи
            </p>
          </div>

          <div className="space-y-6">
            {/* Payment Options */}
            <div className="py-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Оберіть суму підтримки</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[100, 200, 500, 1000].map((amount) => (
                  <Button key={amount} variant="outline" className="h-12">
                    {amount} ₴
                  </Button>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Інша сума"
                  className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                />
                <Button>Підтримати</Button>
              </div>
            </div>

            {/* Security Info */}
            <div className="py-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Безпека платежів</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• SSL-шифрування всіх даних</li>
                    <li>• PCI DSS сертифікація</li>
                    <li>• Дані карток не зберігаються</li>
                    <li>• Миттєве підтвердження платежу</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recurring Option */}
            <div className="py-6">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Щомісячна підтримка</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Оформіть регулярну підтримку та допомагайте проєкту постійно розвиватися
                  </p>
                  <div className="space-y-2">
                    {[
                      { amount: 50, description: "Базова підтримка" },
                      { amount: 100, description: "Стандартна підтримка" },
                      { amount: 200, description: "Преміум підтримка" }
                    ].map((plan) => (
                      <div key={plan.amount} className="flex items-center justify-between p-3">
                        <div>
                          <span className="font-medium">{plan.amount} ₴/міс</span>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>
                        <Button size="sm">Оформити</Button>
                      </div>
                    ))}
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