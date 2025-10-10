// src/utils/validators.ts
import { z } from "zod";

/** Додає https:// якщо користувач ввів домен без протоколу */
export function normalizeHttpUrl(input: string): string {
  if (!input) return "";
  const s = input.trim();
  if (/^https?:\/\//i.test(s)) return s;
  // для зручності: t.me → https://t.me
  if (/^(t\.me|telegram\.me)\b/i.test(s)) return `https://${s}`;
  return s;
}

/**
 * Повний регекс для Telegram-URL:
 * підтримує:
 *  - https?://t.me/<username>[/<postId>]
 *  - https?://t.me/s/<username>[/<postId>]
 *  - https?://t.me/c/<chatId>/<postId>
 *  - https?://t.me/+<InviteCode>
 *  - http(s)://t.me/joinchat/<InviteCode>
 *  (та дзеркало telegram.me)
 */
export const TELEGRAM_REGEX =
  /^(?:https?:\/\/)?(?:t\.me|telegram\.me)\/(?:(?:[A-Za-z0-9_]{5,32}(?:\/\d+)?)|(?:s\/[A-Za-z0-9_]{5,32}(?:\/\d+)?)|(?:c\/\d+\/\d+)|(?:\+[A-Za-z0-9_-]+)|(?:joinchat\/[A-Za-z0-9_-]+))\/?$/i;

/** Перевіряє https? URL або порожнє значення (порожнє — валідне) */
export function isValidHttpsUrlOrEmpty(url: string): boolean {
  if (!url) return true;
  try {
    const v = normalizeHttpUrl(url);
    const u = new URL(v);
    return /^https?:$/i.test(u.protocol);
  } catch {
    return false;
  }
}

/** Перевіряє Telegram-URL або порожнє значення (порожнє — валідне) */
export function isValidTelegramUrlOrEmpty(url: string): boolean {
  if (!url) return true;
  const v = normalizeHttpUrl(url);
  return TELEGRAM_REGEX.test(v);
}

/* ===== Необов’язково, але зручно: готові Zod-схеми ===== */

export const httpsUrlSchema = z
  .string()
  .transform((v) => normalizeHttpUrl(v || ""))
  .refine(isValidHttpsUrlOrEmpty, { message: "Невірний формат URL" });

export const telegramUrlSchema = z
  .string()
  .transform((v) => normalizeHttpUrl(v || ""))
  .refine(isValidTelegramUrlOrEmpty, {
    message:
      "Невалідне посилання Telegram. Приклади: https://t.me/канал, https://t.me/канал/123, https://t.me/s/канал/123, https://t.me/c/123/456, https://t.me/+код, http://t.me/joinchat/код",
  });
