import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <p className="text-2xl md:text-3xl text-foreground/70 mb-8 font-medium">
          Чантуй:
        </p>

        <div className="text-xl md:text-2xl lg:text-3xl text-foreground font-serif leading-relaxed space-y-1">
          <p>Харе Крішна</p>
          <p>Харе Крішна</p>
          <p>Крішна Крішна</p>
          <p>Харе Харе</p>
          <p className="pt-2">Харе Рама</p>
          <p>Харе Рама</p>
          <p>Рама Рама</p>
          <p>Харе Харе</p>
        </div>

        <p className="text-2xl md:text-3xl text-foreground/70 mt-8 font-medium">
          і будь щасливий!
        </p>

        <p className="text-4xl mt-6">💛</p>

        <Link
          to="/"
          className="inline-block mt-10 text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
        >
          На головну
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
