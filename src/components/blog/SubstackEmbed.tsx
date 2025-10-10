interface SubstackEmbedProps {
  /** Повне посилання на Substack embed, наприклад:
   *  https://newslettername.substack.com/embed
   */
  url: string;

  /** Додаткові класи Tailwind */
  className?: string;

  /** Висота iframe (за замовчуванням 320px) */
  height?: number;
}

/**
 * SubstackEmbed — для вбудовування Substack-розсилок або форм підписки.
 * Підтримує адаптивну ширину, безпечний sandbox і lazy loading.
 */
export const SubstackEmbed = ({ url, className = "", height = 320 }: SubstackEmbedProps) => {
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <iframe
        src={url}
        width="100%"
        height={height}
        style={{
          border: "1px solid #eee",
          background: "white",
          borderRadius: "0.5rem",
        }}
        frameBorder="0"
        scrolling="no"
        loading="lazy"
        allowTransparency={true}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};
