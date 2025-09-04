import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { VerseCard } from "./VerseCard";
import { AudioPlayer } from "./AudioPlayer";
import { SettingsPanel } from "./SettingsPanel";
const verses = [{
  number: "ШБ 1.1.1",
  book: "Шрімад-Бгаґаватам",
  sanskrit: "ॐ नमो भगवते वासुदेवाय\nजन्माद्यस्य यतोऽन्वयादितरतश्चार्थेष्वभिज्ञ: स्वराट्\nतेने ब्रह्म हृदा य आदिकवये मुह्यन्ति यत्सूरय: ।\nतेजोवारिमृदां यथा विनिमयो यत्र त्रिसर्गोऽमृषा\nधाम्ना स्वेन सदा निरस्तकुहकं सत्यं परं धीमहि ॥ १ ॥",
  transliteration: "ом̇ намо бгаґавате ва̄судева̄йа\nджанма̄дй асйа йато 'нвайа̄д\nитараташ́ ча̄ртгешв абгіджн̃ах̣ свара̄т̣\nтене брахма хр̣да̄ йа а̄ді-кавайе\nмухйанті йат сӯрайах̣\nтеджо-ва̄рі-мр̣да̄м̇ йатга̄\nвінімайо йатра трі-сарго 'мр̣ша̄\nдга̄мна̄ свена сада̄ ніраста-\nкухакам̇ сатйам̇ парам̇ дгімахі",
  synonyms: "ом̇ — мій Господи; намах̣ — в шанобі схиляючись; бгаґавате — Богові-Особі; ва̄судева̄йа — Ва̄судеві (синові Васудеви), Господу Шрі Крішні; джанма-а̄ді — творення, підтримання та знищення; асйа — проявлених усесвітів; йатах̣ — що з Нього; анвайа̄т — прямо; ітаратах̣ — непрямо; ча — і; артгешу — цілях; абгіджн̃ах̣ — повністю свідомий; сва-ра̄т̣ — цілковито незалежний",
  translation: "О мій Господи! Я шанобливо схиляюся перед Тобою, Шрі Крішно, сину Васудеви, всепроникаючий Боже-Особо! Я медитую на Господа Шрі Крішну, тому що Він є АбсолютнаІстина, первинна причина всіх причин у творенні, підтриманні й знищенні проявлених усесвітів.",
  commentary: "Поклони Богові-Особі, Ва̄судеві, є прямим виразом шани Господу Шрі Крішні, божественному синові Васудеви та Девакі. В цьому самому вірші Шрі В'ясадева стверджує, що Шрі Крішна — це відначальний Бог-Особа, а всі інші є Його безпосередні та непрямі повні частки і частки часток."
}, {
  number: "БГ 1.1",
  book: "Бгаґавад-ґіта",
  sanskrit: "धृतराष्ट्र उवाच\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सव: ।\nमामका: पाण्डवाश्चैव किमकुर्वत सञ्जय ॥ १ ॥",
  transliteration: "дгр̣тара̄шт̣ра ува̄ча\nдгарма-кшетре куру-кшетре\nсамавета̄ йуйутсавах̣\nма̄мака̄х̣ па̄н̣д̣ава̄ш́ чаіва\nкім акурвата сан̃джайа",
  synonyms: "дгр̣тара̄шт̣рах̣ ува̄ча — цар Дгр̣ітара̄шт̣ра сказав; дгарма-кшетре — на місці поломництва; куру-кшетре — в місцевості під назвою Курукшетра; самавета̄х̣ — ті, що зібралися; йуйутсавах̣ — ті, що жадають бою; ма̄мака̄х̣ — моя партія (сини); па̄н̣д̣ава̄х̣ — сини Па̄н̣д̣у; ча — і; ева — неодмінно; кім — що; акурвата — вони зробили; сан̃джайа — о Сан̃джайо",
  translation: "Дгр̣тара̄шт̣ра сказав: О Сан̃джайо, що роблять мої сини й сини Па̄н̣д̣у, зібравшись в місці прощі на полі Курукшетра з наміром битися?",
  commentary: "Бгаґавад-ґі̄та̄ — це загальновідомий науковий теїстичний твір. Слово дгарма-кшетра (місце, де відправляються релігійні обряди) має особливе значення, тому що на полі бою Курукшетра Верховний Бог-Особа був на боці Арджуни."
}, {
  number: "ІШО 1",
  book: "Ш́рі̄ Īш́опанішад",
  sanskrit: "ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।\nतेन त्यक्तेन भुञ्जीथा मा गृध: कस्यस्विद्धनम् ॥ १ ॥",
  transliteration: "īша̄ва̄сйам ідам̇ сарвам̇\nйат кін̃ча джаґатйа̄м̇ джаґат\nтена тйактена бгун̃джітга̄\nма̄ ґр̣дгах̣ касйа свід дганам",
  synonyms: "īша̄ва̄сйам — що контролюється Господом; ідам — цей; сарвам — всесвіт; йат кін̃ча — все що завгодно; джаґатйа̄м джаґат — у всесвіті; тена — Ним; тйактена — наданим; бгун̃джітга̄ — ти повинен користуватися; ма̄ — ніколи; ґр̣дгах̣ — не повинен жадати; касйа світ — кого іншого; дганам — багатство",
  translation: "Усе живе й неживе у всесвіті контролюється і належить Господу. Тому слід користуватися лише тим, що необхідне, що виділене як твоя частка, і ніколи не посягати на нічиє інше.",
  commentary: "Ця мантра відкриває найголовнішу істину: весь всесвіт належить Верховному Господу Іша̄ (контролюючому), або Крішні. Тому кожен повинен приймати лише те, що йому необхідне для підтримання тіла та душі разом, і не повинен жадати більшого."
}, {
  number: "НВ 1.1",
  book: "Нектар відданости",
  sanskrit: "श्रीरूप गोस्वामी भक्तिरसामृतसिन्धौ ॥",
  transliteration: "ш́рі̄-рӯпа ґосва̄мі бгакті-раса̄мр̣та-сіндгау",
  synonyms: "ш́рі̄-рӯпа ґосва̄мі — Шрі̄ла Рӯпа Ґосва̄мі; бгакті — відданого служіння; раса — смаків; амр̣та — нектар; сіндгау — в океані",
  translation: "Шрі̄ла Рӯпа Ґосва̄мі представляє океан нектарних смаків відданого служіння.",
  commentary: "Шрі̄ла Рӯпа Ґосва̄мі склав цей твір як керівництво для тих, хто прагне досягти чистого відданого служіння Господу Крішні. Відданість — це вічна природа живої істоти, і коли вона пробуджується, людина відчуває трансцендентне щастя."
}, {
  number: "КБ 1.1",
  book: "Крішна",
  sanskrit: "कृष्णं वन्दे जगद्गुरुम् ॥",
  transliteration: "кр̣шн̣ам̇ ванде джаґад-ґурум",
  synonyms: "кр̣шн̣ам — Господа Крішну; ванде — вшановую; джаґат — всесвіту; ґурум — духовного вчителя",
  translation: "Я вшановую Господа Крішну, духовного вчителя всього всесвіту.",
  commentary: "Господь Крішна є первинним духовним вчителем, оскільки Він є джерелом усього знання. Коли Він з'явився на Землі, Він особисто продемонстрував найвищі ідеали духовного життя і дав людству найдосконаліше знання у формі Бгаґавад-ґіти."
}];
export const QuranReader = () => {
  const {
    bookId
  } = useParams();
  const [currentVerse, setCurrentVerse] = useState<number>(1);
  const [playingVerse, setPlayingVerse] = useState<string | null>(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [craftPaperMode, setCraftPaperMode] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<string>("");

  // Filter verses based on bookId
  const getBookTitle = (bookId?: string) => {
    switch (bookId) {
      case 'srimad-bhagavatam':
        return 'Шрімад-Бгаґаватам';
      case 'bhagavad-gita':
        return 'Бгаґавад-Ґіта';
      case 'isopanisad':
        return 'Шрі Ішопанішада';
      default:
        return 'Ведичні писання';
    }
  };
  const getFilteredVerses = (bookId?: string) => {
    if (!bookId) return verses;
    switch (bookId) {
      case 'srimad-bhagavatam':
        return verses.filter(verse => verse.book === 'Шрімад-Бгаґаватам');
      case 'bhagavad-gita':
        return verses.filter(verse => verse.book === 'Бгаґавад-ґіта');
      case 'isopanisad':
        return verses.filter(verse => verse.book === 'Ш́рі̄ Īш́опанішад');
      default:
        return verses;
    }
  };
  const currentBookTitle = getBookTitle(bookId);
  const filteredVerses = getFilteredVerses(bookId);

  useEffect(() => {
    if (filteredVerses.length > 0 && !selectedVerse) {
      setSelectedVerse(filteredVerses[0].number);
    }
  }, [filteredVerses, selectedVerse]);
  const breadcrumbItems = [{
    label: "Ведична бібліотека",
    href: "/"
  }, {
    label: currentBookTitle
  }];
  const handlePlayVerse = (verseNumber: string) => {
    if (playingVerse === verseNumber && showAudioPlayer) {
      setPlayingVerse(null);
      setShowAudioPlayer(false);
    } else {
      setPlayingVerse(verseNumber);
      setShowAudioPlayer(true);
      setCurrentVerse(parseInt(verseNumber.split(':')[1]));
    }
  };
  const handleClosePlayer = () => {
    setShowAudioPlayer(false);
    setPlayingVerse(null);
  };

  const handleVerseSelect = (verseNumber: string) => {
    setSelectedVerse(verseNumber);
    const verseIndex = filteredVerses.findIndex(v => v.number === verseNumber);
    if (verseIndex !== -1) {
      setCurrentVerse(verseIndex + 1);
    }
  };
  return <div className={`min-h-screen ${craftPaperMode ? 'craft-paper-bg' : 'bg-background'}`}>
      <Header />
      
      <main className={`container mx-auto px-4 py-8 ${showAudioPlayer ? 'pb-32' : ''}`}>
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="max-w-4xl mx-auto">
          {/* Back to Home */}
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
              ← Повернутися до бібліотеки
            </Link>
          </div>

          {/* Chapter Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Button variant="outline" size="sm">
                Переклад
              </Button>
              <div className="flex items-center space-x-2">
                
                <div className="text-center">
                  <div className="text-lg font-semibold">Ведичні писання</div>
                  <div className="text-sm text-muted-foreground">Вибрані вірші</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <span>Вірш {currentVerse}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4" />
                Налаштування
              </Button>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              {currentBookTitle}
            </h1>
            
            <div className="text-4xl mb-6 text-primary">
              ॐ
            </div>
            
            <p className="text-muted-foreground mb-2">
              (Вибрані вірші з ведичних писань з коментарями Шріли Прабгупади)
            </p>
            
            <p className="text-foreground leading-relaxed">
              Трансцендентне знання ведичної літератури з поясненнями найавторитетнішого вчителя сучасності, 
              Його Божественної Милості А.Ч. Бхактіведанти Свамі Прабгупади.
            </p>
          </div>

          {/* Verses */}
          <div className="space-y-6" style={{ fontSize: `${fontSize}px` }}>
            {filteredVerses.map((verse, index) => <VerseCard key={verse.number} verseNumber={verse.number} bookName={verse.book} sanskritText={verse.sanskrit} transliteration={verse.transliteration} synonyms={verse.synonyms} translation={verse.translation} commentary={verse.commentary} onPlay={() => handlePlayVerse(verse.number)} isPlaying={playingVerse === verse.number} />)}
          </div>
        </div>
      </main>

      <AudioPlayer verseNumber={playingVerse || "3:1"} onClose={handleClosePlayer} isVisible={showAudioPlayer} />
      
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        craftPaperMode={craftPaperMode}
        onCraftPaperToggle={setCraftPaperMode}
        verses={filteredVerses}
        currentVerse={selectedVerse}
        onVerseSelect={handleVerseSelect}
      />
    </div>;
};