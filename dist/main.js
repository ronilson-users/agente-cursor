/* 🧩 Acode Plugin Build - 2025-11-29T22:08:01.640Z */
"use strict";(()=>{var u={id:"rsjRonilson.propelling-ia",name:"Propelling IA",main:"main.ts",version:"1.0.0",readme:"readme.md",icon:"icon.png",files:["styles/main.scss","assets/icon.png","src/main.ts"],minVersionCode:290,license:"MIT",changelogs:"changelogs.md",keywords:["app","acode"],permissions:["storage","internet","file-system"],supportedLanguages:["javascript","typescript","python","html","css","php","java","rust","go","sql"],aiProviders:["DeepSeek","Gemini","OpenAI"],browser:!1,author:{name:"rsjRoni",email:"ronilson.stos@gmail.com",github:"roilson-users"}};var E=class{config;apiUrl;constructor(e){this.config=e,this.apiUrl=this.getApiUrl()}getApiUrl(){let{provider:e,model:t}=this.config;switch(e){case"gemini":return`
        
       
        https://generativelanguage.googleapis.com/v1beta/models/${t}/key=${apiKey}
        
        
        
        
        `;case"deepseek":return"https://api.deepseek.com/v1/chat/completions";case"claude":return"https://api.anthropic.com/v1/messages";default:return"https://api.openai.com/v1/chat/completions"}}async sendMessage(e){let{apiKey:t,provider:o}=this.config;if(!t?.trim())throw new Error("Chave de API n\xE3o configurada.");if(!e?.trim())throw new Error("Mensagem vazia.");console.log(`Enviando mensagem para ${o}...`);try{switch(o){case"gemini":return await this.sendGemini(e);case"claude":return await this.sendClaude(e);case"deepseek":case"openai":default:return await this.sendOpenAI(e)}}catch(r){throw console.error(`Erro no AIService (${o}):`,r),r}}async sendOpenAI(e){let{apiKey:t,model:o,temperature:r=.7}=this.config,a={model:o,messages:[{role:"system",content:"Voc\xEA \xE9 um assistente de programa\xE7\xE3o \xFAtil e conciso. Responda em portugu\xEAs."},{role:"user",content:e}],temperature:r,max_tokens:4e3};console.log(`Enviando para OpenAI/DeepSeek - Modelo: ${o}`);let n=await fetch(this.apiUrl,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify(a)});if(!n.ok){let s=await n.text();throw console.error(`Erro ${n.status}:`,s),new Error(`Erro ${n.status}: ${this.extractErrorMessage(s)}`)}return(await n.json()).choices?.[0]?.message?.content?.trim()||"Sem resposta da API."}async sendGemini(e){let{apiKey:t,model:o,temperature:r=.7}=this.config,a={contents:[{parts:[{text:e}]}],generationConfig:{temperature:r,maxOutputTokens:4e3}},n=`${this.apiUrl}?key=${t}`;console.log(`Enviando para Gemini - Modelo: ${o}`);let i=await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!i.ok){let d=await i.text();throw console.error(`Erro ${i.status}:`,d),new Error(`Erro ${i.status}: ${this.extractErrorMessage(d)}`)}let s=await i.json(),g=s.candidates?.[0]?.content?.parts?.[0]?.text;if(!g)throw console.error("Resposta vazia do Gemini:",s),new Error("Resposta vazia do Gemini");return g}async sendClaude(e){let{apiKey:t,model:o,temperature:r=.7}=this.config,a={model:o,max_tokens:4e3,temperature:r,messages:[{role:"user",content:e}]};console.log(`Enviando para Claude - Modelo: ${o}`);let n=await fetch(this.apiUrl,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":t,"anthropic-version":"2023-06-01"},body:JSON.stringify(a)});if(!n.ok){let s=await n.text();throw console.error(`Erro ${n.status}:`,s),new Error(`Erro ${n.status}: ${this.extractErrorMessage(s)}`)}return(await n.json()).content?.[0]?.text?.trim()||"Sem resposta do Claude."}extractErrorMessage(e){try{let t=JSON.parse(e);return t.error?.message||t.error||e}catch{return e}}async testConnection(){try{return(await this.sendMessage("Responda apenas com 'OK' se estiver funcionando.")).includes("OK")}catch(e){return console.error("Teste de conex\xE3o falhou:",e),!1}}};var I=acode.require("settings"),w=class{defaultRules={alwaysUseMarkdown:!0,avoidRepeatingUserMessage:!0,avoidHallucinations:!0,verifyBeforeAnswering:!0,useFriendlyTone:!0};toggleRules={preferTypescript:!1,preferCleanCode:!0,explainLikeTeacher:!1,simpleLanguage:!1,showAlternativeSolutions:!1,optimizePerformance:!1,autoDetectLanguage:!0};customRules={};constructor(){this.loadSavedRules()}loadSavedRules(){let e=I.value[u.id];if(!e||!e.rules)return;let t=e.rules;this.toggleRules=t.toggleRules||this.toggleRules,this.customRules=t.customRules||this.customRules}save(){let e=I.value[u.id];e&&(e.rules={defaultRules:this.defaultRules,toggleRules:this.toggleRules,customRules:this.customRules},I.update())}setToggleRule(e,t){this.toggleRules[e]=t,this.save()}setCustomRules(e){this.customRules=e,this.save()}getRules(){return{...this.defaultRules,...this.toggleRules,...this.customRules}}getRulesAsText(){let e=this.getRules();return Object.entries(e).filter(([t,o])=>o!==!1).map(([t,o])=>typeof o=="boolean"?`- ${t}`:`- ${t}: ${o}`).join(`
`)}countActiveRules(){let e=this.getRules();return Object.values(e).filter(t=>t!==!1).length}reset(){this.toggleRules={preferTypescript:!1,preferCleanCode:!0,explainLikeTeacher:!1,simpleLanguage:!1,showAlternativeSolutions:!1,optimizePerformance:!1,autoDetectLanguage:!0},this.customRules={},this.save()}};var f=class{static async copyToClipboard(e){if(!e)return!1;try{if(navigator.clipboard&&navigator.clipboard.writeText)return await navigator.clipboard.writeText(e),!0}catch{}try{let t=document.createElement("textarea");t.value=e,t.style.position="fixed",t.style.left="-9999px",document.body.appendChild(t),t.select(),t.setSelectionRange(0,t.value.length);let o=document.execCommand("copy");return document.body.removeChild(t),!!o}catch(t){return console.error("Fallback copy failed:",t),!1}}static async loadHighlight(e){let t=r=>new Promise((a,n)=>{if(document.querySelector(`script[src="${r}"]`))return a();let i=document.createElement("script");i.src=r,i.onload=()=>a(),i.onerror=()=>n(new Error("Failed to load script "+r)),document.head.appendChild(i)}),o=r=>{if(document.querySelector(`link[href="${r}"]`))return;let a=document.createElement("link");a.rel="stylesheet",a.href=r,document.head.appendChild(a)};try{e||(e=""),o(`${e}assets/highlight-light.min.css`),await t(`${e}assets/highlight.min.js`);let r=window.hljs;return r&&typeof r.highlightAll=="function"&&(r.configure&&r.configure({ignoreUnescapedHTML:!0}),r.highlightAll()),!0}catch(r){return console.warn("N\xE3o foi poss\xEDvel carregar highlight.js:",r),!1}}};var S=class{cryptoKey=null;encoder=new TextEncoder;decoder=new TextDecoder;async encrypt(e){if(!e)return"";let t=await this.loadCryptoKey(),o=crypto.getRandomValues(new Uint8Array(12)),r=this.encoder.encode(e),a=await crypto.subtle.encrypt({name:"AES-GCM",iv:o},t,r),n=new Uint8Array(a),i=new Uint8Array(o.length+n.length);i.set(o),i.set(n,o.length);let s="";for(let g=0;g<i.length;g++)s+=String.fromCharCode(i[g]);return btoa(s)}async decrypt(e){if(!e)return"";try{let t=await this.loadCryptoKey(),o=atob(e),r=new Uint8Array(o.length);for(let s=0;s<o.length;s++)r[s]=o.charCodeAt(s);let a=r.slice(0,12),n=r.slice(12),i=await crypto.subtle.decrypt({name:"AES-GCM",iv:a},t,n);return this.decoder.decode(i)}catch(t){return console.error("Erro ao descriptografar:",t),""}}async loadCryptoKey(){if(this.cryptoKey)return this.cryptoKey;let e="agenteIA.secretKey",t=localStorage.getItem(e);if(!t){let a=this.randomBytes(32),n=String.fromCharCode(...a),i=btoa(n);localStorage.setItem(e,i),t=i}let o=atob(t),r=new Uint8Array(o.length);for(let a=0;a<o.length;a++)r[a]=o.charCodeAt(a);return this.cryptoKey=await crypto.subtle.importKey("raw",r,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"]),this.cryptoKey}randomBytes(e){let t=new Uint8Array(e);return crypto.getRandomValues(t),t}};var l=class{static escapeHtml(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}static autoResizeTextarea(e){e.style.height="auto",e.style.height=Math.min(e.scrollHeight,320)+"px"}static createElement(e,t={},o=[]){let r=document.createElement(e);return Object.entries(t).forEach(([a,n])=>{r.setAttribute(a,n)}),o.forEach(a=>{typeof a=="string"?r.appendChild(document.createTextNode(a)):r.appendChild(a)}),r}static loadStylesheet(e){let t=this.createElement("link",{rel:"stylesheet",href:e});return document.head.appendChild(t),t}};var T=class{static render(e){return`
      <div class="chat-container">
      
      <div class="chat-top-bar">
      
        <button id="clear-chat" class="top-btn danger icon delete">
        </button>
        <button id="history-chat" class="top-btn icon tune"> 
        </button>
        
      </div>

      <div class="chat-input-wrapper">
       
       <textarea id="chat-input" placeholder="Digite sua mensagem..." rows="4">
       </textarea>
       
      <div class="chat-bar-actions">
      
    <div id="model-indicator">Modelo: gpt-4</div>
     <div class="button-group">
         
    <button id="send-message" class="send-btn icon send" title="Enviar">
    </button>
         
         
     </div>
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
    `}};var v=class{static render(e){let t=e.getRules(),o=e.countActiveRules(),r=Object.entries({preferTypescript:"Preferir TypeScript",preferCleanCode:"C\xF3digo Limpo",explainLikeTeacher:"Explicar como Professor",simpleLanguage:"Linguagem Simples",showAlternativeSolutions:"Mostrar Solu\xE7\xF5es Alternativas",optimizePerformance:"Otimizar Performance",autoDetectLanguage:"Detectar Idioma Automaticamente"}).map(([a,n])=>`
        <div class="rule-item">
          <span>${n}</span>
          <label class="toggle-switch">
            <input type="checkbox" data-rule="${a}" ${t[a]?"checked":""}>
            <span class="slider"></span>
          </label>
        </div>
      `).join("");return`
      <div class="rules-container scroll">
       
        <div class="rules-status">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span>Regras ativas: <strong>
            
            ${o}
            
            </strong></span>
            <button id="reset-rules" class="btn ">Resetar</button>
          </div>
        </div>
        <div class="toggle-rules">
          <h4>Regras Configur\xE1veis</h4>
          <div>
          
            ${r}
            
            
          </div>
          
        </div>
        <div class="custom-rules">
          <h4 class="font">Regras Personalizadas (JSON)</h4>
          <textarea id="custom-rules-json" placeholder='{"exemplo": "valor"}' rows="4" class="w-full ">
          
          ${JSON.stringify(t.customRules||{},null,2)}
          </textarea>
          <button id="save-custom-rules" class="btn-primary ">Aplicar Regras Customizadas</button>
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
    `}};var k=class{constructor(e){this.container=e}initialize(){let e=Array.from(this.container.querySelectorAll(".tab-btn")),t=this.container.querySelector(".tab-indicator");t&&(t.style.width=`${100/Math.max(e.length,1)}%`,t.style.transform="translateX(0%)"),e.forEach((o,r)=>{o.addEventListener("click",()=>{this.switchTab(e,t,o,r)})})}switchTab(e,t,o,r){e.forEach(n=>n.classList.remove("active")),o.classList.add("active"),t&&(t.style.transform=`translateX(${r*100}%)`);let a=o.dataset.tab;this.container.querySelectorAll(".tab-pane").forEach(n=>{n.classList.toggle("active",n.id===`${a}-tab`)})}};var p=class{static addMessage(e,t,o){let r=e.querySelector("#chat-messages");if(!r)return;let a=document.createElement("div");if(a.className=`message ${t}`,t==="user"){let n=document.createElement("p");n.textContent=o,a.appendChild(n)}else{let n=this.safeFormatContent(o);a.innerHTML=n}r.appendChild(a),this.applySyntaxHighlighting(a),requestAnimationFrame(()=>{r.scrollTo({top:r.scrollHeight,behavior:"smooth"})})}static showTypingIndicator(e){let t=e.querySelector("#chat-messages");if(!t)return;let o=document.createElement("div");o.className="message assistant typing-indicator",o.id="typing-indicator",o.innerHTML=`
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `,t.appendChild(o),t.scrollTo({top:t.scrollHeight,behavior:"smooth"})}static hideTypingIndicator(e){let t=e.querySelector("#typing-indicator");t&&t.remove()}static safeFormatContent(e){let t={},o=0,r=(d,m)=>{let h=`CODE_TOKEN_${o++}`;return t[h]={lang:d||"text",code:m},h},a=e.replace(/```(\w+)?\s*([\s\S]*?)```/g,(d,m,h)=>r(m||"text",h));return l.escapeHtml(a).split(/(CODE_TOKEN_\d+)/).map(d=>{if(d.match(/^(CODE_TOKEN_\d+)$/)){let h=t[d];if(!h)return"";let z=l.escapeHtml(h.code.replace(/\r\n/g,`
`)),P=l.escapeHtml(h.lang||"text"),$="code-"+Date.now()+"-"+Math.random().toString(36).slice(2,9);return`
          <div class="code-block">
            <div class="code-header">
              <span class="code-language">${l.escapeHtml(h.lang)}</span>
              <button class="copy-btn" data-code-id="${$}">\u{1F4CB}</button>
            </div>
            <pre><code id="${$}" class="hljs language-${P}">${z}</code></pre>
          </div>
        `}else return d.replace(/\n/g,"<br>")}).join("").replace(/`([^`]+)`/g,(d,m)=>`<code class="inline-code">${l.escapeHtml(m)}</code>`)}static applySyntaxHighlighting(e){try{let t=window.hljs;if(!t)return;Array.from(e.querySelectorAll("pre code")).forEach(r=>{t.highlightElement?t.highlightElement(r):t.highlightBlock&&t.highlightBlock(r)})}catch(t){console.error("Erro ao aplicar highlight:",t)}}static setupCopyDelegation(e){let t=e.querySelector("#chat-messages");t&&t.addEventListener("click",async o=>{let r=o.target,a=r.closest?r.closest(".copy-btn"):null;if(!a)return;o.preventDefault();let n=a.dataset.codeId;if(!n)return;let s=t.querySelector(`#${n}`)?.textContent??"",g=a.innerHTML;a.innerHTML="\u23F3";let d=await f.copyToClipboard(s),m=acode.require("toast");d?(a.innerHTML="\u2705",m("C\xF3digo copiado!")):(a.innerHTML="\u274C",m("Erro ao copiar")),setTimeout(()=>{a.innerHTML=g},1500)})}};var C=class{constructor(e,t,o){this.container=e;this.onSendMessage=t;this.onClearChat=o}initialize(){this.setupSendEvent(),this.setupClearEvent(),this.setupHistoryEvent(),p.setupCopyDelegation(this.container)}setupSendEvent(){let e=this.container.querySelector("#send-message"),t=this.container.querySelector("#chat-input"),o=()=>{if(!t||!t.value.trim())return;let r=t.value.trim();this.onSendMessage(r),t.value="",l.autoResizeTextarea(t)};e?.addEventListener("click",o),t?.addEventListener("keydown",r=>{r.key==="Enter"&&!r.shiftKey&&(r.preventDefault(),o())}),t?.addEventListener("input",()=>{t&&l.autoResizeTextarea(t)})}setupClearEvent(){this.container.querySelector("#clear-chat")?.addEventListener("click",this.onClearChat)}setupHistoryEvent(){this.container.querySelector("#history-chat")?.addEventListener("click",()=>{console.log("Hist\xF3rico clicado")})}setupCopyDelegation(){let e=this.container.querySelector("#chat-messages");e&&e.addEventListener("click",async t=>{let o=t.target,r=o.closest?o.closest(".copy-btn"):null;if(!r)return;t.preventDefault();let a=r.dataset.codeId;if(!a)return;let i=e.querySelector(`#${a}`)?.textContent??"",s=r.innerHTML;r.innerHTML="\u23F3",console.log("Copiar c\xF3digo:",i),setTimeout(()=>{r.innerHTML=s},1500)})}};var y=class{constructor(e,t,o){this.container=e;this.ruleManager=t;this.onRulesUpdated=o}initialize(){this.setupToggleEvents(),this.setupResetEvent(),this.setupCustomRulesEvent()}setupToggleEvents(){this.container.addEventListener("change",e=>{let t=e.target;if(!t.matches('input[type="checkbox"][data-rule]'))return;let o=t.dataset.rule,r=t.checked;this.ruleManager.setToggleRule(o,r),acode.require("toast")(`Regra "${o}" ${r?"ativada":"desativada"}`)})}setupResetEvent(){this.container.querySelector("#reset-rules")?.addEventListener("click",()=>{this.ruleManager.resetRules(),acode.require("toast")("Regras resetadas"),this.onRulesUpdated()})}setupCustomRulesEvent(){this.container.querySelector("#save-custom-rules")?.addEventListener("click",()=>this.saveCustomRules())}saveCustomRules(){let e=this.container.querySelector("#custom-rules-json");if(e)try{let t=JSON.parse(e.value||"{}");this.ruleManager.setCustomRules(t),acode.require("toast")("Regras salvas com sucesso!")}catch{acode.require("toast")("JSON inv\xE1lido nas regras personalizadas")}}};var L=class{constructor(e,t,o,r){this.container=e;this.onSaveConfig=t;this.onTestAPI=o;this.cryptoUtils=r}initialize(){this.setupTemperatureSlider(),this.setupApiKeyEvents(),this.setupSaveEvent(),this.setupTestEvent()}setupTemperatureSlider(){let e=this.container.querySelector("#temperature"),t=this.container.querySelector("#temp-value");e?.addEventListener("input",()=>{t&&e&&(t.textContent=e.value)})}setupApiKeyEvents(){let e=this.container.querySelector("#reveal-key"),t=this.container.querySelector("#clear-key");e?.addEventListener("click",o=>{o.preventDefault();let r=this.container.querySelector("#api-key");r&&(r.type=r.type==="password"?"text":"password")}),t?.addEventListener("click",o=>{o.preventDefault();let r=this.container.querySelector("#api-key");r&&(r.value="")})}setupSaveEvent(){this.container.querySelector("#save-config")?.addEventListener("click",()=>this.onSaveConfig())}setupTestEvent(){this.container.querySelector("#test-api")?.addEventListener("click",()=>this.onTestAPI())}};var A=class{container;actionStack;constructor(e){this.container=e,this.actionStack=acode.require("actionStack")}renderAnalyzeButton(){let e=document.createElement("button");e.id="analyze-context",e.className="analyze-btn",e.innerHTML="\u{1F50D}",e.title="Analisar arquivo e projeto atual",e.addEventListener("click",()=>{this.handleContextAnalysis()});let t=this.container.querySelector(".chat-input-wrapper");t&&t.appendChild(e),this.actionStack.push({id:"context-analyzer",action:()=>e.remove()})}async handleContextAnalysis(){try{this.setAnalyzeButtonState("loading"),await this.simpleContextAnalysis()}catch(e){console.error("Erro na an\xE1lise de contexto:",e),this.showError("Erro ao analisar contexto")}finally{this.setAnalyzeButtonState("ready")}}async simpleContextAnalysis(){let e=acode.require("toast");try{let{editor:t}=editorManager,o=editorManager.activeFile;if(!o){e("Nenhum arquivo aberto no editor");return}let r=o.filename,a=o.language||"text";e(`Analisando: ${r} (${a})`),this.addContextMessage(r,a)}catch{e("N\xE3o foi poss\xEDvel acessar o editor")}}addContextMessage(e,t){let o=this.container.querySelector("#chat-messages");if(!o)return;let r=document.createElement("div");r.className="message system context-analysis",r.innerHTML=`
      <div class="context-info">
        <strong>\u{1F4C1} Contexto Analisado:</strong>
        <div>Arquivo: <code>${e}</code></div>
        <div>Linguagem: <code>${t}</code></div>
        <div class="context-suggestions">
          <small>Posso ajudar com: an\xE1lise de c\xF3digo, sugest\xF5es de melhoria, detec\xE7\xE3o de erros...</small>
        </div>
      </div>
    `,o.appendChild(r),o.scrollTo({top:o.scrollHeight,behavior:"smooth"})}setAnalyzeButtonState(e){let t=this.container.querySelector("#analyze-context");if(t)switch(e){case"loading":t.innerHTML="\u23F3 Analisando...",t.disabled=!0;break;case"error":t.innerHTML="\u274C Erro",t.disabled=!1,setTimeout(()=>{t.innerHTML="\u{1F50D} Analisar Contexto"},2e3);break;default:t.innerHTML="\u{1F50D} Analisar Contexto",t.disabled=!1}}showError(e){acode.require("toast")(e)}};var H=acode.require("sidebarApps"),b=acode.require("toast"),x=acode.require("settings"),R=class{contextAnalyzer;container=null;id=u.id;ruleManager;aiService=null;baseUrl="";cryptoUtils;$mainStyle=null;constructor(){this.ruleManager=new w,this.cryptoUtils=new S,this.initializeSettings()}initializeSettings(){x.value[u.id]||(x.value[u.id]={apiKey:"",provider:"openai",model:"gpt-4o-mini",temperature:.7,userName:"",rules:this.ruleManager.getRules()},x.update())}async init(){try{let e=`${this.baseUrl}assets/icon.png`;acode.addIcon("sidebar-icon",e),this.loadGlobalStyles(),await this.loadHighlightJS(),H.add("sidebar-icon","agente_IA","Agente IA",t=>{this.container=t,this.renderContainer()},()=>this.onAppSelected()),console.log("Plugin inicializado com sucesso")}catch(e){console.error("Erro ao inicializar plugin:",e)}}loadGlobalStyles(){this.$mainStyle=l.loadStylesheet(`${this.baseUrl}main.css`)}async loadHighlightJS(){try{typeof f.loadHighlight=="function"&&await f.loadHighlight(this.baseUrl)}catch(e){console.warn("N\xE3o foi poss\xEDvel carregar highlight.js:",e)}}renderContainer(){if(!this.container)return;let e=this.getSettings();this.container.innerHTML=`
  
    <div class="sidebar-container">
     <div class="tabs-header">
     
     <button class="tab-btn active" data-tab="chat"><span>Chat</span>
     </button>
     
     <button class="tab-btn" data-tab="rules"><span>Rules</span>
     </button>
     
     
     <button class="tab-btn" data-tab="config"><span>Config</span>
     </button>
     
     <div class="tab-indicator"></div>
     </div>
     
     <div class="tab-content">
     <div class="tab-pane active" id="chat-tab">
     ${T.render(e.userName)}
     </div>
     
     <div class="tab-pane" id="rules-tab">
     <div class="rules-content ">${v.render(this.ruleManager)}</div>
     </div>
     
     <div class="tab-pane" id="config-tab">
     <div class="config-content ">${M.render(e)}</div>
     </div>
     
     
     </div>
    </div
    
    `,this.initializeUIComponents()}initializeUIComponents(){if(!this.container)return;new k(this.container).initialize(),new C(this.container,a=>this.sendMessage(a),()=>this.clearChat()).initialize(),new y(this.container,this.ruleManager,()=>this.refreshRulesUI()).initialize(),new L(this.container,()=>this.saveConfig(),()=>this.testAPI(),this.cryptoUtils).initialize(),this.contextAnalyzer=new A(this.container),this.contextAnalyzer.renderAnalyzeButton(),this.loadSavedConfig()}async sendMessage(e){p.addMessage(this.container,"user",e),p.showTypingIndicator(this.container);try{let t=this.getSettings();if(!t.apiKey)throw new Error("Configure uma API Key primeiro na aba Config");let o=await this.cryptoUtils.decrypt(t.apiKey);if(!o)throw new Error("API Key inv\xE1lida");this.aiService=new E({apiKey:o,provider:t.provider,model:t.model,temperature:t.temperature});let a=`
REGRAS DO SISTEMA:
${this.ruleManager.getRulesAsText()}

MENSAGEM DO USU\xC1RIO:
${e}

Por favor, responda seguindo as regras acima.`.trim(),n=await this.aiService.sendMessage(a);p.hideTypingIndicator(this.container),p.addMessage(this.container,"assistant",n)}catch(t){p.hideTypingIndicator(this.container);let o=t?.message??String(t);p.addMessage(this.container,"system",`Erro: ${o}`),console.error("sendMessage error:",t)}}clearChat(){let e=this.container?.querySelector("#chat-messages");if(!e)return;e.innerHTML="";let t=this.getSettings();p.addMessage(this.container,"system",`${t.userName?`Ol\xE1, ${t.userName}! `:"Ol\xE1! "}Como posso ajudar voc\xEA hoje?`)}refreshRulesUI(){let e=this.container.querySelector(".rules-content");e&&(e.innerHTML=v.render(this.ruleManager),new y(this.container,this.ruleManager,()=>this.refreshRulesUI()).initialize())}async saveConfig(){let e=this.container?.querySelector("#api-key"),t=this.container?.querySelector("#api-provider"),o=this.container?.querySelector("#temperature"),r=this.container?.querySelector("#user-name"),a=this.getSettings();if(!e||!t||!modelEl||!o){b("Campos de configura\xE7\xE3o incompletos");return}let n=e.value.trim();n!==""&&(a.apiKey=await this.cryptoUtils.encrypt(n)),a.provider=t.value,a.model=modelEl.value,a.temperature=parseFloat(o.value),a.userName=r?.value||a.userName,x.update(),b("Configura\xE7\xF5es salvas!");let i=this.container?.querySelector("#model-indicator");i&&(i.textContent=`Modelo: ${a.model}`)}testAPI(){b("Testando conex\xE3o com API..."),setTimeout(()=>{b("Conex\xE3o com API bem-sucedida!")},1500)}async loadSavedConfig(){if(!this.container)return;let e=this.getSettings();if(!e)return;let t=this.container.querySelector("#api-key"),o=this.container.querySelector("#api-provider"),r=this.container.querySelector("#api-model"),a=this.container.querySelector("#temperature"),n=this.container.querySelector("#temp-value"),i=this.container.querySelector("#user-name");if(o&&e.provider&&(o.value=e.provider),r&&e.model){r.value=e.model;let s=this.container.querySelector("#model-indicator");s&&(s.textContent=`Modelo: ${e.model}`)}if(a&&e.temperature!==void 0&&(a.value=e.temperature.toString(),n&&(n.textContent=e.temperature.toString())),i&&e.userName&&(i.value=e.userName),t)if(e.apiKey)try{let s=await this.cryptoUtils.decrypt(e.apiKey);t.value=s||""}catch(s){console.error("Erro ao carregar apiKey:",s),t.value=""}else t.value=""}getSettings(){return x.value[u.id]||{}}onAppSelected(){b("Agente IA ativado")}async destroy(){H&&(H.remove("agente_IA"),H.remove("sidebar-icon")),this.$mainStyle&&this.$mainStyle.remove()}};if(window.acode){let c=new R;acode.setPluginInit(u.id,async(e,t,{cacheFileUrl:o,cacheFile:r})=>{e.endsWith("/")||(e+="/"),c.baseUrl=e,await c.init()}),acode.setPluginUnmount(u.id,()=>{c.destroy()})}})();
