import { TermHighlighter } from "./TermHighlighter";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className = "" }: MarkdownRendererProps) => {
  // Simple markdown parser for common elements
  const parseMarkdown = (text: string): JSX.Element[] => {
    const lines = text.split("\n");
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(" ");
        elements.push(
          <p key={elements.length} className="mb-4">
            <TermHighlighter text={paragraphText} />
          </p>
        );
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length} className="list-disc list-inside mb-4 space-y-2">
            {listItems.map((item, idx) => (
              <li key={idx}>
                <TermHighlighter text={item} />
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Headings
      if (trimmedLine.startsWith("# ")) {
        flushParagraph();
        flushList();
        elements.push(
          <h1 key={elements.length} className="text-3xl font-bold mb-4 mt-6">
            <TermHighlighter text={trimmedLine.slice(2)} />
          </h1>
        );
      } else if (trimmedLine.startsWith("## ")) {
        flushParagraph();
        flushList();
        elements.push(
          <h2 key={elements.length} className="text-2xl font-bold mb-3 mt-5">
            <TermHighlighter text={trimmedLine.slice(3)} />
          </h2>
        );
      } else if (trimmedLine.startsWith("### ")) {
        flushParagraph();
        flushList();
        elements.push(
          <h3 key={elements.length} className="text-xl font-bold mb-3 mt-4">
            <TermHighlighter text={trimmedLine.slice(4)} />
          </h3>
        );
      }
      // List items
      else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
        flushParagraph();
        inList = true;
        listItems.push(trimmedLine.slice(2));
      }
      // Empty line
      else if (trimmedLine === "") {
        flushParagraph();
        if (inList) {
          flushList();
        }
      }
      // Regular text
      else {
        if (inList) {
          flushList();
        }
        currentParagraph.push(trimmedLine);
      }
    });

    // Flush remaining content
    flushParagraph();
    flushList();

    return elements;
  };

  const elements = parseMarkdown(content);

  return <div className={`prose prose-slate max-w-none ${className}`}>{elements}</div>;
};
