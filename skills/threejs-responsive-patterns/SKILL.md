---
name: threejs-responsive-patterns
description: |
  Patterns responsivos Three.js: mobile/desktop, touch vs mouse, performance scaling, LOD (Level of Detail), adaptive quality. Baseado no vídeo do Gustavo Campelo (responsivo mobile/desktop, touch vs mouse).
  Use quando: "threejs responsive", "threejs mobile desktop", "threejs touch mouse", "threejs LOD", "threejs performance scaling", "threejs adaptive quality", "threejs mobile optimization".
  Não use para: composição de cena (use threejs-scene-composer), shaders (use threejs-shader-effects), deploy (use threejs-deploy-pipeline).
  Outcome: Patterns e utilities para sites Three.js totalmente responsivos com adaptive quality, touch/mouse unificado, LOD system, performance scaling.
metadata:
  origin: AUTORAL
  source_docs:
    - https://threejs.org/docs/#manual/en/introduction/How-to-create-responsive-scenes
    - https://threejs.org/docs/#api/en/renderers/WebGLRenderer
    - https://threejs.org/docs/#api/en/geometries/InstancedMesh
    - https://github.com/mrdoob/three.js/tree/dev/examples/webgl_lod
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: []
---

# Three.js Responsive Patterns — Patterns Responsivos Three.js

Patterns e utilities para sites Three.js **totalmente responsivos** com adaptive quality, touch/mouse unificado, LOD system, performance scaling.

## Quando usar (gatilhos concretos)

- "Three.js responsivo mobile desktop"
- "Three.js touch mouse unificado"
- "Three.js LOD system"
- "Three.js performance scaling"
- "Three.js adaptive quality"
- "Three.js mobile optimization"
- "Three.js touch events"

## Quando NÃO usar

- Composição de cena → use `threejs-scene-composer`
- Shaders customizados → use `threejs-shader-effects`
- Deploy → use `threejs-deploy-pipeline`
- Constants para tuning → use `threejs-config-constants`

## Core: Responsive Renderer

```javascript
// responsive-renderer.js
import * as THREE from 'three';

export class ResponsiveRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      // Quality presets
      qualityPresets: {
        low: { pixelRatio: 1, shadowMap: false, antialias: false, toneMapping: THREE.NoToneMapping },
        medium: { pixelRatio: Math.min(window.devicePixelRatio, 1.5), shadowMap: true, antialias: true },
        high: { pixelRatio: window.devicePixelRatio, shadowMap: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }
      },
      currentPreset: 'medium',
      ...options
    };
    
    this.renderer = this._createRenderer();
    this._setupResizeObserver();
    this._setupDevicePixelRatio();
  }
  
  _createRenderer() {
    const preset = this.options.qualityPresets[this.options.currentPreset];
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: preset.antialias,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });
    
    renderer.setPixelRatio(preset.pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (preset.shadowMap) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    
    if (preset.toneMapping) {
      renderer.toneMapping = preset.toneMapping;
      renderer.toneMappingExposure = 1.0;
    }
    
    return renderer;
  }
  
  _setupResizeObserver() {
    // ResizeObserver para container (mais performático que window.resize)
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.resize(width, height);
      }
    });
    
    this.resizeObserver.observe(this.canvas.parentElement);
    
    // Fallback para window.resize
    window.addEventListener('resize', () => this.resize());
  }
  
  _setupDevicePixelRatio() {
    // Detecta mudanças no devicePixelRatio (ex: usuário move janela entre monitores)
    let lastDPR = window.devicePixelRatio;
    setInterval(() => {
      if (window.devicePixelRatio !== lastDPR) {
        lastDPR = window.devicePixelRatio;
        this.setQualityPreset(this.options.currentPreset);
      }
    }, 1000);
  }
  
  resize(width, height) {
    this.renderer.setSize(width, height);
    // Notifica callbacks de resize
    this.onResizeCallbacks?.forEach(cb => cb(width, height));
  }
  
  setQualityPreset(presetName) {
    if (!this.options.qualityPresets[presetName]) return false;
    
    this.options.currentPreset = presetName;
    const preset = this.options.qualityPresets[presetName];
    
    this.renderer.setPixelRatio(preset.pixelRatio);
    this.renderer.shadowMap.enabled = preset.shadowMap;
    this.renderer.antialias = preset.antialias;
    
    if (preset.toneMapping) {
      this.renderer.toneMapping = preset.toneMapping;
    }
    
    // Re-render se necessário
    this.onQualityChangeCallbacks?.forEach(cb => cb(presetName));
    
    return true;
  }
  
  // Auto-detect quality baseado em performance
  async autoDetectQuality() {
    const benchmarks = await this._runBenchmarks();
    let preset = 'medium';
    
    if (benchmarks.fps < 30) preset = 'low';
    else if (benchmarks.fps > 55 && benchmarks.gpuScore > 70) preset = 'high';
    
    this.setQualityPreset(preset);
    return preset;
  }
  
  async _runBenchmarks() {
    // Benchmark rápido de 2 segundos
    const frames = [];
    const start = performance.now();
    
    return new Promise(resolve => {
      function frame() {
        frames.push(performance.now());
        if (performance.now() - start < 2000) {
          requestAnimationFrame(frame);
        } else {
          const fps = (frames.length / ((frames[frames.length - 1] - frames[0]) / 1000));
          resolve({ fps, frameCount: frames.length });
        }
      }
      requestAnimationFrame(frame);
    });
  }
  
  // Event callbacks
  onResize(callback) { this.onResizeCallbacks = this.onResizeCallbacks || []; this.onResizeCallbacks.push(callback); }
  onQualityChange(callback) { this.onQualityChangeCallbacks = this.onQualityChangeCallbacks || []; this.onQualityChangeCallbacks.push(callback); }
  
  dispose() {
    this.resizeObserver?.disconnect();
    this.renderer.dispose();
  }
}
```

## Touch/Mouse Unificado

```javascript
// unified-input.js
import * as THREE from 'three';

export class UnifiedInput {
  constructor(renderer, camera, domElement) {
    this.renderer = renderer;
    this.camera = camera;
    this.domElement = domElement;
    
    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.isPointerDown = false;
    this.pointerDownPosition = new THREE.Vector2();
    
    // Touch vs Mouse detection
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    this._bindEvents();
  }
  
  _bindEvents() {
    // Pointer Events (unifica touch + mouse)
    this.domElement.addEventListener('pointerdown', this._onPointerDown.bind(this), { passive: true });
    this.domElement.addEventListener('pointermove', this._onPointerMove.bind(this), { passive: true });
    this.domElement.addEventListener('pointerup', this._onPointerUp.bind(this), { passive: true });
    this.domElement.addEventListener('pointerleave', this._onPointerUp.bind(this));
    this.domElement.addEventListener('pointercancel', this._onPointerUp.bind(this));
    
    // Wheel/Zoom
    this.domElement.addEventListener('wheel', this._onWheel.bind(this), { passive: false });
    
    // Touch gestures (pinch zoom, rotate)
    if (this.isTouchDevice) {
      this._setupTouchGestures();
    }
    
    // Context menu
    this.domElement.addEventListener('contextmenu', e => e.preventDefault());
  }
  
  _setupTouchGestures() {
    let initialDistance = 0;
    let initialScale = 1;
    
    this.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
        initialScale = this.camera.scale ? this.camera.scale.x : 1;
      }
    }, { passive: true });
    
    this.domElement.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
        const scale = initialScale * (distance / initialDistance);
        this._onPinchZoom(scale);
      }
    }, { passive: false });
  }
  
  _onPointerDown(e) {
    this.isPointerDown = true;
    this.pointerDownPosition.set(e.clientX, e.clientY);
    this._updatePointer(e);
    this.onPointerDown?.(this.pointer.clone(), e);
  }
  
  _onPointerMove(e) {
    this._updatePointer(e);
    this.onPointerMove?.(this.pointer.clone(), e);
    
    if (this.isPointerDown) {
      this.onDrag?.(this.pointer.clone(), e);
    }
  }
  
  _onPointerUp(e) {
    this.isPointerDown = false;
    this.onPointerUp?.(this.pointer.clone(), e);
    
    // Click detection (não foi drag)
    const dist = this.pointerDownPosition.distanceTo(new THREE.Vector2(e.clientX, e.clientY));
    if (dist < 5) {
      this.onClick?.(this.pointer.clone(), e);
    }
  }
  
  _updatePointer(e) {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - e.rect.left) / this.domElement.clientWidth) * 2 - 1;
    this.pointer.y = -((e.clientY - e.rect.top) / this.domElement.clientHeight) * 2 + 1;
  }
  
  _onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    this.onZoom?.(delta, e);
  }
  
  _onPinchZoom(scale) {
    this.onPinchZoom?.(scale);
  }
  
  // Raycasting unificado
  raycast(objects, recursive = true) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObjects(objects, recursive);
  }
  
  // Cleanup
  destroy() {
    this.domElement.removeEventListener('pointerdown', this._onPointerDown);
    this.domElement.removeEventListener('pointermove', this._onPointerMove);
    this.domElement.removeEventListener('pointerup', this._onPointerUp);
    this.domElement.removeEventListener('wheel', this._onWheel);
  }
}
```

## Touch/Mouse Unificado - Helpers

```javascript
// input-helpers.js

// Normaliza evento pointer para coordenadas normalizadas
export function normalizePointer(event, renderer) {
  const rect = renderer.domElement.getBoundingClientRect();
  return new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
}

// Detecta tipo de dispositivo
export function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
  return 'desktop';
}

// Verifica suporte a touch
export const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
export const hasPointer = window.PointerEvent !== undefined;

// Debounce para resize
export function debounce(fn, delay = 150) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle para eventos frequentes
export function throttle(fn, limit = 16) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

## Adaptive Quality System

```javascript
// adaptive-quality.js
export class AdaptiveQuality {
  constructor(renderer, scene, camera, options = {}) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    
    this.targetFPS = options.targetFPS || 60;
    this.sampleSize = options.sampleSize || 60; // frames
    this.adjustmentThreshold = options.adjustmentThreshold || 0.1;
    
    this.frameTimes = [];
    this.currentQuality = 1.0;
    this.minQuality = 0.3;
    this.maxQuality = 1.0;
    this.adjustmentStep = 0.1;
    
    this.metrics = {
      fps: 0,
      frameTime: 0,
      drawCalls: 0,
      triangles: 0,
      gpuMemory: 0
    };
    
    this._startMonitoring();
  }
  
  _startMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const measure = (now) => {
      const delta = now - lastTime;
      lastTime = now;
      frameCount++;
      
      this.frameTimes.push(delta);
      if (this.frameTimes.length > this.sampleSize) {
        this.frameTimes.shift();
      }
      
      if (frameCount % 60 === 0) {
        this._calculateMetrics();
        this._adjustQuality();
      }
      
      requestAnimationFrame(measure);
    };
    
    requestAnimationFrame(measure);
  }
  
  _calculateMetrics() {
    if (this.frameTimes.length < 2) return;
    
    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.metrics.fps = 1000 / avgFrameTime;
    this.metrics.frameTime = avgFrameTime;
    
    // Stats do renderer
    const info = this.renderer.info;
    this.metrics.drawCalls = info.render.calls;
    this.metrics.triangles = info.render.triangles;
    this.metrics.gpuMemory = info.memory.geometries + info.memory.textures;
  }
  
  _adjustQuality() {
    const { fps, frameTime } = this.metrics;
    const targetFrameTime = 1000 / this.targetFPS;
    
    if (fps < this.targetFPS * 0.9) {
      // Performance baixa - reduz qualidade
      this.currentQuality = Math.max(this.minQuality, this.currentQuality - 0.1);
      this._applyQuality();
    } else if (fps > this.targetFPS * 1.1 && this.currentQuality < this.maxQuality) {
      // Performance boa - aumenta qualidade
      this.currentQuality = Math.min(this.maxQuality, this.currentQuality + 0.05);
      this._applyQuality();
    }
  }
  
  _applyQuality() {
    // Pixel ratio
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.currentQuality * 2));
    
    // Shadow map resolution
    const shadowSize = Math.floor(1024 * this.currentQuality);
    this.renderer.shadowMap.enabled = this.currentQuality > 0.4;
    
    // Post-processing quality
    // this.composer?.passes.forEach(p => p.enabled = this.currentQuality > 0.5);
  }
  
  getMetrics() {
    return { ...this.metrics, quality: this.currentQuality };
  }
  
  setTargetFPS(fps) { this.targetFPS = fps; }
  setQualityRange(min, max) { this.minQuality = min; this.maxQuality = max; }
  setQuality(q) { this.currentQuality = Math.max(this.minQuality, Math.min(this.maxQuality, q)); this._applyQuality(); }
  destroy() {}
}
```

## LOD (Level of Detail) System

```javascript
// lod-system.js
import * as THREE from 'three';

export class LODSystem {
  constructor(camera, options = {}) {
    this.camera = camera;
    this.objects = new Map();
    this.levels = options.levels || [
      { distance: 0, detail: 1.0 },      // 0-20: full detail
      { distance: 20, detail: 0.5 },     // 20-50: half detail
      { distance: 50, detail: 0.25 },    // 50-100: quarter detail
      { distance: 100, detail: 0.1 }     // 100+: minimal
    ];
  }
  
  register(object, lodLevels) {
    // lodLevels: array de { distance, geometry, material } ou { distance, model }
    const lod = new THREE.LOD();
    
    lodLevels.forEach((level, i) => {
      const mesh = new THREE.Mesh(level.geometry, level.material);
      lod.addLevel(mesh, level.distance);
    });
    
    lod.position.copy(object.position);
    lod.rotation.copy(object.rotation);
    lod.scale.copy(object.scale);
    
    this.objects.set(object, { lod, original: object });
    
    // Substitui objeto original pelo LOD
    if (object.parent) {
      object.parent.add(lod);
      object.parent.remove(object);
    }
  }
  
  update() {
    // THREE.LOD atualiza automaticamente baseado na camera
    // Mas podemos forçar update manual se necessário
    this.objects.forEach(({ lod }) => {
      lod.update(this.camera);
    });
  }
  
  // Factory para criar LODs comuns
  static createTreeLOD(position) {
    const lod = new THREE.LOD();
    
    // Nível 0: 0-15m (detalhado)
    const detailedTree = new THREE.Group();
    // ... tronco detalhado + folhas detalhadas
    lod.addLevel(detailedTree, 15);
    
    // Nível 1: 15-50m (simplificado)
    const simpleTree = new THREE.Mesh(
      new THREE.ConeGeometry(2, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0x2d5a1a })
    );
    lod.addLevel(simpleTree, 50);
    
    // Nível 2: 50m+ (billboard)
    const billboard = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: treeTexture, transparent: true })
    );
    billboard.scale.set(10, 10, 1);
    lod.addLevel(billboard, 100);
    
    lod.position.copy(position);
    return lod;
  }
  
  static createBuildingLOD(position, floors = 10) {
    const lod = new THREE.LOD();
    
    // Detalhado
    const detailed = this._createDetailedBuilding(floors);
    lod.addLevel(detailed, 30);
    
    // Simplificado
    const simple = this._createSimpleBuilding(floors);
    lod.addLevel(simple, 80);
    
    // Caixa bounding
    const box = new THREE.Box3().setFromObject(detailed);
    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(...box.getSize(new THREE.Vector3()).toArray()),
      new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true, transparent: true, opacity: 0.1 })
    );
    lod.addLevel(boxMesh, 200);
    
    lod.position.copy(position);
    return lod;
  }
}
```

## InstancedMesh para Performance

```javascript
// instanced-helpers.js
import * as THREE from 'three';

export class InstancedForest {
  constructor(count = 1000, area = 100) {
    this.count = count;
    this.area = area;
    this.trees = null;
    this.geometry = null;
    this.material = null;
  }
  
  async init(treeModel) {
    // Clona geometria do modelo
    this.geometry = treeModel.geometry.clone();
    this.material = treeModel.material.clone();
    
    // Cria InstancedMesh
    this.trees = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.count
    );
    
    // Gera posições aleatórias
    const dummy = new THREE.Object3D();
    const positions = [];
    
    for (let i = 0; i < this.count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * this.area,
        0,
        (Math.random() - 0.5) * this.area
      );
      
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.scale.setScalar(0.8 + Math.random() * 0.4);
      
      dummy.updateMatrix();
      this.trees.setMatrixAt(i, dummy.matrix);
      
      positions.push(dummy.position.clone());
    }
    
    this.trees.instanceMatrix.needsUpdate = true;
    
    // Frustum culling otimizado
    this.trees.frustumCulled = true;
    this.trees.sortObjects = false;
    
    return this.trees;
  }
  
  // Animação de vento via shader
  applyWind(time, strength = 0.1) {
    if (!this.material.userData.wind) {
      this.material.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.windStrength = { value: 0.1 };
        
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>
          float wind = sin(position.x * 0.5 + time * 0.5) * windStrength * 0.1;
          transformed.x += wind;
          transformed.z += wind * 0.5;
          `
        );
      };
      this.material.userData.wind = true;
    }
    
    this.material.userData.windStrength = strength;
    this.material.uniforms.time.value = time;
  }
}
```

## Device Orientation & Motion

```javascript
// device-orientation.js
export class DeviceOrientation {
  constructor() {
    this.orientation = { alpha: 0, beta: 0, gamma: 0 };
    this.acceleration = { x: 0, y: 0, z: 0 };
    this.rotationRate = { alpha: 0, beta: 0, gamma: 0 };
    
    this._bindEvents();
  }
  
  _bindEvents() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', e => {
        this.orientation = {
          alpha: e.alpha || 0,
          beta: e.beta || 0,
          gamma: e.gamma || 0
        };
        this.onOrientationChange?.(this.orientation);
      });
    }
    
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', e => {
        this.acceleration = {
          x: e.acceleration?.x || 0,
          y: e.acceleration?.y || 0,
          z: e.acceleration?.z || 0
        };
        this.rotationRate = {
          alpha: e.rotationRate?.alpha || 0,
          beta: e.rotationRate?.beta || 0,
          gamma: e.rotationRate?.gamma || 0
        };
        this.onMotion?.(this.acceleration, this.rotationRate);
      });
    }
    
    // Solicita permissão (iOS 13+)
    if (DeviceOrientationEvent.requestPermission) {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') {
          window.addEventListener('deviceorientation', ...);
        }
      });
      
      if (DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission().then(state => {
          if (state === 'granted') {
            window.addEventListener('devicemotion', ...);
          }
        });
      }
    }
  }
  
  // Converte orientação para rotação de câmera
  getCameraRotation() {
    // Alpha = rotação Z (bússola)
    // Beta = inclinação frente/trás (pitch)
    // Gamma = inclinação esquerda/direita (roll)
    return new THREE.Euler(
      THREE.MathUtils.degToRad(-this.orientation.beta),   // pitch
      THREE.MathUtils.degToRad(this.orientation.alpha),    // yaw
      THREE.MathUtils.degToRad(-this.orientation.gamma)    // roll
    );
  }
}
```

## Integração Completa

```javascript
// main-responsive.js
import * as THREE from 'three';
import { ResponsiveRenderer } from './responsive-renderer.js';
import { UnifiedInput } from './unified-input.js';
import { AdaptiveQuality } from './adaptive-quality.js';
import { LODSystem } from './lod-system.js';
import { InstancedForest } from './instanced-helpers.js';
import { DeviceOrientation } from './device-orientation.js';

// Setup completo
async function init() {
  // 1. Renderer responsivo
  const canvas = document.getElementById('canvas');
  const renderer = new ResponsiveRenderer(canvas, {
    qualityPresets: {
      low: { pixelRatio: 1, shadowMap: false, antialias: false },
      medium: { pixelRatio: Math.min(window.devicePixelRatio, 1.5), shadowMap: true, antialias: true },
      high: { pixelRatio: window.devicePixelRatio, shadowMap: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }
    }
  });
  
  // 2. Scene + Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);
  
  // 2. Input unificado
  const input = new UnifiedInput(renderer.renderer, camera, renderer.canvas);
  
  // 3. Adaptive quality
  const adaptiveQuality = new AdaptiveQuality(renderer.renderer, scene, camera, {
    targetFPS: 60
  });
  
  // 4. LOD System
  const lodSystem = new LODSystem(camera);
  
  // 4. Device orientation (opcional)
  const deviceOrientation = new DeviceOrientation();
  
  // 5. Instanced objects para performance
  const forest = new InstancedForest(500, 100);
  await forest.init(treeModel);
  scene.add(forest.trees);
  
  // 5. Adaptive quality callback
  adaptiveQuality.onQualityChange = (quality) => {
    console.log(`Quality adjusted to: ${(quality * 100).toFixed(0)}%`);
  };
  
  // 6. Device orientation → camera
  deviceOrientation.onOrientationChange = (orientation) => {
    const rotation = deviceOrientation.getCameraRotation();
    camera.quaternion.setFromEuler(rotation);
  };
  
  // 6. Render loop
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    
    // Update systems
    lodSystem.update();
    adaptiveQuality.update?.(delta);
    
    // Device orientation
    if (deviceOrientation.orientation.beta !== 0) {
      const rotation = deviceOrientation.getCameraRotation();
      camera.quaternion.slerp(rotation, 0.1);
    }
    
    // Render
    renderer.renderer.render(scene, camera);
  }
  
  animate();
  
  // Cleanup
  window.addEventListener('beforeunload', () => {
    renderer.dispose();
    input.destroy();
  });
}

init();
```

---

## Referências Oficiais (Validados 2026-08-30)

- [Three.js Responsive Scenes](https://threejs.org/docs/#manual/en/introduction/How-to-create-responsive-scenes)
- [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
- [InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)
- [LOD](https://threejs.org/docs/#api/en/objects/LOD)
- [DeviceOrientation API](https://developer.mozilla.org/en-US/docs/Web/API/Device_Orientation_API)

---

## Checklist de Entrega

- [ ] `ResponsiveRenderer` com quality presets + auto-detect
- [ ] `UnifiedInput` unificando touch/mouse/pointer
- [ ] `AdaptiveQuality` com auto-detect + metrics
- [ ] `LODSystem` com factory methods
- [ ] `InstancedForest` / `InstancedHelpers` para performance
- [ ] `DeviceOrientation` com permissão iOS
- [ ] `main-responsive.js` integração completa
- [ ] Device helpers (debounce, throttle, device detection)

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