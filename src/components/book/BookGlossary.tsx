/**
 * BookGlossary - Glossary page with A-Z index
 * Based on BBT reference app design, adapted to VedaVOICE amber/craft theme
 */

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { BookReaderHeader } from "@/components/BookReaderHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface BookGlossaryProps {
  bookTitle: string;
  bookSlug: string;
  cantoNumber?: number;
  terms?: GlossaryTermData[];
}

interface GlossaryTermData {
  term: string;
  termSanskrit?: string;
  definition: string;
}

// Default glossary terms (Ukrainian)
const DEFAULT_GLOSSARY_TERMS: GlossaryTermData[] = [
  { term: "Аватара", termSanskrit: "авата̄ра", definition: "«той, хто сходить униз»; втілення Бога, яке наділене повною або частковою владою і яке приходить із духовного світу для того, щоб виконати певну місію." },
  { term: "Авідья", termSanskrit: "авідйа", definition: "незнання." },
  { term: "Аґні", definition: "півбог вогню." },
  { term: "Аґніхотра яґʼя", termSanskrit: "аґніхотра-йаджн̃а", definition: "вогненне жертвопринесення, яке рекомендують Веди." },
  { term: "Акарма", definition: "«бездіяльність», тобто діяльність у відданому служінні Господеві, яка не викликає кармічних наслідків." },
  { term: "Ананда", termSanskrit: "а̄нанда", definition: "духовне блаженство." },
  { term: "Апара-пракріті", termSanskrit: "апара̄-пракр̣ті", definition: "матеріальна, нижча енергія." },
  { term: "Арій", termSanskrit: "а̄рйан", definition: "цивілізована людина, послідовник ведичної культури, метою життя якої є духовний поступ." },
  { term: "Арча-віґраха", termSanskrit: "арча̄-віґраха", definition: "прояв Господа у формі, створеній із матеріальних елементів – фарб, каменю, дерева, – якій поклоняються у храмі." },
  { term: "Арчана", definition: "ритуал поклоніння арча̄-віґрасі." },
  { term: "Асура", definition: "демон." },
  { term: "Атма", termSanskrit: "а̄тма̄", definition: "душа; може стосуватися тіла, розуму, інтелекту або Верховної сутності, але найчастіше вказує на індивідуальну духовну душу." },
  { term: "Аханкара", termSanskrit: "ахан̇ка̄ра", definition: "оманне его." },
  { term: "Ачарʼя", termSanskrit: "а̄ча̄рйа", definition: "той, хто вчить на власному прикладі; духовний учитель." },
  { term: "Ачінтья-бгедабгеда-таттва", termSanskrit: "ачінтйа-бгеда̄бгеда-таттва", definition: "учення Господа Чайтаньї про «незбагненну єдність та відмінність» Бога і Його енергій." },
  { term: "Ашрам", termSanskrit: "а̄ш́рам", definition: "кожний із чотирьох життєвих укладів у системі варнашрама-дгарми; духовна обитель, монастир." },
  { term: "Аштанґа-йоґа", termSanskrit: "ашт̣а̄н̇ґа-йоґа", definition: "«восьмиступеневий шлях» йоги." },
  { term: "Бгава", termSanskrit: "бга̄ва", definition: "екстаз; ступінь бгакті, який безпосередньо передує чистій любові до Господа." },
  { term: "Бгаґаван", termSanskrit: "Бгаґава̄н", definition: "«Той, хто володіє всіма багатствами», Верховний Господь." },
  { term: "Бгакта", definition: "відданий слуга Господа." },
  { term: "Бгакті-йоґа", definition: "воззʼєднання з Усевишнім за допомогою відданого служіння Йому." },
  { term: "Бгарата", definition: "цар у прадавній Індії, предок Пандавів." },
  { term: "Бгішма", termSanskrit: "Бгı̄шма", definition: "доблесний воєначальник, якого шанували як «діда» династії Куру." },
  { term: "Брахма", termSanskrit: "Брахма̄", definition: "першостворена жива істота; як уповноважений представник Господа Вішну, він створює всі форми життя у всесвіті." },
  { term: "Брахмаджйоті", definition: "духовне сяйво, яке випромінює трансцендентне тіло Господа Крішни." },
  { term: "Брахман", definition: "індивідуальна душа; безособистісний аспект Всевишнього; Верховний Бог-Особа." },
  { term: "Брахмачарʼя", termSanskrit: "брахмача̄рйа", definition: "перший ступінь духовного життя, за якого людина живе цнотливо і вчиться в духовного вчителя." },
  { term: "Буддгі-йоґа", definition: "синонім до бгакті-йоґи, вказує шлях найкращого використання інтелекту." },
  { term: "Вʼясадева", termSanskrit: "Вйа̄садева", definition: "укладач Вед, автор Пуран, Махабгарати й Веданта-сутри." },
  { term: "Вайкунтха", termSanskrit: "Ваікун̣т̣ха", definition: "вічна планета духовного світу." },
  { term: "Вайшнав", termSanskrit: "ваішн̣ава", definition: "відданий слуга Верховного Господа." },
  { term: "Ванапрастха", termSanskrit: "ва̄напрастха", definition: "третій ступінь духовного життя, коли людина, зрікшись сімейного життя, відвідує святі місця." },
  { term: "Варнашрама-дгарма", termSanskrit: "варн̣а̄ш́рама-дгарма", definition: "ведична система, яка ділить суспільство на чотири суспільні стани та чотири життєві уклади." },
  { term: "Веданта-сутра", termSanskrit: "Веда̄нта-сӯтра", definition: "філософсько-літературний шедевр Вʼясадеви з афоризмами, що відображають суть Упанішад." },
  { term: "Веди", definition: "чотири первісні священні писання: Ріґ, Сама, Атхарва і Яджур." },
  { term: "Відья", termSanskrit: "відйа̄", definition: "знання." },
  { term: "Вікарма", definition: "діяльність, яка суперечить приписам шастр, гріховна діяльність." },
  { term: "Вішну", termSanskrit: "Вішн̣у", definition: "Бог-Особа." },
  { term: "Вріндаван", termSanskrit: "Вр̣нда̄вана", definition: "трансцендентна обитель Господа Крішни." },
  { term: "Ґʼяна", termSanskrit: "джн̃а̄на", definition: "трансцендентне знання." },
  { term: "Ґʼяна-йоґа", termSanskrit: "джн̃а̄на-йоґа", definition: "спосіб духовного усвідомлення за допомогою філософських пошуків істини." },
  { term: "Ґандгарви", definition: "райські співаки й музиканти." },
  { term: "Ґолока", definition: "Крішналока, вічна обитель Господа Крішни." },
  { term: "Ґосвамі", termSanskrit: "ґосва̄мı̄", definition: "той, хто може повністю контролювати свої чуття; свамі." },
  { term: "Ґріхастха", termSanskrit: "ґр̣хастха", definition: "другий ступінь життєвого укладу, коли людина живе сімейним життям згідно з приписами шастр." },
  { term: "Ґуни", termSanskrit: "ґун̣и", definition: "три якості матеріальної природи: саттва-ґуна (добро), раджо-ґуна (пристрасть) і тамо-ґуна (невігластво)." },
  { term: "Ґуру", definition: "духовний учитель." },
  { term: "Демон", definition: "асура; людина, яка не дотримується приписів шастр і протиставляє себе Богу." },
  { term: "Джіва", termSanskrit: "джı̄ва", definition: "душа." },
  { term: "Дгарма", definition: "релігійні засади; вічне природне заняття людини – віддане служіння Господеві." },
  { term: "Духовний учитель", definition: "душа, яка реалізувала себе й наділена владою спрямовувати людей на шлях самореалізації." },
  { term: "Душа", definition: "крихітна часточка духовної енергії, невіддільна частка Господа." },
  { term: "Індра", definition: "цар усіх райських планет і бог дощу." },
  { term: "Йоґа", definition: "духовна дисципліна, яка звʼязує людину із Всевишнім." },
  { term: "Калі-юґа", termSanskrit: "Калі-йуґа", definition: "«епоха суперечок і лицемірства», яка розпочалася близько пʼяти тисяч років тому." },
  { term: "Карма", definition: "закон природи, згідно з яким матеріальна діяльність спричиняє наслідки." },
  { term: "Карма-йоґа", definition: "метод пізнання Господа через присвячення Йому плодів своєї діяльності." },
  { term: "Крішналока", termSanskrit: "Кр̣шн̣алока", definition: "найвища обитель Господа Крішни." },
  { term: "Ліла", termSanskrit: "лı̄ла̄", definition: "трансцендентна розвага Верховного Господа." },
  { term: "Мая", termSanskrit: "ма̄йа̄", definition: "ілюзія; енергія Господа, яка змушує живу істоту забути про свою духовну природу." },
  { term: "Мантра", definition: "трансцендентний звук або ведичний гімн." },
  { term: "Мукті", definition: "звільнення з рабства матеріального існування." },
  { term: "Нараяна", termSanskrit: "На̄ра̄йан̣а", definition: "чотирирука форма Господа Крішни, яка править на планетах Вайкунтхи." },
  { term: "Ом", termSanskrit: "ом̇", definition: "трансцендентний склад, який є звукове уособлення Абсолютної Істини." },
  { term: "Пандави", termSanskrit: "па̄н̣д̣ава", definition: "пʼять синів царя Панду: Юдгіштхіра, Бгіма, Арджуна, Накула і Сахадева." },
  { term: "Параматма", termSanskrit: "Парама̄тма̄", definition: "Наддуша; локалізований аспект Верховного Господа в серці кожної живої істоти." },
  { term: "Парампара", termSanskrit: "парампара̄", definition: "учнівська послідовність духовних учителів." },
  { term: "Пракріті", termSanskrit: "пракр̣ті", definition: "енергія або природа." },
  { term: "Прасад", termSanskrit: "праса̄дам", definition: "освячена їжа, що запропонована Господеві з любовʼю та відданістю." },
  { term: "Према", definition: "чиста спонтанна любов до Господа." },
  { term: "Пуруша", definition: "«той, хто насолоджується»; стосується як душі, так і Верховного Господа." },
  { term: "Рама", termSanskrit: "Ра̄ма", definition: "імʼя Господа Крішни, що означає «джерело насолод»; також Господь Рамачандра." },
  { term: "Самадгі", termSanskrit: "сама̄дгі", definition: "транс; стан цілковитого заглиблення у свідомість Бога." },
  { term: "Самсара", termSanskrit: "сам̇са̄ра", definition: "повторюваний цикл народжень і смертей у матеріальному світі." },
  { term: "Санатана-дгарма", termSanskrit: "сана̄тана-дгарма", definition: "вічна релігія – віддане служіння Господу." },
  { term: "Санкіртана", termSanskrit: "са̄н̇кı̄ртана", definition: "колективне прославляння Господа через оспівування Його святого імені." },
  { term: "Санньяса", termSanskrit: "саннйа̄са", definition: "четвертий життєвий уклад; цілковита відмова від світського життя заради духовного поступу." },
  { term: "Сач-чіт-ананда", termSanskrit: "сач-чід-а̄нанда", definition: "сповнений вічності, знання та блаженства." },
  { term: "Свамі", termSanskrit: "сва̄мı̄", definition: "той, хто може повністю контролювати свої чуття; санньясі." },
  { term: "Тапасья", termSanskrit: "тапа̄сйа̄", definition: "аскетизм; добровільне накладання на себе матеріальних обмежень." },
  { term: "Упанішади", definition: "сто вісім філософських трактатів у складі Вед." },
  { term: "Чайтанья Махапрабгу", termSanskrit: "Чаітанйа Маха̄прабгу", definition: "утілення Господа Крішни в Калі-юґу, який навчав людей оспівуванню святого імені Господа." },
  { term: "Шастра", termSanskrit: "ш́а̄стра", definition: "священне ведичне писання." },
  { term: "Шіва", termSanskrit: "Ш́іва", definition: "півбог, який керує матеріальною ґуною невігластва і знищує матеріальний космос." },
  { term: "Шрімад-Бгаґаватам", termSanskrit: "Ш́рı̄мад-Бга̄ґаватам", definition: "Пурана, яку записав Вʼясадева, щоб дати глибоке розуміння Господа Крішни." },
  { term: "Юґа", termSanskrit: "йуґа", definition: "«епоха»; є чотири юґи: Сатья, Трета, Двапара й Калі." },
  { term: "Яґʼя", termSanskrit: "йаджн̃а", definition: "жертвопринесення." },
];

// Get first letter (handling Ukrainian alphabet properly)
const getFirstLetter = (term: string): string => {
  const first = term.charAt(0).toUpperCase();
  // Handle 'Ґ' specially
  if (first === "Ґ") return "Ґ";
  return first;
};

// Ukrainian alphabet order
const UKRAINIAN_ALPHABET = [
  "А", "Б", "В", "Г", "Ґ", "Д", "Е", "Є", "Ж", "З", "И", "І", "Ї", "Й",
  "К", "Л", "М", "Н", "О", "П", "Р", "С", "Т", "У", "Ф", "Х", "Ц", "Ч",
  "Ш", "Щ", "Ь", "Ю", "Я"
];

interface GlossaryTermProps {
  term: GlossaryTermData;
  isExpanded: boolean;
  onToggle: () => void;
}

const GlossaryTerm = ({ term, isExpanded, onToggle }: GlossaryTermProps) => {
  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        className={cn(
          "w-full flex items-start justify-between py-3 px-2 text-left",
          "hover:bg-primary/5 transition-colors"
        )}
        onClick={onToggle}
      >
        <div className="flex-1">
          <span className="font-semibold italic text-foreground">
            {term.term}
          </span>
          {term.termSanskrit && (
            <span className="text-muted-foreground ml-2 text-sm">
              ({term.termSanskrit})
            </span>
          )}
          {isExpanded && (
            <span className="text-muted-foreground ml-2">—</span>
          )}
          {isExpanded && (
            <span className="text-foreground ml-1">{term.definition}</span>
          )}
        </div>
        <span className="ml-2 mt-1">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
      </button>
    </div>
  );
};

export const BookGlossary = ({
  bookTitle,
  bookSlug,
  cantoNumber,
  terms = DEFAULT_GLOSSARY_TERMS,
}: BookGlossaryProps) => {
  const { t } = useLanguage();
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups: { [letter: string]: GlossaryTermData[] } = {};

    terms.forEach((term) => {
      const letter = getFirstLetter(term.term);
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(term);
    });

    // Sort groups by Ukrainian alphabet order
    const sortedGroups: { [letter: string]: GlossaryTermData[] } = {};
    UKRAINIAN_ALPHABET.forEach((letter) => {
      if (groups[letter]) {
        sortedGroups[letter] = groups[letter].sort((a, b) =>
          a.term.localeCompare(b.term, "uk")
        );
      }
    });

    return sortedGroups;
  }, [terms]);

  // Available letters
  const availableLetters = useMemo(() => {
    return UKRAINIAN_ALPHABET.filter((letter) => groupedTerms[letter]);
  }, [groupedTerms]);

  const toggleTerm = (termName: string) => {
    setExpandedTerms((prev) => {
      const next = new Set(prev);
      if (next.has(termName)) {
        next.delete(termName);
      } else {
        next.add(termName);
      }
      return next;
    });
  };

  const scrollToLetter = (letter: string) => {
    const section = sectionRefs.current[letter];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BookReaderHeader
        bookTitle={bookTitle}
        bookSlug={bookSlug}
        cantoNumber={cantoNumber}
        introTitle={t("Глосарій", "Glossary")}
      />

      <div className="flex">
        {/* Main content */}
        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          <h1
            className="text-2xl font-bold text-center mb-8 text-foreground"
            style={{ fontFamily: "var(--font-primary)" }}
          >
            {t("Словничок імен і термінів", "Glossary of Names and Terms")}
          </h1>

          {/* Glossary sections */}
          <div className="space-y-6">
            {Object.entries(groupedTerms).map(([letter, letterTerms]) => (
              <div
                key={letter}
                ref={(el) => (sectionRefs.current[letter] = el)}
                className="scroll-mt-20"
              >
                <h2 className="text-2xl font-bold text-primary mb-4 sticky top-16 bg-background py-2 z-10">
                  {letter}
                </h2>
                <div className="pl-4">
                  {letterTerms.map((term) => (
                    <GlossaryTerm
                      key={term.term}
                      term={term}
                      isExpanded={expandedTerms.has(term.term)}
                      onToggle={() => toggleTerm(term.term)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* A-Z Index sidebar */}
        <aside className="hidden md:block w-12 sticky top-20 h-fit mr-4">
          <div className="flex flex-col items-center gap-0.5 py-4">
            {UKRAINIAN_ALPHABET.map((letter) => {
              const isAvailable = availableLetters.includes(letter);
              return (
                <button
                  key={letter}
                  className={cn(
                    "text-xs font-medium w-6 h-6 flex items-center justify-center rounded",
                    isAvailable
                      ? "text-primary hover:bg-primary/10 cursor-pointer"
                      : "text-muted-foreground/30 cursor-default"
                  )}
                  onClick={() => isAvailable && scrollToLetter(letter)}
                  disabled={!isAvailable}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile A-Z Index (fixed right) */}
        <aside className="md:hidden fixed right-1 top-1/2 -translate-y-1/2 z-30">
          <div className="flex flex-col items-center gap-0 py-2 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg">
            {availableLetters.map((letter) => (
              <button
                key={letter}
                className="text-[10px] font-medium w-5 h-4 flex items-center justify-center text-primary"
                onClick={() => scrollToLetter(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookGlossary;
