# Templates + Performance

## 6. Template Patterns

```vue
<!-- v-if/v-else-if/v-else -->
<div v-if="isLoading">Loading...</div>
<div v-else-if="error">Error: {{ error }}</div>
<div v-else>{{ content }}</div>

<!-- v-show for frequent toggles -->
<div v-show="isOpen">Toggled content</div>

<!-- v-for with stable keys -->
<div v-for="item in items" :key="item.id">{{ item.name }}</div>

<!-- Computed filtered list (not v-if + v-for on same element) -->
<div v-for="item in activeItems" :key="item.id">{{ item.name }}</div>

<!-- Event handling -->
<form @submit.prevent="handleSubmit">
  <button type="submit">Save</button>
</form>

<!-- v-model -->
<input v-model="name" />
<CustomInput v-model="value" v-model:title="title" />
```

## 7. Performance

| Technique | When to Use |
|-----------|-------------|
| `v-memo` | List items that rarely change |
| `v-once` | Content rendered once and static forever |
| `shallowRef()` | Large data structures replaced wholesale |
| `shallowReactive()` | Only top-level properties are reactive |
| `v-show` over `v-if` | Frequent visibility toggles |
| `<KeepAlive :max="10">` | Cache toggled views |
| Lazy routes | `() => import(...)` for non-critical routes |
| `Suspense` | Async component loading with fallback |
