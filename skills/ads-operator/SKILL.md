---
name: ads-operator
description: Use when operating paid-traffic accounts through an AI agent — audit Google Ads / Meta Ads accounts, propose budget/bid/audience changes, execute mutations via API with human approval, and keep a hypothesis log per client. Triggers on "otimiza minha campanha", "audita a conta de ads", "pausa palavra cara", "escala o conjunto vencedor", "relatório de tráfego pago", "Google Ads via agente", "Meta Ads via agente", "ads operator". Non-triggers: competitor intel only (use analise-concorrentes), ad copy/angles with no account changes (use marketing-campaign). Outcome: audited account + approved change plan + executed mutations + hypothesis log.
metadata:
  origin: ECC
  module: business-content
  cost: high
  stability: beta
  defaultInstall: false
---

# Skill: ads-operator — Operação de Tráfego Pago via Agente

Opera contas de Google Ads e Meta Ads em loop fechado: **auditar (leitura) →
propor (plano + hipótese) → aprovar (humano, obrigatório p/ escrita) →
executar (API direta) → logar (hipótese por cliente)**. Baseado nos workflows
dos vídeos Ratos de IA (`Ji_E_Y92hmE`, `BuNVNP7FZUo`, `eavvcO-90Hk`, `5LyNOEOsVcU`).

## Validação Oficial

| Claim | Status | Fonte |
|---|---|---|
| Google Ads MCP oficial, Python, **read-only** (`list_accessible_customers`, `search` GAQL, `get_resource_metadata`) | ✅ | https://developers.google.com/google-ads/api/docs/developer-toolkit/mcp-server + https://github.com/googleads/google-ads-mcp |
| Meta Ads MCP oficial, remoto `https://mcp.facebook.com/ads`, cria/gerencia via agente (app + permissão `ads_mcp_management`) | ✅ | https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-mcp-server/ads-mcp-server-overview + blog 2026-07-16 |
| Google Ads API mutations (write) via client libraries | ✅ | https://developers.google.com/google-ads/api |
| Meta Marketing API campaign/adset/ad structure | ✅ | https://developers.facebook.com/docs/marketing-api |
| Token Lean (MCP 55–135k/sessão vs API direta ~5k) | ⚠️ vindo de 1 vídeo (`BuNVNP7FZUo`), não validado — medir no seu uso | vídeo, confirmar com `cost-aware-llm-pipeline` |

## Quando usar / NÃO usar

- **Usar**: auditar conta, propor e executar mudanças (pausar, trocar budget/lance, negativar termos, escalar conjunto), rotina de monitoramento (ex.: tráfego 7h), relatório multi-conta com dados reais.
- **NÃO usar**: só espionar concorrente → `analise-concorrentes`; só criar copy/ângulo sem mexer na conta → `marketing-campaign`; sentimento de mercado → `pesquisa-social`.

## Pipeline

### 0. Pré-requisitos (uma vez por cliente)

- Google: developer token + OAuth/service account; MCP oficial p/ leitura (ver `references/google-ads.md`).
- Meta: app com use case "Create & manage ads" + `ads_mcp_management` Advanced Access; MCP remoto p/ leitura (ver `references/meta-ads.md`).
- Registrar: contas, fuso, moeda, CPA/ROAS alvo, teto de gasto por mudança.

### 1. Auditar (sempre read-only primeiro)

- Google: `list_accessible_customers` → GAQL (`search`) em campanhas/grupos/termos: gasto, conversões, CPA, status, budget.
- Meta: listar contas → insights por campanha/adset/ad (gasto, CPA/ROAS, frequência, status).
- Entregar achados com números + ids exatos (nunca "parece caro" sem dado).

### 2. Propor (plano + hipótese, sem executar)

Para cada mudança: **o quê** (id + campo + valor atual → novo), **por quê**
(dado da auditoria), **impacto esperado**, **risco/teto** (ex.: "≤R$X/dia").
Formato padrão: tabela + 1 hipótese testável por mudança ("se pausar termo Y,
CPA cai ~Z% em 7 dias").

### 3. Aprovar (gate humano OBRIGATÓRIO para escrita)

- Nenhuma mutação sem `APROVADO` explícito do humano (no chat, ex.: "aprovado A1/A2").
- Mudanças de budget/lance acima do teto registrado → re-aprovação mesmo em rotina.
- Ver `agent-guardrails` p/ padrão approval-gate.

### 4. Executar (API direta, não MCP, p/ escrita)

- Google: mutations via Google Ads API (client library); Meta: Marketing API
  (Graph). MCPs oficiais servem p/ leitura/descoberta — escrita repetida via
  API é mais barata em tokens e mais controlável.
- Uma mudança por vez; confirmar retorno da API antes da próxima.
- Dry-run quando disponível (ex.: validar GAQL antes de mutar).

### 5. Logar (hipótese por cliente/pasta)

Append-only por cliente: data, mudança, hipótese, resultado após janela
(ex.: 3–7 dias), veredito (manter/reverter/escalar). Rotina sugere
revisitar logs vencidos (`routines`).

## Regras

- **Nunca mutar sem aprovação explícita** — leitura é livre, escrita é gated.
- **Nunca inventar id, métrica ou status** — tudo vem da API/MCP na sessão.
- **Teto por mudança**: sem teto registrado, propor teto antes de executar.
- **Rollout gradual dos MCPs**: rodar `tools/list` na sessão — a lista de tools
  muda (contas/limites por rollout); não assumir tool que o vídeo mostrava.
- **Multi-conta**: prefixar toda ação com conta + fuso; nunca aplicar plano de
  uma conta em outra.
- **Erros de API** (token, permissão, limite): reportar + pausar lote, não retry cego.

## Chaining sugerido

`analise-concorrentes` (intel) → `ads-operator` (execução) → `marketing-campaign`
(copy dos vencedores) → `ads-operator` (log + próxima hipótese).

## Aceite (eval da skill)

1. Auditoria cita só números vindos da API/MCP (zero achismo).
2. 100% das mutações têm `APROVADO` registrado antes.
3. Log por cliente atualizado após cada execução.
4. Nenhuma mutação fora do teto sem re-aprovação.
5. Custo em tokens da operação cai vs sessão equivalente só-MCP (medir 3 sessões).
