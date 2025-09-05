import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, StarHalf } from "lucide-react";

interface Review {
  id: string;
  userName: string;
  avatar: string;
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
      stars.push(<Star key={i} className={`${sizeClass} fill-yellow-400 text-yellow-400`} />);
    } else if (i - 0.5 <= rating) {
      stars.push(<StarHalf key={i} className={`${sizeClass} fill-yellow-400 text-yellow-400`} />);
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
  reviews 
}: ReviewsSectionProps) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Відгуки та рецензії
        </CardTitle>
        
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Book Rating */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Книга</h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-bold">{bookRating.toFixed(1)}</span>
              <StarRating rating={bookRating} size="lg" />
            </div>
            <p className="text-sm text-muted-foreground">{totalReviews} відгуків</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Badge variant="secondary">Надихаючий</Badge>
              <Badge variant="secondary">Добре написано</Badge>
              <Badge variant="secondary">Цікаво</Badge>
            </div>
          </div>
          
          {/* Speaker Rating */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Диктор</h3>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-bold">{speakerRating.toFixed(1)}</span>
              <StarRating rating={speakerRating} size="lg" />
            </div>
            <p className="text-sm text-muted-foreground">{totalReviews} відгуків</p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <Badge variant="secondary">Виразно</Badge>
              <Badge variant="secondary">Чіткий голос</Badge>
              <Badge variant="secondary">Ідеальна відповідність</Badge>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-center text-muted-foreground mt-4">
          Відгуки написані слухачами з активною підпискою, які оцінили цю книгу. 
          Додаткова перевірка не проводиться.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Individual Reviews */}
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-sm">
                  {review.userName.charAt(0).toUpperCase()}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                {/* User Name */}
                <h4 className="font-semibold text-foreground mb-2">{review.userName}</h4>
                
                {/* Review Text */}
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {review.comment}
                </p>
                
                {/* Ratings */}
                <div className="space-y-2 mb-3">
                  {review.bookRating && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Книга</span>
                      <StarRating rating={review.bookRating} />
                      <span className="text-sm text-muted-foreground">{review.bookRating}</span>
                    </div>
                  )}
                  {review.speakerRating && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Диктор</span>
                      <StarRating rating={review.speakerRating} />
                      <span className="text-sm text-muted-foreground">{review.speakerRating}</span>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Show More Button */}
        <div className="text-center pt-4">
          <Button variant="outline">
            Показати більше відгуків
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};