import { DOMUtils } from '../../utils/DOMUtils';
import { MessageRenderer } from '../components/MessageRenderer';

export class ChatEvents {
  constructor(
    private container: HTMLElement,
    private onSendMessage: (message: string) => void,
    private onClearChat: () => void
  ) {}

  initialize(): void {
    this.setupSendEvent();
    this.setupClearEvent();
    this.setupHistoryEvent();
    MessageRenderer.setupCopyDelegation(this.container);
  }

  private setupSendEvent(): void {
    const sendBtn = this.container.querySelector('#send-message') as HTMLElement;
    const input = this.container.querySelector('#chat-input') as HTMLTextAreaElement;

    const send = () => {
      if (!input || !input.value.trim()) return;
      const message = input.value.trim();
      this.onSendMessage(message);
      input.value = '';
      DOMUtils.autoResizeTextarea(input);
    };

    sendBtn?.addEventListener('click', send);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    });

    input?.addEventListener('input', () => {
      if (input) DOMUtils.autoResizeTextarea(input);
    });
  }

  private setupClearEvent(): void {
    const clearBtn = this.container.querySelector('#clear-chat') as HTMLElement;
    clearBtn?.addEventListener('click', this.onClearChat);
  }

  private setupHistoryEvent(): void {
    const historyBtn = this.container.querySelector('#history-chat') as HTMLElement;
    historyBtn?.addEventListener('click', () => {
      // TODO: Implementar histórico
      console.log('Histórico clicado');
    });
  }

  private setupCopyDelegation(): void {
    const messagesContainer = this.container.querySelector('#chat-messages') as HTMLElement;
    if (!messagesContainer) return;

    messagesContainer.addEventListener('click', async (e) => {
      const el = e.target as HTMLElement;
      const btn = el.closest ? el.closest('.copy-btn') as HTMLElement : null;
      if (!btn) return;
      e.preventDefault();

      const codeId = btn.dataset.codeId;
      if (!codeId) return;

      const codeElement = messagesContainer.querySelector(`#${codeId}`) as HTMLElement;
      const codeText = codeElement?.textContent ?? '';

      const original = btn.innerHTML;
      btn.innerHTML = '⏳';

      // TODO: Implementar cópia para clipboard
      console.log('Copiar código:', codeText);

      setTimeout(() => {
        btn.innerHTML = original;
      }, 1500);
    });
  }
}