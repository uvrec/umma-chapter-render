/**
 * NumCal - Нумерологічний калькулятор для розрахунку чисел за датою народження
 */

export interface NumCalResult {
  /** Число Розуму (Свідомості) - день народження */
  mindNumber: number;
  /** Число Дії - сума всіх цифр дати */
  actionNumber: number;
  /** Число Реалізації - сума Числа Розуму та Числа Дії */
  realizationNumber: number;
  /** Число Підсумку - сума всіх трьох чисел */
  resultNumber: number;
  /** Двозначне число перед зведенням до однієї цифри (для детального аналізу) */
  resultNumberDouble?: number;
  /** Формат запису: X-X-X-X */
  formatted: string;
}

/**
 * Зводить число до однієї цифри шляхом додавання його цифр
 * @param num - число для зведення
 * @returns одноцифрове число (1-9)
 */
function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return num;
}

/**
 * Розраховує всі нумерологічні числа за датою народження
 * @param birthDate - дата народження (Date або рядок у форматі YYYY-MM-DD)
 * @returns об'єкт з усіма розрахованими числами
 */
export function calculateNumCal(birthDate: Date | string): NumCalResult {
  const date = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;

  // Отримуємо компоненти дати
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() повертає 0-11
  const year = date.getFullYear();

  // 1. Число Розуму (Свідомості) - день народження, зведений до однієї цифри
  const mindNumber = reduceToSingleDigit(day);

  // 2. Число Дії - сума всіх цифр дати народження
  const allDigits = `${day}${month}${year}`.split('').map(d => parseInt(d, 10));
  const sumOfAllDigits = allDigits.reduce((sum, digit) => sum + digit, 0);
  const actionNumber = reduceToSingleDigit(sumOfAllDigits);

  // 3. Число Реалізації - сума Числа Розуму та Числа Дії
  const realizationSum = mindNumber + actionNumber;
  const realizationNumber = reduceToSingleDigit(realizationSum);

  // 4. Число Підсумку - сума всіх трьох чисел
  const resultSum = mindNumber + actionNumber + realizationNumber;
  const resultNumber = reduceToSingleDigit(resultSum);

  // Зберігаємо двозначне число Підсумку для детального аналізу (якщо воно було двозначним)
  const resultNumberDouble = resultSum > 9 ? resultSum : undefined;

  // Формат запису: X-X-X-X
  const formatted = `${mindNumber}-${actionNumber}-${realizationNumber}-${resultNumber}`;

  return {
    mindNumber,
    actionNumber,
    realizationNumber,
    resultNumber,
    resultNumberDouble,
    formatted,
  };
}

/**
 * Валідує дату народження
 * @param date - дата для валідації
 * @returns true, якщо дата валідна
 */
export function isValidBirthDate(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d instanceof Date && !isNaN(d.getTime()) && d <= new Date();
}

/**
 * Форматує дату у форматі DD.MM.YYYY
 * @param date - дата для форматування
 * @returns рядок у форматі DD.MM.YYYY
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
