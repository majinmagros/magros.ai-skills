### Build Optimization

#### Manual Chunks

```typescript
// vite.config.ts — build.rolldownOptions
build: {
  rolldownOptions: {
    output: {
      // Object form: group specific packages
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-popover'],
      },
    },
  },
}
```

```typescript
// Function form: split by heuristic
manualChunks(id) {
  if (id.includes('node_modules/react')) return 'react-vendor'
  if (id.includes('node_modules')) return 'vendor'
}
```

### Performance

#### Avoid Barrel Files

Barrel files (`index.ts` re-exporting everything from a directory) force Vite to load every re-exported file even when you import a single symbol. This is the #1 dev-server slowdown flagged by the official docs.

```typescript
// BAD — importing one util forces Vite to load the whole barrel
import { slash } from '@/utils'

// GOOD — direct import, only the one file is loaded
import { slash } from '@/utils/slash'
```

#### Be Explicit with Import Extensions

Each implicit extension forces up to 6 filesystem checks via `resolve.extensions`. In large codebases, this adds up.

```typescript
// BAD
import Component from './Component'

// GOOD
import Component from './Component.tsx'
```

Narrow `tsconfig.json` `allowImportingTsExtensions` + `resolve.extensions` to only the extensions you actually use.

#### Warm-Up Hot-Path Routes

`server.warmup.clientFiles` pre-transforms known hot entries before the browser requests them — eliminating the cold-load request waterfall on large apps.

```typescript
// vite.config.ts
server: {
  warmup: {
    clientFiles: ['./src/main.tsx', './src/routes/**/*.tsx'],
  },
}
```

#### Profiling Slow Dev Servers

When `vite dev` feels slow, start with `vite --profile`, interact with the app, then press `p+enter` to save a `.cpuprofile`. Load it in [Speedscope](https://www.speedscope.app) to find which plugins are eating time — usually `buildStart`, `config`, or `configResolved` hooks in community plugins.

### Library Mode

When publishing an npm package, use `build.lib`. Two footguns matter more than config detail:

1. **Types are not emitted** — add `vite-plugin-dts` or run `tsc --emitDeclarationOnly` separately.
2. **Peer dependencies MUST be externalized** — unlisted peers get bundled into your library, causing duplicate-runtime errors in consumers.

```typescript
// vite.config.ts
build: {
  lib: {
    entry: 'src/index.ts',
    formats: ['es', 'cjs'],
    fileName: (format) => `my-lib.${format}.js`,
  },
  rolldownOptions: {
    external: ['react', 'react-dom', 'react/jsx-runtime'],  // every peer dep
  },
}
```

### SSR Externals

Bare `createServer({ middlewareMode: true })` setups are framework-author territory. Most apps should use Nuxt, Remix, SvelteKit, Astro, or TanStack Start instead. What you *will* tweak as a framework user is the externals config when deps break in SSR:

```typescript
// vite.config.ts — ssr options
ssr: {
  external: ['node-native-package'],           // keep as require() in SSR bundle
  noExternal: ['esm-only-package'],            // force-bundle into SSR output (fixes most SSR errors)
  target: 'node',                              // 'node' or 'webworker'
}
```

### Dependency Pre-Bundling

Vite pre-bundles dependencies to convert CJS/UMD to ESM and reduce request count.

```typescript
// vite.config.ts — optimizeDeps
optimizeDeps: {
  include: [
    'lodash-es',                              // force pre-bundle known heavy deps
    'cjs-package',                            // CJS deps that cause interop issues
    'deep-lib/components/**',                 // glob for deep imports
  ],
  exclude: ['local-esm-package'],             // must be valid ESM if excluded
  force: true,                                // ignore cache, re-optimize (temporary debugging)
}
```
