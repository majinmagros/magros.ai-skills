---
name: managed-agent-memory-architecture
description: Use when implementing 3-tier memory for managed agents — per-account persistent agents, cross-account concepts, user/org preferences. Triggers on "managed agent memory", "per-account agent memory", "cross-account memory", "three-tier memory", "account agent fleet".
metadata:
  origin: ECC
  source_docs:
    - https://docs.anthropic.com/en/docs/managed-agents/memory
  video_source: "hm8NzEd5io0 - How founders build on Claude Managed Agents (Claude Oficial)"
  related_skills:
    - unified-memory
    - context-ledger
    - agent-swarm-ops
    - autonomous-agent-harness
---

# Skill: managed-agent-memory-architecture — Memória 3 Tiers (Managed Agents)

Arquitetura oficial do **Managed Agents SDK** em 3 níveis. Código completo em `references/implementation.md` (Tier 1) e `references/watchtower.md` (Tiers 2-3 + Watchtower).

## Quando usar

- Você está usando **Managed Agents SDK** e precisa arquitetar memória
- Precisa de **frotas de agents por conta** (um agent por conta, perene)
- Precisa de **conceitos cross-account** (forecasting, processos organizacionais)
- Precisa de **preferências user/org** gerenciadas pelo SDK
- Quer evitar **corrupção de memória** ao longo do tempo
- Precisa de **indexação eficiente** para queries em larga escala

## Quando NÃO usar

- Memory patterns genéricos → use `unified-memory`, `context-ledger`
- Single agent com memória simples → use `autonomous-agent-harness`
- Swarm coordination → use `agent-swarm-ops`
- RAG corporativo → use `rag-corporativo-seguro`

---

## Os 3 Tiers (resumo)

| Tier | Escopo | Persistência | Quem gerencia |
|---|---|---|---|
| **1. Per-account agents** | Um agent por account, memória detalhada | Forever (segue lifecycle) | **Você** (indexação custom + proteção) |
| **2. Cross-account concepts** | Forecasting, prioritization, org processes | Longo prazo | SDK (`managed: true`) |
| **3. User/org preferences** | Workflows, field semantics, preferências | Longo prazo | SDK (`managed: true`) |

```
Tier 1 (100 agents, detalhado, você indexa)
   │ roll up
   ▼
Tier 2 (conceitos org, gerenciado) ──→ Watchtower (fan-out + roll-up)
   │ shared
   ▼
Tier 3 (user/org, gerenciado)
```

---

## Tier 1: Per-Account Agents (O Core)

- **Escopo:** um agent por account (100 accounts = 100 agents), contexto completo, detalhado
- **Indexação custom — você implementa** (ElasticSearch, pgvector, inverted index)
- **Corrupção:** risco real → checks nightly (consistency, freshness >90d, schema, cross-refs) + auto-repair/alerta

> *"We manage ourselves, because we have to index it in certain ways to make it efficiently queryable."* — Mihir. Salesforce tem 30 campos deprecated com o mesmo significado: a indexação precisa entender **seu** schema.

Código: `AccountMemoryRecord`, `PerAccountMemoryManager` (update com corruption protection), `CustomIndexer`, `AccountAgent`, `MemoryCorruptionProtector` → `references/implementation.md`.

---

## Tier 2 + Tier 3 + Watchtower (resumo)

- **Tier 2:** forecasting rules, deal stages, prioritization, field mappings — aprendido cross-account, gerenciado
- **Tier 3:** sales methodology (MEDDIC/SPICED/CHAMP), approval workflows, territory definitions — gerenciado
- **Watchtower:** consome os 3 tiers; fan-out paralelo para N account agents → aplica prioritization → roll-up ("top 5 accounts today")

Código: `CROSS_ACCOUNT_CONCEPTS`, `UserOrgPreferences`, `WatchtowerAgent`, matriz de decisão → `references/watchtower.md`.

---

## Integração com Skills Existentes

| Skill | Relação |
|---|---|
| `unified-memory` | Vault para handoff entre harnesses; Managed Agents = runtime memory |
| `context-ledger` | Ledger cronológico; Managed Agents = memory operacional estruturada |
| `agent-swarm-ops` | Swarm = peer-to-peer; Managed Agents = hub-and-spoke (Watchtower) |
| `autonomous-agent-harness` | Harness genérico; Managed Agents = SDK específico Anthropic |

---

## Referências

- [Managed Agents Memory](https://docs.anthropic.com/en/docs/managed-agents/memory)
- `references/implementation.md` — Tier 1 completo
- `references/watchtower.md` — Tiers 2-3, Watchtower, matriz de decisão
- Video: `hm8NzEd5io0.en.dedup.txt` — linhas 253-385, 469-470, 510-520, 545-565, 715-765
