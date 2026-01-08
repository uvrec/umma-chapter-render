/**
 * VedaVOICE Chat Types
 */

export interface Citation {
  verseId: string;
  quote: string;
  reference: string;
  referenceType: 'book' | 'lecture' | 'letter';
  bookSlug?: string;
  cantoNumber?: number;
  chapterNumber?: number;
  verseNumber?: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: Citation[];
  responseLevel?: 'direct' | 'synthesis' | 'insufficient';
  relatedTopics?: string[];
  createdAt: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  title?: string;
  language: 'ua' | 'en';
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatApiResponse {
  message: string;
  sessionId: string;
  citations: Citation[];
  responseLevel: 'direct' | 'synthesis' | 'insufficient';
  relatedTopics?: string[];
}

export interface ChatApiRequest {
  message: string;
  sessionId?: string;
  language?: 'ua' | 'en';
}
