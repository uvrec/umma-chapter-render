/**
 * Sanskrit Meter (Chandas) Analysis Utilities
 *
 * Parses Sanskrit text (IAST or Devanagari) into syllables,
 * determines laghu/guru weights, and identifies the meter.
 */

import {
  type SyllableWeight,
  type PatternSymbol,
  type MeterDefinition,
  METERS,
} from "@/data/sanskrit-meters";

// ============================================================
// Character classification
// ============================================================

const IAST_VOWELS = new Set([
  "a", "ā", "i", "ī", "u", "ū",
  "ṛ", "ṝ", "ḷ", "ḹ",
  "e", "ai", "o", "au",
]);

const IAST_LONG_VOWELS = new Set([
  "ā", "ī", "ū", "ṝ", "ḹ", "e", "ai", "o", "au",
]);

const IAST_CONSONANTS = new Set([
  "k", "kh", "g", "gh", "ṅ",
  "c", "ch", "j", "jh", "ñ",
  "ṭ", "ṭh", "ḍ", "ḍh", "ṇ",
  "t", "th", "d", "dh", "n",
  "p", "ph", "b", "bh", "m",
  "y", "r", "l", "v",
  "ś", "ṣ", "s", "h",
]);

/** Devanagari vowels (independent forms) */
const DEVANAGARI_VOWELS: Record<string, string> = {
  "अ": "a", "आ": "ā", "इ": "i", "ई": "ī",
  "उ": "u", "ऊ": "ū", "ऋ": "ṛ", "ॠ": "ṝ",
  "ऌ": "ḷ", "ॡ": "ḹ", "ए": "e", "ऐ": "ai",
  "ओ": "o", "औ": "au",
};

/** Devanagari vowel matras (dependent forms) */
const DEVANAGARI_MATRAS: Record<string, string> = {
  "ा": "ā", "ि": "i", "ी": "ī",
  "ु": "u", "ू": "ū", "ृ": "ṛ", "ॄ": "ṝ",
  "ॢ": "ḷ", "ॣ": "ḹ", "े": "e", "ै": "ai",
  "ो": "o", "ौ": "au",
};

const DEVANAGARI_CONSONANT_RANGE_START = 0x0915; // क
const DEVANAGARI_CONSONANT_RANGE_END = 0x0939;   // ह
const VIRAMA = "\u094D"; // ्
const ANUSVARA = "\u0902"; // ं
const VISARGA = "\u0903"; // ः

// ============================================================
// Syllable interface
// ============================================================

export interface Syllable {
  /** The original text of this syllable */
  text: string;
  /** The vowel sound in this syllable (IAST) */
  vowel: string;
  /** Whether the vowel itself is long */
  longVowel: boolean;
  /** Weight: L (laghu/light) or G (guru/heavy) */
  weight: SyllableWeight;
  /** Position index (0-based) */
  index: number;
}

export interface PadaAnalysis {
  /** Original text of the pāda */
  text: string;
  /** Syllables in this pāda */
  syllables: Syllable[];
  /** Pattern of weights */
  pattern: SyllableWeight[];
}

export interface MeterAnalysis {
  /** The pādas found in the input */
  padas: PadaAnalysis[];
  /** Matched meters (best matches first) */
  matches: MeterMatch[];
  /** Raw input text */
  inputText: string;
}

export interface MeterMatch {
  meter: MeterDefinition;
  /** Confidence score 0-1 */
  confidence: number;
  /** Number of pādas that matched */
  matchedPadas: number;
  /** Details per pāda */
  padaDetails: PadaMatchDetail[];
}

export interface PadaMatchDetail {
  padaIndex: number;
  matched: boolean;
  syllableCount: number;
  expectedCount: number;
  /** Position mismatches (0-based) */
  mismatches: number[];
}

// ============================================================
// Script detection
// ============================================================

export function isDevanagari(text: string): boolean {
  // Check if text contains Devanagari characters
  return /[\u0900-\u097F]/.test(text);
}

// ============================================================
// IAST tokenizer
// ============================================================

/**
 * Tokenize IAST text into an array of phonemes (consonants and vowels).
 * Handles multi-character consonants (kh, gh, etc.) and vowels (ai, au).
 */
function tokenizeIAST(text: string): string[] {
  const tokens: string[] = [];
  let i = 0;
  const lower = text.toLowerCase();

  while (i < lower.length) {
    const ch = lower[i];
    const next = i + 1 < lower.length ? lower[i + 1] : "";

    // Skip spaces, punctuation, digits, dashes
    if (/[\s\d\-–—|।॥,.;:!?''""()[\]/\\]/.test(ch)) {
      i++;
      continue;
    }

    // Two-character vowels: ai, au
    if (ch === "a" && (next === "i" || next === "u")) {
      tokens.push(ch + next);
      i += 2;
      continue;
    }

    // Two-character aspirated/composite consonants
    const twoChar = ch + next;
    if (
      ["kh", "gh", "ch", "jh", "ṭh", "ḍh", "th", "dh", "ph", "bh"].includes(
        twoChar
      )
    ) {
      tokens.push(twoChar);
      i += 2;
      continue;
    }

    // Single characters (consonants and vowels)
    tokens.push(ch);
    i++;
  }

  return tokens;
}

/**
 * Check if an IAST token is a vowel
 */
function isIASTVowel(token: string): boolean {
  return IAST_VOWELS.has(token);
}

/**
 * Check if an IAST vowel is long
 */
function isIASTLongVowel(token: string): boolean {
  return IAST_LONG_VOWELS.has(token);
}

// ============================================================
// Devanagari tokenizer
// ============================================================

interface DevanagariToken {
  type: "consonant" | "vowel" | "matra" | "virama" | "anusvara" | "visarga" | "other";
  char: string;
  iastEquivalent?: string;
}

function tokenizeDevanagari(text: string): DevanagariToken[] {
  const tokens: DevanagariToken[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = ch.charCodeAt(0);

    if (DEVANAGARI_VOWELS[ch]) {
      tokens.push({
        type: "vowel",
        char: ch,
        iastEquivalent: DEVANAGARI_VOWELS[ch],
      });
    } else if (DEVANAGARI_MATRAS[ch]) {
      tokens.push({
        type: "matra",
        char: ch,
        iastEquivalent: DEVANAGARI_MATRAS[ch],
      });
    } else if (code >= DEVANAGARI_CONSONANT_RANGE_START && code <= DEVANAGARI_CONSONANT_RANGE_END) {
      tokens.push({ type: "consonant", char: ch });
    } else if (ch === VIRAMA) {
      tokens.push({ type: "virama", char: ch });
    } else if (ch === ANUSVARA || ch === "ँ") {
      tokens.push({ type: "anusvara", char: ch });
    } else if (ch === VISARGA) {
      tokens.push({ type: "visarga", char: ch });
    } else {
      // Skip spaces, punctuation, etc.
    }
  }

  return tokens;
}

// ============================================================
// Syllable parsing
// ============================================================

/**
 * Parse IAST text into syllables.
 * A syllable in Sanskrit starts with zero or more consonants, contains one vowel,
 * and optionally ends with consonants that begin the next syllable cluster.
 */
export function parseIASTSyllables(text: string): Syllable[] {
  const tokens = tokenizeIAST(text);
  if (tokens.length === 0) return [];

  // Build syllable structures: each vowel creates a syllable.
  // Consonants before a vowel belong to that vowel's syllable.
  // The pattern is: C*V(C*V)* where consonant clusters between vowels
  // are split so the last consonant before a vowel goes with that vowel.
  const syllables: Syllable[] = [];

  // First, find vowel positions
  const vowelIndices: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    if (isIASTVowel(tokens[i])) {
      vowelIndices.push(i);
    }
  }

  if (vowelIndices.length === 0) return [];

  for (let vi = 0; vi < vowelIndices.length; vi++) {
    const vowelIdx = vowelIndices[vi];
    const vowel = tokens[vowelIdx];
    const isLong = isIASTLongVowel(vowel);

    // Determine syllable text boundaries
    // Start: from the beginning of consonants before this vowel
    let startIdx: number;
    if (vi === 0) {
      startIdx = 0;
    } else {
      // Consonants between previous vowel and this vowel:
      // split them — usually last consonant goes with current syllable
      const prevVowelIdx = vowelIndices[vi - 1];
      const consonantsStart = prevVowelIdx + 1;
      const consonantsBetween = vowelIdx - consonantsStart;

      if (consonantsBetween <= 1) {
        startIdx = consonantsStart;
      } else {
        // First consonant(s) close the previous syllable,
        // last consonant opens the current syllable
        startIdx = vowelIdx - 1;
        // But for conjuncts, take only the last consonant
        // Actually in Sanskrit, the split is: all consonants after the first stay with next syllable
        // That's because a single consonant goes to next syllable, conjunct: first closes previous, rest start next
        startIdx = consonantsStart + 1; // One consonant closes previous, rest start this
      }
    }

    // End: include trailing anusvara/visarga tokens (ṁ, ḥ)
    let endIdx = vowelIdx;
    // Check if next token is ṁ or ḥ
    if (vowelIdx + 1 < tokens.length) {
      const nextToken = tokens[vowelIdx + 1];
      if (nextToken === "ṃ" || nextToken === "ṁ" || nextToken === "ḥ") {
        endIdx = vowelIdx + 1;
      }
    }

    const syllableText = tokens.slice(startIdx, endIdx + 1).join("");

    // Determine weight: guru if long vowel, or followed by conjunct, anusvara, or visarga
    let weight: SyllableWeight = isLong ? "G" : "L";

    // Check for anusvara/visarga after vowel
    if (endIdx > vowelIdx) {
      weight = "G"; // anusvara or visarga makes it guru
    }

    // Check if followed by conjunct consonant (two or more consonants before next vowel)
    if (vi < vowelIndices.length - 1) {
      const nextVowelIdx = vowelIndices[vi + 1];
      const consonantsBetween = nextVowelIdx - endIdx - 1;
      if (consonantsBetween >= 2) {
        weight = "G"; // Conjunct makes preceding syllable guru
      }
    }

    syllables.push({
      text: syllableText,
      vowel,
      longVowel: isLong,
      weight,
      index: vi,
    });
  }

  return syllables;
}

/**
 * Parse Devanagari text into syllables.
 */
export function parseDevanagariSyllables(text: string): Syllable[] {
  const tokens = tokenizeDevanagari(text);
  if (tokens.length === 0) return [];

  const syllables: Syllable[] = [];
  const currentConsonants: string[] = [];
  const syllableChars: string[] = [];

  const finalizeSyllable = (
    vowel: string,
    chars: string[],
    hasAnusvara: boolean,
    hasVisarga: boolean
  ) => {
    const isLong = IAST_LONG_VOWELS.has(vowel);
    let weight: SyllableWeight = isLong ? "G" : "L";

    if (hasAnusvara || hasVisarga) {
      weight = "G";
    }

    syllables.push({
      text: chars.join(""),
      vowel,
      longVowel: isLong,
      weight,
      index: syllables.length,
    });
  };

  let pendingVowel: string | null = null;
  let pendingChars: string[] = [];
  let pendingAnusvara = false;
  let pendingVisarga = false;
  let consonantClusterAfterVowel: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    if (tok.type === "vowel") {
      // Independent vowel — finalize previous syllable if any
      if (pendingVowel !== null) {
        // Check consonant cluster
        if (consonantClusterAfterVowel.length >= 2) {
          pendingChars.push(consonantClusterAfterVowel[0]);
          // guru because of conjunct
          finalizeSyllable(pendingVowel, pendingChars, pendingAnusvara, pendingVisarga);
          // Remaining consonants start new syllable
          pendingChars = consonantClusterAfterVowel.slice(1);
        } else {
          finalizeSyllable(pendingVowel, pendingChars, pendingAnusvara, pendingVisarga);
          pendingChars = [...consonantClusterAfterVowel];
        }
      }

      pendingVowel = tok.iastEquivalent || "a";
      pendingChars.push(tok.char);
      pendingAnusvara = false;
      pendingVisarga = false;
      consonantClusterAfterVowel = [];
    } else if (tok.type === "consonant") {
      if (pendingVowel === null) {
        // Consonant before first vowel
        pendingChars.push(tok.char);
        // Check if next is virama
        if (i + 1 < tokens.length && tokens[i + 1].type === "virama") {
          pendingChars.push(tokens[i + 1].char);
          i++; // skip virama
          // This is a conjunct consonant, keep accumulating
        } else if (i + 1 < tokens.length && tokens[i + 1].type === "matra") {
          // Consonant + matra = syllable
          const matra = tokens[i + 1];
          pendingVowel = matra.iastEquivalent || "a";
          pendingChars.push(matra.char);
          pendingAnusvara = false;
          pendingVisarga = false;
          consonantClusterAfterVowel = [];
          i++; // skip matra
        } else if (
          i + 1 >= tokens.length ||
          tokens[i + 1].type === "consonant" ||
          tokens[i + 1].type === "vowel" ||
          tokens[i + 1].type === "anusvara" ||
          tokens[i + 1].type === "visarga"
        ) {
          // Consonant with inherent 'a'
          pendingVowel = "a";
          pendingAnusvara = false;
          pendingVisarga = false;
          consonantClusterAfterVowel = [];
        }
      } else {
        // Consonant after a vowel — part of the closing cluster or next syllable
        consonantClusterAfterVowel.push(tok.char);

        // Check what follows
        if (i + 1 < tokens.length && tokens[i + 1].type === "virama") {
          consonantClusterAfterVowel.push(tokens[i + 1].char);
          i++; // skip virama
        } else if (i + 1 < tokens.length && tokens[i + 1].type === "matra") {
          // This consonant + matra = new syllable
          // Finalize previous
          if (consonantClusterAfterVowel.length >= 2) {
            // First consonant(s) close previous syllable as conjunct → guru
            const closingConsonants = consonantClusterAfterVowel.slice(0, -1);
            pendingChars.push(...closingConsonants);
            finalizeSyllable(pendingVowel, pendingChars, pendingAnusvara, pendingVisarga);
            pendingChars = [consonantClusterAfterVowel[consonantClusterAfterVowel.length - 1]];
          } else {
            finalizeSyllable(pendingVowel, pendingChars, pendingAnusvara, pendingVisarga);
            pendingChars = [...consonantClusterAfterVowel];
          }

          const matra = tokens[i + 1];
          pendingVowel = matra.iastEquivalent || "a";
          pendingChars.push(matra.char);
          pendingAnusvara = false;
          pendingVisarga = false;
          consonantClusterAfterVowel = [];
          i++; // skip matra
        } else if (
          i + 1 >= tokens.length ||
          tokens[i + 1].type === "vowel" ||
          tokens[i + 1].type === "anusvara" ||
          tokens[i + 1].type === "visarga"
        ) {
          // Consonant with inherent 'a' — starts new syllable
          if (consonantClusterAfterVowel.length >= 2) {
            const closingConsonants = consonantClusterAfterVowel.slice(0, -1);
            pendingChars.push(...closingConsonants);
            finalizeSyllable(pendingVowel, pendingChars, pendingAnusvara, pendingVisarga);
            pendingChars = [consonantClusterAfterVowel[consonantClusterAfterVowel.length - 1]];
          } else {
            finalizeSyllable(pendingVowel, pendingChars, pendingAnusvara, pendingVisarga);
            pendingChars = [...consonantClusterAfterVowel];
          }
          pendingVowel = "a";
          pendingAnusvara = false;
          pendingVisarga = false;
          consonantClusterAfterVowel = [];
        }
      }
    } else if (tok.type === "matra") {
      // Matra after consonant chain — handled above in consonant case
      // If we get here, it's unexpected. Just update the vowel.
      if (pendingVowel !== null) {
        pendingVowel = tok.iastEquivalent || pendingVowel;
        pendingChars.push(tok.char);
      }
    } else if (tok.type === "anusvara") {
      pendingAnusvara = true;
      pendingChars.push(tok.char);
      // Anusvara should also trigger closing the syllable if followed by consonant
    } else if (tok.type === "visarga") {
      pendingVisarga = true;
      pendingChars.push(tok.char);
    } else if (tok.type === "virama") {
      pendingChars.push(tok.char);
    }
  }

  // Finalize the last syllable
  if (pendingVowel !== null) {
    if (consonantClusterAfterVowel.length > 0) {
      pendingChars.push(...consonantClusterAfterVowel);
      if (consonantClusterAfterVowel.length >= 2) {
        // Conjunct at end — guru
      }
    }
    finalizeSyllable(pendingVowel, pendingChars, pendingAnusvara, pendingVisarga);
  }

  // Fix weights: check if conjunct consonants after a vowel make it guru
  for (let si = 0; si < syllables.length - 1; si++) {
    const current = syllables[si];
    if (current.weight === "L") {
      // Count consonants at the start of next syllable
      const nextSyl = syllables[si + 1];
      let leadingConsonants = 0;
      for (const ch of nextSyl.text) {
        const code = ch.charCodeAt(0);
        if (
          (code >= DEVANAGARI_CONSONANT_RANGE_START &&
            code <= DEVANAGARI_CONSONANT_RANGE_END) ||
          ch === VIRAMA
        ) {
          if (ch !== VIRAMA) leadingConsonants++;
        } else {
          break;
        }
      }
      // If current syllable ends with a consonant (from conjunct) + next starts with consonant = conjunct
      // Already handled by the parsing, but let's double-check
    }
  }

  // Re-index
  syllables.forEach((s, i) => (s.index = i));

  return syllables;
}

/**
 * Parse text into syllables, auto-detecting script
 */
export function parseSyllables(text: string): Syllable[] {
  if (isDevanagari(text)) {
    return parseDevanagariSyllables(text);
  }
  return parseIASTSyllables(text);
}

// ============================================================
// Pāda splitting
// ============================================================

/**
 * Split a verse into pādas (quarter-verses).
 * Handles various line-break patterns.
 */
export function splitIntoPadas(text: string): string[] {
  // Clean up the text
  let cleaned = text.trim();

  // Replace dandas with line breaks
  cleaned = cleaned.replace(/[।॥|]{1,2}/g, "\n");

  // Split by line breaks
  const lines = cleaned
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // If a single line, try to split by common patterns
  if (lines.length === 1) {
    // Try splitting by double space
    const parts = lines[0].split(/\s{2,}/).filter((p) => p.trim().length > 0);
    if (parts.length > 1) return parts;
    return [lines[0]];
  }

  return lines;
}

// ============================================================
// Meter identification
// ============================================================

/**
 * Analyze a full verse and identify the meter
 */
export function analyzeMeter(text: string): MeterAnalysis {
  const padaTexts = splitIntoPadas(text);

  const padas: PadaAnalysis[] = padaTexts.map((padaText) => {
    const syllables = parseSyllables(padaText);
    return {
      text: padaText,
      syllables,
      pattern: syllables.map((s) => s.weight),
    };
  });

  // Try matching against known meters
  const matches: MeterMatch[] = [];

  for (const meter of METERS) {
    // Skip mora-based meters for now
    if (meter.category === "jāti" || meter.pattern.length === 0) continue;

    const padaDetails: PadaMatchDetail[] = [];
    let totalMatched = 0;

    for (let pi = 0; pi < padas.length; pi++) {
      const pada = padas[pi];
      const detail = matchPadaToMeter(pada, meter);
      padaDetails.push({ ...detail, padaIndex: pi });
      if (detail.matched) totalMatched++;
    }

    if (padas.length > 0 && totalMatched > 0) {
      const confidence = calculateConfidence(padas, meter, padaDetails, totalMatched);
      matches.push({
        meter,
        confidence,
        matchedPadas: totalMatched,
        padaDetails,
      });
    }
  }

  // Sort by confidence (descending)
  matches.sort((a, b) => b.confidence - a.confidence);

  return {
    padas,
    matches,
    inputText: text,
  };
}

/**
 * Match a single pāda against a meter definition
 */
function matchPadaToMeter(
  pada: PadaAnalysis,
  meter: MeterDefinition
): Omit<PadaMatchDetail, "padaIndex"> {
  const expected = meter.pattern;
  const actual = pada.pattern;

  // For Anuṣṭubh, the pattern is special — just check syllable count
  if (meter.id === "anustubh") {
    if (actual.length !== 8) {
      return {
        matched: false,
        syllableCount: actual.length,
        expectedCount: 8,
        mismatches: [],
      };
    }
    // Check basic Anuṣṭubh rules: position 5 should be L for pathyā (even pādas)
    // For simplicity, just match the count
    return {
      matched: true,
      syllableCount: actual.length,
      expectedCount: 8,
      mismatches: [],
    };
  }

  if (actual.length !== expected.length) {
    return {
      matched: false,
      syllableCount: actual.length,
      expectedCount: expected.length,
      mismatches: [],
    };
  }

  const mismatches: number[] = [];
  for (let i = 0; i < expected.length; i++) {
    if (expected[i] === "X") continue; // free position
    // Last syllable is traditionally free
    if (i === expected.length - 1) continue;
    if (expected[i] !== actual[i]) {
      mismatches.push(i);
    }
  }

  return {
    matched: mismatches.length === 0,
    syllableCount: actual.length,
    expectedCount: expected.length,
    mismatches,
  };
}

/**
 * Calculate confidence score for a meter match
 */
function calculateConfidence(
  padas: PadaAnalysis[],
  meter: MeterDefinition,
  padaDetails: PadaMatchDetail[],
  matchedPadas: number
): number {
  const totalPadas = padas.length;
  if (totalPadas === 0) return 0;

  // Base score: ratio of matched pādas
  let score = matchedPadas / totalPadas;

  // Bonus for matching all 4 pādas
  if (totalPadas >= 4 && matchedPadas >= 4) {
    score += 0.1;
  }

  // Penalty for mismatched syllable counts
  for (const detail of padaDetails) {
    if (detail.syllableCount !== detail.expectedCount) {
      score -= 0.15;
    }
    // Penalty for pattern mismatches
    score -= detail.mismatches.length * 0.05;
  }

  return Math.max(0, Math.min(1, score));
}

/**
 * Format a weight pattern as a visual string
 */
export function formatPattern(pattern: SyllableWeight[]): string {
  return pattern.map((w) => (w === "G" ? "–" : "⏑")).join(" ");
}

/**
 * Format a weight pattern as a compact string
 */
export function formatPatternCompact(pattern: SyllableWeight[]): string {
  return pattern.map((w) => (w === "G" ? "–" : "⏑")).join("");
}
