import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { VerseCard } from "./VerseCard";

const verses = [
  {
    number: "3:1",
    arabic: "الم",
    transliteration: "Алиф. Лям. Мим",
    translation: "Алиф. Лям. Мим.",
    commentary: "Смысл этого и подобных аятов Корана никому не известен, кроме Всевышнего. Высказывались те или иные предположения об их значении, но эти суждения не имеют прочной научно-богословской основы."
  },
  {
    number: "3:2",
    arabic: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    transliteration: "Аллаху Ляя Илляяхя Илляхуаль-Хаййуль-Каййуум",
    translation: "Аллах (Бог, Господь)… Нет бога, кроме Него, вечно Живого, Сущего."
  },  
  {
    number: "3:3",
    arabic: "نَزَّلَ عَلَيْكَ الْكِتَابَ بِالْحَقِّ مُصَدِّقًا لِمَا بَيْنَ يَدَيْهِ وَأَنْزَلَ التَّوْرَاةَ وَالْإِنْجِيلَ",
    transliteration: "Наззаля `Алейка Аль-Китабабиль-Хаккы Муссадыка Лима Бяйня Йядяйхи Уа `Анзяля Эттаураата Уа Аль-Инджииль",
    translation: "Он низвел тебе [Мухаммад] Книгу [Священный Коран] с истиной в подтверждение того, что было ранее [ниспослано Творцом из Священных Писаний], низвел Он [до этого] Тору и Евангелие.",
    commentary: "Тора (в первоначальном ее виде) с точки зрения Ислама также Священное Писание, данное Богом пророку Моисею. Евангелие (в первоначальном виде) с точки зрения Ислама — это то, что внушил Господь пророку Иисусу."
  },
  {
    number: "3:4",
    arabic: "مِنْ قَبْلُ هُدًى لِلنَّاسِ وَأَنْزَلَ الْفُرْقَانَ إِنَّ الَّذِينَ كَفَرُوا بِآيَاتِ اللَّهِ لَهُمْ عَذَابٌ شَدِيدٌ وَاللَّهُ عَزِيزٌ ذُو انْتِقَامٍ",
    transliteration: "Мин Кабляхудээ Линнээси Уа `Анзаляль-Фуркаан Инналь-Лязиина Кафару Биайати-лляхи Ляхум `Азяябун Шадиид Уа Аллаху `Азизу Дуу-нтикааам.",
    translation: "[Низвел Он это] ранее как верный (правильный) путь для людей [прошлых исторических эпох]. [А сейчас поэтапно] низвел то, что разделяет верное и ложное (отделяет правильное от ошибочного) [то есть Коран]. Поистине, тех, кто не верует в знамения Аллаха (Бога, Господа), ожидает суровое наказание. Он [Творец] Всемогущ и воздает по заслугам."
  },
  {
    number: "3:5",
    arabic: "إِنَّ اللَّهَ لَا يَخْفَى عَلَيْهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ",
    transliteration: "Иннаа-ллаху Ляя Йахфа `Алейхи Шай`ун Филь-`Арды Уа Ля Фи Ас-самаа.",
    translation: "Воистину, ничто ни на земле, ни на небесах не спрячется, не утаится от Аллаха (Бога, Господа) [Он о каждой вещи Сведущ]."
  }
];

export const QuranReader = () => {
  const [currentVerse, setCurrentVerse] = useState<number>(19);
  const [playingVerse, setPlayingVerse] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: "Перевод корана", href: "/perevod-korana" },
    { label: "Алю 'имран" }
  ];

  const handlePlayVerse = (verseNumber: string) => {
    if (playingVerse === verseNumber) {
      setPlayingVerse(null);
    } else {
      setPlayingVerse(verseNumber);
      // Simulate audio stop after 3 seconds
      setTimeout(() => setPlayingVerse(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="max-w-4xl mx-auto">
          {/* Chapter Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button variant="outline" size="sm">
                Перевод
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary">3</span>
                <div className="text-center">
                  <div className="text-lg font-semibold">Алю 'имран</div>
                  <div className="text-sm text-muted-foreground">Род 'Имрана</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <span>Аят {currentVerse}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
                Настройки
              </Button>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              Сура 3 «Алю 'имран» (Род 'Имрана)
            </h1>
            
            <div className="bismillah mb-6 text-islamic-gold">
              ﷽
            </div>
            
            <p className="text-muted-foreground mb-2">
              (перевод смыслов 3 суры Священного Корана и комментарии)
            </p>
            
            <p className="text-foreground leading-relaxed">
              Именем Аллаха [именем Бога, Творца всего сущего, Одного и Единственного для всех и вся], 
              милость Которого вечна и безгранична.
            </p>
          </div>

          {/* Verses */}
          <div className="space-y-6">
            {verses.map((verse, index) => (
              <VerseCard
                key={verse.number}
                verseNumber={verse.number}
                arabicText={verse.arabic}
                transliteration={verse.transliteration}
                translation={verse.translation}
                commentary={verse.commentary}
                onPlay={() => handlePlayVerse(verse.number)}
                isPlaying={playingVerse === verse.number}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};