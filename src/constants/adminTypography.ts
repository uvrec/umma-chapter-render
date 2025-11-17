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

// Доступні шрифти
export const AVAILABLE_FONTS = {
  sanskrit: [
    { value: 'var(--font-devanagari)', label: 'Noto Sans Devanagari (default)' },
    { value: 'Siddhanta, serif', label: 'Siddhanta' },
    { value: 'Mangal, serif', label: 'Mangal' },
    { value: 'Sanskrit2003, serif', label: 'Sanskrit 2003' },
  ],
  transliteration: [
    { value: 'var(--font-translit)', label: 'Noto Serif (default)' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Palatino, serif', label: 'Palatino' },
  ],
  text: [
    { value: 'var(--font-primary)', label: 'UI Font (default)' },
    { value: 'system-ui, sans-serif', label: 'System UI' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
  ],
};

// Налаштування за замовчуванням
export const DEFAULT_ADMIN_TYPOGRAPHY: AdminTypographyConfig = {
  sanskrit: {
    fontFamily: 'var(--font-devanagari)',
    fontSize: 1.5, // 150% від базового
    fontWeight: 400,
    fontStyle: 'normal',
    color: 'hsl(var(--foreground))',
    letterSpacing: '0em',
    lineHeight: 1.618, // golden ratio
  },
  transliteration: {
    fontFamily: 'var(--font-translit)',
    fontSize: 1.1, // 110% від базового
    fontWeight: 400,
    fontStyle: 'italic',
    color: 'hsl(var(--muted-foreground))',
    letterSpacing: '0.02em',
    lineHeight: 1.6,
  },
  synonyms: {
    fontFamily: 'var(--font-primary)',
    fontSize: 0.95, // 95% від базового
    fontWeight: 400,
    fontStyle: 'normal',
    color: 'hsl(var(--foreground))',
    letterSpacing: '0em',
    lineHeight: 1.8,
  },
  translation: {
    fontFamily: 'var(--font-primary)',
    fontSize: 1.0, // 100% від базового
    fontWeight: 400,
    fontStyle: 'normal',
    color: 'hsl(var(--foreground))',
    letterSpacing: '0em',
    lineHeight: 1.6,
  },
  commentary: {
    fontFamily: 'var(--font-primary)',
    fontSize: 1.0, // 100% від базового
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
