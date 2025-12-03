import { DOMUtils } from '../../utils/DOMUtils';
import { CodeFormatter } from '../../services/CodeFormatter';

export class MessageRenderer {
  static addMessage(
    container: HTMLElement, 
    role: 'user' | 'assistant' | 'system', 
    content: string
  ): void {
    const messagesContainer = container.querySelector('#chat-messages') as HTMLElement;
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    if (role === 'user') {
      const p = document.createElement('p');
      p.textContent = content;
      messageDiv.appendChild(p);
    } else {
      const formattedContent = this.safeFormatContent(content);
      messageDiv.innerHTML = formattedContent;
    }

    messagesContainer.appendChild(messageDiv);
    this.applySyntaxHighlighting(messageDiv);

    requestAnimationFrame(() => {
      messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    });
  }

  static showTypingIndicator(container: HTMLElement): void {
    const messagesContainer = container.querySelector('#chat-messages') as HTMLElement;
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
  }

  static hideTypingIndicator(container: HTMLElement): void {
    const typingIndicator = container.querySelector('#typing-indicator') as HTMLElement;
    if (typingIndicator) typingIndicator.remove();
  }

  private static safeFormatContent(content: string): string {
    const codeBlocks: Record<string, { lang: string, code: string }> = {};
    let tokenIndex = 0;
    const makeToken = (lang: string, code: string) => {
      const id = `CODE_TOKEN_${tokenIndex++}`;
      codeBlocks[id] = { lang: lang || 'text', code };
      return id;
    };

    const withoutBlocks = content.replace(/```(\w+)?\s*([\s\S]*?)```/g, (_match, lang, code) => {
      return makeToken(lang || 'text', code);
    });

    const escaped = DOMUtils.escapeHtml(withoutBlocks);
    const parts = escaped.split(/(CODE_TOKEN_\d+)/);

    const reconstructed = parts.map(part => {
      const tokenMatch = part.match(/^(CODE_TOKEN_\d+)$/);
      if (tokenMatch) {
        const info = codeBlocks[part];
        if (!info) return '';
        const codeEscaped = DOMUtils.escapeHtml(info.code.replace(/\r\n/g, '\n'));
        const langClass = DOMUtils.escapeHtml(info.lang || 'text');
        const codeId = 'code-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
        
        return `
          <div class="code-block">
            <div class="code-header">
              <span class="code-language">${DOMUtils.escapeHtml(info.lang)}</span>
              <button class="copy-btn" data-code-id="${codeId}">📋</button>
            </div>
            <pre><code id="${codeId}" class="hljs language-${langClass}">${codeEscaped}</code></pre>
          </div>
        `;
      } else {
        return part.replace(/\n/g, '<br>');
      }
    }).join('');

    const withInline = reconstructed.replace(/`([^`]+)`/g, (_m, p1) => 
      `<code class="inline-code">${DOMUtils.escapeHtml(p1)}</code>`
    );

    return withInline;
  }

  private static applySyntaxHighlighting(container: HTMLElement): void {
    try {
      const hljs = (window as any).hljs;
      if (!hljs) return;
      const codeEls = Array.from(container.querySelectorAll('pre code')) as HTMLElement[];
      codeEls.forEach((el: any) => {
        if (hljs.highlightElement) {
          hljs.highlightElement(el);
        } else if (hljs.highlightBlock) {
          hljs.highlightBlock(el);
        }
      });
    } catch (err) {
      console.error('Erro ao aplicar highlight:', err);
    }
  }
  
  static setupCopyDelegation(container: HTMLElement): void {
    const messagesContainer = container.querySelector('#chat-messages') as HTMLElement;
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

      const ok = await CodeFormatter.copyToClipboard(codeText);

      const toast = acode.require('toast');
      if (ok) {
        btn.innerHTML = '✅';
        toast('Código copiado!');
      } else {
        btn.innerHTML = '❌';
        toast('Erro ao copiar');
      }

      setTimeout(() => {
        btn.innerHTML = original;
      }, 1500);
    });
  }
}