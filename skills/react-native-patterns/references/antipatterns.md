# Anti-Patterns, Best Practices, Related Skills

## Anti-Patterns

```tsx
// WRONG: large array mapped inside a ScrollView (no virtualization, janky, high memory)
<ScrollView>{items.map((i) => <Row key={i.id} item={i} />)}</ScrollView>
// RIGHT: FlatList / FlashList

// WRONG: server data copied into a client store (two sources of truth, stale data)
const useStore = create((set) => ({ users: [], setUsers: (u) => set({ users: u }) }))
useEffect(() => { getUsers().then(setUsers) }, [])
// RIGHT: useQuery owns server state; derive what you need

// WRONG: tokens in AsyncStorage (not encrypted)
await AsyncStorage.setItem('auth_token', token)
// RIGHT: expo-secure-store

// WRONG: trusting deep-link params
const { id } = useLocalSearchParams(); fetchUser(id)
// RIGHT: validate with Zod before use

// WRONG: inline style object recreated every render on a hot path
<View style={{ padding: 16, backgroundColor: '#fff' }} />
// RIGHT: StyleSheet.create at module scope, or NativeWind className

// WRONG: real secret shipped in the bundle
const STRIPE_SECRET = 'sk_live_...'
// RIGHT: keep privileged calls server-side; ship only public keys protected by backend rules
```

## Best Practices

- Keep route files thin; put logic in screen components and `use*` hooks.
- Validate every external input (API responses, route params, push payloads) with Zod.
- Let TanStack Query own server state; keep client stores small.
- Always render loading, error, and empty states — never just a spinner with no fallback.
- Virtualize lists; memoize `renderItem`; provide a stable `keyExtractor`.
- Use `react-native-reanimated` for animation (UI thread); avoid heavy work on the JS thread.
- Store tokens in `expo-secure-store`; never trust the client for authorization.
- Respect safe areas, Dynamic Type, and accessibility roles/labels from the start.
- Confirm New Architecture compatibility for every native dependency before release.

## Related Skills

- `frontend-patterns` — React/Next.js (web) patterns; useful for shared React concepts, but DOM-specific.
- `coding-standards` — TypeScript/JavaScript idioms that apply to RN code.
- `tdd-workflow`, `e2e-testing` — testing process (use Jest + React Native Testing Library, Maestro/Detox for RN).
- `security-review` — general security checklist that complements the RN bundle/secret guidance above.

Pairs with the `rules/react-native/` ruleset: rules say *what* to enforce, this skill shows *how*.
