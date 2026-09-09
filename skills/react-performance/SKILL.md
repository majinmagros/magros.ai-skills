---
name: react-performance
description: React and Next.js performance optimization patterns adapted from Vercel Engineering's React Best Practices (https://github.com/vercel-labs/agent-skills). Organizes 70+ rules across 8 priority categories — waterfalls, bundle size, server-side, client fetching, re-render, rendering, JS micro-perf, advanced. Use when writing, reviewing, or refactoring React/Next.js code for performance.
metadata:
  origin: ECC
---

# React Performance

Performance patterns for React 18/19 + Next.js, adapted from [Vercel Labs `react-best-practices`](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) (MIT v1.0.0). Rules by priority; full code in `references/`.

## When to Activate

- Writing, reviewing, or refactoring React/Next.js code for performance
- Eliminating waterfalls, cutting bundle size, or fixing slow interactions (INP/LCP/CLS)

## Priority Index

| Priority | Category | Prefix | When it matters |
|---|---|---|---|
| 1 — CRITICAL | Eliminating Waterfalls | `async-` | `await` followed by independent `await` |
| 2 — CRITICAL | Bundle Size | `bundle-` | First-load JS, route imports, third-party libs |
| 3 — HIGH | Server-Side | `server-` | RSC, Server Actions, API routes, SSR |
| 4 — MEDIUM-HIGH | Client Fetching | `client-` | SWR / TanStack Query / raw `fetch` |
| 5 — MEDIUM | Re-render | `rerender-` | High-frequency updates, parent-child fan-out |
| 6 — MEDIUM | Rendering | `rendering-` | Long lists, animations, hydration |
| 7 — LOW-MEDIUM | JavaScript | `js-` | Hot loops, frequent allocations |
| 8 — LOW | Advanced | `advanced-` | Effect-event integration, stable refs |

## Rules by Category (resumo — código em `references/`)

**1. Waterfalls** (`waterfalls.md`): cheap sync conditions before `await`; defer awaits into using branch; `Promise.all` for independent work; start-early/await-late; `<Suspense>` near data (+ skeleton); RSC parallel via composition (split siblings into children).

```ts
// waterfall típico → paralelo:
const [user, posts, followers] = await Promise.all([getUser(id), getPosts(id), getFollowers(id)]);
```

**2. Bundle** (`bundle.md`): direct imports over barrels (200-800ms saved); statically analyzable dynamic paths; `next/dynamic` for heavy components; `next/script` afterInteractive/lazyOnload; conditional `import()`; preload on hover. Plus Next 13.5+ Optimize Package Imports.

**3. Server** (`server.md`): auth+authorize INSIDE every Server Action; `React.cache()` per-request dedupe; LRU/`unstable_cache` cross-request; no duplicate RSC serialization (lift client up); hoist static I/O to module scope; no mutable module state (use `headers()`/cookies/async context); minimize client props; `Promise.all` per nested item; `after()` for post-response work.

**4. Client fetching** (`client-rerender.md`): SWR/TanStack (never DIY `useEffect`+fetch for shared data); singleton scroll listener; `{ passive: true }`; versioned minimal localStorage.

**5. Re-render** (`client-rerender.md`): `useStore.getState()` in callbacks (not subscriptions); `memo` + hoisted `EMPTY` defaults; primitive effect deps; derived booleans; derive during render (never `useEffect` setState); functional `setState`; lazy initializer; no memo for primitives; split hooks; logic in handlers; `startTransition`/`useDeferredValue`; `useRef` for transient values; never define components inside components.

**6. Rendering** (`rendering-js.md`): animate wrapper not SVG; `content-visibility: auto` + intrinsic size; hoist static JSX; SVG precision 2 decimals; inline script for pre-hydration values; narrow `suppressHydrationWarning`; `<Activity>` over mount/unmount; ternary over `&&`; `useTransition` loading; `preload`/`preconnect`; `defer`/`async` scripts.

**7. JS micro-perf** (`rendering-js.md`): batch DOM writes; `Map` lookups; cache `.length`; memoize pure fns; cache localStorage reads; single-pass `flatMap`; length-first checks; early returns; hoisted RegExp; loop min/max; `Set` membership; `toSorted`; `requestIdleCallback`.

**8. Advanced** (`rendering-js.md`): stable `useEffectEvent` values out of deps; handler refs for memoized children; module-flag singletons; `useLatest`.

## Automated Tools

Next 13.5+ Optimize Package Imports · React Compiler (demotes manual memo to review-only when shipped) · Turbopack · `@next/bundle-analyzer`.

## Lighthouse / Web Vitals Mapping

| Metric | Categories |
|---|---|
| **LCP** | Waterfalls, Bundle, Resource Hints |
| **INP** | Re-render, Rendering, JavaScript |
| **CLS** | Rendering (Suspense placement, image dimensions) |
| **TBT** | Bundle, JavaScript, Defer Third-Party |
| **FID** (legacy) | Bundle, Hydration |

## Related

- Skills: [react-patterns](../react-patterns/SKILL.md), [react-testing](../react-testing/SKILL.md), [frontend-patterns](../frontend-patterns/SKILL.md), [accessibility](../accessibility/SKILL.md), [nextjs-turbopack](../nextjs-turbopack/SKILL.md)
- Rules: [rules/react/](../../rules/react/)
- Agents: `react-reviewer` enforces these rules; `react-build-resolver` handles build failures
- Commands: `/react-review`, `/react-build`, `/react-test`

## Attribution

Adapted from Vercel Labs `react-best-practices` (MIT, Vercel Engineering, v1.0.0 Jan 2026). [Upstream](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) has the full 70-rule catalog with extended examples.
