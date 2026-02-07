import { describe, it, expect } from "vitest";
import {
  validateOutput,
  transliterateIAST,
  capitalizeAfterPeriod,
  convertNumbers,
  preservePunctuation,
  IAST_TO_CYRILLIC,
  EXPECTED_RESULTS,
  FORBIDDEN_LETTERS,
} from "./transliteration";

describe("transliterateIAST", () => {
  it("transliterates kṛṣṇa correctly", () => {
    expect(transliterateIAST("kṛṣṇa")).toBe(EXPECTED_RESULTS["kṛṣṇa"]);
  });

  it("transliterates eśa correctly", () => {
    expect(transliterateIAST("eśa")).toBe(EXPECTED_RESULTS["eśa"]);
  });

  it("transliterates bhāsaya correctly", () => {
    const result = transliterateIAST("bhāsaya");
    // bh -> бг, ā -> а̄ (Cyrillic а + macron), s -> с, a -> а, y -> й, a -> а
    expect(result).toContain("бг");
    expect(result).toContain("сайа");
  });

  it("transliterates simple consonants", () => {
    expect(transliterateIAST("ka")).toBe("ка");
    expect(transliterateIAST("ga")).toBe("ґа");
    expect(transliterateIAST("pa")).toBe("па");
  });

  it("handles aspirated consonants (digraphs with h)", () => {
    expect(transliterateIAST("kha")).toBe("кха");
    expect(transliterateIAST("gha")).toBe("ґга");
    expect(transliterateIAST("cha")).toBe("чха");
    expect(transliterateIAST("bha")).toBe("бга");
  });

  it("handles retroflex consonants with diacritics", () => {
    expect(transliterateIAST("ṭa")).toBe("т̣а");
    expect(transliterateIAST("ḍa")).toBe("д̣а");
    expect(transliterateIAST("ṇa")).toBe("н̣а");
  });

  it("handles sibilants", () => {
    expect(transliterateIAST("śa")).toBe("ш́а");
    expect(transliterateIAST("ṣa")).toBe("ша");
    expect(transliterateIAST("sa")).toBe("са");
  });

  it("handles long vowels", () => {
    expect(transliterateIAST("ā")).toBe("а̄");
    expect(transliterateIAST("ī")).toBe("ı̄");
    expect(transliterateIAST("ū")).toBe("ӯ");
  });

  it("handles compound consonants", () => {
    expect(transliterateIAST("kṣa")).toBe("кша");
  });

  it("handles uppercase letters", () => {
    expect(transliterateIAST("Kṛṣṇa")).toBe("Кр̣шн̣а");
  });

  it("preserves non-transliterable characters", () => {
    expect(transliterateIAST("123")).toBe("123");
    // 'w' is not in IAST mapping and is preserved as-is
    const result = transliterateIAST("hello world");
    expect(result).toContain("хелло");
  });
});

describe("validateOutput", () => {
  it("passes for valid transliteration output", () => {
    const result = validateOutput("кр̣шн̣а");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("fails for forbidden letters", () => {
    for (const letter of FORBIDDEN_LETTERS) {
      const result = validateOutput(`тест ${letter} тест`);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    }
  });
});

describe("capitalizeAfterPeriod", () => {
  it("capitalizes first letter", () => {
    expect(capitalizeAfterPeriod("hello")).toBe("Hello");
  });

  it("capitalizes after period and space", () => {
    expect(capitalizeAfterPeriod("first. second. third")).toBe("First. Second. Third");
  });

  it("handles already capitalized text", () => {
    expect(capitalizeAfterPeriod("Already. Done")).toBe("Already. Done");
  });

  it("handles Cyrillic text", () => {
    expect(capitalizeAfterPeriod("перше. друге")).toBe("Перше. Друге");
  });
});

describe("convertNumbers", () => {
  it("converts Devanagari digits to Arabic", () => {
    expect(convertNumbers("०१२३४५६७८९")).toBe("0123456789");
  });

  it("converts Bengali digits to Arabic", () => {
    expect(convertNumbers("০১২৩৪৫৬৭৮৯")).toBe("0123456789");
  });

  it("preserves existing Arabic digits", () => {
    expect(convertNumbers("123")).toBe("123");
  });

  it("handles mixed text and digits", () => {
    expect(convertNumbers("вірш ४७")).toBe("вірш 47");
  });
});

describe("preservePunctuation", () => {
  it("converts single danda to period", () => {
    expect(preservePunctuation("текст।")).toBe("текст.");
  });

  it("handles multiple dandas", () => {
    expect(preservePunctuation("a। b। c।")).toBe("a. b. c.");
  });
});

describe("IAST_TO_CYRILLIC mapping", () => {
  it("has entries for all basic vowels", () => {
    const vowels = ["a", "i", "u", "e", "o", "ā", "ī", "ū"];
    for (const v of vowels) {
      expect(IAST_TO_CYRILLIC).toHaveProperty(v);
    }
  });

  it("has entries for basic consonants", () => {
    const consonants = ["k", "g", "d", "t", "p", "b", "n", "m", "r", "l", "v", "s", "h", "j", "c"];
    for (const c of consonants) {
      expect(IAST_TO_CYRILLIC).toHaveProperty(c);
    }
  });
});
