---
name: agent-safety-guards
description: "Use when hardening AI agents against over-action, unintended side effects, and prompt injection — layering input validation, output filtering, tool allowlists, scope enforcement, and human approval gates. Triggers on \"agent guardrails\", \"agent safety guards\", \"prevenir over-action agente\", \"segurança agente LLM\"."
metadata:
  origin: ECC
---

# Agent Safety & Guardrails

Layered defense patterns to prevent AI agents from taking unintended or harmful actions, covering input intent-checking, output filtering, tool allowlists, scope enforcement, and human approval gates.

## When to Activate

- Deploying agents with tool access (file ops, API calls, shell commands)
- Adding authentication, payment, or data-modification capabilities
- Hardening agent loops against prompt injection and jailbreak attempts
- Setting up human-in-the-loop gates for sensitive operations

## Core Layers

1. **Input Validation**: Intent classification before execution — reject ambiguous or out-of-scope requests.
2. **Tool Allowlist & Scope**: Enforce least-privilege tool sets per agent; limit file paths, API endpoints, and command arguments.
3. **Output Filtering**: Scan model outputs for unintended actions, secrets leakage, or instruction override attempts.
4. **Human Approval Gates**: Require explicit confirmation for destructive, costly, or irreversible operations.
5. **Kill Switch & Read-Only-First**: Default to dry-run mode; enable write/execute only after validation pass.

## Best Practices

- Implement read-only-first rollout with progressive autonomy.
- Log all tool invocations with full context for auditability.
- Use deterministic hooks (PreToolUse/PostToolUse) for enforcement rather than prompt-only rules.
- Test against adversarial inputs and edge-case scenarios regularly.