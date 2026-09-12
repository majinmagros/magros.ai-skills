---
name: council
description: "Use when deciding under ambiguity with a four-voice council for tradeoffs and go/no-go calls. Triggers on \"council\", \"second opinions\", \"go no-go\"."
metadata:
  origin: ECC
---

# Council

Four voices (Architect + Skeptic + Pragmatist + Critic) make disagreement legible before you choose. Detalhes em `references/`.

## When to Activate

- A decision has multiple credible paths and no obvious winner
- You need explicit tradeoff surfacing before committing
- The user asks for second opinions, dissent, or multiple perspectives
- Conversational anchoring is a real risk
- A go / no-go call would benefit from adversarial challenge

## Core Principles

1. **Architect first** — initial position + 3 reasons + main risk, before others
2. **Fresh subagents** — question + compact context only, never full transcript
3. **Parallel voices** — Skeptic challenges premises, Pragmatist ships, Critic finds risk
4. **Dissent stays visible** — never dismiss a view silently; two-against-one is signal
5. **One round default** — compact phone-screen verdict; persist only real changes

## Example

```text
You are the Skeptic on a four-voice decision council.
Question: ship ECC 2.0 as alpha now, or hold for UI polish?
Respond: Position (1-2 sentences), 3 reasoning bullets, biggest Risk, one Surprise. <300 words.
```

## References

- `references/roles-workflow.md` — four lenses, question extraction, parallel launch prompt
- `references/synthesis-verdict.md` — bias guardrails, verdict shape, persistence, follow-ups
- `references/scope-related.md` — when (not) to use, anti-patterns, related, worked example

## Checklist

- [ ] Real question reduced to decision + constraints + success criteria
- [ ] Architect position written before reading external voices
- [ ] Three voices launched parallel with role prompts, no transcript anchoring
- [ ] Verdict shows consensus, strongest dissent, premise check, recommendation
