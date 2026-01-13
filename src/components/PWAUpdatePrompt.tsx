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
import type { ComponentType } from 'react';

// Only import PWAUpdatePromptImpl in production mode
// In dev mode, virtual:pwa-register is not available
let PWAUpdatePromptImpl: ComponentType | null = null;

if (import.meta.env.PROD) {
  PWAUpdatePromptImpl = lazy(() => import('./PWAUpdatePromptImpl'));
}

export function PWAUpdatePrompt() {
  // Always return null in development
  if (!PWAUpdatePromptImpl) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <PWAUpdatePromptImpl />
    </Suspense>
  );
}
