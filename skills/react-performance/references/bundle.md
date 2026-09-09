# 2. Bundle Size Optimization (CRITICAL)

### Direct imports, not barrels

Barrel `index.ts` files force the bundler to walk the entire module graph even when tree-shaking removes most of it. Direct imports save 200-800ms of first-load JS in many real-world apps.

```ts
// INCORRECT
import { Button, Card, Modal } from "@/components";

// CORRECT
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Modal } from "@/components/Modal";
```

Next.js 13.5+ has [Optimize Package Imports](https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports) that automates this for listed packages — use it; manual direct imports still required for non-listed libs.

### Statically analyzable paths

```ts
// INCORRECT — defeats bundler/trace analysis
const mod = await import(`./pages/${name}`);

// CORRECT — explicit per branch
const mod = name === "home" ? await import("./pages/home") : await import("./pages/about");
```

### Dynamic imports for heavy components

```tsx
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./HeavyChart"), {
  loading: () => <Skeleton />,
  ssr: false, // when client-only
});
```

### Defer third-party scripts

Load analytics, logging, support widgets AFTER hydration. Use `next/script` with `strategy="afterInteractive"` (default) or `"lazyOnload"`.

### Conditional module loading

```tsx
if (user.role === "admin") {
  const { AdminPanel } = await import("./admin/AdminPanel");
  // ...
}
```

### Preload on hover/focus

Trigger `<link rel="preload">` or `import()` on hover so the bundle is in cache by the time the user clicks.
