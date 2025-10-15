import { useEffect } from "react";

interface TelegramEmbedProps {
  /** Повне посилання на пост у форматі: https://t.me/channel/123 */
  url: string;
  /** Додаткові класи Tailwind */
  className?: string;
  /** Ширина в процентах або px (за замовчуванням "100%") */
  width?: string;
  /** Тема — light | dark */
  theme?: "light" | "dark";
}

/**
 * TelegramEmbed — вбудовує публікації з Telegram (пости, повідомлення каналів).
 * Завантажує офіційний віджет telegram-widget.js, якщо він ще не завантажений.
 */
export const TelegramEmbed = ({ url, className = "", width = "100%", theme = "light" }: TelegramEmbedProps) => {
  // Безпечне завантаження Telegram віджета
  useEffect(() => {
    const ensureTelegramScript = () => {
      if (document.getElementById("telegram-widget-script")) return;

      const script = document.createElement("script");
      script.id = "telegram-widget-script";
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.async = true;
      document.body.appendChild(script);
    };

    ensureTelegramScript();
  }, []);

  // Витягаємо channel та post ID з URL
  const match = url.match(/t\.me\/([^/]+)\/(\d+)/);
  if (!match) {
    return (
      <div className="p-4 border border-destructive rounded-md bg-destructive/5 text-center">
        <p className="text-destructive text-sm font-medium">
          Невалідне посилання Telegram. Формат: https://t.me/channel/123
        </p>
      </div>
    );
  }

  const [, channel, postId] = match;

  return (
    <div className={`w-full ${className}`}>
      <div className="verse-surface p-6 rounded-lg">
        <blockquote
          className="telegram-post w-full"
          data-telegram-post={`${channel}/${postId}`}
          data-width="100%"
          data-dark={theme === "dark" ? "1" : "0"}
        ></blockquote>
      </div>
    </div>
  );
};
