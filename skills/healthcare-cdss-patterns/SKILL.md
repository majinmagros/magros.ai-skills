---
name: healthcare-cdss-patterns
description: "Use when clinical Decision Support System (CDSS) development patterns. Drug interaction checking, dose validation, clinical scoring (NEWS2, qSOFA), alert severity classification, and integration into EMR workflows. Triggers on \"healthcare-cdss-patterns\", \"healthcare cdss patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Healthcare CDSS Patterns

Pure-function safety engine for EMR: interactions, dose validation, NEWS2 scoring. Detalhes em `references/`.

## When to Activate

- Implementing drug interaction checking
- Building dose validation engines (weight/age/renal)
- Implementing clinical scores (NEWS2, qSOFA, APACHE, GCS)
- Designing alert systems for abnormal clinical values
- Medication order entry with safety checks
- Interpreting lab results with clinical context

## Core Principles

1. **Pure functions, zero side effects** — input data, output alerts; fully testable
2. **Block, don't pass** — missing weight on mg/kg drug is a failure
3. **Bidirectional pairs** — A×B implies B×A
4. **Critical never toasts** — block + documented override in audit trail
5. **100% pass criteria** — one missed interaction is a safety event

## Example

```typescript
const alerts = checkInteractions('warfarin', ['aspirin'], ['penicillin']);
// [{ severity: 'critical', pair: ['warfarin','aspirin'], ... }]
```

## References

- `references/interactions.md` — engine diagram, checkInteractions, bidirectional rule
- `references/dose-validation.md` — validateDose: weight, age, renal, absolute max
- `references/scoring-alerts.md` — NEWS2 types, severity table, UI behavior
- `references/testing.md` — safety suite, examples, anti-patterns

## Checklist

- [ ] NEWS2 tables match Royal College of Physicians spec exactly
- [ ] Every pair tested both directions; malformed input never throws
- [ ] Weight-missing blocks mg/kg drugs with `weight_missing`
- [ ] Critical alerts modal + override reason in audit trail
- [ ] No `any` types, no silent catches, no hardcoded pairs
