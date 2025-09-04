import { Link } from "react-router-dom";
import { Header } from "@/components/Header";

export const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-6 text-primary">
            ॐ
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Прабгупада солов'їною
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Ведична бібліотека з коментарями Його Божественної Милості А.Ч. Бхактіведанти Свамі Прабгупади
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/library" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Переглянути бібліотеку
            </Link>
            <Link 
              to="/verses" 
              className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Читати вірші
            </Link>
          </div>
        </div>

        {/* Welcome Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Ласкаво просимо до ведичної бібліотеки
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Відкрийте для себе скарби давньої мудрості через переклади та коментарі 
              Його Божественної Милості А.Ч. Бхактіведанти Свамі Прабгупади. 
              Наша бібліотека містить основні ведичні писання, що допоможуть вам 
              на шляху духовного розвитку та самопізнання.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl mb-3 text-primary">📖</div>
                <h3 className="font-semibold mb-2">Основні писання</h3>
                <p className="text-sm text-muted-foreground">
                  Бгагавад-гіта, Шрімад-Бгагаватам та інші класичні тексти
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3 text-primary">🎧</div>
                <h3 className="font-semibold mb-2">Аудіокниги</h3>
                <p className="text-sm text-muted-foreground">
                  Слухайте священні тексти у виконанні досвідчених читців
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3 text-primary">💬</div>
                <h3 className="font-semibold mb-2">Коментарі</h3>
                <p className="text-sm text-muted-foreground">
                  Детальні пояснення від авторитетного духовного учителя
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-border">
          <p className="text-muted-foreground mb-2">
            Київська громада Свідомості Крішни
          </p>
          <p className="text-sm text-muted-foreground">
            Доставка Новою поштою по Україні та за кордон
          </p>
        </footer>
      </main>
    </div>
  );
};