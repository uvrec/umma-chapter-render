import { useEffect } from "react";

interface InstagramEmbedProps {
  /** Повне посилання на пост або рілс, наприклад:
   *  https://www.instagram.com/p/XXXXXXX/ або https://www.instagram.com/reel/XXXXXXX/
   */
  url: string;

  /** Додаткові класи Tailwind для зовнішнього контейнера */
  className?: string;
}

/**
 * InstagramEmbed — компонент для вставки Instagram постів або рілсів через офіційний embed.js.
 * Автоматично підвантажує скрипт, якщо він ще не доданий, і обробляє контент після зміни URL.
 */
export const InstagramEmbed = ({ url, className = "" }: InstagramEmbedProps) => {
  useEffect(() => {
    const ensureInstagramScript = () => {
      // Якщо Instagram API вже доступне — просто оновити обробку
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
        return;
      }

      // Якщо скрипт ще не завантажений — додаємо
      if (!document.getElementById("instagram-embed-script")) {
        const script = document.createElement("script");
        script.id = "instagram-embed-script";
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        script.onload = () => window.instgrm?.Embeds?.process();
        document.body.appendChild(script);
      }
    };

    ensureInstagramScript();
  }, [url]);

  return (
    <div className={`flex justify-center ${className}`}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          maxWidth: "540px",
          width: "100%",
          background: "transparent",
          border: 0,
        }}
      />
    </div>
  );
};

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
