// Адмін налаштування типографіки для всього сайту
// Ці налаштування контролюють глобальні стилі для різних блоків тексту

export type TypographyBlockType = 'sanskrit' | 'transliteration' | 'synonyms' | 'translation' | 'commentary';

export interface BlockStyle {
  fontFamily: string;
  fontSize: number; // множник відносно базового розміру
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  color: string;
  letterSpacing: string;
  lineHeight: number;
}

export interface AdminTypographyConfig {
  sanskrit: BlockStyle;
  transliteration: BlockStyle;
  synonyms: BlockStyle;
  translation: BlockStyle;
  commentary: BlockStyle;
}

// Доступні шрифти (відповідно до Vedabase.io specification)
export const AVAILABLE_FONTS = {
  sanskrit: [
    { value: 'var(--font-devanagari)', label: 'Noto Sans Devanagari (Vedabase)' },
    { value: '"Noto Sans Devanagari", sans-serif', label: 'Noto Sans Devanagari' },
  ],
  transliteration: [
    { value: 'var(--font-translit)', label: 'Noto Serif (notoSerifVedabase)' },
    { value: '"Noto Serif", serif', label: 'Noto Serif' },
    { value: 'Georgia, serif', label: 'Georgia' },
  ],
  synonyms: [
    { value: 'var(--font-synonyms)', label: 'Noto Serif (з діакритикою)' },
    { value: '"Noto Serif", serif', label: 'Noto Serif' },
    { value: 'var(--font-primary)', label: 'Noto Serif variable' },
    { value: 'system-ui, sans-serif', label: 'System UI' },
  ],
  text: [
    { value: 'var(--font-primary)', label: 'Noto Serif variable (Vedabase)' },
    { value: '"Noto Serif", serif', label: 'Noto Serif' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'system-ui, sans-serif', label: 'System UI' },
  ],
  bengali: [
    { value: 'var(--font-bengali)', label: 'Noto Serif (для транслітерації)' },
    { value: '"Noto Serif", serif', label: 'Noto Serif' },
  ],
};

// Налаштування за замовчуванням (Vedabase.io specification)
export const DEFAULT_ADMIN_TYPOGRAPHY: AdminTypographyConfig = {
  sanskrit: {
    fontFamily: 'var(--font-devanagari)', // Noto Sans Devanagari
    fontSize: 1.5, // 150% від базового (як на Vedabase)
    fontWeight: 700, // Bold
    fontStyle: 'normal',
    color: 'hsl(var(--foreground))',
    letterSpacing: '0em',
    lineHeight: 1.618, // golden ratio
  },
  transliteration: {
    fontFamily: 'var(--font-translit)', // Noto Serif (notoSerifVedabase custom)
    fontSize: 1.1, // 110% від базового
    fontWeight: 400, // Regular
    fontStyle: 'normal', // Vedabase uses normal, not italic
    color: 'hsl(var(--muted-foreground))',
    letterSpacing: '0em',
    lineHeight: 1.6,
  },
  synonyms: {
    fontFamily: 'var(--font-synonyms)', // Noto Serif з підтримкою діакритики
    fontSize: 0.95, // 95% від базового
    fontWeight: 400, // Regular
    fontStyle: 'normal',
    color: 'hsl(var(--foreground))',
    letterSpacing: '0em',
    lineHeight: 1.75,
  },
  translation: {
    fontFamily: 'var(--font-primary)', // Noto Serif variable 100-900
    fontSize: 1.0, // 100% від базового
    fontWeight: 400, // Regular (variable font підтримує 100-900)
    fontStyle: 'normal',
    color: 'hsl(var(--foreground))',
    letterSpacing: '0em',
    lineHeight: 1.6,
  },
  commentary: {
    fontFamily: 'var(--font-primary)', // Noto Serif variable 100-900
    fontSize: 1.0, // 100% від базового
    fontWeight: 400, // Regular (variable font підтримує 100-900)
    fontStyle: 'normal',
    color: 'hsl(var(--foreground))',
    letterSpacing: '0em',
    lineHeight: 1.75,
  },
};

// Зберігання/читання з localStorage
const ADMIN_TYPOGRAPHY_KEY = 'vv_admin_typography_config';

export function loadAdminTypography(): AdminTypographyConfig {
  try {
    const stored = localStorage.getItem(ADMIN_TYPOGRAPHY_KEY);
    if (stored) {
      return { ...DEFAULT_ADMIN_TYPOGRAPHY, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading admin typography config:', error);
  }
  return DEFAULT_ADMIN_TYPOGRAPHY;
}

export function saveAdminTypography(config: AdminTypographyConfig): void {
  try {
    localStorage.setItem(ADMIN_TYPOGRAPHY_KEY, JSON.stringify(config));
    // Диспатчимо подію для оновлення компонентів
    window.dispatchEvent(new CustomEvent('vv-admin-typography-changed', { detail: config }));
  } catch (error) {
    console.error('Error saving admin typography config:', error);
  }
}

export function resetAdminTypography(): void {
  localStorage.removeItem(ADMIN_TYPOGRAPHY_KEY);
  window.dispatchEvent(new CustomEvent('vv-admin-typography-changed', { detail: DEFAULT_ADMIN_TYPOGRAPHY }));
}

export function exportAdminTypography(): string {
  const config = loadAdminTypography();
  return JSON.stringify(config, null, 2);
}

export function importAdminTypography(jsonString: string): boolean {
  try {
    const config = JSON.parse(jsonString) as AdminTypographyConfig;
    saveAdminTypography(config);
    return true;
  } catch (error) {
    console.error('Error importing admin typography config:', error);
    return false;
  }
}

// Застосувати налаштування до CSS змінних
export function applyAdminTypographyToCSS(config: AdminTypographyConfig): void {
  const root = document.documentElement;

  // Застосовуємо кожен блок як CSS змінні
  Object.entries(config).forEach(([blockType, style]) => {
    root.style.setProperty(`--vv-${blockType}-font-family`, style.fontFamily);
    root.style.setProperty(`--vv-${blockType}-font-size-multiplier`, String(style.fontSize));
    root.style.setProperty(`--vv-${blockType}-font-weight`, String(style.fontWeight));
    root.style.setProperty(`--vv-${blockType}-font-style`, style.fontStyle);
    root.style.setProperty(`--vv-${blockType}-color`, style.color);
    root.style.setProperty(`--vv-${blockType}-letter-spacing`, style.letterSpacing);
    root.style.setProperty(`--vv-${blockType}-line-height`, String(style.lineHeight));
  });
}
