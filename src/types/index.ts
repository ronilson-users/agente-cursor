export interface PluginSettings {
  apiKey: string;
  provider: string;
  model: string;
  temperature: number;
  userName: string;
  rules: any;
}

export interface AIConfig {
  apiKey: string;
  provider: string;
  model: string;
  temperature: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}