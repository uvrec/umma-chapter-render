/**
 * LocalLLMChat - Chat component for local RAG-based LLM
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ChatInput } from "./ChatInput";
import {
  MessageSquare,
  Trash2,
  Server,
  ServerOff,
  BookOpen,
  Loader2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
} from "lucide-react";
import {
  localLLMService,
  LocalLLMSource,
  LocalLLMHealthStatus,
  LocalLLMMessage as LLMMessage,
} from "@/services/localLLMService";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: LocalLLMSource[];
  isLoading?: boolean;
  isStreaming?: boolean;
}

interface LocalLLMChatProps {
  className?: string;
}

const WELCOME_MESSAGE_UA = `Харе Крішна! Це локальна AI-система, яка працює на вашому комп'ютері.

Я відповідаю ВИКЛЮЧНО на основі книг Шріли Прабгупади та ґаудія-вайшнавських ачар'їв, які є у базі даних.

**Переваги локальної моделі:**
• Приватність — ваші запитання не надсилаються в інтернет
• Швидкість — працює на вашому GPU
• Автономність — працює без інтернету

Чим можу допомогти?`;

const WELCOME_MESSAGE_EN = `Hare Krishna! This is a local AI system running on your computer.

I answer EXCLUSIVELY based on the books of Srila Prabhupada and Gaudiya Vaishnava acharyas in the database.

**Advantages of local model:**
• Privacy — your questions are not sent to the internet
• Speed — runs on your GPU
• Autonomy — works without internet

How can I help you?`;

function SourceCard({ source }: { source: LocalLLMSource }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-between text-left h-auto py-2 px-3 hover:bg-muted/50"
        >
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="h-3.5 w-3.5 flex-shrink-0 text-saffron-600" />
            <span className="font-medium truncate">{source.reference}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {Math.round(source.relevance_score * 100)}%
            </Badge>
            {isOpen ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-3 pb-3 pt-1">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {source.content_snippet}
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function MessageBubble({ message }: { message: LocalMessage }) {
  const { t } = useLanguage();
  const isUser = message.role === 'user';

  if (message.isLoading) {
    return (
      <div className="flex gap-3 py-4">
        <div className="h-8 w-8 rounded-full bg-saffron-100 dark:bg-saffron-900 flex items-center justify-center flex-shrink-0">
          <Cpu className="h-4 w-4 text-saffron-600 dark:text-saffron-400" />
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">{t('Обробляю запит...', 'Processing...')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("py-4", isUser && "bg-muted/30")}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div
          className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-saffron-100 dark:bg-saffron-900"
          )}
        >
          {isUser ? (
            <span className="text-sm font-medium">У</span>
          ) : (
            <Cpu className="h-4 w-4 text-saffron-600 dark:text-saffron-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-saffron-500 animate-pulse ml-1" />
            )}
          </div>

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 border rounded-lg overflow-hidden bg-card">
              <div className="px-3 py-2 bg-muted/50 border-b">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {t('Джерела', 'Sources')} ({message.sources.length})
                </h4>
              </div>
              <div className="divide-y">
                {message.sources.map((source, idx) => (
                  <SourceCard key={idx} source={source} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LocalLLMChat({ className }: LocalLLMChatProps) {
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<LocalLLMHealthStatus | null>(null);
  const [isCheckingServer, setIsCheckingServer] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Check server health on mount and periodically
  useEffect(() => {
    const checkServer = async () => {
      setIsCheckingServer(true);
      const status = await localLLMService.checkHealth();
      setServerStatus(status);
      setIsCheckingServer(false);
    };

    checkServer();
    const interval = setInterval(checkServer, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: language === 'ua' ? WELCOME_MESSAGE_UA : WELCOME_MESSAGE_EN,
        },
      ]);
    }
  }, [language, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (serverStatus?.status !== 'healthy') {
        return;
      }

      // Add user message
      const userMessage: LocalMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
      };

      // Add loading message
      const loadingId = `loading-${Date.now()}`;
      const loadingMessage: LocalMessage = {
        id: loadingId,
        role: 'assistant',
        content: '',
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setIsLoading(true);

      try {
        // Build history for context
        const history: LLMMessage[] = messages
          .filter((m) => m.role === 'user' || (m.role === 'assistant' && !m.isLoading))
          .slice(-10) // Last 10 messages for context
          .map((m) => ({ role: m.role, content: m.content }));

        // Add current message to history
        history.push({ role: 'user', content });

        // Use streaming for better UX
        let streamedContent = '';
        const streamingId = `streaming-${Date.now()}`;

        // Replace loading with streaming message
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingId
              ? { ...msg, id: streamingId, content: '', isLoading: false, isStreaming: true }
              : msg
          )
        );

        for await (const chunk of localLLMService.chatStream(content, history.slice(0, -1))) {
          streamedContent += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingId ? { ...msg, content: streamedContent } : msg
            )
          );
        }

        // Get sources with a separate call (streaming doesn't include sources)
        try {
          const fullResponse = await localLLMService.chat(content, history.slice(0, -1));
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingId
                ? { ...msg, content: streamedContent, sources: fullResponse.sources, isStreaming: false }
                : msg
            )
          );
        } catch {
          // If source fetch fails, just keep the streamed content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamingId ? { ...msg, isStreaming: false } : msg
            )
          );
        }
      } catch (error) {
        console.error('Local LLM error:', error);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.isLoading || msg.isStreaming
              ? {
                  ...msg,
                  id: `error-${Date.now()}`,
                  content:
                    language === 'ua'
                      ? 'Вибачте, сталася помилка. Перевірте, чи працює локальний сервер.'
                      : 'Sorry, an error occurred. Please check if the local server is running.',
                  isLoading: false,
                  isStreaming: false,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [language, messages, serverStatus]
  );

  const clearChat = useCallback(() => {
    localLLMService.cancelStream();
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: language === 'ua' ? WELCOME_MESSAGE_UA : WELCOME_MESSAGE_EN,
      },
    ]);
  }, [language]);

  const isServerOnline = serverStatus?.status === 'healthy';

  return (
    <Card
      className={cn(
        "flex flex-col h-[calc(100vh-200px)] min-h-[400px] max-h-[800px] sm:h-[600px] md:h-[700px]",
        className
      )}
    >
      {/* Header */}
      <CardHeader className="flex-shrink-0 border-b py-3 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-saffron-100 dark:bg-saffron-900 flex items-center justify-center">
              <Cpu className="h-4 w-4 text-saffron-600 dark:text-saffron-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                {t('Локальна AI', 'Local AI')}
              </CardTitle>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {isCheckingServer ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : isServerOnline ? (
                  <>
                    <Server className="h-3 w-3 text-green-500" />
                    <span>{serverStatus?.model}</span>
                  </>
                ) : (
                  <>
                    <ServerOff className="h-3 w-3 text-red-500" />
                    <span>{t('Сервер недоступний', 'Server offline')}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            className="text-muted-foreground hover:text-destructive"
            title={t('Очистити чат', 'Clear chat')}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t('Очистити', 'Clear')}
          </Button>
        </div>
      </CardHeader>

      {/* Server Status Alert */}
      {!isCheckingServer && !isServerOnline && (
        <Alert variant="destructive" className="mx-4 mt-4">
          <ServerOff className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {t(
              'Локальний сервер не запущено. Запустіть сервер командою: python server.py',
              'Local server is not running. Start the server with: python server.py'
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="px-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  {t('Почніть розмову', 'Start a conversation')}
                </h3>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t p-4">
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
          disabled={!isServerOnline}
          placeholder={
            isServerOnline
              ? t('Задайте питання...', 'Ask a question...')
              : t('Сервер недоступний', 'Server offline')
          }
        />
      </div>
    </Card>
  );
}
