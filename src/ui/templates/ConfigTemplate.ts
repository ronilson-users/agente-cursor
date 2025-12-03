import { DOMUtils } from '../../utils/DOMUtils';
import { PluginSettings } from '../../types';

export class ConfigTemplate {
  static render(settings: PluginSettings): string {
    return `
    
    <div class="config-container scroll">
      <div class="sections">
        <h3 class="config-title">Configurações de API</h3>

        <div class="config-section">
        
          <label for="user-name" class="block ">Como gosta de ser chamado:
          </label>
          
          <input type="text" id="user-name" placeholder="Seu nome ou apelido..." value="${DOMUtils.escapeHtml(settings.userName || '')}" class="config-input">
          
          <small class="text-muted">Este nome será usado nas saudações
          </small>
        </div>

        <div class="config-section ">
        
          <label for="api-provider" class="block ">Provedor:
          </label>
          <select id="api-provider" class="config-select">
            <option value="openai" ${settings.provider === 'openai' ? 'selected' : ''}>OpenAI</option>
            <option value="gemini" ${settings.provider === 'gemini' ? 'selected' : ''}>Gemini</option>
            <option value="deepseek" ${settings.provider === 'deepseek' ? 'selected' : ''}>DeepSeek</option>
            <option value="claude" ${settings.provider === 'claude' ? 'selected' : ''}>Claude</option>
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
            <option value="gpt-4" ${settings.model === 'gpt-4' ? 'selected' : ''}>GPT-4</option>
            <option value="gpt-3.5-turbo" ${settings.model === 'gpt-3.5-turbo' ? 'selected' : ''}>GPT-3.5 Turbo</option>
            <option value="gemini-pro" ${settings.model === 'gemini-pro' ? 'selected' : ''}>Gemini Pro</option>
            <option value="deepseek-coder" ${settings.model === 'deepseek-coder' ? 'selected' : ''}>DeepSeek Coder</option>
            <option value="gpt-4o-mini" ${settings.model === 'gpt-4o-mini' ? 'selected' : ''}>gpt-4o-mini</option>
          </select>
        </div>

        <div class="config-section ">
          <label for="temperature" class="block ">Temperatura: <span id="temp-value">${settings.temperature || 0.7}</span></label>
          
          <input type="range" id="temperature" min="0" max="1" step="0.1" value="${settings.temperature || 0.7}" class="config-slider">
        </div>

        <div class="config-actions ">
          <button id="test-api" class="btn-secondary">Testar API
          </button>
          
          <button id="save-config" class="btn-primary">Salvar
          
          </button>
        </div>
      </div>
      </div>
    `;
  }
}