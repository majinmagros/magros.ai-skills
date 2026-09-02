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
