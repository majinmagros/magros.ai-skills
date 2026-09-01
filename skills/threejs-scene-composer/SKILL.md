---
name: threejs-scene-composer
description: Use when building Three.js 3D sites with modular scene composition — referências visuais → img2threejs (blocos individuais) → composição Three.js elemento por elemento (geometrias, materiais, iluminação, câmera, física, animações) → GSAP ScrollTrigger → deploy Hostinger/Vite. Based on Gustavo Campelo workflow "Dessa Forma Crio Sites 3D Interativos com IA". Triggers: "threejs scene composition", "composição modular threejs", "element by element threejs", "threejs scene pipeline", "img2threejs to threejs", "modular 3d scene blocks".
metadata:
  origin: ECC
  module: framework-language
  cost: medium
  stability: beta
  defaultInstall: false
---

# Skill: threejs-scene-composer — Composição Modular de Cenas Three.js

Pipeline modular estilo "elemento por elemento" para criar cenas 3D complexas bloco por bloco (geometrias, materiais, iluminação, câmera, física, animações). Baseado no workflow do Gustavo Campelo (vídeo "Dessa Forma Crio Sites 3D Interativos com IA").

## Validação Oficial

| Claim | Status | Fonte |
|---|---|---|
| Three.js r110+ scene composition | ✅ | Context7 `/mrdoob/three.js` |
| GSAP ScrollTrigger animations | ✅ | Context7 `/greensock/gsap-skills` |
| Vite build + deploy | ✅ | Context7 `/vitejs/vite` |
| Hostinger VPS deploy | ✅ | Context7 `/hostinger/api-cli` |
| img2threejs blocos individuais | ✅ | Video Gustavo Campelo (gucampelo) |
| GSAP ScrollTrigger pin/scrub | ✅ | Context7 `/greensock/gsap-skills` |

---

## Quando usar

- "Quero compor uma cena Three.js bloco por bloco"
- "Pipeline modular: referências → img2threejs → Three.js → GSAP → deploy"
- "Criar blocos 3D estilo Minecraft (grama, pedra, portal, cerejeira)"
- "Constants expostas para tuning: câmera, portal, elevação, velocidades"
- "Shaders customizados: pixelation, comet trails, mouse distortion"
- "Patterns responsivos: mobile/desktop, touch vs mouse, LOD"
- "Deploy Vite + Hostinger KVM1"

---

## Pipeline (6 etapas)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 1. REFS     │───▶│ 2. IMG2     │───▶│ 3. COMPOSE  │───▶│ 4. ANIMATE  │───▶│ 5. RESPONSIVE│───▶│ 6. DEPLOY   │
│ Visual      │    │ THREEJS     │    │ SCENE       │    │ GSAP        │    │ PATTERNS    │    │ VITE+HOST   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Etapa 1: REFS — Referências Visuais

**Input:** Screenshots, URLs, Figma, conceitos visuais
**Processo:** Análise de formas geométricas, materiais, iluminação, câmera
**Output:** Especificação de blocos (geometrias, materiais, posições)

```json
{
  "blocks": [
    { "id": "grass", "type": "box", "material": "MeshStandardMaterial", "color": "#4CAF50", "position": [0,0,0] },
    { "id": "stone", "type": "box", "material": "MeshStandardMaterial", "texture": "stone.jpg", "position": [1,0,0] },
    { "id": "portal", "type": "ring", "material": "ShaderMaterial", "uniforms": {...}, "position": [0,2,0] }
  ],
  "camera": { "position": [10,10,10], "target": [0,0,0], "fov": 60 },
  "lighting": { "ambient": 0x404040, "directional": { "color": 0xffffff, "intensity": 1, "position": [10,20,10] } }
}
```

---

## Etapa 2: IMG2THREEJS — Blocos Individuais

**Tool:** `img2threejs` (skill existente)
**Input:** Imagem de referência + especificação do bloco
**Output:** Código Three.js por bloco (geometry + material + mesh)

**Exemplo bloco grama:**
```javascript
// grass-block.js
export function createGrassBlock(position = [0,0,0]) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x4CAF50,
    roughness: 0.8,
    metalness: 0.1
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
```

**Registry de blocos:**
```javascript
// blocks/registry.js
export const blockRegistry = {
  grass: createGrassBlock,
  stone: createStoneBlock,
  obsidian: createObsidianBlock,
  portal: createPortalBlock,
  cherry: createCherryBlock,
  log: createLogBlock
};
```

---

## Etapa 3: COMPOSE — Scene Composition

**Arquitetura modular (scene-composer.js):**

```javascript
// scene-composer.js
import * as THREE from 'three';
import { blockRegistry } from './blocks/registry.js';
import { CONFIG } from './config/constants.js';

export class SceneComposer {
  constructor(canvas) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      CONFIG.camera.fov,
      window.innerWidth / window.innerHeight,
      0.1, 1000
    );
    this.renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.blocks = new Map();
    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupLighting();
    this.setupControls();
    this.composeScene();
    this.animate();
  }

  composeScene() {
    // Compor bloco por bloco conforme registry
    Object.entries(this.sceneSpec.blocks).forEach(([id, spec]) => {
      const createBlock = blockRegistry[spec.type];
      if (createBlock) {
        const block = createBlock(spec.position, spec.options);
        this.scene.add(block);
        this.blocks.set(id, block);
      }
    });
    
    // Portal center
    if (this.sceneSpec.portal) {
      const portal = blockRegistry.portal(this.sceneSpec.portal.position);
      this.scene.add(portal);
      this.blocks.set('portal', portal);
    }
  }

  addBlock(type, position, options = {}) {
    const createBlock = blockRegistry[type];
    if (!createBlock) throw new Error(`Block type ${type} not registered`);
    const block = createBlock(position, options);
    this.scene.add(block);
    return block;
  }

  removeBlock(id) {
    const block = this.blocks.get(id);
    if (block) {
      this.scene.remove(block);
      this.blocks.delete(id);
    }
  }
}
```

**Constants expostas (config/constants.js):**
```javascript
export const CONFIG = {
  camera: {
    fov: 60,
    position: [15, 15, 15],
    target: [0, 0, 0],
    minZoom: 5,
    maxZoom: 50
  },
  portal: {
    center: [0, 2, 0],
    radius: 2,
    rotationSpeed: 0.01
  },
  island: {
    elevation: 0.5,
    position: [0, 0, 0]
  },
  speeds: {
    rotation: 0.005,
    float: 0.02,
    camera: 0.05
  },
  materials: {
    grass: { color: 0x4CAF50, roughness: 0.8 },
    stone: { color: 0x757575, roughness: 0.9 },
    portal: { 
      vertexShader: portalVertexShader,
      fragmentShader: portalFragmentShader,
      uniforms: { time: { value: 0 }, colorA: { value: new THREE.Color(0x00ffff) }, colorB: { value: new THREE.Color(0xff00ff) } }
    }
  }
};
```

---

## Etapa 4: ANIMATE — GSAP ScrollTrigger

**Integração GSAP + Three.js:**

```javascript
// animations/scroll-animations.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function setupScrollAnimations(composer) {
  const { camera, blocks, portal } = composer;

  // Camera scroll animation
  gsap.to(camera.position, {
    z: 50,
    ease: 'none',
    scrollTrigger: {
      trigger: '#canvas-container',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1
    }
  });

  // Portal rotation
  gsap.to(portal.rotation, {
    y: Math.PI * 2,
    ease: 'none',
    repeat: -1,
    duration: 20
  });

  // Block float animation
  blocks.forEach((block, id) => {
    gsap.to(block.position, {
      y: '+=0.5',
      duration: 2 + Math.random() * 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  });

  // Camera orbit on scroll
  ScrollTrigger.create({
    trigger: '#canvas-container',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const progress = self.progress;
      const radius = 30;
      camera.position.x = Math.sin(progress * Math.PI * 4) * radius;
      camera.position.z = Math.cos(progress * Math.PI * 4) * radius;
      camera.lookAt(0, 0, 0);
    }
  });

  // Pin section
  ScrollTrigger.create({
    trigger: '#canvas-section',
    start: 'top top',
    end: '+=3000',
    pin: true,
    pinSpacing: true,
    scrub: 1
  });
}
```

---

## Etapa 5: RESPONSIVE — Patterns

**Adaptive Quality (responsive-renderer.js):**
```javascript
export class ResponsiveRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.qualityPresets = {
      low: { pixelRatio: 1, shadowMap: false, antialias: false },
      medium: { pixelRatio: Math.min(window.devicePixelRatio, 1.5), shadowMap: true, antialias: true },
      high: { pixelRatio: window.devicePixelRatio, shadowMap: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }
    };
    this.currentPreset = 'medium';
    this.renderer = this._createRenderer();
    this._setupResizeObserver();
    this._setupDevicePixelRatio();
  }

  _createRenderer() {
    const preset = this.qualityPresets[this.currentPreset];
    return new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: preset.antialias,
      alpha: true,
      powerPreference: 'high-performance'
    });
  }

  setQuality(preset) {
    if (this.qualityPresets[preset]) {
      this.currentPreset = preset;
      this.renderer.dispose();
      this.renderer = this._createRenderer();
      this.resize();
    }
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(this.qualityPresets[this.currentPreset].pixelRatio);
  }
}
```

**Touch vs Mouse Unificado:**
```javascript
export function setupUnifiedControls(renderer, camera) {
  let isTouch = false;
  
  renderer.domElement.addEventListener('touchstart', () => { isTouch = true; });
  renderer.domElement.addEventListener('mousedown', () => { isTouch = false; });

  // Unified pointer events
  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  renderer.domElement.addEventListener('pointerup', onPointerUp);
}
```

---

## Etapa 6: DEPLOY — Vite + Hostinger

**vite.config.js otimizado:**
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
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
          vendor: ['dat.gui', 'stats.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

**Deploy Hostinger (GitHub Actions):**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Hostinger
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - name: Deploy to Hostinger
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: ${{ secrets.HOSTINGER_FTP_HOST }}
          username: ${{ secrets.HOSTINGER_FTP_USER }}
          password: ${{ secrets.HOSTINGER_FTP_PASS }}
          local-dir: ./dist/
          server-dir: public_html/
```

---

## Referências

- `references/threejs-composition.md` — Scene composition patterns
- `references/gsap-scrolltrigger.md` — GSAP + Three.js integration
- `references/vite-deploy.md` — Vite build + Hostinger deploy
- `references/config-constants.md` — Exposed constants system
- `references/responsive-patterns.md` — Mobile/desktop, LOD, adaptive quality

---

## Scripts

- `scripts/compose-scene.js` — SceneComposer class + block registry
- `scripts/scroll-animations.js` — GSAP ScrollTrigger integration
- `scripts/responsive-renderer.js` — Adaptive quality + touch/mouse
- `scripts/deploy-hostinger.js` — FTP deploy to Hostinger
- `scripts/config-constants.js` — Exposed constants for tuning