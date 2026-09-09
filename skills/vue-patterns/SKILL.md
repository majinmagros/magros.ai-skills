---
name: vue-patterns
description: "Use when vue.js 3 Composition API patterns, component architecture, reactivity best practices, Pinia state management, Vue Router navigation, and Nuxt SSR patterns. Activates for Vue, Nuxt, Vite, or Pinia projects. Triggers on \"vue-patterns\", \"vue patterns\", \"patterns\"."
origin: ECC
---

# Vue.js Patterns and Best Practices

Comprehensive guide for Vue.js 3 development using Composition API (`<script setup>`), covering component design, reactivity, state management, routing, testing, and SSR patterns. Nuxt-specific guidance is included where it differs from vanilla Vue. Code in `references/`.

## When to Activate

Activate this skill when:
- The project uses Vue.js (any version), Nuxt, Vite + Vue, or Pinia.
- The user asks about Vue component architecture, composables, reactivity, or state management.
- Reviewing Vue Single-File Components (`.vue` files).
- Setting up Vue Router, Pinia stores, or Vite/Vitest configuration.
- Discussing Vue-specific performance, security, or SSR patterns.

## Sections (resumo — código em `references/`)

- **1-3 Core** (`core.md`): feature-first layout + naming table; SFC order (imports→props→composables→state→computed→methods→watchers→lifecycle); presentational vs container; typed props (`withDefaults`, `defineModel`); typed emits (kebab template/camel script); composables (`use` prefix, `MaybeRef`, cleanup, no module side effects, replace mixins)
- **4-5 State + Router** (`state-routing.md`): ref/reactive → props/emits → provide/inject → Pinia → server composable; Pinia setup store (actions + loading/error); lazy route components + `props: true`; `beforeEach` auth guard with redirect; reactive params via `computed` + `watch`
- **6-7 Templates + Perf** (`templates-perf.md`): v-if/v-show/v-for (+ stable keys, computed lists, no v-if+v-for); v-model (incl. multi); perf table (`v-memo`, `v-once`, `shallowRef`, `v-show`, `KeepAlive`, lazy routes, `Suspense`)
- **8-10 Testing + Nuxt + 3.5** (`testing-nuxt.md`): Vitest + Test Utils + pinia/testing + Playwright; component test pattern; Nuxt auto-imports, `useAsyncData`/`useFetch` (keys), server routes (zod params), runtime config (server vs public); Vue 3.5 reactive destructure (watch via getter), `useTemplateRef`, `onWatcherCleanup`, `useId`, `defer` Teleport, lazy hydration

## Anti-Patterns

| Anti-Pattern | Why It's Wrong | The Fix |
|-------------|---------------|---------|
| Destructuring `defineProps()` (Vue < 3.5) | Captures snapshot, loses reactivity | Access via `props.xxx` or use `toRefs()` |
| `watch()` on destructured prop (Vue 3.5+) | Compile-time error — destructured props can't be watched directly | Use getter wrapper: `watch(() => count, ...)` |
| `v-if` + `v-for` on same element | Ambiguous execution order | Use computed filtered array |
| `v-for` key = index | Broken state on reorder | Use stable database IDs |
| Mutating props | Violates one-way data flow | Emit events or use `v-model` |
| `v-html` with user content | XSS vulnerability | Sanitize with DOMPurify |
| Mixins in Vue 3 | Opaque, collision-prone | Replace with composables |
| Module-scope side effects in composable | Shared across instances | Scope in `onMounted` + `onUnmounted` |
| `reactive()` for replaceable state | Replacement breaks reactivity | Use `ref()` instead |
| Watcher without cleanup | Memory leaks, race conditions | Use `onCleanup` or `onWatcherCleanup()` (Vue 3.5+) |
| Options API in new Vue 3 code | Ecosystem move to Composition API | Use `<script setup>` |
| Plain ref for template references | No dynamic ref support, name-matching fragile | Use `useTemplateRef()` (Vue 3.5+) |

```vue
<!-- SFC order + typed props + Pinia + Router in one glance -->
<script setup lang="ts">
import { useCartStore } from "@/stores/useCartStore";
const props = withDefaults(defineProps<{ label: string; variant?: "primary" | "secondary" }>(), { variant: "primary" });
const cart = useCartStore();
</script>
```

## Related Skills

- `accessibility` — ARIA, semantic HTML, focus management
- `frontend-patterns` — Cross-framework frontend architecture
- `typescript` — TypeScript best practices applied to Vue projects
- `coding-standards` — General code quality standards
