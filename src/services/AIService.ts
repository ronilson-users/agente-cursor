/**
 * Serviço unificado de IA para o plugin do Acode
 * Suporta múltiplos provedores (OpenAI, Gemini, DeepSeek)
 * Inclui suporte a streaming para respostas em tempo real
 */

export type AIProvider = "openai" | "gemini" | "deepseek";

export class AIService {
  private apiKey: string;
  private provider: AIProvider;
  private model: string;
  private apiUrl: string;

  constructor(apiKey: string, provider: AIProvider = "openai") {
    this.apiKey = apiKey;
    this.provider = provider;
    this.model = this.getDefaultModel();
    this.apiUrl = this.getApiUrl();
  }

  /** Define o modelo padrão de acordo com o provedor */
  private getDefaultModel(): string {
    switch (this.provider) {
      case "gemini":
        return "gemini-1.5-flash";
      case "deepseek":
        return "deepseek-chat";
      default:
        return "gpt-4o-mini";
    }
  }

  /** Define a URL da API conforme o provedor */
  private getApiUrl(): string {
    switch (this.provider) {
      case "gemini":
        return `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
      case "deepseek":
        return "https://api.deepseek.com/v1/chat/completions";
      default:
        return "https://api.openai.com/v1/chat/completions";
    }
  }

  /**
   * Envia uma mensagem e retorna a resposta completa
   */
  async sendMessage(prompt: string): Promise<string> {
    if (!this.apiKey) throw new Error("Chave de API não configurada.");
    if (!prompt) throw new Error("Mensagem vazia.");

    switch (this.provider) {
      case "gemini":
        return this.sendGemini(prompt);
      case "deepseek":
      case "openai":
      default:
        return this.sendOpenAI(prompt);
    }
  }

  /**
   * Implementação para OpenAI e DeepSeek (ChatCompletion)
   */
  private async sendOpenAI(prompt: string): Promise<string> {
    const body = {
      model: this.model,
      messages: [
        { role: "system", content: "Você é um assistente de programação útil e conciso." },
        { role: "user", content: prompt }
      ]
    };

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro ${response.status}: ${errText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sem resposta.";
  }

  /**
   * Implementação para Google Gemini (API diferente)
   */
  private async sendGemini(prompt: string): Promise<string> {
    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Erro ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "Sem resposta do Gemini.";
  }

  /**
   * Envia uma mensagem com streaming (OpenAI / DeepSeek)
   * Chama `onToken` a cada fragmento recebido.
   */
  async sendMessageStream(prompt: string, onToken: (token: string) => void): Promise<void> {
    if (this.provider === "gemini") {
      const text = await this.sendGemini(prompt);
      onToken(text);
      return;
    }

    const body = {
      model: this.model,
      messages: [
        { role: "system", content: "Você é um assistente de programação útil e conciso." },
        { role: "user", content: prompt }
      ],
      stream: true
    };

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok || !response.body) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(line => line.trim() !== "");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.replace(/^data: /, "");
          if (data === "[DONE]") return;

          try {
            const json = JSON.parse(data);
            const token = json.choices?.[0]?.delta?.content;
            if (token) onToken(token);
          } catch {
            // ignora linhas inválidas
          }
        }
      }
    }
  }
}