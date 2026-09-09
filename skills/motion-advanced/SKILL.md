---
name: motion-advanced
description: "Use when advanced motion patterns for React / Next.js — drag & drop, gestures, text animations, SVG path drawing, custom hooks, imperative sequences (useAnimate), loaders, and the full API decision tree. Requires motion-foundations. Triggers on \"motion-advanced\", \"motion advanced\", \"advanced\"."
version: 1.0
tags: [motion, animation, advanced, gestures, svg]
category: frontend
author: jeff
---

# Motion Advanced

Complex, interactive, and physics-based animation patterns.
Requires `motion-foundations` to be set up first.
Use these when `motion-patterns` is not enough. Code in `references/examples.md`.

## When to Activate

- Drag & drop interactions, gesture hooks, or physics-based release motion
- Text animations (word reveal, counters) or SVG draw-on/morph/progress rings
- Custom scroll/hover/cursor hooks or loader components
- Imperative `useAnimate` sequences or one-shot `animate()` calls

## Outputs

- Drag: draggable cards, drag-to-dismiss sheets, `Reorder.Group` lists
- Gestures: swipe detection, long press, pinch outline
- Text: word reveal, typewriter, number counter
- SVG: path draw-on, icon morph, stroke progress ring
- Hooks: `useScrollReveal`, `useHoverScale`, `useNavigationDirection`, `useInViewOnce`
- Imperative `useAnimate` sequences (interrupt-safe `async/await`)
- Loaders: spinner, shimmer, pulse dot, progress bar, button loading state

## Principles

- Physics-based motion (`useSpring`, `springs.*`) beats duration-based for direct manipulation.
- `useMotionValue` + `useTransform` derives values without re-renders.
- `useAnimate` sequences are interrupt-safe — mid-flight `animate()` cancels the previous run.
- Motion values are SSR-safe (no hydration errors).

## Rules

1. **Test drag on touch devices**, not just mouse (feel/threshold differ).
2. **Infinite animations pause when `document.visibilityState === "hidden"`.**
3. **Swipe threshold explicit** — combine `offset` + `velocity`, never velocity alone.
4. **`useAnimate` scope ref must be mounted** before `animate()` (silent throw otherwise).
5. **Never recreate motion values on render** — `useMotionValue(0)` in body, not `new MotionValue(0)`.
6. **All token values from `motion-foundations`** — no inline numbers.
7. **Custom hooks must clean up** every listener (`useEffect` return).
8. **SVG morph needs equal path command counts** — else it snaps.

## Decision Guidance

| Scenario | API |
| ------------------------------ | -------------------------------- |
| Drag with physics on release | `drag` + `dragTransition: springs.release` |
| Ordered drag-to-reorder list | `Reorder.Group` + `Reorder.Item` |
| Dismiss on drag offset | `drag="y"` + `onDragEnd` offset check |
| Swipe left/right | `drag="x"` + `onDragEnd` offset check |
| Long press | `useLongPress` hook |
| Value smoothed over time | `useSpring` |
| Value derived from another | `useTransform` |
| Multi-step sequence | `useAnimate` with `async/await` |
| One-shot imperative animation | `animate()` from `motion` |
| Text entering word by word | Stagger on `inline-block` spans |
| SVG drawing on | `pathLength` 0 → 1 |
| SVG morph | `d` attribute tween (equal commands) |
| Circular progress | `strokeDashoffset` tween |

`useSpring` (continuous, cursor/pointer-tracked, smooth interrupts) vs spring `transition` (discrete state changes, restarts from current value).

## Core Concepts

```tsx
const x = useMotionValue(0)
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
// updates every frame — no setState, no re-render

const [scope, animate] = useAnimate()
async function play() {
  await animate(".step-1", { opacity: 1 }, { duration: 0.3 })
  await animate(".step-2", { x: 0 },       { duration: 0.4 })
        animate(".step-3", { scale: 1 },    { duration: 0.25 })  // fire and forget
}
return <div ref={scope}>...</div>
```

## Constraints / Non-Goals

- Token/spring definitions → `motion-foundations`
- Standard UI patterns → `motion-patterns`
- No CSS-only, canvas/WebGL, dnd-kit systems, or game loops

## Anti-Patterns

| Anti-pattern | Rule violated | Fix |
| ---------------------------------------------- | ------- | ------------------------------------------------ |
| `drag` tested only on desktop | Rule 1 | Test on touch emulator and real device |
| `animate={{ repeat: Infinity }}` with no pause | Rule 2 | Add `visibilitychange` listener |
| `onDragEnd` checking only offset, not velocity | Rule 3 | Check both `info.offset` and `info.velocity` |
| `animate(scope, ...)` before `useEffect` | Rule 4 | Call `animate()` only after mount |
| `const x = new MotionValue(0)` in render | Rule 5 | Use `const x = useMotionValue(0)` |
| `transition={{ duration: 1.2 }}` inline | Rule 6 | Use `motionTokens.duration.crawl` |
| `useEffect` without cleanup | Rule 7 | Return `removeEventListener` / `controls.stop` |
| SVG morph between paths with different commands | Rule 8 | Normalize path commands before animating |

## Related Skills

- **`motion-foundations`** — tokens, springs, `useSafeMotion`, SSR guards. Required first.
- **`motion-patterns`** — standard UI patterns. Use before reaching for advanced ones.
