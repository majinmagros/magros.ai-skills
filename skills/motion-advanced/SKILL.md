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