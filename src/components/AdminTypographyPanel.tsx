// Адмін панель для налаштування глобальних стилів типографіки
import { useState, useEffect } from "react";
import { Download, Upload, RotateCcw, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AdminTypographyConfig,
  BlockStyle,
  TypographyBlockType,
  DEFAULT_ADMIN_TYPOGRAPHY,
  AVAILABLE_FONTS,
  loadAdminTypography,
  saveAdminTypography,
  resetAdminTypography,
  exportAdminTypography,
  importAdminTypography,
  applyAdminTypographyToCSS,
} from "@/constants/adminTypography";
import { toast } from "@/hooks/use-toast";

interface AdminTypographyPanelProps {
  language: 'ua' | 'en';
}

export const AdminTypographyPanel = ({ language }: AdminTypographyPanelProps) => {
  const [config, setConfig] = useState<AdminTypographyConfig>(loadAdminTypography());
  const [activeTab, setActiveTab] = useState<TypographyBlockType>('sanskrit');

  const t = (ua: string, en: string) => language === 'ua' ? ua : en;

  const blockNames: Record<TypographyBlockType, { ua: string; en: string }> = {
    sanskrit: { ua: 'Санскрит / Деванагарі', en: 'Sanskrit / Devanagari' },
    transliteration: { ua: 'Транслітерація', en: 'Transliteration' },
    synonyms: { ua: 'Послівний переклад', en: 'Synonyms' },
    translation: { ua: 'Літературний переклад', en: 'Translation' },
    commentary: { ua: 'Пояснення', en: 'Purport' },
  };

  // Застосувати зміни до CSS при завантаженні
  useEffect(() => {
    applyAdminTypographyToCSS(config);
  }, [config]);

  const updateBlockStyle = (blockType: TypographyBlockType, updates: Partial<BlockStyle>) => {
    const newConfig = {
      ...config,
      [blockType]: { ...config[blockType], ...updates },
    };
    setConfig(newConfig);
    saveAdminTypography(newConfig);
    applyAdminTypographyToCSS(newConfig);
  };

  const handleReset = () => {
    if (confirm(t('Скинути ВСІ налаштування стилів до початкових значень?', 'Reset ALL style settings to defaults?'))) {
      resetAdminTypography();
      setConfig(DEFAULT_ADMIN_TYPOGRAPHY);
      applyAdminTypographyToCSS(DEFAULT_ADMIN_TYPOGRAPHY);
      toast({
        title: t('✅ Стилі скинуто', '✅ Styles reset'),
        description: t('Всі налаштування повернуто до початкових значень', 'All settings restored to defaults'),
      });
    }
  };

  const handleExport = () => {
    const json = exportAdminTypography();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'typography-config.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: t('📥 Експортовано', '📥 Exported'),
      description: t('Конфігурацію збережено в файл', 'Configuration saved to file'),
    });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const success = importAdminTypography(text);
        if (success) {
          const newConfig = loadAdminTypography();
          setConfig(newConfig);
          applyAdminTypographyToCSS(newConfig);
          toast({
            title: t('✅ Імпортовано', '✅ Imported'),
            description: t('Конфігурацію успішно завантажено', 'Configuration loaded successfully'),
          });
        } else {
          throw new Error('Invalid format');
        }
      } catch (error) {
        toast({
          title: t('❌ Помилка', '❌ Error'),
          description: t('Неможливо завантажити файл. Перевірте формат.', 'Cannot load file. Check format.'),
          variant: 'destructive',
        });
      }
    };
    input.click();
  };

  const renderBlockEditor = (blockType: TypographyBlockType) => {
    const style = config[blockType];
    const fontOptions = blockType === 'sanskrit'
      ? AVAILABLE_FONTS.sanskrit
      : blockType === 'transliteration'
      ? AVAILABLE_FONTS.transliteration
      : AVAILABLE_FONTS.text;

    return (
      <div className="space-y-6 p-4">
        {/* Font Family */}
        <div className="space-y-2">
          <Label>{t('Шрифт', 'Font Family')}</Label>
          <Select
            value={style.fontFamily}
            onValueChange={(value) => updateBlockStyle(blockType, { fontFamily: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontOptions.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size Multiplier */}
        <div className="space-y-2">
          <Label>{t('Розмір (множник)', 'Size (multiplier)')}: {style.fontSize}x</Label>
          <Input
            type="range"
            min="0.5"
            max="2.5"
            step="0.1"
            value={style.fontSize}
            onChange={(e) => updateBlockStyle(blockType, { fontSize: parseFloat(e.target.value) })}
          />
          <p className="text-xs text-muted-foreground">
            {t('1.0 = базовий розмір, 1.5 = 150% від базового', '1.0 = base size, 1.5 = 150% of base')}
          </p>
        </div>

        {/* Font Weight */}
        <div className="space-y-2">
          <Label>{t('Товщина шрифта', 'Font Weight')}: {style.fontWeight}</Label>
          <Select
            value={String(style.fontWeight)}
            onValueChange={(value) => updateBlockStyle(blockType, { fontWeight: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="300">300 (Light)</SelectItem>
              <SelectItem value="400">400 (Regular)</SelectItem>
              <SelectItem value="500">500 (Medium)</SelectItem>
              <SelectItem value="600">600 (Semibold)</SelectItem>
              <SelectItem value="700">700 (Bold)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Font Style */}
        <div className="space-y-2">
          <Label>{t('Стиль шрифта', 'Font Style')}</Label>
          <Select
            value={style.fontStyle}
            onValueChange={(value: 'normal' | 'italic') => updateBlockStyle(blockType, { fontStyle: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">{t('Звичайний', 'Normal')}</SelectItem>
              <SelectItem value="italic">{t('Курсив', 'Italic')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <Label>{t('Міжбуквений інтервал', 'Letter Spacing')}: {style.letterSpacing}</Label>
          <Input
            type="range"
            min="-0.05"
            max="0.2"
            step="0.01"
            value={parseFloat(style.letterSpacing) || 0}
            onChange={(e) => updateBlockStyle(blockType, { letterSpacing: `${e.target.value}em` })}
          />
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <Label>{t('Міжряддя', 'Line Height')}: {style.lineHeight}</Label>
          <Input
            type="range"
            min="1.0"
            max="2.5"
            step="0.05"
            value={style.lineHeight}
            onChange={(e) => updateBlockStyle(blockType, { lineHeight: parseFloat(e.target.value) })}
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label>{t('Колір тексту (HSL)', 'Text Color (HSL)')}</Label>
          <Input
            type="text"
            value={style.color}
            onChange={(e) => updateBlockStyle(blockType, { color: e.target.value })}
            placeholder="hsl(var(--foreground))"
          />
          <p className="text-xs text-muted-foreground">
            {t('Використовуйте CSS змінні теми: hsl(var(--foreground)) або hsl(var(--muted-foreground))',
               'Use theme CSS variables: hsl(var(--foreground)) or hsl(var(--muted-foreground))')}
          </p>
        </div>

        {/* Preview */}
        <div className="mt-6 border rounded-lg p-4 bg-muted/30">
          <Label className="text-xs text-muted-foreground mb-2 block">{t('Попередній перегляд', 'Preview')}</Label>
          <p
            style={{
              fontFamily: style.fontFamily,
              fontSize: `${style.fontSize}em`,
              fontWeight: style.fontWeight,
              fontStyle: style.fontStyle,
              color: style.color,
              letterSpacing: style.letterSpacing,
              lineHeight: style.lineHeight,
            }}
          >
            {blockType === 'sanskrit' && 'ॐ नमो भगवते वासुदेवाय'}
            {blockType === 'transliteration' && 'oṁ namo bhagavate vāsudevāya'}
            {blockType === 'synonyms' && 'oṁ — звук Om; namaḥ — вклоніння'}
            {blockType === 'translation' && 'О мій Господи, Верховна Особистість Бога...'}
            {blockType === 'commentary' && 'Це пояснення до вірша показує глибоке значення...'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Paintbrush className="h-5 w-5" />
            {t('Глобальні стилі типографіки', 'Global Typography Styles')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('Налаштування стилів для всього сайту (тільки для адміністраторів)',
               'Site-wide style settings (admin only)')}
          </p>
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          {t('Експорт', 'Export')}
        </Button>
        <Button variant="outline" size="sm" onClick={handleImport} className="gap-2">
          <Upload className="h-4 w-4" />
          {t('Імпорт', 'Import')}
        </Button>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          {t('Скинути все', 'Reset All')}
        </Button>
      </div>

      <Separator />

      {/* Block Type Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TypographyBlockType)}>
        <TabsList className="grid w-full grid-cols-5">
          {(Object.keys(blockNames) as TypographyBlockType[]).map((blockType) => (
            <TabsTrigger key={blockType} value={blockType} className="text-xs">
              {language === 'ua' ? blockNames[blockType].ua : blockNames[blockType].en}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(blockNames) as TypographyBlockType[]).map((blockType) => (
          <TabsContent key={blockType} value={blockType}>
            {renderBlockEditor(blockType)}
          </TabsContent>
        ))}
      </Tabs>

      <Separator />

      {/* Info */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
        💡 {t(
          'Ці налаштування застосовуються до ВСІХ віршів на сайті. Зміни зберігаються автоматично.',
          'These settings apply to ALL verses on the site. Changes are saved automatically.'
        )}
      </div>
    </div>
  );
};
