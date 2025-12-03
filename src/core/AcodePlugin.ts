import plugin from '../../plugin.json';
import "../styles/main.scss";

import { AIService } from "../services/AIService";
import { RuleManager } from '../services/RuleManager';
import { CodeFormatter } from "../services/CodeFormatter";
import { CryptoUtils } from '../utils/CryptoUtils';
import { DOMUtils } from '../utils/DOMUtils';

import { ChatTemplate } from '../ui/templates/ChatTemplate';
import { RulesTemplate } from '../ui/templates/RulesTemplate';
import { ConfigTemplate } from '../ui/templates/ConfigTemplate';
import { TabSystem } from '../ui/components/TabSystem';
import { MessageRenderer } from '../ui/components/MessageRenderer';
import { ChatEvents } from '../ui/events/ChatEvents';
import { RulesEvents } from '../ui/events/RulesEvents';
import { ConfigEvents } from '../ui/events/ConfigEvents';
import { ContextAnalyzer } from '../ui/components/ContextAnalyzer';

import { PluginSettings } from '../types';

const sideBarApps = acode.require('sidebarApps');
const toast = acode.require('toast');
const appSettings = acode.require('settings');

export class AcodePlugin {
 private contextAnalyzer: ContextAnalyzer;
 private container: HTMLElement | null = null;
 private id: string = plugin.id;
 private ruleManager: RuleManager;
 private aiService: AIService | null = null;
 public baseUrl: string = "";
 private cryptoUtils: CryptoUtils;
 private $mainStyle: HTMLLinkElement | null = null;

 constructor() {
  this.ruleManager = new RuleManager();
  this.cryptoUtils = new CryptoUtils();
  this.initializeSettings();
 }

 private initializeSettings(): void {
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

 async init(): Promise<void> {
  try {
   const iconUrl = `${this.baseUrl}assets/icon.png`;
   acode.addIcon("sidebar-icon", iconUrl);

   this.loadGlobalStyles();
   await this.loadHighlightJS();

   sideBarApps.add(
    "sidebar-icon",
    "agente_IA",
    "Agente IA",
    (container: HTMLElement) => {
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

 private loadGlobalStyles(): void {
  this.$mainStyle = DOMUtils.loadStylesheet(`${this.baseUrl}main.css`);
 }

 private async loadHighlightJS(): Promise<void> {
  try {
   if (typeof (CodeFormatter as any).loadHighlight === 'function') {
    await (CodeFormatter as any).loadHighlight(this.baseUrl);
   }
  } catch (err) {
   console.warn('Não foi possível carregar highlight.js:', err);
  }
 }

 private renderContainer(): void {
  if (!this.container) return;

  const settings = this.getSettings();

  this.container.innerHTML = `
  
    <div class="sidebar-container">
     <div class="tabs-header">
     
     <!---- TAB SYTEM ----!>
     
    <button class="tab-btn active" data-tab="chat">
    <span>Chat</span>
    </button>
     
     <button class="tab-btn" data-tab="rules">
     <span>Rules</span>
     </button>
     
     
     <button class="tab-btn" data-tab="config">
     <span>Config</span>
     </button>
     
       <!---- TAB SYTEM INDICATOR ----!>
     <div class="tab-indicator"></div>
     </div>
     
       <!---- CONTEUDO CHAT AGENTE ----!>
       
     <div class="tab-pane active" id="chat-tab">
     <div class="chat-content">
        ${ChatTemplate.render(settings.userName)}
      </div>
     </div>
     
     <div class="tab-pane" id="rules-tab">
     <div class="rules-content ">
         ${RulesTemplate.render(this.ruleManager)}</div>
     </div>
     
     <div class="tab-pane" id="config-tab">
     <div class="config-content ">
         ${ConfigTemplate.render(settings)}
     </div>
     </div>
     
     
     </div>
    
    
    `;

  this.initializeUIComponents();
 }

 private initializeUIComponents(): void {
  if (!this.container) return;

  // Sistema de abas
  const tabSystem = new TabSystem(this.container);
  tabSystem.initialize();

  // Eventos do chat
  const chatEvents = new ChatEvents(
   this.container,
   (message) => this.sendMessage(message),
   () => this.clearChat()
  );
  chatEvents.initialize();

  // Eventos das regras
  const rulesEvents = new RulesEvents(
   this.container,
   this.ruleManager,
   () => this.refreshRulesUI()
  );
  rulesEvents.initialize();

  // Eventos de configuração
  const configEvents = new ConfigEvents(
   this.container,
   () => this.saveConfig(),
   () => this.testAPI(),
   this.cryptoUtils
  );
  configEvents.initialize();

  this.contextAnalyzer = new ContextAnalyzer(this.container);
  this.contextAnalyzer.renderAnalyzeButton();

  // Carregar configurações salvas
  this.loadSavedConfig();
 }

 private async sendMessage(message: string): Promise<void> {
  MessageRenderer.addMessage(this.container!, 'user', message);
  MessageRenderer.showTypingIndicator(this.container!);

  try {
   const settings = this.getSettings();
   if (!settings.apiKey) {
    throw new Error('Configure uma API Key primeiro na aba Config');
   }

   const realKey = await this.cryptoUtils.decrypt(settings.apiKey);
   if (!realKey) throw new Error('API Key inválida');

   this.aiService = new AIService({
    apiKey: realKey,
    provider: settings.provider,
    model: settings.model,
    temperature: settings.temperature
   });

   const activeRules = this.ruleManager.getRulesAsText();
   const finalPrompt = `\nREGRAS DO SISTEMA:\n${activeRules}\n\nMENSAGEM DO USUÁRIO:\n${message}\n\nPor favor, responda seguindo as regras acima.`.trim();

   const response = await this.aiService.sendMessage(finalPrompt);
   MessageRenderer.hideTypingIndicator(this.container!);
   MessageRenderer.addMessage(this.container!, 'assistant', response);

  } catch (error: any) {
   MessageRenderer.hideTypingIndicator(this.container!);
   const msg = error?.message ?? String(error);
   MessageRenderer.addMessage(this.container!, 'system', `Erro: ${msg}`);
   console.error('sendMessage error:', error);
  }
 }

 private clearChat(): void {
  const messagesContainer = this.container?.querySelector('#chat-messages') as HTMLElement;
  if (!messagesContainer) return;

  messagesContainer.innerHTML = '';
  const settings = this.getSettings();
  MessageRenderer.addMessage(this.container!, 'system',
   `${settings.userName ? `Olá, ${settings.userName}! ` : 'Olá! '}Como posso ajudar você hoje?`
  );
 }

 private refreshRulesUI(): void {
  const rulesPane = this.container!.querySelector('.rules-content');
  if (rulesPane) {
   rulesPane.innerHTML = RulesTemplate.render(this.ruleManager);
   // Re-inicializar eventos das regras
   const rulesEvents = new RulesEvents(
    this.container!,
    this.ruleManager,
    () => this.refreshRulesUI()
   );
   rulesEvents.initialize();
  }
 }

 
 private async saveConfig(): Promise<void> {
  console.log('🔄 saveConfig chamado');
  
  // 1. Pegar elementos DOM
  const apiKeyEl = this.container?.querySelector('#api-key') as HTMLInputElement;
  const providerEl = this.container?.querySelector('#api-provider') as HTMLSelectElement;
  const modelEl = this.container?.querySelector('#api-model') as HTMLSelectElement;
  const tempSlider = this.container?.querySelector('#temperature') as HTMLInputElement;
  const userNameEl = this.container?.querySelector('#user-name') as HTMLInputElement;

  // 2. Logar valores para debug
  console.log('🔑 API Key input value:', apiKeyEl?.value || 'vazio');
  console.log('🏷️ Provider:', providerEl?.value);
  console.log('🤖 Model:', modelEl?.value);
  console.log('🌡️ Temperature:', tempSlider?.value);

  // 3. Validar que encontrou os elementos
  if (!apiKeyEl || !providerEl || !modelEl || !tempSlider) {
    console.error('❌ Elementos DOM não encontrados');
    const toast = acode.require('toast');
    toast('Campos de configuração incompletos');
    return;
  }

  const settings = this.getSettings();
  console.log('📁 Settings antes:', settings);

  // 4. Atualizar apenas se houver nova chave
  const newKey = apiKeyEl.value.trim();
  if (newKey !== "") {
    console.log('🔐 Criptografando nova chave...');
    try {
      settings.apiKey = await this.cryptoUtils.encrypt(newKey);
      console.log('✅ Chave criptografada e salva');
    } catch (error) {
      console.error('❌ Erro ao criptografar:', error);
    }
  } else {
    console.log('⚠️ API Key vazia, mantendo anterior');
  }

  // 5. Atualizar outros campos
  settings.provider = providerEl.value;
  settings.model = modelEl.value;
  settings.temperature = parseFloat(tempSlider.value);
  settings.userName = userNameEl?.value || settings.userName;

  console.log('📁 Settings depois:', settings);

  // 6. Salvar
  try {
    appSettings.update();
    console.log('💾 Configurações salvas no appSettings');
    
    const toast = acode.require('toast');
    toast('Configurações salvas!');

    // 7. Atualizar indicador de modelo
    const modelIndicator = this.container?.querySelector('#model-indicator') as HTMLElement;
    if (modelIndicator) {
      modelIndicator.textContent = `Modelo: ${settings.model}`;
      console.log('🔄 Model indicator atualizado');
    }
  } catch (error) {
    console.error('❌ Erro ao salvar configurações:', error);
  }
}

 private testAPI(): void {
  toast('Testando conexão com API...');
  
  // implantar teste de pprovider
  
  setTimeout(() => {
   toast('Conexão com API bem-sucedida!');
  }, 1500);
 }

 private async loadSavedConfig(): Promise<void> {
  if (!this.container) return;

  const settings = this.getSettings();
  if (!settings) return;

  const apiKeyEl = this.container.querySelector('#api-key') as HTMLInputElement;
  const providerEl = this.container.querySelector('#api-provider') as HTMLSelectElement;
  const modelEl = this.container.querySelector('#api-model') as HTMLSelectElement;
  const tempSlider = this.container.querySelector('#temperature') as HTMLInputElement;
  const tempValue = this.container.querySelector('#temp-value') as HTMLElement;
  const userNameEl = this.container.querySelector('#user-name') as HTMLInputElement;

  // provider
  if (providerEl && settings.provider) providerEl.value = settings.provider;

  // model
  if (modelEl && settings.model) {
   modelEl.value = settings.model;
   const modelIndicator = this.container.querySelector('#model-indicator') as HTMLElement;
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
     const realKey = await this.cryptoUtils.decrypt(settings.apiKey);
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

 private getSettings(): PluginSettings {
  return appSettings.value[plugin.id] || {};
 }

 private onAppSelected(): void {
  
  
  toast('Agente IA ativado');
 }

 async destroy(): Promise<void> {
  if (sideBarApps) {
   sideBarApps.remove('agente_IA');
   sideBarApps.remove("sidebar-icon");
  }

  if (this.$mainStyle) {
   this.$mainStyle.remove();
  }
 }
}