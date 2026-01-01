import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export const Blog = () => {
  const { language } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch blog posts
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['blog-posts', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('blog_posts')
        .select(`
          id,
          title_ua,
          title_en,
          slug,
          excerpt_ua,
          excerpt_en,
          cover_image_url,
          featured_image,
          published_at,
          created_at,
          view_count,
          read_time,
          author_display_name,
          blog_categories (
            id,
            name_ua,
            name_en,
            slug
          )
        `)
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['blog-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order(language === 'ua' ? 'name_ua' : 'name_en');
      if (error) throw error;
      return data;
    },
  });

  // Filter posts by search query
  const filteredPosts = posts?.filter((post) => {
    if (!searchQuery) return true;
    const title = language === 'ua' ? post.title_ua : post.title_en;
    const excerpt = language === 'ua' ? post.excerpt_ua : post.excerpt_en;
    const searchLower = searchQuery.toLowerCase();
    return (
      title?.toLowerCase().includes(searchLower) ||
      excerpt?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* Hero Section - адаптивний */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="blog-title text-foreground mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl">
            {language === 'ua' ? 'Духовний блог' : 'Spiritual Blog'}
          </h1>
          <p className="blog-subtitle max-w-2xl mx-auto text-sm sm:text-base px-4">
            {language === 'ua' 
              ? 'Статті, роздуми та практичні поради на шляху духовного розвитку'
              : 'Articles, reflections and practical advice on the path of spiritual development'
            }
          </p>
        </div>

        {/* Search Bar - адаптивний */}
        <div className="max-w-xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={language === 'ua' ? 'Шукати статті...' : 'Search articles...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Filter - адаптивний */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8 justify-center px-2">
          <Button
            variant={selectedCategory === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            {language === 'ua' ? 'Всі' : 'All'}
          </Button>
          {categories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {language === 'ua' ? category.name_ua : category.name_en}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {postsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm sm:text-base">
              {language === 'ua' ? 'Завантаження...' : 'Loading...'}
            </p>
          </div>
        ) : filteredPosts && filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm sm:text-base">
              {language === 'ua' ? 'Статей не знайдено' : 'No articles found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {filteredPosts?.map((post) => {
              const title = language === 'ua' ? post.title_ua : post.title_en;
              const excerpt = language === 'ua' ? post.excerpt_ua : post.excerpt_en;
              const categoryName = language === 'ua' 
                ? post.blog_categories?.name_ua 
                : post.blog_categories?.name_en;

              return (
                <Link key={post.id} to={`/blog/${post.slug}`} className="block hover:bg-muted/30 transition-colors py-4">
                  {post.cover_image_url && (
                    <div className="aspect-video mb-4">
                      <img
                        src={post.cover_image_url}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    {categoryName && (
                      <Badge variant="secondary">{categoryName}</Badge>
                    )}
                    {post.read_time > 0 && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.read_time} {language === 'ua' ? 'хв' : 'min'}
                      </div>
                    )}
                  </div>

                  <h3 className="blog-heading text-xl text-foreground mb-3 line-clamp-2">
                    {title}
                  </h3>

                  {excerpt && (
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="w-3 h-3 mr-1" />
                      <span>{post.author_display_name}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>
                        {new Date(post.published_at || post.created_at).toLocaleDateString(
                          language === 'ua' ? 'uk-UA' : 'en-US'
                        )}
                      </span>
                    </div>

                    <Button variant="ghost" size="sm">
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};