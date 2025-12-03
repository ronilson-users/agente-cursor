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
          <span>${label}</span>
          <label class="toggle-switch">
            <input type="checkbox" data-rule="${key}" ${rules[key] ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        </div>
        
      `).join('');

    return `
      <div class="rules-container scroll">
       
        <div class="rules-status">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>Regras ativas: <strong>
            
            ${activeCount}
            
            </strong></span>
            <button id="reset-rules" class="btn ">Resetar</button>
          </div>
        </div>
        <div class="toggle-rules">
          <h4>Regras Configuráveis</h4>
          <div>
          
            ${togglesHtml}
            
            
          </div>
          
        </div>
        <div class="custom-rules">
          <h4 class="font">Regras Personalizadas (JSON)</h4>
          <textarea id="custom-rules-json" placeholder='{"exemplo": "valor"}' rows="4" class="w-full ">
          
          ${JSON.stringify(rules.customRules || {}, null, 2)}
          </textarea>
          <button id="save-custom-rules" class="btn-primary ">Aplicar Regras Customizadas</button>
        </div>
      </div>
    `;
  }
}