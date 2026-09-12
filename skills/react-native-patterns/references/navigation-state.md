# Navigation and State Separation

## Project structure (Expo Router)

File-based routing under `app/`. Keep route files thin: they read and validate params, then delegate to a screen component that lives in `components/` or `features/`.

```
app/
  _layout.tsx          # root stack
  (tabs)/
    _layout.tsx        # tab navigator
    index.tsx          # Home
  user/[id].tsx        # dynamic route
components/
features/
  user/UserProfile.tsx
```

## Navigation: validate route params

Deep links and dynamic routes deliver untrusted strings. Validate them with Zod before use.

```tsx
// app/user/[id].tsx
import { useLocalSearchParams, router } from 'expo-router'
import { z } from 'zod'
import { UserProfile } from '@/features/user/UserProfile'

const Params = z.object({ id: z.string().uuid() })

export default function UserRoute() {
  const parsed = Params.safeParse(useLocalSearchParams())
  if (!parsed.success) {
    router.replace('/not-found')
    return null
  }
  return <UserProfile userId={parsed.data.id} />
}
```

## State: keep concerns separate

Do not duplicate server data into a client store. Each concern has its own home.

| Concern | Common choices |
|---------|------|
| Server state (remote data) | a server-cache library (TanStack Query, SWR) |
| Client/UI state | a lightweight store (Zustand, Jotai) or Context |
| Route/navigation state | Expo Router params |
| Form state | a form library (e.g. React Hook Form) + schema validation |
| Secrets / tokens | `expo-secure-store` |
| Non-secret persistence | `AsyncStorage` / MMKV |

Prefer local `useState` until state genuinely needs sharing.

Do NOT use the web/React-DOM patterns here — URL-as-state, `<div>`, and SWR-for-browser do not apply to React Native.
