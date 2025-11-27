// src/services/ContextService.ts
export class ContextService {
 private editorManager: any;
 private fileList: any;
 private helpers: any;
 private actionStack: any;

 constructor() {
  this.editorManager = acode.require('editorManager');
  this.fileList = acode.require('fileList');
  this.helpers = acode.require('helpers');
  this.actionStack = acode.require('actionStack');
 }

 async getCurrentContext(): Promise<FileContext> {
  const activeFile = this.editorManager.activeFile;
  const cursorPos = this.editorManager.editor.getCursorPosition();

  return {
   activeFile: {
    uri: activeFile?.uri || '',
    name: activeFile?.filename || 'No file open',
    language: activeFile?.language || 'text',
    content: activeFile?.session.getValue() || '',
    cursorPosition: cursorPos,
    iconClass: this.helpers.getIconForFile(activeFile?.filename || '')
   },
   projectStructure: await this.analyzeProjectStructure(),
   workspaceInfo: await this.getWorkspaceInfo()
  };
 }

 async analyzeProjectStructure() {
  const files = await this.fileList();
  const hasPackageJson = files.some((file: any) => file.name === 'package.json');

  // Análise simplificada - podemos expandir depois
  return {
   type: this.detectProjectType(files),
   hasPackageJson,
   dependencies: await this.extractDependencies(files),
   framework: this.detectFramework(files)
  };
 }

 private detectProjectType(files: any[]): FileContext['projectStructure']['type'] {
  if (files.some(f => f.name === 'package.json')) return 'node';
  if (files.some(f => f.name === 'react' || f.name.includes('.jsx'))) return 'react';
  return 'unknown';
 }

 async createContextMenu(context: FileContext, onAction: (action: string) => void) {
  const contextmenu = acode.require('contextmenu');

  const menu = contextmenu('Análise de Contexto', {
   top: 100,
   left: 200,
   items: [
    ['📋 Analisar código', 'analyze'],
    ['🔧 Sugerir melhorias', 'refactor'],
    ['🐛 Verificar erros', 'debug'],
    ['🚀 Comandos úteis', 'terminal'],
    ['📁 Arquivos relacionados', 'related']
   ],
   onselect: (action: string) => {
    onAction(action);
    menu.hide();
   }
  });

  return menu;
 }
}