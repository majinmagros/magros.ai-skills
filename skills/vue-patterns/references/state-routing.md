# State Management + Vue Router

## 4. State Management

### When to Use What

| Pattern | Use Case |
|---------|----------|
| `ref()` / `reactive()` | Local component state |
| Props + Emits | Parent-child communication |
| Provide / Inject | Theme, config, plugin API |
| Pinia store | Global, shared, complex state |
| Server state composable | API data with caching (wrap `fetch`/TanStack Query) |

### Pinia Setup Store (Preferred)

```ts
// stores/useCartStore.ts
export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>([]);
  const isLoading = ref(false);

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  );
  const itemCount = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  );

  async function addItem(productId: string) {
    isLoading.value = true;
    try {
      const item = await fetchProduct(productId);
      const existing = items.value.find(i => i.id === item.id);
      if (existing) existing.quantity++;
      else items.value.push({ ...item, quantity: 1 });
    } finally {
      isLoading.value = false;
    }
  }

  return { items, isLoading, totalPrice, itemCount, addItem };
});
```

- Use Setup Store syntax (not Options Store).
- Prefer actions for business-level mutations and `$patch()` for grouped updates.
- Every async action: handle loading + success + error.

## 5. Vue Router

### Route Definitions

```ts
const routes = [
  {
    path: "/users/:id",
    name: "user-detail",
    component: () => import("@/pages/UserDetail.vue"), // lazy
    props: true, // pass params as props
    meta: { requiresAuth: true },
  },
];
```

### Navigation Guards

```ts
router.beforeEach((to, from) => {
  const { isLoggedIn } = useAuthStore();
  if (to.meta.requiresAuth && !isLoggedIn) {
    return { name: "login", query: { redirect: to.fullPath } };
  }
});
```

### Reactive Route Params

When a component stays mounted but route params change:

```ts
const route = useRoute();
const id = computed(() => route.params.id as string);
watch(id, (newId) => fetchItem(newId));
```
