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

// Доступні шрифти (ПОТОЧНІ налаштування сайту)
export const AVAILABLE_FONTS = {
  sanskrit: [
    { value: '"Noto Sans Devanagari", sans-serif', label: 'Noto Sans Devanagari (поточний)' },
    { value: 'var(--font-devanagari)', label: 'Noto Sans Devanagari (Vedabase)' },
  ],
  transliteration: [
    { value: '"Charis SIL", "Gentium Plus", "Noto Serif", serif', label: 'Charis SIL (поточний, українська діакритика)' },
    { value: '"Gentium Plus", "Noto Serif", serif', label: 'Gentium Plus' },
    { value: '"Noto Serif", serif', label: 'Noto Serif' },
    { value: 'Georgia, serif', label: 'Georgia' },
  ],
  synonyms: [
    { value: '"Charis SIL", "Noto Serif", serif', label: 'Charis SIL (поточний)' },
    { value: '"Noto Serif", serif', label: 'Noto Serif' },
    { value: 'Georgia, serif', label: 'Georgia' },
  ],
  text: [
    { value: 'inherit', label: 'Успадкований (поточний)' },
    { value: '"Noto Serif", serif', label: 'Noto Serif' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'system-ui, sans-serif', label: 'System UI' },
  ],
};

// Налаштування за замовчуванням (ПОТОЧНІ налаштування сайту)
export const DEFAULT_ADMIN_TYPOGRAPHY: AdminTypographyConfig = {
  sanskrit: {
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    fontSize: 1.15, // +15% від базового (поточне)
    fontWeight: 400,
    fontStyle: 'normal',
    color: 'hsl(var(--foreground))',
    letterSpacing: '0em',
    lineHeight: 1.6,
  },
  transliteration: {
    fontFamily: '"Charis SIL", "Gentium Plus", "Noto Serif", serif', // Charis SIL для української діакритики
    fontSize: 1, // базовий розмір (поточне)
    fontWeight: 400,
    fontStyle: 'italic', // курсив (поточне)
    color: 'hsl(var(--foreground))',
    letterSpacing: '0.01em', // (поточне)
    lineHeight: 1.6,
  },
  synonyms: {
    fontFamily: '"Charis SIL", "Noto Serif", serif',
    fontSize: 1,
    fontWeight: 400,
    fontStyle: 'normal',
    color: 'hsl(var(--foreground))',
    letterSpacing: '0em',
    lineHeight: 1.75,
  },
  translation: {
    fontFamily: 'inherit', // успадковується (поточне)
    fontSize: 1,
    fontWeight: 400,
    fontStyle: 'normal',
    color: 'hsl(var(--foreground))',
    letterSpacing: '0em',
    lineHeight: 1.6,
  },
  commentary: {
    fontFamily: 'inherit', // успадковується (поточне)
    fontSize: 1,
    fontWeight: 400,
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
