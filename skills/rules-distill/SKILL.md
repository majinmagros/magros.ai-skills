---
name: rules-distill
description: "Use when scan skills to extract cross-cutting principles and distill them into rules — append, revise, or create new rule files. Triggers on \"rules-distill\", \"rules distill\", \"distill\"."
metadata:
  origin: ECC
---

# Rules Distill

Scan installed skills, extract cross-cutting principles, and distill them into rules. Detalhes em `references/`.

## When to Activate

- Periodic rules maintenance (monthly or after installing new skills)
- After a skill-stocktake reveals patterns that should be rules
- When rules feel incomplete relative to the skills being used
- Before a major release, to consolidate duplicated guidance

## Core Principles

1. **Deterministic collection, LLM judgment** — scripts gather facts, LLM cross-reads and verdicts
2. **2+ skills evidence** — single-skill principles stay in that skill
3. **What, not How** — principles only; code examples stay in skills
4. **Link back** — drafts include `See skill: [name]`
5. **Never auto-apply** — every candidate needs user approval

## Example

```bash
bash ~/.claude/skills/rules-distill/scripts/scan-skills.sh
bash ~/.claude/skills/rules-distill/scripts/scan-rules.sh
# then cross-read analysis → report → approve/modify/skip per candidate
```

## References

- `references/inventory.md` — Phase 1: scan scripts + inventory report
- `references/cross-read.md` — Phase 2: batching, subagent prompt, verdicts
- `references/review-execution.md` — Phase 3: report table, approval, results.json
- `references/example-principles.md` — end-to-end run + design principles

## Checklist

- [ ] Inventory scanned (skills + rules index)
- [ ] Every candidate has 2+ skills evidence + violation risk
- [ ] Verdict assigned (Append/Revise/New Section/New File/Covered/Too Specific)
- [ ] User approved each applied candidate explicitly
- [ ] Results saved to results.json (UTC timestamp, kebab-case IDs)
