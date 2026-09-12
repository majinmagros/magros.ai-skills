### Plugins

#### Essential Plugins

Most plugin needs are covered by a handful of well-maintained packages. Reach for these before writing your own.

| Plugin | Purpose | When to use |
|--------|---------|-------------|
| `@vitejs/plugin-react-swc` | React HMR + Fast Refresh via SWC | Default for React apps (faster than Babel variant) |
| `@vitejs/plugin-react` | React HMR + Fast Refresh via Babel | Only if you need Babel plugins (emotion, MobX decorators) |
| `@vitejs/plugin-vue` | Vue 3 SFC support | Vue apps |
| `vite-plugin-checker` | Runs `tsc` + ESLint in worker thread with HMR overlay | **Any TypeScript app** — Vite does NOT type-check during `vite build` |
| `vite-tsconfig-paths` | Honors `tsconfig.json` `paths` aliases | Any time you already have aliases in `tsconfig.json` |
| `vite-plugin-dts` | Emits `.d.ts` files in library mode | Publishing TypeScript libraries |
| `vite-plugin-svgr` | Imports SVGs as React components | React apps using SVGs as components |
| `rollup-plugin-visualizer` | Bundle treemap/sunburst report | Periodic bundle size audits (use `enforce: 'post'`) |
| `vite-plugin-pwa` | Zero-config PWA + Workbox | Offline-capable apps |

**Critical callout:** `vite build` transpiles but does NOT type-check. Type errors silently ship to production unless you add `vite-plugin-checker` or run `tsc --noEmit` in CI.

#### Authoring Custom Plugins

Authoring is rare — most needs are covered by existing plugins. When you do need one, start inline in `vite.config.ts` and only extract if reused.

```typescript
// vite.config.ts — minimal inline plugin
function myPlugin(): Plugin {
  return {
    name: 'my-plugin',                       // required, must be unique
    enforce: 'pre',                           // 'pre' | 'post' (optional)
    apply: 'build',                           // 'build' | 'serve' (optional)
    transform(code, id) {
      if (!id.endsWith('.custom')) return
      return { code: transformCustom(code), map: null }
    },
  }
}
```

**Key hooks:** `transform` (modify source), `resolveId` + `load` (virtual modules), `transformIndexHtml` (inject into HTML), `configureServer` (add dev middleware), `hotUpdate` (custom HMR — replaces deprecated `handleHotUpdate` in v7+).

**Virtual modules** use the `\0` prefix convention — `resolveId` returns `'\0virtual:my-id'` so other plugins skip it. User code imports `'virtual:my-id'`.

For full plugin API, see [vite.dev/guide/api-plugin](https://vite.dev/guide/api-plugin). Use `vite-plugin-inspect` during development to debug the transform pipeline.

### HMR API

Framework plugins (`@vitejs/plugin-react`, `@vitejs/plugin-vue`, etc.) handle HMR automatically. Reach for `import.meta.hot` directly only when building custom state stores, dev tools, or framework-agnostic utilities that need to persist state across updates.

```typescript
// src/store.ts — manual HMR for a vanilla module
if (import.meta.hot) {
  // Persist state across updates (must MUTATE, never reassign .data)
  import.meta.hot.data.count = import.meta.hot.data.count ?? 0

  // Cleanup side effects before module is replaced
  import.meta.hot.dispose((data) => clearInterval(data.intervalId))

  // Accept this module's own updates
  import.meta.hot.accept()
}
```

All `import.meta.hot` code is tree-shaken out of production builds — no guard removal needed.
