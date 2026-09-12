---
name: motion-patterns
description: "Use when animating buttons, modals, toasts, stagger lists, page transitions, scroll reveals, or layout animations in React/Next.js with motion. Triggers on \"motion-patterns\", \"motion patterns\", \"patterns\"."
metadata:
  origin: ECC
---

# Motion Patterns

Copy-paste UI animation patterns built on `motion-foundations` tokens and springs. Detalhes em `references/`.

## When to Activate

- Animating a button, card, modal, or toast notification
- Building list entrances with stagger
- Setting up page transitions in Next.js App Router
- Adding entrance or exit animations to conditional content
- Implementing scroll-reveal, scroll-linked progress, or sticky story sections
- Building expanding cards, accordions, or shared-element transitions

## Core Principles

1. **Tokens only** — import duration/easing/springs from `motion-foundations`, never inline numbers
2. **AnimatePresence contract** — wrapper + `key` on direct child + `exit` prop, all three
3. **Exit always** — every `initial` + `animate` pair defines `exit`
4. **`mode="wait"`** on page transitions; `viewport={{ once: true }}` on scroll reveals
5. **`layout` only** for small isolated shifts; stagger stays in `0.05–0.10s`

## Example

```tsx
"use client"
import { motion } from "motion/react"
import { springs, motionTokens } from "@/lib/motion-tokens"

<motion.button
  whileHover={{ scale: motionTokens.scale.pop }}
  whileTap={{ scale: motionTokens.scale.press }}
  transition={springs.snappy}
/>
```

## References

- `references/rules-decision.md` — 8 rules, pattern chooser, `wait`/`sync`/`popLayout`, contract
- `references/components.md` — button, stagger list, modal, toast stack, page transition
- `references/scroll-layout.md` — scroll reveal, progress bar, expanding card, crossfade, accordion
- `references/e2e-antipatterns.md` — end-to-end list, non-goals, anti-patterns table, related skills

## Checklist

- [ ] Conditional renders wrapped in `AnimatePresence` with `key` + `exit`
- [ ] Page transitions use `mode="wait"` keyed by pathname
- [ ] Tokens/springs imported, no raw duration/easing numbers
- [ ] Modal has focus trap, Escape close, scroll lock, `role="dialog"`
- [ ] Reduced motion respected via `useSafeMotion`
