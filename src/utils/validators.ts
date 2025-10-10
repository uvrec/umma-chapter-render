// Простий набір валідаторів URL (Telegram окремо)

export const TELEGRAM_REGEX = /^https?:\/\/t\.me\/[A-Za-z0-9_]+(?:\/\d+)?\/?$/;

export function isValidHttpsUrlOrEmpty(value: string): boolean {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function isValidTelegramUrlOrEmpty(value: string): boolean {
  if (!value) return true;
  return TELEGRAM_REGEX.test(value.trim());
}
