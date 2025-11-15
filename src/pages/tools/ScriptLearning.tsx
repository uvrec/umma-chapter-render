// src/pages/tools/ScriptLearning.tsx
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { convertIASTtoUkrainian, devanagariToIAST, bengaliToIAST } from "@/utils/textNormalizer";
import { supabase } from "@/integrations/supabase/client";
import { extractAllTerms, calculateTermUsage, GlossaryTerm } from "@/utils/glossaryParser";
import { getLearningWords, saveLearningWords, removeLearningWord, LearningWord } from "@/utils/learningWords";
import { getLearningVerses, saveLearningVerses, removeLearningVerse, LearningVerse } from "@/utils/learningVerses";
import {
  Volume2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  BookOpen,
  Languages,
  Trophy,
  Star,
  Shuffle,
  RotateCcw,
  Download,
  ListPlus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

// ===== ТИПИ =====

type ScriptType = "devanagari" | "bengali";
type LetterType = "vowel" | "consonant";
type DifficultyLevel = "beginner" | "intermediate" | "advanced";
type LearningMode = "alphabet" | "words" | "slokas" | "custom";

interface Letter {
  script: string;
  iast: string;
  ukrainian: string;
  audio?: string;
  type: LetterType;
}

interface WordCard {
  script: string;
  iast: string;
  ukrainian: string;
  meaning: string;
  usageCount?: number;
  book?: string;
}

interface LearningStats {
  correct: number;
  incorrect: number;
  total: number;
  streak: number;
  bestStreak: number;
}

// ===== ДАНІ АЛФАВІТІВ =====

const DEVANAGARI_ALPHABET: Letter[] = [
  // Голосні
  { script: "अ", iast: "a", ukrainian: "а", type: "vowel" },
  { script: "आ", iast: "ā", ukrainian: "а̄", type: "vowel" },
  { script: "इ", iast: "i", ukrainian: "і", type: "vowel" },
  { script: "ई", iast: "ī", ukrainian: "ī", type: "vowel" },
  { script: "उ", iast: "u", ukrainian: "у", type: "vowel" },
  { script: "ऊ", iast: "ū", ukrainian: "ӯ", type: "vowel" },
  { script: "ऋ", iast: "ṛ", ukrainian: "р̣", type: "vowel" },
  { script: "ॠ", iast: "ṝ", ukrainian: "р̣̄", type: "vowel" },
  { script: "ऌ", iast: "ḷ", ukrainian: "л̣", type: "vowel" },
  { script: "ए", iast: "e", ukrainian: "е", type: "vowel" },
  { script: "ऐ", iast: "ai", ukrainian: "аі", type: "vowel" },
  { script: "ओ", iast: "o", ukrainian: "о", type: "vowel" },
  { script: "औ", iast: "au", ukrainian: "ау", type: "vowel" },
  
  // Приголосні
  { script: "क", iast: "ka", ukrainian: "ка", type: "consonant" },
  { script: "ख", iast: "kha", ukrainian: "кха", type: "consonant" },
  { script: "ग", iast: "ga", ukrainian: "ґа", type: "consonant" },
  { script: "घ", iast: "gha", ukrainian: "ґга", type: "consonant" },
  { script: "ङ", iast: "ṅa", ukrainian: "н̇а", type: "consonant" },
  { script: "च", iast: "ca", ukrainian: "ча", type: "consonant" },
  { script: "छ", iast: "cha", ukrainian: "чха", type: "consonant" },
  { script: "ज", iast: "ja", ukrainian: "джа", type: "consonant" },
  { script: "झ", iast: "jha", ukrainian: "джха", type: "consonant" },
  { script: "ञ", iast: "ña", ukrainian: "н̃а", type: "consonant" },
  { script: "ट", iast: "ṭa", ukrainian: "т̣а", type: "consonant" },
  { script: "ठ", iast: "ṭha", ukrainian: "т̣ха", type: "consonant" },
  { script: "ड", iast: "ḍa", ukrainian: "д̣а", type: "consonant" },
  { script: "ढ", iast: "ḍha", ukrainian: "д̣га", type: "consonant" },
  { script: "ण", iast: "ṇa", ukrainian: "н̣а", type: "consonant" },
  { script: "त", iast: "ta", ukrainian: "та", type: "consonant" },
  { script: "थ", iast: "tha", ukrainian: "тха", type: "consonant" },
  { script: "द", iast: "da", ukrainian: "да", type: "consonant" },
  { script: "ध", iast: "dha", ukrainian: "дга", type: "consonant" },
  { script: "न", iast: "na", ukrainian: "на", type: "consonant" },
  { script: "प", iast: "pa", ukrainian: "па", type: "consonant" },
  { script: "फ", iast: "pha", ukrainian: "пха", type: "consonant" },
  { script: "ब", iast: "ba", ukrainian: "ба", type: "consonant" },
  { script: "भ", iast: "bha", ukrainian: "бга", type: "consonant" },
  { script: "म", iast: "ma", ukrainian: "ма", type: "consonant" },
  { script: "य", iast: "ya", ukrainian: "йа", type: "consonant" },
  { script: "र", iast: "ra", ukrainian: "ра", type: "consonant" },
  { script: "ल", iast: "la", ukrainian: "ла", type: "consonant" },
  { script: "व", iast: "va", ukrainian: "ва", type: "consonant" },
  { script: "श", iast: "śa", ukrainian: "ш́а", type: "consonant" },
  { script: "ष", iast: "ṣa", ukrainian: "ша", type: "consonant" },
  { script: "स", iast: "sa", ukrainian: "са", type: "consonant" },
  { script: "ह", iast: "ha", ukrainian: "ха", type: "consonant" },
];

const BENGALI_ALPHABET: Letter[] = [
  // Голосні
  { script: "অ", iast: "a", ukrainian: "а", type: "vowel" },
  { script: "আ", iast: "ā", ukrainian: "а̄", type: "vowel" },
  { script: "ই", iast: "i", ukrainian: "і", type: "vowel" },
  { script: "ঈ", iast: "ī", ukrainian: "ī", type: "vowel" },
  { script: "উ", iast: "u", ukrainian: "у", type: "vowel" },
  { script: "ঊ", iast: "ū", ukrainian: "ӯ", type: "vowel" },
  { script: "ঋ", iast: "ṛ", ukrainian: "р̣", type: "vowel" },
  { script: "এ", iast: "e", ukrainian: "е", type: "vowel" },
  { script: "ঐ", iast: "ai", ukrainian: "аі", type: "vowel" },
  { script: "ও", iast: "o", ukrainian: "о", type: "vowel" },
  { script: "ঔ", iast: "au", ukrainian: "ау", type: "vowel" },
  
  // Приголосні
  { script: "ক", iast: "ka", ukrainian: "ка", type: "consonant" },
  { script: "খ", iast: "kha", ukrainian: "кха", type: "consonant" },
  { script: "গ", iast: "ga", ukrainian: "ґа", type: "consonant" },
  { script: "ঘ", iast: "gha", ukrainian: "ґга", type: "consonant" },
  { script: "ঙ", iast: "ṅa", ukrainian: "н̇а", type: "consonant" },
  { script: "চ", iast: "ca", ukrainian: "ча", type: "consonant" },
  { script: "ছ", iast: "cha", ukrainian: "чха", type: "consonant" },
  { script: "জ", iast: "ja", ukrainian: "джа", type: "consonant" },
  { script: "ঝ", iast: "jha", ukrainian: "джха", type: "consonant" },
  { script: "ঞ", iast: "ña", ukrainian: "н̃а", type: "consonant" },
  { script: "ট", iast: "ṭa", ukrainian: "т̣а", type: "consonant" },
  { script: "ঠ", iast: "ṭha", ukrainian: "т̣ха", type: "consonant" },
  { script: "ড", iast: "ḍa", ukrainian: "д̣а", type: "consonant" },
  { script: "ঢ", iast: "ḍha", ukrainian: "д̣га", type: "consonant" },
  { script: "ণ", iast: "ṇa", ukrainian: "н̣а", type: "consonant" },
  { script: "ত", iast: "ta", ukrainian: "та", type: "consonant" },
  { script: "থ", iast: "tha", ukrainian: "тха", type: "consonant" },
  { script: "দ", iast: "da", ukrainian: "да", type: "consonant" },
  { script: "ধ", iast: "dha", ukrainian: "дга", type: "consonant" },
  { script: "ন", iast: "na", ukrainian: "на", type: "consonant" },
  { script: "প", iast: "pa", ukrainian: "па", type: "consonant" },
  { script: "ফ", iast: "pha", ukrainian: "пха", type: "consonant" },
  { script: "ব", iast: "ba", ukrainian: "ба", type: "consonant" },
  { script: "ভ", iast: "bha", ukrainian: "бга", type: "consonant" },
  { script: "ম", iast: "ma", ukrainian: "ма", type: "consonant" },
  { script: "য", iast: "ya", ukrainian: "йа", type: "consonant" },
  { script: "র", iast: "ra", ukrainian: "ра", type: "consonant" },
  { script: "ল", iast: "la", ukrainian: "ла", type: "consonant" },
  { script: "ব", iast: "va", ukrainian: "ва", type: "consonant" },
  { script: "শ", iast: "śa", ukrainian: "ш́а", type: "consonant" },
  { script: "ষ", iast: "ṣa", ukrainian: "ша", type: "consonant" },
  { script: "স", iast: "sa", ukrainian: "са", type: "consonant" },
  { script: "হ", iast: "ha", ukrainian: "ха", type: "consonant" },
];

// Популярні слова для практики
const COMMON_WORDS = {
  devanagari: [
    { script: "कृष्ण", iast: "kṛṣṇa", ukrainian: "Кр̣шна", meaning: "Кр̣ш̣н̣а" },
    { script: "गुरु", iast: "guru", ukrainian: "ґуру", meaning: "духовний вчитель" },
    { script: "भक्ति", iast: "bhakti", ukrainian: "бгакті", meaning: "відданість" },
    { script: "प्रभुपाद", iast: "prabhupāda", ukrainian: "Прабгупа̄да", meaning: "Прабгупа̄да" },
    { script: "मंत्र", iast: "mantra", ukrainian: "мантра", meaning: "мантра" },
    { script: "योग", iast: "yoga", ukrainian: "йоґа", meaning: "йоґа" },
    { script: "धर्म", iast: "dharma", ukrainian: "дгарма", meaning: "релігійний обов'язок" },
    { script: "कर्म", iast: "karma", ukrainian: "карма", meaning: "діяльність" },
  ],
  bengali: [
    { script: "কৃষ্ণ", iast: "kṛṣṇa", ukrainian: "Кр̣шна", meaning: "Кр̣ш̣н̣а" },
    { script: "গৌর", iast: "gaura", ukrainian: "Ґаура", meaning: "Золотий (Чаітанйа)" },
    { script: "নিতাই", iast: "nitāi", ukrainian: "Ніта̄ї", meaning: "Ніта̄ї" },
    { script: "চৈতন্য", iast: "caitanya", ukrainian: "Чаітанйа", meaning: "Чаітанйа" },
    { script: "প্রভু", iast: "prabhu", ukrainian: "прабгу", meaning: "господар" },
    { script: "ভক্ত", iast: "bhakta", ukrainian: "бгакта", meaning: "відданий" },
    { script: "প্রেম", iast: "prema", ukrainian: "према", meaning: "божественна любов" },
    { script: "নাম", iast: "nāma", ukrainian: "на̄ма", meaning: "ім'я" },
  ]
};

// ===== ОСНОВНИЙ КОМПОНЕНТ =====

export default function ScriptLearning() {
  const { t, language } = useLanguage();

  const [scriptType, setScriptType] = useState<ScriptType>("devanagari");
  const [letterType, setLetterType] = useState<LetterType | "all">("all");
  const [learningMode, setLearningMode] = useState<LearningMode>("alphabet");
  const [mode, setMode] = useState<"flashcards" | "quiz" | "practice">("flashcards");
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [customWords, setCustomWords] = useState<WordCard[]>([]);
  const [importedWords, setImportedWords] = useState<WordCard[]>([]);
  const [learningVerses, setLearningVerses] = useState<LearningVerse[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState<LearningStats>({
    correct: 0,
    incorrect: 0,
    total: 0,
    streak: 0,
    bestStreak: 0
  });

  // Web Speech API for pronunciation
  const speak = useCallback((text: string, lang: string = 'hi-IN') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang; // hi-IN for Hindi/Sanskrit, bn-IN for Bengali
      utterance.rate = 0.8; // Slower for learning
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error(t("Помилка відтворення звуку", "Error playing audio"));
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast.error(t("Ваш браузер не підтримує синтез мовлення", "Your browser doesn't support speech synthesis"));
    }
  }, [t]);

  // Play pronunciation for current item
  const playPronunciation = () => {
    if (learningMode === "alphabet" && currentLetter) {
      const lang = scriptType === "devanagari" ? "hi-IN" : "bn-IN";
      speak(currentLetter.script, lang);
    } else if (learningMode === "words" && currentItem && 'script' in currentItem) {
      // Determine language based on script content
      const lang = "hi-IN"; // Default to Sanskrit/Hindi
      speak(currentItem.script, lang);
    } else if (learningMode === "slokas" && currentItem && 'sanskritText' in currentItem) {
      // Speak the Sanskrit text of the verse
      speak(currentItem.sanskritText, "hi-IN");
    }
  };

  // Fetch glossary terms from Supabase
  const { data: versesData = [], isLoading: isLoadingGlossary } = useQuery({
    queryKey: ['learning-glossary', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('verses')
        .select(`
          *,
          chapters!inner(
            chapter_number,
            book_id,
            canto_id,
            books(
              title_ua,
              title_en,
              slug
            ),
            cantos(
              canto_number,
              books(
                title_ua,
                title_en,
                slug
              )
            )
          )
        `);

      if (error) throw error;

      return data.map(verse => ({
        ...verse,
        book: language === 'ua'
          ? (verse.chapters.cantos?.books?.title_ua || verse.chapters.books?.title_ua)
          : (verse.chapters.cantos?.books?.title_en || verse.chapters.books?.title_en),
        synonyms: language === 'ua' ? verse.synonyms_ua : verse.synonyms_en,
        verse_number: verse.verse_number
      }));
    }
  });

  // Process glossary terms
  const allGlossaryTerms = extractAllTerms(versesData);
  const termsWithUsage = calculateTermUsage(allGlossaryTerms);

  // Convert top glossary terms to WordCards
  const topGlossaryWords: WordCard[] = termsWithUsage
    .slice(0, 100) // Top 100 most used terms
    .map(termData => {
      const firstOccurrence = termData.allOccurrences[0];
      return {
        script: firstOccurrence.term,
        iast: firstOccurrence.term,
        ukrainian: firstOccurrence.meaning,
        meaning: firstOccurrence.meaning,
        usageCount: termData.usageCount,
        book: firstOccurrence.book
      };
    });
  
  // Отримати поточний алфавіт
  const getCurrentAlphabet = useCallback((): Letter[] => {
    const alphabet = scriptType === "devanagari" ? DEVANAGARI_ALPHABET : BENGALI_ALPHABET;
    if (letterType === "all") return alphabet;
    return alphabet.filter(l => l.type === letterType);
  }, [scriptType, letterType]);

  // Навігація
  const handleNext = () => {
    setCurrentLetterIndex((prev) => (prev + 1) % currentLearningItems.length);
    setShowAnswer(false);
  };

  const handlePrev = () => {
    setCurrentLetterIndex((prev) => (prev - 1 + currentLearningItems.length) % currentLearningItems.length);
    setShowAnswer(false);
  };

  const handleShuffle = () => {
    const randomIndex = Math.floor(Math.random() * currentLearningItems.length);
    setCurrentLetterIndex(randomIndex);
    setShowAnswer(false);
  };
  
  const handleCorrect = () => {
    setStats(prev => ({
      ...prev,
      correct: prev.correct + 1,
      total: prev.total + 1,
      streak: prev.streak + 1,
      bestStreak: Math.max(prev.bestStreak, prev.streak + 1)
    }));
    handleNext();
  };
  
  const handleIncorrect = () => {
    setStats(prev => ({
      ...prev,
      incorrect: prev.incorrect + 1,
      total: prev.total + 1,
      streak: 0
    }));
    handleNext();
  };
  
  const resetStats = () => {
    setStats({
      correct: 0,
      incorrect: 0,
      total: 0,
      streak: 0,
      bestStreak: 0
    });
    toast.success(t("Статистику скинуто", "Stats reset"));
  };

  // Import top N words from glossary
  const importTopWords = (count: number = 50) => {
    const wordsToImport = topGlossaryWords.slice(0, count);
    setImportedWords(prev => {
      const newWords = wordsToImport.filter(
        word => !prev.some(w => w.iast === word.iast)
      );
      if (newWords.length > 0) {
        toast.success(t(
          `Імпортовано ${newWords.length} нових слів`,
          `Imported ${newWords.length} new words`
        ));
      } else {
        toast.info(t("Всі ці слова вже імпортовані", "All these words are already imported"));
      }
      return [...prev, ...newWords];
    });
    setLearningMode("words");
  };

  // Add custom word
  const addCustomWord = (word: WordCard) => {
    setCustomWords(prev => [...prev, word]);
    toast.success(t("Слово додано", "Word added"));
  };

  // Remove word from imported (by iast)
  const removeImportedWord = (iast: string) => {
    removeLearningWord(iast);
    setImportedWords(prev => prev.filter((word) => word.iast !== iast));
    toast.success(t("Слово видалено", "Word removed"));
  };

  // Get current learning items based on mode
  const getCurrentLearningItems = () => {
    if (learningMode === "alphabet") {
      return getCurrentAlphabet();
    } else if (learningMode === "words") {
      return importedWords.length > 0 ? importedWords : topGlossaryWords.slice(0, 20);
    } else if (learningMode === "slokas") {
      return learningVerses;
    } else if (learningMode === "custom") {
      return customWords;
    }
    return [];
  };

  const currentLearningItems = getCurrentLearningItems();
  const currentAlphabet = getCurrentAlphabet();
  const currentLetter = currentAlphabet[currentLetterIndex];
  const currentItem = currentLearningItems[currentLetterIndex];

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  
  // Load data from LocalStorage on mount
  useEffect(() => {
    try {
      // Use the learning words utility for imported words from verses
      const savedLearningWords = getLearningWords();
      if (savedLearningWords.length > 0) {
        setImportedWords(savedLearningWords);
      }

      // Custom words still use direct localStorage (for now)
      const savedCustomWords = localStorage.getItem('scriptLearning_customWords');
      if (savedCustomWords) {
        setCustomWords(JSON.parse(savedCustomWords));
      }

      // Stats use direct localStorage
      const savedStats = localStorage.getItem('scriptLearning_stats');
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error('Error loading from LocalStorage:', error);
    }
  }, []);

  // Save imported words to LocalStorage using utility
  useEffect(() => {
    try {
      saveLearningWords(importedWords);
    } catch (error) {
      console.error('Error saving imported words to LocalStorage:', error);
    }
  }, [importedWords]);

  // Save custom words to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('scriptLearning_customWords', JSON.stringify(customWords));
    } catch (error) {
      console.error('Error saving custom words to LocalStorage:', error);
    }
  }, [customWords]);

  // Save stats to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('scriptLearning_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats to LocalStorage:', error);
    }
  }, [stats]);

  // Load learning verses from LocalStorage on mount
  useEffect(() => {
    try {
      const savedVerses = getLearningVerses();
      if (savedVerses.length > 0) {
        setLearningVerses(savedVerses);
      }
    } catch (error) {
      console.error('Error loading learning verses from LocalStorage:', error);
    }
  }, []);

  // Save learning verses to LocalStorage
  useEffect(() => {
    try {
      saveLearningVerses(learningVerses);
    } catch (error) {
      console.error('Error saving learning verses to LocalStorage:', error);
    }
  }, [learningVerses]);

  // Скинути індекс при зміні фільтрів
  useEffect(() => {
    setCurrentLetterIndex(0);
    setShowAnswer(false);
  }, [scriptType, letterType, learningMode, importedWords.length, customWords.length, learningVerses.length]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Заголовок */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">
              {t("Вивчення санскриту та бенгалі", "Learn Sanskrit & Bengali")}
            </h1>
            <p className="text-muted-foreground">
              {t(
                "Інтерактивний інструмент для вивчення деванагарі та бенгальського письма",
                "Interactive tool for learning Devanagari and Bengali scripts"
              )}
            </p>
          </div>

          {/* Вибір режиму навчання */}
          <Tabs value={learningMode} onValueChange={(v) => setLearningMode(v as LearningMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="alphabet">
                <BookOpen className="w-4 h-4 mr-2" />
                {t("Алфавіт", "Alphabet")}
              </TabsTrigger>
              <TabsTrigger value="words">
                <Languages className="w-4 h-4 mr-2" />
                {t("Слова", "Words")}
                {importedWords.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{importedWords.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="slokas">
                <BookOpen className="w-4 h-4 mr-2" />
                {t("Шлоки", "Slokas")}
                {learningVerses.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{learningVerses.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Налаштування для алфавіту */}
          {learningMode === "alphabet" && (
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Вибір письма */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Письмо", "Script")}
                  </label>
                  <div className="flex gap-2">
                    <Button
                      variant={scriptType === "devanagari" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setScriptType("devanagari")}
                    >
                      {t("Деванагарі", "Devanagari")}
                    </Button>
                    <Button
                      variant={scriptType === "bengali" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setScriptType("bengali")}
                    >
                      {t("Бенгалі", "Bengali")}
                    </Button>
                  </div>
                </div>

                {/* Вибір типу літер */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Тип літер", "Letter Type")}
                  </label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={letterType === "all" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setLetterType("all")}
                    >
                      {t("Всі", "All")}
                    </Button>
                    <Button
                      size="sm"
                      variant={letterType === "vowel" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setLetterType("vowel")}
                    >
                      {t("Голосні", "Vowels")}
                    </Button>
                    <Button
                      size="sm"
                      variant={letterType === "consonant" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setLetterType("consonant")}
                    >
                      {t("Приголосні", "Consonants")}
                    </Button>
                  </div>
                </div>

                {/* Вибір режиму */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("Режим", "Mode")}
                  </label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={mode === "flashcards" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMode("flashcards")}
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      {t("Картки", "Cards")}
                    </Button>
                    <Button
                      size="sm"
                      variant={mode === "practice" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setMode("practice")}
                    >
                      <Languages className="w-4 h-4 mr-1" />
                      {t("Практика", "Practice")}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Інформація про шлоки */}
          {learningMode === "slokas" && (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {t("Вивчення шлок", "Learning Slokas")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {learningVerses.length === 0
                        ? t(
                            "Додайте вірші зі сторінок читання для практики",
                            "Add verses from reading pages for practice"
                          )
                        : t(
                            `У вас ${learningVerses.length} ${learningVerses.length === 1 ? 'вірш' : learningVerses.length < 5 ? 'вірші' : 'віршів'} для вивчення`,
                            `You have ${learningVerses.length} verse${learningVerses.length === 1 ? '' : 's'} to learn`
                          )}
                    </p>
                  </div>
                  {learningVerses.length > 0 && (
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {learningVerses.length}
                    </Badge>
                  )}
                </div>

                {learningVerses.length > 0 && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={mode === "flashcards" ? "default" : "outline"}
                      onClick={() => setMode("flashcards")}
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      {t("Картки", "Cards")}
                    </Button>
                    <Button
                      size="sm"
                      variant={mode === "practice" ? "default" : "outline"}
                      onClick={() => setMode("practice")}
                    >
                      <Languages className="w-4 h-4 mr-1" />
                      {t("Практика", "Practice")}
                    </Button>
                    <Button
                      onClick={() => {
                        setLearningVerses([]);
                        toast.info(t("Список віршів очищено", "Verse list cleared"));
                      }}
                      variant="outline"
                      size="sm"
                      className="ml-auto"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t("Очистити", "Clear")}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Імпорт слів з глосарію */}
          {learningMode === "words" && (
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {t("Імпорт слів з глосарію", "Import Words from Glossary")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isLoadingGlossary ? (
                        t("Завантаження...", "Loading...")
                      ) : (
                        t(
                          `Доступно ${termsWithUsage.length} унікальних термінів`,
                          `${termsWithUsage.length} unique terms available`
                        )
                      )}
                    </p>
                  </div>
                  {importedWords.length > 0 && (
                    <Badge variant="default" className="text-lg px-4 py-2">
                      {importedWords.length} {t("слів", "words")}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => importTopWords(20)}
                    disabled={isLoadingGlossary}
                    variant="default"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("Топ 20 слів", "Top 20 Words")}
                  </Button>
                  <Button
                    onClick={() => importTopWords(50)}
                    disabled={isLoadingGlossary}
                    variant="default"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("Топ 50 слів", "Top 50 Words")}
                  </Button>
                  <Button
                    onClick={() => importTopWords(100)}
                    disabled={isLoadingGlossary}
                    variant="default"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t("Топ 100 слів", "Top 100 Words")}
                  </Button>
                  {importedWords.length > 0 && (
                    <Button
                      onClick={() => {
                        setImportedWords([]);
                        toast.info(t("Список слів очищено", "Word list cleared"));
                      }}
                      variant="outline"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {t("Очистити", "Clear")}
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={mode === "flashcards" ? "default" : "outline"}
                    onClick={() => setMode("flashcards")}
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    {t("Картки", "Cards")}
                  </Button>
                  <Button
                    size="sm"
                    variant={mode === "practice" ? "default" : "outline"}
                    onClick={() => setMode("practice")}
                  >
                    <Languages className="w-4 h-4 mr-1" />
                    {t("Практика", "Practice")}
                  </Button>
                </div>
              </div>
            </Card>
          )}
          
          {/* Статистика */}
          {stats.total > 0 && (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.correct}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("Правильно", "Correct")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {stats.incorrect}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("Неправильно", "Incorrect")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {accuracy}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("Точність", "Accuracy")}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600 flex items-center gap-1">
                      {stats.streak} <Star className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("Серія", "Streak")}
                    </div>
                  </div>
                  {stats.bestStreak > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 flex items-center gap-1">
                        {stats.bestStreak} <Trophy className="w-4 h-4" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("Рекорд", "Best")}
                      </div>
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={resetStats}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  {t("Скинути", "Reset")}
                </Button>
              </div>
              <Progress value={accuracy} className="mt-3 h-2" />
            </Card>
          )}
          
          {/* Основна картка */}
          {currentLearningItems.length > 0 && (
            <Card className="p-8">
              <div className="space-y-6">

                {/* Прогрес */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {currentLetterIndex + 1} / {currentLearningItems.length}
                  </span>
                  {learningMode === "alphabet" && currentLetter && (
                    <Badge variant="outline">
                      {currentLetter?.type === "vowel" ? t("Голосна", "Vowel") : t("Приголосна", "Consonant")}
                    </Badge>
                  )}
                  {learningMode === "words" && currentItem && 'usageCount' in currentItem && (
                    <Badge variant="outline">
                      {t("Використань", "Uses")}: {currentItem.usageCount}
                    </Badge>
                  )}
                </div>

                {/* Відображення контенту залежно від режиму */}
                {learningMode === "alphabet" && currentLetter && (
                  <>
                    {/* Літера */}
                    <div className="text-center space-y-4">
                      <div className={`text-9xl font-bold ${scriptType === "devanagari" ? "devanagari-text" : "bengali-text"}`}>
                        {currentLetter.script}
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="default"
                          size="lg"
                          onClick={playPronunciation}
                          disabled={isPlaying}
                        >
                          <Volume2 className={`w-5 h-5 mr-2 ${isPlaying ? "animate-pulse" : ""}`} />
                          {isPlaying ? t("Відтворюється...", "Playing...") : t("Прослухати", "Listen")}
                        </Button>

                        {mode === "flashcards" && (
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setShowAnswer(!showAnswer)}
                          >
                            {showAnswer
                              ? t("Сховати відповідь", "Hide Answer")
                              : t("Показати відповідь", "Show Answer")
                            }
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Відповідь для літери */}
                    {(showAnswer || mode === "practice") && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">IAST</div>
                            <div className="text-2xl font-semibold iast-text">{currentLetter.iast}</div>
                          </div>
                          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">
                              {t("Українська", "Ukrainian")}
                            </div>
                            <div className="text-2xl font-semibold">{currentLetter.ukrainian}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {learningMode === "words" && currentItem && 'meaning' in currentItem && (
                  <>
                    {/* Слово */}
                    <div className="text-center space-y-4">
                      <div className="text-6xl font-bold sanskrit-text">
                        {currentItem.script}
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="default"
                          size="lg"
                          onClick={playPronunciation}
                          disabled={isPlaying}
                        >
                          <Volume2 className={`w-5 h-5 mr-2 ${isPlaying ? "animate-pulse" : ""}`} />
                          {isPlaying ? t("Відтворюється...", "Playing...") : t("Прослухати", "Listen")}
                        </Button>

                        {mode === "flashcards" && (
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setShowAnswer(!showAnswer)}
                          >
                            {showAnswer
                              ? t("Сховати відповідь", "Hide Answer")
                              : t("Показати відповідь", "Show Answer")
                            }
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Відповідь для слова */}
                    {(showAnswer || mode === "practice") && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">IAST</div>
                            <div className="text-2xl font-semibold iast-text">{currentItem.iast}</div>
                          </div>
                          <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-1">
                              {t("Переклад", "Translation")}
                            </div>
                            <div className="text-2xl font-semibold">{currentItem.meaning}</div>
                          </div>
                        </div>
                        {currentItem.book && (
                          <div className="text-center text-sm text-muted-foreground">
                            {t("Джерело", "Source")}: {currentItem.book}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {learningMode === "slokas" && currentItem && 'sanskritText' in currentItem && (
                  <>
                    {/* Вірш */}
                    <div className="text-center space-y-4">
                      <div className="text-sm text-muted-foreground">
                        {currentItem.verseNumber} {currentItem.bookName && `— ${currentItem.bookName}`}
                      </div>

                      <div className="text-4xl font-bold sanskrit-text leading-relaxed">
                        {currentItem.sanskritText}
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="default"
                          size="lg"
                          onClick={playPronunciation}
                          disabled={isPlaying}
                        >
                          <Volume2 className={`w-5 h-5 mr-2 ${isPlaying ? "animate-pulse" : ""}`} />
                          {isPlaying ? t("Відтворюється...", "Playing...") : t("Прослухати", "Listen")}
                        </Button>

                        {mode === "flashcards" && (
                          <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setShowAnswer(!showAnswer)}
                          >
                            {showAnswer
                              ? t("Сховати відповідь", "Hide Answer")
                              : t("Показати відповідь", "Show Answer")
                            }
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Відповідь для вірша */}
                    {(showAnswer || mode === "practice") && (
                      <div className="space-y-4 animate-fade-in">
                        {currentItem.transliteration && (
                          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-2">
                              {t("Транслітерація", "Transliteration")}
                            </div>
                            <div className="text-lg font-medium iast-text leading-relaxed">
                              {currentItem.transliteration}
                            </div>
                          </div>
                        )}

                        <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                          <div className="text-sm text-muted-foreground mb-2">
                            {t("Переклад", "Translation")}
                          </div>
                          <div className="text-lg leading-relaxed">
                            {currentItem.translation}
                          </div>
                        </div>

                        {currentItem.commentary && (
                          <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                            <div className="text-sm text-muted-foreground mb-2">
                              {t("Коментар", "Commentary")}
                            </div>
                            <div className="text-sm leading-relaxed line-clamp-6">
                              {currentItem.commentary}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

              {/* Кнопки навігації */}
              <div className="flex items-center justify-center gap-3 pt-4">
                <Button onClick={handlePrev} variant="outline" size="lg">
                  ← {t("Попередня", "Previous")}
                </Button>
                
                <Button onClick={handleShuffle} variant="outline" size="icon">
                  <Shuffle className="w-4 h-4" />
                </Button>
                
                {mode === "practice" && showAnswer && (
                  <>
                    <Button onClick={handleIncorrect} variant="destructive" size="lg">
                      <XCircle className="w-5 h-5 mr-2" />
                      {t("Помилка", "Wrong")}
                    </Button>
                    <Button onClick={handleCorrect} variant="default" size="lg" className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      {t("Правильно", "Correct")}
                    </Button>
                  </>
                )}
                
                <Button onClick={handleNext} variant="outline" size="lg">
                  {t("Наступна", "Next")} →
                </Button>
              </div>
            </div>
          </Card>
          )}

          {/* Таблиця алфавіту - тільки для режиму алфавіту */}
          {learningMode === "alphabet" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("Повний алфавіт", "Full Alphabet")}
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {currentAlphabet.map((letter, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentLetterIndex(index)}
                    className={`
                      p-3 rounded-lg border-2 transition-all hover:scale-105
                      ${index === currentLetterIndex
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                      }
                    `}
                  >
                    <div className={`text-3xl ${scriptType === "devanagari" ? "devanagari-text" : "bengali-text"}`}>
                      {letter.script}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 iast-text">
                      {letter.iast}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Список імпортованих слів - тільки для режиму слів */}
          {learningMode === "words" && importedWords.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {t("Імпортовані слова", "Imported Words")}
                </h3>
                <Badge variant="secondary">{importedWords.length} {t("слів", "words")}</Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {importedWords.map((word, index) => (
                  <div
                    key={index}
                    className={`
                      relative p-3 rounded-lg border-2 transition-all group
                      ${index === currentLetterIndex
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                      }
                    `}
                  >
                    <button
                      onClick={() => setCurrentLetterIndex(index)}
                      className="w-full text-left"
                    >
                      <div className="text-2xl font-bold sanskrit-text">
                        {word.script}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 iast-text">
                        {word.iast}
                      </div>
                      {word.usageCount && (
                        <div className="text-xs text-muted-foreground">
                          {t("Використань", "Uses")}: {word.usageCount}
                        </div>
                      )}
                      {word.verseReference && (
                        <div className="text-xs text-green-600 mt-1">
                          {t("З вірша", "From verse")}: {word.verseReference}
                        </div>
                      )}
                      {word.book && (
                        <div className="text-xs text-blue-600">
                          {word.book}
                        </div>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImportedWord(word.iast);
                      }}
                      className="absolute top-1 right-1 p-1 rounded-md bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      title={t("Видалити", "Remove")}
                      aria-label={`${t("Видалити", "Remove")} ${word.script}`}
                    >
                      <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Список збережених віршів - тільки для режиму шлок */}
          {learningMode === "slokas" && learningVerses.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {t("Збережені вірші", "Saved Verses")}
                </h3>
                <Badge variant="secondary">{learningVerses.length}</Badge>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {learningVerses.map((verse, index) => (
                  <div
                    key={verse.verseId}
                    className={`
                      relative p-4 rounded-lg border-2 transition-all group cursor-pointer
                      ${index === currentLetterIndex
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                      }
                    `}
                    onClick={() => setCurrentLetterIndex(index)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-sm text-muted-foreground">
                            {verse.verseNumber}
                          </div>
                          <div className="text-lg sanskrit-text font-medium mt-1 line-clamp-2">
                            {verse.sanskritText}
                          </div>
                          {verse.bookName && (
                            <div className="text-xs text-blue-600 mt-1">
                              {verse.bookName}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLearningVerse(verse.verseId);
                            setLearningVerses(prev => prev.filter(v => v.verseId !== verse.verseId));
                            toast.success(t("Вірш видалено", "Verse removed"));
                          }}
                          className="p-1 rounded-md bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 opacity-0 group-hover:opacity-100 transition-opacity"
                          title={t("Видалити", "Remove")}
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {verse.translation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Популярні слова - тільки для режиму алфавіту */}
          {learningMode === "alphabet" && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {t("Популярні слова для практики", "Common Words for Practice")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COMMON_WORDS[scriptType].map((word, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className={`text-3xl font-bold mb-2 ${scriptType === "devanagari" ? "devanagari-text" : "bengali-text"}`}>
                      {word.script}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="iast-text text-muted-foreground">
                        IAST: {word.iast}
                      </div>
                      <div className="font-medium">
                        {t("Українська", "Ukrainian")}: {word.ukrainian}
                      </div>
                      <div className="text-muted-foreground">
                        {word.meaning}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
