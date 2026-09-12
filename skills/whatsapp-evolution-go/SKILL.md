---
name: whatsapp-evolution-go
description: Use quando precisar integrar WhatsApp via API self-hosted — escolher e operar Evolution GO vs Evolution API vs WhatsApp Cloud oficial, subir instâncias, QR Code, webhooks/AMQP/NATS, multi-instância e ponte n8n/Typebot/Chatwoot. Triggers em "evolution api", "evolution go", "whatsapp api", "whatsapp automation", "multi instância whatsapp", "webhook whatsapp", "n8n whatsapp", "qrcode whatsapp".
metadata:
  origin: ECC
---

# Skill: WhatsApp Evolution GO — Infra WhatsApp Self-Hosted

Integração WhatsApp self-hosted com escolha consciente de stack, deploy previsível e automação via webhooks/n8n.

## 1. Escolha a stack (decida antes de instalar)

| Critério | **Evolution GO** | **Evolution API** | **WhatsApp Cloud API (Meta oficial)** |
|---|---|---|---|
| **Stack** | Go 1.24+ + `whatsmeow` (WhatsApp Web) | Node.js/TS + Baileys/WPPConnect | Infra Meta (BSP ou Cloud API direta) |
| **Foco** | Escala + baixo consumo (muitas instâncias) | Integrações + ecossistema n8n/Typebot/Chatwoot/OpenAI/Dify | Conformidade + SLA + estabilidade |
| **Protocolo** | WhatsApp Web (engenharia reversa) | WhatsApp Web + opção Meta Cloud (algumas versões) | Protocolo autorizado Meta |
| **Risco de ban** | **Sim** — viola ToS, Meta intensificou bans 2025-26 | **Sim** — mesmo risco Web | **Não** — verificado, suporte contratual |
| **Instâncias por VPS (ex. HostGator NVMe2)** | até 150 (teto comercial) | até 20 (teto comercial) | limite da Meta (qualidade do número) |
| **Quando usar** | Muitos números, teto de instâncias é gargalo | Fluxos n8n/Typebot/Chatwoot já existem | Operação crítica, saúde/financeiro/educação, precisa SLA |

> Teto comercial ≠ garantia de produção. Consumo real depende de mensagens, mídia, webhooks e automações. Teste com sua carga.

**Regra:** se a rota exige conformidade (LGPD, setores regulados) ou número crítico → **Cloud API oficial**. Se precisa de grupos/enquetes/typing presence sem equivalente oficial e aceita risco calculado → GO/API com número descartável e regras anti-ban.

## 2. Pré-requisitos por stack

### Evolution GO
- Docker + PostgreSQL (opcional mas recomendado) + MinIO/S3 para mídia
- Variáveis: licença (se aplicável), `AUTHENTICATION_API_KEY`, `QRCODE_LIMIT`
- Endpoints: `GET /instance/fetchInstances`, `POST /instance/create`, `GET /instance/connect/{instance}` (QR Code)

### Evolution API
- Docker Compose oficial: API + frontend + Redis + PostgreSQL (todos obrigatórios)
- Baileys/WPPConnect como provider; suporte a `WPPConnect` em algumas versões
- Integração nativa: n8n, Typebot, Chatwoot, OpenAI, Dify, Flowise

### Cloud API (Meta)
- Conta Business verificada na Meta, número verificado, templates HSM aprovados
- Custo por conversa: service (cliente inicia, 24h grátis) vs marketing/utilidade/autenticação (pago, varia por região)
- Webhook verificado via `hub.challenge` + assinatura `X-Hub-Signature-256`

## 3. Deploy (GO — recomendado para escala)

```yaml
# docker-compose.go.yml (resumo)
services:
  evolution-go:
    image: evoapicloud/evolution-go:latest
    ports: ["8080:8080"]
    environment:
      - AUTHENTICATION_TYPE=apikey
      - AUTHENTICATION_API_KEY=${EVO_API_KEY}
      - DATABASE_ENABLED=true
      - DATABASE_CONNECTION_URI=postgres://user:pass@postgres:5432/evolution
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://redis:6379
      - STORAGE_TYPE=minio
    depends_on: [postgres, redis]

  postgres:
    image: postgres:16
  redis:
    image: redis:7-alpine