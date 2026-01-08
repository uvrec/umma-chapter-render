/**
 * Local LLM Service - Connects to the local RAG server
 */

export interface LocalLLMSource {
  reference: string;
  book_title: string;
  chapter_title: string;
  verse_number: string;
  content_snippet: string;
  relevance_score: number;
}

export interface LocalLLMResponse {
  answer: string;
  sources: LocalLLMSource[];
  model: string;
}

export interface LocalLLMHealthStatus {
  status: 'healthy' | 'initializing' | 'error';
  model: string;
  embedding_model: string;
  indexed: boolean;
}

export interface LocalLLMMessage {
  role: 'user' | 'assistant';
  content: string;
}

class LocalLLMService {
  private baseUrl: string;
  private abortController: AbortController | null = null;

  constructor() {
    // Default to localhost:8000, can be configured via environment
    this.baseUrl = import.meta.env.VITE_LOCAL_LLM_URL || 'http://localhost:8000';
  }

  /**
   * Check if the local LLM server is running and healthy
   */
  async checkHealth(): Promise<LocalLLMHealthStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Server not responding');
      }

      return await response.json();
    } catch (error) {
      return {
        status: 'error',
        model: 'unknown',
        embedding_model: 'unknown',
        indexed: false,
      };
    }
  }

  /**
   * Send a chat message and get a response
   */
  async chat(
    message: string,
    history: LocalLLMMessage[] = []
  ): Promise<LocalLLMResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Chat failed: ${error}`);
    }

    return await response.json();
  }

  /**
   * Send a chat message and stream the response
   */
  async *chatStream(
    message: string,
    history: LocalLLMMessage[] = []
  ): AsyncGenerator<string, void, unknown> {
    // Cancel any previous stream
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    const response = await fetch(`${this.baseUrl}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        history,
        stream: true,
      }),
      signal: this.abortController.signal,
    });

    if (!response.ok) {
      throw new Error('Stream failed');
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return;
            }
            if (data.startsWith('[ERROR]')) {
              throw new Error(data.slice(8));
            }
            yield data;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Cancel the current streaming request
   */
  cancelStream(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Semantic search in the books
   */
  async search(query: string, topK: number = 5): Promise<LocalLLMSource[]> {
    const response = await fetch(`${this.baseUrl}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        top_k: topK,
      }),
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    return data.results;
  }

  /**
   * Get available models
   */
  async getModels(): Promise<{
    llm: string;
    embedding: string;
    available_llms: Array<{ name: string; description: string; size: string }>;
  }> {
    const response = await fetch(`${this.baseUrl}/models`);
    if (!response.ok) {
      throw new Error('Failed to get models');
    }
    return await response.json();
  }

  /**
   * Update the server URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Get the current server URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export singleton instance
export const localLLMService = new LocalLLMService();
