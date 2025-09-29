import { useEffect } from "react";

interface TelegramEmbedProps {
  url: string;
  className?: string;
}

export const TelegramEmbed = ({ url, className = "" }: TelegramEmbedProps) => {
  useEffect(() => {
    // Load Telegram widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // Extract post path from URL (e.g., channel/123)
  const match = url.match(/t\.me\/([^/]+)\/(\d+)/);
  if (!match) {
    return (
      <div className="p-4 border border-destructive rounded-md">
        <p className="text-destructive text-sm">Invalid Telegram URL</p>
      </div>
    );
  }

  const [, channel, postId] = match;

  return (
    <div className={`flex justify-center ${className}`}>
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-post={`${channel}/${postId}`}
        data-width="100%"
      />
    </div>
  );
};
