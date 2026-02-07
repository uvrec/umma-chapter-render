// src/pages/TransliterationTool.tsx
// ✅ НОВИЙ транслітератор з Sanscript.js підтримкою
import React, { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Trash2, BookOpen, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { processText } from "@/utils/text/transliteration";
import { devanagariToIAST, bengaliToIAST, convertIASTtoUkrainian } from "@/utils/textNormalizer";

type Mode = "iast" | "devanagari" | "bengali";
type TextType = "shloka" | "purport";

const TEST_EXAMPLES: Record<Mode, { shloka: string[]; purport: string }> = {
  iast: {
    shloka: ["dharma-kṣetre kuru-kṣetre samavetā yuyutsavaḥ", "māmakāḥ pāṇḍavāś caiva kim akurvata sañjaya"],
    purport:
      "Bhagavad-gītā is universally renowned as the jewel of India's spiritual wisdom. Spoken by Lord Kṛṣṇa, the Supreme Personality of Godhead to His intimate disciple Arjuna, the Gītā's seven hundred concise verses provide a definitive guide to the science of self realization.",
  },
  devanagari: {
    shloka: ["धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः", "मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय"],
    purport: "भगवद्गीता भारत की आध्यात्मिक बुद्धि का मणि है। भगवान् कृष्ण द्वारा अपने प्रिय शिष्य अर्जुन से कहा गया।",
  },
  bengali: {
    shloka: ["বন্দে গুরূনীশভক্তানীশমীশাবতারকান্", "তৎপ্রকাশাংশ্চ তচ্ছক্তীঃ কৃষ্ণচৈতন্যসংজ্ঞকম্"],
    purport:
      "শ্রী চৈতন্য চরিতামৃত বাংলা ভাষায় রচিত একটি অমূল্য গ্রন্থ। এই গ্রন্থে শ্রী কৃষ্ণ চৈতন্যের জীবন ও শিক্ষার বিস্তৃত বিবরণ রয়েছে।",
  },
};

export default function TransliterationTool() {
  const [mode, setMode] = useState<Mode>("devanagari");
  const [textType, setTextType] = useState<TextType>("shloka");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRules, setShowRules] = useState(false);

  // Функція транслітерації з використанням Sanscript
  const translateText = useCallback(
    async (text: string, sourceMode: Mode): Promise<string> => {
      if (!text.trim()) return "";

      setIsProcessing(true);
      try {
        let result = "";

        switch (sourceMode) {
          case "devanagari":
            // Деванагарі → IAST → Українська
            const devanagariIAST = devanagariToIAST(text);
            result = convertIASTtoUkrainian(devanagariIAST);
            break;
          case "bengali":
            // Бенгалі → IAST → Українська
            const bengaliIAST = bengaliToIAST(text);
            result = convertIASTtoUkrainian(bengaliIAST);
            break;
          case "iast":
            // IAST → Українська
            result = convertIASTtoUkrainian(text);
            break;
          default:
            result = text;
        }

        return result;
      } catch (error) {
        console.error("Помилка транслітерації:", error);
        toast.error("Помилка при транслітерації");
        return text;
      } finally {
        setIsProcessing(false);
      }
    },
    [mode, textType],
  );

  // Автоматична транслітерація з debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputText.trim()) {
        const result = await translateText(inputText, mode);
        setOutputText(result);
      } else {
        setOutputText("");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText, mode, textType, translateText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast.success("Скопійовано в буфер обміну!");
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transliteration.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Файл завантажено!");
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const loadExample = () => {
    const examples = TEST_EXAMPLES[mode];
    const exampleText = textType === "shloka" ? examples.shloka.join("\n") : examples.purport;
    setInputText(exampleText);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Транслітератор санскриту
          </h1>
          <p className="text-lg text-muted-foreground">Конвертація в українську кирилицю з діакритикою</p>
        </div>

        {/* Контролі */}
        <div className="p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Режим транслітерації</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="iast">Латиниця (IAST) → Кирилиця</SelectItem>
                  <SelectItem value="devanagari">Деванагарі → Кирилиця</SelectItem>
                  <SelectItem value="bengali">Бенгалі → Кирилиця</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Тип тексту</Label>
              <Select value={textType} onValueChange={(v) => setTextType(v as TextType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shloka">Шлока (нумерація віршів)</SelectItem>
                  <SelectItem value="purport">Пояснення (звичайний текст)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Текстові поля */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Вхід */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Вхідний текст</Label>
              <div className="text-sm text-muted-foreground">{inputText.length} символів</div>
            </div>

            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                mode === "iast"
                  ? "Введіть текст латиницею з IAST діакритикою...\nНаприклад: kṛṣṇa mahāprabhu"
                  : mode === "devanagari"
                    ? "Введіть текст на деванагарі...\nНаприклад: कृष्ण महाप्रभु"
                    : "Введіть текст бенгалі...\nНаприклад: কৃষ্ণ মহাপ্রভু"
              }
              className={`min-h-[300px] text-base ${
                mode === "devanagari" ? "devanagari-text" : mode === "bengali" ? "bengali-text" : "sanskrit-text"
              }`}
              data-script={mode}
            />

            <div className="flex gap-2">
              <Button onClick={handleClear} variant="outline" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Очистити
              </Button>
              <Button onClick={loadExample} variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Приклад
              </Button>
            </div>
          </div>

          {/* Вихід */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">
                Результат {isProcessing && <RefreshCw className="w-4 h-4 inline ml-2 animate-spin" />}
              </Label>
              <div className="text-sm text-muted-foreground">{outputText.length} символів</div>
            </div>

            <Textarea
              value={outputText}
              readOnly
              placeholder="Результат з'явиться тут..."
              className="min-h-[300px] bg-muted/50 text-base transliteration-output translit"
              data-script={mode}
            />

            <div className="flex gap-2">
              <Button onClick={handleCopy} variant="outline" size="sm" disabled={!outputText}>
                <Copy className="w-4 h-4 mr-2" />
                Копіювати
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm" disabled={!outputText}>
                <Download className="w-4 h-4 mr-2" />
                Завантажити
              </Button>
            </div>
          </div>
        </div>

        {/* Правила транслітерації */}
        <div className="p-6">
          <Button
            onClick={() => setShowRules(!showRules)}
            variant="ghost"
            className="w-full justify-between text-lg font-semibold"
          >
            📖 Правила транслітерації
            <span className="text-muted-foreground">{showRules ? "▲" : "▼"}</span>
          </Button>

          {showRules && (
            <div className="mt-6 space-y-6 prose prose-sm max-w-none dark:prose-invert">
              <div>
                <h3 className="font-semibold text-lg mb-3">Голосні</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-sm">
                  <div>a → а | ā → а̄</div>
                  <div>i → і | ī → ī</div>
                  <div>u → у | ū → ӯ</div>
                  <div>e → е | o → о</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Приголосні з діакритикою</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-sm">
                  <div>ś → ш́ (з акутом)</div>
                  <div>Ś → Ш́ (з акутом)</div>
                  <div>ṣ → ш</div>
                  <div>ṭ → т̣</div>
                  <div>ḍ → д̣</div>
                  <div>ṛ → р̣</div>
                  <div>ṇ → н̣</div>
                  <div>ñ → н̃</div>
                  <div>ṅ → н̇</div>
                  <div>ṁ → м̇</div>
                  <div>ḥ → х̣</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Сполучення</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 font-mono text-sm">
                  <div>bh → бг</div>
                  <div>gh → ґг</div>
                  <div>dh → дг</div>
                  <div>ḍh → д̣г</div>
                  <div>th → тх</div>
                  <div>kh → кх</div>
                  <div>ch → чх</div>
                  <div>jh → джх</div>
                  <div>kṣ → кш</div>
                  <div>jñ → джн̃</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Спеціальні можливості</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>✅ Автоматична конвертація з деванагарі</li>
                  <li>✅ Автоматична конвертація з бенгалі</li>
                  <li>Автоматична конвертація індійських цифр (१२३ → 123)</li>
                  <li>Обробка пунктуації (। → .)</li>
                  <li>Додавання дефісів у композитах (маха̄пурушах̣ → маха̄-пурушах̣)</li>
                  <li>Збереження подвійної данди (॥) для нумерації віршів</li>
                  <li>Розпізнавання типу тексту: шлоки vs звичайний текст</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Тестові приклади</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  <Button
                    onClick={() => {
                      setMode("devanagari");
                      setTextType("shloka");
                      setInputText(
                        "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ।। १ ।।",
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                  >
                    Бгаґавад-Ґīта̄ 1.1 (деванагарі)
                  </Button>
                  <Button
                    onClick={() => {
                      setMode("bengali");
                      setTextType("shloka");
                      setInputText(
                        "বন্দে গুরূনীশভক্তানীশমীশাবতারকান্ ।\nতৎপ্রকাশাংশ্চ তচ্ছক্তীঃ কৃষ্ণচৈতন্যসংজ্ঞকম্ ॥ १ ॥",
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                  >
                    Чаітанйа-чаріта̄мр̣та 1.1 (бенгалі)
                  </Button>
                  <Button
                    onClick={() => {
                      setMode("bengali");
                      setTextType("shloka");
                      setInputText(
                        "যস্যাংশাংশঃ শ্রীল–গর্ভোদশায়ী\nযন্নাভ্যব্জং লোকসংঘাতনালম্‌ ।\nলোকস্রষ্টুঃ সূতিকাধামধাতু–\nস্তং শ্রীনিত্যানন্দরামং প্রপদ্যে ॥ ১০ ॥",
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                  >
                    Чаітанйа-чаріта̄мр̣та 1.10 (ваш текст)
                  </Button>
                  <Button
                    onClick={() => {
                      setMode("iast");
                      setTextType("shloka");
                      setInputText(
                        "dharma-kṣetre kuru-kṣetre\nsamavetā yuyutsavaḥ\nmāmakāḥ pāṇḍavāś caiva\nkim akurvata sañjaya",
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                  >
                    Бгаґавад-Ґīта̄ 1.1 (IAST)
                  </Button>
                  <Button
                    onClick={() => {
                      setMode("iast");
                      setTextType("purport");
                      setInputText(
                        "Bhagavad-gītā is universally renowned as the jewel of India's spiritual wisdom. Spoken by Lord Kṛṣṇa, the Supreme Personality of Godhead to His intimate disciple Arjuna.",
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                  >
                    Пояснення (IAST)
                  </Button>
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">⚠️ Заборонені літери</h4>
                <p className="text-sm text-muted-foreground">
                  Не використовуйте: <span className="font-mono">є и ь ю я ы э</span>
                </p>
              </div>

              <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">🔬 Технічні деталі</h4>
                <p className="text-sm text-muted-foreground">
                  Цей транслітератор використовує академічні стандарти для точної конвертації з різних писемностей в
                  українську кирилицю з повним набором діакритичних знаків для санскриту.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">📚 Більше інформації</h4>
                <a
                  href="https://www.prabhupada.website/transliteration/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  Повні правила транслітерації →
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
