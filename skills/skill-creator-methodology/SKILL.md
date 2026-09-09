---
name: skill-creator-methodology
description: Use when creating reusable skills from scratch — detect repetition, document process, create, test, version, share. Triggers on "criar skill methodology", "metodologia criar skill", "skill creator process", "como criar skill", "skill development lifecycle".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/skills
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Skill Creator Methodology — Criação de Skills Reutilizáveis

Metodologia: **detectar repetição → documentar → criar → testar → versionar → share**. Templates e checklists em `references/templates.md`.

## Quando usar (gatilhos concretos)

- "Como criar uma skill do zero"
- "Metodologia para criar skills reutilizáveis"
- "Processo de criação de skills"
- "Skill development lifecycle"

## Quando NÃO usar

- Usar skill existente → use `encontrar-skill` ou `skill-scout`
- Instalar skill → use `encontrar-skill` ou `skill-scout`

## Metodologia (4 Fases — resumo)

**Fase 1 — Detectar repetição:** mesma tarefa ou explicação **3+ vezes** + ROI > tempo de criação → vira skill. (Checklist em `references/templates.md`.)

**Fase 2 — Documentar:** especificação com contexto (problema/gatilho/não-gatilho), inputs, steps, outputs, referências. (Template em `references/templates.md`.)

**Fase 3 — Criar & testar:** estrutura `SKILL.md` + `references/` + `scripts/`; frontmatter + gatilhos + pipeline + refs oficiais; testes happy path, edge, erro, integração; validação (`build-catalog.js`, `validate-no-personal-paths.js`, `git status` limpo).

**Fase 4 — Versionar & share:**

```bash
git add skills/<nome>/ && git commit -m "feat: add <nome> skill - <breve desc>" && git push origin main
node scripts/build-catalog.js
```

SKILL template pronto + checklist final de PR em `references/templates.md`.

## Referências Oficiais (Validados 2026-08-30)

- [Claude Code Skills Docs](https://docs.anthropic.com/en/docs/claude-code/skills)
- [Anthropic: Building Skills for Claude](https://www.anthropic.com/engineering/building-skills-for-claude)

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```
