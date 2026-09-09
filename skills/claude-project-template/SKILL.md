---
name: claude-project-template
description: Use when scaffolding a typed Claude project — course, client-project, automation, product, research templates with docs, instructions, connectors. Triggers on "claude project template", "project template claude", "project structure claude", "template projeto claude".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude Project Template — Templates por Tipo

Templates **course, client-project, automation, product, research** — cada um com `.claude/`, docs, scripts, conectores. Árvores completas + gerador em `references/templates.md`.

## Quando usar (gatilhos concretos)

- "Template de projeto para curso"
- "Estrutura de projeto para cliente"
- "Template de automação"
- "Estrutura de produto/SaaS"
- "Template de pesquisa"

## Quando NÃO usar

- Prototipagem rápida sem estrutura
- Projetos sem estrutura definida
- Scripts únicos sem reutilização

## Templates (resumo)

| Template | `.claude/` | Estrutura chave |
|---|---|---|
| **course** | instructions, skills, youtube/drive | modules/ (lessons/assets/quizzes), assets/, scripts/ |
| **client-project** | instructions, skills, gmail/calendar/drive/notion | docs/ (requirements/architecture/deploy/api), src/, tests/ |
| **automation** | instructions, workflow skills, gmail/calendar/drive/sheets | workflows/ (daily/weekly/monthly), scripts/, schedules/cron |
| **product** | instructions, feature-dev/code-review, github/linear/slack | specs/, src/, tests/, .github/, docs/ |
| **research** | instructions, deep-research/synthesis, web/arxiv/github | sources/, analysis/, reports/ |

```bash
claude-project-template create --template course --name "My Course"
```

`suggest_template()` mapeia tipo livre (course/client/automation/saas/research/quick) → template (quick → minimal). `project-instructions.md` tem placeholders `{{PROJECT_NAME/DESCRIPTION/TYPE/STYLE/COMMANDS/SKILLS/CONNECTORS/STRUCTURE}}`. Detalhe em `references/templates.md`.

## Referências Oficiais

- [Luciana Papini Video](https://www.youtube.com/watch?v=Bezlzmti6_U)

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```
