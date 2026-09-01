# Vite Build + Hostinger Deploy Reference (Validado via Context7)

## Library: Vite (`/vitejs/vite`)

### Optimized vite.config.js for Three.js

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
        pure_funcs: ['console.log', 'console.debug', 'console.info']
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          // Three.js em chunk separado (grande)
          three: ['three'],
          // GSAP em chunk separado
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          // Vendor utilities
          vendor: ['dat.gui', 'stats.js', 'three/examples/jsm/controls/OrbitControls.js'],
          // App code
          app: ['./src/main.js']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|ttf|eot)$/.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash].${ext}`;
          }
          return `assets/[ext]/[name]-[hash].${ext}`;
        }
      },
    // Target modern browsers for smaller output
    target: 'esnext',
    // CSS code splitting
    cssCodeSplit: true,
    // Module preload
    modulePreload: {
      polyfill: false
    }
  },
  // Dev server
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },
  // Preview server (production test)
  preview: {
    port: 4173,
    open: true
  },
  // Optimize deps
  optimizeDeps: {
    include: ['three', 'gsap', 'gsap/ScrollTrigger'],
    exclude: ['three/examples/jsm/controls/OrbitControls.js']
  },
  // Define constants
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});
```

### Three.js Specific Optimizations

```javascript
// vite.config.js additions for Three.js
export default defineConfig({
  // ...
  build: {
    // ...
    rollupOptions: {
      // ...
      // Externalize three if using CDN (optional)
      // external: ['three'],
      output: {
        // ...
        // Ensure three.js doesn't get tree-shaken incorrectly
        manualChunks: (id) => {
          if (id.includes('node_modules/three')) {
            return 'three';
          }
          if (id.includes('node_modules/gsap')) {
            return 'gsap';
          }
        }
      }
    }
  },
  // Worker for heavy computations (optional)
  worker: {
    format: 'es'
  }
});
```

### Environment Variables

```bash
# .env.production
VITE_APP_TITLE="Meu Site 3D"
VITE_CANVAS_ID="three-canvas"
VITE_SHADOW_MAP=true
VITE_PIXEL_RATIO=2
```

```javascript
// src/config/env.js
export const ENV = {
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Three.js App',
  CANVAS_ID: import.meta.env.VITE_CANVAS_ID || 'three-canvas',
  SHADOW_MAP: import.meta.env.VITE_SHADOW_MAP === 'true',
  PIXEL_RATIO: parseFloat(import.meta.env.VITE_PIXEL_RATIO) || 2
};
```

---

## Hostinger Deploy (via FTP/API)

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy-hostinger.yml
name: Deploy to Hostinger

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NODE_ENV: production

      - name: Deploy to Hostinger via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: ${{ secrets.HOSTINGER_FTP_HOST }}
          username: ${{ secrets.HOSTINGER_FTP_USER }}
          password: ${{ secrets.HOSTINGER_FTP_PASS }}
          local-dir: ./dist/
          server-dir: public_html/
          protocol: ftps
          port: 21
          passive: true
          clean: true
          # Exclude large dev files
          exclude: |
            **/.git/**
            **/.github/**
            **/node_modules/**
            **/*.map
            **/README.md

      - name: Deploy to Hostinger via API (alternative)
        if: false
        uses: hostinger/api-cli@v1
        with:
          token: ${{ secrets.HOSTINGER_API_TOKEN }}
          service: vps
          action: deploy
          path: ./dist/
```

### Hostinger VPS Setup (KVM2)

```bash
# 1. Comprar VPS KVM2 (2 vCPU, 4GB RAM, 80GB NVMe)
# 2. Ubuntu 22.04 LTS
# 3. SSH access

# Server setup
ssh root@seu-vps-ip

# Install dependencies
apt update && apt upgrade -y
apt install -y nginx nodejs npm certbot python3-certbot-nginx

# Node.js 20 (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# PM2 for process management
npm install -g pm2

# Clone repo
cd /var/www
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

# Install & build
npm ci
npm run build

# Nginx config
cat > /etc/nginx/sites-available/seu-site << 'EOF'
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    root /var/www/seu-repo/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
EOF

ln -s /etc/nginx/sites-available/seu-site /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# SSL (Let's Encrypt)
certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# PM2 ecosystem
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'seu-site',
    script: 'npx',
    args: 'serve -s dist -l 3000',
    cwd: '/var/www/seu-repo',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Hostinger API (Alternative to FTP)

```javascript
// scripts/deploy-hostinger-api.js
import { HostingerAPI } from '@hostinger/api-cli';

async function deploy() {
  const api = new HostingerAPI({
    token: process.env.HOSTINGER_API_TOKEN
  });

  const vps = await api.vps.list();
  const targetVps = vps.find(v => v.label === 'threejs-site');

  if (!targetVps) {
    throw new Error('VPS not found');
  }

  // Deploy via Hostinger API
  const deployment = await api.vps.deploy(targetVps.id, {
    source: 'github',
    repo: 'usuario/repo',
    branch: 'main',
    buildCommand: 'npm ci && npm run build',
    outputDir: 'dist',
    domain: 'seu-dominio.com'
  });

  console.log('Deployment:', deployment);
}

deploy().catch(console.error);
```

### FTP Deploy Script (Node.js)

```javascript
// scripts/deploy-ftp.js
import { createClient } from 'basic-ftp';
import { promises as fs } from 'fs';
import path from 'path';

async function deployFTP() {
  const client = new createClient();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: process.env.HOSTINGER_FTP_HOST,
      user: process.env.HOSTINGER_FTP_USER,
      password: process.env.HOSTINGER_FTP_PASS,
      secure: true, // FTPS
      secureOptions: { rejectUnauthorized: false }
    });

    console.log('Connected to Hostinger FTP');

    // Clear remote directory
    await client.ensureDir('public_html');
    await client.clearWorkingDir();

    // Upload dist folder
    const distPath = path.resolve('dist');
    await client.uploadFromDir(distPath, 'public_html');

    console.log('Deploy completed successfully!');
  } catch (err) {
    console.error('Deploy failed:', err);
    process.exit(1);
  } finally {
    client.close();
  }
}

deployFTP();
```

---

## Performance Checklist (Vite + Three.js)

| Item | Config |
|------|--------|
| **Code splitting** | `manualChunks` para three, gsap, vendor |
| **Minification** | `terser` com `drop_console` |
| **Target** | `esnext` (modern browsers) |
| **CSS code split** | `cssCodeSplit: true` |
| **Module preload** | `modulePreload: { polyfill: false }` |
| **Asset hashing** | `[name]-[hash].ext` |
| **Gzip/Brotli** | Nginx config |
| **Cache headers** | 1 year para assets estáticos |
| **SPA fallback** | `try_files $uri $uri/ /index.html` |

---

## Referências Oficiais

- Vite: https://vitejs.dev/ (Context7 `/vitejs/vite`)
- Hostinger API: https://github.com/hostinger/api-cli (Context7 `/hostinger/api-cli`)
- Hostinger VPS: https://www.hostinger.com/vps-hosting
- Three.js + Vite: https://github.com/threejs/three.js/tree/dev/examples/vite