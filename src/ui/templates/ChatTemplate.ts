import { DOMUtils } from '../../utils/DOMUtils';

export class ChatTemplate {
  static render(userName: string): string {
    return `
      <div class="chat-container">
        <div class="chat-top-bar">
          <button id="clear-chat" class="top-btn danger icon delete"></button>
          <button id="history-chat" class="top-btn icon tune"> </button>
        </div>

        <div class="chat-input-wrapper inverted">
          <textarea id="chat-input" placeholder="Digite sua mensagem..." rows="1"></textarea>
          <div class="chat-input-top">
            <span id="model-indicator">Modelo: </span>
            <button id="send-message" class="send-btn icon send" title="Enviar"></button>
          </div>
        </div>

        <div id="chat-messages" class="chat-messages scroll">
          <div class="message system">
            <p>${this.userProfile(userName)}Como posso ajudar você hoje?</p>
          </div>
        </div>
      </div>
    `;
  }

  private static userProfile(userName: string): string {
    return userName ? `Olá, ${DOMUtils.escapeHtml(userName)}! ` : 'Olá! ';
  }

  static getTypingIndicator(): string {
    return `
      <div class="message assistant typing-indicator" id="typing-indicator">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
  }
}