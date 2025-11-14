import { BirthDate } from "@/types/numerology";

/**
 * Validates if a date is valid
 */
export const isValidDate = (day: number, month: number, year: number): boolean => {
  if (day < 1 || day > 31) return false;
  if (month < 1 || month > 12) return false;
  if (year < 1900 || year > 2100) return false;

  // Check specific month-day combinations
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check for leap year
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  if (month === 2 && isLeapYear) {
    return day <= 29;
  }

  return day <= daysInMonth[month - 1];
};

/**
 * Parses a date string in format DD.MM.YYYY or DD/MM/YYYY
 */
export const parseBirthDate = (dateString: string): BirthDate | null => {
  const parts = dateString.split(/[./]/);

  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (!isValidDate(day, month, year)) return null;

  return { day, month, year };
};

/**
 * Formats a birth date as DD.MM.YYYY
 */
export const formatBirthDate = (birthDate: BirthDate): string => {
  const day = birthDate.day.toString().padStart(2, '0');
  const month = birthDate.month.toString().padStart(2, '0');
  return `${day}.${month}.${birthDate.year}`;
};

/**
 * Creates a birth date from individual components
 */
export const createBirthDate = (day: string, month: string, year: string): BirthDate | null => {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  if (!isValidDate(d, m, y)) return null;

  return { day: d, month: m, year: y };
};
