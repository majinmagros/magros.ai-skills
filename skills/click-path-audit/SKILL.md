---
name: click-path-audit
description: "Use when buttons do nothing or UI state contradicts labels after shared-state refactors. Triggers on \"click-path-audit\", \"click path audit\", \"button does nothing\"."
metadata:
  origin: ECC
---

# Click-Path Audit

Trace every touchpoint handler through its full state sequence to catch silent undos. Detalhes em `references/`.

## When to Activate

- After systematic debugging finds "no bugs" but users report broken UI
- After modifying any Zustand store action (check all callers)
- After any refactor that touches shared state
- Before release, on critical user flows
- When a button "does nothing"

## Core Flow

1. **Map stores** — every action → `{sets, resets}` (`references/state-stores.md`)
2. **Trace handler** — every call in order, reads/writes/side effects
3. **Check undo** — does any later call reset an earlier call's state?
4. **Check final** — does final state match the button label promise?
5. **Check race** — async resolves, stale closures, useEffect interference

## Example

```tsx
onClick={() => {
  useEmailStore.getState().setComposeMode(true) // sets true
  useEmailStore.getState().selectThread(null)   // RESETS composeMode=false → BUG
}}
```

## References

- `references/state-stores.md` — side-effect map procedure and output format
- `references/bug-patterns.md` — 6 patterns: undo, race, closure, transition, dead path, useEffect
- `references/audit-execution.md` — 6-step trace, touchpoint template, report format, real example
- `references/scope-integration.md` — scope control, agent split, non-goals, skill integration

## Checklist

- [ ] Store side-effect map built before auditing touchpoints
- [ ] Every call traced in order with sets/resets noted
- [ ] Final state compared against button-label promise
- [ ] Bugs reported as CLICK-PATH-NNN with pattern + fix
- [ ] Each bug gets a regression test
