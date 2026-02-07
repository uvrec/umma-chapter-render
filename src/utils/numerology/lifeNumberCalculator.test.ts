import { describe, it, expect } from "vitest";
import {
  reduceToSingleDigit,
  calculateConsciousnessNumber,
  calculateActionNumber,
  calculateRealizationNumber,
  calculateLifeNumber,
  calculateNumerologyReading,
  getNumberInterpretation,
} from "./lifeNumberCalculator";

describe("reduceToSingleDigit", () => {
  it("returns single digits unchanged", () => {
    for (let i = 0; i <= 9; i++) {
      expect(reduceToSingleDigit(i)).toBe(i);
    }
  });

  it("reduces multi-digit numbers", () => {
    expect(reduceToSingleDigit(10)).toBe(1); // 1+0=1
    expect(reduceToSingleDigit(27)).toBe(9); // 2+7=9
    expect(reduceToSingleDigit(99)).toBe(9); // 9+9=18 -> 1+8=9
  });

  it("reduces year numbers correctly", () => {
    expect(reduceToSingleDigit(2000)).toBe(2); // 2+0+0+0=2
    expect(reduceToSingleDigit(1989)).toBe(9); // 1+9+8+9=27 -> 2+7=9
    expect(reduceToSingleDigit(1995)).toBe(6); // 1+9+9+5=24 -> 2+4=6
  });

  it("handles zero", () => {
    expect(reduceToSingleDigit(0)).toBe(0);
  });
});

describe("calculateConsciousnessNumber", () => {
  it("reduces day of birth to single digit", () => {
    expect(calculateConsciousnessNumber(7)).toBe(7);
    expect(calculateConsciousnessNumber(15)).toBe(6); // 1+5=6
    expect(calculateConsciousnessNumber(29)).toBe(2); // 2+9=11 -> 1+1=2
    expect(calculateConsciousnessNumber(31)).toBe(4); // 3+1=4
  });
});

describe("calculateActionNumber", () => {
  it("reduces month to single digit", () => {
    expect(calculateActionNumber(1)).toBe(1);
    expect(calculateActionNumber(12)).toBe(3); // 1+2=3
    expect(calculateActionNumber(9)).toBe(9);
    expect(calculateActionNumber(10)).toBe(1); // 1+0=1
  });
});

describe("calculateRealizationNumber", () => {
  it("reduces year to single digit", () => {
    expect(calculateRealizationNumber(1990)).toBe(1); // 1+9+9+0=19 -> 1+9=10 -> 1+0=1
    expect(calculateRealizationNumber(2000)).toBe(2);
    expect(calculateRealizationNumber(1985)).toBe(5); // 1+9+8+5=23 -> 2+3=5
  });
});

describe("calculateLifeNumber", () => {
  it("sums components and reduces", () => {
    const result = calculateLifeNumber(7, 1, 2);
    expect(result.intermediate).toBe(10);
    expect(result.lifeNumber).toBe(1); // 7+1+2=10 -> 1+0=1
  });

  it("handles single-digit sum", () => {
    const result = calculateLifeNumber(1, 1, 1);
    expect(result.intermediate).toBe(3);
    expect(result.lifeNumber).toBe(3);
  });

  it("handles larger intermediate sums", () => {
    const result = calculateLifeNumber(9, 9, 9);
    expect(result.intermediate).toBe(27);
    expect(result.lifeNumber).toBe(9); // 2+7=9
  });
});

describe("calculateNumerologyReading", () => {
  it("returns complete reading for a birth date", () => {
    const reading = calculateNumerologyReading({ day: 15, month: 8, year: 1990 });
    expect(reading.numbers.consciousness).toBe(6); // 1+5=6
    expect(reading.numbers.action).toBe(8);
    expect(reading.numbers.realization).toBe(1); // 1+9+9+0=19->10->1
    expect(reading.numbers.lifeNumber).toBe(6); // 6+8+1=15 -> 1+5=6
    expect(reading.numbers.lifeNumberIntermediate).toBe(15);
    expect(reading.notation).toBe("6-8-1-6");
    expect(reading.birthDate).toEqual({ day: 15, month: 8, year: 1990 });
  });

  it("works for simple date", () => {
    const reading = calculateNumerologyReading({ day: 1, month: 1, year: 2000 });
    expect(reading.numbers.consciousness).toBe(1);
    expect(reading.numbers.action).toBe(1);
    expect(reading.numbers.realization).toBe(2);
    expect(reading.numbers.lifeNumber).toBe(4); // 1+1+2=4
    expect(reading.notation).toBe("1-1-2-4");
  });
});

describe("getNumberInterpretation", () => {
  it("returns interpretation for valid numbers 1-9", () => {
    for (let i = 1; i <= 9; i++) {
      const result = getNumberInterpretation(i);
      expect(result).toBeTruthy();
      expect(result).not.toBe("Неизвестное значение");
    }
  });

  it("returns fallback for invalid number", () => {
    expect(getNumberInterpretation(0)).toBe("Неизвестное значение");
    expect(getNumberInterpretation(10)).toBe("Неизвестное значение");
  });
});
