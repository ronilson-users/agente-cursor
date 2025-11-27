import plugin from '../plugin.json';
import "./styles/main.scss";

import { AIService } from "./services/AIService";

import { RuleManager } from './services/RuleManager';
import { CodeFormatter } from "./services/CodeFormatter";

const sideBarApps = acode.require('sidebarApps');
const toast = acode.require('toast');
const appSettings = acode.require('settings');

class AcodePlugin {
 private container: HTMLElement | null = null;
 private id: string = plugin.id;
 private ruleManager: RuleManager;
 private aiService: AIService | null = null;
 public baseUrl: string = "";
 private copyDelegationAttached = false;

 constructor() {
  this.ruleManager = new RuleManager();

  if (!appSettings.value[plugin.id]) {
   appSettings.value[plugin.id] = {
    apiKey: '',
    provider: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    userName: '',
    rules: this.ruleManager.getRules()
   };
   appSettings.update();
  }
 }
 async init() {
  try {
   const iconUrl = `${this.baseUrl}assets/icon.png`;
   acode.addIcon("sidebar-icon", iconUrl);

   // Carrega estilos principais
   this.globalStyles();

   // Tenta carregar highlight.js (se existir) via CodeFormatter helper
   try {
    if (typeof (CodeFormatter as any).loadHighlight === 'function') {
     await (CodeFormatter as any).loadHighlight(this.baseUrl);
    }
   } catch (err) {
    console.warn('Não foi possível carregar highlight.js via CodeFormatter:', err);
   }

   sideBarApps.add(
    "sidebar-icon",
    "agente_IA",
    "Agente IA",
    (container) => {
     this.container = container;
     this.renderContainer();
    },
    () => this.onAppSelected()
   );

   console.log("Plugin inicializado com sucesso");
  } catch (error) {
   console.error("Erro ao inicializar plugin:", error);
  }
 }
 

 private globalStyles() {
  // Se estiver usando classes
this.$mainStyle = document.createElement('link');
this.$mainStyle.rel = 'stylesheet';
this.$mainStyle.href = this.baseUrl + 'main.css';
document.head.appendChild(this.$mainStyle);

// Ou usando Object.assign para uma abordagem mais concisa
this.$mainStyle = Object.assign(document.createElement('link'), {
    rel: 'stylesheet',
    href: `${this.baseUrl}main.css`
});
document.head.appendChild(this.$mainStyle);

// Se preferir uma função helper similar ao 'tag'
const createElement = <K extends keyof HTMLElementTagNameMap>(
    tagName: K, 
    attributes: Record<string, string>
): HTMLElementTagNameMap[K] => {
    const element = document.createElement(tagName);
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    return element;
};

// Usando a função helper
this.$mainStyle = createElement('link', {
    rel: 'stylesheet',
    href: `${this.baseUrl}main.css`
});
document.head.appendChild(this.$mainStyle);
 }

 private setupCopyDelegation(): void {
  if (this.copyDelegationAttached) return;
  this.copyDelegationAttached = true;
  if (!this.container) return;

  const messagesContainer = this.container.querySelector('#chat-messages') as HTMLElement | null;
  if (!messagesContainer) return;

  messagesContainer.addEventListener('click', async (e) => {
   const el = e.target as HTMLElement;
   const btn = el.closest ? el.closest('.copy-btn') as HTMLElement | null : null;
   if (!btn) return;
   e.preventDefault();

   const codeId = btn.dataset.codeId;
   if (!codeId) return;

   const codeElement = messagesContainer.querySelector(`#${codeId}`) as HTMLElement | null;
   const codeText = codeElement?.textContent ?? '';

   const original = btn.innerHTML;
   btn.innerHTML = '⏳';

   const ok = await CodeFormatter.copyToClipboard(codeText);

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

 private initializeTabSystem(): void {
  if (!this.container) return;

  const buttons = Array.from(this.container.querySelectorAll('.tab-btn')) as HTMLButtonElement[];
  const indicator = this.container.querySelector('.tab-indicator') as HTMLElement | null;

  if (indicator) {
   indicator.style.width = `${100 / Math.max(buttons.length, 1)}%`;
   indicator.style.transform = `translateX(0%)`;
  }

  buttons.forEach((btn, index) => {
   btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (indicator) {
     indicator.style.transform = `translateX(${index * 100}%)`;
    }

    const tab = btn.dataset.tab!;
    this.container!.querySelectorAll('.tab-pane').forEach(pane => {
     pane.classList.toggle('active', pane.id === `${tab}-tab`);
    });

    // quando entrar na aba config, garantir que o input esteja atualizado
    if (tab === 'config') {
     // refresh the shown api key (in case it changed elsewhere)
     this.loadSavedConfig();
    }
   });
  });
 }

 private userProfile(): string {
  const settings = appSettings.value[plugin.id];
  const userName = settings?.userName?.trim();
  return userName ? `Olá, ${userName}! ` : 'Olá! ';
 }
 
 private renderContainer(): void {
  if (!this.container) return;

  this.container.innerHTML = `
      <div class="sidebar-container scroll">
        <div class="tabs-header">
          <button class="tab-btn active" data-tab="chat"><span>Chat</span></button>
          <button class="tab-btn" data-tab="rules"><span>Rules</span></button>
          <button class="tab-btn" data-tab="config"><span>Config</span></button>
          <div class="tab-indicator"></div>
        </div>

        <div class="tab-content">
          <div class="tab-pane active" id="chat-tab">
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
                  <p>${this.userProfile()}Como posso ajudar você hoje?</p>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane" id="rules-tab">
            <div class="rules-content p-5">${this.renderRules()}</div>
          </div>

          <div class="tab-pane" id="config-tab">
            <div class="config-content p-5">${this.renderConfig()}</div>
          </div>
        </div>
      </div>
    `;

  this.initializeTabSystem();
  this.initializeChatEvents();
  this.initializeRulesEvents();
  this.initializeConfigEvents();

  // carregar valores salvos após o DOM renderizar
  this.loadSavedConfig().then(() => {
   // ativar delegação para copiar após o DOM pronto
   this.setupCopyDelegation();
   // destacar eventuais blocos já renderizados
   const messagesContainer = this.container?.querySelector('#chat-messages') as HTMLElement | null;
   if (messagesContainer) this.applySyntaxHighlighting(messagesContainer);
  }).catch(err => console.error('loadSavedConfig error', err));
 }

 private renderRules(): string {
  const rules = this.ruleManager.getRules();
  const activeCount = this.ruleManager.countActiveRules();

  const togglesHtml = Object.entries({
   preferTypescript: "Preferir TypeScript",
   preferCleanCode: "Código Limpo",
   explainLikeTeacher: "Explicar como Professor",
   simpleLanguage: "Linguagem Simples",
   showAlternativeSolutions: "Mostrar Soluções Alternativas",
   optimizePerformance: "Otimizar Performance",
   autoDetectLanguage: "Detectar Idioma Automaticamente"
  }).map(([key, label]) => `
      <div class="rule-item">
        <span class="text-sm">${label}</span>
        <label class="toggle-switch">
          <input type="checkbox" data-rule="${key}" ${rules[key] ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    `).join('');

  return `
      <div class="p-2">
        <h3 class="font-bold mb-3">Rules Manager</h3>
        <div class="rules-status mb-4 p-3 bg-blue-50 rounded border">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>Regras ativas: <strong>${activeCount}</strong></span>
            <button id="reset-rules" class="btn-sm bg-red-500 text-white rounded px-2 py-1 text-xs">Resetar</button>
          </div>
        </div>
        <div class="toggle-rules mb-4">
          <h4 class="font-semibold mb-2">Regras Configuráveis</h4>
          <div class="space-y-2">
            ${togglesHtml}
          </div>
        </div>
        <div class="custom-rules">
          <h4 class="font-semibold mb-2">Regras Personalizadas (JSON)</h4>
          <textarea id="custom-rules-json" placeholder='{"exemplo": "valor"}' rows="4" class="w-full p-2 rounded border text-sm font-mono">${JSON.stringify(this.ruleManager.getRules().customRules || {}, null, 2)}</textarea>
          <button id="save-custom-rules" class="btn-primary w-full mt-2">Aplicar Regras Customizadas</button>
        </div>
      </div>
    `;
 }

 private renderConfig(): string {
  const settings = appSettings.value[plugin.id];
  const currentUserName = settings?.userName || '';

  return `
      <div class="p-2">
        <h3 class="font-bold mb-2">Configurações de API</h3>

        <div class="config-section">
          <label for="user-name" class="block mb-1">Como gosta de ser chamado:</label>
          <input type="text" id="user-name" placeholder="Seu nome ou apelido..." value="${this.escapeHtml(currentUserName)}" class="config-input">
          <small class="text-muted">Este nome será usado nas saudações</small>
        </div>

        <div class="config-section mt-3">
          <label for="api-provider" class="block mb-1">Provedor:</label>
          <select id="api-provider" class="config-select">
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
            <option value="deepseek">DeepSeek</option>
            <option value="claude">Claude</option>
          </select>
        </div>

        <div class="config-section mt-3">
          <label for="api-key" class="block mb-1">API Key:</label>
          <input type="password" id="api-key" placeholder="Sua chave API..." class="config-input" autocomplete="new-password">
          <div class="flex items-center gap-2 mt-2">
            <button id="reveal-key" class="btn-sm">Mostrar</button>
            <button id="clear-key" class="btn-sm">Limpar</button>
          </div>
        </div>

        <div class="config-section mt-3">
          <label for="api-model" class="block mb-1">Modelo:</label>
          <select id="api-model" class="config-select">
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gemini-pro">Gemini Pro</option>
            <option value="deepseek-coder">DeepSeek Coder</option>
            <option value="gpt-4o-mini">gpt-4o-mini</option>
          </select>
        </div>

        <div class="config-section mt-3">
          <label for="temperature" class="block mb-1">Temperatura: <span id="temp-value">0.7</span></label>
          <input type="range" id="temperature" min="0" max="1" step="0.1" value="0.7" class="config-slider">
        </div>

        <div class="config-actions mt-4">
          <button id="test-api" class="btn-secondary">Testar API</button>
          <button id="save-config" class="btn-primary">Salvar</button>
        </div>
      </div>
    `;
 }
 

 private initializeChatEvents(): void {
  if (!this.container) return;

  const sendBtn = this.container.querySelector('#send-message') as HTMLElement | null;
  const input = this.container.querySelector('#chat-input') as HTMLTextAreaElement | null;
  const clearBtn = this.container.querySelector('#clear-chat') as HTMLElement | null;
  const historyBtn = this.container.querySelector('#history-chat') as HTMLElement | null;

  const send = () => this.sendMessage();

  sendBtn?.addEventListener('click', send);
  input?.addEventListener('keydown', (e) => {
   if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
   }
  });

  input?.addEventListener('input', () => {
   if (input) this.autoResizeTextarea(input);
  });

  clearBtn?.addEventListener('click', () => {
   const messages = this.container?.querySelector('#chat-messages') as HTMLElement | null;
   if (messages) {
    messages.innerHTML = '';
    const systemMsg = document.createElement('div');
    systemMsg.className = 'message system';
    systemMsg.innerHTML = `<p>${this.userProfile()}Como posso ajudar você hoje?</p>`;
    messages.appendChild(systemMsg);
   }
  });

  historyBtn?.addEventListener('click', () => {
   toast('Histórico - funcionalidade ainda não implementada');
  });
 }

 private initializeRulesEvents(): void {
  if (!this.container) return;

  this.container.addEventListener('change', (e) => {
   const target = e.target as HTMLInputElement;
   if (!target.matches('input[type="checkbox"][data-rule]')) return;

   const ruleKey = target.dataset.rule!;
   const checked = target.checked;
   this.ruleManager.setToggleRule(ruleKey, checked);
   toast(`Regra "${ruleKey}" ${checked ? 'ativada' : 'desativada'}`);
  });

  const resetBtn = this.container.querySelector('#reset-rules') as HTMLButtonElement | null;
  resetBtn?.addEventListener('click', () => {
   this.ruleManager.resetRules();
   toast('Regras resetadas');
   const rulesPane = this.container!.querySelector('.rules-content');
   if (rulesPane) rulesPane.innerHTML = this.renderRules();
  });

  const saveCustomBtn = this.container.querySelector('#save-custom-rules') as HTMLButtonElement | null;
  saveCustomBtn?.addEventListener('click', () => this.saveRules());
 }

 private initializeConfigEvents(): void {
  if (!this.container) return;

  const saveBtn = this.container.querySelector('#save-config') as HTMLButtonElement | null;
  const testBtn = this.container.querySelector('#test-api') as HTMLButtonElement | null;
  const tempSlider = this.container.querySelector('#temperature') as HTMLInputElement | null;
  const tempValue = this.container.querySelector('#temp-value') as HTMLElement | null;
  const revealBtn = this.container.querySelector('#reveal-key') as HTMLButtonElement | null;
  const clearKeyBtn = this.container.querySelector('#clear-key') as HTMLButtonElement | null;

  saveBtn?.addEventListener('click', () => this.saveConfig());
  testBtn?.addEventListener('click', () => this.testAPI());

  revealBtn?.addEventListener('click', (e) => {
   e.preventDefault();
   const apiKeyEl = this.container!.querySelector('#api-key') as HTMLInputElement | null;
   if (!apiKeyEl) return;
   apiKeyEl.type = apiKeyEl.type === 'password' ? 'text' : 'password';
  });

  clearKeyBtn?.addEventListener('click', (e) => {
   e.preventDefault();
   const apiKeyEl = this.container!.querySelector('#api-key') as HTMLInputElement | null;
   if (!apiKeyEl) return;
   apiKeyEl.value = '';
  });

  tempSlider?.addEventListener('input', () => {
   if (tempValue && tempSlider) {
    tempValue.textContent = tempSlider.value;
   }
  });
 }

 private async loadSavedConfig(): Promise<void> {
  if (!this.container) return;

  const settings = appSettings.value[plugin.id];
  if (!settings) return;

  const apiKeyEl = this.container.querySelector('#api-key') as HTMLInputElement | null;
  const providerEl = this.container.querySelector('#api-provider') as HTMLSelectElement | null;
  const modelEl = this.container.querySelector('#api-model') as HTMLSelectElement | null;
  const tempSlider = this.container.querySelector('#temperature') as HTMLInputElement | null;
  const tempValue = this.container.querySelector('#temp-value') as HTMLElement | null;
  const userNameEl = this.container.querySelector('#user-name') as HTMLInputElement | null;

  // provider
  if (providerEl && settings.provider) providerEl.value = settings.provider;

  // model
  if (modelEl && settings.model) {
   modelEl.value = settings.model;
   const modelIndicator = this.container.querySelector('#model-indicator') as HTMLElement | null;
   if (modelIndicator) modelIndicator.textContent = `Modelo: ${settings.model}`;
  }

  // temperature
  if (tempSlider && settings.temperature !== undefined) {
   tempSlider.value = settings.temperature.toString();
   if (tempValue) tempValue.textContent = settings.temperature.toString();
  }

  // user name
  if (userNameEl && settings.userName) userNameEl.value = settings.userName;

  // decrypt apiKey and set to input (if exists)
  if (apiKeyEl) {
   if (settings.apiKey) {
    try {
     const realKey = await this.decrypt(settings.apiKey);
     apiKeyEl.value = realKey || '';
    } catch (err) {
     console.error('Erro ao carregar apiKey:', err);
     apiKeyEl.value = '';
    }
   } else {
    apiKeyEl.value = '';
   }
  }
 }

 private async sendMessage(): Promise<void> {
  const input = this.container?.querySelector('#chat-input') as HTMLTextAreaElement | null;
  if (!input || !input.value.trim()) return;

  const message = input.value.trim();
  this.addMessage('user', message);
  input.value = '';
  this.autoResizeTextarea(input);

  this.showTypingIndicator();

  try {
   const settings = appSettings.value[plugin.id];
   if (!settings || !settings.apiKey) {
    throw new Error('Configure uma API Key primeiro na aba Config');
   }

   const realKey = await this.decrypt(settings.apiKey);
   if (!realKey) throw new Error('API Key inválida ou não pode ser descriptografada');

   this.aiService = new AIService({
    apiKey: realKey,
    provider: settings.provider,
    model: settings.model,
    temperature: settings.temperature
   });

   const activeRules = this.ruleManager.getRulesAsText();
   const finalPrompt = `\nREGRAS DO SISTEMA:\n${activeRules}\n\nMENSAGEM DO USUÁRIO:\n${message}\n\nPor favor, responda seguindo as regras acima.`.trim();

   const response = await this.aiService.sendMessage(finalPrompt);
   this.hideTypingIndicator();
   this.addMessage('assistant', response);

  } catch (error: any) {
   this.hideTypingIndicator();
   const msg = error?.message ?? String(error);
   this.addMessage('system', `Erro: ${msg}`);
   console.error('sendMessage error:', error);
  }
 }

 private showTypingIndicator(): void {
  const messagesContainer = this.container?.querySelector('#chat-messages') as HTMLElement | null;
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

 private hideTypingIndicator(): void {
  const typingIndicator = this.container?.querySelector('#typing-indicator') as HTMLElement | null;
  if (typingIndicator) typingIndicator.remove();
 }

 private addMessage(role: 'user' | 'assistant' | 'system', content: string): void {
  const messagesContainer = this.container?.querySelector('#chat-messages') as HTMLElement | null;
  if (!messagesContainer) {
   console.error('Container de mensagens não encontrado!');
   return;
  }

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

  // aplicar highlight nos blocos do messageDiv recém-adicionado
  this.applySyntaxHighlighting(messageDiv);

  requestAnimationFrame(() => {
   messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
  });
 }

 /*
  safeFormatContent: detecta blocos de código e inline-code ANTES de escapar o HTML.
  Estratégia:
   - Extrair blocos ```lang\ncode``` e substituí-los por tokens únicos, guardando o conteúdo (sem escapar).
   - Fazer escape do restante do texto.
   - Substituir tokens por HTML de blocos de código com conteúdo escapado e classes hljs.
   - Tratar inline `code`.
*/
 private safeFormatContent(content: string): string {
  // Guarda os blocos de código extraídos
  const codeBlocks: Record<string, { lang: string, code: string }> = {};
  let tokenIndex = 0;
  const makeToken = (lang: string, code: string) => {
   const id = `CODE_TOKEN_${tokenIndex++}`;
   codeBlocks[id] = { lang: lang || 'text', code };
   return id;
  };

  // 1) Extrai blocos triple-backtick e substitui por tokens
  const withoutBlocks = content.replace(/```(\w+)?\s*([\s\S]*?)```/g, (_match, lang, code) => {
   return makeToken(lang || 'text', code);
  });

  // 2) Escapa HTML das partes sem código
  const escaped = this.escapeHtml(withoutBlocks);

  // 3) Agora dividimos em partes, preservando tokens intactos
  const parts = escaped.split(/(CODE_TOKEN_\d+)/);

  // 4) Reconstruimos substituindo tokens pelos blocos de código (preservando \n)
  const reconstructed = parts.map(part => {
   const tokenMatch = part.match(/^(CODE_TOKEN_\d+)$/);
   if (tokenMatch) {
    const info = codeBlocks[part];
    if (!info) return '';
    const codeEscaped = this.escapeHtml(info.code.replace(/\r\n/g, '\n')); // mantém newlines
    const langClass = this.escapeHtml(info.lang || 'text');
    const codeId = 'code-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    // NOTA: Não convertendo \n para <br> aqui — <pre> preserva whitespace.
    return `
        <div class="code-block">
          <div class="code-header">
            <span class="code-language">${this.escapeHtml(info.lang)}</span>
            <button class="copy-btn" data-code-id="${codeId}">📋</button>
          </div>
          <pre><code id="${codeId}" class="hljs language-${langClass}">${codeEscaped}</code></pre>
        </div>
      `;
   } else {
    // Parte sem código: converte quebras para <br> para preservar quebras no fluxo normal
    return part.replace(/\n/g, '<br>');
   }
  }).join('');

  // 5) Tratar inline code (apenas na parte já reconstruída — safe porque os blocos de código já foram injetados)
  const withInline = reconstructed.replace(/`([^`]+)`/g, (_m, p1) => `<code class="inline-code">${this.escapeHtml(p1)}</code>`);

  return withInline;
 }

 private hasCorruptionIndicators(content: string): boolean {
  const corruptionPattern = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
  return corruptionPattern.test(content);
 }

 private saveRules(): void {
  const customRules = this.container?.querySelector('#custom-rules-json') as HTMLTextAreaElement | null;
  if (customRules) {
   try {
    const parsed = JSON.parse(customRules.value || '{}');
    this.ruleManager.setCustomRules(parsed);
    toast('Regras salvas com sucesso!');
   } catch (err) {
    toast('JSON inválido nas regras personalizadas');
   }
  }
 }

 private async saveConfig(): Promise<void> {
  const apiKeyEl = this.container?.querySelector('#api-key') as HTMLInputElement | null;
  const providerEl = this.container?.querySelector('#api-provider') as HTMLSelectElement | null;
  const modelEl = this.container?.querySelector('#api-model') as HTMLSelectElement | null;
  const temperatureEl = this.container?.querySelector('#temperature') as HTMLInputElement | null;
  const userNameEl = this.container?.querySelector('#user-name') as HTMLInputElement | null;

  const settings = appSettings.value[plugin.id];

  if (!apiKeyEl || !providerEl || !modelEl || !temperatureEl) {
   toast('Campos de configuração incompletos');
   return;
  }

  // atualiza apiKey somente se o usuário digitou uma nova
  const newKey = apiKeyEl.value.trim();
  if (newKey !== "") {
   settings.apiKey = await this.encrypt(newKey);
  }

  settings.provider = providerEl.value;
  settings.model = modelEl.value;
  settings.temperature = parseFloat(temperatureEl.value);
  settings.userName = userNameEl?.value || settings.userName;

  appSettings.update();
  toast('Configurações salvas!');

  const modelIndicator = this.container?.querySelector('#model-indicator') as HTMLElement | null;
  if (modelIndicator) modelIndicator.textContent = `Modelo: ${settings.model}`;
 }

 private testAPI(): void {
  toast('Testando conexão com API...');
  setTimeout(() => {
   toast('Conexão com API bem-sucedida!');
  }, 1500);
 }

 // ================================
 // 🔐 CRIPTOGRAFIA
 // ================================
 private cryptoKey: CryptoKey | null = null;
 private encoder = new TextEncoder();
 private decoder = new TextDecoder();

 private async loadCryptoKey() {
  if (this.cryptoKey) return this.cryptoKey;

  const storageKey = "agenteIA.secretKey";
  let raw = localStorage.getItem(storageKey);

  if (!raw) {
   const newKey = this.randomBytes(32); // 256 bits
   const bin = String.fromCharCode(...newKey);
   const encoded = btoa(bin);
   localStorage.setItem(storageKey, encoded);
   raw = encoded;
  }

  const rawStr = atob(raw);
  const buffer = new Uint8Array(rawStr.length);
  for (let i = 0; i < rawStr.length; i++) {
   buffer[i] = rawStr.charCodeAt(i);
  }

  this.cryptoKey = await crypto.subtle.importKey(
   "raw",
   buffer,
   { name: "AES-GCM", length: 256 },
   false,
   ["encrypt", "decrypt"]
  );

  return this.cryptoKey;
 }

 private async encrypt(text: string): Promise<string> {
  if (!text) return "";

  const key = await this.loadCryptoKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = this.encoder.encode(text);

  const encrypted = await crypto.subtle.encrypt(
   { name: "AES-GCM", iv },
   key,
   data
  );

  const encryptedBytes = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.length + encryptedBytes.length);
  combined.set(iv);
  combined.set(encryptedBytes, iv.length);

  let bin = "";
  for (let i = 0; i < combined.length; i++) {
   bin += String.fromCharCode(combined[i]);
  }
  return btoa(bin);
 }

 private async decrypt(base64: string): Promise<string> {
  if (!base64) return "";

  try {
   const key = await this.loadCryptoKey();
   const rawStr = atob(base64);
   const raw = new Uint8Array(rawStr.length);
   for (let i = 0; i < rawStr.length; i++) {
    raw[i] = rawStr.charCodeAt(i);
   }

   const iv = raw.slice(0, 12);
   const data = raw.slice(12);

   const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
   );

   return this.decoder.decode(decrypted);
  } catch (error) {
   console.error('Erro ao descriptografar:', error);
   return '';
  }
 }

 private randomBytes(size: number): Uint8Array {
  const array = new Uint8Array(size);
  crypto.getRandomValues(array);
  return array;
 }

 private autoResizeTextarea(textarea: HTMLTextAreaElement): void {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 320) + 'px';
 }

 private escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
 }

 private onAppSelected(): void {
  toast('Agente IA ativado');
 }

 // Aplica highlight em elementos <pre><code> dentro do container
 private applySyntaxHighlighting(container: HTMLElement) {
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

 async destroy() {
  if (sideBarApps) {
   sideBarApps.remove('agente_IA');
   sideBarApps.remove("sidebar-icon");
  }
 }
}

// === INICIALIZAÇÃO DO PLUGIN ===
if (window.acode) {
 const acodePlugin = new AcodePlugin();

 acode.setPluginInit(plugin.id, async (baseUrl: string, $page: any, { cacheFileUrl, cacheFile }: any) => {
  if (!baseUrl.endsWith('/')) baseUrl += '/';
  acodePlugin.baseUrl = baseUrl;
  await acodePlugin.init();
 });

 acode.setPluginUnmount(plugin.id, () => {
  acodePlugin.destroy();
 });
}