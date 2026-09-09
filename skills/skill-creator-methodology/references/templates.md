# Templates — Detecção, Especificação, Criação, SKILL Template, Checklist PR

## Checklist de Detecção

```markdown
# Checklist de Detecção
- [ ] Tarefa repetida 3+ vezes?
- [ ] Mesmo prompt/contexto repetido?
- [ ] Processo documentado em anotações?
- [ ] Resultado sempre similar esperado?
- [ ] Vale a pena automatizar? (ROI > tempo de criação)
```

## Template de Especificação de Skill

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

## Checklist de Criação

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
