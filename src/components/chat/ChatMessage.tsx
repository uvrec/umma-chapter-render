import { memo } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponseLevelBadge } from "./ResponseLevelBadge";
import { CitationsList } from "./CitationCard";
import { Sparkles } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "./types";

interface ChatMessageProps {
  message: ChatMessageType;
  className?: string;
}

function ChatMessageComponent({ message, className }: ChatMessageProps) {
  const { language } = useLanguage();
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={cn("py-3", className)}>
      {/* User message - right aligned, simple bubble */}
      {isUser && (
        <div className="flex justify-end">
          <div className="bg-brand-500 text-white dark:bg-brand-600 rounded-2xl px-4 py-2 max-w-[80%]">
            <p className="text-sm">{message.content}</p>
            <p className="text-xs opacity-70 mt-1 text-right">
              {new Date(message.createdAt).toLocaleTimeString(language === 'uk' ? 'uk-UA' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      )}

      {/* Assistant message - left aligned, clean design */}
      {isAssistant && (
        <div className="space-y-2">
          {/* Response level badge */}
          {message.responseLevel && !message.isLoading && (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-saffron-500" />
              <ResponseLevelBadge level={message.responseLevel} />
            </div>
          )}

          {/* Loading state */}
          {message.isLoading ? (
            <div className="space-y-2 pl-6">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <div className="pl-6">
              {/* Message text - clean, no background */}
              <div className="text-sm text-foreground prose prose-sm dark:prose-invert max-w-none">
                {message.content.split('\n').map((paragraph, idx) => (
                  paragraph.trim() ? (
                    <p key={idx} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ) : null
                ))}
              </div>

              {/* Citations */}
              {message.citations && message.citations.length > 0 && (
                <CitationsList citations={message.citations} className="mt-3" />
              )}

              {/* Related topics for insufficient responses */}
              {message.responseLevel === 'insufficient' && message.relatedTopics && message.relatedTopics.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    {language === 'uk' ? 'Пов\'язані теми' : 'Related Topics'}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {message.relatedTopics.map((topic, index) => (
                      <span
                        key={index}
                        className="text-xs text-muted-foreground hover:text-foreground cursor-default"
                      >
                        {topic}{index < message.relatedTopics!.length - 1 ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(message.createdAt).toLocaleTimeString(language === 'uk' ? 'uk-UA' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const ChatMessage = memo(ChatMessageComponent);
