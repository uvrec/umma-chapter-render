/**
 * NumCal - Нумерологічний калькулятор для розрахунку чисел за датою народження
 */

/**
 * Цикл розвитку енергії - кожне число належить до одного з трьох циклів
 */
export interface EnergyCycle {
  /** Номер циклу (1, 2 або 3) */
  cycleNumber: 1 | 2 | 3;
  /** Числа в циклі розвитку */
  numbers: [number, number, number];
  /** Опис циклу */
  description: string;
}

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
  /** Остання цифра року народження - життєве завдання */
  lastYearDigit: number;
  /** Формат запису: X-X-X-X */
  formatted: string;
  /** Цикли розвитку для кожного числа */
  cycles: {
    mind: EnergyCycle;
    action: EnergyCycle;
    realization: EnergyCycle;
    result: EnergyCycle;
  };
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
 * Визначає цикл розвитку енергії для числа
 * Кожне число розвивається через додавання +3 тричі:
 * Наприклад: 7 → 1 (7+3=10→1) → 4 (1+3=4) → 7 (4+3=7)
 * @param num - число (1-9)
 * @returns об'єкт з інформацією про цикл розвитку
 */
function getEnergyCycle(num: number): EnergyCycle {
  // Перший крок: додаємо +3 до початкового числа
  const step1 = reduceToSingleDigit(num + 3);
  // Другий крок: додаємо +3 до першого кроку
  const step2 = reduceToSingleDigit(step1 + 3);
  // Третій крок повертає нас до початкового числа
  // const step3 = reduceToSingleDigit(step2 + 3); // це буде = num

  // Визначаємо тип циклу за залишком від ділення на 3
  const remainder = num % 3;
  let cycleNumber: 1 | 2 | 3;
  let cycleType: string;

  if (remainder === 1) {
    cycleNumber = 1;
    cycleType = 'Лідерства та Дисципліни';
  } else if (remainder === 2) {
    cycleNumber = 2;
    cycleType = 'Балансу та Матеріальності';
  } else {
    cycleNumber = 3;
    cycleType = 'Творчості та Служіння';
  }

  return {
    cycleNumber,
    numbers: [num, step1, step2] as [number, number, number],
    description: `Цикл ${cycleType}: ${num} → ${step1} → ${step2} → ${num}`
  };
}

/**
 * Розраховує всі нумерологічні числа за датою народження
 * @param birthDate - дата народження (Date або рядок у форматі YYYY-MM-DD)
 * @returns об'єкт з усіма розрахованими числами
 */
export function calculateNumCal(birthDate: Date | string): NumCalResult {
  let day: number;
  let month: number;
  let year: number;

  if (typeof birthDate === 'string') {
    // Розбираємо рядок вручну, щоб уникнути проблем з часовими поясами
    const parts = birthDate.split('-');
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10);
    day = parseInt(parts[2], 10);
  } else {
    // Якщо це Date об'єкт
    day = birthDate.getDate();
    month = birthDate.getMonth() + 1; // getMonth() повертає 0-11
    year = birthDate.getFullYear();
  }

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

  // Остання цифра року народження - вказує на життєве завдання
  const lastYearDigit = year % 10;

  // Формат запису: X-X-X-X
  const formatted = `${mindNumber}-${actionNumber}-${realizationNumber}-${resultNumber}`;

  // Визначаємо цикли розвитку для кожного числа
  const cycles = {
    mind: getEnergyCycle(mindNumber),
    action: getEnergyCycle(actionNumber),
    realization: getEnergyCycle(realizationNumber),
    result: getEnergyCycle(resultNumber),
  };

  return {
    mindNumber,
    actionNumber,
    realizationNumber,
    resultNumber,
    resultNumberDouble,
    lastYearDigit,
    formatted,
    cycles,
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
