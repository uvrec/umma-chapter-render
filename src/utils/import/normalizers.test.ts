import { describe, it, expect } from "vitest";
import {
  normalizeText,
  normalizeSynonyms,
  cleanHtml,
  cleanSanskrit,
  extractSanskritText,
  stripParagraphTags,
  sanitizeForRender,
} from "./normalizers";

describe("normalizeText", () => {
  it("converts \\r\\n to \\n", () => {
    expect(normalizeText("hello\r\nworld")).toBe("hello\nworld");
  });

  it("converts \\r to \\n", () => {
    expect(normalizeText("hello\rworld")).toBe("hello\nworld");
  });

  it("converts tabs to spaces", () => {
    expect(normalizeText("hello\tworld")).toBe("hello world");
  });

  it("converts non-breaking spaces", () => {
    expect(normalizeText("hello\u00A0world")).toBe("hello world");
  });

  it("converts smart quotes", () => {
    expect(normalizeText("\u2018hello\u2019")).toBe("'hello'");
    expect(normalizeText("\u201Chello\u201D")).toBe('"hello"');
  });

  it("converts en dash and em dash", () => {
    expect(normalizeText("a\u2013b")).toBe("a-b");
    expect(normalizeText("a\u2014b")).toBe("a\u2014b"); // em dash preserved as —
  });

  it("trims whitespace", () => {
    expect(normalizeText("  hello  ")).toBe("hello");
  });
});

describe("normalizeSynonyms", () => {
  it("standardizes dashes to en dash with spacing", () => {
    const result = normalizeSynonyms("term—meaning");
    expect(result).toContain("–");
  });

  it("normalizes semicolons and commas", () => {
    const result = normalizeSynonyms("term – meaning,term2 – meaning2");
    expect(result).toBe("term – meaning; term2 – meaning2");
  });
});

describe("cleanHtml", () => {
  it("removes all HTML tags", () => {
    expect(cleanHtml("<p>Hello <strong>world</strong></p>")).toBe("Hello world");
  });

  it("removes script tags with content", () => {
    expect(cleanHtml("<script>alert('xss')</script>text")).toBe("text");
  });

  it("removes style tags with content", () => {
    expect(cleanHtml("<style>.red{}</style>text")).toBe("text");
  });

  it("collapses whitespace", () => {
    expect(cleanHtml("<p>Hello</p>  <p>World</p>")).toBe("Hello World");
  });
});

describe("cleanSanskrit", () => {
  it("returns empty string for falsy input", () => {
    expect(cleanSanskrit("")).toBe("");
  });

  it("returns text unchanged when no HTML present", () => {
    const text = "धर्मक्षेत्रे कुरुक्षेत्रे";
    expect(cleanSanskrit(text)).toBe(text);
  });

  it("converts <br> to newlines", () => {
    expect(cleanSanskrit("line1<br>line2")).toBe("line1\nline2");
    expect(cleanSanskrit("line1<br />line2")).toBe("line1\nline2");
  });

  it("removes other HTML tags", () => {
    expect(cleanSanskrit("<p>text</p>")).toBe("text");
  });

  it("removes script and style tags", () => {
    expect(cleanSanskrit("<script>alert(1)</script>safe")).toBe("safe");
    expect(cleanSanskrit("<style>.x{}</style>safe")).toBe("safe");
  });
});

describe("extractSanskritText", () => {
  it("extracts Devanagari text", () => {
    expect(extractSanskritText("hello धर्म world")).toBe("धर्म");
  });

  it("extracts IAST text with diacritics as fallback", () => {
    expect(extractSanskritText("kṛṣṇa")).toBeTruthy();
  });

  it("returns undefined for plain text", () => {
    expect(extractSanskritText("123 !@#")).toBeUndefined();
  });
});

describe("stripParagraphTags", () => {
  it("returns empty string for falsy input", () => {
    expect(stripParagraphTags("")).toBe("");
  });

  it("returns text unchanged when no HTML present", () => {
    expect(stripParagraphTags("plain text")).toBe("plain text");
  });

  it("strips <p> tags", () => {
    expect(stripParagraphTags("<p>text</p>")).toBe("text");
  });

  it("strips <p> with attributes", () => {
    expect(stripParagraphTags('<p class="foo">text</p>')).toBe("text");
  });

  it("replaces </p> and <br> with spaces and normalizes", () => {
    expect(stripParagraphTags("<p>line 1</p><p>line 2</p>")).toBe("line 1 line 2");
  });
});

describe("sanitizeForRender", () => {
  it("returns empty string for falsy input", () => {
    expect(sanitizeForRender("")).toBe("");
  });

  it("allows safe HTML tags", () => {
    const html = "<p>Hello <strong>world</strong></p>";
    const result = sanitizeForRender(html);
    expect(result).toContain("<p>");
    expect(result).toContain("<strong>");
  });

  it("removes script tags", () => {
    const html = '<p>safe</p><script>alert("xss")</script>';
    const result = sanitizeForRender(html);
    expect(result).not.toContain("<script>");
    expect(result).toContain("safe");
  });

  it("strips background-color from inline styles", () => {
    const html = '<div style="background-color: red; color: blue;">text</div>';
    const result = sanitizeForRender(html);
    expect(result).not.toContain("background-color");
    expect(result).toContain("color: blue");
  });

  it("strips background from inline styles", () => {
    const html = '<div style="background: red;">text</div>';
    const result = sanitizeForRender(html);
    expect(result).not.toContain("background: red");
  });
});
