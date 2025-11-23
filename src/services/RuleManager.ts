// RuleManager.ts
import plugin from "../../plugin.json";

const appSettings = acode.require("settings");

export type RuleValue = boolean | string | number;

export interface RuleSet {
  [key: string]: RuleValue;
}

export class RuleManager {
  // ===============================
  // 🔵 REGRAS PADRÃO (sempre ativas)
  // ===============================
  private defaultRules: RuleSet = {
    alwaysUseMarkdown: true,
    avoidRepeatingUserMessage: true,
    avoidHallucinations: true,
    verifyBeforeAnswering: true,
    useFriendlyTone: true,
  };

  // ====================================
  // 🟢 REGRAS DE TOGGLE (ativáveis)
  // ====================================
  private toggleRules: RuleSet = {
    preferTypescript: false,
    preferCleanCode: true,
    explainLikeTeacher: false,
    simpleLanguage: false,
    showAlternativeSolutions: false,
    optimizePerformance: false,
    autoDetectLanguage: true,
  };

  // ====================================
  // 🟣 REGRAS CUSTOMIZADAS (JSON)
  // ====================================
  private customRules: RuleSet = {};

  constructor() {
    this.loadSavedRules();
  }

  // ==================================================
  // 🔄 Carrega regras salvas no appSettings ao iniciar
  // ==================================================
  private loadSavedRules() {
    const settings = appSettings.value[plugin.id];
    if (!settings || !settings.rules) return;

    const saved = settings.rules;

    this.toggleRules = saved.toggleRules || this.toggleRules;
    this.customRules = saved.customRules || this.customRules;
  }

  // ==================================================
  // 💾 Salva regras no appSettings
  // ==================================================
  private save() {
    const settings = appSettings.value[plugin.id];
    if (!settings) return;

    settings.rules = {
      defaultRules: this.defaultRules,
      toggleRules: this.toggleRules,
      customRules: this.customRules,
    };

    appSettings.update();
  }

  // =================================================
  // 🔧 Atualiza regras de toggle (checkbox)
  // =================================================
  public setToggleRule(key: string, value: boolean) {
    this.toggleRules[key] = value;
    this.save();
  }

  // =================================================
  // 🔧 Atualiza regras personalizadas (JSON)
  // =================================================
  public setCustomRules(obj: RuleSet) {
    this.customRules = obj;
    this.save();
  }

  // =====================================================
  // 📤 Retorna TODAS as regras combinadas
  // =====================================================
  public getRules(): RuleSet {
    return {
      ...this.defaultRules,
      ...this.toggleRules,
      ...this.customRules,
    };
  }

  // ==================================================
  // 📄 Gera o texto final para enviar no prompt da IA
  // ==================================================
  public getRulesAsText(): string {
    const rules = this.getRules();

    return Object.entries(rules)
      .filter(([_, v]) => v !== false) // só envia regras ativas
      .map(([key, value]) => {
        if (typeof value === "boolean") return `- ${key}`;
        return `- ${key}: ${value}`;
      })
      .join("\n");
  }

  // ==============================================
  // 🔢 Contador para UI
  // ==============================================
  public countActiveRules(): number {
    const rules = this.getRules();
    return Object.values(rules).filter(v => v !== false).length;
  }

  // =================================================
  // 🔄 Reset para valores padrão
  // =================================================
  public reset() {
    this.toggleRules = {
      preferTypescript: false,
      preferCleanCode: true,
      explainLikeTeacher: false,
      simpleLanguage: false,
      showAlternativeSolutions: false,
      optimizePerformance: false,
      autoDetectLanguage: true,
    };

    this.customRules = {};
    this.save();
  }
}