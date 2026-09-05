---
name: claude-md-auditor
description: >-
  `/doctor` automation: mede linhas/palavras do CLAUDE.md, sugere trims, path-specific rules, HTML comments, prompt-for-next-session. Baseado no vídeo do Simon Scrapes "19 Claude Code Mistakes".
  Use quando: "claude md auditor", "claude md length auditor", "claude md trim", "claude md path specific rules", "claude md html comments", "claude md prompt for next session", "doctor claude".
  Não use para: general context budget (use context-budget), strategic compact (use strategic-compact).
  Outcome: Auditoria automatizada do CLAUDE.md/AGENTS.md - mede linhas/palavras, sugere trims, path-specific rules, HTML comments, prompt-for-next-session.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=icM0ewXGvAw (Simon Scrapes - 19 Claude Code Mistakes)
    - https://docs.anthropic.com/en/docs/claude-code/settings
    - https://docs.anthropic.com/en/docs/claude-code/memory
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Claude.md Auditor — Auditoria Automatizada do CLAUDE.md/AGENTS.md

Auditoria automatizada do **CLAUDE.md/AGENTS.md** - mede linhas/palavras, sugere trims, path-specific rules, HTML comments, prompt-for-next-session. Baseado no vídeo do Simon Scrapes "19 Claude Code Mistakes".

## Quando usar (gatilhos concretos)

- "Claude.md auditor"
- "Claude.md length auditor"
- "Claude.md trim"
- "Claude.md path specific rules"
- "Claude.md html comments"
- "Claude.md prompt for next session"
- "Doctor claude"

## Quando NÃO usar

- General context budget → use `context-budget`
- Strategic compact → use `strategic-compact`

## Contents

| Topic | Reference |
|---|---|
| Problemas 1-5 do pipeline | `references/pipeline-problems.md` |
| Analise de comprimento | `references/pipeline-analysis.md` |
| CLI, hooks, settings patch | `references/cli-hooks.md` |
| Integracao /doctor, validacao | `references/doctor-integration.md` |

## Checklist de Entrega

- [ ] `claude-md-auditor.js` — Core auditor class
- [ ] `cli.js` — CLI commands (audit, trim, add-path-rule, add-prompt-next)
- [ ] `hooks/claude-md-auditor.js` — Stop hook
- [ ] `settings-patch.json` — Settings.json patch
- [ ] Integration with `/doctor` command
- [ ] Testes de integração

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   ├── commands/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```

## Referências

- `references/pipeline-problems.md` — longo demais, process vs judgment, HTML comments, path rules, prompt-next
- `references/pipeline-analysis.md` — medicao e trims
- `references/cli-hooks.md` — CLI, hooks, settings.json
- `references/doctor-integration.md` — /doctor, validacao na fonte
