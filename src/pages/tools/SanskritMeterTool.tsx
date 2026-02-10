import React, { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, Trash2, BookOpen, Search, ListMusic } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  METERS,
  patternToString,
  getMetersBySyllableCount,
  type MeterDefinition,
} from "@/data/sanskrit-meters";
import {
  analyzeMeter,
  formatPattern,
  type MeterAnalysis,
  type Syllable,
} from "@/utils/sanskritMeter";

// ============================================================
// Example verses for quick loading
// ============================================================

const EXAMPLES = [
  {
    label: "Anuṣṭubh (BG 1.1)",
    labelUk: "Анушт̣убг (БҐ 1.1)",
    text: "dharma-kṣetre kuru-kṣetre\nsamavetā yuyutsavaḥ\nmāmakāḥ pāṇḍavāś caiva\nkim akurvata sañjaya",
  },
  {
    label: "Vasantatilakā",
    labelUk: "Васантатілака̄",
    text: "śāntākāraṃ bhujagaśayanaṃ padmanābhaṃ sureśam\nviśvādhāraṃ gaganasadṛśaṃ meghavarṇaṃ śubhāṅgam",
  },
  {
    label: "Mandākrāntā (Meghadūta 1)",
    labelUk: "Манда̄кра̄нта̄ (Меґхадӯта 1)",
    text: "kaś cit kāntā-virahaguruṇā svādhikārapramattaḥ\nśāpenāstaṃgamitamahimā varṣabhogyeṇa bhartuḥ",
  },
  {
    label: "Śārdūlavikrīḍita",
    labelUk: "Ша̄рдӯлавікрīд̣іта",
    text: "sarasija-nayana sarodaja-mukha saradinda-sundara\nsakala-jana-mohana sakala-jana-vimoha-nāśana",
  },
  {
    label: "Mālinī",
    labelUk: "Ма̄лінī",
    text: "prathita-puruṣa-sāmānyāt guṇāt kiṃ nu dūre\nvidita-kamalabhāvā candrikā kiṃ na dhatte",
  },
  {
    label: "Indravajrā / Upajāti",
    labelUk: "Індраваджра̄ / Упаджа̄ті",
    text: "yad yad ācarati śreṣṭhas\ntat tad evetaro janaḥ\nsa yat pramāṇaṃ kurute\nlokas tad anuvartate",
  },
];

// ============================================================
// Sub-components
// ============================================================

/** Display a single syllable with weight indication */
function SyllableChip({ syllable }: { syllable: Syllable }) {
  const isGuru = syllable.weight === "G";
  return (
    <span
      className={`inline-flex flex-col items-center px-1.5 py-0.5 mx-0.5 text-sm font-mono ${
        isGuru
          ? "text-amber-700 dark:text-amber-400"
          : "text-sky-700 dark:text-sky-400"
      }`}
    >
      <span className="text-base leading-tight">{syllable.text}</span>
      <span className="text-xs leading-tight opacity-70">
        {isGuru ? "–" : "⏑"}
      </span>
    </span>
  );
}

/** Display pāda analysis */
function PadaDisplay({
  pada,
  padaNumber,
  t,
}: {
  pada: { text: string; syllables: Syllable[]; pattern: import("@/data/sanskrit-meters").SyllableWeight[] };
  padaNumber: number;
  t: (uk: string, en: string) => string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs text-muted-foreground font-medium">
          {t("Па̄да", "Pāda")} {padaNumber}
        </span>
        <span className="text-xs text-muted-foreground">
          ({pada.syllables.length} {t("складів", "syllables")})
        </span>
      </div>
      <div className="flex flex-wrap items-end gap-0.5 mb-1 sanskrit-text">
        {pada.syllables.map((syl, i) => (
          <SyllableChip key={i} syllable={syl} />
        ))}
      </div>
      <div className="text-xs font-mono text-muted-foreground tracking-wider">
        {formatPattern(pada.pattern)}
      </div>
    </div>
  );
}

/** Display meter match result */
function MeterMatchDisplay({
  match,
  rank,
  t,
}: {
  match: import("@/utils/sanskritMeter").MeterMatch;
  rank: number;
  t: (uk: string, en: string) => string;
}) {
  const meter = match.meter;
  const confidencePercent = Math.round(match.confidence * 100);
  const confidenceColor =
    confidencePercent >= 80
      ? "text-green-600 dark:text-green-400"
      : confidencePercent >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="py-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">#{rank}</span>
            <span className="font-semibold text-lg">{meter.nameIAST}</span>
            <span className="text-sm text-muted-foreground font-devanagari">
              {meter.nameDevanagari}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {t(meter.descriptionUk, meter.description)}
          </p>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
            <span>
              {meter.syllablesPerPada > 0 && `${meter.syllablesPerPada} ${t("складів/паду", "syl/pāda")}`}
            </span>
            <span>{meter.ganaFormula}</span>
          </div>
        </div>
        <div className={`text-right font-mono font-bold ${confidenceColor}`}>
          {confidencePercent}%
        </div>
      </div>
    </div>
  );
}

/** Reference table for all meters */
function MeterReferenceTable({ t }: { t: (uk: string, en: string) => string }) {
  const grouped = useMemo(() => getMetersBySyllableCount(), []);
  const [expandedMeter, setExpandedMeter] = useState<string | null>(null);

  const sortedGroups = useMemo(() => {
    return Array.from(grouped.entries()).sort(([a], [b]) => a - b);
  }, [grouped]);

  return (
    <div className="space-y-8">
      {sortedGroups.map(([syllableCount, meters]) => (
        <div key={syllableCount}>
          <h3 className="text-lg font-semibold mb-3">
            {syllableCount === 0
              ? t("Мора-базовані (джа̄ті)", "Mora-based (jāti)")
              : `${syllableCount} ${t("складів на паду", "syllables per pāda")}`}
          </h3>
          <div className="space-y-1">
            {meters.map((meter) => (
              <MeterReferenceRow
                key={meter.id}
                meter={meter}
                expanded={expandedMeter === meter.id}
                onToggle={() =>
                  setExpandedMeter(expandedMeter === meter.id ? null : meter.id)
                }
                t={t}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MeterReferenceRow({
  meter,
  expanded,
  onToggle,
  t,
}: {
  meter: MeterDefinition;
  expanded: boolean;
  onToggle: () => void;
  t: (uk: string, en: string) => string;
}) {
  return (
    <div className="py-3">
      <button
        onClick={onToggle}
        className="w-full text-left flex items-start justify-between gap-4 group"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{meter.nameIAST}</span>
            <span className="text-sm text-muted-foreground font-devanagari">
              {meter.nameDevanagari}
            </span>
            <Badge variant="secondary" className="text-xs">
              {meter.category}
            </Badge>
          </div>
          {meter.pattern.length > 0 && (
            <div className="text-xs font-mono text-muted-foreground mt-1 tracking-wider">
              {patternToString(meter.pattern)}
            </div>
          )}
        </div>
        <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors shrink-0">
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {expanded && (
        <div className="mt-3 ml-0 space-y-2 text-sm">
          <p className="text-muted-foreground">
            {t(meter.descriptionUk, meter.description)}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">{t("Ґан̣а формула", "Gaṇa formula")}:</span>{" "}
              <span className="font-mono">{meter.ganaFormula}</span>
            </div>
            {meter.ypiati && meter.ypiati.length > 0 && (
              <div>
                <span className="font-medium">{t("Цезура (яті)", "Caesura (yati)")}:</span>{" "}
                <span className="font-mono">
                  {t("після", "after")} {meter.ypiati.join(", ")}
                </span>
              </div>
            )}
          </div>
          {meter.example && (
            <div className="mt-2">
              <span className="font-medium text-xs">
                {t("Приклад", "Example")}
                {meter.example.source && (
                  <span className="text-muted-foreground"> ({meter.example.source})</span>
                )}
                :
              </span>
              <pre className="mt-1 text-xs font-mono whitespace-pre-wrap text-muted-foreground sanskrit-text">
                {meter.example.iast}
              </pre>
              {meter.example.devanagari && (
                <pre className="mt-1 text-xs whitespace-pre-wrap text-muted-foreground devanagari-text">
                  {meter.example.devanagari}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Gaṇa reference table */
function GanaReference({ t }: { t: (uk: string, en: string) => string }) {
  const ganas = [
    { name: "ya (य)", pattern: "⏑ – –", mnemonic: "ya-mā-tā" },
    { name: "ra (र)", pattern: "– ⏑ –", mnemonic: "rā-ja-bhā" },
    { name: "ta (त)", pattern: "– – ⏑", mnemonic: "tā-rā-ja" },
    { name: "bha (भ)", pattern: "– ⏑ ⏑", mnemonic: "bhā-na-sa" },
    { name: "ja (ज)", pattern: "⏑ – ⏑", mnemonic: "ja-la-dhiḥ" },
    { name: "sa (स)", pattern: "⏑ ⏑ –", mnemonic: "sa-ga-māḥ" },
    { name: "ma (म)", pattern: "– – –", mnemonic: "mā-tā-rā" },
    { name: "na (न)", pattern: "⏑ ⏑ ⏑", mnemonic: "na-ha-sat" },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        {t("Система ґан̣ (тризвукових груп)", "Gaṇa System (trisyllabic groups)")}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t(
          "Мнемоніка: yamātārājabhānasalagām — з цієї фрази виводяться всі 8 ґан̣.",
          "Mnemonic: yamātārājabhānasalagām — all 8 gaṇas derive from this phrase."
        )}
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("Ґан̣а", "Gaṇa")}</TableHead>
            <TableHead>{t("Патерн", "Pattern")}</TableHead>
            <TableHead>{t("Мнемоніка", "Mnemonic")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ganas.map((g) => (
            <TableRow key={g.name}>
              <TableCell className="font-semibold font-mono">{g.name}</TableCell>
              <TableCell className="font-mono tracking-wider">{g.pattern}</TableCell>
              <TableCell className="text-muted-foreground font-mono text-sm">
                {g.mnemonic}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-6 space-y-2 text-sm text-muted-foreground">
        <h4 className="font-semibold text-foreground">
          {t("Правила визначення ваги складу", "Syllable weight rules")}
        </h4>
        <p>
          <strong>{t("Ґуру (важкий) –", "Guru (heavy) –")}:</strong>{" "}
          {t(
            "Склад з довгою голосною (ā, ī, ū, ṝ, e, ai, o, au), або перед подвійним приголосним (самйоґа), або з анусва̄рою/вісарґою.",
            "Syllable with a long vowel (ā, ī, ū, ṝ, e, ai, o, au), or before a conjunct consonant (saṃyoga), or with anusvāra/visarga."
          )}
        </p>
        <p>
          <strong>{t("Лаґху (легкий) ⏑", "Laghu (light) ⏑")}:</strong>{" "}
          {t(
            "Склад з короткою голосною (a, i, u, ṛ, ḷ), не перед подвійним приголосним.",
            "Syllable with a short vowel (a, i, u, ṛ, ḷ), not before a conjunct consonant."
          )}
        </p>
        <p>
          <strong>{t("Останній склад пади", "Last syllable of a pāda")}:</strong>{" "}
          {t(
            "Традиційно вважається вільним — може бути і лаґху, і ґуру.",
            "Traditionally free — can be either laghu or guru."
          )}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Main component
// ============================================================

export default function SanskritMeterTool() {
  const { t } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<MeterAnalysis | null>(null);

  const handleAnalyze = useCallback(() => {
    if (!inputText.trim()) {
      toast.error(t("Введіть текст для аналізу", "Enter text to analyze"));
      return;
    }
    const result = analyzeMeter(inputText);
    setAnalysis(result);
  }, [inputText, t]);

  const handleClear = () => {
    setInputText("");
    setAnalysis(null);
  };

  const handleLoadExample = (text: string) => {
    setInputText(text);
    setAnalysis(null);
  };

  const handleCopyPattern = () => {
    if (!analysis) return;
    const patterns = analysis.padas
      .map(
        (p, i) =>
          `Pāda ${i + 1}: ${formatPattern(p.pattern)} (${p.syllables.length} syl)`
      )
      .join("\n");
    navigator.clipboard.writeText(patterns);
    toast.success(t("Скопійовано!", "Copied!"));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {t("Розміри санскритської поезії", "Sanskrit Poetry Meters")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t(
              "Аналіз та довідник чхандасу (छन्दस्) — метричних розмірів санскритської поезії",
              "Analysis and reference for chandas (छन्दस्) — metrical patterns of Sanskrit poetry"
            )}
          </p>
        </div>

        <Tabs defaultValue="analyze" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="analyze" className="gap-2">
              <Search className="w-4 h-4" />
              {t("Аналіз", "Analyze")}
            </TabsTrigger>
            <TabsTrigger value="reference" className="gap-2">
              <ListMusic className="w-4 h-4" />
              {t("Довідник", "Reference")}
            </TabsTrigger>
            <TabsTrigger value="gana" className="gap-2">
              <BookOpen className="w-4 h-4" />
              {t("Ґан̣и", "Gaṇas")}
            </TabsTrigger>
          </TabsList>

          {/* ============================================================
              TAB: Analyze
              ============================================================ */}
          <TabsContent value="analyze" className="space-y-8">
            {/* Input area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">
                  {t("Введіть вірш (IAST або деванагарі)", "Enter verse (IAST or Devanagari)")}
                </Label>
                <div className="text-sm text-muted-foreground">
                  {inputText.length} {t("символів", "chars")}
                </div>
              </div>

              <Textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setAnalysis(null);
                }}
                placeholder={t(
                  "Введіть вірш на санскриті...\nКожна па̄да (чверть вірша) на окремому рядку або розділена дандою (।)",
                  "Enter a Sanskrit verse...\nEach pāda (quarter-verse) on a separate line or separated by daṇḍa (।)"
                )}
                className="min-h-[160px] text-base sanskrit-text font-mono"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleAnalyze();
                  }
                }}
              />

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleAnalyze} size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  {t("Аналізувати", "Analyze")}
                </Button>
                <Button onClick={handleClear} variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t("Очистити", "Clear")}
                </Button>
                {analysis && (
                  <Button onClick={handleCopyPattern} variant="outline" size="sm">
                    <Copy className="w-4 h-4 mr-2" />
                    {t("Копіювати патерн", "Copy pattern")}
                  </Button>
                )}
              </div>
            </div>

            {/* Examples */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                {t("Приклади для завантаження", "Load examples")}
              </Label>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadExample(ex.text)}
                    className="text-xs"
                  >
                    {t(ex.labelUk, ex.label)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Analysis results */}
            {analysis && (
              <div className="space-y-8">
                {/* Syllable breakdown */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {t("Розбір по складах", "Syllable breakdown")}
                  </h2>
                  {analysis.padas.map((pada, i) => (
                    <PadaDisplay key={i} pada={pada} padaNumber={i + 1} t={t} />
                  ))}
                </div>

                {/* Meter matches */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {t("Визначений розмір", "Identified meter")}
                  </h2>
                  {analysis.matches.length === 0 ? (
                    <p className="text-muted-foreground">
                      {t(
                        "Не вдалось визначити розмір. Перевірте правильність введення тексту та розбиття на пади.",
                        "Could not identify the meter. Check that the text is entered correctly and pādas are properly separated."
                      )}
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {analysis.matches.slice(0, 5).map((match, i) => (
                        <MeterMatchDisplay
                          key={match.meter.id}
                          match={match}
                          rank={i + 1}
                          t={t}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Summary table */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {t("Підсумок", "Summary")}
                  </h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("Па̄да", "Pāda")}</TableHead>
                        <TableHead>{t("Складів", "Syllables")}</TableHead>
                        <TableHead>{t("Патерн", "Pattern")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.padas.map((pada, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{i + 1}</TableCell>
                          <TableCell>{pada.syllables.length}</TableCell>
                          <TableCell className="font-mono text-sm tracking-wider">
                            {formatPattern(pada.pattern)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ============================================================
              TAB: Reference
              ============================================================ */}
          <TabsContent value="reference">
            <MeterReferenceTable t={t} />
          </TabsContent>

          {/* ============================================================
              TAB: Gaṇas
              ============================================================ */}
          <TabsContent value="gana">
            <GanaReference t={t} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
