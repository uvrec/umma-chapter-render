/**
 * Stub for virtual:pwa-register/react
 * Used in development mode when VitePWA plugin is disabled
 */

export function useRegisterSW(_options?: {
  onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
  onRegisterError?: (error: Error) => void;
  onNeedRefresh?: () => void;
  onOfflineReady?: () => void;
}) {
  return {
    needRefresh: [false, () => {}] as const,
    offlineReady: [false, () => {}] as const,
    updateServiceWorker: (_reloadPage?: boolean) => Promise.resolve(),
  };
}
