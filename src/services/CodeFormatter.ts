export class CodeFormatter {
  // copia pro clipboard com navigator.clipboard e fallback baseado em textarea
  static async copyToClipboard(text: string): Promise<boolean> {
    if (!text) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) {
      // segue para fallback
    }

    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      // evitar scroll jump
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return !!ok;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    }
  }

  // carrega highlight.js e css a partir de baseUrl/assets/
  static async loadHighlight(baseUrl: string) {
    const loadScript = (src: string) => new Promise<void>((res, rej) => {
      if (document.querySelector(`script[src="${src}"]`)) return res();
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => res();
      s.onerror = () => rej(new Error('Failed to load script ' + src));
      document.head.appendChild(s);
    });
    const loadStyle = (href: string) => {
      if (document.querySelector(`link[href="${href}"]`)) return;
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      document.head.appendChild(l);
    };

    try {
      if (!baseUrl) baseUrl = '';
      // tenta carregar o CSS light, se preferir dark altere o nome
      loadStyle(`${baseUrl}assets/highlight-light.min.css`);
      await loadScript(`${baseUrl}assets/highlight.min.js`);
      const hljs = (window as any).hljs;
      if (hljs && typeof hljs.highlightAll === 'function') {
        // configure se necessário
        hljs.configure && hljs.configure({ ignoreUnescapedHTML: true });
        hljs.highlightAll();
      }
      return true;
    } catch (err) {
      console.warn('Não foi possível carregar highlight.js:', err);
      return false;
    }
  }
}

export default CodeFormatter;