---
name: claude-managed-agents-patterns
description: Use when building with Anthropic's Managed Agents SDK — Outcomes, Memory (3-tier), Sandboxing, Briefs, Watchtower. Triggers on "managed agents", "outcomes api", "managed agent memory", "sandboxing", "briefs api", "watchtower agent".
metadata:
  origin: ECC
  source_docs:
    - https://docs.anthropic.com/en/docs/managed-agents
    - https://docs.anthropic.com/en/docs/managed-agents/outcomes
    - https://docs.anthropic.com/en/docs/managed-agents/memory
    - https://docs.anthropic.com/en/docs/managed-agents/sandboxing
    - https://docs.anthropic.com/en/docs/managed-agents/briefs
  video_source: "hm8NzEd5io0 - How founders build on Claude Managed Agents (Claude Oficial)"
---

# Skill: claude-managed-agents-patterns — Padrões Oficiais do Managed Agents SDK

Padrões validados do **Claude Managed Agents SDK** (produto Anthropic) para agentes gerenciados em produção. Baseado na mesa redonda oficial com fundadores (Sahaj, Mihir, Todd). Código copy-paste em `references/implementation.md`.

## Quando usar

- Você está integrando **Managed Agents SDK** no seu produto
- Precisa de **Outcomes** (verificação por rubrica com verifier independente)
- Precisa de **Memory** gerenciada (3 níveis: per-account + cross-account + org-wide)
- Precisa de **Sandboxing** (codebase snapshots, PR generation, UX review)
- Precisa de **Briefs** (meeting prep automatizado)
- Precisa de **Watchtower** (cross-account agent fan-out + code writing)
- Quer seguir o framework **Build vs Buy** oficial da Anthropic

## Quando NÃO usar

- Agentes customizados sem Managed Agents SDK → use `autonomous-agent-harness`, `agent-harness-construction`
- Orquestração simples de sub-agentes → use `sessoes-orquestradas`, `agent-swarm-ops`
- Memory patterns genéricos → use `unified-memory`, `context-ledger`
- Verificação genérica → use `verification-loop`, `loop-design-check`, `santa-method`

---

## Validação Oficial (2026-09-09)

| Claim | Status | Fonte |
|---|---|---|
| Managed Agents SDK: Outcomes, Memory, Sandboxing, Briefs | ✅ | https://docs.anthropic.com/en/docs/managed-agents |
| Outcomes: rubric-driven iteration, independent verifier | ✅ | https://docs.anthropic.com/en/docs/managed-agents/outcomes |
| Memory: 3 tiers (account, cross-account, user/org) | ✅ | https://docs.anthropic.com/en/docs/managed-agents/memory |
| Sandboxing: snapshots, PR generation, UX review | ✅ | https://docs.anthropic.com/en/docs/managed-agents/sandboxing |
| Briefs: pre-context, choose-not-to-show se falhar | ✅ | https://docs.anthropic.com/en/docs/managed-agents/briefs |
| Batch mode: 50-75% savings rodando 24h antes | ✅ | https://docs.anthropic.com/en/docs/managed-agents/batch |
| Build vs Buy: harness não é core competency → buy | ✅ | Video + docs |

---

## Os 5 Padrões (resumo — código em `references/`)

**1. Outcomes** — rubric + verifier independente (clean context) + hill-climb; `choose_not_to_show` > false positive. Detalhe em `outcome-rubric-verification`.

```python
result = client.agents.run(agent_id="briefs-agent", input={...}, outcome=rubric)
if not result.outcome_passed:
    return {"show": False, "reason": "verification_failed"}
```

**2. Memory 3 tiers** — Tier 1 per-account (perene, você indexa) → Tier 2 cross-account (gerenciado) → Tier 3 user/org (gerenciado). Detalhe em `managed-agent-memory-architecture`.

**3. Sandboxing** — snapshots do repo, `secrets_policy="none"`, PR UX review, nightly funnel analysis, self-healing software.
