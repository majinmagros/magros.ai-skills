---
name: motion-ui
description: "Production-ready UI motion system for React/Next.js. Use when implementing animations, transitions, or motion patterns."
metadata:
  origin: ECC
---

# Motion System v4.2

Production-ready UI motion system for React / Next.js. Focused on **performance, accessibility, and usability** — not decoration. Code in `references/examples.md`.

## When to Use

Use this motion system when motion:

* Guides attention (e.g., onboarding, key actions)
* Communicates state (loading, success, error, transitions)
* Preserves spatial continuity (layout changes, navigation)

**Appropriate:** interactive components, state transitions, navigation/layout continuity. **Avoid:** purely decorative, usability-reducing, or performance-harming motion.

## How It Works

**Core principle:** motion must guide attention, communicate state, or preserve spatial continuity. If none → remove it.

```bash
npm install motion   # motion/react modern; framer-motion legacy — DO NOT MIX (breaks AnimatePresence)
```

```ts
// Tokens (motionTokens.ts): duration fast 0.18 / normal 0.35 / slow 0.6;
// easing smooth [0.22,1,0.36,1], sharp [0.4,0,0.2,1]; distance sm 8 / md 16 / lg 24
<motion.div initial={{ opacity: 0, y: motionTokens.distance.md }} animate={{ opacity: 1, y: 0 }} />
```

**Performance:** animate only transform + opacity (never width/height/top/left). Responsiveness > smoothness.

**Device adaptation:** low-end = `deviceMemory <= 2` OR (no memory API AND cores <= 4) → shorter durations.

**Accessibility:** `useReducedMotion()` (JS), `prefers-reduced-motion` CSS, Tailwind `motion-safe:`/`motion-reduce:` variants.

## Patterns

| Scenario | Pattern |
|---|---|
| Hover / tap feedback | `whileHover` / `whileTap` |
| Reveal on scroll | `whileInView` |
| Scroll-linked value | `useScroll` + `useTransform` |
| Conditional mount/unmount | `AnimatePresence` (always explicit `mode`) |
| Small layout shifts (< ~300px) | `layout` prop |
| Large reflows | Avoid `layout` (jank/CLS) — CSS transitions or routing |
| Complex imperative sequences | `useAnimate` |

**`AnimatePresence` mode:** `"wait"` for modals/toasts/page transitions; `"popLayout"` for lists/tabs/dismissible cards; `"sync"` (default) only when overlap is intentional. Shared elements → unique `layoutId`.

**Modal essentials:** focus trap + Escape close + scroll lock + ARIA roles + `mode="wait"`. Full component in `references/examples.md`. Advanced concepts (parallax, scroll storytelling, 3D tilt, crossfade, clip reveal, skeleton, micro-interactions, springs) map to examples there.

**SSR:** match initial states server/client; always explicit `initial`; `"use client"` in App Router.

## Debugging & QA

Check: mixed imports · missing `"use client"` · missing `key` on AnimatePresence children · hydration mismatch · `layout` on large containers · state-driven animation not triggering.

QA: no CLS · keyboard works · focus trapped · ARIA correct · reduced motion respected · no hydration warnings · clean unmount · explicit `mode` everywhere.

## Anti-Patterns

Layout-property animation · purposeless infinite loops · stagger > 0.1s · ignored reduced motion · `layout` on full-viewport containers · omitted `mode` · decoration-only motion.

## Philosophy

> Motion is interaction design. If motion does not improve UX → remove it.

## Examples

Button, reduced-motion fade, stagger list, AnimatePresence modal, scroll parallax, skeleton, shared layout → `references/examples.md`.
