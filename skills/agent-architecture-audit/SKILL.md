---
name: agent-architecture-audit
description: "Use when full-stack diagnostic for agent and LLM applications. Audits the 12-layer agent stack for wrapper regression, memory pollution, tool discipline failures, hidden repair loops, and rendering corruption. Produces severity-ranked findings with code evidence. Triggers on \"agent-architecture-audit\", \"agent architecture audit\", \"audit\"."
metadata:
  origin: ECC
---

# Agent Architecture Audit

Diagnose agent systems hiding failures behind wrappers, stale memory, retry loops, or transport mutations. Detalhes em `references/`.

## When to Activate

- Releasing any agent or LLM-powered app to production
- Shipping features with tool calling, memory, or multi-step workflows
- Agent behavior degrades after adding wrapper layers
- Same model works in playground but breaks inside your wrapper
- Debugging agent behavior 15+ minutes without root cause
- Skip: general debugging → `agent-introspection-debugging`; benchmarks → `agent-eval`

## Core Principles

1. **Blame the wrapper first** — falsify layer regressions before blaming the model
2. **Code-gate tools** — "must use tool X" in prompt text is not enforcement
3. **Fix order is code-first** — gates, dedup context, memory admission, then prompts
4. **Evidence-backed** — every finding needs file:line or log:row + confidence
5. **Lead with severity** — critical first, no compliment padding

## Example

```bash
rg "must.*tool|required.*call" --type md
rg "completion|chat\.create|messages\.create|llm\.invoke"
rg "fallback|retry.*llm|repair.*prompt" --type py --type ts
```

## References

- `references/layers-failures.md` — 12-layer stack + 5 failure patterns
- `references/workflow.md` — scope, evidence collection, mapping, fix strategy
- `references/severity-report.md` — severity model, output format, diagnostics, schema

## Checklist

- [ ] Scope defined (target, entrypoints, model stack, symptoms, window)
- [ ] Evidence collected (code, logs, config, memory files)
- [ ] Each finding mapped to layer + root cause + confidence
- [ ] Fix plan ordered code-first with expected effects
- [ ] Report leads with severity-ranked findings, verdict direct
