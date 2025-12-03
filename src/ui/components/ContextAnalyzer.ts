// src/ui/components/ContextAnalyzer.ts
export class ContextAnalyzer {
 private container: HTMLElement;
 private actionStack: any;

 constructor(container: HTMLElement) {
  this.container = container;
  this.actionStack = acode.require('actionStack');
 }

 renderAnalyzeButton(): void {
  const analyzeBtn = document.createElement('button');
  analyzeBtn.id = 'analyze-context';
  analyzeBtn.className = 'analyze-btn';
  analyzeBtn.innerHTML = '🔍';
  analyzeBtn.title = 'Analisar arquivo e projeto atual';

  analyzeBtn.addEventListener('click', () => {
   this.handleContextAnalysis();
  });

  // Adicionar ao container do chat input
  const chatInputWrapper = this.container.querySelector('.chat-input-wrapper');
  if (chatInputWrapper) {
   chatInputWrapper.appendChild(analyzeBtn);
  }

  // Registrar no action stack para limpeza
  this.actionStack.push({
   id: 'context-analyzer',
   action: () => analyzeBtn.remove()
  });
 }

 private async handleContextAnalysis(): Promise<void> {
  try {
   // Mostrar loading
   this.setAnalyzeButtonState('loading');

   // Por enquanto, vamos implementar uma versão simples
   // Depois expandimos com as APIs completas
   await this.simpleContextAnalysis();

  } catch (error) {
   console.error('Erro na análise de contexto:', error);
   this.showError('Erro ao analisar contexto');
  } finally {
   this.setAnalyzeButtonState('ready');
  }
 }

 private async simpleContextAnalysis(): Promise<void> {
  const toast = acode.require('toast');

  try {
   // Tentar obter informações básicas do editor
   const { editor } = editorManager;
   const activeFile = editorManager.activeFile;

   if (!activeFile) {
    toast('Nenhum arquivo aberto no editor');
    return;
   }

   const fileName = activeFile.filename;
   const language = activeFile.language || 'text';

   toast(`Analisando: ${fileName} (${language})`);

   // Adicionar mensagem no chat sobre o contexto
   this.addContextMessage(fileName, language);

  } catch (error) {
   toast('Não foi possível acessar o editor');
  }
 }

 private addContextMessage(fileName: string, language: string): void {
  const messagesContainer = this.container.querySelector('#chat-messages') as HTMLElement;
  if (!messagesContainer) return;

  const contextDiv = document.createElement('div');
  contextDiv.className = 'message system context-analysis';
  contextDiv.innerHTML = `
      <div class="context-info">
        <strong>📁 Contexto Analisado:</strong>
        <div>Arquivo: <code>${fileName}</code></div>
        <div>Linguagem: <code>${language}</code></div>
        <div class="context-suggestions">
          <small>Posso ajudar com: análise de código, sugestões de melhoria, detecção de erros...</small>
        </div>
      </div>
    `;

  messagesContainer.appendChild(contextDiv);
  messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
 }

 private setAnalyzeButtonState(state: 'ready' | 'loading' | 'error'): void {
  const btn = this.container.querySelector('#analyze-context') as HTMLButtonElement;
  if (!btn) return;

  switch (state) {
   case 'loading':
    btn.innerHTML = '⏳ Analisando...';
    btn.disabled = true;
    break;
   case 'error':
    btn.innerHTML = '❌ Erro';
    btn.disabled = false;
    setTimeout(() => {
     btn.innerHTML = '🔍 Analisar Contexto';
    }, 2000);
    break;
   default:
    btn.innerHTML = '🔍 Analisar Contexto';
    btn.disabled = false;
  }
 }

 private showError(message: string): void {
  const toast = acode.require('toast');
  toast(message);
 }
}