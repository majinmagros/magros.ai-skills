---
name: claude-account-optimizer
description: Use when setting up or optimizing a Claude account from scratch — email strategy, memory import, model routing, project templates, connectors. Triggers on "otimizar conta claude", "configurar claude do zero", "melhorar setup claude", "email da conta claude", "memory import claude", "model routing claude", "project template claude".
metadata:
  origin: ECC
  source_docs:
    - https://docs.anthropic.com/en/docs/claude-code/memory
    - https://docs.anthropic.com/en/docs/claude-code/settings
    - https://docs.anthropic.com/en/docs/claude-code/hooks
    - https://docs.anthropic.com/en/docs/claude-code/projects
    - https://docs.anthropic.com/en/docs/claude-code/skills
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, settings]
---

# claude-account-optimizer — Otimização Completa de Conta Claude

Conta Claude do zero em 7 passos: email, memory import, model routing, templates, conectores, skills base, settings. Detalhe em `references/setup-guide.md`.

## Quando usar (gatilhos concretos)

- "Configure minha conta Claude do zero"
- "Otimize minha conta Claude"
- "Qual melhor email para conta Claude?"
- "Como importar memory do ChatGPT pro Claude?"
- "Como configurar model routing no Claude?"
- "Templates de projeto para Claude"
- "Quais conectores ativar no Claude?"
- "Configurar conta Claude para equipe"

## Quando NÃO usar

- Criar skills do zero → use `criar-skill`
- Auditar rules → hooks → use `rules-to-hooks-auditor`
- Deploy Cloud Code → use `cloud-code-vps-deploy`

## Pipeline (resumo — detalhe em `references/setup-guide.md`)

1. **Email**: pessoal e permanente (nunca corporativo) + 2FA + recovery
2. **Memory import**: export origem → import Claude → entrevista de validação obrigatória (voz) — ver `memory-import-workflow`
3. **Model routing**: sonet diário (≤$0.05/task), opus complexo (≤$2), fable reasoning (≤$5) + swap rules — ver `claude-model-router`
4. **Templates**: course, client-project, automation, product, research (cada um com `.claude/` + estrutura) — ver `claude-project-template`
5. **Conectores**: P1 gmail/calendar → P2 drive/notion → P3 github/linear/slack + MCP (filesystem/postgres/redis) — ver `claude-connector-strategy`
6. **Skills base**: 10 skills (meeting-notes, weekly-report, code-review, email-triage, calendar, file-org, research, checklists, deploy, security)
7. **Settings**: sonet default, auto_compact 0.85, hooks (block-env, block-rm-rf, cost-tracker, stop-tests, inject-context), permissions ask-first

```bash
node scripts/validate-account-setup.py  # valida tudo (hooks, routing, templates)
```

## Checklist de Entrega

- [ ] Email pessoal configurado
- [ ] Memory import + entrevista validada
- [ ] Model routing configurado + testado
- [ ] 4+ project templates criados
- [ ] 6+ conectores prioritários configurados
- [ ] 10+ skills base instaladas
- [ ] Settings.json otimizado com hooks
- [ ] Adapters para plataformas-alvo criados
- [ ] CI passando (validate-account-setup.py)

## Adapters (Por Plataforma)

```