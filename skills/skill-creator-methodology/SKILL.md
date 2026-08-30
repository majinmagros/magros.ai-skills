---
name: skill-creator-methodology
description: |
  Metodologia Skill Creator: detectar repetição → documentar → criar → testar → versionar → share. Baseado no vídeo da Luciana Papini "Me de 34 minutos e eu te darei 10 000 horas de conhecimento do Claude".
  Use quando: "criar skill methodology", "metodologia criar skill", "skill creator process", "como criar skill", "skill development lifecycle". Non-triggers: usar skill existente (use skill-scout), instalar skill (use encontrar-skill).
  Outcome: Metodologia padronizada para criar skills: detectar repetição → documentar processo → criar skill → testar → versionar → share.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/skills
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Skill Creator Methodology — Metodologia Padronizada de Criação de Skills

Metodologia padronizada para **criar skills reutilizáveis**: detectar repetição → documentar processo → criar skill → testar → versionar → share.

## Quando usar (gatilhos concretos)

- "Como criar uma skill do zero"
- "Metodologia para criar skills reutilizáveis"
- "Processo de criação de skills"
- "Skill development lifecycle"

## Quando NÃO usar

- Usar skill existente → use `encontrar-skill` ou `skill-scout`
- Instalar skill → use `encontrar-skill` ou `skill-scout`

## Metodologia (4 Fases)

### Fase 1: Detectar Repetição (Trigger)

**Critério:** Se você fez a mesma tarefa **3+ vezes** ou explicou o mesmo processo **3+ vezes** → cria skill.

```markdown
# Checklist de Detecção
- [ ] Tarefa repetida 3+ vezes?
- [ ] Mesmo prompt/contexto repetido?
- [ ] Processo documentado em anotações?
- [ ] Resultado sempre similar esperado?
- [ ] Vale a pena automatizar? (ROI > tempo de criação)
```

### Fase 2: Documentar Processo (Especificação)

```markdown
# Template de Especificação de Skill

## 1. Contexto
- **Problema:** O que a skill resolve?
- **Gatilho:** Quando ativar?
- **Não-gatilho:** Quando NÃO usar?

## 2. Entradas (Inputs)
- Parâmetros obrigatórios:
- Parâmetros opcionais:
- Contexto necessário:

## 3. Processo (Steps)
1. Passo 1: Descrição
2. Passo 2: Descrição
3. Passo 3: Descrição
...

## 4. Saídas (Outputs)
- Formato esperado:
- Exemplos:
- Validação:

## 5. Referências
- Docs oficiais:
- Exemplos de uso:
- Edge cases:
```

### Fase 3: Criar & Testar (Implementação)

```markdown
# Checklist de Criação

## Estrutura
- [ ] skills/<nome>/SKILL.md
- [ ] skills/<nome>/references/
- [ ] skills/<nome>/scripts/ (se necessário)

## SKILL.md
- [ ] Frontmatter completo (name, description, metadata)
- [ ] Gatilhos claros (quando usar/não usar)
- [ ] Pipeline passo a passo
- [ ] Referências oficiais
- [ ] Checklist de entrega

## Testes
- [ ] Teste 1: Caso feliz (happy path)
- [ ] Teste 2: Edge case
- [ ] Teste 3: Erro handling
- [ ] Teste 4: Integração com outras skills

## Validação
- [ ] `node scripts/build-catalog.js` passa
- [ ] `node scripts/ci/validate-no-personal-paths.js` passa
- [ ] `git status` limpo
```

### Fase 4: Versionar & Share

```bash
# Versionamento
git add skills/<nome>/
git commit -m "feat: add <nome> skill - <breve desc>"

# Share
git push origin main

# Registro no catálogo
node scripts/build-catalog.js
```

---

## Template de Skill (Copiar e Usar)

```markdown
---
name: <nome-kebab-case>
description: |
  <Uma linha: o que faz + gatilhos concretos + non-triggers + outcome>
metadata:
  origin: AUTORAL
  source_docs:
    - <url-doc-oficial-1>
    - <url-doc-oficial-2>
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# <Nome da Skill>

## Quando usar (gatilhos concretos)
- "<gatilho 1>"
- "<gatilho 2>"

## Quando NÃO usar
- "<cenário 1>"
- "<cenário 2>"

## Pipeline
### 1. <Etapa 1>
<Detalhes>

### 2. <Etapa 2>
<Detalhes>

## Referências Oficiais
- [<Título>](<URL>)

---

## Checklist de Entrega
- [ ] SKILL.md completo
- [ ] references/ populado
- [ ] scripts/ funcionando (se houver)
- [ ] CI passing
- [ ] Adicionado ao manifests/install-modules.json
```

---

## Checklist Final (Copiar para PR)

```
## Skill Creation Checklist
- [ ] Detectou repetição real (3+ vezes)
- [ ] Documentou especificação completa
- [ ] Criou SKILL.md com frontmatter
- [ ] Adicionou references/ se necessário
- [ ] Testou happy path + edge cases
- [ ] CI passing (build-catalog, validate-no-personal-paths)
- [ ] Adicionado ao manifests/install-modules.json
- [ ] Commit + push
- [ ] Catalog rebuild: node scripts/build-catalog.js
```

---

## Referências Oficiais (Validados 2026-08-30)

- [Claude Code Skills Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Anthropic: Building Skills for Claude](https://www.anthropic.com/engineering/building-skills-for-claude)

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```