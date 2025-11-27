/**
 * Serviço unificado de IA para o plugin do Acode
 * Suporta múltiplos provedores (OpenAI, Gemini, DeepSeek)
 */

export type AIProvider = "openai" | "gemini" | "deepseek" | "claude";

export interface AIServiceConfig {
  apiKey: string;
  provider: AIProvider;
  model: string;
  temperature?: number;
}

export class AIService {
  private config: AIServiceConfig;
  private apiUrl: string;

  constructor(config: AIServiceConfig) {
    this.config = config;
    this.apiUrl = this.getApiUrl();
  }

  /** Define a URL da API conforme o provedor */
  private getApiUrl(): string {
    const { provider, model } = this.config;
    
    switch (provider) {
      case "gemini":
        return `
        
       
        https://generativelanguage.googleapis.com/v1beta/models/${model}/key=${apiKey}
        
        
        
        
        `;
      case "deepseek":
        return "https://api.deepseek.com/v1/chat/completions";
      case "claude":
        return "https://api.anthropic.com/v1/messages";
      default: // openai
        return "https://api.openai.com/v1/chat/completions";
    }
  }

  /**
   * Envia uma mensagem e retorna a resposta completa
   */
  async sendMessage(prompt: string): Promise<string> {
    const { apiKey, provider } = this.config;
    
    if (!apiKey?.trim()) {
      throw new Error("Chave de API não configurada.");
    }
    
    if (!prompt?.trim()) {
      throw new Error("Mensagem vazia.");
    }

    console.log(`Enviando mensagem para ${provider}...`);

    try {
      switch (provider) {
        case "gemini":
          return await this.sendGemini(prompt);
        case "claude":
          return await this.sendClaude(prompt);
        case "deepseek":
        case "openai":
        default:
          return await this.sendOpenAI(prompt);
      }
    } catch (error) {
      console.error(`Erro no AIService (${provider}):`, error);
      throw error;
    }
  }

  /**
   * Implementação para OpenAI e DeepSeek (ChatCompletion)
   */
  private async sendOpenAI(prompt: string): Promise<string> {
    const { apiKey, model, temperature = 0.7 } = this.config;
    
    const body = {
      model: model,
      messages: [
        { 
          role: "system", 
          content: "Você é um assistente de programação útil e conciso. Responda em português." 
        },
        { role: "user", content: prompt }
      ],
      temperature: temperature,
      max_tokens: 4000
    };

    console.log(`Enviando para OpenAI/DeepSeek - Modelo: ${model}`);

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ${response.status}:`, errorText);
      throw new Error(`Erro ${response.status}: ${this.extractErrorMessage(errorText)}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sem resposta da API.";
  }

  /**
   * Implementação para Google Gemini
   */
  private async sendGemini(prompt: string): Promise<string> {
    const { apiKey, model, temperature = 0.7 } = this.config;
    
    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 4000
      }
    };

    const url = `${this.apiUrl}?key=${apiKey}`;
    
    console.log(`Enviando para Gemini - Modelo: ${model}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ${response.status}:`, errorText);
      throw new Error(`Erro ${response.status}: ${this.extractErrorMessage(errorText)}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      console.error("Resposta vazia do Gemini:", data);
      throw new Error("Resposta vazia do Gemini");
    }
    
    return text;
  }

  /**
   * Implementação para Claude (Anthropic)
   */
  private async sendClaude(prompt: string): Promise<string> {
    const { apiKey, model, temperature = 0.7 } = this.config;
    
    const body = {
      model: model,
      max_tokens: 4000,
      temperature: temperature,
      messages: [
        { 
          role: "user", 
          content: prompt 
        }
      ]
    };

    console.log(`Enviando para Claude - Modelo: ${model}`);

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erro ${response.status}:`, errorText);
      throw new Error(`Erro ${response.status}: ${this.extractErrorMessage(errorText)}`);
    }

    const data = await response.json();
    return data.content?.[0]?.text?.trim() || "Sem resposta do Claude.";
  }

  /**
   * Extrai mensagem de erro da resposta da API
   */
  private extractErrorMessage(errorText: string): string {
    try {
      const errorData = JSON.parse(errorText);
      return errorData.error?.message || errorData.error || errorText;
    } catch {
      return errorText;
    }
  }

  /**
   * Testa a conexão com a API
   */
  async testConnection(): Promise<boolean> {
    try {
      const testPrompt = "Responda apenas com 'OK' se estiver funcionando.";
      const response = await this.sendMessage(testPrompt);
      return response.includes("OK");
    } catch (error) {
      console.error("Teste de conexão falhou:", error);
      return false;
    }
  }
}