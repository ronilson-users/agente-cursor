import { RuleManager } from '../../services/RuleManager';

export class RulesEvents {
  constructor(
    private container: HTMLElement,
    private ruleManager: RuleManager,
    private onRulesUpdated: () => void
  ) {}

  initialize(): void {
    this.setupToggleEvents();
    this.setupResetEvent();
    this.setupCustomRulesEvent();
  }

  private setupToggleEvents(): void {
    this.container.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.matches('input[type="checkbox"][data-rule]')) return;

      const ruleKey = target.dataset.rule!;
      const checked = target.checked;
      this.ruleManager.setToggleRule(ruleKey, checked);
      
      const toast = acode.require('toast');
      toast(`Regra "${ruleKey}" ${checked ? 'ativada' : 'desativada'}`);
    });
  }

  private setupResetEvent(): void {
    const resetBtn = this.container.querySelector('#reset-rules') as HTMLButtonElement;
    resetBtn?.addEventListener('click', () => {
      this.ruleManager.resetRules();
      
      const toast = acode.require('toast');
      toast('Regras resetadas');
      this.onRulesUpdated();
    });
  }

  private setupCustomRulesEvent(): void {
    const saveCustomBtn = this.container.querySelector('#save-custom-rules') as HTMLButtonElement;
    saveCustomBtn?.addEventListener('click', () => this.saveCustomRules());
  }

  private saveCustomRules(): void {
    const customRules = this.container.querySelector('#custom-rules-json') as HTMLTextAreaElement;
    if (customRules) {
      try {
        const parsed = JSON.parse(customRules.value || '{}');
        this.ruleManager.setCustomRules(parsed);
        
        const toast = acode.require('toast');
        toast('Regras salvas com sucesso!');
      } catch (err) {
        const toast = acode.require('toast');
        toast('JSON inválido nas regras personalizadas');
      }
    }
  }
}