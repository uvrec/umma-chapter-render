import { useState } from "react";
import { useParams } from "react-router-dom";
import { VerseCard } from "./VerseCard";
import { AudioPlayer } from "./AudioPlayer";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { SettingsPanel } from "./SettingsPanel";
import { Button } from "@/components/ui/button";
import { Settings, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Verse {
  number: string;
  book?: string;
  sanskrit: string;
  transliteration?: string;
  synonyms?: string;
  translation: string;
  commentary?: string;
}

// Mock data for different scriptures
const verses: Verse[] = [{
  number: "ШБ 1.1.1",
  book: "Шрімад-Бгаґаватам",
  sanskrit: "ॐ नमो भगवते वासुदेवाय\nजन्माद्यस्य यतोऽन्वयादितरतश्चार्थेष्वभिज्ञ: स्वराट्\nतेने ब्रह्म हृदा य आदिकवये मुह्यन्ति यत्सूरय: ।\nतेजोवारिमृदां यथा विनिमयो यत्र त्रिसर्गोऽमृषा\nधाम्ना स्वेन सदा निरस्तकुहकं सत्यं परं धीमहि ॥ १ ॥",
  transliteration: "ом̇ намо бгаґавате ва̄судева̄йа\nджанма̄дй асйа йато 'нвайа̄д\nітараташ́ ча̄ртгешв абгіджн̃ах̣ свара̄т̣\nтене брахма хр̣да̄ йа а̄ді-кавайе\nмухйанті йат сӯрайах̣\nтеджо-ва̄рі-мр̣да̄м̇ йатга̄\nвінімайо йатра трі-сарго 'мр̣ша̄\nдга̄мна̄ свена сада̄ ніраста-\nкухакам̇ сатйам̇ парам̇ дгімахі",
  synonyms: "ом̇ — о мой Господе; намах̣ — вшанування; бгаґавате — Верховній Особистості Бога; ва̄судева̄йа — Кр̣шн̣і",
  translation: "О мій Господе, Шрі Кр̣шн̣о, сину Васудеви, о Всепроникаюча Особистість Бога, я вшановую Тебе.",
  commentary: "Це перший вірш Шрімад-Бгаґаватам, що починається з мантри ом̇ намо бгаґавате ва̄судева̄йа..."
}, {
  number: "ШБ 1.1.2",
  book: "Шрімад-Бгаґаватам", 
  sanskrit: "धर्मः प्रोज्झितकैतवोऽत्र परमो निर्मत्सराणां सतां\nवेदान्तकृद्वेदविदेको निर्वाणम्।",
  transliteration: "дгармах̣ проджджгіта-каітаво 'тра парамо нірматсара̄н̣а̄м̇ сата̄м̇\nведа̄нта-кр̣д веда-від еко нірва̄н̣ам",
  synonyms: "дгармах̣ — релігія; проджджгіта — повністю відкинута; каітавах̣ — обман",
  translation: "Повністю відкинувши всі релігійні заходи, мотивовані матеріальними бажаннями...",
  commentary: "Цей вірш визначає справжню релігію як служіння без мотивів..."
}, {
  number: "БГ 2.20",
  book: "Бгаґавад-ґіта",
  sanskrit: "न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः।\nअजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे॥",
  transliteration: "на джа̄йате мрійате ва̄ када̄чін\nна̄йам̇ бгӯтва̄ бгавіта̄ ва̄ на бгӯйах̣\nаджо нітйах̣ ш́а̄ш́вато 'йам̇ пура̄н̣о\nна ганйате ганйама̄не ш́арӣре",
  synonyms: "на — ніколи; джа̄йате — народжується; мрійате — помирає; ва̄ — або",
  translation: "Для душі немає ні народження, ні смерті...",
  commentary: "Кр̣шн̣а описує вічну природу душі..."
}, {
  number: "БГ 18.66",
  book: "Бгаґавад-ґіта",
  sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
  transliteration: "сарва-дгарма̄н паритйаджйа\nма̄м екам̇ ш́аран̣ам̇ враджа\nахам̇ тва̄м̇ сарва-па̄пебгйо\nмокшайішйа̄мі ма̄ ш́учах̣",
  synonyms: "сарва-дгарма̄н — усі різновиди релігії; паритйаджйа — залишивши",
  translation: "Залиш усі різновиди релігії і просто віддайся Мені...",
  commentary: "Це кульмінаційний вірш Бгаґавад-ґіти..."
}, {
  number: "ШІІ 5.1.4",
  book: "Шрі Ішопанішад",
  sanskrit: "कृष्णं वन्दे जगद्गुरुम् ॥",
  transliteration: "кр̣шн̣ам̇ ванде джаґад-ґурум",
  synonyms: "кр̣шн̣ам — Господа Крішну; ванде — вшановую; джаґат — всесвіту; ґурум — духовного вчителя",
  translation: "Я вшановую Господа Крішну, духовного вчителя всього всесвіту.",
  commentary: "Господь Крішна є первинним духовним вчителем, оскільки Він є джерелом усього знання. Коли Він з'явився на Землі, Він особисто продемонстрував найвищі ідеали духовного життя і дав людству найдосконаліше знання у формі Бгаґавад-ґіти."
}];

export const VedaReader = () => {
  const { bookId } = useParams();
  const [currentVerse, setCurrentVerse] = useState<number>(1);
  const [playingVerse, setPlayingVerse] = useState<string | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [craftPaperMode, setCraftPaperMode] = useState(false);

  const getBookTitle = (bookId?: string): string => {
    switch (bookId) {
      case 'srimad-bhagavatam':
        return 'Шрімад-Бгаґаватам';
      case 'bhagavad-gita':
        return 'Бгаґавад-ґіта';
      case 'sri-isopanishad':
        return 'Шрі Ішопанішад';
      default:
        return 'Ведичні тексти';
    }
  };

  const getFilteredVerses = (bookId?: string): Verse[] => {
    if (!bookId) return verses;
    
    switch (bookId) {
      case 'srimad-bhagavatam':
        return verses.filter(v => v.number.startsWith('ШБ'));
      case 'bhagavad-gita':
        return verses.filter(v => v.number.startsWith('БГ'));
      case 'sri-isopanishad':
        return verses.filter(v => v.number.startsWith('ШІІ'));
      default:
        return verses;
    }
  };

  const handlePlayVerse = (verseNumber: string) => {
    if (playingVerse === verseNumber) {
      setPlayingVerse(null);
      setShowAudioPlayer(false);
    } else {
      setPlayingVerse(verseNumber);
      setShowAudioPlayer(true);
    }
  };

  const handleClosePlayer = () => {
    setShowAudioPlayer(false);
    setPlayingVerse(null);
  };

  const handleVerseSelect = (verseNumber: string) => {
    const verse = filteredVerses.find(v => v.number === verseNumber);
    if (verse) {
      const verseElement = document.getElementById(`verse-${verseNumber}`);
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const filteredVerses = getFilteredVerses(bookId);

  return (
    <div className={`min-h-screen ${craftPaperMode ? 'craft-paper-bg' : 'bg-background'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb items={[
            { label: "Головна", href: "/" },
            { label: "Бібліотека", href: "/library" },
            { label: getBookTitle(bookId) }
          ]} />
          
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/library" 
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Повернутися до бібліотеки
            </Link>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Налаштування
            </Button>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{getBookTitle(bookId)}</h1>
            <p className="text-muted-foreground">
              Глава {currentVerse} • {filteredVerses.length} віршів
            </p>
          </div>

          <div className="space-y-8" style={{ fontSize: `${fontSize}px` }}>
            {filteredVerses.map((verse, index) => (
              <div key={verse.number} id={`verse-${verse.number}`}>
                <VerseCard
                  verseNumber={verse.number}
                  sanskritText={verse.sanskrit}
                  transliteration={verse.transliteration}
                  synonyms={verse.synonyms}
                  translation={verse.translation}
                  commentary={verse.commentary}
                  bookName={verse.book}
                  isPlaying={playingVerse === verse.number}
                  onPlay={() => handlePlayVerse(verse.number)}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        craftPaperMode={craftPaperMode}
        onCraftPaperToggle={setCraftPaperMode}
        verses={filteredVerses}
        currentVerse={playingVerse || filteredVerses[0]?.number || ""}
        onVerseSelect={handleVerseSelect}
      />

      <AudioPlayer
        verseNumber={playingVerse || ""}
        onClose={handleClosePlayer}
        isVisible={showAudioPlayer}
      />
    </div>
  );
};