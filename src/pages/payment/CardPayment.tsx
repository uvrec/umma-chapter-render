import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Shield, Clock, Loader2, AlertCircle, CheckCircle, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStripe, formatAmount } from "@/hooks/useStripe";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Preset donation amounts in kopecks (100 kopecks = 1 UAH)
const PRESET_AMOUNTS = [10000, 20000, 50000, 100000]; // 100, 200, 500, 1000 UAH

export const CardPayment = () => {
  const { user } = useAuth();
  const {
    products,
    subscription,
    hasActiveSubscription,
    isLoading,
    isProcessing,
    error,
    createCheckoutSession,
    openCustomerPortal,
  } = useStripe();

  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const handleDonation = async (amount: number) => {
    await createCheckoutSession({
      amount,
      mode: "payment",
    });
  };

  const handleSubscription = async (priceId: string) => {
    await createCheckoutSession({
      priceId,
      mode: "subscription",
    });
  };

  const handleCustomDonation = async () => {
    const value = parseInt(customAmount, 10);
    if (isNaN(value) || value < 10) {
      return;
    }
    // Convert to kopecks
    await handleDonation(value * 100);
  };

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    handleDonation(amount);
  };

  // Filter subscription products only
  const subscriptionProducts = products.filter((p) => p.interval);

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
              Безпечна оплата банківською карткою через Stripe
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Login Required Alert */}
          {!user && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Для оплати карткою необхідно{" "}
                <Link to="/auth" className="underline font-medium">
                  увійти в обліковий запис
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* Active Subscription Banner */}
          {hasActiveSubscription && subscription && (
            <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <div className="flex items-center justify-between">
                  <span>
                    Ви маєте активну підписку до{" "}
                    {subscription.current_period_end
                      ? new Date(subscription.current_period_end).toLocaleDateString("uk-UA")
                      : ""}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCustomerPortal()}
                    disabled={isProcessing}
                    className="ml-4"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Керувати
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {/* One-time Payment Options */}
            <div className="py-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Оберіть суму підтримки
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {PRESET_AMOUNTS.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    className="h-12"
                    onClick={() => handlePresetClick(amount)}
                    disabled={!user || isProcessing}
                  >
                    {isProcessing && selectedAmount === amount ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      formatAmount(amount)
                    )}
                  </Button>
                ))}
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Інша сума (грн)"
                  min="10"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 px-3 py-2 border border-input rounded-md bg-background"
                  disabled={!user || isProcessing}
                />
                <Button
                  onClick={handleCustomDonation}
                  disabled={!user || isProcessing || !customAmount || parseInt(customAmount) < 10}
                >
                  {isProcessing && !selectedAmount ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Підтримати
                </Button>
              </div>
              {customAmount && parseInt(customAmount) < 10 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Мінімальна сума: 10 грн
                </p>
              )}
            </div>

            {/* Security Info */}
            <div className="py-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Безпека платежів</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Оплата через Stripe - міжнародний платіжний сервіс</li>
                    <li>• SSL-шифрування всіх даних</li>
                    <li>• PCI DSS сертифікація Level 1</li>
                    <li>• Дані карток не зберігаються на нашому сервері</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recurring Subscription Option */}
            <div className="py-6">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-2">Щомісячна підтримка</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Оформіть регулярну підтримку та допомагайте проєкту постійно розвиватися
                  </p>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {subscriptionProducts.length > 0 ? (
                        subscriptionProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                          >
                            <div>
                              <span className="font-medium">
                                {formatAmount(product.amount)}/міс
                              </span>
                              <p className="text-sm text-muted-foreground">
                                {product.name}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleSubscription(product.stripe_price_id)}
                              disabled={!user || isProcessing || hasActiveSubscription}
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : hasActiveSubscription ? (
                                "Активна"
                              ) : (
                                "Оформити"
                              )}
                            </Button>
                          </div>
                        ))
                      ) : (
                        // Fallback to static options if no products loaded
                        [
                          { amount: 5000, name: "Базова підтримка", priceId: "price_basic_monthly" },
                          { amount: 10000, name: "Стандартна підтримка", priceId: "price_standard_monthly" },
                          { amount: 20000, name: "Преміум підтримка", priceId: "price_premium_monthly" },
                        ].map((plan) => (
                          <div
                            key={plan.priceId}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                          >
                            <div>
                              <span className="font-medium">
                                {formatAmount(plan.amount)}/міс
                              </span>
                              <p className="text-sm text-muted-foreground">{plan.name}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleSubscription(plan.priceId)}
                              disabled={!user || isProcessing || hasActiveSubscription}
                            >
                              {isProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : hasActiveSubscription ? (
                                "Активна"
                              ) : (
                                "Оформити"
                              )}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {hasActiveSubscription && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Для зміни або скасування підписки натисніть кнопку "Керувати" вище
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Test Mode Notice */}
            <div className="py-4 px-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Тестовий режим:</strong> Для тестування оплати використовуйте номер картки{" "}
                <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">4242 4242 4242 4242</code>,
                будь-яку майбутню дату та будь-які 3 цифри CVC.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
