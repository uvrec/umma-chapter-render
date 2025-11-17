/**
 * Централізовані константи для типографіки VEDAVOICE
 *
 * Це єдине джерело правди для всіх розмірів шрифтів та множників.
 * Всі компоненти МАЮТЬ використовувати ці константи.
 */

/**
 * Множники розмірів шрифтів відносно базового fontSize
 *
 * Приклад: якщо базовий fontSize = 18px, то санскрит = 18 * 1.5 = 27px
 */
export const FONT_SIZE_MULTIPLIERS = {
  /** Базовий розмір (1x) */
  BASE: 1,

  /** Транслітерація (IAST, українська з діакритикою) - +10% */
  TRANSLIT: 1.1,

  /** Санскрит (Деванагарі) - +50% згідно Vedabase.io стандарту */
  SANSKRIT: 1.5,

  /** Заголовки секцій - +70% */
  HEADING: 1.7,

  /** Малий текст (footnotes, метадані) - -10% */
  SMALL: 0.9,

  /** Середній (послівний переклад, синоніми) - той самий що транслітерація */
  MEDIUM: 1.1,
} as const;

/**
 * Значення line-height для різних типів тексту
 */
export const LINE_HEIGHTS = {
  /** Компактний (для заголовків) */
  COMPACT: 1.4,

  /** Нормальний (для основного тексту) */
  NORMAL: 1.6,

  /** Розслаблений (для читабельності) */
  RELAXED: 1.75,

  /** Санскрит - використовує golden ratio для краси */
  SANSKRIT: 1.618,

  /** Дуже розслаблений (для складних текстів) */
  LOOSE: 2.0,
} as const;

/**
 * Базові розміри шрифтів для різних breakpoints
 * Ці значення використовуються як база для обчислення
 */
export const BASE_FONT_SIZES = {
  /** Extra Small (<420px) - дуже малі телефони */
  xs: 15,

  /** Small (420-639px) - смартфони */
  sm: 16,

  /** Medium (640-1023px) - планшети */
  md: 18,

  /** Large (≥1024px) - десктопи */
  lg: 20,
} as const;

/**
 * Breakpoints для responsive дизайну (відповідають Tailwind)
 */
export const BREAKPOINTS = {
  xs: 420,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1400,
} as const;

/**
 * Функція для отримання базового розміру шрифту залежно від ширини екрану
 */
export function getResponsiveBaseFontSize(windowWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1024): number {
  if (windowWidth < BREAKPOINTS.xs) return BASE_FONT_SIZES.xs;
  if (windowWidth < BREAKPOINTS.sm) return BASE_FONT_SIZES.sm;
  if (windowWidth < BREAKPOINTS.lg) return BASE_FONT_SIZES.md;
  return BASE_FONT_SIZES.lg;
}

/**
 * Функція для отримання обчисленого розміру шрифту
 *
 * @param baseSize - Базовий розмір (з useReaderSettings або responsive)
 * @param multiplier - Множник з FONT_SIZE_MULTIPLIERS
 * @returns Обчислений розмір у пікселях
 */
export function getCalculatedFontSize(baseSize: number, multiplier: number): number {
  return Math.round(baseSize * multiplier);
}

/**
 * CSS змінні для використання в calc()
 * Використовуйте це в inline styles для адаптивності
 */
export const CSS_VARIABLES = {
  /** Базовий розмір читалки */
  BASE_FONT_SIZE: '--vv-reader-font-size',

  /** Line height читалки */
  LINE_HEIGHT: '--vv-reader-line-height',

  /** Розмір санскриту */
  SANSKRIT_SIZE: '--sanskrit-font-size',

  /** Розмір транслітерації */
  TRANSLIT_SIZE: '--translit-font-size',
} as const;

/**
 * Хелпер для створення CSS calc() виразу
 *
 * @example
 * getCSSCalc('BASE_FONT_SIZE', 1.5) // "calc(var(--vv-reader-font-size) * 1.5)"
 */
export function getCSSCalc(variable: keyof typeof CSS_VARIABLES, multiplier: number = 1): string {
  return `calc(var(${CSS_VARIABLES[variable]}) * ${multiplier})`;
}

/**
 * Типи екранів для зручності
 */
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/**
 * Функція для визначення типу екрану
 */
export function getScreenSize(windowWidth: number = typeof window !== 'undefined' ? window.innerWidth : 1024): ScreenSize {
  if (windowWidth < BREAKPOINTS.xs) return 'xs';
  if (windowWidth < BREAKPOINTS.sm) return 'sm';
  if (windowWidth < BREAKPOINTS.md) return 'md';
  if (windowWidth < BREAKPOINTS.lg) return 'lg';
  if (windowWidth < BREAKPOINTS.xl) return 'xl';
  return '2xl';
}
