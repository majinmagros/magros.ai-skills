# Motion Foundations — Outputs, Principles, Rules, Tokens, Springs

## Outputs

This skill produces:

- A shared `motionTokens` object (duration, easing, distance, scale)
- A shared `springs` preset map (5 named configs)
- A `shouldAnimate()` gate used by all components
- Accessibility-compliant animation defaults via `useReducedMotion`
- SSR-safe initial states with zero hydration warnings

## Principles

Motion must do at least one of the following or it must be removed:

- Guide attention
- Communicate state
- Preserve spatial continuity

Responsiveness always outranks smoothness. A 60 fps animation that causes
input delay is worse than no animation.

## Rules

These are non-negotiable. They apply to every component in the system.

1. **Use `motion/react` only.** Never import from `framer-motion`. Never mix the two in the same tree.
2. **`initial` must match server output.** If the server renders `opacity: 1`, the `initial` prop must also be `opacity: 1`. No exceptions.
3. **Reduced motion overrides everything.** When `useReducedMotion()` returns `true` or `prefersReduced` is `true`, all transforms are disabled. Opacity-only fades at ≤ 0.2s are the only permitted fallback.
4. **Never animate layout properties.** `width`, `height`, `top`, `left`, `margin`, `padding` are banned from `animate`. Use `transform` and `opacity` only.
5. **All token values come from `motionTokens`.** Hardcoded durations and easings in component files are forbidden.
6. **All spring configs come from the `springs` map.** Inline `stiffness`/`damping` values are forbidden.
7. **`"use client"` is required** on every file that imports from `motion/react`.
8. **Never read `window` or `navigator` at module level.** Always guard with `typeof window !== "undefined"`.

## Token System

```ts
// lib/motion-tokens.ts
export const motionTokens = {
  duration: {
    instant: 0.08,
    fast:    0.18,
    normal:  0.35,
    slow:    0.6,
    crawl:   1.0,
  },
  easing: {
    smooth: [0.22, 1, 0.36, 1],
    sharp:  [0.4, 0, 0.2, 1],
    bounce: [0.34, 1.56, 0.64, 1],
    linear: [0, 0, 1, 1],
  },
  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 48,
  },
  scale: {
    subtle: 0.98,
    press:  0.95,
    pop:    1.04,
  },
}

export const springs = {
  snappy:  { type: "spring", stiffness: 300, damping: 30 },
  gentle:  { type: "spring", stiffness: 120, damping: 14 },
  bouncy:  { type: "spring", stiffness: 400, damping: 10 },
  instant: { type: "spring", stiffness: 600, damping: 35 },
  release: { type: "spring", stiffness: 200, damping: 20, restDelta: 0.001 },
}
```

## Runtime Flags

```ts
// lib/motion-config.ts
export const motionConfig = {
  isLowEnd() {
    return (
      typeof navigator !== "undefined" &&
      navigator.hardwareConcurrency <= 4
    )
  },

  prefersReduced() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
  },

  shouldAnimate({ essential = false } = {}) {
    if (this.prefersReduced()) return false
    if (!essential && this.isLowEnd()) return false
    return true
  },

  duration() {
    return this.isLowEnd() || this.prefersReduced()
      ? motionTokens.duration.instant
      : motionTokens.duration.normal
  },
}
```

## Decision Guidance

### Choosing a duration

| Token | Use when |
| --------- | -------------------------------------------- |
| `instant` | Tooltip show/hide, focus ring, badge update |
| `fast` | Button feedback, icon swap, chip toggle |
| `normal` | Modal open, card expand, page element enter |
| `slow` | Hero entrance, full-page transition |
| `crawl` | Deliberate storytelling; use sparingly |

### Choosing a spring

| Preset | Use when |
| --------- | ------------------------------------------ |
| `snappy` | Default UI — buttons, chips, nav items |
| `gentle` | Cards, modals, panels landing softly |
| `bouncy` | Playful moments — empty states, onboarding |
| `instant` | Tooltips, popovers, dropdowns |
| `release` | Drag release — natural physics feel |

### When to disable animation entirely

Disable (make `shouldAnimate()` return `false`) when:

- `prefersReduced` is `true`
- `isLowEnd` is `true` and the animation is non-essential
- The element is off-screen and will never enter the viewport
- The animation is purely decorative with no UX purpose
