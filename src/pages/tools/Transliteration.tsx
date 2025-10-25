import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { convertIASTtoUkrainian } from "@/utils/textNormalizer";
import { normalizeTransliteration } from "@/utils/text/translitNormalize";

type TranslitMode = "iast" | "devanagari" | "bengali";
type TextType = "shloka" | "purport";

/**
 * Транслітератор санскриту
 * - IAST латиниця → українська кирилиця з діакритикою
 * - Деванагарі → IAST → українська (через проміжний крок)
 * - Бенгалі → IAST → українська (через проміжний крок)
 */
export default function TransliterationTool() {
  const { language, t } = useLanguage();

  // Стан
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<TranslitMode>("iast");
  const [textType, setTextType] = useState<TextType>("shloka");

  /**
   * Деванагарі → IAST (спрощена конвертація)
   * Для точної конвертації використовуйте спеціалізовану бібліотеку
   */
  const devanagariToIAST = (text: string): string => {
    // Базова мапа (можна розширити)
    const map: Record<string, string> = {
      अ: "a",
      आ: "ā",
      इ: "i",
      ई: "ī",
      उ: "u",
      ऊ: "ū",
      ऋ: "ṛ",
      ॠ: "ṝ",
      ए: "e",
      ओ: "o",
      ऐ: "ai",
      औ: "au",
      क: "k",
      ख: "kh",
      ग: "g",
      घ: "gh",
      ङ: "ṅ",
      च: "c",
      छ: "ch",
      ज: "j",
      झ: "jh",
      ञ: "ñ",
      ट: "ṭ",
      ठ: "ṭh",
      ड: "ḍ",
      ढ: "ḍh",
      ण: "ṇ",
      त: "t",
      थ: "th",
      द: "d",
      ध: "dh",
      न: "n",
      प: "p",
      फ: "ph",
      ब: "b",
      भ: "bh",
      म: "m",
      य: "y",
      र: "r",
      ल: "l",
      व: "v",
      श: "ś",
      ष: "ṣ",
      स: "s",
      ह: "h",
      "ं": "ṁ",
      "ः": "ḥ",
      "्": "",
      // Матри
      "ा": "ā",
      "ि": "i",
      "ी": "ī",
      "ु": "u",
      "ू": "ū",
      "ृ": "ṛ",
      "े": "e",
      "ो": "o",
      "ै": "ai",
      "ौ": "au",
    };

    let result = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      result += map[char] || char;
    }
    return result;
  };

  /**
   * Бенгалі → IAST (спрощена конвертація)
   */
  const bengaliToIAST = (text: string): string => {
    const map: Record<string, string> = {
      অ: "a",
      আ: "ā",
      ই: "i",
      ঈ: "ī",
      উ: "u",
      ঊ: "ū",
      ঋ: "ṛ",
      এ: "e",
      ও: "o",
      ঐ: "ai",
      ঔ: "au",
      ক: "k",
      খ: "kh",
      গ: "g",
      ঘ: "gh",
      ঙ: "ṅ",
      চ: "c",
      ছ: "ch",
      জ: "j",
      ঝ: "jh",
      ঞ: "ñ",
      ট: "ṭ",
      ঠ: "ṭh",
      ড: "ḍ",
      ঢ: "ḍh",
      ণ: "ṇ",
      ত: "t",
      থ: "th",
      দ: "d",
      ধ: "dh",
      ন: "n",
      প: "p",
      ফ: "ph",
      ব: "b",
      ভ: "bh",
      ম: "m",
      য: "y",
      র: "r",
      ল: "l",
      ব: "v",
      শ: "ś",
      ষ: "ṣ",
      স: "s",
      হ: "h",
      "ং": "ṁ",
      "ঃ": "ḥ",
      "্": "",
      // Матри
      "া": "ā",
      "ি": "i",
      "ী": "ī",
      "ু": "u",
      "ূ": "ū",
      "ৃ": "ṛ",
      "ে": "e",
      "ো": "o",
      "ৈ": "ai",
      "ৌ": "au",
    };

    let result = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      result += map[char] || char;
    }
    return result;
  };

  /**
   * Обробка капіталізації згідно типу тексту
   */
  const applyCapitalization = (text: string, type: TextType): string => {
    if (type === "shloka") {
      // У шлоках НЕМАЄ великих літер взагалі!
      return text.toLowerCase();
    } else {
      // У поясненні: велика після крапки
      let result = text.charAt(0).toUpperCase() + text.slice(1);
      result = result.replace(/\.\s+([а-яґєіїa-zа̄ӯ])/g, (match, letter) => {
        return ". " + letter.toUpperCase();
      });
      return result;
    }
  };

  /**
   * Головна функція транслітерації
   */
  const handleTransliterate = () => {
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }

    let intermediate = inputText;

    // Крок 1: Конвертація в IAST (якщо потрібно)
    if (mode === "devanagari") {
      intermediate = devanagariToIAST(inputText);
    } else if (mode === "bengali") {
      intermediate = bengaliToIAST(inputText);
    }

    // Крок 2: IAST → українська
    let result = convertIASTtoUkrainian(intermediate);

    // Крок 3: Нормалізація діакритики
    result = normalizeTransliteration(result);

    // Крок 4: Капіталізація
    result = applyCapitalization(result, textType);

    setOutputText(result);
  };

  // Копіювання в буфер
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Не вдалося скопіювати", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t("Транслітератор санскриту", "Sanskrit Transliterator")}
          </h1>
          <p className="text-muted-foreground">
            {t("Конвертація в українську кирилицю з діакритикою", "Convert to Ukrainian Cyrillic with diacritics")}
          </p>
        </div>

        {/* Налаштування */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mode">{t("Режим транслітерації", "Transliteration mode")}</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as TranslitMode)}>
                <SelectTrigger id="mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iast">{t("Латиниця (IAST) → Кирилиця", "Latin (IAST) → Cyrillic")}</SelectItem>
                  <SelectItem value="devanagari">{t("Деванагарі → Кирилиця", "Devanagari → Cyrillic")}</SelectItem>
                  <SelectItem value="bengali">{t("Бенгалі → Кирилиця", "Bengali → Cyrillic")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textType">{t("Тип тексту", "Text type")}</Label>
              <Select value={textType} onValueChange={(v) => setTextType(v as TextType)}>
                <SelectTrigger id="textType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shloka">{t("Шлока (без великих літер)", "Shloka (no capitals)")}</SelectItem>
                  <SelectItem value="purport">
                    {t("Пояснення (велика після крапки)", "Purport (capitals after period)")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Текстові поля */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Вхідний текст */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("Вхідний текст", "Input text")}</h2>
              <div className="text-sm text-muted-foreground">
                {inputText.length} {t("символів", "characters")}
              </div>
            </div>
            <Textarea
              rows={16}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "iast"
                  ? t(
                      "Введіть текст латиницею з IAST діакритикою...\nНаприклад: kṛṣṇa mahāprabhu",
                      "Enter text in Latin with IAST diacritics...\nExample: kṛṣṇa mahāprabhu",
                    )
                  : mode === "devanagari"
                    ? t(
                        "Введіть текст деванагарі...\nНаприклад: धर्मक्षेत्रे कुरुक्षेत्रे",
                        "Enter Devanagari text...\nExample: धर्मक्षेत्रे कुरुक्षेत्रे",
                      )
                    : t(
                        "Введіть текст бенгалі...\nНаприклад: বন্দে গুরূন্",
                        "Enter Bengali text...\nExample: বন্দে গুরূন্",
                      )
              }
              className="font-mono"
            />
          </Card>

          {/* Результат */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("Результат", "Result")}</h2>
              <div className="flex gap-2">
                <div className="text-sm text-muted-foreground">
                  {outputText.length} {t("символів", "characters")}
                </div>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(outputText)} disabled={!outputText}>
                  {t("Копіювати", "Copy")}
                </Button>
              </div>
            </div>
            <Textarea
              rows={16}
              value={outputText}
              readOnly
              placeholder={t("Результат з'явиться тут...", "Result will appear here...")}
              className="font-sans"
            />
          </Card>
        </div>

        {/* Кнопка транслітерації */}
        <div className="mt-6 flex justify-center">
          <Button onClick={handleTransliterate} size="lg" disabled={!inputText.trim()}>
            {t("Транслітерувати", "Transliterate")}
          </Button>
        </div>

        {/* Приклади */}
        <Card className="mt-8 p-6 bg-muted/50">
          <h3 className="font-semibold mb-3">{t("Приклади:", "Examples:")}</h3>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>IAST:</strong> kṛṣṇa mahāprabhu
              </div>
              <div>
                <strong>{t("Результат:", "Result:")}</strong> кр̣шн̣а маха̄прабгу
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>IAST:</strong> bhagavad-gītā
              </div>
              <div>
                <strong>{t("Результат:", "Result:")}</strong> бгаґавад-ґӣта̄
              </div>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
