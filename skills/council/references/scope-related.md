# Scope, Anti-Patterns, Example

## When to Use

Use council when:

- a decision has multiple credible paths and no obvious winner
- you need explicit tradeoff surfacing
- the user asks for second opinions, dissent, or multiple perspectives
- conversational anchoring is a real risk
- a go / no-go call would benefit from adversarial challenge

Examples:

- monorepo vs polyrepo
- ship now vs hold for polish
- feature flag vs full rollout
- simplify scope vs keep strategic breadth

## When NOT to Use

| Instead of council | Use |
| --- | --- |
| Verifying whether output is correct | `santa-method` |
| Breaking a feature into implementation steps | `planner` |
| Designing system architecture | `architect` |
| Reviewing code for bugs or security | `code-reviewer` or `santa-method` |
| Straight factual questions | just answer directly |
| Obvious execution tasks | just do the task |

## Anti-Patterns

- using council for code review
- using council when the task is just implementation work
- feeding the subagents the entire conversation transcript
- hiding disagreement in the final verdict
- persisting every decision as a note regardless of importance

## Related Skills

- `santa-method` — adversarial verification
- `knowledge-ops` — persist durable decision deltas correctly
- `search-first` — gather external reference material before the council if needed
- `architecture-decision-records` — formalize the outcome when the decision becomes long-lived system policy

## Example

Question:

```text
Should we ship ECC 2.0 as alpha now, or hold until the control-plane UI is more complete?
```

Likely council shape:

- Architect pushes for structural integrity and avoiding a confused surface
- Skeptic questions whether the UI is actually the gating factor
- Pragmatist asks what can be shipped now without harming trust
- Critic focuses on support burden, expectation debt, and rollout confusion

The value is not unanimity. The value is making the disagreement legible before choosing.
