# Three.js Responsive Patterns Reference (Validado via Context7 + Video Gustavo Campelo)

## Core: Responsive Renderer

```javascript
// responsive-renderer.js
import * as THREE from 'three';

export class ResponsiveRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      qualityPresets: {
        low: { 
          pixelRatio: 1, 
          shadowMap: false, 
          antialias: false, 
          toneMapping: THREE.NoToneMapping,
          maxPixelRatio: 1
        },
        medium: { 
          pixelRatio: Math.min(window.devicePixelRatio, 1.5), 
          shadowMap: true, 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          maxPixelRatio: 2
        },
        high: { 
          pixelRatio: window.devicePixelRatio, 
          shadowMap: true, 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          maxPixelRatio: 3
        }
      },
      currentPreset: 'medium',
      autoDetect: true,
      ...options
    };
    
    this.renderer = this._createRenderer();
    this._setupResizeObserver();
    this._setupDevicePixelRatio();
    this._setupQualityDetection();
  }
  
  _createRenderer() {
    const preset = this.options.qualityPresets[this.options.currentPreset];
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: preset.antialias,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      failIfMajorPerformanceCaveat: false
    });
    
    renderer.setPixelRatio(preset.pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = preset.shadowMap;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = preset.toneMapping;
    renderer.toneMappingExposure = 1;
    renderer.physicallyCorrectLights = true;
    
    return renderer;
  }
  
  _setupResizeObserver() {
    const resizeObserver = new ResizeObserver(() => this.resize());
    resizeObserver.observe(this.canvas);
    
    // Fallback
    window.addEventListener('resize', () => this.resize());
  }
  
  _setupDevicePixelRatio() {
    // Detect device pixel ratio changes
    const mediaQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mediaQuery.addEventListener('change', () => {
      if (this.options.autoDetect) {
        this._updateQualityPreset();
      }
    });
  }
  
  _setupQualityDetection() {
    // Auto-detect quality based on FPS
    let frameCount = 0;
    let lastTime = performance.now();
    let lowFpsCount = 0;
    
    const checkPerformance = (now) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = now;
        
        if (fps < 30) {
          lowFpsCount++;
          if (lowFpsCount >= 3 && this.options.currentPreset !== 'low') {
            this.setQuality('low');
            console.warn('⚠️ Low FPS detected, switching to low quality');
          }
        } else if (fps > 55 && this.options.currentPreset === 'low') {
          lowFpsCount = 0;
          this.setQuality('medium');
          console.log('✅ FPS recovered, switching to medium quality');
        }
      };
      
      // Add to animation loop externally
      this._performanceCheck = checkPerformance;
    }
    
    // Expose for animation loop
    if (typeof window !== 'undefined') {
      window.__threejs_perf_check = checkPerformance;
    }
  }
  
  _updateQualityPreset() {
    const dpr = window.devicePixelRatio;
    if (dpr <= 1) this.setQuality('low');
    else if (dpr <= 1.5) this.setQuality('medium');
    else this.setQuality('high');
  }
  
  setQuality(preset) {
    if (!this.options.qualityPresets[preset]) return false;
    
    this.options.currentPreset = preset;
    const oldRenderer = this.renderer;
    this.renderer = this._createRenderer();
    
    // Copy state
    this.renderer.setAnimationLoop(oldRenderer.getAnimationLoop());
    
    // Dispose old
    oldRenderer.dispose();
    
    console.log(`🎨 Quality changed to: ${preset}`);
    return true;
  }
  
  resize() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(this.options.qualityPresets[this.options.currentPreset].pixelRatio);
    
    // Update camera aspect (if camera ref available)
    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }
  
  // Touch vs Mouse unified
  setupUnifiedControls(camera) {
    this.camera = camera;
    
    let isTouch = false;
    let isPointerDown = false;
    let lastPointer = { x: 0, y: 0 };
    
    const onPointerDown = (e) => {
      isPointerDown = true;
      isTouch = e.pointerType === 'touch';
      lastPointer = { x: e.clientX, y: e.clientY };
    };
    
    const onPointerMove = (e) => {
      if (!isPointerDown) return;
      
      const deltaX = e.clientX - lastPointer.x;
      const deltaY = e.clientY - lastPointer.y;
      lastPointer = { x: e.clientX, y: e.clientY };
      
      if (isTouch) {
        // Touch: rotate camera
        if (this.controls) {
          this.controls.rotateLeft(deltaX * 0.005);
          this.controls.rotateUp(deltaY * 0.005);
        }
      } else {
        // Mouse: orbit or pan based on button
        if (e.buttons === 1) { // Left click
          if (this.controls) {
            this.controls.rotateLeft(deltaX * 0.005);
            this.controls.rotateUp(deltaY * 0.005);
          }
        } else if (e.buttons === 2) { // Right click
          if (this.controls) {
            this.controls.panLeft(deltaX * 0.01);
            this.controls.panUp(deltaY * 0.01);
          }
        }
      }
      lastPointer = { x: e.clientX, y: e.clientY };
    };
    
    const onPointerUp = () => {
      isPointerDown = false;
    };
    
    this.canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointerleave', onPointerUp);
    
    // Touch-specific: pinch to zoom
    let initialDistance = 0;
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialDistance = Math.hypot(dx, dy);
      }
    });
    
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.hypot(dx, dy);
        const delta = distance - initialDistance;
        
        if (this.controls) {
          this.controls.dolly(delta * 0.01);
        }
        initialDistance = distance;
      }
    }, { passive: false });
    
    // Cleanup function
    return () => {
      this.canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointerleave', onPointerUp);
    };
  }
  
  // LOD System
  setupLOD(camera, objects, distances = [10, 30, 60]) {
    const lodObjects = objects.map(obj => {
      const lod = new THREE.LOD();
      
      // Level 0: High detail (close)
      lod.addLevel(obj.highDetail || obj, distances[0]);
      
      // Level 1: Medium detail
      if (obj.mediumDetail) {
        lod.addLevel(obj.mediumDetail, distances[1]);
      } else {
        lod.addLevel(obj, distances[1]);
      }
      
      // Level 2: Low detail (far)
      if (obj.lowDetail) {
        lod.addLevel(obj.lowDetail, distances[2]);
      }
      
      return lod;
    });
    
    // Update LOD in animation loop
    return () => {
      lodObjects.forEach(lod => lod.update(camera));
    };
  }
  
  // Adaptive Quality based on FPS
  enableAdaptiveQuality(targetFPS = 55) {
    let consecutiveLow = 0;
    let consecutiveHigh = 0;
    
    return (fps) => {
      if (fps < targetFPS - 5) {
        consecutiveLow++;
        consecutiveHigh = 0;
        if (consecutiveLow >= 3 && this.options.currentPreset !== 'low') {
          this.setQuality('low');
        }
      } else if (fps > targetFPS + 5) {
        consecutiveHigh++;
        consecutiveLow = 0;
        if (consecutiveHigh >= 5 && this.options.currentPreset === 'low') {
          this.setQuality('medium');
        }
      } else {
        consecutiveLow = 0;
        consecutiveHigh = 0;
      }
    };
  }
  
  // Cleanup
  dispose() {
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas.removeEventListener('resize', this.resize);
  }
}

// Usage
/*
const responsiveRenderer = new ResponsiveRenderer(canvas, {
  qualityPresets: { ... },
  currentPreset: 'medium',
  autoDetect: true
});

// In animation loop:
function animate() {
  requestAnimationFrame(animate);
  
  // Update performance check
  if (window.__threejs_perf_check) {
    window.__threejs_perf_check(performance.now());
  }
  
  // Update LOD
  if (window.__threejs_lod_update) {
    window.__threejs_lod_update();
  }
  
  renderer.render(scene, camera);
}
animate();
*/
```

---

## Mobile/ Desktop Breakpoints

```javascript
// Breakpoints (CSS + JS sync)
export const BREAKPOINTS = {
  xs: 320,   // Mobile small
  sm: 640,   // Mobile
  md: 768,   // Tablet
  lg: 1024,  // Desktop
  xl: 1280,  // Wide
  '2xl': 1536 // Ultra-wide
};

// CSS Variables
:root {
  --bp-xs: 320px;
  --bp-sm: 640px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
  --bp-2xl: 1536px;
}

// JS Helper
export function getBreakpoint() {
  const width = window.innerWidth;
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  if (width < 1536) return 'xl';
  return '2xl';
}

// Auto-adjust quality per breakpoint
export function getQualityForBreakpoint(bp) {
  const map = {
    xs: 'low',
    sm: 'low',
    md: 'medium',
    lg: 'medium',
    xl: 'high',
    '2xl': 'high'
  };
  return map[bp] || 'medium';
}
```

---

## Touch vs Mouse Unified Controls

```javascript
// unified-controls.js
export function setupUnifiedControls(renderer, camera, controls) {
  const canvas = renderer.domElement;
  let isTouch = false;
  
  // Detect input type
  canvas.addEventListener('pointerdown', (e) => {
    isTouch = e.pointerType === 'touch';
  });
  
  // Pointer events (unified)
  const onPointerDown = (e) => {
    if (e.target !== canvas) return;
    
    // Prevent context menu on right click
    if (e.button === 2) e.preventDefault();
  };
  
  canvas.addEventListener('pointerdown', onPointerDown);
  
  // Touch-specific: prevent scroll on canvas
  canvas.addEventListener('touchstart', (e) => {
    if (e.target === canvas) {
      e.preventDefault(); // Prevent page scroll
    }
  }, { passive: false });
  
  canvas.addEventListener('touchmove', (e) => {
    if (e.target === canvas) {
      e.preventDefault(); // Prevent page scroll
    }
  }, { passive: false });
  
  // Wheel zoom (desktop)
  canvas.addEventListener('wheel', (e) => {
    if (e.target !== canvas) return;
    e.preventDefault();
    
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    if (controls) {
      controls.dolly(zoomFactor);
    }
  }, { passive: false });
  
  // Context menu
  canvas.addEventListener('contextmenu', (e) => {
    if (e.target === canvas) e.preventDefault();
  });
  
  // Keyboard (desktop)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    const speed = 0.5;
    switch (e.key) {
      case 'w': case 'ArrowUp':
        camera.position.z -= speed; break;
      case 's': case 'ArrowDown':
        camera.position.z += speed; break;
      case 'a': case 'ArrowLeft':
        camera.position.x -= speed; break;
      case 'd': case 'ArrowRight':
        camera.position.x += speed; break;
      case 'q':
        camera.position.y += speed; break;
      case 'e':
        camera.position.y -= speed; break;
      case 'r':
        camera.position.set(15, 15, 15); // Reset
        controls?.target.set(0, 0, 0);
        break;
    }
  });
  
  return () => {
    // Cleanup
  };
}

// Usage
/*
const cleanup = setupUnifiedControls(renderer, camera, controls);
// Call cleanup() on unmount
*/
```

---

## LOD (Level of Detail) System

```javascript
// lod-system.js
export function createLODObject(highDetail, mediumDetail, lowDetail, distances = [10, 30, 60]) {
  const lod = new THREE.LOD();
  
  // Level 0: High detail (0 - 10 units)
  lod.addLevel(highDetail, distances[0]);
  
  // Level 1: Medium detail (10 - 30 units)
  lod.addLevel(mediumDetail || highDetail, distances[1]);
  
  // Level 2: Low detail (30 - 60 units)
  lod.addLevel(lowDetail || mediumDetail || highDetail, distances[2]);
  
  // Level 3: Culled (> 60 units)
  // No level added = invisible
  
  return lod;
}

// Factory for common objects
export function createLODTree(position, type = 'tree') {
  const geometries = {
    tree: {
      high: createTreeHighDetail(),
      medium: createTreeMediumDetail(),
      low: createTreeLowDetail()
    },
    rock: {
      high: createRockHighDetail(),
      medium: createRockMediumDetail(),
      low: createRockLowDetail()
    }
  };
  
  const { high, medium, low } = geometries[type] || geometries.tree;
  const lod = createLODObject(high, medium, low);
  lod.position.copy(position);
  
  return lod;
}

// Auto-create LOD from single model (decimation)
export async function createLODFromModel(gltf, distances = [10, 30, 60]) {
  // Requires three-mesh-bvh or similar for auto-decimation
  // Placeholder for manual LOD creation
  return createLODObject(gltf.scene, gltf.scene, gltf.scene, distances);
}
```

---

## Performance Monitoring

```javascript
// performance-monitor.js
export class PerformanceMonitor {
  constructor(renderer, targetFPS = 55) {
    this.renderer = renderer;
    this.targetFPS = targetFPS;
    this.frames = [];
    this.lastTime = performance.now();
    this.callbacks = [];
  }
  
  update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    
    const fps = 1000 / delta;
    this.frames.push(fps);
    if (this.frames.length > 60) this.frames.shift();
    
    const avgFPS = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    
    this.callbacks.forEach(cb => cb({
      fps,
      avgFPS,
      delta,
      memory: performance.memory?.usedJSHeapSize
    }));
    
    return { fps, avgFPS, delta };
  }
  
  onFrame(callback) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }
  
  getStats() {
    if (this.frames.length === 0) return null;
    return {
      current: this.frames[this.frames.length - 1],
      average: this.frames.reduce((a, b) => a + b, 0) / this.frames.length,
      min: Math.min(...this.frames),
      max: Math.max(...this.frames),
      memory: performance.memory?.usedJSHeapSize
    };
  }
}

// Usage
/*
const monitor = new PerformanceMonitor(renderer);

monitor.onFrame(({ fps, avgFPS }) => {
  // Adaptive quality
  if (avgFPS < 30) {
    // Downgrade quality
  }
});

function animate() {
  requestAnimationFrame(animate);
  
  monitor.update();
  
  renderer.render(scene, camera);
}
animate();
*/
```

---

## Referências

- Gustavo Campelo: "Dessa Forma Crio Sites 3D Interativos com IA" (gucampelo)
- Three.js Responsive: https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
- Pointer Events: https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events
- ResizeObserver: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver