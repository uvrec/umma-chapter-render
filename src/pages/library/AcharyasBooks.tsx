import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import nectarInstructionsNewCover from "@/assets/nectar-instructions-new-cover.webp";
import songsAcharyasCover from "@/assets/songs-acharyas-cover.webp";
import smallBookIcon from "@/assets/small-book-icon.webp";

interface Book {
  id: string;
  title: string;
  description: string;
  price: string;
  coverImage: string;
  purchaseUrl: string;
}

const acharyasBooks: Book[] = [
  {
    id: "nectar",
    title: "Нектар настанов",
    description: "Одинадцять віршів «Шрі Упадешамріти» містять найважливіші настанови для тих, хто хоче йти шляхом бгакті.",
    price: "65 грн",
    coverImage: nectarInstructionsNewCover,
    purchaseUrl: "https://books.krishna.ua/uk/nektar-nastanov/"
  },
  {
    id: "science",
    title: "Наука самоусвідомлення",
    description: "Збірник бесід з різними цікавими людьми: Джоном Ленноном, радянським професором Г. Котовським та іншими.",
    price: "127 грн",
    coverImage: "/api/placeholder/300/400",
    purchaseUrl: "https://books.krishna.ua/uk/nauka-samousvidomlennja/"
  },
  {
    id: "songs",
    title: "Пісні ачар'їв-вайшнавів",
    description: "Унікальне зібрання бгаджанів мовою українською-солов'їною!",
    price: "146 грн",
    coverImage: songsAcharyasCover,
    purchaseUrl: "https://books.krishna.ua/uk/pisni-acharjiv-vajshnaviv/"
  },
  {
    id: "raja-vidya",
    title: "Раджа-відья - найшляхетніше знання",
    description: "Можна пишатися академічною освітою, але не знати відповіді на запитання \"хто я?\". Усі люди за рідкісними винятками вважають себе за це тіло.",
    price: "48 грн",
    coverImage: "/api/placeholder/300/400",
    purchaseUrl: "https://books.krishna.ua/uk/radja-vidja-najshljahetnishe-znannja/"
  },
  {
    id: "perfect-questions",
    title: "Досконалі питання, досконалі відповіді",
    description: "Бесіди духовного учителя, представника однієї з найбільш давніх релігійних традицій, із молодим шукачем істини.",
    price: "41 грн",
    coverImage: "/api/placeholder/300/400",
    purchaseUrl: "https://books.krishna.ua/uk/doskonali-pytannja-doskonali-vidpovidi/"
  },
  {
    id: "journey",
    title: "Подорож самопізнання",
    description: "Серед безплідної пустелі матеріалізму «Подорож самопізнання» служитиме надійною малою, що виведе до оазису вищого, духовного усвідомлення.",
    price: "59 грн",
    coverImage: "/api/placeholder/300/400",
    purchaseUrl: "https://books.krishna.ua/uk/podorozh-samopiznannja/"
  }
];

export const AcharyasBooks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="w-full h-64 md:h-80 lg:h-96 rounded-lg mb-12 overflow-hidden">
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

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {acharyasBooks.map(book => (
              <div key={book.id} className="group">
                <div className="aspect-[3/4] bg-muted/30 rounded-lg overflow-hidden">
                  {book.coverImage && typeof book.coverImage === 'string' && !book.coverImage.includes('placeholder') ? (
                    <div className="block w-full h-full">
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                      <div className="text-center p-3">
                        <div className="mb-2">
                          <img src={smallBookIcon} alt="Book icon" className="w-12 h-12 mx-auto" />
                        </div>
                        <div className="text-sm font-medium text-foreground/80 line-clamp-4">
                          {book.title}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-foreground mb-2 text-sm line-clamp-2 text-center">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {book.description}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <a href={book.purchaseUrl} target="_blank" rel="noopener noreferrer">
                      <Badge variant="default" className="text-xs hover:bg-primary/80 transition-colors">
                        Купити
                      </Badge>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
