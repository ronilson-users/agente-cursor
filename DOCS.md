#!/data/data/com.termux/files/usr/bin/bash

set -e  # Sai automaticamente em caso de erro

echo "🚀 Instalando cz e cz-customizable..."
if ! npm install --save-dev commitizen cz-customizable; then
    echo "❌ Erro na instalação do npm"
    exit 1
fi

echo "📦 Criando arquivo cz-config.js..."
cat > cz-config.js <<'EOF'
module.exports = {
  types: [
    { value: "feat",     name: "feat:     ✨ Uma nova funcionalidade" },
    { value: "fix",      name: "fix:      🐛 Correção de bugs" },
    { value: "docs",     name: "docs:     📚 Apenas documentação" },
    { value: "style",    name: "style:    💄 Formatação, ponto e vírgula etc" },
    { value: "refactor", name: "refactor: 🔧 Refatoração sem alteração funcional" },
    { value: "test",     name: "test:     ✅ Adição ou correção de testes" },
    { value: "chore",    name: "chore:    📦 Mudanças em build ou ferramentas" },
    { value: "perf",     name: "perf:     ⚡ Melhorias de performance" },
    { value: "ci",       name: "ci:       🔄 Mudanças na CI/CD" }
  ],
  messages: {
    type: "Selecione o tipo de alteração:",
    scope: "Escopo (opcional):",
    subject: "Escreva uma descrição breve (imperativa):",
    body: "Descrição mais detalhada (opcional). Use | para nova linha:",
    footer: "Issues relacionadas (opcional):",
    confirmCommit: "Deseja prosseguir com o commit acima?"
  },
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: ['footer'],
  subjectLimit: 72,
  breaklineChar: '|'
};
EOF

echo "🛠️ Atualizando package.json com config cz..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json não encontrado!"
    echo "📝 Criando package.json básico..."
    npm init -y
fi

node -e "
const fs = require('fs');
try {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.commit = 'cz';
    pkg.config = pkg.config || {};
    pkg.config.commitizen = { 
        path: './node_modules/cz-customizable' 
    };
    pkg.config['cz-customizable'] = {
        config: 'cz-config.js'
    };
    
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    console.log('✅ package.json atualizado com sucesso!');
} catch (error) {
    console.error('❌ Erro ao atualizar package.json:', error.message);
    process.exit(1);
}
"

# Criar .gitignore se não existir
if [ ! -f ".gitignore" ]; then
    echo "📦 Criando arquivo .gitignore..."
    cat > .gitignore <<'EOF'
node_modules/
.DS_Store
*.log
.env
.env.local
.env.production
dist/
build/
.coverage
.nyc_output
EOF
    echo "✅ .gitignore criado com sucesso!"
else
    echo "📁 .gitignore já existe, mantendo o atual"
fi

# Verifica se é um repositório git
if [ ! -d ".git" ]; then
    echo "⚠️  Diretório .git não encontrado. Inicializando repositório..."
    git init
fi

echo ""
echo "✅ Commitizen configurado com sucesso!"
echo ""
echo "📘 COMO USAR:"
echo "1. Adicione arquivos: git add ."
echo "2. Execute: npm run commit"
echo "3. Ou use diretamente: npx cz"
echo ""
echo "💡 DICA: Seja sempre Produtivo 🚀"


# =====================================
# 🚀  TERMUX
# =====================================


# Tornar executável e rodar
chmod +x setup-commitizen.sh
./setup-commitizen.sh


# Verificar se tudo está correto
node -e "require('./cz-config.js'); console.log('✅ cz-config.js válido!')"

# Testar o commitizen
npm run commit -- --dry-run





**------------------------------------
#!/data/data/com.termux/files/usr/bin/bash

# =====================================
# 🚀 AUTOMAÇÃO DE SINCRONIZAÇÃO GITHUB - VERSÃO SEGURA
# =====================================

set -e

# Configuração
GITHUB_USERNAME="ronilson-users"
REPO_NAME="agente-cursor"
PROJECT_DIR="/data/data/com.termux/files/home/Continua/agente-cursor"

# =====================================
# 🔍 Verificações Iniciais
# =====================================
echo "🔍 Verificando ambiente..."


# Ir para o diretório
cd "$PROJECT_DIR" || { 
    echo "❌ Diretório não encontrado: $PROJECT_DIR" 
    exit 1 
}

echo "📁 Diretório: $(pwd)"
echo "🚀 Iniciando sincronização: $REPO_NAME"

# =====================================
# 🔐 Gerenciamento SEGURO do Token
# =====================================
if [ -f .env ] && [ -z "$GITHUB_TOKEN" ]; then
    source .env
fi

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ GITHUB_TOKEN não encontrado."
    read -s -p "🔑 Digite seu token GitHub: " GITHUB_TOKEN
    echo
    # NÃO salva automaticamente no .env
fi

# Verificar token
if ! curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user | grep -q '"login"'; then
    echo "❌ Token inválido"
    exit 1
fi

# =====================================
# ⚙️ Configurar Git
# =====================================

echo "⚙️ Configurando Git..."

if [ ! -d .git ]; then
    git init
fi

if [ -z "$GITHUB_EMAIL" ]; then
    read -p "📧 Digite seu email do GitHub: " GITHUB_EMAIL
fi

git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_EMAIL"

echo "✅ Git configurado."

# =====================================
# 📋 Garantir .gitignore
# =====================================
if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
# Arquivos sensíveis
.env
.env.local
.env.*
*.key
*.pem

# Dados sensíveis
**/secrets/
**/config/
**/credentials*

# Logs e temporários
*.log
node_modules/
__pycache__/
*.pyc

# Sistema
.DS_Store
Thumbs.db
EOF
    echo "✅ .gitignore criado"
fi

# =====================================
# 🗂️ Adicionar arquivos (EXCLUINDO .env)
# =====================================
echo "💾 Adicionando arquivos seguros..."

# =====================================
# 📝 Criar repositório no GitHub se não existir
# =====================================
echo "🔍 Verificando repositório no GitHub..."
if ! curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME} | grep -q '"name"'; then
    echo "🆕 Criando repositório no GitHub..."
    curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
         -H "Accept: application/vnd.github.v3+json" \
         https://api.github.com/user/repos \
         -d "{\"name\":\"$REPO_NAME\", \"private\":false, \"auto_init\":false}"
    echo "✅ Repositório criado: $REPO_NAME"
    sleep 2  # Aguardar criação
fi


# Remover .env se já estiver no git
git rm --cached .env 2>/dev/null || true

# Adicionar todos os arquivos exceto os listados no .gitignore
git add .

# Verificar se há mudanças
if git diff --cached --quiet; then
    echo "📝 Nenhuma mudança para commitar. Criando README..."
    
    if [ ! -f README.md ]; then
        cat > README.md << EOF
# $REPO_NAME

## Descrição
Projeto sincronizado automaticamente via script.

## ⚠️ Configuração
Crie um arquivo .env localmente com:
\`\`\`
GITHUB_TOKEN=seu_token_aqui
GITHUB_EMAIL=seu_email@exemplo.com
\`\`\`

**NUNCA compartilhe seu token!**
EOF
        git add README.md
    fi
fi

# =====================================
# 📝 Commit e Push
# =====================================
if ! git diff --cached --quiet; then
    git commit -m "🚀 Deploy seguro $(date '+%d/%m/%Y %H:%M')"
    
    # Configurar remote com autenticação
    AUTH_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
    git remote remove origin 2>/dev/null || true
    git remote add origin "$AUTH_URL"
    
    # Fazer push
    git branch -M main
    echo "📤 Enviando para GitHub..."
    git push -u origin main
    
    echo "✅ Sincronização concluída com segurança!"
else
    echo "❌ Push falhou. Verifique:"
    echo "   - Permissões do token"
    echo "   - Conflitos no repositório"
    echo "   - Conexão com a internet"
    exit 1
fi

# =====================================
# 🧹 Limpeza
# =====================================
# Remover header de autenticação
git config --local --unset http.https://github.com/.extraheader

# Limpar token da memória
unset GITHUB_TOKEN

echo ""
echo "===================================="
echo "🎉 SINCRONIZAÇÃO CONCLUÍDA!"
echo "===================================="
echo "🌍 Repositório: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo "🌿 Branch: $CURRENT_BRANCH"
echo "📊 Status: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/commits/$CURRENT_BRANCH"
echo "⏰ Sincronizado em: $(date '+%d/%m/%Y %H:%M')"
echo "===================================="



# =====================================
# 🚀  TERMUX
# =====================================


```bash
# 1. Criar o script
touch github-sync.sh

# 2. Colar o código acima
# 3. Editar as variáveis no topo do script:
#    - GITHUB_USERNAME="seu-usuario"
#    - REPO_NAME="nome-do-repositorio" 
#    - PROJECT_DIR="/caminho/do/projeto/seu-usuario"

# 4. Tornar executável
chmod +x github-sync.sh

# 5. Executar
./github-sync.sh