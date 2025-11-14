import { BirthDate, NumerologyNumbers, NumerologyReading } from "@/types/numerology";

/**
 * Reduces a number to a single digit by summing its digits repeatedly
 * Example: 2000 -> 2+0+0+0 = 2
 * Example: 1989 -> 1+9+8+9 = 27 -> 2+7 = 9
 */
export const reduceToSingleDigit = (num: number): number => {
  while (num > 9) {
    num = num
      .toString()
      .split('')
      .map(Number)
      .reduce((sum, digit) => sum + digit, 0);
  }
  return num;
};

/**
 * Calculates the Consciousness Number (Число Сознания)
 * Based on the day of birth
 */
export const calculateConsciousnessNumber = (day: number): number => {
  return reduceToSingleDigit(day);
};

/**
 * Calculates the Action Number (Число Действия)
 * Based on the month of birth
 */
export const calculateActionNumber = (month: number): number => {
  return reduceToSingleDigit(month);
};

/**
 * Calculates the Realization Number (Число Реализации)
 * Based on the year of birth
 */
export const calculateRealizationNumber = (year: number): number => {
  return reduceToSingleDigit(year);
};

/**
 * Calculates the Life Number (Число Итога)
 * Sum of Consciousness + Action + Realization, reduced to single digit
 * Also returns the intermediate sum before final reduction
 */
export const calculateLifeNumber = (
  consciousness: number,
  action: number,
  realization: number
): { lifeNumber: number; intermediate: number } => {
  const sum = consciousness + action + realization;
  const reduced = reduceToSingleDigit(sum);

  return {
    lifeNumber: reduced,
    intermediate: sum,
  };
};

/**
 * Performs a complete numerology reading for a birth date
 */
export const calculateNumerologyReading = (birthDate: BirthDate): NumerologyReading => {
  const consciousness = calculateConsciousnessNumber(birthDate.day);
  const action = calculateActionNumber(birthDate.month);
  const realization = calculateRealizationNumber(birthDate.year);

  const { lifeNumber, intermediate } = calculateLifeNumber(consciousness, action, realization);

  const numbers: NumerologyNumbers = {
    consciousness,
    action,
    realization,
    lifeNumber,
    lifeNumberIntermediate: intermediate,
  };

  const notation = `${consciousness}-${action}-${realization}-${lifeNumber}`;

  return {
    birthDate,
    numbers,
    notation,
  };
};

/**
 * Get interpretations for each number (basic descriptions)
 * These can be expanded with more detailed interpretations
 */
export const getNumberInterpretation = (number: number): string => {
  const interpretations: Record<number, string> = {
    1: "Лидерство, независимость, инициативность. Энергия единицы помогает вести людей за собой и начинать новые проекты.",
    2: "Дипломатия, партнерство, сотрудничество. Энергия двойки способствует гармоничным отношениям и командной работе.",
    3: "Творчество, общение, обучение. Энергия тройки развивает способности к самовыражению и передаче знаний.",
    4: "Стабильность, практичность, трудолюбие. Энергия четверки создает прочную основу и материальную реализацию.",
    5: "Свобода, адаптивность, путешествия. Энергия пятерки приносит динамику, изменения и новый опыт.",
    6: "Ответственность, забота, гармония. Энергия шестерки развивает служение другим и создание красоты.",
    7: "Духовность, дисциплина, анализ. Энергия семерки ведет к мудрости через практику и самопознание.",
    8: "Материальное мастерство, сила, контроль. Энергия восьмерки развивает деловые качества и финансовый успех.",
    9: "Завершение, мудрость, гуманность. Энергия девятки объединяет все предыдущие уроки и служит высшим целям.",
  };

  return interpretations[number] || "Неизвестное значение";
};
