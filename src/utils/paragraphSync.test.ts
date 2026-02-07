import { describe, it, expect } from "vitest";
import {
  splitIntoParagraphs,
  alignParagraphs,
  paragraphsToJsonb,
  jsonbToParagraphs,
  Paragraph,
} from "./paragraphSync";

describe("splitIntoParagraphs", () => {
  it("returns empty array for null/undefined/empty input", () => {
    expect(splitIntoParagraphs(null)).toEqual([]);
    expect(splitIntoParagraphs(undefined)).toEqual([]);
    expect(splitIntoParagraphs("")).toEqual([]);
  });

  it("splits text by double newlines", () => {
    const text = "First paragraph\n\nSecond paragraph\n\nThird paragraph";
    const result = splitIntoParagraphs(text);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ index: 0, text: "First paragraph" });
    expect(result[1]).toEqual({ index: 1, text: "Second paragraph" });
    expect(result[2]).toEqual({ index: 2, text: "Third paragraph" });
  });

  it("handles triple+ newlines as a single separator", () => {
    const text = "A\n\n\n\nB";
    const result = splitIntoParagraphs(text);
    expect(result).toHaveLength(2);
  });

  it("replaces single newlines within a paragraph with spaces", () => {
    const text = "Line one\nLine two\n\nParagraph two";
    const result = splitIntoParagraphs(text);
    expect(result[0].text).toBe("Line one Line two");
    expect(result[1].text).toBe("Paragraph two");
  });

  it("trims whitespace from paragraphs", () => {
    const text = "  Hello  \n\n  World  ";
    const result = splitIntoParagraphs(text);
    expect(result[0].text).toBe("Hello");
    expect(result[1].text).toBe("World");
  });

  it("filters out empty paragraphs", () => {
    const text = "\n\n\n\nOnly one\n\n\n\n";
    const result = splitIntoParagraphs(text);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe("Only one");
  });
});

describe("alignParagraphs", () => {
  it("returns equal-length arrays when inputs match", () => {
    const p1: Paragraph[] = [{ index: 0, text: "a" }];
    const p2: Paragraph[] = [{ index: 0, text: "b" }];
    const [a1, a2] = alignParagraphs(p1, p2);
    expect(a1).toHaveLength(1);
    expect(a2).toHaveLength(1);
  });

  it("pads shorter array with empty paragraphs", () => {
    const p1: Paragraph[] = [
      { index: 0, text: "a" },
      { index: 1, text: "b" },
      { index: 2, text: "c" },
    ];
    const p2: Paragraph[] = [{ index: 0, text: "x" }];
    const [a1, a2] = alignParagraphs(p1, p2);
    expect(a1).toHaveLength(3);
    expect(a2).toHaveLength(3);
    expect(a2[1].text).toBe("");
    expect(a2[2].text).toBe("");
  });

  it("handles both empty arrays", () => {
    const [a1, a2] = alignParagraphs([], []);
    expect(a1).toHaveLength(0);
    expect(a2).toHaveLength(0);
  });

  it("does not mutate original arrays", () => {
    const p1: Paragraph[] = [{ index: 0, text: "a" }];
    const p2: Paragraph[] = [];
    const [a1] = alignParagraphs(p1, p2);
    expect(a1).not.toBe(p1);
  });
});

describe("paragraphsToJsonb", () => {
  it("serializes to JSON string", () => {
    const ps: Paragraph[] = [{ index: 0, text: "hello" }];
    const json = paragraphsToJsonb(ps);
    expect(JSON.parse(json)).toEqual(ps);
  });

  it("handles empty array", () => {
    expect(paragraphsToJsonb([])).toBe("[]");
  });
});

describe("jsonbToParagraphs", () => {
  it("parses JSON string", () => {
    const ps: Paragraph[] = [{ index: 0, text: "hello" }];
    expect(jsonbToParagraphs(JSON.stringify(ps))).toEqual(ps);
  });

  it("returns array as-is", () => {
    const ps: Paragraph[] = [{ index: 0, text: "hello" }];
    expect(jsonbToParagraphs(ps)).toEqual(ps);
  });

  it("returns empty array for null/undefined", () => {
    expect(jsonbToParagraphs(null)).toEqual([]);
    expect(jsonbToParagraphs(undefined)).toEqual([]);
  });

  it("returns empty array for invalid JSON string", () => {
    expect(jsonbToParagraphs("not valid json")).toEqual([]);
  });

  it("returns empty array for non-array objects", () => {
    expect(jsonbToParagraphs({ foo: "bar" })).toEqual([]);
  });

  it("roundtrips correctly", () => {
    const ps: Paragraph[] = [
      { index: 0, text: "First" },
      { index: 1, text: "Second" },
    ];
    const jsonb = paragraphsToJsonb(ps);
    const restored = jsonbToParagraphs(jsonb);
    expect(restored).toEqual(ps);
  });
});
