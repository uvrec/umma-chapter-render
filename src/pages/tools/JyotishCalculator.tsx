/**
 * Ведичний Джйотіш Калькулятор
 * Стиль NotePlan: функціональний мінімалізм
 */

import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBirthDataForm, useVedicPortrait, useTodayPanchanga } from '@/hooks/useJyotish';
import { NAKSHATRAS, RASHIS, GRAHAS } from '@/data/jyotish';
import { getAcharyasByNakshatra } from '@/data/jyotish/acharyas';
import { toast } from 'sonner';
import { Loader2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const POPULAR_LOCATIONS = [
  { name: 'Київ, Україна', lat: '50.4501', lng: '30.5234', tz: 'Europe/Kyiv' },
  { name: 'Львів, Україна', lat: '49.8397', lng: '24.0297', tz: 'Europe/Kyiv' },
  { name: 'Одеса, Україна', lat: '46.4825', lng: '30.7233', tz: 'Europe/Kyiv' },
  { name: 'Вюрцбург, Німеччина', lat: '49.7913', lng: '9.9534', tz: 'Europe/Berlin' },
  { name: 'Берлін, Німеччина', lat: '52.5200', lng: '13.4050', tz: 'Europe/Berlin' },
  { name: 'Варшава, Польща', lat: '52.2297', lng: '21.0122', tz: 'Europe/Warsaw' },
  { name: 'Лондон, UK', lat: '51.5074', lng: '-0.1278', tz: 'Europe/London' },
  { name: 'Нью-Йорк, USA', lat: '40.7128', lng: '-74.0060', tz: 'America/New_York' },
  { name: 'Маяпур, Індія', lat: '23.4232', lng: '88.3880', tz: 'Asia/Kolkata' },
  { name: 'Вріндаван, Індія', lat: '27.5833', lng: '77.7000', tz: 'Asia/Kolkata' },
];

export default function JyotishCalculator() {
  const { t, language } = useLanguage();
  const [activeSection, setActiveSection] = useState<'calculator' | 'today' | 'reference'>('calculator');

  const { formData, updateField, isValid, toBirthData, resetForm } = useBirthDataForm();
  const birthData = useMemo(() => (isValid ? toBirthData() : null), [isValid, toBirthData]);
  const { data: portrait, isLoading } = useVedicPortrait(birthData);
  const { data: todayPanchanga, isLoading: isPanchangaLoading } = useTodayPanchanga();

  const handleLocationSelect = (locationName: string) => {
    const location = POPULAR_LOCATIONS.find(l => l.name === locationName);
    if (location) {
      updateField('latitude', location.lat);
      updateField('longitude', location.lng);
      updateField('timezone', location.tz);
      updateField('locationName', location.name);
    }
  };

  const handleCalculate = () => {
    if (!isValid) {
      toast.error(t('Заповніть всі поля', 'Fill all fields'));
      return;
    }
    toast.success(t('Готово', 'Done'));
  };

  const sameNakshatraAcharyas = portrait
    ? getAcharyasByNakshatra(portrait.jyotish.janma_nakshatra.id)
    : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        {/* Заголовок */}
        <h1 className="text-3xl font-bold mb-2">
          {t('Ведичний Джйотіш', 'Vedic Jyotish')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('Накшатра та раші за датою народження', 'Nakshatra and rashi by birth date')}
        </p>

        {/* Навігація */}
        <nav className="flex gap-6 mb-8 text-sm border-b pb-2">
          <button
            onClick={() => setActiveSection('calculator')}
            className={activeSection === 'calculator' ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}
          >
            {t('Калькулятор', 'Calculator')}
          </button>
          <button
            onClick={() => setActiveSection('today')}
            className={activeSection === 'today' ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}
          >
            {t('Сьогодні', 'Today')}
          </button>
          <button
            onClick={() => setActiveSection('reference')}
            className={activeSection === 'reference' ? 'font-medium text-primary' : 'text-muted-foreground hover:text-foreground'}
          >
            {t('Довідник', 'Reference')}
          </button>
        </nav>

        {/* Калькулятор */}
        {activeSection === 'calculator' && (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Форма */}
            <div className="space-y-8">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-4">
                  {t('Дата народження', 'Birth date')}
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('День', 'Day')}</Label>
                    <Input
                      type="number"
                      min="1"
                      max="31"
                      value={formData.day}
                      onChange={e => updateField('day', e.target.value)}
                      placeholder="15"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('Місяць', 'Month')}</Label>
                    <Input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.month}
                      onChange={e => updateField('month', e.target.value)}
                      placeholder="8"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('Рік', 'Year')}</Label>
                    <Input
                      type="number"
                      min="1900"
                      max="2100"
                      value={formData.year}
                      onChange={e => updateField('year', e.target.value)}
                      placeholder="1990"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-4">
                  {t('Час народження', 'Birth time')}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('Година', 'Hour')}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={formData.hour}
                      onChange={e => updateField('hour', e.target.value)}
                      placeholder="12"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">{t('Хвилина', 'Minute')}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={formData.minute}
                      onChange={e => updateField('minute', e.target.value)}
                      placeholder="00"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-4">
                  {t('Місце народження', 'Birth place')}
                </h2>
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
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <Input
                    type="text"
                    value={formData.latitude}
                    onChange={e => updateField('latitude', e.target.value)}
                    placeholder={t('Широта', 'Latitude')}
                  />
                  <Input
                    type="text"
                    value={formData.longitude}
                    onChange={e => updateField('longitude', e.target.value)}
                    placeholder={t('Довгота', 'Longitude')}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleCalculate} disabled={!isValid || isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {t('Розрахувати', 'Calculate')}
                </Button>
                <Button variant="ghost" onClick={resetForm}>
                  {t('Очистити', 'Clear')}
                </Button>
              </div>
            </div>

            {/* Результат */}
            <div>
              {portrait ? (
                <div className="space-y-8">
                  {/* Накшатра */}
                  <div className="border-l-2 border-primary pl-4">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-light text-primary">
                        {portrait.jyotish.janma_nakshatra.id}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {language === 'uk'
                            ? portrait.jyotish.janma_nakshatra.name_uk
                            : portrait.jyotish.janma_nakshatra.name_en}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {portrait.jyotish.janma_nakshatra.name_sanskrit}
                        </p>
                      </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-4">
                      <dt className="text-muted-foreground">{t('Божество', 'Deity')}</dt>
                      <dd>{language === 'uk' ? portrait.jyotish.janma_nakshatra.deity_uk : portrait.jyotish.janma_nakshatra.deity_en}</dd>
                      <dt className="text-muted-foreground">{t('Планета', 'Planet')}</dt>
                      <dd>{GRAHAS.find(g => g.id === portrait.jyotish.janma_nakshatra.ruler_planet)?.[language === 'uk' ? 'name_ua' : 'name_en']}</dd>
                      <dt className="text-muted-foreground">{t('Символ', 'Symbol')}</dt>
                      <dd>{language === 'uk' ? portrait.jyotish.janma_nakshatra.symbol_uk : portrait.jyotish.janma_nakshatra.symbol_en}</dd>
                      <dt className="text-muted-foreground">{t('Ґуна', 'Guna')}</dt>
                      <dd className="capitalize">{portrait.jyotish.janma_nakshatra.guna}</dd>
                    </dl>
                  </div>

                  {/* Раші */}
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3">
                      {t('Раші', 'Rashi')}
                    </h3>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="border-l-2 border-muted pl-3">
                        <p className="text-xs text-muted-foreground mb-1">{t('Чандра (Місяць)', 'Chandra (Moon)')}</p>
                        <p className="font-medium">
                          {language === 'uk' ? portrait.jyotish.chandra_rashi.name_uk : portrait.jyotish.chandra_rashi.name_en}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'uk' ? portrait.jyotish.chandra_rashi.western_name_uk : portrait.jyotish.chandra_rashi.western_name_en}
                        </p>
                      </div>
                      <div className="border-l-2 border-muted pl-3">
                        <p className="text-xs text-muted-foreground mb-1">{t("Сур'я (Сонце)", 'Surya (Sun)')}</p>
                        <p className="font-medium">
                          {language === 'uk' ? portrait.jyotish.surya_rashi.name_uk : portrait.jyotish.surya_rashi.name_en}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {language === 'uk' ? portrait.jyotish.surya_rashi.western_name_uk : portrait.jyotish.surya_rashi.western_name_en}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Нумерологія */}
                  {portrait.numerology && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {t('Нумерологія', 'Numerology')}
                      </h3>
                      <p className="text-2xl font-mono tracking-wider">
                        {portrait.numerology.notation}
                      </p>
                      <Link to="/tools/numerology" className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2">
                        {t('Детальніше', 'More details')}
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}

                  {/* Ачар'ї з такою ж накшатрою */}
                  {sameNakshatraAcharyas.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        {t("Ачар'ї з такою ж накшатрою", 'Acharyas with same nakshatra')}
                      </h3>
                      <ul className="space-y-1">
                        {sameNakshatraAcharyas.map(a => (
                          <li key={a.id} className="text-sm">
                            <span className="font-medium">{language === 'uk' ? a.name_uk : a.name_en}</span>
                            <span className="text-muted-foreground"> — {language === 'uk' ? a.title_uk : a.title_en}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm py-12">
                  {t('Введіть дату народження', 'Enter birth date')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Сьогодні */}
        {activeSection === 'today' && (
          <div>
            <h2 className="text-xl font-semibold mb-1">
              {t('Панчанга', 'Panchanga')}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {new Date().toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>

            {isPanchangaLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : todayPanchanga ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-xs text-muted-foreground mb-1">{t('Тітхі', 'Tithi')}</p>
                  <p className="font-medium">
                    {language === 'uk' ? todayPanchanga.tithi.current.name_uk : todayPanchanga.tithi.current.name_en}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {todayPanchanga.tithi.current.paksha === 'shukla' ? t('Шукла пакша', 'Shukla') : t('Крішна пакша', 'Krishna')}
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-4">
                  <p className="text-xs text-muted-foreground mb-1">{t('Накшатра', 'Nakshatra')}</p>
                  <p className="font-medium">
                    {language === 'uk' ? todayPanchanga.nakshatra.current.name_uk : todayPanchanga.nakshatra.current.name_en}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {todayPanchanga.nakshatra.current.name_sanskrit}
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <p className="text-xs text-muted-foreground mb-1">{t('Йога', 'Yoga')}</p>
                  <p className="font-medium">
                    {language === 'uk' ? todayPanchanga.yoga.current.name_uk : todayPanchanga.yoga.current.name_en}
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <p className="text-xs text-muted-foreground mb-1">{t('Карана', 'Karana')}</p>
                  <p className="font-medium">
                    {language === 'uk' ? todayPanchanga.karana.current.name_uk : todayPanchanga.karana.current.name_en}
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <p className="text-xs text-muted-foreground mb-1">{t('Вара', 'Vara')}</p>
                  <p className="font-medium">
                    {language === 'uk' ? todayPanchanga.vara.name_uk : todayPanchanga.vara.name_en}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {GRAHAS.find(g => g.id === todayPanchanga.vara.ruler)?.[language === 'uk' ? 'name_ua' : 'name_en']}
                  </p>
                </div>
                <div className="border-l-2 border-muted pl-4">
                  <p className="text-xs text-muted-foreground mb-1">{t('Місяць у', 'Moon in')}</p>
                  <p className="font-medium">
                    {language === 'uk' ? todayPanchanga.rashi.moon.name_uk : todayPanchanga.rashi.moon.name_en}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'uk' ? todayPanchanga.rashi.moon.western_name_uk : todayPanchanga.rashi.moon.western_name_en}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                {t('Не вдалося завантажити', 'Failed to load')}
              </p>
            )}
          </div>
        )}

        {/* Довідник */}
        {activeSection === 'reference' && (
          <div className="space-y-12">
            {/* Накшатри */}
            <div>
              <h2 className="text-xl font-semibold mb-1">{t('27 Накшатр', '27 Nakshatras')}</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t('Місячні доми', 'Lunar mansions')}
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                {NAKSHATRAS.map(n => (
                  <div key={n.id} className="flex items-baseline gap-2">
                    <span className="text-muted-foreground w-5 text-right">{n.id}.</span>
                    <span>{language === 'uk' ? n.name_uk : n.name_en}</span>
                    <span className="text-muted-foreground text-xs">
                      {GRAHAS.find(g => g.id === n.ruler_planet)?.[language === 'uk' ? 'name_ua' : 'name_en']}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Раші */}
            <div>
              <h2 className="text-xl font-semibold mb-1">{t('12 Раші', '12 Rashis')}</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t('Знаки зодіаку', 'Zodiac signs')}
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                {RASHIS.map(r => (
                  <div key={r.id}>
                    <span className="font-medium">{language === 'uk' ? r.name_uk : r.name_en}</span>
                    <span className="text-muted-foreground"> — {language === 'uk' ? r.western_name_uk : r.western_name_en}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Планети */}
            <div>
              <h2 className="text-xl font-semibold mb-1">{t('9 Ґрах', '9 Grahas')}</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t('Планети', 'Planets')}
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                {GRAHAS.map(g => (
                  <div key={g.id}>
                    <span className="font-medium">{language === 'uk' ? g.name_uk : g.name_en}</span>
                    <span className="text-muted-foreground"> — {language === 'uk' ? g.western_name_uk : g.western_name_en}</span>
                    <span className="text-xs text-muted-foreground ml-2">({g.nature})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
