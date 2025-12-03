// src/types/context.ts
export interface FileContext {
  activeFile: {
    uri: string;
    name: string;
    language: string;
    content: string;
    cursorPosition?: { line: number; column: number };
    iconClass: string;
  };
  projectStructure: {
    type: 'react' | 'node' | 'vanilla' | 'unknown';
    hasPackageJson: boolean;
    framework?: string;
    dependencies: string[];
  };
  workspaceInfo: {
    rootPath: string;
    currentDirectory: string;
    filesInDirectory: Array<{
      name: string;
      path: string;
      iconClass: string;
      isDirectory: boolean;
    }>;
  };
}

export interface ContextAnalysis {
  analysis: string;
  suggestions: string[];
  quickActions: QuickAction[];
  terminalCommands?: TerminalCommand[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void | Promise<void>;
}

export interface TerminalCommand {
  command: string;
  description: string;
  riskLevel: 'low' | 'medium' | 'high';
  needsConfirmation: boolean;
}