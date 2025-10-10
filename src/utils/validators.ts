// src/utils/validators.ts
import { z } from "zod";

/** Додає https:// якщо користувач ввів домен без протоколу */
export function normalizeHttpUrl(input: string): string {
  if (!input) return "";
  const s = input.trim();
  if (/^https?:\/\//i.test(s)) return s;
  if (/^t\.me\b/i.test(s)) return `https://${s}`;
  return s;
}

/**
 * Приймає профілі, канали та пости у Telegram.
 * Підтримувані приклади:
 *  - https://t.me/prabhupada_ua
 *  - https://t.me/prabhupada_ua/123
 *  - https://t.me/s/prabhupada_ua
 *  - https://t.me/s/prabhupada_ua/123
 *  - https://t.me/c/123456789/987
 *  - https://t.me/+AbCdEfGhIj
 *  - http://t.me/joinchat/AbCd_Ef-Gh
 * Також підтримується домен telegram.me (дзеркало t.me).
 */
export function isValidTelegramUrl(url: string): boolean {
  if (!url) return true; // поле необов’язкове

  // нормалізуємо можливе введення без протоколу
  const normalized = normalizeHttpUrl(url);

  try {
    const u = new URL(normalized);

    // дозволяємо t.me та telegram.me
    if (!/^t(elegram)?\.me$/i.test(u.hostname)) return false;
    if (!/^https?:$/i.test(u.protocol)) return false;

    // шлях без початкових слешів, ігноруємо фінальний слеш
    const path = u.pathname.replace(/^\/+/, "").replace(/\/+$/, "");

    // username: 5–32 символів (латиниця/цифри/підкреслення), опціонально /<postId>
    // s/username, s/username/<postId>
    // c/<chatId>/<postId>
    // +InviteCode
    // joinchat/<InviteCode>
    const re = new RegExp(
      "^(" +
        "[A-Za-z0-9_]{5,32}(?:/\\d+)?" +
        "|" +
        "s/[A-Za-z0-9_]{5,32}(?:/\\d+)?" +
        "|" +
        "c/\\d+/\\d+" +
        "|" +
        "\\+[A-Za-z0-9_-]+" +
        "|" +
        "joinchat/[A-Za-z0-9_-]+" +
        ")$",
    );

    return re.test(path);
  } catch {
    return false;
  }
}

/** Універсальна https? URL-схема (порожнє значення — валідне). */
export const httpsUrlSchema = z
  .string()
  .transform((v) => normalizeHttpUrl(v || ""))
  .refine((v) => !v || /^https?:\/\//i.test(v), { message: "Повинен починатися з http(s)://" })
  .or(z.literal(""));

/** Zod-схема саме під Telegram (з нормалізацією). */
export const telegramUrlSchema = z
  .string()
  .transform((v) => normalizeHttpUrl(v || ""))
  .refine((v) => isValidTelegramUrl(v), {
    message:
      "Невалідне посилання Telegram. Приклади: https://t.me/канал, https://t.me/канал/123, https://t.me/s/канал/123, https://t.me/c/123/456, https://t.me/+код, http://t.me/joinchat/код",
  })
  .or(z.literal(""));
