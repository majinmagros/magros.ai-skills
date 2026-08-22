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
```

```bash
# 1. Subir
docker compose -f docker-compose.go.yml up -d
# 2. Criar instância
curl -X POST http://localhost:8080/instance/create \
  -H "apikey: $EVO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"instanceName":"vendas01","qrcode":true,"integration":"WHATSAPP-BAILEYS"}'
# 3. QR Code
curl http://localhost:8080/instance/connect/vendas01 -H "apikey: $EVO_API_KEY"
# 4. Listar
curl http://localhost:8080/instance/fetchInstances -H "apikey: $EVO_API_KEY"
```

Docs: `https://docs.evolutionfoundation.com.br/evolution-go` · Repo: `https://github.com/evolution-foundation/evolution-go` (626⭐, Apache 2.0, Go 1.24+, whatsmeow)

## 4. Webhooks e eventos

### Evolution GO
- Tipos: `webhook`, `websocket`, `amqp/rabbitmq`, `nats` — configure por instância
- Eventos: `QRCODE_UPDATED`, `CONNECTION_UPDATE`, `MESSAGES_UPSERT`, `MESSAGES_UPDATE`, `SEND_MESSAGE` status
- Swagger interativo em `/docs` (OpenAPI) após subir o container

```json
// webhook payload exemplo
{
  "event": "messages.upsert",
  "instance": "vendas01",
  "data": {
    "key": {"remoteJid":"5511988887777@s.whatsapp.net","fromMe":false},
    "message": {"conversation":"olá"},
    "pushName": "Cliente"
  }
}
```

### n8n bridge

| Nó | Uso |
|---|---|
| **Webhook Trigger** (Evolution) | Recebe `messages.upsert` |
| **IF / Switch** | Filtra `fromMe`, grupo vs privado |
| **Agente MCP / AI** | Classifica intenção, chama tools via MCP |
| **Evolution Send** | `POST /message/sendText/{instance}` |
| **Guardrail Code** | Valida JSON, bloqueia segredos, rate-limit |

> Separe **orquestração (n8n)** de **inteligência (agente MCP)** — ver `n8n-agentic-flows:19`.

## 5. Multi-instância e operações

### Criar N instâncias
```bash
for n in vendas01 vendas02 suporte01; do
  curl -X POST http://localhost:8080/instance/create \
    -H "apikey: $EVO_API_KEY" -d "{\"instanceName\":\"$n\",\"qrcode\":true}"
done
```

### Checklist mínimo antes de ir a prod
- [ ] Domínio/subdomínio + HTTPS (QR e webhooks exigem)
- [ ] Tokens fora de fluxos expostos (`.env`, secrets manager, não commitado)
- [ ] Backup de volumes (postgres + mídia) e teste de restore
- [ ] Logs centralizados (API + containers + n8n)
- [ ] Monitoramento CPU/mem/disco/filas (Redis/AMQP)
- [ ] Documentar destino de cada webhook por instância
- [ ] Regras anti-ban: sem disparo agressivo, intervalar envios, respeitar opt-in, evitar grupos sem consentimento
- [ ] Atualizar imagens em janela planejada (Meta muda protocolo → Baileys/whatsmeow pode quebrar)

## 6. Quando NÃO usar WhatsApp Web (GO/API)

- Número principal da empresa sem backup → use Cloud API
- Precisa templates HSM, botões/listas com SLA → Cloud API
- Setor regulado (saúde/financeiro) → Cloud API
- Operação só de envio em massa sem consentimento → nenhuma stack é adequada (risco legal + ban)

## 7. Integração com skills ECC

| Skill | Relação |
|---|---|
| `n8n-agentic-flows` | Orquestração visual + guardrails antes/depois do nó de IA |
| `messages-ops` | Leitura/inspeção de threads ao vivo (separar mailbox vs DM) |
| `automation-audit-ops` | Auditar fluxos n8n/Evolution antes de escalar |
| `mcp-server-patterns` | Expor tools locais ao agente (DB, APIs) via MCP |

## 8. Validação oficial (2026-08-22)

| Claim | Fonte oficial |
|---|---|
| Evolution GO = Go + whatsmeow, 626⭐, Apache 2.0, docs `docs.evolutionfoundation.com.br/evolution-go`, stack Go 1.24 + net/http + PostgreSQL + Swagger + Docker + RabbitMQ/MinIO | https://github.com/evolution-foundation/evolution-go + https://docs.evolutionfoundation.com.br/evolution-go |
| Evolution API = Node/TS + Baileys/WPPConnect + Redis/PostgreSQL, integra n8n/Typebot/Chatwoot/OpenAI/Dify/Flowise | https://docs.evolutionfoundation.com.br/en/evolution-api |
| Cloud API custo por conversa, verificação Business, templates HSM, webhook hub.challenge | https://developers.facebook.com/docs/whatsapp/cloud-api |
| WhatsApp Web viola ToS, risco ban intensificado 2025-26, depender de Baileys/whatsmeow quebra com update de protocolo | https://www.whatsapp.com/legal/terms-of-service + https://blog.tipefy.com/api-oficial-do-whatsapp-vs-evolution-api-e-baileys-o-que-muda-na-pratica-para-sua-empresa |
| GO vs API teto 150 vs 20 instâncias (HostGator NVMe2) é teto comercial, não benchmark de produção | https://runzos.com/evolution-go-vs-evolution-api-vs-crm-hostgator-2026 |

## Referências

- Evolution GO repo: https://github.com/evolution-foundation/evolution-go
- Evolution GO docs: https://docs.evolutionfoundation.com.br/evolution-go
- Evolution API docs: https://docs.evolutionfoundation.com.br/en/evolution-api
- Evolution Foundation: https://evolutionfoundation.com.br
- Vídeo origem: `nxvWxQ9Q-6E` — @Sujeitoprogramador (2026-05-21)

