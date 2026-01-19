import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { MessageSquare, Trash2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { ChatMessage as ChatMessageType, ChatApiResponse } from "./types";

interface ChatContainerProps {
  className?: string;
}

const WELCOME_MESSAGE_UK = `Харе Крішна! Я VedaVOICE — ваш помічник у вивченні вчень Шріли Прабгупади.

Я можу відповісти на ваші запитання, спираючись ВИКЛЮЧНО на праці Шріли Прабгупади:
• Книги (Бгаґавад-ґіта, Шрімад-Бгаґаватам, Чайтанья-чарітамріта)
• Листи (1947-1977)
• Лекції та бесіди

Кожна відповідь міститиме посилання на джерело. Я ніколи не спекулюю.

Чим можу допомогти?`;

const WELCOME_MESSAGE_EN = `Hare Krishna! I am VedaVOICE — your assistant for studying Srila Prabhupada's teachings.

I can answer your questions based EXCLUSIVELY on Srila Prabhupada's works:
• Books (Bhagavad-gita, Srimad-Bhagavatam, Chaitanya-charitamrita)
• Letters (1947-1977)
• Lectures and conversations

Every response will include source citations. I never speculate.

How can I help you?`;

export function ChatContainer({ className }: ChatContainerProps) {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: language === 'uk' ? WELCOME_MESSAGE_UK : WELCOME_MESSAGE_EN,
        createdAt: new Date(),
      }]);
    }
  }, [language, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date(),
    };

    // Add loading message
    const loadingMessage: ChatMessageType = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setIsLoading(true);

    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke<ChatApiResponse>('vedavoice-chat', {
        body: {
          message: content,
          sessionId: sessionId,
          language: language === 'uk' ? 'uk' : 'en',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to get response');
      }

      if (!data) {
        throw new Error('No response received');
      }

      // Update session ID if new
      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }

      // Replace loading message with actual response
      const assistantMessage: ChatMessageType = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        citations: data.citations,
        responseLevel: data.responseLevel,
        relatedTopics: data.relatedTopics,
        createdAt: new Date(),
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading ? assistantMessage : msg
        )
      );
    } catch (error) {
      console.error('Chat error:', error);

      // Replace loading message with error
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: language === 'uk'
          ? 'Вибачте, сталася помилка. Будь ласка, спробуйте ще раз.'
          : 'Sorry, an error occurred. Please try again.',
        createdAt: new Date(),
        responseLevel: 'insufficient',
      };

      setMessages((prev) =>
        prev.map((msg) =>
          msg.isLoading ? errorMessage : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [language, sessionId]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: language === 'uk' ? WELCOME_MESSAGE_UK : WELCOME_MESSAGE_EN,
      createdAt: new Date(),
    }]);
    setSessionId(null);
  }, [language]);

  return (
    <div className={cn("flex flex-col h-[calc(100vh-200px)] min-h-[400px] max-h-[700px] sm:h-[600px] md:h-[700px]", className)}>
      {/* Header - minimal */}
      <div className="flex-shrink-0 flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-saffron-500" />
          <h2 className="text-lg font-semibold">VedaVOICE</h2>
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

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="py-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">
                  {t('Почніть розмову', 'Start a conversation')}
                </h3>
                <p className="text-sm text-muted-foreground/70 mt-1 max-w-sm">
                  {t(
                    'Задайте запитання про вчення Шріли Прабгупади',
                    'Ask a question about Srila Prabhupada\'s teachings'
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 pt-4">
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
