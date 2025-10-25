import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { normalizeTransliteration } from '@/utils/text/translitNormalize';

export default function TransliterationTool() {
  const { language, t } = useLanguage();
  const [ua, setUa] = useState('');
  const [en, setEn] = useState('');

  const handleNormalize = () => {
    setUa((v) => normalizeTransliteration(v));
    setEn((v) => normalizeTransliteration(v));
  };

  const handleSwap = () => {
    setUa(en);
    setEn(ua);
  };

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">{t('Інструмент транслітерації', 'Transliteration Tool')}</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">UA</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copy(ua)}>{t('Копіювати', 'Copy')}</Button>
              </div>
            </div>
            <Textarea rows={16} value={ua} onChange={(e) => setUa(e.target.value)} placeholder={t('Вставте транслітерацію українською…', 'Paste Ukrainian transliteration…')} />
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">EN</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copy(en)}>{t('Копіювати', 'Copy')}</Button>
              </div>
            </div>
            <Textarea rows={16} value={en} onChange={(e) => setEn(e.target.value)} placeholder={t('Вставте транслітерацію англійською…', 'Paste English transliteration…')} />
          </Card>
        </div>

        <div className="mt-4 flex gap-2">
          <Button onClick={handleNormalize}>{t('Нормалізувати діакритику', 'Normalize diacritics')}</Button>
          <Button variant="outline" onClick={handleSwap}>{t('Поміняти місцями', 'Swap')}</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
