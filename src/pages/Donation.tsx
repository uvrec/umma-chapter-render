import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, CreditCard, Banknote, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export const Donation = () => {
  const paymentMethods = [
    {
      title: "Оплата карткою",
      description: "Швидка та безпечна оплата банківською карткою Visa/Mastercard",
      icon: CreditCard,
      link: "/payment/card",
      color: "text-blue-500",
    },
    {
      title: "Банківський переказ",
      description: "Переказ коштів безпосередньо на рахунок організації",
      icon: Banknote,
      link: "/payment/bank",
      color: "text-green-500",
    },
    {
      title: "Інші способи",
      description: "PayPal, Monobank та інші альтернативні методи",
      icon: Wallet,
      link: "/payment/other",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Підтримати проєкт
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ваша підтримка допомагає нам розвивати та вдосконалювати платформу,
              створювати нові переклади та поширювати ведичну мудрість
            </p>
          </div>

          {/* Payment Methods */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {paymentMethods.map((method) => (
              <Link key={method.link} to={method.link}>
                <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
                  <div className="text-center">
                    <method.icon className={`w-12 h-12 ${method.color} mx-auto mb-4`} />
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      {method.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Why Support Section */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Чому варто підтримати?
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Нові переклади</h3>
                  <p className="text-sm text-muted-foreground">
                    Переклад та адаптація ведичних текстів українською мовою
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Аудіо контент</h3>
                  <p className="text-sm text-muted-foreground">
                    Створення аудіокниг та лекцій українською мовою
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Розвиток платформи</h3>
                  <p className="text-sm text-muted-foreground">
                    Покращення функціоналу та зручності використання
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Безкоштовний доступ</h3>
                  <p className="text-sm text-muted-foreground">
                    Забезпечення безкоштовного доступу для всіх бажаючих
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contact */}
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Маєте питання щодо підтримки проєкту?
            </p>
            <Link to="/contact">
              <Button variant="outline">Зв'язатися з нами</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
