// src/pages/TransliterationTool.tsx
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Copy, Download, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { processText, TEST_EXAMPLES, validateOutput } from "@/utils/text/transliteration";

type Mode = "iast" | "devanagari" | "bengali";
type TextType = "shloka" | "purport";

export default function TransliterationTool() {
  const [mode, setMode] = useState<Mode>("iast");
  const [textType, setTextType] = useState<TextType>("shloka");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [showRules, setShowRules] = useState(false);

  // Автоматична транслітерація з debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText) {
        const result = processText(inputText, mode, textType, {
          addHyphens: true,
          convertNums: true,
          preservePunct: true,
          preserveCase: false, // Застосовувати правила капіталізації
        });
        setOutputText(result);

        // Валідація
        const validation = validateOutput(result);
        if (!validation.valid) {
          console.warn("Знайдено помилки валідації:", validation.errors);
        }
      } else {
        setOutputText("");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText, mode, textType]);

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Транслітератор санскриту
          </h1>
          <p className="text-lg text-muted-foreground">Конвертація в українську кирилицю з діакритикою</p>
        </div>

        {/* Контролі */}
        <Card className="p-6 mb-8">
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
                  <SelectItem value="shloka">Шлока (перша літера рядка велика)</SelectItem>
                  <SelectItem value="purport">Пояснення (велика після крапки)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

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
              className={`min-h-[300px] font-mono text-base ${
                mode === "devanagari" ? "font-devanagari" : mode === "bengali" ? "font-bengali" : ""
              }`}
              style={{
                fontFamily:
                  mode === "devanagari"
                    ? "var(--font-devanagari)"
                    : mode === "bengali"
                      ? "var(--font-bengali)"
                      : "monospace",
              }}
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
              <Label className="text-lg font-semibold">Результат</Label>
              <div className="text-sm text-muted-foreground">{outputText.length} символів</div>
            </div>

            <Textarea
              value={outputText}
              readOnly
              placeholder="Результат з'явиться тут..."
              className="min-h-[300px] bg-muted/50 font-translit text-base"
              style={{
                fontFamily: "var(--font-translit)",
              }}
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
        <Card className="p-6">
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
                  <li>Автоматична конвертація індійських цифр (१२३ → 123)</li>
                  <li>Обробка пунктуації (। → .)</li>
                  <li>Додавання дефісів у композитах (маха̄пурушах̣ → маха̄-пурушах̣, ш́рīкр̣шн̣а → ш́рī-кр̣шн̣а)</li>
                  <li>Збереження подвійної данди (॥) для нумерації віршів</li>
                  <li>Правильна капіталізація: для шлок (перша літера кожного рядка), для пояснень (після крапки)</li>
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
                        "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः । मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ।। १ ।।",
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                  >
                    Бгаґавад-Ґīта̄ 1.1
                  </Button>
                  <Button
                    onClick={() => {
                      setMode("devanagari");
                      setTextType("shloka");
                      setInputText(
                        "सञ्जय उवाच दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा । आचार्यमुपसङ्गम्य राजा वचनमब्रवीत् ॥ २ ॥",
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                  >
                    Бгаґавад-Ґīта̄ 1.2
                  </Button>
                  <Button
                    onClick={() => {
                      setMode("bengali");
                      setTextType("shloka");
                      setInputText(
                        "বন্দে গুরূনীশভক্তানীশমীশাবতারকান্ । তৎপ্রকাশাংশ্চ তচ্ছক্তীঃ কৃষ্ণচৈতন্যসংজ্ঞকম্ ॥ १ ॥",
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                  >
                    Чаітанйа-чаріта̄мр̣та 1.1
                  </Button>
                  <Button
                    onClick={() => {
                      setMode("bengali");
                      setTextType("shloka");
                      setInputText(
                        "বন্দে শ্রীকৃষ্ণচৈতন্যনিত্যানন্দৌ সহোদিতৌ । গৌড়োদয়ে পুষ্পবন্তৌ চিত্রৌ শন্দৌ তমোনুদৌ ॥ २ ॥",
                      );
                    }}
                    variant="outline"
                    size="sm"
                    className="justify-start"
                  >
                    Чаітанйа-чаріта̄мр̣та 1.2
                  </Button>
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                <h4 className="font-semibold text-sm mb-2">⚠️ Заборонені літери</h4>
                <p className="text-sm text-muted-foreground">
                  Не використовуйте: <span className="font-mono">є и ь ю я ы э</span>
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
        </Card>
      </main>

      <Footer />
    </div>
  );
}
