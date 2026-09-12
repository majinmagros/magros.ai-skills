### Environment Variables

Vite loads `.env`, `.env.local`, `.env.[mode]`, and `.env.[mode].local` in that order (later overrides earlier); `*.local` files are gitignored and meant for local secrets.

#### Client-Side Access

Only `VITE_`-prefixed vars are exposed to client code:

```typescript
import.meta.env.VITE_API_URL   // string
import.meta.env.MODE            // 'development' | 'production' | custom
import.meta.env.BASE_URL        // base config value
import.meta.env.DEV             // boolean
import.meta.env.PROD            // boolean
import.meta.env.SSR             // boolean
```

#### Using Env in Config

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())          // VITE_ prefixed only (safe)
  return {
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
    },
  }
})
```

### Security

#### `VITE_` Prefix is NOT a Security Boundary

Any variable prefixed with `VITE_` is **statically inlined into the client bundle at build time**. Minification, base64 encoding, and disabling source maps do NOT hide it. A determined attacker can extract any `VITE_` var from the shipped JavaScript.

**Rule:** Only public values (API URLs, feature flags, public keys) go in `VITE_` vars. Secrets (API tokens, database URLs, private keys) MUST live server-side behind an API or serverless function.

#### The `loadEnv('')` Trap

```typescript
// BAD: passing '' as the third arg loads ALL env vars — including server secrets —
// and makes them available to inline into client code via `define`.
const env = loadEnv(mode, process.cwd(), '')

// GOOD: explicit prefix list
const env = loadEnv(mode, process.cwd(), ['VITE_', 'APP_'])
```

#### Source Maps in Production

Production source maps leak your original source code. Disable them unless you upload to an error tracker (Sentry, Bugsnag) and delete locally afterward:

```typescript
build: {
  sourcemap: false,                                  // default — keep it this way
}
```

#### `.gitignore` Checklist

- `.env.local`, `.env.*.local` — local secret overrides
- `dist/` — build output
- `node_modules/.vite` — pre-bundle cache (stale entries cause phantom errors)

### Server Proxy

```typescript
// vite.config.ts — server.proxy
server: {
  proxy: {
    '/foo': 'http://localhost:4567',                    // string shorthand

    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,                               // needed for virtual-hosted backends
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

For WebSocket proxying, add `ws: true` to the route config.
