import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import createDOMPurify from 'dompurify';
import { v4 as uuidv4 } from 'uuid';

/**
 * CodeFormatter otimizado para browser
 * - Usa DOMPurify diretamente com window (disponível no browser)
 * - Remove dependências do Node.js (jsdom, punycode)
 */

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// DOMPurify funciona diretamente no browser
const DOMPurify = isBrowser ? createDOMPurify(window) : {
  sanitize: (html: string) => {
    // Fallback básico para environments não-browser (se necessário)
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/on\w+='[^']*'/g, '')
      .replace(/javascript:/gi, '');
  }
};

export class CodeFormatter {
  private static md = new MarkdownIt({
    html: false,
    linkify: true,
    typographer: false,
    highlight: (str: string, lang: string) => {
      try {
        if (lang && hljs.getLanguage(lang)) {
          return `<pre><code class="hljs language-${lang}">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
        }
        const auto = hljs.highlightAuto(str);
        const language = auto.language || 'text';
        return `<pre><code class="hljs language-${language}">${auto.value}</code></pre>`;
      } catch (e) {
        return `<pre><code>${CodeFormatter.escapeHtmlForCode(str)}</code></pre>`;
      }
    }
  });

  public static formatContent(content: string): string {
    if (!content) return '';
    const rawHtml = this.md.render(content);
    return DOMPurify.sanitize(rawHtml);
  }

  public static formatCorruptedContent(content: string): string {
    const cleaned = this.cleanCorruptedContent(content);
    if (this.isLikelyCode(cleaned)) {
      const highlighted = this.renderAsCodeBlock(cleaned, undefined);
      return DOMPurify.sanitize(highlighted);
    }
    return DOMPurify.sanitize(this.escapeHtmlForText(cleaned));
  }

  private static renderAsCodeBlock(code: string, language?: string): string {
    const lang = (language || this.detectLanguage(code) || 'text').toLowerCase();
    const id = `code-${uuidv4()}`;
    let highlighted = '';
    try {
      if (lang && hljs.getLanguage(lang)) {
        highlighted = hljs.highlight(code, { language: lang }).value;
      } else {
        const auto = hljs.highlightAuto(code);
        highlighted = auto.value;
      }
    } catch (e) {
      highlighted = this.escapeHtmlForCode(code);
    }
    return `
<div class="code-block">
  <div class="code-header">
    <span class="code-language">${this.escapeHtmlForText(lang)}</span>
    <button class="copy-btn" data-code-id="${this.escapeHtmlForText(id)}" title="Copiar código">📋</button>
  </div>
  <pre><code id="${this.escapeHtmlForText(id)}" class="hljs language-${this.escapeHtmlForText(lang)}">${highlighted}</code></pre>
</div>`;
  }

  public static async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      
      // Fallback para browsers mais antigos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Erro ao copiar para clipboard:', err);
      return false;
    }
  }

  // ------------------------- Helpers -------------------------
  private static escapeHtmlForText(text: string): string {
    if (text == null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br>')
      .replace(/  /g, ' &nbsp;');
  }

  private static escapeHtmlForCode(text: string): string {
    if (text == null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private static cleanCorruptedContent(content: string): string {
    if (!content) return '';
    return content
      .replace(/<"h1js-attr">/g, '')
      .replace(/<"h1js-tg>/g, '')
      .replace(/<"h1j">/g, '')
      .replace(/"h1js-keyword">/g, '')
      .replace(/event\.preventDefault\)/g, 'event.preventDefault()')
      .replace(/targetElement\?\.scr\(/g, 'targetElement?.scrollIntoView()')
      .replace(/#{2,}/g, '##')
      .replace(/[ \t]+/g, ' ')
      .replace(/\r\n/g, '\n')
      .trim();
  }

  private static isLikelyCode(text: string): boolean {
    if (!text) return false;
    const lines = text.trim().split('\n');
    if (lines.length <= 1) return false;
    if (lines.length >= 5) return true;
    const patterns = [
      /\b(import|export|function|class|const|let|var)\b/m,
      /=>|{\s*$/m,
      /(^\s*#|^\s*\/\/|\/\*)/m,
      /\b(def|print\()|\breturn\b/m,
      /<\w+>|<\/\w+>/
    ];
    const hits = patterns.reduce((acc, p) => acc + (p.test(text) ? 1 : 0), 0);
    return hits >= 2;
  }

  private static detectLanguage(code: string): string {
    const patterns: Record<string, RegExp> = {
      html: /<\s*\/?\s*[a-zA-Z]+[^>]*>/,
      css: /([.#][a-zA-Z0-9_-]+|@media|:root|display\s*:)/i,
      javascript: /\b(const|let|var|function|=>|console\.|document\.|window\.)\b/,
      typescript: /\b(interface|type|:\s*[A-Za-z0-9_<>, ]+|import .* from )\b/,
      python: /\b(def|class|import|from|print\()\b/,
      java: /\b(public|private|class|void|System\.out\.|import java\.)\b/,
      php: /<\?php|\$\w+/
    };
    for (const [lang, pat] of Object.entries(patterns)) {
      if (pat.test(code)) return lang;
    }
    return 'text';
  }
}