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
