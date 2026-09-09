---
name: threejs-deploy-pipeline
description: Use when deploying Three.js sites — optimized Vite build, GitHub Actions CI/CD, Hostinger/Netlify/Vercel/Pages targets, Nginx, health checks. Triggers on "deploy threejs site", "vite build threejs", "hostinger deploy threejs", "netlify threejs deploy", "vercel threejs deploy", "ci/cd threejs".
metadata:
  origin: AUTORAL
  source_docs:
    - https://vitejs.dev/guide/build.html
    - https://vitejs.dev/guide/static-deploy.html
    - https://www.hostinger.com/tutorials/vps-hosting
    - https://docs.netlify.com/configure-builds/get-started/
    - https://vercel.com/docs/deployments/overview
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: []
---

# Three.js Deploy Pipeline — Sites Three.js em Produção

Pipeline CI/CD: **Vite build otimizado → testes → deploy automático** (Hostinger/Netlify/Vercel/GitHub Pages) + Nginx + health check. Artefatos prontos em `references/`.

## Quando usar (gatilhos concretos)

- "Deploy automático do meu site Three.js"
- "Pipeline CI/CD para projeto Three.js + Vite"
- "Deploy no Hostinger/Netlify/Vercel via GitHub Actions"
- "Build otimizado para Three.js (code splitting, tree shaking)"
- "Deploy contínuo em VPS Hostinger KVM1"

## Quando NÃO usar

- Composição de cena Three.js → use `threejs-scene-composer`
- Shaders customizados → use `threejs-shader-effects`
- Patterns responsivos → use `threejs-responsive-patterns`

## Pipeline (resumo)

```
Push (main) → Vite Build (otimizado) → Testes (unit/e2e) → Deploy (auto)
                                                        → Hostinger / Netlify / Vercel / GitHub Pages
```

**Build** (`references/vite.config.js`): terser (drop console/debugger), manualChunks (`three-core`, `three-addons`, `gsap`, `vendor`), cache busting por tipo (images/fonts/models), target es2022, COOP/COEP headers, `optimizeDeps` three+gsap.

**CI/CD** (`references/deploy.yml`): 7 jobs — lint (ESLint+tsc+Prettier) → test (unit + Playwright) → build (artifact `dist`) → deploy-hostinger (zip + SSH + nginx reload) / deploy-netlify / deploy-vercel / deploy-github-pages. Só `main` deploya.

**Deploy local** (`references/deploy.sh`): `./deploy.sh [production|staging] [hostinger|netlify|vercel|github-pages]` — build → checa tamanho → scp/ssh, `netlify deploy`, `vercel --prod` ou `gh-pages`.

**Servidor** (`references/nginx.conf`): HTTP→HTTPS, gzip, cache 1y em `/assets/` (immutable), SPA fallback, security headers + CSP, Permissions-Policy. **Env** (`references/env.example`): production/staging.

**Monitoramento** (`references/health-check.js` + `references/monitor.yml`): checa status, presença de three/canvas/scripts e tempo de resposta; cron a cada 15min.

```bash
# Uso mais comum (Hostinger VPS):
npm run build && ./references/deploy.sh production hostinger
```

## Checklist de Deploy

- [ ] Vite config otimizado (code splitting, tree shaking, terser)
- [ ] GitHub Actions (lint → test → build → deploy)
- [ ] Targets: Hostinger, Netlify, Vercel, GitHub Pages
- [ ] Nginx (cache, compressão, headers) + health check + cron 15min
- [ ] Rollback strategy documentado

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, commands, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```

## Referências Oficiais (Validados 2026-08-30)

- [Vite Build](https://vitejs.dev/guide/build.html) · [Static Deploy](https://vitejs.dev/guide/static-deploy.html) · [Hostinger VPS](https://www.hostinger.com/tutorials/vps-hosting) · [Netlify](https://docs.netlify.com/configure-builds/get-started/) · [Vercel](https://vercel.com/docs/deployments/overview) · [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages)
