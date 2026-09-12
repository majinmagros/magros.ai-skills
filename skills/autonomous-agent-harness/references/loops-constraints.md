# Autonomous Agent Harness — Loop Library, Constraints, Hermes Runbook

## Loop Library (Patterns)

1. **Daily Standup / PR Reviewer**: cron `0 9 * * 1-5` → analisa PRs/CI → resumo.
2. **Nightly Green-Keeper**: cron `0 2 * * *` → roda testes → corrige pequenas falhas com limites.
3. **Personal Research Agent**: cron diário → busca tópicos via Exa → compila digest.
4. **Meeting Prep**: gatilho de agenda → busca histórico → gera talking points.
5. **Inbox Zero / File Classifier**: cron horário → limpa pasta/inbox → classifica com goal verificável.
6. **Data Scraper / Monitor**: intervalado → busca fonte → atualiza banco se houver mudança.
7. **Security / Vulnerability Scanner**: cron semanal → roda audit local → abre issues.
*Origem: Matthew Berman (Leva 1 - 2026).*

### Autonomous PR Reviewer
```
Cron: every 30 min during work hours
1. Check for new PRs on watched repos
2. For each new PR:
   - Pull branch locally
   - Run tests
   - Review changes with code-reviewer agent
   - Post review comments via GitHub MCP
3. Update memory with review status
```

### Personal Research Agent
```
Cron: daily at 6 AM
1. Check saved search queries in memory
2. Run Exa searches for each query
3. Summarize new findings
4. Compare against yesterday's results
5. Write digest to memory
6. Flag high-priority items for morning review
```

### Meeting Prep Agent
```
Trigger: 30 min before each calendar event
1. Read calendar event details
2. Search memory for context on attendees
3. Pull recent email/Slack threads with attendees
4. Prepare talking points and agenda suggestions
5. Write prep doc to memory
```

## Constraints

- Cron tasks run in isolated sessions — they don't share context with interactive sessions unless through memory.
- Computer use requires explicit permission grants. Don't assume access.
- Remote dispatch may have rate limits. Design crons with appropriate intervals.
- Memory files should be kept concise. Archive old data rather than letting files grow unbounded.
- Always verify that scheduled tasks completed successfully. Add error handling to cron prompts.

## Runbook Operacional Hermes Agent (2026-08-24, ponta a ponta)

Fonte `KmJ-PUsxMHo` (AI Foundations); comandos validados em hermes-agent.nousresearch.com/docs (Nous Research, conferido 24/08/2026). Complementa `hermes-imports` (que pressupõe Hermes já rodando).

**5 camadas do "funcionário digital 24/7":**

1. **Online**: VPS barato (ex.: KVM2) > máquina local (precisa estar ligada). Instalar: `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash` → `hermes setup --portal` (OAuth único: modelo + Tool Gateway) ou `hermes setup` completo com chaves próprias.
2. **Comunicação**: `hermes gateway setup` (plataforma interativa; Telegram/Discord/Slack/WhatsApp/Teams...) · Slack: `hermes slack manifest --write` → colar em api.slack.com/apps (regenerar após `hermes update`) + OAuth bot token + allowlist de member IDs.
3. **Perfis por papel**: um bot/perfil por função (research, analista...) com modelo próprio e SOUL.md curto (peça ao próprio Hermes para redigir); perfil default = chief-of-staff que roteia pedidos.
4. **Toolsets mínimos**: memory, cron, session search, task planning, web search; chaves custom e MCP conectados pelo próprio agente.
5. **Skills auto-melhoráveis**: descreva a rotina ("monitore top 5 concorrentes todo dia e poste briefing no #hermes-research") → cron dispara o perfil certo; feedback ("gostei/não") atualiza a skill.

**Troubleshooting oficial**: respostas vazias → `hermes model`; gateway sem mensagens → re-checar token/allowlist + `hermes gateway status`; sessão perdida → `hermes sessions list`. Migração de máquina: `hermes backup`.

## Managed vs VPS (2026-09-06, Nate Herk `gQef3d3erOs`)

- **Managed (~$6/mês)**: sem Docker/SSH/env, Telegram pré-instalado, um agente por app, sem updates/backups/firewall p/ gerenciar. Autentica com a **assinatura ChatGPT via OAuth** (mais barato que API key) + Telegram via BotFather (newbot → token + user ID). Painel + Telegram sincronizados, mobile no bolso.
- **VPS**: root total, múltiplos agentes Hermes + N8N/OpenClaw na mesma caixa, escala CPU/RAM, sem custo extra além do VPS — mas updates/backups/firewall são seus.
- **Regra 98%**: comece no managed; migre p/ VPS quando precisar de multi-agente/colocation/escala. Inclui 1.000 créditos web-scraping free + Agentic Mail opcional (email próprio p/ o agente).
