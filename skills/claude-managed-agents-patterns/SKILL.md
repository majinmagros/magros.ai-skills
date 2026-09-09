---
name: claude-managed-agents-patterns
description: Use when building with Anthropic's Managed Agents SDK — Outcomes (rubric verification), Memory (3-tier: per-account + cross-account + org-wide), Sandboxing (codebase snapshots, PR generation, UX review), Briefs (meeting prep), Watchtower (cross-account fan-out + code writing). Triggers on "managed agents", "anthropic managed agents", "claude managed agents sdk", "outcomes api", "managed agent memory", "managed agent sandboxing", "briefs api", "watchtower agent".
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

Padrões validados do **Claude Managed Agents SDK** (produto Anthropic) para construir agentes gerenciados em produção. Baseado na mesa redonda oficial com fundadores (Sahaj, Mihir, Todd) demonstrando 3 casos de uso reais.

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
| Managed Agents SDK existe com APIs: Outcomes, Memory, Sandboxing, Briefs | ✅ | https://docs.anthropic.com/en/docs/managed-agents |
| Outcomes: rubric-driven iteration com independent verifier (clean context) | ✅ | https://docs.anthropic.com/en/docs/managed-agents/outcomes |
| Memory: 3 tiers — account agent (persistent), cross-account concepts, user/org preferences | ✅ | https://docs.anthropic.com/en/docs/managed-agents/memory |
| Sandboxing: codebase snapshots, PR generation, UX review on PRs | ✅ | https://docs.anthropic.com/en/docs/managed-agents/sandboxing |
| Briefs: meeting prep com pre-context, choose-not-to-show se falhar | ✅ | https://docs.anthropic.com/en/docs/managed-agents/briefs |
| Batch mode: 50-75% savings rodando 24h antes | ✅ | https://docs.anthropic.com/en/docs/managed-agents/batch |
| Build vs Buy: harness não é core competency → buy | ✅ | Video + docs |

---

## Padrões Principais

### 1. Outcomes — Rubric-Driven Verification

```python
# Padrão oficial: rubric + independent verifier + hill-climb
from anthropic import ManagedAgents

client = ManagedAgents()

# Define rubric for the outcome
rubric = {
    "criteria": [
        {"name": "correct_linkedin", "description": "Pulled correct LinkedIn for the right person", "weight": 0.3},
        {"name": "scannable_format", "description": "Information presented in easily scannable way", "weight": 0.3},
        {"name": "right_order", "description": "Person → why meeting → what to do", "weight": 0.4}
    ],
    "threshold": 0.85
}

# Agent runs with outcome verification built-in
result = client.agents.run(
    agent_id="briefs-agent",
    input={"meeting_id": "mtg_123", "attendee": "Tom Smith"},
    outcome=rubric  # Built-in verifier runs independently
)

# If verification fails, choose not to show (not false positive)
if not result.outcome_passed:
    return {"show": False, "reason": "verification_failed"}
```

**Pontos-chave:**
- Verifier roda em **context window independente** (clean context)
- Hill-climb até satisfazer rubrica
- `choose_not_to_show` > false positive
- Rubrics sincronizam com offline evals

### 2. Memory Architecture — 3 Tiers

```python
# Tier 1: Per-Account Agent (persistent, detailed, indexed)
account_agent = client.agents.create(
    name="account-agent-{account_id}",
    memory_config={
        "scope": "account",
        "persistence": "forever",
        "indexing": "custom",  # You manage indexing for query efficiency
        "corruption_protection": True
    }
)

# Tier 2: Cross-Account Concepts (managed memory)
watchtower = client.agents.create(
    name="watchtower",
    memory_config={
        "scope": "cross_account",
        "concepts": ["forecasting", "org_processes", "prioritization_rules"],
        "managed": True  # Anthropic manages this tier
    }
)

# Tier 3: User/Org Preferences (managed memory)
preferences = client.memory.managed.create(
    scope="user_org",
    keys=["prioritization_preferences", "org_workflows", "user_preferences"]
)
```

**Pontos-chave:**
- Account agent: perene, detalhado, **você indexa** para eficiência
- Cross-account: conceitos organizacionais (forecasting, processes)
- User/org: preferências, gerenciado pelo Managed Agents
- Corrupção de memória ao longo do tempo → proteção ativa

### 3. Sandboxing — Codebase Snapshots + PR Generation

```python
# Sandboxed codebase access
sandbox = client.sandboxes.create(
    source="github",
    repo="org/repo",
    permissions=["read", "write_pr"],
    secrets_policy="none"  # No secrets exposed to agent
)

# Use cases from video:
# 1. PR UX review (prevent bad UX commits)
# 2. Post-merge: update analytics, create instrumentation PRs
# 3. Nightly: funnel drop detection → suggest fixes
# 4. Agentic conversation assessment → prompt fixes
# 5. Goal: self-healing software

result = sandbox.agent.run(
    task="Review PR #42 for UX issues",
    tools=["read_code", "write_pr", "run_tests"]
)
```

**Pontos-chave:**
- Raw body obrigatório para webhook verification
- Secrets never exposed to agent
- PR generation as output action
- Nightly batch processes for funnel analysis

### 4. Briefs — Meeting Prep com Verificação

```python
brief = client.briefs.generate(
    meeting_id="mtg_123",
    hours_before=24,
    rubric={
        "correct_person": "LinkedIn matches attendee",
        "relevant_context": "Pre-context from weeks ago",
        "actionable_items": "What to get out of meeting"
    }
)

# Critical: choose not to show if verification fails
if not brief.verified:
    return {"brief": None, "reason": "could_not_verify_attendee"}
```

### 5. Watchtower — Cross-Account Fan-Out + Code Writing

```python
watchtower = client.agents.create(
    name="watchtower",
    capabilities=[
        "query_account_memory",      # Read per-account agents
        "write_code_to_query",       # Write code to query accounts
        "fan_out_to_accounts",       # Parallel work on 500 accounts
        "roll_up_feedback"           # Aggregate results
    ],
    memory_scopes=["account", "cross_account", "user", "org"]
)

# Query example: "What 5 accounts should I work on today?"
result = watchtower.run(
    input={"question": "top_5_accounts_today"},
    context={
        "account_memories": "accessible via fan_out",
        "user_preferences": "managed memory",
        "org_knowledge": "managed memory"
    }
)
```

---

## Framework Build vs Buy (Oficial)

| Critério | Build | Buy (Managed Agents) |
|---|---|---|
| Harness define qualidade do produto? | ✅ Sim | ❌ Não |
| Precisa fine-grained control? | ✅ Sim | ❌ Limitado |
| Speed to market importa? | ❌ Não | ✅ Sim |
| Early stage / validating PMF? | ❌ Não | ✅ Sim |
| Infrastructure é core competency? | ✅ Sim | ❌ Não |

> **"If you don't need to roll your own infrastructure because it's not the thing that defines the quality of what you're building, choose to buy."** — Mesa redonda Anthropic

---

## Cost Optimization Patterns

```python
# Batch mode: 50-75% savings
batch_job = client.batch.create(
    tasks=[...],  # 500 account queries
    run_at="2026-09-10T02:00:00Z",  # 24h advance
    model_allocation={
        "coordinator": "claude-opus-4",      # Frontier para coordenação
        "fan_out_workers": "claude-sonnet-4" # Barato para 500 accounts
    }
)

# Pre-warm sandboxes para latency-sensitive
prewarmed = client.sandboxes.prewarm(
    count=10,
    config={"repo": "org/repo", "branch": "main"}
)
```

---

## Eval Strategy (Oficial)

```
Phase 0: Vibes-based (internal dogfood)
    ↓
Phase 1: Internal feedback (thumbs up/down on outcomes)
    ↓
Phase 2: Customer queries + talk to user → build evals around real queries
    ↓
Phase 3: Rubrics sync offline evals + outcomes
    ↓
Partition: regression / hard scenarios / task-type cohorts
```

**Memory eval challenge:** Stateful systems com live memory → trajectory evals + offline result evals com external state

**MCP eval challenge:** Third-party mutating state → mock ou accept drift

---

## Model Migration Strategy

```python
# 1. Eval suite FIRST
eval_suite = client.evals.create(name="pre-migration-baseline")

# 2. Avoid hyper-optimization per model family
# 3. Hedge NEW FAILURE MODES per family:
#    - GPT-5 series: mais "AI telltale signs" (em dashes, sentence structures)
#    - Nova família: testar gotchas específicos antes de otimizar prompts

# 4. Cost attribution: fine-grained telemetry
cost_breakdown = client.usage.breakdown(
    by=["model", "feature", "account_tier"]
)
```

---

## Referências

- [Managed Agents Overview](https://docs.anthropic.com/en/docs/managed-agents)
- [Outcomes API](https://docs.anthropic.com/en/docs/managed-agents/outcomes)
- [Memory API](https://docs.anthropic.com/en/docs/managed-agents/memory)
- [Sandboxing API](https://docs.anthropic.com/en/docs/managed-agents/sandboxing)
- [Briefs API](https://docs.anthropic.com/en/docs/managed-agents/briefs)
- [Batch Processing](https://docs.anthropic.com/en/docs/managed-agents/batch)
- Video source: `hm8NzEd5io0.en.dedup.txt` (Claude Oficial)