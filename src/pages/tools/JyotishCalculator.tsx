/**
 * Ведичний Джйотіш Калькулятор
 * Сторінка для розрахунку накшатри, раші та ведичного портрету
 */

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBirthDataForm, useVedicPortrait, useTodayPanchanga } from '@/hooks/useJyotish';
import { NAKSHATRAS, RASHIS, GRAHAS } from '@/data/jyotish';
import { toast } from 'sonner';
import {
  Star,
  Moon,
  Sun,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Calculator,
  Info,
  ChevronRight,
  Loader2,
  BookOpen,
  User,
  Heart,
  Briefcase,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Популярні локації
const POPULAR_LOCATIONS = [
  { name: 'Київ, Україна', lat: '50.4501', lng: '30.5234', tz: 'Europe/Kyiv' },
  { name: 'Львів, Україна', lat: '49.8397', lng: '24.0297', tz: 'Europe/Kyiv' },
  { name: 'Одеса, Україна', lat: '46.4825', lng: '30.7233', tz: 'Europe/Kyiv' },
  { name: 'Варшава, Польща', lat: '52.2297', lng: '21.0122', tz: 'Europe/Warsaw' },
  { name: 'Лондон, UK', lat: '51.5074', lng: '-0.1278', tz: 'Europe/London' },
  { name: 'Нью-Йорк, USA', lat: '40.7128', lng: '-74.0060', tz: 'America/New_York' },
  { name: 'Маяпур, Індія', lat: '23.4232', lng: '88.3880', tz: 'Asia/Kolkata' },
  { name: 'Вріндаван, Індія', lat: '27.5833', lng: '77.7000', tz: 'Asia/Kolkata' },
];

export default function JyotishCalculator() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('calculator');

  // Форма для дати народження
  const { formData, updateField, isValid, toBirthData, resetForm } = useBirthDataForm();

  // Отримуємо ведичний портрет
  const birthData = useMemo(() => (isValid ? toBirthData() : null), [isValid, toBirthData]);
  const { data: portrait, isLoading, error } = useVedicPortrait(birthData);

  // Сьогоднішня панчанга
  const { data: todayPanchanga, isLoading: isPanchangaLoading } = useTodayPanchanga();

  // Обробка вибору локації
  const handleLocationSelect = (locationName: string) => {
    const location = POPULAR_LOCATIONS.find(l => l.name === locationName);
    if (location) {
      updateField('latitude', location.lat);
      updateField('longitude', location.lng);
      updateField('timezone', location.tz);
      updateField('locationName', location.name);
    }
  };

  // Розрахувати
  const handleCalculate = () => {
    if (!isValid) {
      toast.error(t('Будь ласка, заповніть всі поля коректно', 'Please fill all fields correctly'));
      return;
    }
    toast.success(t('Розрахунок виконано!', 'Calculation complete!'));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Star className="w-8 h-8 text-primary" />
            {t('Ведичний Джйотіш', 'Vedic Jyotish')}
          </h1>
          <p className="text-muted-foreground">
            {t(
              'Накшатра, раші та ведичний портрет за датою народження',
              'Nakshatra, rashi, and Vedic portrait by birth date'
            )}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calculator">
              <Calculator className="w-4 h-4 mr-2" />
              {t('Калькулятор', 'Calculator')}
            </TabsTrigger>
            <TabsTrigger value="today">
              <Calendar className="w-4 h-4 mr-2" />
              {t('Сьогодні', 'Today')}
            </TabsTrigger>
            <TabsTrigger value="reference">
              <BookOpen className="w-4 h-4 mr-2" />
              {t('Довідник', 'Reference')}
            </TabsTrigger>
          </TabsList>

          {/* Калькулятор */}
          <TabsContent value="calculator" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Форма введення */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {t('Дата та час народження', 'Birth date and time')}
                  </CardTitle>
                  <CardDescription>
                    {t(
                      'Введіть точні дані для розрахунку ведичного портрету',
                      'Enter exact data to calculate Vedic portrait'
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Дата */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>{t('День', 'Day')}</Label>
                      <Input
                        type="number"
                        min="1"
                        max="31"
                        value={formData.day}
                        onChange={e => updateField('day', e.target.value)}
                        placeholder="15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Місяць', 'Month')}</Label>
                      <Input
                        type="number"
                        min="1"
                        max="12"
                        value={formData.month}
                        onChange={e => updateField('month', e.target.value)}
                        placeholder="8"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Рік', 'Year')}</Label>
                      <Input
                        type="number"
                        min="1900"
                        max="2100"
                        value={formData.year}
                        onChange={e => updateField('year', e.target.value)}
                        placeholder="1990"
                      />
                    </div>
                  </div>

                  {/* Час */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {t('Година', 'Hour')}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        max="23"
                        value={formData.hour}
                        onChange={e => updateField('hour', e.target.value)}
                        placeholder="12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('Хвилина', 'Minute')}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="59"
                        value={formData.minute}
                        onChange={e => updateField('minute', e.target.value)}
                        placeholder="00"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Локація */}
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {t('Місце народження', 'Birth place')}
                    </Label>
                    <Select onValueChange={handleLocationSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('Оберіть місто', 'Select city')} />
                      </SelectTrigger>
                      <SelectContent>
                        {POPULAR_LOCATIONS.map(loc => (
                          <SelectItem key={loc.name} value={loc.name}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          {t('Широта', 'Latitude')}
                        </Label>
                        <Input
                          type="text"
                          value={formData.latitude}
                          onChange={e => updateField('latitude', e.target.value)}
                          placeholder="50.4501"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          {t('Довгота', 'Longitude')}
                        </Label>
                        <Input
                          type="text"
                          value={formData.longitude}
                          onChange={e => updateField('longitude', e.target.value)}
                          placeholder="30.5234"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleCalculate}
                      disabled={!isValid || isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      {t('Розрахувати', 'Calculate')}
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      {t('Очистити', 'Clear')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Результат */}
              <div className="space-y-6">
                {portrait ? (
                  <>
                    {/* Накшатра */}
                    <Card className="border-primary/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Moon className="w-5 h-5 text-primary" />
                          {t('Накшатра народження', 'Birth Nakshatra')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="text-4xl font-bold text-primary">
                            {portrait.jyotish.janma_nakshatra.id}
                          </div>
                          <div>
                            <div className="text-xl font-semibold">
                              {language === 'uk'
                                ? portrait.jyotish.janma_nakshatra.name_ua
                                : portrait.jyotish.janma_nakshatra.name_en}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {portrait.jyotish.janma_nakshatra.name_sanskrit} •{' '}
                              {portrait.jyotish.janma_nakshatra.name_iast}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              {t('Божество:', 'Deity:')}
                            </span>{' '}
                            {language === 'uk'
                              ? portrait.jyotish.janma_nakshatra.deity_ua
                              : portrait.jyotish.janma_nakshatra.deity_en}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              {t('Планета:', 'Planet:')}
                            </span>{' '}
                            {GRAHAS.find(g => g.id === portrait.jyotish.janma_nakshatra.ruler_planet)
                              ?.[language === 'uk' ? 'name_ua' : 'name_en']}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              {t('Символ:', 'Symbol:')}
                            </span>{' '}
                            {language === 'uk'
                              ? portrait.jyotish.janma_nakshatra.symbol_ua
                              : portrait.jyotish.janma_nakshatra.symbol_en}
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              {t('Ґуна:', 'Guna:')}
                            </span>{' '}
                            <Badge variant="outline" className="text-xs">
                              {portrait.jyotish.janma_nakshatra.guna}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Раші */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Sun className="w-5 h-5 text-yellow-500" />
                          {t('Раші (Знаки)', 'Rashi (Signs)')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">
                              {t('Чандра раші (Місяць)', 'Chandra Rashi (Moon)')}
                            </div>
                            <div className="font-semibold">
                              {language === 'uk'
                                ? portrait.jyotish.chandra_rashi.name_ua
                                : portrait.jyotish.chandra_rashi.name_en}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'uk'
                                ? portrait.jyotish.chandra_rashi.western_name_ua
                                : portrait.jyotish.chandra_rashi.western_name_en}
                            </div>
                          </div>
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="text-xs text-muted-foreground mb-1">
                              {t('Сур\'я раші (Сонце)', 'Surya Rashi (Sun)')}
                            </div>
                            <div className="font-semibold">
                              {language === 'uk'
                                ? portrait.jyotish.surya_rashi.name_ua
                                : portrait.jyotish.surya_rashi.name_en}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {language === 'uk'
                                ? portrait.jyotish.surya_rashi.western_name_ua
                                : portrait.jyotish.surya_rashi.western_name_en}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Нумерологія */}
                    {portrait.numerology && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Calculator className="w-5 h-5 text-purple-500" />
                            {t('Нумерологія', 'Numerology')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center mb-4">
                            <div className="text-3xl font-bold font-mono text-primary">
                              {portrait.numerology.notation}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {t('Свідомість - Дія - Реалізація - Підсумок',
                                'Consciousness - Action - Realization - Life')}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <Link to="/tools/numerology">
                              <Button variant="outline" size="sm">
                                {t('Детальніше', 'More details')}
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Інтерпретація */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <Info className="w-5 h-5" />
                          {t('Інтерпретація', 'Interpretation')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm">
                          {language === 'uk'
                            ? portrait.jyotish.personality_ua
                            : portrait.jyotish.personality_en}
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                              <Heart className="w-4 h-4 text-green-500" />
                              {t('Сильні сторони', 'Strengths')}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {(language === 'uk'
                                ? portrait.jyotish.strengths_ua
                                : portrait.jyotish.strengths_en
                              ).slice(0, 5).map((trait, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              {t('Виклики', 'Challenges')}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {(language === 'uk'
                                ? portrait.jyotish.challenges_ua
                                : portrait.jyotish.challenges_en
                              ).slice(0, 4).map((trait, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-sm flex items-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4 text-blue-500" />
                            {t('Сприятливі сфери', 'Favorable careers')}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {(language === 'uk'
                              ? portrait.jyotish.career_ua
                              : portrait.jyotish.career_en
                            ).map((career, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {career}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="h-full flex items-center justify-center min-h-[400px]">
                    <CardContent className="text-center">
                      <Star className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {t(
                          'Введіть дату народження для розрахунку ведичного портрету',
                          'Enter birth date to calculate Vedic portrait'
                        )}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Сьогоднішня панчанга */}
          <TabsContent value="today">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t('Панчанга на сьогодні', 'Today\'s Panchanga')}
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPanchangaLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : todayPanchanga ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Тітхі */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('Тітхі', 'Tithi')}
                      </div>
                      <div className="font-semibold">
                        {language === 'uk'
                          ? todayPanchanga.tithi.current.name_ua
                          : todayPanchanga.tithi.current.name_en}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {todayPanchanga.tithi.current.paksha === 'shukla'
                          ? t('Шукла пакша', 'Shukla Paksha')
                          : t('Крішна пакша', 'Krishna Paksha')}
                      </div>
                    </div>

                    {/* Накшатра */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('Накшатра', 'Nakshatra')}
                      </div>
                      <div className="font-semibold">
                        {language === 'uk'
                          ? todayPanchanga.nakshatra.current.name_ua
                          : todayPanchanga.nakshatra.current.name_en}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {todayPanchanga.nakshatra.current.name_sanskrit}
                      </div>
                    </div>

                    {/* Йога */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('Йога', 'Yoga')}
                      </div>
                      <div className="font-semibold">
                        {language === 'uk'
                          ? todayPanchanga.yoga.current.name_ua
                          : todayPanchanga.yoga.current.name_en}
                      </div>
                      <Badge
                        variant={
                          todayPanchanga.yoga.current.nature === 'auspicious'
                            ? 'default'
                            : 'secondary'
                        }
                        className="text-xs mt-1"
                      >
                        {todayPanchanga.yoga.current.nature}
                      </Badge>
                    </div>

                    {/* Карана */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('Карана', 'Karana')}
                      </div>
                      <div className="font-semibold">
                        {language === 'uk'
                          ? todayPanchanga.karana.current.name_ua
                          : todayPanchanga.karana.current.name_en}
                      </div>
                    </div>

                    {/* Вара */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('Вара (день)', 'Vara (day)')}
                      </div>
                      <div className="font-semibold">
                        {language === 'uk'
                          ? todayPanchanga.vara.name_ua
                          : todayPanchanga.vara.name_en}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('Володар:', 'Ruler:')}{' '}
                        {GRAHAS.find(g => g.id === todayPanchanga.vara.ruler)
                          ?.[language === 'uk' ? 'name_ua' : 'name_en']}
                      </div>
                    </div>

                    {/* Раші Місяця */}
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <div className="text-xs text-muted-foreground mb-1">
                        {t('Місяць у', 'Moon in')}
                      </div>
                      <div className="font-semibold">
                        {language === 'uk'
                          ? todayPanchanga.rashi.moon.name_ua
                          : todayPanchanga.rashi.moon.name_en}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'uk'
                          ? todayPanchanga.rashi.moon.western_name_ua
                          : todayPanchanga.rashi.moon.western_name_en}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    {t('Не вдалося завантажити панчангу', 'Failed to load panchanga')}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Довідник */}
          <TabsContent value="reference" className="space-y-6">
            {/* Накшатри */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  {t('27 Накшатр', '27 Nakshatras')}
                </CardTitle>
                <CardDescription>
                  {t('Місячні доми ведичної астрології', 'Lunar mansions of Vedic astrology')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
                  {NAKSHATRAS.map(n => (
                    <div
                      key={n.id}
                      className="p-2 border rounded hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-5">{n.id}.</span>
                        <span className="font-medium">
                          {language === 'uk' ? n.name_ua : n.name_en}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground ml-7">
                        {n.name_sanskrit} • {GRAHAS.find(g => g.id === n.ruler_planet)?.name_ua}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Раші */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  {t('12 Раші', '12 Rashis')}
                </CardTitle>
                <CardDescription>
                  {t('Знаки зодіаку ведичної астрології', 'Zodiac signs of Vedic astrology')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {RASHIS.map(r => (
                    <div
                      key={r.id}
                      className="p-3 border rounded hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium">
                        {language === 'uk' ? r.name_ua : r.name_en}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'uk' ? r.western_name_ua : r.western_name_en}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {t('Володар:', 'Ruler:')}{' '}
                        {GRAHAS.find(g => g.id === r.ruler_planet)
                          ?.[language === 'uk' ? 'name_ua' : 'name_en']}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Планети */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {t('9 Ґрах (Планет)', '9 Grahas (Planets)')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {GRAHAS.map(g => (
                    <div
                      key={g.id}
                      className="p-3 border rounded hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium">
                        {language === 'uk' ? g.name_ua : g.name_en}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === 'uk' ? g.western_name_ua : g.western_name_en}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            g.nature === 'benefic'
                              ? 'default'
                              : g.nature === 'malefic'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {g.nature}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {language === 'uk' ? g.day_of_week_ua : g.day_of_week_en}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
