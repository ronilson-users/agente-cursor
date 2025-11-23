export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stream?: boolean;
  enableStreaming?: boolean;
  enableCache?: boolean;
  enableMetrics?: boolean;
  autoRetry?: boolean;
  fallbackModels?: string[];
  cacheTTL?: number;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  concurrency?: number;
}

export interface DeepSeekRequest {
  messages: DeepSeekMessage[];
  options?: DeepSeekOptions;
}

export interface CacheEntry {
  data: any;
  timestamp: number;
}

export interface Metrics {
  requests: number;
  errors: number;
  cacheHits: number;
  totalTokens: number;
}

export interface Middleware {
  preRequest: Array<(data: any) => Promise<void>>;
  postRequest: Array<(data: any) => Promise<void>>;
  onError: Array<(data: any) => Promise<void>>;
}

export interface ApiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
}