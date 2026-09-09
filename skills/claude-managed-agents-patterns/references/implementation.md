# Implementation — Claude Managed Agents Patterns

Código completo dos 5 padrões + batch + migration. O `SKILL.md` traz o resumo; aqui está o copy-paste.

## 1. Outcomes — Rubric-Driven Verification

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

Pontos-chave: verifier em context window independente (clean context); hill-climb até satisfazer a rubrica; `choose_not_to_show` > false positive; rubrics sincronizam com offline evals.

## 2. Memory Architecture — 3 Tiers

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

Pontos-chave: account agent perene e detalhado (você indexa); cross-account para conceitos organizacionais; user/org gerenciado; proteção ativa contra corrupção de memória. Detalhe completo em `managed-agent-memory-architecture`.

## 3. Sandboxing — Codebase Snapshots + PR Generation

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

Pontos-chave: secrets never exposed; PR generation como output; nightly batch para funnel analysis.

## 4. Briefs — Meeting Prep com Verificação

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

## 5. Watchtower — Cross-Account Fan-Out + Code Writing

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

## 6. Batch Mode — 50-75% Savings

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

Detalhe completo em `agent-cost-optimization-batch`.

## 7. Model Migration — Checklist

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

Detalhe completo em `model-migration-strategy`.
