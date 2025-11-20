import { useMemo } from "react";
import DOMPurify from "dompurify";

interface TiptapRendererProps {
  content: string;
  className?: string;
  fontSize?: number;
  lineHeight?: number | string;
  displayBlocks?: {
    sanskrit?: boolean;
    transliteration?: boolean;
    synonyms?: boolean;
    translation?: boolean;
    commentary?: boolean;
  };
}

export const TiptapRenderer = ({ content, className = "", fontSize, lineHeight, displayBlocks }: TiptapRendererProps) => {
  const sanitizedContent = useMemo(() => {
    if (!content?.trim()) return null;

    try {
      // sanitize and preserve formatting
      const sanitized = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          "p",
          "br",
          "strong",
          "em",
          "u",
          "s",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "ul",
          "ol",
          "li",
          "blockquote",
          "code",
          "pre",
          "a",
          "img",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "div",
          "span",
        ],
        ALLOWED_ATTR: [
          "href",
          "target",
          "rel",
          "src",
          "alt",
          "title",
          "class",
          "style",
          "width",
          "height",
          "colspan",
          "rowspan",
        ],
        ADD_ATTR: ["loading"], // allow lazy-loading for images
        ALLOW_DATA_ATTR: true,
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        RETURN_DOM: false,
      });

      // fix <a> tags for safe external linking
      const fixedLinks = sanitized.replace(
        /<a(?![^>]*\brel=)[^>]*href="([^"]+)"[^>]*>/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">',
      );

      // ✅ ВИДАЛЕНО: індексування санскритських термінів для глосарію
      // Повертаємо санітизований HTML без автоматичного підсвічування термінів
      return fixedLinks;
    } catch (err) {
      console.error("Renderer sanitize error:", err);
      return `<p class='text-destructive'>Помилка відображення контенту</p>`;
    }
  }, [content]);

  if (!sanitizedContent) {
    return <div className="text-muted-foreground italic">Контент відсутній</div>;
  }

  // ✅ ДОДАНО: Стиль для приховування блоків згідно з налаштуваннями
  const hiddenBlocksStyle = useMemo(() => {
    const styles: Record<string, any> = {};

    // Додаємо fontSize та lineHeight якщо передано
    if (fontSize) styles.fontSize = `${fontSize}px`;
    if (lineHeight) styles.lineHeight = lineHeight;

    // Додаємо стилі для приховування блоків
    if (displayBlocks) {
      if (!displayBlocks.sanskrit) styles['--hide-sanskrit'] = 'none';
      if (!displayBlocks.transliteration) styles['--hide-transliteration'] = 'none';
      if (!displayBlocks.synonyms) styles['--hide-synonyms'] = 'none';
      if (!displayBlocks.translation) styles['--hide-translation'] = 'none';
      if (!displayBlocks.commentary) styles['--hide-commentary'] = 'none';
    }

    return styles;
  }, [fontSize, lineHeight, displayBlocks]);

  return (
    <div
      className={`prose prose-reader max-w-none transition-all duration-300 dark:prose-invert
        prose-headings:text-foreground prose-headings:font-bold
        prose-p:text-foreground prose-p:leading-relaxed
        prose-a:text-primary hover:prose-a:text-primary/80
        prose-strong:text-foreground prose-strong:font-semibold
        prose-em:font-sanskrit-italic prose-em:italic
        prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground
        prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary
        prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:rounded
        prose-table:border prose-th:border prose-td:border prose-img:rounded-lg
        [&_.sanskrit-block]:display-[var(--hide-sanskrit,block)]
        [&_.transliteration-block]:display-[var(--hide-transliteration,block)]
        [&_.synonyms-block]:display-[var(--hide-synonyms,block)]
        [&_.translation-block]:display-[var(--hide-translation,block)]
        [&_.commentary-block]:display-[var(--hide-commentary,block)]
        ${className}`}
      style={hiddenBlocksStyle as any}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
