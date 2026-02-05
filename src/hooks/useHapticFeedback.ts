/**
 * useHapticFeedback - Unified haptic feedback hook for mobile app and PWA
 *
 * Supports:
 * - Capacitor Haptics (native iOS/Android)
 * - Web Vibration API (PWA/mobile web)
 *
 * Provides different feedback types for various interactions:
 * - light: Subtle feedback (selection, hover)
 * - medium: Standard feedback (button tap, toggle)
 * - heavy: Strong feedback (important actions, confirmations)
 * - success: Positive feedback pattern
 * - warning: Alert pattern
 * - error: Error notification pattern
 * - selection: Quick tick for selections
 */

import { useCallback, useMemo } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export type HapticFeedbackType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'selection'
  | 'tick';

// Web Vibration API patterns (in milliseconds)
const WEB_VIBRATION_PATTERNS: Record<HapticFeedbackType, number | number[]> = {
  light: 5,
  medium: 10,
  heavy: 20,
  success: [10, 50, 10],
  warning: [15, 30, 15, 30, 15],
  error: [20, 50, 20, 50, 20],
  selection: 3,
  tick: 1,
};

// Check if we're running in a native Capacitor app
const isNativeApp = Capacitor.isNativePlatform();

// Check if Web Vibration API is available
const hasWebVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator;

/**
 * Trigger haptic feedback using the appropriate API
 */
async function triggerHaptic(type: HapticFeedbackType): Promise<void> {
  try {
    if (isNativeApp) {
      // Use Capacitor Haptics for native apps
      switch (type) {
        case 'light':
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'medium':
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'heavy':
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        case 'success':
          await Haptics.notification({ type: NotificationType.Success });
          break;
        case 'warning':
          await Haptics.notification({ type: NotificationType.Warning });
          break;
        case 'error':
          await Haptics.notification({ type: NotificationType.Error });
          break;
        case 'selection':
        case 'tick':
          await Haptics.selectionStart();
          await Haptics.selectionEnd();
          break;
      }
    } else if (hasWebVibration) {
      // Use Web Vibration API for PWA/mobile web
      const pattern = WEB_VIBRATION_PATTERNS[type];
      navigator.vibrate(pattern);
    }
  } catch (error) {
    // Silently fail - haptics are not critical
    console.debug('Haptic feedback failed:', error);
  }
}

/**
 * Hook for haptic feedback in React components
 *
 * @example
 * const { haptic, impact, notify, selection } = useHapticFeedback();
 *
 * // General haptic feedback
 * haptic('medium');
 *
 * // Impact feedback (for taps, buttons)
 * impact('light');
 *
 * // Notification feedback (for results)
 * notify('success');
 *
 * // Selection feedback (for list items, tabs)
 * selection();
 */
export function useHapticFeedback() {
  // Main haptic trigger function
  const haptic = useCallback((type: HapticFeedbackType = 'medium') => {
    triggerHaptic(type);
  }, []);

  // Shorthand for impact feedback
  const impact = useCallback((style: 'light' | 'medium' | 'heavy' = 'medium') => {
    triggerHaptic(style);
  }, []);

  // Shorthand for notification feedback
  const notify = useCallback((type: 'success' | 'warning' | 'error') => {
    triggerHaptic(type);
  }, []);

  // Shorthand for selection feedback (quick tick)
  const selection = useCallback(() => {
    triggerHaptic('selection');
  }, []);

  // Quick tick for slider movements
  const tick = useCallback(() => {
    triggerHaptic('tick');
  }, []);

  // Check if haptic feedback is available
  const isAvailable = useMemo(() => isNativeApp || hasWebVibration, []);

  return {
    haptic,
    impact,
    notify,
    selection,
    tick,
    isAvailable,
    isNative: isNativeApp,
  };
}

/**
 * Standalone haptic trigger function for use outside of React components
 *
 * @example
 * import { triggerHapticFeedback } from '@/hooks/useHapticFeedback';
 *
 * triggerHapticFeedback('success');
 */
export const triggerHapticFeedback = triggerHaptic;

/**
 * Check if haptic feedback is available
 */
export const isHapticAvailable = isNativeApp || hasWebVibration;

export default useHapticFeedback;
