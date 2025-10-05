import { Header } from "@/components/Header";
import { Book, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState, useMemo, useEffect } from "react";
import { extractAllTerms, groupTermsByText, searchTerms, GlossaryTerm } from "@/utils/glossaryParser";
import { openExternal } from "@/lib/openExternal";

export const Glossary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("contains");
  const [translation, setTranslation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Handle URL search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, []);

  // Verse data - imported from VedaReader
  const verses = [
    {
      number: "ШБ 1.1.1",
      book: "Шрімад-Бгаґаватам",
      sanskrit: "ॐ नमो भगवते वासुदेवाय\nजन्माद्यस्य यतोऽन्वयादितरतश्चार्थेष्वभिज्ञ: स्वराट्\nतेने ब्रह्म हृदा य आदिकवये मुह्यन्ति यत्सूरय: ।\nतेजोवारिमृदां यथा विनिमयो यत्र त्रिसर्गोऽमृषा\nधाम्ना स्वेन सदा निरस्तकुहकं सत्यं परं धीमहि ॥ १ ॥",
      transliteration: "ом̇ намо бгаґавате ва̄судева̄йа\nджанма̄дй асйа йато 'нвайа̄д\nітараташ́ ча̄ртгешв абгіджн̃ах̣ свара̄т̣\nтене брахма хр̣да̄ йа а̄ді-кавайе\nмухйанті йат сӯрайах̣\nтеджо-ва̄рі-мр̣да̄м̇ йатга̄\nвінімайо йатра трі-сарго 'мр̣ша̄\nдга̄мна̄ свена сада̄ ніраста-\nкухакам̇ сатйам̇ парам̇ дгімахі",
      synonyms: "ом̇ — мій Господи; намах̣ — в шанобі схиляючись; бгаґавате — Богові-Особі; ва̄судева̄йа — Ва̄судеві (синові Васудеви), Господу Шрі Крішні; джанма-а̄ді — творення, підтримання та знищення; асйа — проявлених усесвітів; йатах̣ — що з Нього; анвайа̄т — прямо; ітаратах̣ — непрямо; ча — і; артгешу — цілях; абгіджн̃ах̣ — повністю свідомий; сва-ра̄т̣ — цілковито незалежний",
      translation: "О мій Господи! Я шанобливо схиляюся перед Тобою, Шрі Крішно, сину Васудеви, всепроникаючий Боже-Особо! Я медитую на Господа Шрі Крішну, тому що Він є АбсолютнаІстина, первинна причина всіх причин у творенні, підтриманні й знищенні проявлених усесвітів.",
      commentary: "Поклони Богові-Особі, Ва̄судеві, є прямим виразом шани Господу Шрі Крішні, божественному синові Васудеви та Девакі. В цьому самому вірші Шрі В'ясадева стверджує, що Шрі Крішна — це відначальний Бог-Особа, а всі інші є Його безпосередні та непрямі повні частки і частки часток."
    },
    {
      number: "БГ 1.1",
      book: "Бгаґавад-ґіта",
      sanskrit: "धृतराष्ट्र उवाच\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सव: ।\nमामका: पाण्डवाश्चैव किमकुर्वत सञ्जय ॥ १ ॥",
      transliteration: "дгр̣тара̄шт̣ра ува̄ча\nдгарма-кшетре куру-кшетре\nсамавета̄ йуйутсавах̣\nма̄мака̄х̣ па̄н̣д̣ава̄ш́ чаіва\nкім акурвата сан̃джайа",
      synonyms: "дгр̣тара̄шт̣рах̣ ува̄ча — цар Дгр̣ітара̄шт̣ра сказав; дгарма-кшетре — на місці поломництва; куру-кшетре — в місцевості під назвою Курукшетра; самавета̄х̣ — ті, що зібралися; йуйутсавах̣ — ті, що жадають бою; ма̄мака̄х̣ — моя партія (сини); па̄н̣д̣ава̄х̣ — сини Па̄н̣д̣у; ча — і; ева — неодмінно; кім — що; акурвата — вони зробили; сан̃джайа — о Сан̃джайо",
      translation: "Дгр̣тара̄шт̣ра сказав: О Сан̃джайо, що роблять мої сини й сини Па̄н̣д̣у, зібравшись в місці прощі на полі Курукшетра з наміром битися?",
      commentary: "Бгаґавад-ґі̄та̄ — це загальновідомий науковий теїстичний твір. Слово дгарма-кшетра (місце, де відправляються релігійні обряди) має особливе значення, тому що на полі бою Курукшетра Верховний Бог-Особа був на боці Арджуни."
    },
    {
      number: "ІШО 1",
      book: "Ш́рі̄ Īш́опанішад",
      sanskrit: "ईशावास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।\nतेन त्यक्तेन भुञ्जीथा मा गृध: कस्यस्विद्धनम् ॥ १ ॥",
      transliteration: "īша̄ва̄сйам ідам̇ сарвам̇\nйат кін̃ча джаґатйа̄м̇ джаґат\nтена тйактена бгун̃джітга̄\nма̄ ґр̣дгах̣ касйа свід дганам",
      synonyms: "īша̄ва̄сйам — що контролюється Господом; ідам — цей; сарвам — всесвіт; йат кін̃ча — все що завгодно; джаґатйа̄м джаґат — у всесвіті; тена — Ним; тйактена — наданим; бгун̃джітга̄ — ти повинен користуватися; ма̄ — ніколи; ґр̣дгах̣ — не повинен жадати; касйа світ — кого іншого; дганам — багатство",
      translation: "Усе живе й неживе у всесвіті контролюється і належить Господу. Тому слід користуватися лише тим, що необхідне, що виділене як твоя частка, і ніколи не посягати на нічиє інше.",
      commentary: "Ця мантра відкриває найголовнішу істину: весь всесвіт належить Верховному Господу Іша̄ (контролюючому), або Крішні. Тому кожен повинен приймати лише те, що йому необхідне для підтримання тіла та душі разом, і не повинен жадати більшого."
    }
  ];

  // Extract and process all terms from verses
  const allTerms = useMemo(() => extractAllTerms(verses), [verses]);
  
  // Group terms by their Sanskrit/Bengali text
  const groupedTerms = useMemo(() => groupTermsByText(allTerms), [allTerms]);
  
  // Get unique books for categories
  const categories = useMemo(() => {
    const books = [...new Set(allTerms.map(term => term.book))];
    const bookCounts: { [key: string]: number } = {};
    
    books.forEach(book => {
      bookCounts[book] = allTerms.filter(term => term.book === book).length;
    });
    
    return [
      { name: "Всі категорії", value: "all", count: allTerms.length },
      ...books.map(book => ({
        name: book,
        value: book,
        count: bookCounts[book]
      }))
    ];
  }, [allTerms]);

  // Filter and search terms
  const filteredAndSearchedTerms = useMemo(() => {
    let filtered = allTerms;
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(term => term.book === selectedCategory);
    }
    
    // Search in terms and meanings
    if (searchTerm || translation) {
      const searchQuery = searchTerm || translation;
      filtered = searchTerms(filtered, searchQuery, searchType as 'exact' | 'contains' | 'starts');
    }
    
    return filtered;
  }, [allTerms, selectedCategory, searchTerm, translation, searchType]);

  // Group filtered terms for display
  const displayTerms = useMemo(() => {
    const grouped = groupTermsByText(filteredAndSearchedTerms);
    return Object.keys(grouped).map(termText => ({
      term: termText,
      definitions: grouped[termText].map(term => ({
        meaning: term.meaning,
        reference: term.reference,
        link: term.link,
        book: term.book
      }))
    }));
  }, [filteredAndSearchedTerms]);

  const handleSearch = () => {
    // Search is handled automatically by useMemo
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="flex items-center space-x-3 mb-6">
              <Book className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Словник термінів</h1>
            </div>
            
            <div className="mb-4 text-sm text-muted-foreground">
              Знайдено {filteredAndSearchedTerms.length} термінів з {allTerms.length} проіндексованих
            </div>
            
            {/* Search Section */}
            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input 
                  placeholder="Введіть термін (санскрит/бенгалі)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Тип пошуку" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exact">Точне слово</SelectItem>
                    <SelectItem value="contains">Містить</SelectItem>
                    <SelectItem value="starts">Починається з</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="Пошук за перекладом..."
                  value={translation}
                  onChange={(e) => setTranslation(e.target.value)}
                />
              </div>
              <Button 
                className="w-full md:w-auto"
                onClick={handleSearch}
              >
                <Search className="w-4 h-4 mr-2" />
                Пошук
              </Button>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              {displayTerms.length > 0 ? (
                displayTerms.map((item, index) => (
                  <Card key={index} className="p-6">
                    <h2 className="text-2xl font-bold text-primary mb-4 font-mono">{item.term}</h2>
                    <div className="space-y-4">
                      {item.definitions.map((def, defIndex) => (
                        <div key={defIndex} className="border-l-2 border-muted pl-4">
                          <p className="text-foreground mb-2">{def.meaning}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">—</span>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-primary hover:underline"
                              onClick={() => openExternal(def.link)}
                            >
                              {def.reference}
                            </Button>
                            <Badge variant="outline" className="text-xs">
                              {def.book}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-muted-foreground">Термінів не знайдено</p>
                  {(searchTerm || translation) && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Спробуйте інший пошуковий запит або змініть тип пошуку
                    </p>
                  )}
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 hidden lg:block">
            <Card className="p-6 sticky top-8">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Ієрархія
              </h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <div key={index}>
                    <Button
                      variant={selectedCategory === category.value ? "secondary" : "ghost"}
                      className="w-full justify-between text-left"
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <span className="text-sm">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </Button>
                    {index < categories.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};