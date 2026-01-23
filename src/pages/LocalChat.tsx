import { useLanguage } from "@/contexts/LanguageContext";
import { LocalLLMChat } from "@/components/chat";
import { PageMeta } from "@/components/PageMeta";
import SiteBanners from "@/components/SiteBanners";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Cpu, Lock, Zap, HardDrive } from "lucide-react";

export function LocalChat() {
  const { language, t, getLocalizedPath } = useLanguage();

  return (
    <>
      <PageMeta
        titleUk="Локальна AI | Vedavoice"
        titleEn="Local AI | Vedavoice"
        metaDescriptionUk="Локальна AI-система для вивчення вчень Шріли Прабгупади. Працює на вашому комп'ютері без інтернету."
        metaDescriptionEn="Local AI system for studying Srila Prabhupada's teachings. Runs on your computer without internet."
        language={language}
      />

      <SiteBanners />

      <main className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to={getLocalizedPath("/")}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t("На головну", "Home")}
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <Link to={getLocalizedPath("/chat")}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {t("Онлайн чат", "Online chat")}
                  </Button>
                </Link>
                <Link to={getLocalizedPath("/library")}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    {t("Бібліотека", "Library")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 md:py-10">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {t("Локальна AI", "Local AI")}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t(
                  "AI-асистент, що працює на вашому комп'ютері",
                  "AI assistant running on your computer"
                )}
              </p>
            </div>

            {/* Features Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <FeatureCard
                icon={<Lock className="h-5 w-5" />}
                title={t("Приватність", "Privacy")}
                description={t(
                  "Ваші запитання не надсилаються в інтернет",
                  "Your questions are not sent to the internet"
                )}
              />
              <FeatureCard
                icon={<Zap className="h-5 w-5" />}
                title={t("Швидкість", "Speed")}
                description={t(
                  "Використовує потужність вашого GPU",
                  "Uses the power of your GPU"
                )}
              />
              <FeatureCard
                icon={<HardDrive className="h-5 w-5" />}
                title={t("Автономність", "Autonomy")}
                description={t(
                  "Працює без підключення до інтернету",
                  "Works without internet connection"
                )}
              />
            </div>

            {/* Chat Container */}
            <LocalLLMChat />

            {/* Setup Instructions */}
            <div className="mt-8 p-4 rounded-lg border bg-muted/30">
              <h3 className="font-medium mb-2">
                {t("Як налаштувати локальну AI?", "How to set up local AI?")}
              </h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>{t("Встановіть Ollama: ollama.ai", "Install Ollama: ollama.ai")}</li>
                <li>{t("Завантажте модель: ollama pull qwen2.5:14b", "Download model: ollama pull qwen2.5:14b")}</li>
                <li>{t("Запустіть сервер: cd local-llm && python server.py", "Run server: cd local-llm && python server.py")}</li>
              </ol>
              <p className="text-xs text-muted-foreground mt-3">
                {t(
                  "Детальна інструкція: local-llm/README.md",
                  "Detailed instructions: local-llm/README.md"
                )}
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="p-4 rounded-lg border bg-card/50 text-center">
      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default LocalChat;
