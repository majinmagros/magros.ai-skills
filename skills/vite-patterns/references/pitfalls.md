### Common Pitfalls

#### Dev Does Not Match Build

Dev uses esbuild/Rolldown for transforms; build uses Rolldown for bundling. CJS libraries can behave differently between the two. Always verify with `vite build && vite preview` before deploying.

#### Stale Chunks After Deployment

New builds produce new chunk hashes. Users with active sessions request old filenames that no longer exist. Vite has no built-in solution. Mitigations:

- Keep old `dist/assets/` files live for a deployment window
- Catch dynamic import errors in your router and force a page reload

#### Docker and Containers

Vite binds to `localhost` by default, which is unreachable from outside a container:

```typescript
// vite.config.ts — Docker/container setup
server: {
  host: true,                                  // bind 0.0.0.0
  hmr: { clientPort: 3000 },                   // if behind a reverse proxy
}
```

#### Monorepo File Access

Vite restricts file serving to the project root. Packages outside root are blocked:

```typescript
// vite.config.ts — monorepo file access
server: {
  fs: {
    allow: ['..'],                             // allow parent directory (workspace root)
  },
}
```

### Anti-Patterns

```typescript
// BAD: Setting envPrefix to '' exposes ALL env vars (including secrets) to the client
envPrefix: ''

// BAD: Assuming require() works in application source code — Vite is ESM-first
const lib = require('some-lib')                // use import instead

// BAD: Splitting every node_module into its own chunk — creates hundreds of tiny files
manualChunks(id) {
  if (id.includes('node_modules')) {
    return id.split('node_modules/')[1].split('/')[0]   // one chunk per package
  }
}

// BAD: Not externalizing peer deps in library mode — causes duplicate runtime errors
// build.lib without rolldownOptions.external

// BAD: Using deprecated esbuild minifier
build: { minify: 'esbuild' }                  // use 'oxc' (default) or 'terser'

// BAD: Mutating import.meta.hot.data by reassignment
import.meta.hot.data = { count: 0 }           // WRONG: must mutate properties, not reassign
import.meta.hot.data.count = 0                 // CORRECT
```

**Process anti-patterns:**

- **`vite preview` is NOT a production server** — it is a smoke test for the built bundle. Deploy `dist/` to a real static host (NGINX, Cloudflare Pages, Vercel static) or use a multi-stage Dockerfile.
- **Expecting `vite build` to type-check** — it only transpiles. Type errors silently ship to production. Add `vite-plugin-checker` or run `tsc --noEmit` in CI.
- **Shipping `@vitejs/plugin-legacy` by default** — it bloats bundles ~40%, breaks source-map bundle analyzers, and is unnecessary for the 95%+ of users on modern browsers. Gate it on real analytics, not assumption.
- **Hand-rolling 30+ `resolve.alias` entries that duplicate `tsconfig.json` paths** — use `vite-tsconfig-paths` instead. Observed in Excalidraw and PostHog; avoid in new projects.
- **Leaving stale `node_modules/.vite` after dep changes** — pre-bundle cache causes phantom errors. Clear it when switching branches or after patching deps.

## Quick Reference

| Pattern | When to Use |
|---------|-------------|
| `defineConfig` | Always — provides type inference |
| `loadEnv(mode, root, ['VITE_'])` | Access env vars in config (explicit prefix) |
| `vite-plugin-checker` | Any TypeScript app (fills the type-check gap) |
| `vite-tsconfig-paths` | Instead of hand-rolled `resolve.alias` |
| `optimizeDeps.include` | CJS deps causing interop issues |
| `server.proxy` | Route API requests to backend in dev |
| `server.host: true` | Docker, containers, remote access |
| `server.warmup.clientFiles` | Pre-transform hot-path routes |
| `build.lib` + `external` | Publishing npm packages |
| `manualChunks` (object) | Vendor bundle splitting |
| `vite --profile` | Debug slow dev server |
| `vite build && vite preview` | Smoke-test prod bundle locally (NOT a prod server) |

## Related Skills

- `frontend-patterns` — React component patterns
- `docker-patterns` — containerized dev with Vite
- `nextjs-turbopack` — alternative bundler for Next.js
