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