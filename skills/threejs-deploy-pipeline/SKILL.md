---
name: threejs-deploy-pipeline
description: >-
  Pipeline de deploy para sites Three.js: Vite build → zip → Hostinger/Netlify/Vercel → CI/CD automático. Baseado no deploy do Gustavo Campelo (Hostinger KVM1 + Vite + Node.js).
  Use quando: "deploy threejs site", "vite build threejs", "hostinger deploy threejs", "netlify threejs deploy", "vercel threejs deploy", "ci/cd threejs".
  Não use para: composição de cena (use threejs-scene-composer), shaders (use threejs-shader-effects).
  Outcome: Pipeline CI/CD completo para sites Three.js com build otimizado, deploy automático e configuração de hospedagem.
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

# Three.js Deploy Pipeline — Pipeline de Deploy para Sites Three.js

Pipeline CI/CD completo para sites Three.js: **Vite build otimizado → zip/artifact → deploy automático** (Hostinger/Netlify/Vercel/GitHub Pages) com CI/CD automatizado.

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

## Pipeline Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Push      │───▶│  Vite Build │───▶│   Testes    │───▶│   Deploy    │
│  (main)     │    │  (otimizado)│    │  (unit/e2e) │    │  (auto)     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                    │
                    ┌───────────────────────────────┘
                    ▼
            ┌─────────────────┐
            │  Hostinger/     │
            │  Netlify/       │
            │  Vercel/        │
            │  GitHub Pages   │
            └─────────────────┘
```

## 1. Vite Config Otimizado para Three.js

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug']
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Code splitting otimizado para Three.js
        manualChunks: {
          'three-core': ['three'],
          'three-addons': [
            'three/addons/controls/OrbitControls.js',
            'three/addons/loaders/GLTFLoader.js',
            'three/addons/loaders/DRACOLoader.js'
          ],
          'gsap': ['gsap'],
          'vendor': ['gsap', 'three']
        },
        // Asset naming para cache busting
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.name.split('.').pop();
          if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif'].includes(ext)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (['woff', 'woff2', 'ttf', 'eot'].includes(ext)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          if (['glb', 'gltf', 'fbx', 'obj', 'mtl'].includes(ext)) {
            return `assets/models/[name]-[hash].${ext}`;
          }
          return `assets/[ext]/[name]-[hash].${ext}`;
        }
      },
      // Target moderno para Three.js
      target: 'es2022',
      modulePreload: {
        polyfill: false
      }
    },
    // Compressão
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000
  },
  // Dev server
  server: {
    port: 3000,
    open: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  // Otimizações Three.js específicas
  optimizeDeps: {
    include: ['three', 'gsap'],
    exclude: ['three/examples/jsm/*']
  },
  // Web Workers para parsing pesado
  worker: {
    format: 'es',
    plugins: () => []
  }
});
```

## 2. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Three.js Site

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: '20'
  VITE_APP_TITLE: 'Three.js Site'

jobs:
  # ========================================
  # 1. LINT & TYPE CHECK
  # ========================================
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript check
        run: npm run typecheck
      
      - name: Run Prettier check
        run: npm run format:check

  # ========================================
  # 2. TESTES
  # ========================================
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test -- --run
      
      - name: Run e2e tests (Playwright)
        uses: microsoft/playwright-github-action@v1
        if: always()
        with:
          browser: chromium

  # ========================================
  # 3. BUILD OTIMIZADO
  # ========================================
  build:
    name: Build Production
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Production
        run: npm run build
        env:
          VITE_APP_VERSION: ${{ github.sha }}
          VITE_BUILD_TIME: ${{ github.event.head_commit.timestamp }}
      
      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist
          retention-days: 7
      
      - name: Upload build report
        uses: actions/upload-artifact@v4
        with:
          name: build-report
          path: |
            dist/assets/*.js
            dist/assets/*.css
            dist/*.html
          retention-days: 7

  # ========================================
  # 4. DEPLOY - HOSTINGER (VPS)
  # ========================================
  deploy-hostinger:
    name: Deploy to Hostinger VPS
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      
      - name: Create deployment package
        run: |
          cd dist
          zip -r ../deploy.zip .
      
      - name: Deploy to Hostinger VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USER }}
          key: ${{ secrets.HOSTINGER_SSH_KEY }}
          port: 22
          script: |
            cd /var/www/html
            rm -rf *
            unzip -o ~/deploy.zip
            chown -R www-data:www-data .
            systemctl reload nginx
      
      - name: Cleanup
        run: rm -f deploy.zip

  # ========================================
  # 5. DEPLOY - NETLIFY
  # ========================================
  deploy-netlify:
    name: Deploy to Netlify
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions - ${{ github.sha }}"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  # ========================================
  # 6. DEPLOY - VERCEL
  # ========================================
  deploy-vercel:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
        working-directory: ./dist

  # ========================================
  # 7. DEPLOY - GITHUB PAGES
  # ========================================
  deploy-github-pages:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - name: Download build artifact
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

## 3. Scripts de Deploy Locais

```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENVIRONMENT=${1:-production}
TARGET=${2:-hostinger}

echo "🚀 Iniciando deploy para $TARGET ($ENVIRONMENT)..."

# 1. Build
echo "📦 Building..."
npm run build

# 2. Verificar tamanho
echo "📊 Tamanho do build:"
du -sh dist/
find dist -name "*.js" -o -name "*.css" | xargs ls -lh | awk '{sum+=$5} END {print "Total JS/CSS:", sum/1024/1024, "MB"}'

# 3. Deploy baseado no target
case $TARGET in
  hostinger)
    echo "🚀 Deploying to Hostinger VPS..."
    cd dist && zip -r ../deploy.zip .
    scp deploy.zip $HOSTINGER_USER@$HOSTINGER_HOST:/tmp/
    ssh $HOSTINGER_USER@$HOSTINGER_HOST "
      cd /var/www/html && rm -rf * && unzip -o /tmp/deploy.zip
      chown -R www-data:www-data .
      systemctl reload nginx
    "
    ;;
  netlify)
    echo "🌐 Deploying to Netlify..."
    npx netlify deploy --prod --dir=dist
    ;;
  vercel)
    echo "▲ Deploying to Vercel..."
    vercel --prod --token=$VERCEL_TOKEN
    ;;
  github-pages)
    echo "📄 Deploying to GitHub Pages..."
    npx gh-pages -d dist
    ;;
  *)
    echo "❌ Target desconhecido: $TARGET"
    exit 1
    ;;
esac

echo "✅ Deploy concluído!"
```

## 4. Configuração de Ambientes

```bash
# .env.production
VITE_APP_TITLE="Three.js Site"
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.exemplo.com
VITE_ENABLE_ANALYTICS=true
VITE_GA_ID=G-XXXXXXXXXX

# .env.staging
VITE_APP_TITLE="Three.js Site (Staging)"
VITE_API_URL=https://staging-api.exemplo.com
VITE_ENABLE_ANALYTICS=false
```

## 5. Configuração de Servidor (Nginx)

```nginx
# /etc/nginx/sites-available/threejs-site
server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com www.seu-dominio.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    # SSL Config
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    root /var/www/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

    # Cache headers para assets imutáveis
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;";

    # Three.js specific - allow WebGL
    add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()";
}
```

## 5. Monitoramento Pós-Deploy

```javascript
// scripts/health-check.js
async function healthCheck() {
  const url = process.env.SITE_URL || 'https://seu-dominio.com';
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Verificações básicas
    const checks = {
      status: response.ok,
      statusCode: response.status,
      hasThreeJS: html.includes('three'),
      hasCanvas: html.includes('<canvas') || html.includes('webgl'),
      hasScripts: html.includes('<script'),
      responseTime: performance.now() - startTime
    };
    
    console.log('Health Check:', checks);
    
    if (!checks.status) {
      throw new Error(`Health check failed: ${checks.statusCode}`);
    }
    
    return checks;
  } catch (error) {
    console.error('Health check failed:', error);
    process.exit(1);
  }
}

healthCheck();
```

```yaml
# .github/workflows/monitor.yml
name: Monitor Production

on:
  schedule:
    - cron: '*/15 * * * *'  # A cada 15 min
  workflow_dispatch:

jobs:
  health-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: node scripts/health-check.js
        env:
          SITE_URL: https://seu-dominio.com
```

---

## Checklist de Deploy

- [ ] Vite config otimizado (code splitting, tree shaking, terser)
- [ ] GitHub Actions workflow completo (lint → test → build → deploy)
- [ ] Múltiplos targets de deploy (Hostinger, Netlify, Vercel, GitHub Pages)
- [ ] Script de deploy local (`scripts/deploy.sh`)
- [ ] Configuração Nginx otimizada (cache, compressão, headers)
- [ ] Health check automatizado
- [ ] Monitoramento agendado (cron 15min)
- [ ] Rollback strategy documentado

---

## Referências Oficiais (Validados 2026-08-30)

- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [Vite Static Deploy](https://vitejs.dev/guide/static-deploy.html)
- [Hostinger VPS Tutorial](https://www.hostinger.com/tutorials/vps-hosting)
- [Netlify Deploy](https://docs.netlify.com/configure-builds/get-started/)
- [Vercel Deploy](https://vercel.com/docs/deployments/overview)
- [GitHub Pages Deploy](https://docs.github.com/en/pages/getting-started-with-github-pages)

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   ├── commands/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```