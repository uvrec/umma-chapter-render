/**
 * PWA Update Prompt - автоматичне оновлення при новій версії
 *
 * Працює з registerType: 'autoUpdate' в vite-plugin-pwa
 * При виявленні нової версії — автоматично перезавантажує сторінку
 * (без кнопки "Закрити", щоб гарантувати свіжий код)
 *
 * В development режимі (Lovable preview) — PWA вимкнено, компонент не рендериться
 */

import { lazy, Suspense } from 'react';

// Lazy load PWA компонент тільки в production
const PWAUpdatePromptImpl = import.meta.env.PROD
  ? lazy(() => import('./PWAUpdatePromptImpl'))
  : () => null;

export function PWAUpdatePrompt() {
  if (import.meta.env.DEV) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <PWAUpdatePromptImpl />
    </Suspense>
  );
}
