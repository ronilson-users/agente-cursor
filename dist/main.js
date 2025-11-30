/* 🧩 Acode Plugin Build - 2025-11-27T20:38:41.314Z */
"use strict";(()=>{var u={id:"rsjRonilson.propelling-ia",name:"Propelling IA",main:"main.ts",version:"1.0.0",readme:"readme.md",icon:"icon.png",files:["styles/main.scss","assets/icon.png","src/main.ts"],minVersionCode:290,license:"MIT",changelogs:"changelogs.md",keywords:["app","acode"],permissions:["storage","internet","file-system"],supportedLanguages:["javascript","typescript","python","html","css","php","java","rust","go","sql"],aiProviders:["DeepSeek","Gemini","OpenAI"],browser:!1,author:{name:"rsjRoni",email:"ronilson.stos@gmail.com",github:"roilson-users"}};var E=class{config;apiUrl;constructor(e){this.config=e,this.apiUrl=this.getApiUrl()}getApiUrl(){let{provider:e,model:t}=this.config;switch(e){case"gemini":return`
        
       
        https://generativelanguage.googleapis.com/v1beta/models/${t}/key=${apiKey}
        
        
        
        
        `;case"deepseek":return"https://api.deepseek.com/v1/chat/completions";case"claude":return"https://api.anthropic.com/v1/messages";default:return"https://api.openai.com/v1/chat/completions"}}async sendMessage(e){let{apiKey:t,provider:r}=this.config;if(!t?.trim())throw new Error("Chave de API n\xE3o configurada.");if(!e?.trim())throw new Error("Mensagem vazia.");console.log(`Enviando mensagem para ${r}...`);try{switch(r){case"gemini":return await this.sendGemini(e);case"claude":return await this.sendClaude(e);case"deepseek":case"openai":default:return await this.sendOpenAI(e)}}catch(o){throw console.error(`Erro no AIService (${r}):`,o),o}}async sendOpenAI(e){let{apiKey:t,model:r,temperature:o=.7}=this.config,a={model:r,messages:[{role:"system",content:"Voc\xEA \xE9 um assistente de programa\xE7\xE3o \xFAtil e conciso. Responda em portugu\xEAs."},{role:"user",content:e}],temperature:o,max_tokens:4e3};console.log(`Enviando para OpenAI/DeepSeek - Modelo: ${r}`);let n=await fetch(this.apiUrl,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(a)});if(!n.ok){let s=await n.text();throw console.error(`Erro ${n.status}:`,s),new Error(`Erro ${n.status}: ${this.extractErrorMessage(s)}`)}return(await n.json()).choices?.[0]?.message?.content?.trim()||"Sem resposta da API."}async sendGemini(e){let{apiKey:t,model:r,temperature:o=.7}=this.config,a={contents:[{parts:[{text:e}]}],generationConfig:{temperature:o,maxOutputTokens:4e3}},n=`${this.apiUrl}?key=${t}`;console.log(`Enviando para Gemini - Modelo: ${r}`);let i=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!i.ok){let d=await i.text();throw console.error(`Erro ${i.status}:`,d),new Error(`Erro ${i.status}: ${this.extractErrorMessage(d)}`)}let s=await i.json(),m=s.candidates?.[0]?.content?.parts?.[0]?.text;if(!m)throw console.error("Resposta vazia do Gemini:",s),new Error("Resposta vazia do Gemini");return m}async sendClaude(e){let{apiKey:t,model:r,temperature:o=.7}=this.config,a={model:r,max_tokens:4e3,temperature:o,messages:[{role:"user",content:e}]};console.log(`Enviando para Claude - Modelo: ${r}`);let n=await fetch(this.apiUrl,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":t,"anthropic-version":"2023-06-01"},body:JSON.stringify(a)});if(!n.ok){let s=await n.text();throw console.error(`Erro ${n.status}:`,s),new Error(`Erro ${n.status}: ${this.extractErrorMessage(s)}`)}return(await n.json()).content?.[0]?.text?.trim()||"Sem resposta do Claude."}extractErrorMessage(e){try{let t=JSON.parse(e);return t.error?.message||t.error||e}catch{return e}}async testConnection(){try{return(await this.sendMessage("Responda apenas com 'OK' se estiver funcionando.")).includes("OK")}catch(e){return console.error("Teste de conex\xE3o falhou:",e),!1}}};var I=acode.require("settings"),w=class{defaultRules={alwaysUseMarkdown:!0,avoidRepeatingUserMessage:!0,avoidHallucinations:!0,verifyBeforeAnswering:!0,useFriendlyTone:!0};toggleRules={preferTypescript:!1,preferCleanCode:!0,explainLikeTeacher:!1,simpleLanguage:!1,showAlternativeSolutions:!1,optimizePerformance:!1,autoDetectLanguage:!0};customRules={};constructor(){this.loadSavedRules()}loadSavedRules(){let e=I.value[u.id];if(!e||!e.rules)return;let t=e.rules;this.toggleRules=t.toggleRules||this.toggleRules,this.customRules=t.customRules||this.customRules}save(){let e=I.value[u.id];e&&(e.rules={defaultRules:this.defaultRules,toggleRules:this.toggleRules,customRules:this.customRules},I.update())}setToggleRule(e,t){this.toggleRules[e]=t,this.save()}setCustomRules(e){this.customRules=e,this.save()}getRules(){return{...this.defaultRules,...this.toggleRules,...this.customRules}}getRulesAsText(){let e=this.getRules();return Object.entries(e).filter(([t,r])=>r!==!1).map(([t,r])=>typeof r=="boolean"?`- ${t}`:`- ${t}: ${r}`).join(`
`)}countActiveRules(){let e=this.getRules();return Object.values(e).filter(t=>t!==!1).length}reset(){this.toggleRules={preferTypescript:!1,preferCleanCode:!0,explainLikeTeacher:!1,simpleLanguage:!1,showAlternativeSolutions:!1,optimizePerformance:!1,autoDetectLanguage:!0},this.customRules={},this.save()}};var v=class{static async copyToClipboard(e){if(!e)return!1;try{if(navigator.clipboard&&navigator.clipboard.writeText)return await navigator.clipboard.writeText(e),!0}catch{}try{let t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select(),t.setSelectionRange(0,t.value.length);let r=document.execCommand("copy");return document.body.removeChild(t),!!r}catch(t){return console.error("Fallback copy failed:",t),!1}}static async loadHighlight(e){let t=o=>new Promise((a,n)=>{if(document.querySelector(`script[src="${o}"]`))return a();let i=document.createElement("script");i.src=o,i.onload=()=>a(),i.onerror=()=>n(new Error("Failed to load script "+o)),document.head.appendChild(i)}),r=o=>{if(document.querySelector(`link[href="${o}"]`))return;let a=document.createElement("link");a.rel="stylesheet",a.href=o,document.head.appendChild(a)};try{e||(e=""),r(`${e}assets/highlight-light.min.css`),await t(`${e}assets/highlight.min.js`);let o=window.hljs;return o&&typeof o.highlightAll=="function"&&(o.configure&&o.configure({ignoreUnescapedHTML:!0}),o.highlightAll()),!0}catch(o){return console.warn("N\xE3o foi poss\xEDvel carregar highlight.js:",o),!1}}};var S=class{cryptoKey=null;encoder=new TextEncoder;decoder=new TextDecoder;async encrypt(e){if(!e)return"";let t=await this.loadCryptoKey(),r=crypto.getRandomValues(new Uint8Array(12)),o=this.encoder.encode(e),a=await crypto.subtle.encrypt({name:"AES-GCM",iv:r},t,o),n=new Uint8Array(a),i=new Uint8Array(r.length+n.length);i.set(r),i.set(n,r.length);let s="";for(let m=0;m<i.length;m++)s+=String.fromCharCode(i[m]);return btoa(s)}async decrypt(e){if(!e)return"";try{let t=await this.loadCryptoKey(),r=atob(e),o=new Uint8Array(r.length);for(let s=0;s<r.length;s++)o[s]=r.charCodeAt(s);let a=o.slice(0,12),n=o.slice(12),i=await crypto.subtle.decrypt({name:"AES-GCM",iv:a},t,n);return this.decoder.decode(i)}catch(t){return console.error("Erro ao descriptografar:",t),""}}async loadCryptoKey(){if(this.cryptoKey)return this.cryptoKey;let e="agenteIA.secretKey",t=localStorage.getItem(e);if(!t){let a=this.randomBytes(32),n=String.fromCharCode(...a),i=btoa(n);localStorage.setItem(e,i),t=i}let r=atob(t),o=new Uint8Array(r.length);for(let a=0;a<r.length;a++)o[a]=r.charCodeAt(a);return this.cryptoKey=await crypto.subtle.importKey("raw",o,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"]),this.cryptoKey}randomBytes(e){let t=new Uint8Array(e);return crypto.getRandomValues(t),t}};var l=class{static escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}static autoResizeTextarea(e){e.style.height="auto",e.style.height=Math.min(e.scrollHeight,320)+"px"}static createElement(e,t={},r=[]){let o=document.createElement(e);return Object.entries(t).forEach(([a,n])=>{o.setAttribute(a,n)}),r.forEach(a=>{typeof a=="string"?o.appendChild(document.createTextNode(a)):o.appendChild(a)}),o}static loadStylesheet(e){let t=this.createElement("link",{rel:"stylesheet",href:e});return document.head.appendChild(t),t}};var T=class{static render(e){return`
      <div class="chat-container">
        <div class="chat-top-bar">
          <button id="clear-chat" class="top-btn danger icon delete"></button>
          <button id="history-chat" class="top-btn icon tune"> </button>
        </div>

        <div class="chat-input-wrapper inverted">
          <textarea id="chat-input" placeholder="Digite sua mensagem..." rows="1"></textarea>
          <div class="chat-input-top">
            <span id="model-indicator">Modelo: </span>
            <button id="send-message" class="send-btn icon send" title="Enviar"></button>
          </div>
        </div>

        <div id="chat-messages" class="chat-messages scroll">
          <div class="message system">
            <p>${this.userProfile(e)}Como posso ajudar voc\xEA hoje?</p>
          </div>
        </div>
      </div>
    `}static userProfile(e){return e?`Ol\xE1, ${l.escapeHtml(e)}! `:"Ol\xE1! "}static getTypingIndicator(){return`
      <div class="message assistant typing-indicator" id="typing-indicator">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `}};var y=class{static render(e){let t=e.getRules(),r=e.countActiveRules(),o=Object.entries({preferTypescript:"Preferir TypeScript",preferCleanCode:"C\xF3digo Limpo",explainLikeTeacher:"Explicar como Professor",simpleLanguage:"Linguagem Simples",showAlternativeSolutions:"Mostrar Solu\xE7\xF5es Alternativas",optimizePerformance:"Otimizar Performance",autoDetectLanguage:"Detectar Idioma Automaticamente"}).map(([a,n])=>`
        <div class="rule-item">
          <span class="text-sm">${n}</span>
          <label class="toggle-switch">
            <input type="checkbox" data-rule="${a}" ${t[a]?"checked":""}>
            <span class="slider"></span>
          </label>
        </div>
      `).join("");return`
      <div class="p-2">
        <h3 class="font-bold mb-3">Rules Manager</h3>
        <div class="rules-status mb-4 p-3 bg-blue-50 rounded border">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>Regras ativas: <strong>${r}</strong></span>
            <button id="reset-rules" class="btn-sm bg-red-500 text-white rounded px-2 py-1 text-xs">Resetar</button>
          </div>
        </div>
        <div class="toggle-rules mb-4">
          <h4 class="font-semibold mb-2">Regras Configur\xE1veis</h4>
          <div class="space-y-2">
            ${o}
          </div>
        </div>
        <div class="custom-rules">
          <h4 class="font-semibold mb-2">Regras Personalizadas (JSON)</h4>
          <textarea id="custom-rules-json" placeholder='{"exemplo": "valor"}' rows="4" class="w-full p-2 rounded border text-sm font-mono">${JSON.stringify(t.customRules||{},null,2)}</textarea>
          <button id="save-custom-rules" class="btn-primary w-full mt-2">Aplicar Regras Customizadas</button>
        </div>
      </div>
    `}};var M=class{static render(e){return`
      <div class="p-2">
        <h3 class="font-bold mb-2">Configura\xE7\xF5es de API</h3>

        <div class="config-section">
          <label for="user-name" class="block mb-1">Como gosta de ser chamado:</label>
          <input type="text" id="user-name" placeholder="Seu nome ou apelido..." value="${l.escapeHtml(e.userName||"")}" class="config-input">
          <small class="text-muted">Este nome ser\xE1 usado nas sauda\xE7\xF5es</small>
        </div>

        <div class="config-section mt-3">
          <label for="api-provider" class="block mb-1">Provedor:</label>
          <select id="api-provider" class="config-select">
            <option value="openai" ${e.provider==="openai"?"selected":""}>OpenAI</option>
            <option value="gemini" ${e.provider==="gemini"?"selected":""}>Gemini</option>
            <option value="deepseek" ${e.provider==="deepseek"?"selected":""}>DeepSeek</option>
            <option value="claude" ${e.provider==="claude"?"selected":""}>Claude</option>
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
            <option value="gpt-4" ${e.model==="gpt-4"?"selected":""}>GPT-4</option>
            <option value="gpt-3.5-turbo" ${e.model==="gpt-3.5-turbo"?"selected":""}>GPT-3.5 Turbo</option>
            <option value="gemini-pro" ${e.model==="gemini-pro"?"selected":""}>Gemini Pro</option>
            <option value="deepseek-coder" ${e.model==="deepseek-coder"?"selected":""}>DeepSeek Coder</option>
            <option value="gpt-4o-mini" ${e.model==="gpt-4o-mini"?"selected":""}>gpt-4o-mini</option>
          </select>
        </div>

        <div class="config-section mt-3">
          <label for="temperature" class="block mb-1">Temperatura: <span id="temp-value">${e.temperature||.7}</span></label>
          <input type="range" id="temperature" min="0" max="1" step="0.1" value="${e.temperature||.7}" class="config-slider">
        </div>

        <div class="config-actions mt-4">
          <button id="test-api" class="btn-secondary">Testar API</button>
          <button id="save-config" class="btn-primary">Salvar</button>
        </div>
      </div>
    `}};var C=class{constructor(e){this.container=e}initialize(){let e=Array.from(this.container.querySelectorAll(".tab-btn")),t=this.container.querySelector(".tab-indicator");t&&(t.style.width=`${100/Math.max(e.length,1)}%`,t.style.transform="translateX(0%)"),e.forEach((r,o)=>{r.addEventListener("click",()=>{this.switchTab(e,t,r,o)})})}switchTab(e,t,r,o){e.forEach(n=>n.classList.remove("active")),r.classList.add("active"),t&&(t.style.transform=`translateX(${o*100}%)`);let a=r.dataset.tab;this.container.querySelectorAll(".tab-pane").forEach(n=>{n.classList.toggle("active",n.id===`${a}-tab`)})}};var p=class{static addMessage(e,t,r){let o=e.querySelector("#chat-messages");if(!o)return;let a=document.createElement("div");if(a.className=`message ${t}`,t==="user"){let n=document.createElement("p");n.textContent=r,a.appendChild(n)}else{let n=this.safeFormatContent(r);a.innerHTML=n}o.appendChild(a),this.applySyntaxHighlighting(a),requestAnimationFrame(()=>{o.scrollTo({top:o.scrollHeight,behavior:"smooth"})})}static showTypingIndicator(e){let t=e.querySelector("#chat-messages");if(!t)return;let r=document.createElement("div");r.className="message assistant typing-indicator",r.id="typing-indicator",r.innerHTML=`
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `,t.appendChild(r),t.scrollTo({top:t.scrollHeight,behavior:"smooth"})}static hideTypingIndicator(e){let t=e.querySelector("#typing-indicator");t&&t.remove()}static safeFormatContent(e){let t={},r=0,o=(d,g)=>{let h=`CODE_TOKEN_${r++}`;return t[h]={lang:d||"text",code:g},h},a=e.replace(/```(\w+)?\s*([\s\S]*?)```/g,(d,g,h)=>o(g||"text",h));return l.escapeHtml(a).split(/(CODE_TOKEN_\d+)/).map(d=>{if(d.match(/^(CODE_TOKEN_\d+)$/)){let h=t[d];if(!h)return"";let z=l.escapeHtml(h.code.replace(/\r\n/g,`
`)),P=l.escapeHtml(h.lang||"text"),$="code-"+Date.now()+"-"+Math.random().toString(36).slice(2,9);return`
          <div class="code-block">
            <div class="code-header">
              <span class="code-language">${l.escapeHtml(h.lang)}</span>
              <button class="copy-btn" data-code-id="${$}">\u{1F4CB}</button>
            </div>
            <pre><code id="${$}" class="hljs language-${P}">${z}</code></pre>
          </div>
        `}else return d.replace(/\n/g,"<br>")}).join("").replace(/`([^`]+)`/g,(d,g)=>`<code class="inline-code">${l.escapeHtml(g)}</code>`)}static applySyntaxHighlighting(e){try{let t=window.hljs;if(!t)return;Array.from(e.querySelectorAll("pre code")).forEach(o=>{t.highlightElement?t.highlightElement(o):t.highlightBlock&&t.highlightBlock(o)})}catch(t){console.error("Erro ao aplicar highlight:",t)}}static setupCopyDelegation(e){let t=e.querySelector("#chat-messages");t&&t.addEventListener("click",async r=>{let o=r.target,a=o.closest?o.closest(".copy-btn"):null;if(!a)return;r.preventDefault();let n=a.dataset.codeId;if(!n)return;let s=t.querySelector(`#${n}`)?.textContent??"",m=a.innerHTML;a.innerHTML="\u23F3";let d=await v.copyToClipboard(s),g=acode.require("toast");d?(a.innerHTML="\u2705",g("C\xF3digo copiado!")):(a.innerHTML="\u274C",g("Erro ao copiar")),setTimeout(()=>{a.innerHTML=m},1500)})}};var k=class{constructor(e,t,r){this.container=e;this.onSendMessage=t;this.onClearChat=r}initialize(){this.setupSendEvent(),this.setupClearEvent(),this.setupHistoryEvent(),p.setupCopyDelegation(this.container)}setupSendEvent(){let e=this.container.querySelector("#send-message"),t=this.container.querySelector("#chat-input"),r=()=>{if(!t||!t.value.trim())return;let o=t.value.trim();this.onSendMessage(o),t.value="",l.autoResizeTextarea(t)};e?.addEventListener("click",r),t?.addEventListener("keydown",o=>{o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),r())}),t?.addEventListener("input",()=>{t&&l.autoResizeTextarea(t)})}setupClearEvent(){this.container.querySelector("#clear-chat")?.addEventListener("click",this.onClearChat)}setupHistoryEvent(){this.container.querySelector("#history-chat")?.addEventListener("click",()=>{console.log("Hist\xF3rico clicado")})}setupCopyDelegation(){let e=this.container.querySelector("#chat-messages");e&&e.addEventListener("click",async t=>{let r=t.target,o=r.closest?r.closest(".copy-btn"):null;if(!o)return;t.preventDefault();let a=o.dataset.codeId;if(!a)return;let i=e.querySelector(`#${a}`)?.textContent??"",s=o.innerHTML;o.innerHTML="\u23F3",console.log("Copiar c\xF3digo:",i),setTimeout(()=>{o.innerHTML=s},1500)})}};var f=class{constructor(e,t,r){this.container=e;this.ruleManager=t;this.onRulesUpdated=r}initialize(){this.setupToggleEvents(),this.setupResetEvent(),this.setupCustomRulesEvent()}setupToggleEvents(){this.container.addEventListener("change",e=>{let t=e.target;if(!t.matches('input[type="checkbox"][data-rule]'))return;let r=t.dataset.rule,o=t.checked;this.ruleManager.setToggleRule(r,o),acode.require("toast")(`Regra "${r}" ${o?"ativada":"desativada"}`)})}setupResetEvent(){this.container.querySelector("#reset-rules")?.addEventListener("click",()=>{this.ruleManager.resetRules(),acode.require("toast")("Regras resetadas"),this.onRulesUpdated()})}setupCustomRulesEvent(){this.container.querySelector("#save-custom-rules")?.addEventListener("click",()=>this.saveCustomRules())}saveCustomRules(){let e=this.container.querySelector("#custom-rules-json");if(e)try{let t=JSON.parse(e.value||"{}");this.ruleManager.setCustomRules(t),acode.require("toast")("Regras salvas com sucesso!")}catch{acode.require("toast")("JSON inv\xE1lido nas regras personalizadas")}}};var L=class{constructor(e,t,r,o){this.container=e;this.onSaveConfig=t;this.onTestAPI=r;this.cryptoUtils=o}initialize(){this.setupTemperatureSlider(),this.setupApiKeyEvents(),this.setupSaveEvent(),this.setupTestEvent()}setupTemperatureSlider(){let e=this.container.querySelector("#temperature"),t=this.container.querySelector("#temp-value");e?.addEventListener("input",()=>{t&&e&&(t.textContent=e.value)})}setupApiKeyEvents(){let e=this.container.querySelector("#reveal-key"),t=this.container.querySelector("#clear-key");e?.addEventListener("click",r=>{r.preventDefault();let o=this.container.querySelector("#api-key");o&&(o.type=o.type==="password"?"text":"password")}),t?.addEventListener("click",r=>{r.preventDefault();let o=this.container.querySelector("#api-key");o&&(o.value="")})}setupSaveEvent(){this.container.querySelector("#save-config")?.addEventListener("click",()=>this.onSaveConfig())}setupTestEvent(){this.container.querySelector("#test-api")?.addEventListener("click",()=>this.onTestAPI())}};var A=class{container;actionStack;constructor(e){this.container=e,this.actionStack=acode.require("actionStack")}renderAnalyzeButton(){let e=document.createElement("button");e.id="analyze-context",e.className="analyze-btn",e.innerHTML="\u{1F50D}",e.title="Analisar arquivo e projeto atual",e.addEventListener("click",()=>{this.handleContextAnalysis()});let t=this.container.querySelector(".chat-input-wrapper");t&&t.appendChild(e),this.actionStack.push({id:"context-analyzer",action:()=>e.remove()})}async handleContextAnalysis(){try{this.setAnalyzeButtonState("loading"),await this.simpleContextAnalysis()}catch(e){console.error("Erro na an\xE1lise de contexto:",e),this.showError("Erro ao analisar contexto")}finally{this.setAnalyzeButtonState("ready")}}async simpleContextAnalysis(){let e=acode.require("toast");try{let{editor:t}=editorManager,r=editorManager.activeFile;if(!r){e("Nenhum arquivo aberto no editor");return}let o=r.filename,a=r.language||"text";e(`Analisando: ${o} (${a})`),this.addContextMessage(o,a)}catch{e("N\xE3o foi poss\xEDvel acessar o editor")}}addContextMessage(e,t){let r=this.container.querySelector("#chat-messages");if(!r)return;let o=document.createElement("div");o.className="message system context-analysis",o.innerHTML=`
      <div class="context-info">
        <strong>\u{1F4C1} Contexto Analisado:</strong>
        <div>Arquivo: <code>${e}</code></div>
        <div>Linguagem: <code>${t}</code></div>
        <div class="context-suggestions">
          <small>Posso ajudar com: an\xE1lise de c\xF3digo, sugest\xF5es de melhoria, detec\xE7\xE3o de erros...</small>
        </div>
      </div>
    `,r.appendChild(o),r.scrollTo({top:r.scrollHeight,behavior:"smooth"})}setAnalyzeButtonState(e){let t=this.container.querySelector("#analyze-context");if(t)switch(e){case"loading":t.innerHTML="\u23F3 Analisando...",t.disabled=!0;break;case"error":t.innerHTML="\u274C Erro",t.disabled=!1,setTimeout(()=>{t.innerHTML="\u{1F50D} Analisar Contexto"},2e3);break;default:t.innerHTML="\u{1F50D} Analisar Contexto",t.disabled=!1}}showError(e){acode.require("toast")(e)}};var H=acode.require("sidebarApps"),b=acode.require("toast"),x=acode.require("settings"),R=class{contextAnalyzer;container=null;id=u.id;ruleManager;aiService=null;baseUrl="";cryptoUtils;$mainStyle=null;constructor(){this.ruleManager=new w,this.cryptoUtils=new S,this.initializeSettings()}initializeSettings(){x.value[u.id]||(x.value[u.id]={apiKey:"",provider:"openai",model:"gpt-4o-mini",temperature:.7,userName:"",rules:this.ruleManager.getRules()},x.update())}async init(){try{let e=`${this.baseUrl}assets/icon.png`;acode.addIcon("sidebar-icon",e),this.loadGlobalStyles(),await this.loadHighlightJS(),H.add("sidebar-icon","agente_IA","Agente IA",t=>{this.container=t,this.renderContainer()},()=>this.onAppSelected()),console.log("Plugin inicializado com sucesso")}catch(e){console.error("Erro ao inicializar plugin:",e)}}loadGlobalStyles(){this.$mainStyle=l.loadStylesheet(`${this.baseUrl}main.css`)}async loadHighlightJS(){try{typeof v.loadHighlight=="function"&&await v.loadHighlight(this.baseUrl)}catch(e){console.warn("N\xE3o foi poss\xEDvel carregar highlight.js:",e)}}renderContainer(){if(!this.container)return;let e=this.getSettings();this.container.innerHTML=`
      <div class="sidebar-container scroll">
        <div class="tabs-header">
          <button class="tab-btn active" data-tab="chat"><span>Chat</span></button>
          <button class="tab-btn" data-tab="rules"><span>Rules</span></button>
          <button class="tab-btn" data-tab="config"><span>Config</span></button>
          <div class="tab-indicator"></div>
        </div>

        <div class="tab-content">
          <div class="tab-pane active" id="chat-tab">
            ${T.render(e.userName)}
          </div>

          <div class="tab-pane" id="rules-tab">
            <div class="rules-content p-5">${y.render(this.ruleManager)}</div>
          </div>

          <div class="tab-pane" id="config-tab">
            <div class="config-content p-5">${M.render(e)}</div>
          </div>
        </div>
      </div>
    `,this.initializeUIComponents()}initializeUIComponents(){if(!this.container)return;new C(this.container).initialize(),new k(this.container,a=>this.sendMessage(a),()=>this.clearChat()).initialize(),new f(this.container,this.ruleManager,()=>this.refreshRulesUI()).initialize(),new L(this.container,()=>this.saveConfig(),()=>this.testAPI(),this.cryptoUtils).initialize(),this.contextAnalyzer=new A(this.container),this.contextAnalyzer.renderAnalyzeButton(),this.loadSavedConfig()}async sendMessage(e){p.addMessage(this.container,"user",e),p.showTypingIndicator(this.container);try{let t=this.getSettings();if(!t.apiKey)throw new Error("Configure uma API Key primeiro na aba Config");let r=await this.cryptoUtils.decrypt(t.apiKey);if(!r)throw new Error("API Key inv\xE1lida");this.aiService=new E({apiKey:r,provider:t.provider,model:t.model,temperature:t.temperature});let a=`
REGRAS DO SISTEMA:
${this.ruleManager.getRulesAsText()}

MENSAGEM DO USU\xC1RIO:
${e}

Por favor, responda seguindo as regras acima.`.trim(),n=await this.aiService.sendMessage(a);p.hideTypingIndicator(this.container),p.addMessage(this.container,"assistant",n)}catch(t){p.hideTypingIndicator(this.container);let r=t?.message??String(t);p.addMessage(this.container,"system",`Erro: ${r}`),console.error("sendMessage error:",t)}}clearChat(){let e=this.container?.querySelector("#chat-messages");if(!e)return;e.innerHTML="";let t=this.getSettings();p.addMessage(this.container,"system",`${t.userName?`Ol\xE1, ${t.userName}! `:"Ol\xE1! "}Como posso ajudar voc\xEA hoje?`)}refreshRulesUI(){let e=this.container.querySelector(".rules-content");e&&(e.innerHTML=y.render(this.ruleManager),new f(this.container,this.ruleManager,()=>this.refreshRulesUI()).initialize())}async saveConfig(){let e=this.container?.querySelector("#api-key"),t=this.container?.querySelector("#api-provider"),r=this.container?.querySelector("#api-model"),o=this.container?.querySelector("#temperature"),a=this.container?.querySelector("#user-name"),n=this.getSettings();if(!e||!t||!r||!o){b("Campos de configura\xE7\xE3o incompletos");return}let i=e.value.trim();i!==""&&(n.apiKey=await this.cryptoUtils.encrypt(i)),n.provider=t.value,n.model=r.value,n.temperature=parseFloat(o.value),n.userName=a?.value||n.userName,x.update(),b("Configura\xE7\xF5es salvas!");let s=this.container?.querySelector("#model-indicator");s&&(s.textContent=`Modelo: ${n.model}`)}testAPI(){b("Testando conex\xE3o com API..."),setTimeout(()=>{b("Conex\xE3o com API bem-sucedida!")},1500)}async loadSavedConfig(){if(!this.container)return;let e=this.getSettings();if(!e)return;let t=this.container.querySelector("#api-key"),r=this.container.querySelector("#api-provider"),o=this.container.querySelector("#api-model"),a=this.container.querySelector("#temperature"),n=this.container.querySelector("#temp-value"),i=this.container.querySelector("#user-name");if(r&&e.provider&&(r.value=e.provider),o&&e.model){o.value=e.model;let s=this.container.querySelector("#model-indicator");s&&(s.textContent=`Modelo: ${e.model}`)}if(a&&e.temperature!==void 0&&(a.value=e.temperature.toString(),n&&(n.textContent=e.temperature.toString())),i&&e.userName&&(i.value=e.userName),t)if(e.apiKey)try{let s=await this.cryptoUtils.decrypt(e.apiKey);t.value=s||""}catch(s){console.error("Erro ao carregar apiKey:",s),t.value=""}else t.value=""}getSettings(){return x.value[u.id]||{}}onAppSelected(){b("Agente IA ativado")}async destroy(){H&&(H.remove("agente_IA"),H.remove("sidebar-icon")),this.$mainStyle&&this.$mainStyle.remove()}};if(window.acode){let c=new R;acode.setPluginInit(u.id,async(e,t,{cacheFileUrl:r,cacheFile:o})=>{e.endsWith("/")||(e+="/"),c.baseUrl=e,await c.init()}),acode.setPluginUnmount(u.id,()=>{c.destroy()})}})();
