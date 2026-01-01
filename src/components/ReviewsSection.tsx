// ReviewsSection.tsx — адаптовано під craft/dark/light теми, бурштинові акценти
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, StarHalf } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  avatar?: string;
  rating: number;
  comment: string;
  tags: string[];
  bookRating?: number;
  speakerRating?: number;
}

interface ReviewsSectionProps {
  bookTitle: string;
  overallRating: number;
  totalReviews: number;
  bookRating: number;
  speakerRating: number;
  reviews: Review[];
}

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) => {
  const sizeClass = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className={`${sizeClass} text-amber-500 fill-amber-500`} />);
    } else if (i - 0.5 <= rating) {
      stars.push(<StarHalf key={i} className={`${sizeClass} text-amber-500 fill-amber-500`} />);
    } else {
      stars.push(<Star key={i} className={`${sizeClass} text-muted-foreground`} />);
    }
  }
  return <div className="flex items-center gap-1">{stars}</div>;
};

export const ReviewsSection = ({
  bookTitle,
  overallRating,
  totalReviews,
  bookRating,
  speakerRating,
  reviews,
}: ReviewsSectionProps) => {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-center text-foreground mb-6">Відгуки та рецензії</h2>

      {/* Overall Stats */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Book Rating */}
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground">Книга</h3>
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{bookRating.toFixed(1)}</span>
            <StarRating rating={bookRating} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">{totalReviews} відгуків</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
            >
              Надихаючий
            </Badge>
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
            >
              Добре написано
            </Badge>
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
            >
              Цікаво
            </Badge>
          </div>
        </div>

        {/* Speaker Rating */}
        <div className="text-center">
          <h3 className="mb-2 text-lg font-semibold text-foreground">Диктор</h3>
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{speakerRating.toFixed(1)}</span>
            <StarRating rating={speakerRating} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">{totalReviews} відгуків</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
            >
              Виразно
            </Badge>
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
            >
              Чіткий голос
            </Badge>
            <Badge
              variant="secondary"
              className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
            >
              Ідеальна відповідність
            </Badge>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mb-8">
        Відгуки написані слухачами з активною підпискою, які оцінили цю книгу. Додаткова перевірка не проводиться.
      </p>

      {/* Individual Reviews */}
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="pb-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
                <span className="text-amber-800 dark:text-amber-200 font-semibold text-sm">
                  {review.userName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                {/* User Name */}
                <h4 className="mb-2 font-semibold text-foreground">{review.userName}</h4>

                {/* Review Text */}
                <p className="mb-4 leading-relaxed text-muted-foreground">{review.comment}</p>

                {/* Ratings */}
                <div className="mb-3 space-y-2">
                  {review.bookRating && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Книга</span>
                      <StarRating rating={review.bookRating} />
                      <span className="text-sm text-muted-foreground">{review.bookRating.toFixed(1)}</span>
                    </div>
                  )}
                  {review.speakerRating && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Диктор</span>
                      <StarRating rating={review.speakerRating} />
                      <span className="text-sm text-muted-foreground">{review.speakerRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-amber-300/60 text-amber-700 dark:border-amber-700/60 dark:text-amber-200 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      <div className="pt-6 text-center">
        <Button
          variant="outline"
          className="border-amber-500/50 text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-900/20"
        >
          Показати більше відгуків
        </Button>
      </div>
    </section>
  );
};
