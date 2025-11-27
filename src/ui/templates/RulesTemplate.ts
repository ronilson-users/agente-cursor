import { RuleManager } from '../../services/RuleManager';

export class RulesTemplate {
  static render(ruleManager: RuleManager): string {
    const rules = ruleManager.getRules();
    const activeCount = ruleManager.countActiveRules();

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
          <textarea id="custom-rules-json" placeholder='{"exemplo": "valor"}' rows="4" class="w-full p-2 rounded border text-sm font-mono">${JSON.stringify(rules.customRules || {}, null, 2)}</textarea>
          <button id="save-custom-rules" class="btn-primary w-full mt-2">Aplicar Regras Customizadas</button>
        </div>
      </div>
    `;
  }
}