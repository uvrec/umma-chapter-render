export interface BirthDate {
  day: number;
  month: number;
  year: number;
}

export interface NumerologyNumbers {
  consciousness: number;      // Число Сознания (day of birth)
  action: number;             // Число Действия (month of birth)
  realization: number;        // Число Реализации (year of birth)
  lifeNumber: number;         // Число Итога (sum of consciousness + action + realization)
  lifeNumberIntermediate?: number; // The intermediate sum before final reduction (e.g., 16 before reducing to 7)
}

export interface NumerologyReading {
  birthDate: BirthDate;
  numbers: NumerologyNumbers;
  notation: string; // Format: "consciousness-action-realization-lifeNumber" (e.g., "7-1-8-7")
}

export interface NumberInterpretation {
  number: number;
  positive: string;
  negative: string;
  description: string;
}
