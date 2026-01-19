/**
 * Оглядач Раг - Індійська класична музика
 * Raga Explorer - Indian Classical Music
 */

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  useFilteredRagas,
  useRagaFiltersState,
  useRagaFilterOptions,
  useCurrentTimeRagas,
  useThaats,
  useSimilarRagas,
} from '@/hooks/useRagas';
import {
  Raga,
  formatRagaTime,
  formatJati,
  SVARA_NAMES_UA,
  SVARA_TO_WESTERN,
  getRagaNotes,
  TIME_NAMES_UA,
  JATI_NAMES_UA,
} from '@/types/raga';
import {
  Music,
  Search,
  Clock,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  Filter,
  X,
  ChevronRight,
  Piano,
  ListMusic,
  BookOpen,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Info,
  Loader2,
} from 'lucide-react';

// Компонент клавіатури
function PianoKeyboard({
  highlightedNotes,
  className = '',
}: {
  highlightedNotes: Set<number>;
  className?: string;
}) {
  // Клавіші однієї октави (0-11 = C до B)
  const whiteKeys = [0, 2, 4, 5, 7, 9, 11]; // C D E F G A B
  const blackKeys = [1, 3, 6, 8, 10]; // C# D# F# G# A#
  const blackKeyPositions = [1, 2, 4, 5, 6]; // Позиції чорних клавіш відносно білих

  const svaraLabels: Record<number, string> = {
    0: 'S',
    1: 'r',
    2: 'R',
    3: 'g',
    4: 'G',
    5: 'm',
    6: 'M',
    7: 'P',
    8: 'd',
    9: 'D',
    10: 'n',
    11: 'N',
  };

  return (
    <div className={`relative h-32 ${className}`}>
      {/* Білі клавіші */}
      <div className="flex h-full gap-0.5">
        {whiteKeys.map((note, index) => (
          <div
            key={note}
            className={`
              relative flex-1 rounded-b-md border border-gray-300
              flex items-end justify-center pb-2
              transition-colors duration-150
              ${highlightedNotes.has(note)
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-gray-600'
              }
            `}
          >
            <span className="text-xs font-medium">{svaraLabels[note]}</span>
          </div>
        ))}
      </div>

      {/* Чорні клавіші */}
      <div className="absolute top-0 left-0 right-0 h-[60%] flex">
        {whiteKeys.map((_, index) => {
          const blackNote = blackKeys.find((_, bi) => blackKeyPositions[bi] === index + 1);
          if (blackNote === undefined) return <div key={index} className="flex-1" />;

          return (
            <div key={index} className="flex-1 relative">
              <div
                className={`
                  absolute right-0 translate-x-1/2 w-[60%] h-full
                  rounded-b-md z-10
                  flex items-end justify-center pb-1
                  transition-colors duration-150
                  ${highlightedNotes.has(blackNote)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-800 text-gray-400'
                  }
                `}
              >
                <span className="text-[10px] font-medium">{svaraLabels[blackNote]}</span>
              </div>
            </div>
          );
        })}
        <div className="flex-1" /> {/* Останній пробіл */}
      </div>
    </div>
  );
}

// Компонент відображення арохи/аварохи
function ScaleDisplay({
  notes,
  label,
  icon: Icon,
}: {
  notes: string[];
  label: string;
  icon: React.ElementType;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {notes.map((note, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="font-mono text-sm"
          >
            {note}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// Компонент деталей раги
function RagaDetails({
  raga,
  ragaName,
  onClose,
}: {
  raga: Raga & { name: string };
  ragaName: string;
  onClose: () => void;
}) {
  const { t, language } = useLanguage();
  const similarRagas = useSimilarRagas(ragaName);
  const highlightedNotes = useMemo(() => getRagaNotes(raga), [raga]);

  const thaatInfo = useThaats().find(th => th.name === raga.thaat);

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{raga.name}</h2>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <Badge variant="outline">{raga.thaat}</Badge>
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {formatRagaTime(raga.time, language)}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Клавіатура */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Piano className="w-4 h-4" />
            {t('Ноти раги', 'Raga Notes')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PianoKeyboard highlightedNotes={highlightedNotes} />
        </CardContent>
      </Card>

      {/* Ароха та Авароха */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <ScaleDisplay
              notes={raga.aaroha}
              label={t('Ароха (сходження)', 'Aaroha (ascending)')}
              icon={ArrowUp}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <ScaleDisplay
              notes={raga.avaroha}
              label={t('Авароха (спадання)', 'Avaroha (descending)')}
              icon={ArrowDown}
            />
          </CardContent>
        </Card>
      </div>

      {/* Пакад */}
      {raga.pakad && raga.pakad.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Music className="w-4 h-4" />
              {t('Пакад (характерна фраза)', 'Pakad (characteristic phrase)')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {raga.pakad.map((note, i) => (
                <Badge key={i} variant="outline" className="font-mono">
                  {note}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Характеристики */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground">
            {t('Ваді (головна нота)', 'Vadi (king note)')}
          </div>
          <div className="font-semibold font-mono text-lg">{raga.vadi}</div>
          <div className="text-xs text-muted-foreground">
            {SVARA_NAMES_UA[raga.vadi] || raga.vadi}
          </div>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground">
            {t('Самваді (друга нота)', 'Samvadi (queen note)')}
          </div>
          <div className="font-semibold font-mono text-lg">{raga.samvadi}</div>
          <div className="text-xs text-muted-foreground">
            {SVARA_NAMES_UA[raga.samvadi] || raga.samvadi}
          </div>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground">
            {t('Джаті (тип)', 'Jati (type)')}
          </div>
          <div className="font-semibold text-sm">{formatJati(raga.jati, language)}</div>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground">
            {t('Час виконання', 'Performance time')}
          </div>
          <div className="font-semibold text-sm">{formatRagaTime(raga.time, language)}</div>
        </div>
      </div>

      {/* Інформація про тхаат */}
      {thaatInfo && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              {t('Тхаат', 'Thaat')}: {thaatInfo.name_uk}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {language === 'uk' ? thaatInfo.description_uk : thaatInfo.description_en}
            </p>
            <div className="flex flex-wrap gap-1">
              {thaatInfo.svaras.map((svara, i) => (
                <Badge key={i} variant="secondary" className="font-mono">
                  {svara}
                </Badge>
              ))}
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">{t('Настрій:', 'Mood:')}</span>{' '}
              {language === 'uk' ? thaatInfo.mood_uk : thaatInfo.mood_en}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Схожі раги */}
      {similarRagas.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              {t('Схожі раги', 'Similar ragas')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {similarRagas.map(r => (
                <Badge key={r.name} variant="outline" className="cursor-pointer">
                  {r.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Іконка часу дня
function TimeIcon({ time }: { time: string }) {
  if (time.includes('Morning') || time.includes('3-6') || time.includes('4-7') || time.includes('6-9')) {
    return <Sunrise className="w-4 h-4 text-orange-500" />;
  }
  if (time.includes('Afternoon') || time.includes('9-12') || time.includes('12-3')) {
    return <Sun className="w-4 h-4 text-yellow-500" />;
  }
  if (time.includes('Evening') || time.includes('6-9')) {
    return <Sunset className="w-4 h-4 text-orange-600" />;
  }
  return <Moon className="w-4 h-4 text-indigo-500" />;
}

export default function RagaExplorer() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('explorer');
  const [selectedRaga, setSelectedRaga] = useState<string | null>(null);

  // Фільтри
  const { filters, updateFilter, resetFilters, hasActiveFilters } = useRagaFiltersState();
  const filterOptions = useRagaFilterOptions();
  const { ragas, isLoading, total } = useFilteredRagas(filters);
  const currentTimeRagas = useCurrentTimeRagas();
  const thaats = useThaats();

  // Знаходимо вибрану рагу
  const selectedRagaData = useMemo(() => {
    if (!selectedRaga) return null;
    return ragas.find(r => r.name === selectedRaga) || null;
  }, [selectedRaga, ragas]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Music className="w-8 h-8 text-primary" />
            {t('Раґа Експлорер', 'Raga Explorer')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              `${total} раг індійської класичної музики`,
              `${total} ragas of Indian classical music`
            )}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="explorer">
              <ListMusic className="w-4 h-4 mr-2" />
              {t('Раги', 'Ragas')}
            </TabsTrigger>
            <TabsTrigger value="now">
              <Clock className="w-4 h-4 mr-2" />
              {t('Зараз', 'Now')}
            </TabsTrigger>
            <TabsTrigger value="thaats">
              <BookOpen className="w-4 h-4 mr-2" />
              {t('Тхаати', 'Thaats')}
            </TabsTrigger>
          </TabsList>

          {/* Оглядач раг */}
          <TabsContent value="explorer" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Ліва панель - список */}
              <div className="lg:col-span-1 space-y-4">
                {/* Пошук та фільтри */}
                <Card>
                  <CardContent className="pt-4 space-y-4">
                    {/* Пошук */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder={t('Пошук раги...', 'Search raga...')}
                        className="pl-10"
                        value={filters.search || ''}
                        onChange={e => updateFilter('search', e.target.value)}
                      />
                    </div>

                    {/* Фільтр по тхаату */}
                    <Select
                      value={filters.thaat || ''}
                      onValueChange={v => updateFilter('thaat', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Тхаат', 'Thaat')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('Всі тхаати', 'All thaats')}</SelectItem>
                        {filterOptions.thaats.map(thaat => (
                          <SelectItem key={thaat} value={thaat}>
                            {thaat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Фільтр по часу */}
                    <Select
                      value={filters.time || ''}
                      onValueChange={v => updateFilter('time', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('Час виконання', 'Performance time')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{t('Будь-який час', 'Any time')}</SelectItem>
                        {filterOptions.times.map(time => (
                          <SelectItem key={time} value={time}>
                            {TIME_NAMES_UA[time] || time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Скинути фільтри */}
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="w-full"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t('Скинути фільтри', 'Reset filters')}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Список раг */}
                <Card className="overflow-hidden">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm">
                      {t('Знайдено', 'Found')}: {ragas.length}
                    </CardTitle>
                  </CardHeader>
                  <ScrollArea className="h-[500px]">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="divide-y">
                        {ragas.map(raga => (
                          <button
                            key={raga.name}
                            onClick={() => setSelectedRaga(raga.name)}
                            className={`
                              w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors
                              ${selectedRaga === raga.name ? 'bg-primary/10' : ''}
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{raga.name}</div>
                              <TimeIcon time={raga.time} />
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {raga.thaat}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {raga.vadi} / {raga.samvadi}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </Card>
              </div>

              {/* Права панель - деталі */}
              <div className="lg:col-span-2">
                {selectedRagaData ? (
                  <RagaDetails
                    raga={selectedRagaData}
                    ragaName={selectedRaga!}
                    onClose={() => setSelectedRaga(null)}
                  />
                ) : (
                  <Card className="h-full flex items-center justify-center min-h-[500px]">
                    <CardContent className="text-center">
                      <Music className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {t(
                          'Оберіть рагу зі списку для перегляду деталей',
                          'Select a raga from the list to view details'
                        )}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Раги для поточного часу */}
          <TabsContent value="now">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {t('Рекомендовані раги зараз', 'Recommended ragas now')}
                </CardTitle>
                <CardDescription>
                  {t(
                    'Раги, які традиційно виконують у цей час доби',
                    'Ragas traditionally performed at this time of day'
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentTimeRagas.length > 0 ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {currentTimeRagas.map(raga => (
                      <button
                        key={raga.name}
                        onClick={() => {
                          setSelectedRaga(raga.name);
                          setActiveTab('explorer');
                        }}
                        className="p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="font-semibold">{raga.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {raga.thaat}
                        </div>
                        <div className="flex items-center gap-1 mt-2 text-xs">
                          <TimeIcon time={raga.time} />
                          <span>{formatRagaTime(raga.time, language)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t('Немає раг для поточного часу', 'No ragas for current time')}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Довідник тхаатів */}
          <TabsContent value="thaats" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {thaats.map(thaat => (
                <Card key={thaat.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      {thaat.name_uk}
                      <span className="text-sm font-normal text-muted-foreground">
                        ({thaat.name})
                      </span>
                    </CardTitle>
                    <CardDescription>{thaat.name_devanagari}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {language === 'uk' ? thaat.description_uk : thaat.description_en}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {thaat.svaras.map((svara, i) => (
                        <Badge key={i} variant="secondary" className="font-mono">
                          {svara}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">{t('Настрій:', 'Mood:')}</span>{' '}
                      {language === 'uk' ? thaat.mood_uk : thaat.mood_en}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateFilter('thaat', thaat.name);
                        setActiveTab('explorer');
                      }}
                    >
                      {t('Показати раги', 'Show ragas')}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
