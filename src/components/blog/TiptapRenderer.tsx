import { TermHighlighter } from "@/components/TermHighlighter";

interface TiptapRendererProps {
  content: string;
  className?: string;
}

export const TiptapRenderer = ({ content, className = "" }: TiptapRendererProps) => {
  if (!content || content.trim().length === 0) {
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
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
