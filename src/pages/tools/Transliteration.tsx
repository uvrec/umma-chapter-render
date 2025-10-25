import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Trash2, Download, Info } from "lucide-react";

type TranslitMode = "iast" | "devanagari" | "bengali";
type TextType = "shloka" | "purport";

/**
 * 🎨 ULTIMATE ТРАНСЛІТЕРАТОР
 * ✨ З усіма UX покращеннями
 * ✅ ВИПРАВЛЕНО: використовує ı̄ (dotless i) замість ӣ (кирилиця)
 */
export default function TransliterationTool() {
  const { language, t } = useLanguage();

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<TranslitMode>("iast");
  const [textType, setTextType] = useState<TextType>("shloka");

  /**
   * Деванагарі → IAST
   */
  const devanagariToIAST = (text: string): string => {
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
      result += map[text[i]] || text[i];
    }
    return result;
  };

  /**
   * Бенгалі → IAST
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
      result += map[text[i]] || text[i];
    }
    return result;
  };

  /**
   * Капіталізація
   */
  const applyCapitalization = (text: string, type: TextType): string => {
    if (type === "shloka") {
      return text.toLowerCase();
    } else {
      let result = text.charAt(0).toUpperCase() + text.slice(1);
      result = result.replace(/\.\s+([а-яґєіїa-zа̄ӯı̄])/g, (match, letter) => {
        return ". " + letter.toUpperCase();
      });
      return result;
    }
  };

  /**
   * Транслітерація
   */
  const performTransliteration = (input: string): string => {
    if (!input.trim()) return "";

    let intermediate = input;

    if (mode === "devanagari") {
      intermediate = devanagariToIAST(input);
    } else if (mode === "bengali") {
      intermediate = bengaliToIAST(input);
    }

    let result = convertIASTtoUkrainian(intermediate);
    result = normalizeTransliteration(result);
    result = applyCapitalization(result, textType);

    return result;
  };

  /**
   * 🔥 LIVE PREVIEW з debounce
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const result = performTransliteration(inputText);
      setOutputText(result);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputText, mode, textType]);

  /**
   * 💾 ЗБЕРЕЖЕННЯ В LOCALSTORAGE
   */
  useEffect(() => {
    localStorage.setItem("translit_input", inputText);
    localStorage.setItem("translit_mode", mode);
    localStorage.setItem("translit_type", textType);
  }, [inputText, mode, textType]);

  /**
   * 🔄 ВІДНОВЛЕННЯ З LOCALSTORAGE
   */
  useEffect(() => {
    const savedInput = localStorage.getItem("translit_input");
    const savedMode = localStorage.getItem("translit_mode") as TranslitMode;
    const savedType = localStorage.getItem("translit_type") as TextType;

    if (savedInput) setInputText(savedInput);
    if (savedMode) setMode(savedMode);
    if (savedType) setTextType(savedType);
  }, []);

  /**
   * 🧹 ОЧИСТИТИ
   */
  const handleClear = () => {
    setInputText("");
    setOutputText("");
    localStorage.removeItem("translit_input");
    toast.success(t("Очищено", "Cleared"));
  };

  /**
   * 📋 КОПІЮВАТИ
   */
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("Скопійовано!", "Copied!"));
    } catch (err) {
      toast.error(t("Помилка копіювання", "Copy failed"));
    }
  };

  /**
   * 📥 ЕКСПОРТ У .TXT
   */
  const exportToFile = () => {
    if (!outputText) {
      toast.error(t("Немає тексту для експорту", "No text to export"));
      return;
    }

    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transliteration_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(t("Файл завантажено", "File downloaded"));
  };

  /**
   * 📊 СТАТИСТИКА
   */
  const inputWords = inputText.trim() ? inputText.split(/\s+/).filter(Boolean).length : 0;
  const outputWords = outputText.trim() ? outputText.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t("Транслітератор санскриту", "Sanskrit Transliterator")}
          </h1>
          <p className="text-muted-foreground">
            {t("Конвертація в українську кирилицю з діакритикою", "Convert to Ukrainian Cyrillic with diacritics")}
          </p>
        </div>

        {/* Інструкції */}
        <Card className="bg-blue-50 dark:bg-blue-950 p-4 mb-6 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                {t("Як користуватися:", "How to use:")}
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>{t("Оберіть режим та тип тексту", "Select mode and text type")}</li>
                <li>{t("Введіть текст ліворуч", "Enter text on the left")}</li>
                <li>{t("Результат з'явиться автоматично", "Result appears automatically")}</li>
                <li>{t("Скопіюйте або експортуйте результат", "Copy or export the result")}</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Налаштування */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mode">{t("Режим", "Mode")}</Label>
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
                  <SelectItem value="shloka">{t("Шлока (без великих)", "Shloka (no capitals)")}</SelectItem>
                  <SelectItem value="purport">
                    {t("Пояснення (велика після крапки)", "Purport (capitals after period)")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Статистика */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{inputText.length}</div>
              <div className="text-xs text-muted-foreground">{t("Символів введено", "Input chars")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{inputWords}</div>
              <div className="text-xs text-muted-foreground">{t("Слів введено", "Input words")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{outputText.length}</div>
              <div className="text-xs text-muted-foreground">{t("Символів результат", "Output chars")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{outputWords}</div>
              <div className="text-xs text-muted-foreground">{t("Слів результат", "Output words")}</div>
            </div>
          </div>
        </Card>

        {/* Текстові поля */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("Вхід", "Input")}</h2>
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <Trash2 className="w-4 h-4 mr-2" />
                {t("Очистити", "Clear")}
              </Button>
            </div>
            <Textarea
              rows={18}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "iast"
                  ? "kṛṣṇa mahāprabhu\nbhagavad-gītā"
                  : mode === "devanagari"
                    ? "धर्मक्षेत्रे कुरुक्षेत्रे"
                    : "বন্দে গুরূন্"
              }
              className="font-mono resize-none"
            />
          </Card>

          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("Результат", "Result")}</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(outputText)} disabled={!outputText}>
                  {t("Копіювати", "Copy")}
                </Button>
                <Button variant="outline" size="sm" onClick={exportToFile} disabled={!outputText}>
                  <Download className="w-4 h-4 mr-2" />
                  {t("Експорт", "Export")}
                </Button>
              </div>
            </div>
            <Textarea
              rows={18}
              value={outputText}
              readOnly
              placeholder={t("Автоматичний результат...", "Auto result...")}
              className="font-sans resize-none bg-muted/30"
            />
          </Card>
        </div>

        {/* ✅ ВИПРАВЛЕНІ ПРИКЛАДИ (з ı̄ замість ӣ) */}
        <Card className="mt-8 p-6 bg-muted/50">
          <h3 className="font-semibold mb-4">{t("Приклади:", "Examples:")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-mono text-muted-foreground">kṛṣṇa</span>
                <span className="font-semibold">→</span>
                <span>кр̣шн̣а</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-mono text-muted-foreground">mahāprabhu</span>
                <span className="font-semibold">→</span>
                <span>маха̄прабгу</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="font-mono text-muted-foreground">bhagavad-gītā</span>
                <span className="font-semibold">→</span>
                <span>бгаґавад-ґı̄та̄</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-mono text-muted-foreground">śrī-kṛṣṇa</span>
                <span className="font-semibold">→</span>
                <span>ш́рı̄-кр̣шн̣а</span>
              </div>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
