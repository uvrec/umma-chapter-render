import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, CheckCircle, Share, MoreVertical } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      <Helmet>
        <title>Встановити застосунок | Vedavoice</title>
        <meta name="description" content="Встановіть Vedavoice на свій пристрій для зручного доступу до ведичних текстів" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
                <Smartphone className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Встановіть Vedavoice
              </h1>
              <p className="text-muted-foreground text-lg">
                Отримайте швидкий доступ до ведичних текстів прямо з головного екрана вашого пристрою
              </p>
            </div>

            {isInstalled ? (
              <div className="py-6 bg-green-500/10">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                  <div>
                    <h3 className="text-xl font-semibold text-green-500">Застосунок встановлено!</h3>
                    <p className="text-muted-foreground">
                      Vedavoice вже доступний на вашому пристрої
                    </p>
                  </div>
                </div>
              </div>
            ) : isIOS ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Share className="w-5 h-5" />
                    Інструкція для iPhone/iPad
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    На iOS застосунок встановлюється через Safari
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Відкрийте сайт у Safari</p>
                      <p className="text-sm text-muted-foreground">
                        Ця інструкція працює тільки в браузері Safari
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Натисніть кнопку "Поділитися"</p>
                      <p className="text-sm text-muted-foreground">
                        <Share className="inline w-4 h-4" /> — квадрат зі стрілкою внизу екрана
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Виберіть "На Початковий екран"</p>
                      <p className="text-sm text-muted-foreground">
                        Прокрутіть список і знайдіть цю опцію
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      4
                    </div>
                    <div>
                      <p className="font-medium">Натисніть "Додати"</p>
                      <p className="text-sm text-muted-foreground">
                        Застосунок з'явиться на головному екрані
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : deferredPrompt ? (
              <div className="py-6">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Натисніть кнопку нижче, щоб встановити застосунок
                  </p>
                  <Button size="lg" onClick={handleInstallClick} className="gap-2">
                    <Download className="w-5 h-5" />
                    Встановити Vedavoice
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <MoreVertical className="w-5 h-5" />
                    Інструкція для Android
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Встановіть через меню браузера
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Відкрийте меню браузера</p>
                      <p className="text-sm text-muted-foreground">
                        <MoreVertical className="inline w-4 h-4" /> — три крапки у правому верхньому куті
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Виберіть "Встановити застосунок"</p>
                      <p className="text-sm text-muted-foreground">
                        Або "Додати на головний екран"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Підтвердіть встановлення</p>
                      <p className="text-sm text-muted-foreground">
                        Застосунок з'явиться на головному екрані
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Офлайн доступ</h3>
                <p className="text-sm text-muted-foreground">
                  Читайте тексти без інтернету
                </p>
              </div>
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Як справжній застосунок</h3>
                <p className="text-sm text-muted-foreground">
                  Повноекранний режим
                </p>
              </div>
              <div className="py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">Швидкий запуск</h3>
                <p className="text-sm text-muted-foreground">
                  Прямо з головного екрана
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Install;
