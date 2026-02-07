import { describe, it, expect } from "vitest";
import {
  addSanskritLineBreaks,
  addTransliterationLineBreaks,
  processVerseLineBreaks,
} from "./lineBreaker";

describe("addSanskritLineBreaks", () => {
  it("returns empty string for falsy input", () => {
    expect(addSanskritLineBreaks("")).toBe("");
    expect(addSanskritLineBreaks(null as any)).toBe("");
  });

  it("returns whitespace-only text unchanged", () => {
    expect(addSanskritLineBreaks("   ")).toBe("   ");
  });

  it("adds line break after single danda", () => {
    const result = addSanskritLineBreaks("पद एक। पद दो");
    expect(result).toContain("।\n");
  });

  it("handles double danda with verse number", () => {
    const result = addSanskritLineBreaks("पद एक ॥ १ ॥ पद दो");
    expect(result.split("\n").length).toBeGreaterThan(1);
  });

  it("separates Om invocation on its own line", () => {
    const result = addSanskritLineBreaks("ॐ नमो भगवते");
    expect(result.startsWith("ॐ\n")).toBe(true);
  });

  it("normalizes existing line breaks before re-breaking", () => {
    const input = "पद एक\n\nपद दो। पद तीन";
    const result = addSanskritLineBreaks(input);
    // Should not have double newlines
    expect(result).not.toContain("\n\n");
  });

  it("handles text without dandas gracefully", () => {
    const input = "simple text without dandas";
    const result = addSanskritLineBreaks(input);
    expect(result).toBe("simple text without dandas");
  });
});

describe("addTransliterationLineBreaks", () => {
  it("returns empty input unchanged", () => {
    expect(addTransliterationLineBreaks("", "")).toBe("");
    expect(addTransliterationLineBreaks("sanskrit", "")).toBe("");
  });

  it("splits by double pipe markers", () => {
    const result = addTransliterationLineBreaks("", "line one || line two");
    expect(result).toBe("line one\nline two");
  });

  it("splits by single pipe markers", () => {
    const result = addTransliterationLineBreaks("", "line one | line two");
    expect(result).toBe("line one\nline two");
  });

  it("distributes words evenly when no markers present", () => {
    const sanskrit = "line1\nline2";
    const translit = "word1 word2 word3 word4";
    const result = addTransliterationLineBreaks(sanskrit, translit);
    expect(result.split("\n").length).toBe(2);
  });

  it("handles single-line Sanskrit correctly", () => {
    const result = addTransliterationLineBreaks("single", "all words on one line");
    // With 1 Sanskrit line, all words should be on 1 line
    expect(result.split("\n").length).toBe(1);
  });
});

describe("processVerseLineBreaks", () => {
  it("processes only Sanskrit, leaves transliteration unchanged", () => {
    const verse = {
      sanskrit: "पद एक। पद दो",
      transliteration: "pada eka pada do",
    };
    const result = processVerseLineBreaks(verse);
    expect(result.sanskrit).toContain("।\n");
    expect(result.transliteration).toBe("pada eka pada do");
  });

  it("handles missing Sanskrit", () => {
    const verse = { transliteration: "text only" };
    const result = processVerseLineBreaks(verse);
    expect(result.sanskrit).toBeUndefined();
    expect(result.transliteration).toBe("text only");
  });

  it("handles missing transliteration", () => {
    const verse = { sanskrit: "पद एक। पद दो" };
    const result = processVerseLineBreaks(verse);
    expect(result.sanskrit).toBeDefined();
    expect(result.transliteration).toBeUndefined();
  });

  it("handles empty strings", () => {
    const verse = { sanskrit: "", transliteration: "  " };
    const result = processVerseLineBreaks(verse);
    expect(result.sanskrit).toBeUndefined();
    expect(result.transliteration).toBeUndefined();
  });
});
