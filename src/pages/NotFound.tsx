import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center px-4">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Сторінку не знайдено
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            На жаль, сторінка яку ви шукаєте не існує або була переміщена
          </p>
          <Link to="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              На головну
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
