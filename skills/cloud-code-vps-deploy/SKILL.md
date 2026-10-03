---
name: cloud-code-vps-deploy
description: Use when deploying Claude Code to a VPS (Hostinger KVM1, DigitalOcean, AWS) for 24/7 agents. Triggers on "Cloud Code VPS", "deploy Claude Code", "Hostinger VPS", "KVM1", "code-cloud app".
---

# Cloud Code VPS Deploy — 24/7 na Nuvem

> Fonte: `Luciana Papini — Cloud Code na VPS` (pending). Veja `claude-cowork-patterns` para uso pós-deploy.

## Quando usar

- Precisa de agente rodando sem seu PC ligado
- Quer `code-cloud` + web console + IDE remote

## Deploy (Hostinger KVM1)

1. VPS → Docker → catálogo `code-cloud` → implantar
2. Copiar `WSS` / `code-cloud` URL → salvar
3. Conectar harness (Cloud Code) via `code-cloud` CLI
4. Validar `code-cloud status` + web console

## Checklist

- [ ] VPS KVM1+ com Docker
- [ ] WSS salvo
- [ ] Agente 24/7 validado

## Via alternativa: VPS bare + assinatura + tmux (leva YouTube 2026-10-03)

Fonte: Attekita Dev `@attekitadev/Q-yobCYc71A` ("How I Keep Claude Code Running 24/7 Without Paying for Tokens", 2026-09-30). Quando Docker/code-cloud é demais, o caminho simples funciona — e usa a assinatura, não tokens de API:

1. VPS Linux (qualquer; Oracle Cloud BR = baixa latência) → SSH → instale o Cloud Code → login por **assinatura** (link no browser → cola o token; API pay-per-use sai bem mais caro).
2. `tmux new -s <nome>` → clone repos + SSH keys → rode a sessão dentro do tmux (sobrevive a queda de SSH/laptop; `tmux kill -S` para encerrar; várias sessões paralelas possíveis).
3. Controle de qualquer lugar pelo app mobile (remote control) ou outra sessão SSH.
4. Workflow que casa bem: spec→tickets (ex.: skills de spec-dev) → `implement ticket N` → revise PRs e faça merge você.

## Guardrails de madrugada (não acorde sem tokens)

- **Nunca** agente com permissão total desacompanhado à noite: branch protegida (sempre exige sua revisão) e sem merge autônomo.
- Defina os processos de qualidade antes de dormir; o custo de uma sessão solta é tokens gastos + ações indesejadas.

## Exemplo

```text
Hostinger KVM1 → Docker → catálogo code-cloud → implantar
Salva WSS + URL do console → conecta harness via CLI
Valida: code-cloud status verde + web console acessível → agente 24/7 no ar
```
