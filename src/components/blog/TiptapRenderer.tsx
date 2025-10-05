import { useMemo } from "react";
import DOMPurify from "dompurify";

interface TiptapRendererProps {
  content: string;
  className?: string;
}

export const TiptapRenderer = ({ content, className = "" }: TiptapRendererProps) => {
  const sanitizedContent = useMemo(() => {
    if (!content || content.trim().length === 0) {
      return null;
    }
    
    // Sanitize HTML to prevent XSS attacks
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 
        'table', 'thead', 'tbody', 'tr', 'th', 'td', 'div', 'span'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style',
        'width', 'height', 'colspan', 'rowspan'
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    });
  }, [content]);

  if (!sanitizedContent) {
    return (
      <div className="text-muted-foreground italic">
        Контент відсутній
      </div>
    );
  }

  return (
    <div 
      className={`prose prose-lg max-w-none dark:prose-invert 
        prose-headings:text-foreground prose-headings:font-bold
        prose-p:text-foreground prose-p:leading-relaxed
        prose-a:text-primary hover:prose-a:text-primary/80
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:text-foreground prose-ol:text-foreground
        prose-li:text-foreground
        prose-blockquote:text-muted-foreground prose-blockquote:border-l-primary
        prose-code:text-foreground prose-code:bg-muted
        ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
