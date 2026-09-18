---
name: saas-to-vps-coolify
description: Migrate SaaS spend to self-hosted VPS with Coolify: cost matrix, app+Postgres+Redis+RabbitMQ catalog, KVM sizing with CPU validation, backup, WhatsApp proxy. Use quando a conta SaaS aperta, para sair de Neon/Vercel/Redis/N8N cloud, montar stack em Coolify, dimensionar VPS. Triggers PT: sair do SaaS, migrar para VPS, stack Coolify, baratear infra, KVM2 KVM4. Triggers EN: saas to vps, self-host stack, coolify deploy, cut saas cost, vps sizing.
---

# SaaS → VPS Coolify

Troque aluguel SaaS por VPS própria com conta feita — e com validação, não promessa.

> Caveat: preços de vídeo/promo variam; anedota single-host não é teste de carga.
> Esta skill é playbook com validação em cada passo, não garantia de economia.

## Quando usar

- Conta SaaS mensal aperta (DB + deploy + fila + automação somados).
- Stack padrão: app (Next/React/Node) + Postgres + Redis + RabbitMQ + workers.
- Time aceita operar Linux básico (SSH, backup, update). Se não, não migre.

## Quando NÃO migrar

- HA real exigida (multi-AZ, SLA contratual), compliance que proíbe single-host.
- Time sem ninguém on-call: VPS sem dono vira incidente de madrugada.
- Carga desconhecida e crítica: meça primeiro (APM/logs do SaaS atual) antes de dimensionar.

## Passos

1. **Inventário + tabela custo** — liste cada SaaS: serviço, plano, custo/mês, uso real (storage, banda, execuções). Some o total. Ex. típico: NeonDB + Vercel + Redis Cloud + N8N Cloud + RabbitMQ + Evolution ≈ R$400/mês vs KVM2 R$43 + KVM4 R$59.
2. **Topologia 2 VPS** — KVM2 (proxy Traefik + agentes + Evolution + Postgres leve) + KVM4 Coolify (apps + Postgres + PgAdmin + PgBouncer + Redis + RabbitMQ + workers). Separe entrada (proxy) de carga (apps/dados).
3. **Sizing com validação** — KVM2 aguenta starter (2 vCPU/8GB/100GB); KVM4 multi-projeto com folga. Após 7 dias, confira CPU/mem reais (alvo: <50% em pico). Estourou? Vertical antes de horizontal.
4. **Catálogo Coolify** — 1 serviço por bloco: app (repo privado/público/Dockerfile/template), Postgres (+PgBouncer p/ pool), Redis, RabbitMQ, workers. Cada bloco com healthcheck + restart policy.
5. **Backup + domínio** — backup automático (semanal grátis / diário pago, teste restore 1x/mês), domínio com ano grátis quando houver, Evolution atrás de proxy para não tomar bloqueio.
6. **Deploy e corte** — suba em paralelo, espelhe tráfego ou rode shadow por 48h, corte o DNS, mantenha SaaS antigo 1 ciclo de fatura como rollback. Desligue só após 7 dias verdes.

## Regras

- NUNCA migre sem a tabela de custo medido do mês atual — chute não é business case.
- NUNCA single-host sem backup testado. Sem restore testado, não há backup.
- KVM pequena primeiro: escale por métrica (CPU/mem 7 dias), não por ansiedade.
- WhatsApp/Evolution sempre atrás de proxy; número bloqueado não tem rollback.
- Reuso: sizing base em `vps-guided-install`, deploy 24/7 de agentes em `cloud-code-vps-deploy`, Evolution em `whatsapp-evolution-go`.

## Related skills

- `vps-guided-install` — sizing e hardening bare-metal.
- `cloud-code-vps-deploy` — path one-click de agentes 24/7.
- `whatsapp-evolution-go` — Evolution API.
- `n8n-agentic-flows` — orquestração (avalie self-host do N8N no passo 1).
