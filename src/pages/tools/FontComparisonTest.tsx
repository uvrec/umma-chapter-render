import { useState } from "react";

/**
 * Font Comparison Test Page
 *
 * Порівняння шрифтів для української кириличної транслітерації
 * з діакритичними знаками (combining characters).
 *
 * Тестовий текст: "пан̇ґум̇ лан̇ґг ш́аілам̇ мӯкам а̄ва кр̣па̄"
 *
 * Діакритичні знаки в тексті:
 * - н̇ (n + combining dot above U+0307)
 * - м̇ (m + combining dot above)
 * - ш́ (sh + combining acute accent U+0301)
 * - ӯ (u with macron - precomposed U+04EF)
 * - а̄ (a + combining macron U+0304)
 * - р̣ (r + combining dot below U+0323)
 */

const testSamples = [
  {
    id: "example1",
    label: "Приклад користувача",
    text: "пан̇ґум̇ лан̇ґг ш́аілам̇ мӯкам а̄ва кр̣па̄",
  },
  {
    id: "translit1",
    label: "Транслітерація (Śrīmad-Bhāgavatam)",
    text: "oṁ namo bhagavate vāsudevāya",
  },
  {
    id: "translit2",
    label: "Маха-мантра (транслітерація)",
    text: "Харе Кр̣ш̣н̣а Харе Кр̣ш̣н̣а Кр̣ш̣н̣а Кр̣ш̣н̣а Харе Харе / Харе Ра̄ма Харе Ра̄ма Ра̄ма Ра̄ма Харе Харе",
  },
  {
    id: "translit3",
    label: "Складні комбінації",
    text: "Бгаґава̄н ува̄ча — Бгаґава̄н ува̄ча",
  },
  {
    id: "combining",
    label: "Окремі combining characters",
    text: "а̄ і̄ ӯ р̣ р̄ н̇ м̇ ш́ с́ ч́ ґ н̃ т̣ д̣ л̣",
  },
  {
    id: "mixed",
    label: "Змішаний текст (укр + латиниця)",
    text: "Кр̣ш̣н̣а (Kṛṣṇa) — Верховна Особа Бога. Ш́рī Чаітанья (Śrī Caitanya) — Золотий Ава̄та̄ра.",
  },
];

const fontOptions = [
  { id: "noto-serif", name: "Noto Serif", family: '"Noto Serif", serif' },
  { id: "gentium-plus", name: "Gentium Plus", family: '"Gentium Plus", serif' },
  { id: "crimson-text", name: "Crimson Text", family: '"Crimson Text", serif' },
  { id: "system", name: "System Serif", family: 'Georgia, "Times New Roman", serif' },
];

const fontSizes = [16, 18, 20, 24, 28, 32];

export default function FontComparisonTest() {
  const [fontSize, setFontSize] = useState(24);
  const [customText, setCustomText] = useState("");

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Порівняння шрифтів для діакритики
        </h1>
        <p className="text-muted-foreground mb-6">
          Тестування відображення української кириличної транслітерації з combining characters
        </p>

        {/* Controls */}
        <div className="mb-8 p-4 bg-muted/30 rounded-lg">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <label className="font-medium">Розмір шрифту:</label>
            <div className="flex gap-2">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-3 py-1 rounded ${
                    fontSize === size
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium">Власний текст для тестування:</label>
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Введіть текст з діакритикою..."
              className="p-2 border rounded bg-background"
            />
          </div>
        </div>

        {/* Font Comparison Grid */}
        <div className="grid gap-8">
          {testSamples.map((sample) => (
            <div key={sample.id} className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-2 font-medium">
                {sample.label}
              </div>
              <div className="grid md:grid-cols-2 gap-px bg-border">
                {fontOptions.map((font) => (
                  <div key={font.id} className="bg-background p-4">
                    <div className="text-sm text-muted-foreground mb-2 font-mono">
                      {font.name}
                    </div>
                    <div
                      style={{
                        fontFamily: font.family,
                        fontSize: `${fontSize}px`,
                        lineHeight: 1.6,
                      }}
                    >
                      {sample.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Custom text section */}
          {customText && (
            <div className="border rounded-lg overflow-hidden border-primary">
              <div className="bg-primary/10 px-4 py-2 font-medium">
                Ваш текст
              </div>
              <div className="grid md:grid-cols-2 gap-px bg-border">
                {fontOptions.map((font) => (
                  <div key={font.id} className="bg-background p-4">
                    <div className="text-sm text-muted-foreground mb-2 font-mono">
                      {font.name}
                    </div>
                    <div
                      style={{
                        fontFamily: font.family,
                        fontSize: `${fontSize}px`,
                        lineHeight: 1.6,
                      }}
                    >
                      {customText}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side-by-side detailed comparison */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">
            Детальне порівняння: Noto Serif vs Gentium Plus
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Noto Serif */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">Noto Serif (поточний)</h3>
              <div
                style={{
                  fontFamily: '"Noto Serif", serif',
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.8,
                }}
                className="space-y-4"
              >
                <p>пан̇ґум̇ лан̇ґг ш́аілам̇ мӯкам а̄ва кр̣па̄</p>
                <p>Харе Кр̣ш̣н̣а Харе Кр̣ш̣н̣а</p>
                <p>Кр̣ш̣н̣а Кр̣ш̣н̣а Харе Харе</p>
                <p>Харе Ра̄ма Харе Ра̄ма</p>
                <p>Ра̄ма Ра̄ма Харе Харе</p>
              </div>
            </div>

            {/* Gentium Plus */}
            <div className="border rounded-lg p-6 border-primary">
              <h3 className="text-lg font-semibold mb-4 text-center text-primary">Gentium Plus (тест)</h3>
              <div
                style={{
                  fontFamily: '"Gentium Plus", serif',
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.8,
                }}
                className="space-y-4"
              >
                <p>пан̇ґум̇ лан̇ґг ш́аілам̇ мӯкам а̄ва кр̣па̄</p>
                <p>Харе Кр̣ш̣н̣а Харе Кр̣ш̣н̣а</p>
                <p>Кр̣ш̣н̣а Кр̣ш̣н̣а Харе Харе</p>
                <p>Харе Ра̄ма Харе Ра̄ма</p>
                <p>Ра̄ма Ра̄ма Харе Харе</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical info */}
        <div className="mt-12 p-4 bg-muted/30 rounded-lg">
          <h2 className="text-lg font-bold mb-3">Технічна інформація</h2>
          <div className="text-sm space-y-2 font-mono">
            <p><strong>Combining characters в тесті:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>U+0307 — Combining Dot Above (н̇, м̇)</li>
              <li>U+0301 — Combining Acute Accent (ш́, с́)</li>
              <li>U+0304 — Combining Macron (а̄, і̄, ӯ)</li>
              <li>U+0323 — Combining Dot Below (р̣, т̣, д̣)</li>
              <li>U+0303 — Combining Tilde (н̃)</li>
            </ul>
            <p className="mt-4">
              <strong>Проблема:</strong> Деякі шрифти не мають правильних GPOS таблиць для комбінування
              діакритичних знаків з кириличними літерами, що призводить до "розвалювання" —
              діакритика відображається окремо від базової літери.
            </p>
            <p className="mt-2">
              <strong>Gentium Plus</strong> розроблений SIL International спеціально для
              підтримки широкого спектра мов і систем письма, включаючи складні комбінації
              з діакритичними знаками.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
