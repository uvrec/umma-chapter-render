/**
 * PWA Update Prompt - автоматичне оновлення при новій версії
 *
 * Працює з registerType: 'autoUpdate' в vite-plugin-pwa
 * При виявленні нової версії — автоматично перезавантажує сторінку
 * (без кнопки "Закрити", щоб гарантувати свіжий код)
 *
 * В development режимі (Lovable preview) — PWA вимкнено, компонент використовує stub
 */

import { lazy, Suspense } from 'react';

// Lazy load PWA component - in dev mode it will use the stub from vite.config.ts alias
const PWAUpdatePromptImpl = lazy(() => import('./PWAUpdatePromptImpl'));

export function PWAUpdatePrompt() {
  // In development, the stub makes useRegisterSW return needRefresh: false
  // so the component renders null anyway
  return (
    <Suspense fallback={null}>
      <PWAUpdatePromptImpl />
    </Suspense>
  );
}
