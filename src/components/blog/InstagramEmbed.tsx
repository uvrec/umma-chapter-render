import { useEffect } from "react";

interface InstagramEmbedProps {
  url: string;
  className?: string;
}

export const InstagramEmbed = ({ url, className = "" }: InstagramEmbedProps) => {
  useEffect(() => {
    // Load Instagram embed script
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [url]);

  return (
    <div className={`flex justify-center ${className}`}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ maxWidth: '540px', width: '100%' }}
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
