// Приймає профілі, канали та пости у Telegram
// приклади: 
// https://t.me/prabhupada_ua
// https://t.me/prabhupada_ua/123
// https://t.me/s/prabhupada_ua/123
// https://t.me/c/123456789/987
// https://t.me/+AbCdEfGhIj
// http://t.me/joinchat/AbCd_Ef-Gh
export function isValidTelegramUrl(url: string): boolean {
  if (!url) return true; // порожнє — ок (поле не обовʼязкове)
  try {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) return false;
    if (!/^t\.me$/i.test(u.hostname)) return false;

    // нормалізуємо шлях без початкового слешу
    const path = u.pathname.replace(/^\/+/, "");

    // варіанти:
    // username
    // username/123
    // s/username
    // s/username/123
    // c/123/456
    // +InviteCode
    // joinchat/InviteCode
    const re = new RegExp(
      "^(" +
        "[A-Za-z0-9_]{5,}(?:/\\d+)?"+               // username або пост
      "|" +
        "s/[A-Za-z0-9_]{5,}(?:/\\d+)?"+             // дзеркало 's'
      "|" +
        "c/\\d+/\\d+"+                              // приватні канали: c/<id>/<post>
      "|" +
        "\\+[A-Za-z0-9_-]+"+                        // запрошення +код
      "|" +
        "joinchat/[A-Za-z0-9_-]+"+                  // старий joinchat
      + ")$"
    );
    return re.test(path);
  } catch {
    return false;
  }
}
