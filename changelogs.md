# ChangeLogs




<div class="p-2">
<h3 class="font-bold mb-2">Agente IA DeepSeek</h3>
<div class="scroll" style="max-height: 400px; overflow-y: auto;">
<!-- Configuração API Key -->
<div class="mb-3">
<label class="block text-sm font-medium mb-1">API Key DeepSeek:</label>
<input 
type="password" 
id="deepseek-api-key" 
value="${this.apiKey}"
placeholder="Digite sua API Key"
class="w-full p-1 border rounded text-sm"
>
<button class="btn primary block w-full mt-1" id="save-api-key">
Salvar API Key
</button>
</div>

<!-- Ações Rápidas -->
<div class="space-y-2">
<button class="btn primary block w-full" id="btn-generate-code">
Gerar Código
</button>
<button class="btn secondary block w-full" id="btn-correct-code">
Corrigir Código
</button>
<button class="btn secondary block w-full" id="btn-explain-code">
Explicar Código
</button>
<button class="btn secondary block w-full" id="btn-refactor-code">
Refatorar Código
</button>
</div>

<!-- Status -->
<div class="mt-3 p-2 border rounded text-xs">
<div id="api-status" class="${this.apiKey ? 'text-success' : 'text-error'}">
Status: ${this.apiKey ? 'Conectado' : 'Não configurado'}
</div>
</div>
</div>
</div>


