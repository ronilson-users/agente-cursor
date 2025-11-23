// import type { WCPage } from "acode/editor/page";
// import type { Editor } from "acode/editor/editor";
import plugin from '../plugin.json';

import "./styles/main.scss";

const toast = acode.require('toast');

class AcodePlugin {
 public baseUrl: string | undefined;
 private sideBarApps: any;

 async init($page: WCPage, cacheFile: any, cacheFileUrl: string): Promise<void> {
  try {
   // 1. Inicializar sidebar
   this.sideBarApps = window.sidebarApps || acode.require('sidebarApps');
   if (!this.sideBarApps) {
    console.error('sidebarApps não disponível');
    return;
   }

   // 2. Ícone
   const iconUrl = `${this.baseUrl || ''}assets/icon.png`;
   acode.addIcon('sidebar-icon', iconUrl);

   // 3. Adicionar app na sidebar
   this.sideBarApps.add(
    'sidebar-icon',
    'agente_IA',
    'Agente IA',
    (container: HTMLElement) => this.initializeAppUI(container),
    false,
    (container: HTMLElement) => this.onAppSelected(container)
   );

   console.log('Plugin inicializado com sucesso');
  } catch (error) {
   console.error('Erro ao inicializar plugin:', error);
  }
 }

 private initializeAppUI(container: HTMLElement): void {
  container.innerHTML = `
    <div class="sidebar-container ">
      <!-- Abas  -->
      <div class="flex border-b">
        <button class="tab-btn active" data-tab="assistant">Assistente</button>
        <button class="tab-btn" data-tab="projects">Projetos</button>
        <button class="tab-btn" data-tab="settings">CONFIG</button>
      </div>

      <!-- CONTEÚDO – **único ponto de scroll** -->
      <div class="tab-content-main scroll">
        <!-- Assistente -->
        <div class="tab-pane active" id="assistant-tab">
          <div class="p-2">
            <h3 class="font-bold mb-2">Assistente IA</h3>
            ${this.getAssistantContent()}
          </div>
        </div>

        <!-- Projetos -->
        <div class="tab-pane" id="projects-tab">
          <div class="p-2">
            <h3 class="font-bold mb-2">Projetos</h3>
            <div id="project-creator-content"></div>
          </div>
        </div>

        <!-- Config -->
        <div class="tab-pane" id="settings-tab">
          <div class="p-2">
            ${this.getSettingsContent()}
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
   this.initializeTabSystem(container);
   this.initializeProjectCreatorUI(container);
   this.initializeAssistantUI(container);
   this.initializeSettingsUI(container);
  }, 100);
 }

 private initializeTabSystem(container: HTMLElement): void {
  const buttons = container.querySelectorAll<HTMLButtonElement>('.tab-btn');
  const panes = container.querySelectorAll<HTMLElement>('.tab-pane');

  buttons.forEach(btn => {
   btn.addEventListener('click', () => {
    const tab = btn.dataset.tab!;
    const paneId = `${tab}-tab`;

    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    panes.forEach(p => {
     p.classList.toggle('active', p.id === paneId);
    });


   });
  });
 }

 private initializeProjectCreatorUI(container: HTMLElement): void {
  const projectContainer = container.querySelector('#project-creator-content') as HTMLElement;
  if (!projectContainer) {
   console.error('Container #project-creator-content não encontrado');
   return;
  }

  // Simulação de CLIProjectCreator (substitua pela real se existir)
  class CLIProjectCreator {
   getAvailableTemplates() {
    return {
     vanilla: { name: 'Vanilla JS', description: 'Projeto JS puro' },
     react: { name: 'React', description: 'App React com Vite' },
     node: { name: 'Node.js', description: 'API com Express' }
    };
   }
  }

  const creator = new CLIProjectCreator();
  const templates = creator.getAvailableTemplates();

  let options = '';
  for (const [key, tmpl] of Object.entries(templates)) {
   options += `<option value="${key}">${tmpl.name} - ${tmpl.description}</option>`;
  }

  projectContainer.innerHTML = `
      <!-- Formulário -->
      <div class="space-y-3 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">Template:</label>
          <select id="project-template" class="w-full p-2 border rounded">
            ${options}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Nome do Projeto:</label>
          <input type="text" id="project-name" placeholder="meu-projeto"
                 class="w-full p-2 border rounded"
                 value="meu-projeto-${Date.now().toString().slice(-4)}">
        </div>

        <button class="btn primary w-full py-2" id="create-project">
          Criar Projeto
        </button>

        <div class="text-xs text-gray-500 text-center">
          Criado via terminal - Rápido e eficiente
        </div>
      </div>

      <!-- Terminal -->
      <div class="terminal-section mb-4">
        <div class="flex justify-between items-center mb-1">
          <label class="text-sm font-medium">Terminal Output:</label>
          <button class="btn secondary text-xs py-1" id="clear-output">Limpar</button>
        </div>
        <div id="terminal-output" class="terminal-output bg-gray-900 text-green-400 p-3 rounded font-mono text-xs h-40 overflow-auto">
$ Aguardando comando...
        </div>
      </div>

      <!-- Conteúdo longo para scroll -->
      ${this.getProjectCreatorContent()}
    `;

  // Eventos
  projectContainer.addEventListener('click', (e) => {
   const target = e.target as HTMLElement;
   if (target.id === 'create-project') {
    this.handleCreateProject();
   }
   if (target.id === 'clear-output') {
    const output = document.getElementById('terminal-output');
    if (output) output.innerHTML = '$ Output limpo\n';
   }
  });
 }

 private getProjectCreatorContent(): string {
  return `
      <div class="p-2 mt-6 border-t pt-4 space-y-2">
        <h3 class="font-bold mb-2">Teste de Scroll (Projetos)</h3>
        <p>Role para baixo para testar o scroll nesta aba também</p>
        ${Array(40).fill(`<p class="text-sm text-gray-700 dark:text-gray-300">Projeto exemplo em construção... informações de template, configurações, logs, etc.</p>`).join('')}
      </div>
    `;
 }

 private getAssistantContent(): string {
  return `
      <div class="space-y-2" id="assistant-content">
        <p class="p-2">Bem-vindo ao Assistente IA!</p>
        <p class="p-2">Role para baixo para testar o scroll</p>
        ${Array(50).fill(`<p class="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.</p>`).join('')}
      </div>
    `;
 }

 private getSettingsContent(): string {
  return `
      <div class="space-y-3" id="settings-content">
        <h3 class="font-bold mb-2">Configurações Gerais</h3>
        <div class="space-y-2">
          <label class="flex items-center gap-2">
            <input type="checkbox" checked class="rounded"> Habilitar IA
          </label>
          <label class="flex items-center gap-2">
            <input type="checkbox" class="rounded"> Modo Dark
          </label>
        </div>
        ${Array(90).fill(`<p class="text-sm text-gray-600 dark:text-gray-400">Opção de configuração avançada...</p>`).join('')}
      </div>
    `;
 }

 private initializeAssistantUI(container: HTMLElement): void {
  const el = container.querySelector('#assistant-content');
  if (!el) return;
  el.addEventListener('click', (e) => {
   const t = e.target as HTMLElement;
   if (t.id === 'btn-generate-code') this.handleGenerateCode();
   // Adicione outros botões aqui
  });
 }

 private initializeSettingsUI(container: HTMLElement): void {
  const el = container.querySelector('#settings-content');
  if (!el) return;
  // Eventos futuros
 }

 // Métodos de ação (exemplos)
 private handleCreateProject() {
  toast('Projeto criado com sucesso!');
 }

 private handleGenerateCode() {
  toast('Código gerado!');
 }

 private onAppSelected(container: HTMLElement) {
  // Opcional: ao selecionar a aba
  toast('Podemos iniciar', 400)
 }

 async destroy() {
  if (this.sideBarApps) {
   this.sideBarApps.remove('agente_IA');
   this.sideBarApps.remove('sidebar-icon');
  }
 }
}

// === INICIALIZAÇÃO DO PLUGIN ===
if (window.acode) {
 const acodePlugin = new AcodePlugin();

 acode.setPluginInit(plugin.id, async (baseUrl: string, $page: WCPage, { cacheFileUrl, cacheFile }: any) => {
  if (!baseUrl.endsWith('/')) baseUrl += '/';
  acodePlugin.baseUrl = baseUrl;
  await acodePlugin.init($page, cacheFile, cacheFileUrl);
 });

 acode.setPluginUnmount(plugin.id, () => {
  acodePlugin.destroy();
 });
}