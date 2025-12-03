export class DOMUtils {
  static escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static autoResizeTextarea(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 320) + 'px';
  }

  static createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K, 
    attributes: Record<string, string> = {},
    children: (HTMLElement | string)[] = []
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    
    return element;
  }

  static loadStylesheet(href: string): HTMLLinkElement {
    const link = this.createElement('link', {
      rel: 'stylesheet',
      href: href
    });
    document.head.appendChild(link);
    return link;
  }
}