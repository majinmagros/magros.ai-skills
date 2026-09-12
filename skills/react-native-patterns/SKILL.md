---
name: react-native-patterns
description: React Native and Expo app patterns — Expo Router navigation, state separation (server/client/route/form), TanStack Query data fetching with Zod, performant lists, NativeWind/StyleSheet styling, native APIs, and secure storage. Use when building or editing React Native / Expo screens, components, navigation, or data layers.
origin: ECC
---

# React Native / Expo Patterns

Practical patterns for building production React Native apps with Expo. Covers navigation, state, data fetching, lists, styling, and native APIs. Pairs with the `rules/react-native/` ruleset: rules say *what* to enforce, this skill shows *how*.

Libraries named below (NativeWind, Zustand/Jotai, TanStack Query) are common, well-established options shown for illustration — the patterns matter more than the specific package, and any equivalent works. Zod is used for validation to stay consistent with ECC's existing `typescript/` rules.

These patterns assume the managed Expo workflow (Expo Router, EAS, `expo-*` modules) on the New Architecture (the default in recent Expo SDKs, mandatory from SDK 55+). They do NOT assume the browser DOM — React Native has no `<div>`, no URL bar, and no web data-fetching defaults.

## When to Activate

Use this skill when:

- Building or editing React Native / Expo screens, components, or navigation
- Setting up routing with Expo Router (file-based `app/` directory)
- Deciding where state belongs (server cache vs client store vs route params vs form)
- Wiring data fetching with TanStack Query and validating responses with Zod
- Rendering long or heavy lists
- Choosing or applying a styling approach (NativeWind or StyleSheet)
- Accessing native device APIs (camera, location, notifications) or secure storage
- Reviewing RN code for mobile-specific issues

Do NOT use the web/React-DOM patterns here — URL-as-state, `<div>`, and SWR-for-browser do not apply to React Native.

## Core Concepts

### Project structure (Expo Router)

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

### Navigation: validate route params

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