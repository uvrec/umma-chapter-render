import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight } from "lucide-react";

export const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Духовний розвиток у сучасному світі",
      excerpt: "Дослідження того, як древні ведичні вчення можуть допомогти нам знайти мир і щастя в сучасному світі повному стресу та невизначеності.",
      author: "Редакція",
      date: "2024-01-15",
      readTime: "5 хв",
      category: "Духовність",
      image: "/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png"
    },
    {
      id: 2,
      title: "Медитація та внутрішній спокій",
      excerpt: "Практичні поради з медитації та концентрації розуму згідно з ведичними традиціями. Як почати свій духовний шлях.",
      author: "Духовний наставник",
      date: "2024-01-10", 
      readTime: "8 хв",
      category: "Практика",
      image: "/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png"
    },
    {
      id: 3,
      title: "Значення служіння в духовному житті",
      excerpt: "Роздуми про важливість безкорисливого служіння та його роль у духовному зростанні особистості.",
      author: "Практикуючий",
      date: "2024-01-05",
      readTime: "6 хв", 
      category: "Філософія",
      image: "/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png"
    }
  ];

  const categories = ["Всі", "Духовність", "Практика", "Філософія", "Історія"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Духовний блог
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Статті, роздуми та практичні поради на шляху духовного розвитку
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "Всі" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-3 h-3 mr-1" />
                    <span>{post.author}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(post.date).toLocaleDateString('uk-UA')}</span>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Завантажити більше статей
          </Button>
        </div>
      </main>
    </div>
  );
};