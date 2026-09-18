---
name: ai-first-engineering
description: "Use when engineering operating model for teams where AI agents generate a large share of implementation output. Triggers on \"ai-first-engineering\", \"ai first engineering\", \"engineering\"."
metadata:
  origin: ECC
---

# AI-First Engineering

Use this skill when designing process, reviews, and architecture for teams shipping with AI-assisted code generation.

## When to Use

- "Our team now ships mostly AI-generated code"
- "Reviews are drowning in style nits"
- "Define acceptance criteria for agent-built features"
- "Make this codebase more agent-friendly"
- "Hiring rubric for AI-first engineers"

## Example

Acceptance criteria before any agent implementation:

```markdown
Done when:
- [ ] regression suite green on touched domains
- [ ] edge cases asserted explicitly
- [ ] rollout plan reviewed
```

## Process Shifts

1. Planning quality matters more than typing speed.
2. Eval coverage matters more than anecdotal confidence.
3. Review focus shifts from syntax to system behavior.

## Architecture Requirements

Prefer architectures that are agent-friendly:
- explicit boundaries
- stable contracts
- typed interfaces
- deterministic tests

Avoid implicit behavior spread across hidden conventions.

## Code Review in AI-First Teams

Review for:
- behavior regressions
- security assumptions
- data integrity
- failure handling
- rollout safety

Minimize time spent on style issues already covered by automation.

## Hiring and Evaluation Signals

Strong AI-first engineers:
- decompose ambiguous work cleanly
- define measurable acceptance criteria
- produce high-signal prompts and evals
- enforce risk controls under delivery pressure

## Testing Standard

Raise testing bar for generated code:
- required regression coverage for touched domains
- explicit edge-case assertions
- integration checks for interface boundaries

## Three Disciplines — checklists operáveis (leva YouTube rodada 7)

Expansão do resumo Batch 17j em checklist + ADR:

1. **Anti-surrender (não aceite sem pensar)** — antes de ler o output da IA, escreva
   seu palpite em 1 linha; depois compare. Pergunte sempre: o que a IA está
   assumindo? O que provaria que está errado? Qual a alternativa? Exija explicação
   SEM a IA por perto + em palavras próprias + com responsável nomeado.
2. **Anti-debt (sistema que alguém entende)** — review de arquitetura, não só de
   diff. Decisões escritas em palavras humanas via `architecture-decision-records`.
   Rode ownership: ninguém é dono permanente de módulo gerado por IA.
3. **Anti-orchestration-tax (N agentes, 1 cérebro)** — padronize formato de evidência,
   exceções sobre rotina, batch de decisões similares, automatize checks chatos,
   escalation claro. Ver `attention-architecture` (durante-run) e
   `swarm-readiness-gate` (pré-run).
