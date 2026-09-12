# Audit Workflow

## Phase 1: Scope

Define what you're auditing:

- **Target system** — what agent application?
- **Entrypoints** — how do users interact with it?
- **Model stack** — which LLM(s) and providers?
- **Symptoms** — what does the user report?
- **Time window** — when did it start?
- **Layers to audit** — which of the 12 layers apply?

## Phase 2: Evidence Collection

Gather evidence from the codebase:

- **Source code** — agent loop, tool router, memory admission, prompt assembly
- **Logs** — historical session traces, tool call records
- **Config** — prompt templates, tool schemas, provider settings
- **Memory files** — SOPs, knowledge bases, session archives

Use `rg` to search for anti-patterns:

```bash
# Tool requirements expressed only in prompt text (not code)
rg "must.*tool|必须.*工具|required.*call" --type md

# Tool execution without validation
rg "tool_call|toolCall|tool_use" --type py --type ts

# Hidden LLM calls outside main agent loop
rg "completion|chat\.create|messages\.create|llm\.invoke"

# Memory admission without user-correction priority
rg "memory.*admit|long.*term.*update|persist.*memory" --type py --type ts

# Fallback loops that run additional LLM calls
rg "fallback|retry.*llm|repair.*prompt|re-?prompt" --type py --type ts

# Silent output mutation
rg "mutate|rewrite.*response|transform.*output|shap" --type py --type ts
```

## Phase 3: Failure Mapping

For each finding, document:

- **Symptom** — what the user sees
- **Mechanism** — how the wrapper causes it
- **Source layer** — which of the 12 layers
- **Root cause** — the deepest cause
- **Evidence** — file:line or log:row reference
- **Confidence** — 0.0 to 1.0

## Phase 4: Fix Strategy

Default fix order (code-first, not prompt-first):

1. **Code-gate tool requirements** — enforce in code, not just prompt text
2. **Remove or narrow hidden repair agents** — make fallback explicit with contracts
3. **Reduce context duplication** — same info through prompt + history + memory + distillation
4. **Tighten memory admission** — user corrections > agent assertions
5. **Tighten distillation triggers** — don't compress what shouldn't be compressed
6. **Reduce rendering mutation** — pass-through, don't transform
7. **Convert to typed JSON envelopes** — structured internal flow, not freeform prose
