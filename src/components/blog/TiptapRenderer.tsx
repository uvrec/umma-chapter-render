import { TermHighlighter } from "@/components/TermHighlighter";

interface TiptapRendererProps {
  content: string;
  className?: string;
}

export const TiptapRenderer = ({ content, className = "" }: TiptapRendererProps) => {
  // Parse HTML and wrap text nodes with TermHighlighter
  const renderContent = (html: string) => {
    return (
      <div 
        className={`prose prose-lg max-w-none dark:prose-invert ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return renderContent(content);
};
