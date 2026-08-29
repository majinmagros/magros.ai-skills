---
name: fusion-harness
description: |
  Multi-model agent orchestration harness (Fusion Harness V2) — architect + builders pattern, debate/collaborate modes, cost-aware model routing, token/speed/cost tracking per model, software factory out-loop orchestration. Based on IndyDevDan's "Intelligence EXPLOSION: Harness Engineering with Pi Agent". Use quando: "fusion harness", "multi-model orchestration", "architect builder pattern", "model debate collaboration", "cost-aware agent routing", "software factory agents", "out-loop agentic coding", "combine compute don't select". Non-triggers: single-model workflows, simple sub-agent delegation, basic /task usage. Outcome: harness config + orchestration scripts (Python) + model stack registry + cost tracker + debate/collab workflows + software factory scheduler.
metadata:
  origin: ECC
  source_docs:
    - https://github.com/indydevdan/fusion-harness (repo referenciado no vídeo)
    - https://docs.anthropic.com/en/docs/claude-code/sub-agents
    - https://docs.anthropic.com/en/docs/claude-code/hooks
  skills_used:
    - agent-harness-construction
    - engenharia-de-grafos
    - graph-engineering
    - cost-aware-llm-pipeline
    - autonomous-agent-harness
    - routines
---

# Fusion Harness — Multi-Model Orchestration (Architect + Builders)

Implementa o **Fusion Harness V2** do IndyDevDan: orquestração multi-modelo com **Architect + Builders**, modos **Debate** e **Collaborate**, rastreamento de **custo/velocidade/tokens por modelo**, e conceito de **Software Factory** (out-loop agentic coding).

## Quando usar (gatilhos concretos)

- "Configure multi-model orchestration com architect + builders"
- "Quero debate entre modelos (Fable, Gemini, DeepSeek) antes de decidir"
- "Preciso de collaboration workflow: architect planeja → builders executam → architect integra"
- "Rastrear custo/tokens/latência por modelo em tempo real"
- "Software factory: agendar agentes 24/7 para trabalhar sem supervisão"
- "Combine compute don't select — usar melhor modelo para cada tarefa"
- "Model stack registry com aliases (esconder nomes dos modelos)"

## Quando NÃO usar

- Workflows single-model (Claude Code padrão já resolve)
- Delegação simples de sub-agentes (`/task` nativo)
- Orquestração que não precisa de cost tracking ou model routing

## Arquitetura (Pipeline V2)

```
┌─────────────────────────────────────────────────────────────┐
│                    FUSION HARNESS                           │
├─────────────────────────────────────────────────────────────┤
│  MODEL STACK REGISTRY                                       │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐       │
│  │ TIER    │ MODEL   │ ALIAS   │ COST/1K │ ROLE    │       │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┤       │
│  │ S       │ Fable 5 │ "Rune"  │ $15/1M  │ Architect│       │
│  │ A       │ Gem 3.7 │ "Flux"  │ $0.35/1M│ Builder  │       │
│  │ A       │ DS V4   │ "Drift" │ $0.50/1M│ Builder  │       │
│  │ A       │ Qwen3.8 │ "Local" │ $0 (loc)│ Builder  │       │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘       │
│  * Nomes reais ocultos dos agents (anti-sabotage)           │
├─────────────────────────────────────────────────────────────┤
│  WORKFLOW ENGINE                                            │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ /fh opinion  │    │ /fh debate   │    │/fh collaborate │  │
│  │ Single Q →   │    │ Thesis →     │    │ Goal → Plans   │  │
│  │ N opinions   │    │ Rounds →     │    │ → Execute →    │  │
│  │ + cost table │    │ Consensus    │    │ Integrate      │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  SOFTWARE FACTORY (Out-Loop)                                │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Variants     │    │ Scheduler    │    │ State Store    │  │
│  │ (SDLC configs)    │ (cron/webhook)   │ (markdown+lock)     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Componentes

### 1. Model Stack Registry (`config/model-stack.yaml`)
```yaml
models:
  - id: fable-5
    alias: "Rune"
    provider: anthropic
    tier: S
    cost_per_1k_in: 0.015
    cost_per_1k_out: 0.075
    max_tokens: 200000
    role: [architect, verifier]
    hidden_name: true
  - id: gemini-3.7-flash
    alias: "Flux"
    provider: google
    tier: A
    cost_per_1k_in: 0.00035
    cost_per_1k_out: 0.00035
    max_tokens: 1000000
    role: [builder, fast-research]
    hidden_name: true
  - id: deepseek-v4-pro
    alias: "Drift"
    provider: openrouter
    tier: A
    cost_per_1k_in: 0.0005
    cost_per_1k_out: 0.0005
    max_tokens: 128000
    role: [builder, deep-thinking]
    hidden_name: true
  - id: qwen-3.8-27b
    alias: "Local"
    provider: local
    tier: A
    cost_per_1k_in: 0
    cost_per_1k_out: 0
    max_tokens: 32768
    role: [builder, local-only]
    hidden_name: true
```

### 2. Orchestration Scripts (`scripts/`)

#### `fh-opinion.py` — Single Question → N Opinions + Cost Table
```python
#!/usr/bin/env python3
""" /fh opinion <question> — Query all models, show cost/latency table """
import asyncio, json, time, sys
from dataclasses import dataclass
from typing import List

@dataclass
class ModelResult:
    alias: str
    response: str
    tokens_in: int
    tokens_out: int
    latency_ms: int
    cost_usd: float

async def query_model(alias, model_id, question):
    # Usa claude -p ou API direta conforme provider
    start = time.time()
    # ... implementação provider-specific ...
    return ModelResult(...)

async def main():
    question = " ".join(sys.argv[1:])
    stack = load_model_stack()
    tasks = [query_model(m.alias, m.id, question) for m in stack.models if "builder" in m.role]
    results = await asyncio.gather(*tasks)
    
    # Tabela formatada
    print(f"{'Alias':<10} {'Latency':>8} {'In':>8} {'Out':>8} {'Cost':>8} {'Response'}")
    print("-" * 80)
    for r in results:
        print(f"{r.alias:<10} {r.latency_ms:>6}ms {r.tokens_in:>8} {r.tokens_out:>8} ${r.cost_usd:>7.4f} {r.response[:60]}...")
    
    # Architect opinion (separado, mais caro)
    arch = await query_model("Rune", "fable-5", f"Synthesize: {question}\n\nOpinions:\n" + "\n".join(f"{r.alias}: {r.response}" for r in results))
    print(f"\n🏗️  ARCHITECT (Rune): {arch.response}")

if __name__ == "__main__":
    asyncio.run(main())
```

#### `fh-debate.py` — Thesis → Debate Rounds → Consensus
```python
#!/usr/bin/env python3
""" /fh debate <thesis> — Multi-round debate with hidden model names """
import asyncio, json, sys
from dataclasses import dataclass, field
from typing import List

@dataclass
class DebateRound:
    round_num: int
    positions: dict  # alias -> position
    refutations: dict = field(default_factory=dict)
    agreements: dict = field(default_factory=dict)

async def debate_round(thesis, previous_rounds, models):
    # Cada modelo recebe thesis + rounds anteriores (nomes ocultos)
    # Retorna position/refutation/agreement
    pass

async def main():
    thesis = " ".join(sys.argv[1:])
    stack = load_model_stack()
    builders = [m for m in stack.models if "builder" in m.role]
    
    rounds = []
    for round_num in range(1, 4):  # 3 rounds default
        round_result = await debate_round(thesis, rounds, builders)
        rounds.append(round_result)
        print(f"\n=== ROUND {round_num} ===")
        for alias, pos in round_result.positions.items():
            print(f"  {alias}: {pos[:100]}...")
        
        # Check consensus
        if all_same(round_result.positions.values()):
            print(f"\n✅ CONSENSUS REACHED in round {round_num}")
            break
    
    # Final statements
    print("\n=== FINAL STATEMENTS ===")
    for alias in [m.alias for m in builders]:
        # ... final statement
        pass
```

#### `fh-collaborate.py` — Goal → Plans → Execute → Integrate
```python
#!/usr/bin/env python3
""" /fh collaborate <goal> — Architect plans, builders execute, architect integrates """
import asyncio, json, sys, subprocess
from pathlib import Path

async def main():
    goal = " ".join(sys.argv[1:])
    stack = load_model_stack()
    architect = next(m for m in stack.models if "architect" in m.role)
    builders = [m for m in stack.models if "builder" in m.role]
    
    # 1. ARCHITECT: Generate plan with task breakdown
    plan_prompt = f"""
    Goal: {goal}
    Available builders: {[m.alias for m in builders]}
    Create a task plan with:
    - Tasks (T1, T2, T3...)
    - Dependencies (T2 depends on T1)
    - Owner (which builder alias)
    - Mode (code/research/verify)
    - Risk analysis
    Output as JSON.
    """
    plan = await query_model(architect.alias, architect.id, plan_prompt)
    tasks = parse_plan(plan.response)
    
    # 2. BUILDERS: Execute assigned tasks in parallel per dependency level
    completed = {}
    for level in topological_sort(tasks):
        level_tasks = [t for t in tasks if t.level == level]
        results = await asyncio.gather(*[
            execute_task(t, completed, builders) for t in level_tasks
        ])
        for t, result in zip(level_tasks, results):
            completed[t.id] = result
            print(f"✅ {t.id} ({t.owner}): {result.summary}")
    
    # 3. ARCHITECT: Final integration + validation
    integration_prompt = f"""
    Goal: {goal}
    Completed tasks: {json.dumps(completed, indent=2)}
    Integrate all outputs, validate, produce final deliverable.
    """
    final = await query_model(architect.alias, architect.id, integration_prompt)
    print(f"\n🏗️  FINAL INTEGRATION:\n{final.response}")
    
    # Save state
    save_state(goal, tasks, completed, final.response)
```

#### `cost-tracker.py` — Real-time Cost Dashboard
```python
#!/usr/bin/env python3
""" Cost tracking per model, per session, per workflow """
import sqlite3, time, json
from contextlib import contextmanager
from dataclasses import dataclass

DB = ".fusion-harness/costs.db"

@contextmanager
def track(model_alias, operation):
    start = time.time()
    tokens_in = tokens_out = 0
    try:
        yield lambda tin, tout: (setattr(tokens_in, tin), setattr(tokens_out, tout))
    finally:
        latency = int((time.time() - start) * 1000)
        cost = calculate_cost(model_alias, tokens_in, tokens_out)
        log_to_db(model_alias, operation, tokens_in, tokens_out, latency, cost)

def dashboard():
    # Query DB, show tables per model/session/workflow
    pass
```

### 3. Software Factory Scheduler (`scripts/factory-scheduler.py`)
```python
#!/usr/bin/env python3
""" Out-loop: schedule agent variants to run autonomously """
import schedule, time, subprocess, yaml
from pathlib import Path

VARIANTS_DIR = Path(".fusion-harness/variants/")  # Cada variante = SDLC config

def run_variant(variant_name):
    """ Executa variante completa: setup → grill → spec → tickets → implement """
    variant = load_variant(variant_name)
    for phase in ["setup", "grill", "to-spec", "to-tickets", "implement"]:
        run_phase(variant, phase)

def main():
    # Carrega schedule.yaml
    # Ex: daily 02:00 → variant "nightly-refactor"
    #     on push → variant "pr-review"
    #     webhook → variant "incident-response"
    schedule.every().day.at("02:00").do(run_variant, "nightly-refactor")
    
    while True:
        schedule.run_pending()
        time.sleep(60)
```

## Comandos CLI (instalados via `pip install -e .` ou `uv tool install`)

| Comando | Descrição |
|---|---|
| `fh stack` | Mostra model stack registry (aliases, tiers, costs) |
| `fh opinion "question"` | Consulta todos builders + architect synthesis |
| `fh debate "thesis"` | Debate multi-round (3 rounds default) |
| `fh collaborate "goal"` | Architect plans → builders execute → architect integrates |
| `fh factory schedule` | Inicia software factory scheduler (daemon) |
| `fh factory run <variant>` | Executa variante SDLC específica |
| `fh cost` | Dashboard de custos (por modelo/sessão/workflow) |
| `fh cost export --csv` | Exporta CSV para análise |
| `fh variant create <name>` | Cria nova variante SDLC (template) |

## Configuração de Projeto (`.fusion-harness/`)

```
.fusion-harness/
├── config/
│   ├── model-stack.yaml      # Model registry (versão controlada)
│   ├── factory-schedule.yaml # Cron jobs + webhooks
│   └── variants/             # SDLC variants
│       ├── nightly-refactor.yaml
│       ├── pr-review.yaml
│       └── feature-build.yaml
├── scripts/                  # Scripts Python (auto-instalados)
│   ├── fh-opinion.py
│   ├── fh-debate.py
│   ├── fh-collaborate.py
│   ├── cost-tracker.py
│   └── factory-scheduler.py
├── state/                    # Estado persistente (markdown + locks)
│   ├── decisions.md          # Append-only decision log
│   ├── context.md            # Current project context
│   └── .locks/               # File locks para concorrência
├── costs.db                  # SQLite cost tracking
└── logs/                     # Structured logs (JSONL)
```

## Integração com Claude Code

### Settings.json (hooks para cost tracking automático)
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Task",
        "hooks": [{ "type": "command", "command": "python3 .fusion-harness/scripts/cost-tracker.py pretool" }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Task",
        "hooks": [{ "type": "command", "command": "python3 .fusion-harness/scripts/cost-tracker.py posttool" }]
      }
    ]
  }
}
```

### Slash Commands (`.claude/commands/`)
```
.fusion-harness/commands/
├── fh-opinion.md
├── fh-debate.md
├── fh-collaborate.md
├── fh-factory.md
└── fh-cost.md
```

Exemplo `fh-opinion.md`:
```markdown
---
name: fh-opinion
description: Query all builder models + architect synthesis on a question
---
# /fh opinion

$ARGUMENTS

!`python3 .fusion-harness/scripts/fh-opinion.py $ARGUMENTS`
```

## Regras de Ouro (do vídeo)

| Princípio | Implementação |
|---|---|
| **Combine compute, don't select** | Model stack com múltiplos tiers; architect escolhe melhor para cada task |
| **Hide model names** | Aliases (Rune/Flux/Drift) — previne sabotagem/competição entre modelos |
| **Cost transparency** | Dashboard em tempo real; exit se budget exceeded |
| **Verification layer** | Architect = verifier; stop hooks para validação determinística |
| **Out-loop > In-loop** | Software factory roda variantes SDLC agendadas; humano só reviewa |
| **State persistence** | Markdown + append-only locks; sobrevivem a reinícios |

## Validação contra Fonte (IndyDevDan Video 2026-08-25)

- [Vídeo: Intelligence EXPLOSION](https://www.youtube.com/watch?v=rqZHR-hRllI) — transcrição em `C:\projetos\Oportunidades\indyddevdan\rqZHR-hRllI.en.dedup.txt`
- Fusion Harness V2 repo: link na descrição do vídeo (a confirmar se público)
- Conceitos: `/fh opinion`, `/fh debate`, `/fh collaborate`, model aliases, cost table, software factory

## Referências

- `references/model-stack-template.yaml` — template completo com 10+ modelos
- `references/fh-opinion.py` — script completo com async providers
- `references/fh-debate.py` — debate engine com consensus detection
- `references/fh-collaborate.py` — collaboration workflow + topological sort
- `references/cost-tracker.py` — SQLite tracker + dashboard CLI
- `references/factory-scheduler.py` — APScheduler + variant runner
- `references/variant-templates/` — SDLC variant examples (nightly, PR, feature)
- `references/claude-commands/` — slash command templates
- `references/settings-hooks.json` — hooks para cost tracking automático

## Outcome Esperado

Ao instalar esta skill no projeto:
1. **`fh stack`** mostra model registry configurado
2. **`fh opinion "como implementar X?"`** → 3+ opiniões + tabela custo/latência + síntese architect
3. **`fh debate "tese controversa"`** → 3 rounds debate → consensus/rejection
4. **`fh collaborate "build feature Y"`** → plano → execução paralela → integração final
5. **`fh factory schedule`** → daemon roda variantes SDLC 24/7 (nightly refactor, PR review, etc.)
6. **`fh cost`** → dashboard custos por modelo/sessão/workflow com export CSV
7. **Hooks automáticos** rastreiam custos de sub-agentes (`Task` tool) em tempo real