/**
 * PronunciationGuide - Sanskrit Pronunciation Guide page
 * Based on BBT reference app design, adapted to VedaVOICE amber/craft theme
 */

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { BookReaderHeader } from "@/components/BookReaderHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface PronunciationGuideProps {
  bookTitle: string;
  bookSlug: string;
  cantoNumber?: number;
}

interface SectionProps {
  title: string;
  titleEn?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionSection = ({
  title,
  titleEn,
  children,
  defaultOpen = false,
}: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { language } = useLanguage();

  const displayTitle = language === "uk" ? title : (titleEn || title);

  return (
    <div className="border-b border-border">
      <button
        className={cn(
          "w-full flex items-center justify-between py-4 px-2",
          "text-left font-semibold text-lg",
          "hover:text-primary transition-colors"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayTitle}</span>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="pb-6 px-2 animate-accordion-down">{children}</div>
      )}
    </div>
  );
};

// Vowels data
const VOWELS = ["अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ॠ", "लृ", "ए", "ऐ", "ओ", "औ"];
const VOWELS_TRANSLIT = ["a", "ā", "i", "ī", "u", "ū", "ṛ", "ṝ", "ḷ", "e", "ai", "o", "au"];

// Consonants data organized by category
const CONSONANTS = {
  gutturals: { devanagari: ["क", "ख", "ग", "घ", "ङ"], translit: ["ka", "kha", "ga", "gha", "ṅa"] },
  palatals: { devanagari: ["च", "छ", "ज", "झ", "ञ"], translit: ["ca", "cha", "ja", "jha", "ña"] },
  cerebrals: { devanagari: ["ट", "ठ", "ड", "ढ", "ण"], translit: ["ṭa", "ṭha", "ḍa", "ḍha", "ṇa"] },
  dentals: { devanagari: ["त", "थ", "द", "ध", "न"], translit: ["ta", "tha", "da", "dha", "na"] },
  labials: { devanagari: ["प", "फ", "ब", "भ", "म"], translit: ["pa", "pha", "ba", "bha", "ma"] },
  semivowels: { devanagari: ["य", "र", "ल", "व"], translit: ["ya", "ra", "la", "va"] },
  sibilants: { devanagari: ["श", "ष", "स"], translit: ["śa", "ṣa", "sa"] },
  aspirate: { devanagari: ["ह"], translit: ["ha"] },
};

// Numerals
const NUMERALS = [
  { devanagari: "०", arabic: "0" },
  { devanagari: "१", arabic: "1" },
  { devanagari: "२", arabic: "2" },
  { devanagari: "३", arabic: "3" },
  { devanagari: "४", arabic: "4" },
  { devanagari: "५", arabic: "5" },
  { devanagari: "६", arabic: "6" },
  { devanagari: "७", arabic: "7" },
  { devanagari: "८", arabic: "8" },
  { devanagari: "९", arabic: "9" },
];

// Vowels after consonant (mātrās)
const MATRAS = [
  { matra: "ा", vowel: "ā", example: "का", exampleTranslit: "kā" },
  { matra: "ि", vowel: "i", example: "कि", exampleTranslit: "ki" },
  { matra: "ी", vowel: "ī", example: "की", exampleTranslit: "kī" },
  { matra: "ु", vowel: "u", example: "कु", exampleTranslit: "ku" },
  { matra: "ू", vowel: "ū", example: "कू", exampleTranslit: "kū" },
  { matra: "ृ", vowel: "ṛ", example: "कृ", exampleTranslit: "kṛ" },
  { matra: "े", vowel: "e", example: "के", exampleTranslit: "ke" },
  { matra: "ै", vowel: "ai", example: "कै", exampleTranslit: "kai" },
  { matra: "ो", vowel: "o", example: "को", exampleTranslit: "ko" },
  { matra: "ौ", vowel: "au", example: "कौ", exampleTranslit: "kau" },
];

// Ligatures examples
const LIGATURES = [
  { devanagari: "क्ष", translit: "kṣa" },
  { devanagari: "त्र", translit: "tra" },
  { devanagari: "ज्ञ", translit: "jña" },
];

export const PronunciationGuide = ({
  bookTitle,
  bookSlug,
  cantoNumber,
}: PronunciationGuideProps) => {
  const { language, t } = useLanguage();

  const consonantLabels = {
    uk: {
      gutturals: "Гортанні",
      palatals: "Палатальні",
      cerebrals: "Церебральні",
      dentals: "Зубні",
      labials: "Губні",
      semivowels: "Напівголосні",
      sibilants: "Шиплячі",
      aspirate: "Придиховий",
    },
    en: {
      gutturals: "Gutturals",
      palatals: "Palatals",
      cerebrals: "Cerebrals",
      dentals: "Dentals",
      labials: "Labials",
      semivowels: "Semivowels",
      sibilants: "Sibilants",
      aspirate: "Aspirate",
    },
  };

  const labels = language === "uk" ? consonantLabels.uk : consonantLabels.en;

  return (
    <div className="min-h-screen bg-background">
      <BookReaderHeader
        bookTitle={bookTitle}
        bookSlug={bookSlug}
        cantoNumber={cantoNumber}
        introTitle={t("Вимова санскриту", "Sanskrit Pronunciation Guide")}
      />

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1
          className="text-2xl font-bold text-center mb-8 text-foreground"
          style={{ fontFamily: "var(--font-primary)" }}
        >
          {t("Як читати санскрит", "Sanskrit Pronunciation Guide")}
        </h1>

        {/* Introduction */}
        <AccordionSection
          title="Санскритський алфавіт"
          titleEn="Sanskrit Alphabet"
          defaultOpen={true}
        >
          <p className="text-foreground leading-relaxed mb-4">
            {language === "uk"
              ? "Санскритські слова та цитати наведені в книзі курсивом. Система транслітерації, використана в книзі, ґрунтується на системі латинської транслітерації санскриту з діакритичними знаками."
              : "Throughout the centuries, the Sanskrit language has been written in a variety of alphabets. The mode of writing most widely used throughout India, however, is called devanāgarī, which means, literally, the writing used in \"the cities of the demigods.\""}
          </p>
        </AccordionSection>

        {/* Vowels */}
        <AccordionSection title="Голосні" titleEn="Vowels">
          <div className="flex flex-wrap gap-4 justify-center mb-4">
            {VOWELS.map((vowel, idx) => (
              <div key={idx} className="text-center">
                <div
                  className="text-3xl mb-1"
                  style={{ fontFamily: "var(--font-devanagari)" }}
                >
                  {vowel}
                </div>
                <div className="text-sm text-muted-foreground italic">
                  {VOWELS_TRANSLIT[idx]}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {language === "uk"
              ? "Голосні а, і, о, у, е нагадують відповідні звуки української мови; довгі ā, ī, ū вдвічі довші проти коротких звуків."
              : "The vowels a, i, u are short; ā, ī, ū are long (held twice as long as the short). The diphthongs ai and au are also long."}
          </p>
        </AccordionSection>

        {/* Consonants */}
        <AccordionSection title="Приголосні" titleEn="Consonants">
          {Object.entries(CONSONANTS).map(([category, data]) => (
            <div key={category} className="mb-6">
              <h4 className="font-semibold text-primary mb-2">
                {labels[category as keyof typeof labels]}
              </h4>
              <div className="flex flex-wrap gap-4">
                {data.devanagari.map((char, idx) => (
                  <div key={idx} className="text-center min-w-[3rem]">
                    <div
                      className="text-2xl mb-1"
                      style={{ fontFamily: "var(--font-devanagari)" }}
                    >
                      {char}
                    </div>
                    <div className="text-sm text-muted-foreground italic">
                      {data.translit[idx]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </AccordionSection>

        {/* Numerals */}
        <AccordionSection title="Числа" titleEn="Numerals">
          <div className="grid grid-cols-5 gap-4">
            {NUMERALS.map((num, idx) => (
              <div key={idx} className="text-center">
                <div
                  className="text-2xl mb-1"
                  style={{ fontFamily: "var(--font-devanagari)" }}
                >
                  {num.devanagari}
                </div>
                <div className="text-sm text-muted-foreground">
                  {num.arabic}
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* Vowels after consonant */}
        <AccordionSection
          title="Голосні після приголосного"
          titleEn="Vowels after a Consonant"
        >
          <p className="text-muted-foreground mb-4">
            {language === "uk"
              ? "Голосні після приголосного записуються за допомогою спеціальних знаків (матр):"
              : "The vowels are written as follows after a consonant:"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MATRAS.map((item, idx) => (
              <div key={idx} className="text-center p-2 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span
                    className="text-xl"
                    style={{ fontFamily: "var(--font-devanagari)" }}
                  >
                    {item.matra}
                  </span>
                  <span className="text-muted-foreground">=</span>
                  <span className="italic">{item.vowel}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span
                    className="text-xl"
                    style={{ fontFamily: "var(--font-devanagari)" }}
                  >
                    {item.example}
                  </span>
                  <span className="text-sm italic text-muted-foreground">
                    {item.exampleTranslit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* Consonant ligatures */}
        <AccordionSection
          title="Лігатури приголосних"
          titleEn="Consonant Ligatures"
        >
          <p className="text-muted-foreground mb-4">
            {language === "uk"
              ? "Зазвичай два або більше приголосних поспіль записуються разом у спеціальній формі:"
              : "Generally two or more consonants in conjunction are written together in a special form:"}
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            {LIGATURES.map((item, idx) => (
              <div key={idx} className="text-center p-4 bg-muted/30 rounded-lg">
                <div
                  className="text-3xl mb-2"
                  style={{ fontFamily: "var(--font-devanagari)" }}
                >
                  {item.devanagari}
                </div>
                <div className="text-lg italic">{item.translit}</div>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* Vowel "a" after consonant */}
        <AccordionSection
          title='Голосний "а" після приголосного'
          titleEn='Vowel "a" after a Consonant'
        >
          <p className="text-foreground leading-relaxed">
            {language === "uk"
              ? 'Голосний "а" мається на увазі після приголосного, який не має знака голосного.'
              : 'The vowel "a" is implied after a consonant with no vowel symbol.'}
          </p>
        </AccordionSection>

        {/* Meaning of Virāma */}
        <AccordionSection title="Значення вірами" titleEn="Meaning of Virāma">
          <p className="text-foreground leading-relaxed mb-4">
            {language === "uk"
              ? "Знак вірама ( ् ) вказує на те, що після приголосного немає голосного:"
              : "The symbol virāma ( ् ) indicates that there is no final vowel:"}
          </p>
          <div className="text-center">
            <span
              className="text-4xl"
              style={{ fontFamily: "var(--font-devanagari)" }}
            >
              क्
            </span>
            <span className="text-xl ml-4 italic">k</span>
          </div>
        </AccordionSection>

        {/* Accentuation */}
        <AccordionSection title="Наголос" titleEn="Accentuation">
          <p className="text-foreground leading-relaxed">
            {language === "uk"
              ? "У санскриті немає фіксованого тонічного наголосу. Наголошеними у віршах вважають склади, які стоять у сильних місцях стоп. Склади у словах розрізняють за довготою. Довгий склад – той, де є довгий голосний (ā, ai, au, e, ī, o, ṝ, ū) або в якому за коротким голосним розташовано більше одного приголосного."
              : "There is no fixed accentuation of syllables in Sanskrit, or pausing between words in a line, only a flowing of short and long syllables (the long twice as long as the short). A long syllable is one whose vowel is long (ā, ī, ū, ṝ, e, ai, o, au) or whose short vowel is followed by more than one consonant."}
          </p>
        </AccordionSection>
      </main>
    </div>
  );
};

export default PronunciationGuide;
