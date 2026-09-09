# Core — Project Structure, Components, Composables

## 1. Project Structure

### Recommended Layout (Feature-First)

```
src/
├── api/              # API client and endpoint definitions
├── assets/           # Static assets (images, fonts, icons)
├── components/       # Shared/reusable components
│   ├── base/         # Base UI primitives (Button, Input, Modal)
│   └── features/     # Feature-specific shared components
├── composables/      # Reusable Composition API logic
├── layouts/          # Page layouts (optional)
├── pages/            # Route-level page components
├── router/           # Vue Router configuration
├── stores/           # Pinia stores
├── types/            # TypeScript type definitions
├── utils/            # Pure utility functions
└── App.vue           # Root component
```

### File Naming

| Convention | When to Use |
|-----------|-------------|
| `PascalCase.vue` | All components (enforced by `vue/multi-word-component-names`) |
| `useCamelCase.ts` | Composables |
| `camelCase.ts` | Utilities, API clients, types |
| `kebab-case` directories | Route segments, feature folders |

## 2. Component Architecture

### Single-File Component Order

```vue
<script setup lang="ts">
// 1. Imports (vue → ecosystem → absolute → relative)
// 2. Props & Emits & Slots
// 3. Composables
// 4. Local state (ref/reactive)
// 5. Computed properties
// 6. Methods
// 7. Watchers
// 8. Lifecycle hooks
</script>

<template>
  <!-- Template content -->
</template>

<style scoped>
  /* Scoped styles */
</style>
```

### Presentational vs Container

- **Container components**: Own data fetching, state, and side effects. Render presentational components.
- **Presentational components**: Receive props, emit events. No API calls, no store access. Pure rendering.

### Props Best Practices

```ts
// Type-based props with defaults
interface Props {
  label: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
  items: Item[];
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  disabled: false,
});
```

- Always provide `type`, and `required`/`default` where appropriate.
- Boolean props: `isXxx`, `hasXxx`, `canXxx`.
- Never mutate props — emit events instead.
- For v-model binding, use `defineModel()` (Vue 3.4+) or `modelValue` + `update:modelValue`.

### Events

```ts
const emit = defineEmits<{
  submit: [];
  "update:modelValue": [value: string];
  select: [id: string, index: number];
}>();
```

- Use kebab-case in templates (`@update:model-value`).
- Use camelCase in script (`emit("update:modelValue", val)`).

## 3. Composables (Reusable Logic)

### Structure

```ts
// composables/useDebounce.ts
export function useDebounce<T>(value: MaybeRef<T>, delay: number): Ref<T> {
  const debounced = ref(toValue(value)) as Ref<T>;

  let timer: ReturnType<typeof setTimeout>;
  watch(
    () => toValue(value),
    (newVal) => {
      clearTimeout(timer);
      timer = setTimeout(() => { debounced.value = newVal; }, delay);
    }
  );

  onUnmounted(() => clearTimeout(timer));
  return readonly(debounced);
}
```

### Rules

- Must start with `use` prefix.
- Return reactive values (`ref`, `computed`, `reactive`), never plain primitives.
- Accept reactive inputs via `MaybeRef` / `toRef()` / `toValue()`.
- Clean up side effects in `onUnmounted` or watcher `onCleanup`.
- No module-scope side effects.

### vs Mixins

Composables replace Vue 2 mixins entirely:
- **Mixins**: Opaque data flow, source-of-truth collisions, name conflicts.
- **Composables**: Explicit imports, clear return values, composable and tree-shakable.
