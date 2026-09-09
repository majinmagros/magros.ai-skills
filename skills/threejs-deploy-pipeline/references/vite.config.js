// vite.config.js — Vite otimizado para Three.js (code splitting, tree shaking, terser)
// Extraído de SKILL.md (2026-09-09). Copie para a raiz do projeto Three.js.
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
