import { memo } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponseLevelBadge } from "./ResponseLevelBadge";
import { CitationsList } from "./CitationCard";
import { User, Sparkles } from "lucide-react";
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
    <div
      className={cn(
        "flex gap-3 py-4",
        isUser && "flex-row-reverse",
        className
      )}
    >
      {/* Avatar */}
      <Avatar className={cn(
        "h-8 w-8 shrink-0",
        isUser ? "bg-brand-100 dark:bg-brand-900" : "bg-saffron-100 dark:bg-saffron-900"
      )}>
        <AvatarFallback className={cn(
          isUser ? "bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300"
                 : "bg-saffron-100 text-saffron-700 dark:bg-saffron-900 dark:text-saffron-300"
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex-1 space-y-2 overflow-hidden",
        isUser && "text-right"
      )}>
        {/* Response level badge for assistant messages */}
        {isAssistant && message.responseLevel && !message.isLoading && (
          <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
            <ResponseLevelBadge level={message.responseLevel} />
          </div>
        )}

        {/* Loading state */}
        {message.isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <>
            {/* Message text */}
            <div
              className={cn(
                "rounded-lg px-4 py-3 inline-block max-w-[85%]",
                isUser
                  ? "bg-brand-500 text-white dark:bg-brand-600 ml-auto"
                  : "bg-muted text-foreground",
                !isUser && "text-left"
              )}
            >
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {/* Parse and render message content with proper formatting */}
                {message.content.split('\n').map((paragraph, idx) => (
                  paragraph.trim() ? (
                    <p key={idx} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ) : null
                ))}
              </div>
            </div>

            {/* Citations for assistant messages */}
            {isAssistant && message.citations && message.citations.length > 0 && (
              <CitationsList
                citations={message.citations}
                className="mt-3 max-w-[85%]"
              />
            )}

            {/* Related topics for insufficient responses */}
            {isAssistant && message.responseLevel === 'insufficient' && message.relatedTopics && message.relatedTopics.length > 0 && (
              <div className="mt-3 max-w-[85%]">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  {language === 'ua' ? 'Пов\'язані теми' : 'Related Topics'}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {message.relatedTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Timestamp */}
        {!message.isLoading && (
          <p className={cn(
            "text-xs text-muted-foreground",
            isUser ? "text-right" : "text-left"
          )}>
            {new Date(message.createdAt).toLocaleTimeString(language === 'ua' ? 'uk-UA' : 'en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export const ChatMessage = memo(ChatMessageComponent);
