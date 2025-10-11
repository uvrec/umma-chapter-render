import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import nectarInstructionsNewCover from "@/assets/nectar-instructions-new-cover.webp";
import songsAcharyasCover from "@/assets/songs-acharyas-cover.webp";
import smallBookIcon from "@/assets/small-book-icon.webp";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Book {
  id: string;
  title: string;
  description: string;
  price?: string | null;
  coverImage?: string | null;
  purchaseUrl: string;
}

const staticAcharyasBooks: Book[] = [
  {
    id: "nectar",
    title: "Нектар настанов",
    description:
      "Одинадцять віршів «Шрі Упадешамріти» містять найважливіші настанови для тих, хто хоче йти шляхом бгакті.",
    price: "65 грн",
    coverImage: nectarInstructionsNewCover,
    purchaseUrl: "https://books.krishna.ua/ua/nektar-nastanov/",
  },
  {
    id: "science",
    title: "Наука самоусвідомлення",
    description:
      "Збірник бесід з різними цікавими людьми: Джоном Ленноном, радянським професором Г. Котовським та іншими.",
    price: "127 грн",
    coverImage: null,
    purchaseUrl: "https://books.krishna.ua/ua/nauka-samousvidomlennja/",
  },
  {
    id: "songs",
    title: "Пісні ачар'їв-вайшнавів",
    description: "Унікальне зібрання бгаджанів мовою українською-солов'їною!",
    price: "146 грн",
    coverImage: songsAcharyasCover,
    purchaseUrl: "https://books.krishna.ua/ua/pisni-acharjiv-vajshnaviv/",
  },
  {
    id: "raja-vidya",
    title: "Раджа-відя - найшляхетніше знання",
    description:
      'Можна пишатися академічною освітою, але не знати відповіді на запитання "хто я?". Усі люди за рідкісними винятками вважають себе за це тіло.',
    price: "48 грн",
    coverImage: null,
    purchaseUrl: "https://books.krishna.ua/ua/radja-vidja-najshljahetnishe-znannja/",
  },
  {
    id: "perfect-questions",
    title: "Досконалі питання, досконалі відповіді",
    description:
      "Бесіди духовного учителя, представника однієї з найбільш давніх релігійних традицій, із молодим шукачем істини.",
    price: "41 грн",
    coverImage: null,
    purchaseUrl: "https://books.krishna.ua/ua/doskonali-pytannja-doskonali-vidpovidi/",
  },
  {
    id: "journey",
    title: "Подорож самопізнання",
    description:
      "Серед безплідної пустелі матеріалізму «Подорож самопізнання» служитиме надійною малою, що виведе до оазису вищого, духовного усвідомлення.",
    price: "59 грн",
    coverImage: null,
    purchaseUrl: "https://books.krishna.ua/ua/podorozh-samopiznannja/",
  },
];

export const AcharyasBooks = () => {
  // тягнемо динаміку з Supabase
  const { data: dynamicBooks, isLoading } = useQuery({
    queryKey: ["acharyas-books"],
    queryFn: async () => {
      // очікувана таблиця: store_books
      // поля: id, title_ua, description_ua, price, cover_image_url, purchase_url, category
      const { data, error } = await supabase
        .from("store_books")
        .select("id, title_ua, description_ua, price, cover_image_url, purchase_url, category")
        .eq("category", "acharyas")
        .order("title_ua");

      if (error) throw error;

      // мапимо під локальний інтерфейс
      const mapped: Book[] =
        (data || []).map((b: any) => ({
          id: b.id,
          title: b.title_ua ?? "",
          description: b.description_ua ?? "",
          price: b.price ?? null,
          coverImage: b.cover_image_url ?? null,
          purchaseUrl: b.purchase_url ?? "#",
        })) ?? [];

      return mapped;
    },
  });

  // мерджимо: динаміка має пріоритет, а статичні — як fallback для відсутніх id
  const mergedById = new Map<string, Book>();
  (dynamicBooks || []).forEach((b) => mergedById.set(b.id, b));
  staticAcharyasBooks.forEach((b) => {
    if (!mergedById.has(b.id)) mergedById.set(b.id, b);
  });
  const books = Array.from(mergedById.values());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="w-full h-64 md:h-80 lg:h-96 rounded-lg mb-12 overflow-hidden shadow-lg">
          <img
            src="/lovable-uploads/38e84a84-ccf1-4f23-9197-595040426276.png"
            alt="Студія звукозапису"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24">
              <img
                src="/lovable-uploads/6248f7f9-3439-470f-92cd-bcc91e90b9ab.png"
                alt="Прабгупада солов'їною"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Книги вайшнавських ачар'їв</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Малі книги та додаткова література від великих вайшнавських учителів
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-16">Завантаження…</div>
        ) : (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {books.map((book) => {
                const hasCover =
                  !!book.coverImage && typeof book.coverImage === "string" && book.coverImage.trim() !== "";

                return (
                  <Card key={book.id} className="group hover:shadow-lg transition-all duration-300 border-border/50">
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/5 to-primary/10 rounded-t-lg overflow-hidden">
                      {hasCover ? (
                        <div className="block w-full h-full">
                          <img
                            src={book.coverImage!}
                            alt={book.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                          <div className="text-center p-3">
                            <div className="mb-2">
                              <img src={smallBookIcon} alt="Book" className="w-12 h-12 mx-auto" />
                            </div>
                            <div className="text-sm font-medium text-foreground/80 line-clamp-4">{book.title}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-foreground mb-2 text-sm line-clamp-2 text-center">
                        {book.title}
                      </h3>

                      {book.description ? (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{book.description}</p>
                      ) : null}

                      <div className="flex items-center justify-center gap-2">
                        {book.price ? (
                          <Badge variant="secondary" className="text-xs select-none">
                            {book.price}
                          </Badge>
                        ) : null}
                        <a href={book.purchaseUrl} target="_blank" rel="noopener noreferrer">
                          <Badge className="text-xs hover:bg-primary/80 transition-colors">Купити</Badge>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};
