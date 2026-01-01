import { useState, useEffect, useCallback, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  defaultRules,
  ruleCategories,
  applyNormalizationRules,
  parseCSVRules,
  parseTSVRules,
  parseTextRules,
  exportRulesToCSV,
  mergeRules,
  getChangeStatistics,
  NormalizationRule,
  NormalizationChange,
} from "@/utils/text/textNormalizationRules";
import { toast } from "sonner";
import {
  Trash2,
  Download,
  Upload,
  Copy,
  FileText,
  Settings2,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  FileSpreadsheet,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Text Normalization Tool
 *
 * Features:
 * - Apply predefined normalization rules for Gaudiya Vaishnava texts
 * - Load custom rules from CSV/TSV/TXT files
 * - Live preview with highlighted changes
 * - Statistics display
 * - Export functionality
 * - Integration with transliteration tool
 */
export default function TextNormalization() {
  const { language, t } = useLanguage();

  // Main state
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [changes, setChanges] = useState<NormalizationChange[]>([]);
  const [customRules, setCustomRules] = useState<NormalizationRule[]>([]);
  const [includeDefaultRules, setIncludeDefaultRules] = useState(true);
  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(ruleCategories.map((c) => c.id))
  );

  // UI state
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [showDiff, setShowDiff] = useState(true);
  const [newRuleIncorrect, setNewRuleIncorrect] = useState("");
  const [newRuleCorrect, setNewRuleCorrect] = useState("");
  const [activeTab, setActiveTab] = useState("normalize");

  // Combine rules
  const allRules = useMemo(() => {
    return mergeRules(customRules, includeDefaultRules);
  }, [customRules, includeDefaultRules]);

  // Active rules count
  const activeRulesCount = useMemo(() => {
    return allRules.filter((r) => enabledCategories.has(r.category)).length;
  }, [allRules, enabledCategories]);

  /**
   * Perform normalization
   */
  const performNormalization = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText("");
      setChanges([]);
      return;
    }

    const { result, changes: newChanges } = applyNormalizationRules(
      inputText,
      allRules,
      enabledCategories
    );

    setOutputText(result);
    setChanges(newChanges);
  }, [inputText, allRules, enabledCategories]);

  /**
   * Live preview with debounce
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      performNormalization();
    }, 300);

    return () => clearTimeout(timer);
  }, [performNormalization]);

  /**
   * Persistence
   */
  useEffect(() => {
    localStorage.setItem("normalize_input", inputText);
    localStorage.setItem("normalize_include_defaults", String(includeDefaultRules));
    localStorage.setItem("normalize_categories", JSON.stringify([...enabledCategories]));
    if (customRules.length > 0) {
      localStorage.setItem("normalize_custom_rules", JSON.stringify(customRules));
    }
  }, [inputText, includeDefaultRules, enabledCategories, customRules]);

  /**
   * Restore saved state
   */
  useEffect(() => {
    const savedInput = localStorage.getItem("normalize_input");
    const savedIncludeDefaults = localStorage.getItem("normalize_include_defaults");
    const savedCategories = localStorage.getItem("normalize_categories");
    const savedCustomRules = localStorage.getItem("normalize_custom_rules");

    if (savedInput) setInputText(savedInput);
    if (savedIncludeDefaults) setIncludeDefaultRules(savedIncludeDefaults === "true");
    if (savedCategories) {
      try {
        setEnabledCategories(new Set(JSON.parse(savedCategories)));
      } catch {}
    }
    if (savedCustomRules) {
      try {
        setCustomRules(JSON.parse(savedCustomRules));
      } catch {}
    }
  }, []);

  /**
   * Toggle category
   */
  const toggleCategory = (categoryId: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      let newRules: NormalizationRule[] = [];

      const ext = file.name.toLowerCase().split(".").pop();
      if (ext === "csv") {
        newRules = parseCSVRules(content);
      } else if (ext === "tsv" || ext === "xlsx" || ext === "xls") {
        newRules = parseTSVRules(content);
      } else {
        newRules = parseTextRules(content);
      }

      if (newRules.length === 0) {
        toast.error(t("Не знайдено правил у файлі", "No rules found in file"));
        return;
      }

      setCustomRules((prev) => [...prev, ...newRules]);
      toast.success(
        t(`Завантажено ${newRules.length} правил`, `Loaded ${newRules.length} rules`)
      );
    } catch (error: any) {
      toast.error(t("Помилка читання файлу", "Error reading file"));
      console.error(error);
    }

    // Reset input
    event.target.value = "";
  };

  /**
   * Add custom rule manually
   */
  const addCustomRule = () => {
    if (!newRuleIncorrect.trim() || !newRuleCorrect.trim()) {
      toast.error(t("Заповніть обидва поля", "Fill both fields"));
      return;
    }

    if (newRuleIncorrect === newRuleCorrect) {
      toast.error(t("Значення мають бути різними", "Values must be different"));
      return;
    }

    const newRule: NormalizationRule = {
      id: `manual_${Date.now()}`,
      incorrect: newRuleIncorrect,
      correct: newRuleCorrect,
      category: "custom",
      description: `${newRuleIncorrect} → ${newRuleCorrect}`,
    };

    setCustomRules((prev) => [...prev, newRule]);
    setNewRuleIncorrect("");
    setNewRuleCorrect("");
    toast.success(t("Правило додано", "Rule added"));
  };

  /**
   * Remove custom rule
   */
  const removeCustomRule = (id: string) => {
    setCustomRules((prev) => prev.filter((r) => r.id !== id));
    toast.success(t("Правило видалено", "Rule removed"));
  };

  /**
   * Clear all custom rules
   */
  const clearCustomRules = () => {
    setCustomRules([]);
    localStorage.removeItem("normalize_custom_rules");
    toast.success(t("Користувацькі правила очищено", "Custom rules cleared"));
  };

  /**
   * Clear input
   */
  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setChanges([]);
    localStorage.removeItem("normalize_input");
    toast.success(t("Очищено", "Cleared"));
  };

  /**
   * Copy to clipboard
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
   * Export result
   */
  const exportResult = () => {
    if (!outputText) {
      toast.error(t("Немає тексту для експорту", "No text to export"));
      return;
    }

    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `normalized_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(t("Файл завантажено", "File downloaded"));
  };

  /**
   * Export rules
   */
  const exportRules = () => {
    const csv = exportRulesToCSV(allRules);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `normalization_rules_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(t("Правила експортовано", "Rules exported"));
  };

  // Statistics
  const changeStats = useMemo(() => getChangeStatistics(changes), [changes]);
  const inputWords = inputText.trim() ? inputText.split(/\s+/).filter(Boolean).length : 0;
  const outputWords = outputText.trim() ? outputText.split(/\s+/).filter(Boolean).length : 0;

  /**
   * Generate diff view
   */
  const getDiffView = useCallback(() => {
    if (!showDiff || changes.length === 0) return outputText;

    // Sort changes by position in reverse to apply from end
    const sortedChanges = [...changes].sort((a, b) => b.position - a.position);

    let diffText = inputText;
    for (const change of sortedChanges) {
      const before = diffText.slice(0, change.position);
      const after = diffText.slice(change.position + change.original.length);
      diffText = `${before}【${change.replacement}】${after}`;
    }

    return diffText;
  }, [inputText, changes, showDiff, outputText]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t("Нормалізація текстів", "Text Normalization")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Автоматичне виправлення текстів за редакційними стандартами ґаудіа-вайшнавізму",
              "Automatic text correction according to Gaudiya Vaishnava editorial standards"
            )}
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Link to="/tools/transliteration">
              <Button variant="outline" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                {t("Транслітерація", "Transliteration")}
              </Button>
            </Link>
            <a
              href="https://docs.google.com/spreadsheets/d/1YZT4-KaQBeEZu7R9qysirdt8yb-9psOIkXCalDPLuwY/edit?gid=627477148#gid=627477148"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                {t("Документ правил", "Rules Document")}
              </Button>
            </a>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="normalize">
              <FileText className="w-4 h-4 mr-2" />
              {t("Нормалізація", "Normalization")}
            </TabsTrigger>
            <TabsTrigger value="rules">
              <Settings2 className="w-4 h-4 mr-2" />
              {t("Правила", "Rules")} ({allRules.length})
            </TabsTrigger>
          </TabsList>

          {/* Normalization Tab */}
          <TabsContent value="normalize" className="space-y-6">
            {/* Categories filter */}
            <div className="p-4">
              <Collapsible open={categoriesOpen} onOpenChange={setCategoriesOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Label>{t("Категорії правил", "Rule Categories")}</Label>
                    <Badge variant="secondary">{activeRulesCount} / {allRules.length}</Badge>
                  </div>
                  {categoriesOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {ruleCategories.map((category) => {
                      const count = allRules.filter((r) => r.category === category.id).length;
                      return (
                        <div
                          key={category.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`cat-${category.id}`}
                            checked={enabledCategories.has(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
                          />
                          <Label
                            htmlFor={`cat-${category.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {language === "ua" ? category.name_ua : category.name_en}
                            <span className="text-muted-foreground ml-1">({count})</span>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Statistics */}
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{inputText.length}</div>
                  <div className="text-xs text-muted-foreground">{t("Символів", "Characters")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">{inputWords}</div>
                  <div className="text-xs text-muted-foreground">{t("Слів", "Words")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{changes.length}</div>
                  <div className="text-xs text-muted-foreground">{t("Змін", "Changes")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{activeRulesCount}</div>
                  <div className="text-xs text-muted-foreground">{t("Активних правил", "Active rules")}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{customRules.length}</div>
                  <div className="text-xs text-muted-foreground">{t("Власних правил", "Custom rules")}</div>
                </div>
              </div>

              {/* Change breakdown by category */}
              {Object.keys(changeStats).length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">
                    {t("Зміни за категоріями:", "Changes by category:")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(changeStats).map(([categoryId, count]) => {
                      const category = ruleCategories.find((c) => c.id === categoryId);
                      return (
                        <Badge key={categoryId} variant="outline">
                          {category
                            ? language === "ua"
                              ? category.name_ua
                              : category.name_en
                            : categoryId}
                          : {count}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Text areas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">{t("Вхідний текст", "Input text")}</h2>
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("Очистити", "Clear")}
                  </Button>
                </div>
                <Textarea
                  rows={18}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t(
                    "Вставте текст для нормалізації...\n\nПриклад:\nСанн'ясі повинен джг читати Бхаґавад-ґіту кожного дня.",
                    "Paste text to normalize...\n\nExample:\nSannyasi should read Bhagavad-gita every day."
                  )}
                  spellCheck={false}
                  className="resize-none"
                />
              </div>

              {/* Output */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    {t("Результат", "Result")}
                    {changes.length > 0 && (
                      <Badge variant="secondary" className="text-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {changes.length} {t("змін", "changes")}
                      </Badge>
                    )}
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDiff(!showDiff)}
                      title={t("Показати/сховати зміни", "Show/hide changes")}
                    >
                      {showDiff ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(outputText)}
                      disabled={!outputText}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {t("Копіювати", "Copy")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportResult}
                      disabled={!outputText}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t("Експорт", "Export")}
                    </Button>
                  </div>
                </div>
                <Textarea
                  rows={18}
                  value={showDiff && changes.length > 0 ? getDiffView() : outputText}
                  readOnly
                  placeholder={t("Результат з'явиться автоматично...", "Result appears automatically...")}
                  className="resize-none bg-muted/30"
                  spellCheck={false}
                />
                {showDiff && changes.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "【...】 — позначає зміни. Натисніть 👁 щоб приховати",
                      "【...】 — indicates changes. Click 👁 to hide"
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Changes list */}
            {changes.length > 0 && (
              <div className="p-4">
                <h3 className="font-semibold mb-4">{t("Застосовані зміни:", "Applied changes:")}</h3>
                <div className="max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {changes.slice(0, 50).map((change, idx) => (
                      <div
                        key={idx}
                        className="text-sm p-2 rounded bg-muted/50 flex items-center gap-2"
                      >
                        <span className="text-red-500 line-through">{change.original}</span>
                        <span>→</span>
                        <span className="text-green-600 font-medium">{change.replacement}</span>
                      </div>
                    ))}
                  </div>
                  {changes.length > 50 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {t(`...та ще ${changes.length - 50} змін`, `...and ${changes.length - 50} more changes`)}
                    </p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Rules Tab */}
          <TabsContent value="rules" className="space-y-6">
            {/* Actions */}
            <div className="p-4">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-defaults"
                      checked={includeDefaultRules}
                      onCheckedChange={(checked) => setIncludeDefaultRules(checked as boolean)}
                    />
                    <Label htmlFor="include-defaults" className="cursor-pointer">
                      {t("Використовувати стандартні правила", "Use default rules")} ({defaultRules.length})
                    </Label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        {t("Завантажити правила", "Upload rules")}
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".csv,.tsv,.txt,.xlsx,.xls"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button variant="outline" size="sm" onClick={exportRules}>
                    <Download className="w-4 h-4 mr-2" />
                    {t("Експортувати", "Export")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Add custom rule */}
            <div className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t("Додати власне правило", "Add custom rule")}
              </h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="new-incorrect">{t("Неправильно", "Incorrect")}</Label>
                  <Input
                    id="new-incorrect"
                    value={newRuleIncorrect}
                    onChange={(e) => setNewRuleIncorrect(e.target.value)}
                    placeholder={t("Введіть текст для заміни", "Enter text to replace")}
                  />
                </div>
                <div className="flex items-end">
                  <span className="text-2xl px-2">→</span>
                </div>
                <div className="flex-1">
                  <Label htmlFor="new-correct">{t("Правильно", "Correct")}</Label>
                  <Input
                    id="new-correct"
                    value={newRuleCorrect}
                    onChange={(e) => setNewRuleCorrect(e.target.value)}
                    placeholder={t("Введіть правильний варіант", "Enter correct variant")}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addCustomRule}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t("Додати", "Add")}
                  </Button>
                </div>
              </div>
            </div>

            {/* Custom rules list */}
            {customRules.length > 0 && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    {t("Користувацькі правила", "Custom rules")} ({customRules.length})
                  </h3>
                  <Button variant="ghost" size="sm" onClick={clearCustomRules}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("Очистити всі", "Clear all")}
                  </Button>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {customRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="flex items-center justify-between p-2 rounded bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">{rule.incorrect}</span>
                        <span>→</span>
                        <span className="text-green-600">{rule.correct}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomRule(rule.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Default rules preview */}
            {includeDefaultRules && (
              <div className="p-4">
                <h3 className="font-semibold mb-4">
                  {t("Стандартні правила", "Default rules")} ({defaultRules.length})
                </h3>
                <div className="space-y-4">
                  {ruleCategories
                    .filter((cat) => defaultRules.some((r) => r.category === cat.id))
                    .map((category) => {
                      const catRules = defaultRules.filter((r) => r.category === category.id);
                      return (
                        <Collapsible key={category.id}>
                          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                            <ChevronRight className="w-4 h-4" />
                            {language === "ua" ? category.name_ua : category.name_en}
                            <Badge variant="outline">{catRules.length}</Badge>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="ml-6 mt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {catRules.map((rule) => (
                                <div
                                  key={rule.id}
                                  className="text-sm p-2 rounded bg-muted/30"
                                >
                                  <span className="text-red-500">{rule.incorrect}</span>
                                  <span className="mx-2">→</span>
                                  <span className="text-green-600">{rule.correct}</span>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                </div>
              </div>
            )}

            {/* File format help */}
            <div className="p-4 bg-muted/50">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {t("Формати файлів правил", "Rules file formats")}
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">CSV:</h4>
                  <code className="block bg-background p-2 rounded text-xs">
                    incorrect,correct,category,description<br />
                    "санн'ясі","санньясі","names","Виправлення апострофа"
                  </code>
                </div>
                <div>
                  <h4 className="font-medium mb-1">TXT:</h4>
                  <code className="block bg-background p-2 rounded text-xs">
                    санн'ясі → санньясі<br />
                    Бхаґаватам -&gt; Бгаґаватам<br />
                    # Коментарі з # ігноруються
                  </code>
                </div>
                <div>
                  <h4 className="font-medium mb-1">TSV (Tab-separated):</h4>
                  <code className="block bg-background p-2 rounded text-xs">
                    санн'ясі{"	"}санньясі{"	"}names{"	"}опис
                  </code>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
