import { useLanguage } from "@/contexts/LanguageContext";
import { ChatContainer } from "@/components/chat";
import { PageMeta } from "@/components/PageMeta";
import SiteBanners from "@/components/SiteBanners";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, MessageCircle, Sparkles } from "lucide-react";

export function Chat() {
  const { language, t, getLocalizedPath } = useLanguage();

  return (
    <>
      <PageMeta
        titleUa="VedaVOICE Чат | Запитай Прабгупаду"
        titleEn="VedaVOICE Chat | Ask Prabhupada"
        metaDescriptionUa="AI-асистент для вивчення вчень Шріли Прабгупади. Задавайте запитання та отримуйте відповіді з його книг, лекцій та листів."
        metaDescriptionEn="AI assistant for studying Srila Prabhupada's teachings. Ask questions and get answers from his books, lectures, and letters."
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
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-saffron-400 to-brand-500 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                VedaVOICE
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {t(
                  "AI-асистент для вивчення вчень Шріли Прабгупади",
                  "AI assistant for studying Srila Prabhupada's teachings"
                )}
              </p>
            </div>

            {/* Features Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <FeatureCard
                icon={<BookOpen className="h-5 w-5" />}
                title={t("Тільки авторитетні джерела", "Authoritative sources only")}
                description={t(
                  "Відповіді базуються виключно на працях Шріли Прабгупади",
                  "Answers based exclusively on Srila Prabhupada's works"
                )}
              />
              <FeatureCard
                icon={<MessageCircle className="h-5 w-5" />}
                title={t("Точні цитати", "Exact citations")}
                description={t(
                  "Кожна відповідь містить посилання на джерело",
                  "Every answer includes source references"
                )}
              />
              <FeatureCard
                icon={<Sparkles className="h-5 w-5" />}
                title={t("Без спекуляцій", "No speculation")}
                description={t(
                  "AI ніколи не вигадує та не додає власних інтерпретацій",
                  "AI never fabricates or adds personal interpretations"
                )}
              />
            </div>

            {/* Chat Container */}
            <ChatContainer />

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
              {t(
                "VedaVOICE — експериментальний AI-асистент. Завжди перевіряйте відповіді в оригінальних джерелах. Для серйозного вивчення рекомендуємо читати книги безпосередньо.",
                "VedaVOICE is an experimental AI assistant. Always verify answers in original sources. For serious study, we recommend reading the books directly."
              )}
            </p>
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
      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 mb-3">
        {icon}
      </div>
      <h3 className="font-medium text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

export default Chat;
