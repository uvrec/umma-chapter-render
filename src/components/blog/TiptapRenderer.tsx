import { useMemo } from "react";
import DOMPurify from "dompurify";
import { useSanskritTerms } from "@/hooks/useSanskritTerms";
import { useLanguage } from "@/contexts/LanguageContext";
import { highlightSanskritTerms } from "@/utils/highlightSanskritTerms";

interface TiptapRendererProps {
  content: string;
  className?: string;
}

export const TiptapRenderer = ({ content, className = "" }: TiptapRendererProps) => {
  const { getTermsMap } = useSanskritTerms();
  const { language } = useLanguage();

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
          "data-sanskrit-term",
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

      // highlight Sanskrit terms
      const termsMap = getTermsMap();
      return highlightSanskritTerms(fixedLinks, termsMap, language);
    } catch (err) {
      console.error("Renderer sanitize error:", err);
      return `<p class='text-destructive'>Помилка відображення контенту</p>`;
    }
  }, [content, getTermsMap, language]);

  if (!sanitizedContent) {
    return <div className="text-muted-foreground italic">Контент відсутній</div>;
  }

  return (
    <div
      className={`prose prose-lg max-w-none transition-all duration-300 dark:prose-invert
        prose-headings:text-foreground prose-headings:font-bold
        prose-p:text-foreground prose-p:leading-relaxed
        prose-a:text-primary hover:prose-a:text-primary/80
        prose-strong:text-foreground prose-strong:font-semibold
        prose-em:font-sanskrit-italic prose-em:italic
        prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground
        prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary
        prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:rounded
        prose-table:border prose-th:border prose-td:border prose-img:rounded-lg
        ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
