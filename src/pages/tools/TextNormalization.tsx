import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Lazy load TipTap editor to reduce bundle size
const RichTextEditor = lazy(() => import("@/components/ui/rich-text-editor"));
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  Zap,
  BookOpen,
  Type,
  TextCursorInput,
  Pilcrow,
} from "lucide-react";
import { Link } from "react-router-dom";

// Categories that should be formatted as bold (scripture names)
const BOLD_CATEGORIES = ["scriptures"];
// Categories that should be formatted as italic (Sanskrit terms)
const ITALIC_CATEGORIES = ["transliteration", "names", "endings", "apostrophe"];

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
  const [categoriesOpen, setCategoriesOpen] = useState(true);
  const [showDiff, setShowDiff] = useState(true);
  const [newRuleIncorrect, setNewRuleIncorrect] = useState("");
  const [newRuleCorrect, setNewRuleCorrect] = useState("");
  const [activeTab, setActiveTab] = useState("normalize");
  const [useRichText, setUseRichText] = useState(false);
  const [inputHtml, setInputHtml] = useState("");
  const [outputHtml, setOutputHtml] = useState("");


  // Combine rules
  const allRules = useMemo(() => {
    return mergeRules(customRules, includeDefaultRules);
  }, [customRules, includeDefaultRules]);

  // Active rules count
  const activeRulesCount = useMemo(() => {
    return allRules.filter((r) => enabledCategories.has(r.category)).length;
  }, [allRules, enabledCategories]);

  /**
   * Apply normalization to HTML while preserving structure
   */
  const normalizeHtml = useCallback((html: string, rules: NormalizationRule[], categories: Set<string>) => {
    // Create a temporary div to parse HTML
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const allChanges: NormalizationChange[] = [];

    // Walk through all text nodes
    const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT, null);
    const textNodes: Text[] = [];

    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node as Text);
    }

    // Apply normalization to each text node
    for (const textNode of textNodes) {
      const originalText = textNode.textContent || '';
      if (!originalText.trim()) continue;

      const { result, changes } = applyNormalizationRules(originalText, rules, categories);

      if (result !== originalText) {
        textNode.textContent = result;
        allChanges.push(...changes);
      }
    }

    return { result: temp.innerHTML, changes: allChanges };
  }, []);

  /**
   * Perform normalization
   */
  const performNormalization = useCallback(() => {
    if (!inputText.trim()) {
      setOutputText("");
      setOutputHtml("");
      setChanges([]);
      return;
    }

    // Apply normalization to plain text
    const { result, changes: newChanges } = applyNormalizationRules(
      inputText,
      allRules,
      enabledCategories
    );

    setOutputText(result);
    setChanges(newChanges);

    // If in rich text mode, also normalize the HTML
    if (useRichText && inputHtml) {
      const { result: htmlResult } = normalizeHtml(inputHtml, allRules, enabledCategories);
      setOutputHtml(htmlResult);
    } else {
      setOutputHtml("");
    }
  }, [inputText, inputHtml, allRules, enabledCategories, useRichText, normalizeHtml]);

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

    if (savedInput) {
      setInputText(savedInput);
    }
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
    setInputHtml("");
    setOutputText("");
    setOutputHtml("");
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
   * Escape HTML special characters
   */
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  /**
   * Convert newlines to br tags
   */
  const nl2br = (text: string): string => {
    return text.replace(/\n/g, '<br/>');
  };

  /**
   * Generate diff view with HTML highlighting
   * Highlights all replacements in the OUTPUT text
   */
  const getDiffViewHtml = useCallback(() => {
    if (!showDiff || changes.length === 0) {
      return nl2br(escapeHtml(outputText));
    }

    // Build a map of unique replacements -> formatting
    const replacementFormats = new Map<string, { isBold: boolean; isItalic: boolean }>();

    for (const change of changes) {
      // Skip if already processed (use the first category for duplicates)
      if (replacementFormats.has(change.replacement)) continue;

      const isBold = BOLD_CATEGORIES.includes(change.category);
      const isItalic = ITALIC_CATEGORIES.includes(change.category);
      replacementFormats.set(change.replacement, { isBold, isItalic });
    }

    // Sort replacements by length (longest first) to avoid partial matches
    const sortedReplacements = [...replacementFormats.keys()].sort((a, b) => b.length - a.length);

    // Find all occurrences in the output text
    const highlights: { start: number; end: number; text: string; isBold: boolean; isItalic: boolean }[] = [];

    for (const replacement of sortedReplacements) {
      const format = replacementFormats.get(replacement)!;
      let pos = 0;
      while ((pos = outputText.indexOf(replacement, pos)) !== -1) {
        // Check if this position overlaps with existing highlight
        const overlaps = highlights.some(
          h => (pos >= h.start && pos < h.end) || (pos + replacement.length > h.start && pos + replacement.length <= h.end)
        );
        if (!overlaps) {
          highlights.push({
            start: pos,
            end: pos + replacement.length,
            text: replacement,
            isBold: format.isBold,
            isItalic: format.isItalic,
          });
        }
        pos += replacement.length;
      }
    }

    // Sort by position
    highlights.sort((a, b) => a.start - b.start);

    // Build result
    let result = '';
    let lastEnd = 0;

    for (const h of highlights) {
      // Add text before this highlight
      if (h.start > lastEnd) {
        result += escapeHtml(outputText.slice(lastEnd, h.start));
      }

      const escapedText = escapeHtml(h.text);
      if (h.isBold) {
        result += `<strong class="text-green-600 dark:text-green-400">${escapedText}</strong>`;
      } else if (h.isItalic) {
        result += `<em class="text-blue-600 dark:text-blue-400">${escapedText}</em>`;
      } else {
        result += `<mark class="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-0.5 rounded">${escapedText}</mark>`;
      }

      lastEnd = h.end;
    }

    // Add remaining text
    if (lastEnd < outputText.length) {
      result += escapeHtml(outputText.slice(lastEnd));
    }

    return nl2br(result);
  }, [outputText, changes, showDiff]);

  /**
   * Generate formatted output HTML (bold for scriptures, italic for terms)
   * Non-diff mode - just show plain output with optional formatting
   */
  const getFormattedOutputHtml = useCallback(() => {
    // In non-diff mode, just show the plain escaped output
    return nl2br(escapeHtml(outputText));
  }, [outputText]);


  return (
    <TooltipProvider>
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        {/* Compact Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Zap className="w-6 h-6 text-primary" />
                {t("Нормалізація текстів", "Text Normalization")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t(
                  "Автоматичне виправлення за редакційними стандартами BBT",
                  "Automatic correction per BBT editorial standards"
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Quick stats */}
              <Badge variant="outline" className="gap-1">
                <Type className="w-3 h-3" />
                {inputText.length} {t("симв.", "chars")}
              </Badge>
              <Badge variant={changes.length > 0 ? "default" : "outline"} className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {changes.length} {t("змін", "changes")}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <BookOpen className="w-3 h-3" />
                {activeRulesCount} {t("правил", "rules")}
              </Badge>
              {/* Links */}
              <Link to="/tools/transliteration">
                <Button variant="ghost" size="sm" className="h-7">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {t("Транслітерація", "Translit")}
                </Button>
              </Link>
              <a
                href="https://docs.google.com/spreadsheets/d/1YZT4-KaQBeEZu7R9qysirdt8yb-9psOIkXCalDPLuwY/edit?gid=627477148#gid=627477148"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="sm" className="h-7">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  {t("Правила", "Rules")}
                </Button>
              </a>
            </div>
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

            {/* Change breakdown by category - compact */}
            {Object.keys(changeStats).length > 0 && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {t("За категоріями:", "By category:")}
                  </span>
                  {Object.entries(changeStats).map(([categoryId, count]) => {
                    const category = ruleCategories.find((c) => c.id === categoryId);
                    return (
                      <Badge key={categoryId} variant="outline" className="text-xs py-0">
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

            {/* Split Panel Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[500px]">
              {/* Input Panel */}
              <div className="flex flex-col border rounded-lg overflow-hidden bg-card shadow-sm">
                {/* Input Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t("Вхідний текст", "Input")}</span>
                    <Badge variant="outline" className="text-xs py-0 h-5">
                      {inputWords} {t("слів", "words")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={useRichText ? "default" : "ghost"}
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setUseRichText(!useRichText)}
                        >
                          <Pilcrow className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {useRichText
                          ? t("Перейти до простого тексту", "Switch to plain text")
                          : t("Форматований текст (Bold/Italic)", "Rich text (Bold/Italic)")}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClear}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("Очистити", "Clear")}</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                {/* Input Area - Textarea or Rich Text */}
                {useRichText ? (
                  <Suspense fallback={<div className="flex-1 p-4 text-muted-foreground">{t("Завантаження...", "Loading...")}</div>}>
                    <RichTextEditor
                      value={inputHtml}
                      onChange={setInputHtml}
                      onTextChange={setInputText}
                      placeholder={t(
                        "Вставте текст для нормалізації...",
                        "Paste text to normalize..."
                      )}
                      className="flex-1 border-0 rounded-none shadow-none"
                      editorClassName="min-h-[400px]"
                    />
                  </Suspense>
                ) : (
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t(
                      "Вставте текст для нормалізації...\n\nПриклад:\nСанн'ясі повинен читати Бгаґавад-ґіту кожного дня.",
                      "Paste text to normalize...\n\nExample:\nSannyasi should read Bhagavad-gita every day."
                    )}
                    className="flex-1 resize-none border-0 rounded-none font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    spellCheck={false}
                  />
                )}
              </div>

              {/* Output Panel */}
              <div className="flex flex-col border rounded-lg overflow-hidden bg-card shadow-sm">
                {/* Output Toolbar */}
                <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${changes.length > 0 ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-medium">{t("Результат", "Result")}</span>
                    {changes.length > 0 && (
                      <Badge className="text-xs py-0 h-5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {changes.length} {t("змін", "changes")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={showDiff ? "default" : "ghost"}
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setShowDiff(!showDiff)}
                        >
                          {showDiff ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {showDiff ? t("Сховати підсвічування", "Hide highlights") : t("Показати підсвічування", "Show highlights")}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyToClipboard(outputText)}
                          disabled={!outputText}
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("Копіювати", "Copy")}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={exportResult}
                          disabled={!outputText}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>{t("Завантажити", "Download")}</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                {/* Output Area - HTML with highlighting or formatted output */}
                <div className="relative flex-1">
                  <div
                    className={`absolute inset-0 p-4 overflow-y-auto leading-relaxed bg-muted/10 ${useRichText && outputHtml ? 'prose prose-sm dark:prose-invert max-w-none' : 'font-mono text-sm'}`}
                    style={{ wordBreak: 'break-word' }}
                    dangerouslySetInnerHTML={{
                      __html: useRichText && outputHtml
                        ? outputHtml
                        : outputText
                          ? showDiff
                            ? getDiffViewHtml()
                            : getFormattedOutputHtml()
                          : `<span class="text-muted-foreground/50">${t("Результат з'явиться автоматично...", "Result appears automatically...")}</span>`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Legend */}
            {showDiff && changes.length > 0 && (
              <div className="px-4 py-2">
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <mark className="bg-green-200 dark:bg-green-800 px-1 rounded">abc</mark>
                    {t("— типографіка/терміни", "— typography/terms")}
                  </span>
                  <span className="flex items-center gap-1">
                    <strong className="text-green-600 dark:text-green-400">abc</strong>
                    {t("— назви текстів", "— scripture names")}
                  </span>
                  <span className="flex items-center gap-1">
                    <em className="text-blue-600 dark:text-blue-400">abc</em>
                    {t("— транслітерація", "— transliteration")}
                  </span>
                </div>
              </div>
            )}

            {/* Changes list - collapsible */}
            {changes.length > 0 && (
              <Collapsible className="px-4 pb-4">
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:text-primary">
                  <ChevronRight className="w-4 h-4 transition-transform data-[state=open]:rotate-90" />
                  {t("Список змін", "Change list")} ({changes.length})
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="max-h-48 overflow-y-auto rounded-lg border bg-muted/20 p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {changes.slice(0, 50).map((change, idx) => (
                        <div
                          key={idx}
                          className="text-xs p-2 rounded bg-background flex items-center gap-2"
                        >
                          <span className="text-red-500 line-through">{change.original}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-green-600 font-medium">{change.replacement}</span>
                        </div>
                      ))}
                    </div>
                    {changes.length > 50 && (
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        {t(`...та ще ${changes.length - 50} змін`, `...and ${changes.length - 50} more changes`)}
                      </p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
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
    </TooltipProvider>
  );
}
