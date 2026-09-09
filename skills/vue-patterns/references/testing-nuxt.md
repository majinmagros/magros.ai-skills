# Testing + Nuxt + Vue 3.5+ APIs

## 8. Testing

### Stack

- **Vitest** for unit and component tests
- **Vue Test Utils** for mounting and interaction
- **@pinia/testing** for store mocking
- **Playwright** for E2E

### Component Test Pattern

```ts
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import UserCard from "./UserCard.vue";

beforeEach(() => { setActivePinia(createPinia()); });

it("renders and emits", async () => {
  const wrapper = mount(UserCard, {
    props: { user: { id: "1", name: "Alice" } },
  });
  expect(wrapper.text()).toContain("Alice");
  await wrapper.find("button").trigger("click");
  expect(wrapper.emitted("select")![0]).toEqual(["1"]);
});
```

## 9. Nuxt-Specific Patterns

### Auto-Imports

Nuxt auto-imports `ref`, `computed`, `watch`, `useFetch`, `useAsyncData`, etc. Use them directly without importing. For non-Nuxt projects, always import explicitly.

### useAsyncData / useFetch

```ts
const { data: user, pending, error, refresh } = await useAsyncData(
  "user", // unique key for caching
  () => $fetch(`/api/users/${id}`),
);

const { data: posts } = await useFetch("/api/posts", {
  query: { page: 1 },
  key: "posts-page-1", // dedupes requests
});
```

### Server Routes

```ts
// server/api/users/[id].ts
export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.string().uuid(),
  }).parse);
  // ... fetch and return
});
```

### Runtime Config

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // server-only
    apiSecret: "",
    // public (exposed to client)
    public: {
      apiBase: "https://api.example.com",
    },
  },
});
```

## 10. Vue 3.5+ New APIs

### Reactive Props Destructure

Vue 3.5 stabilized reactive props destructure — destructured variables from `defineProps()` are automatically reactive:

```ts
// Vue 3.5+: destructured props are reactive (no need for toRefs)
const { count = 0, msg = "hello" } = defineProps<{
  count?: number;
  msg?: string;
}>();

// Limitation: cannot watch destructured prop directly
watch(() => count, (newVal) => { ... }); // PASS getter required
```

### `useTemplateRef()`

Replace name-matched plain refs with `useTemplateRef()` for template references:

```ts
import { useTemplateRef } from "vue";
const inputEl = useTemplateRef<HTMLInputElement>("input");
// "input" matches the ref="input" attribute in template, not the variable name
```

Supports dynamic ref IDs: `useTemplateRef(dynamicRefId)`.

### `onWatcherCleanup()`

Globally importable watcher cleanup API (Vue 3.5+). It must be called synchronously inside the watcher callback:

```ts
import { watch, onWatcherCleanup } from "vue";

watch(userId, async (newId) => {
  const controller = new AbortController();
  onWatcherCleanup(() => controller.abort());
  // ... fetch with signal
});
```

### `useId()`

SSR-stable unique ID generation for form elements and accessibility:

```ts
import { useId } from "vue";
const id = useId();
```

### `defer` Teleport

`<Teleport defer>` allows teleporting to targets rendered in the same cycle:

```vue
<Teleport defer to="#container">Content</Teleport>
<div id="container"></div>
```

### Lazy Hydration (SSR)

`defineAsyncComponent()` now supports `hydrate` strategy:

```ts
import { defineAsyncComponent, hydrateOnVisible } from "vue";
const AsyncComp = defineAsyncComponent({
  loader: () => import("./Comp.vue"),
  hydrate: hydrateOnVisible(),
});
```
