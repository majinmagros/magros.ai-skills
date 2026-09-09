---
name: threejs-responsive-patterns
description: Use when making Three.js sites fully responsive — mobile/desktop, unified touch/mouse, LOD system, adaptive quality, performance scaling. Triggers on "threejs responsive", "threejs mobile desktop", "threejs touch mouse", "threejs LOD", "threejs performance scaling", "threejs adaptive quality", "threejs mobile optimization".
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

# Three.js Responsive Patterns — Sites 3D Totalmente Responsivos

Patterns para Three.js **responsivo** com adaptive quality, touch/mouse unificado, LOD e performance scaling. Código em `scripts/`.

## Quando usar (gatilhos concretos)

- "Three.js responsivo mobile desktop"
- "Three.js touch mouse unificado"
- "Three.js LOD system" / "Three.js performance scaling"
- "Three.js adaptive quality" / "Three.js mobile optimization"
- "Three.js touch events"

## Quando NÃO usar

- Composição de cena → use `threejs-scene-composer`
- Shaders customizados → use `threejs-shader-effects`
- Deploy → use `threejs-deploy-pipeline`
- Constants para tuning → use `threejs-config-constants`

## Os 6 Módulos (resumo — código em `scripts/`)

**1. ResponsiveRenderer** (`responsive-renderer.js`) — presets low/medium/high (pixelRatio, shadows, AA, tone mapping); ResizeObserver no container + fallback `window.resize`; re-detecta DPR ao trocar de monitor; `autoDetectQuality()` via benchmark de 2s (fps<30→low, >55→high).

**2. UnifiedInput** (`unified-input.js`) — Pointer Events unificam touch+mouse (down/move/up, drag, click<5px, wheel zoom, pinch zoom 2 dedos, contextmenu off); `raycast()` unificado; `destroy()` limpa listeners.

**3. Helpers** (`input-helpers.js`) — `normalizePointer`, `getDeviceType` (tablet/mobile/desktop por UA), `hasTouch`/`hasPointer`, `debounce` (resize 150ms), `throttle` (16ms).

**4. AdaptiveQuality** (`adaptive-quality.js`) — monitora FPS/draw calls/triângulos/GPU a cada 60 frames; ajusta quality 0.3–1.0 (pixel ratio + shadows on/off); `setTargetFPS`, `setQualityRange`, `getMetrics`.

**5. LODSystem** (`lod-system.js`) — `register(obj, [{distance, geometry, material}])` troca mesh por `THREE.LOD`; factories `createTreeLOD` (detalhado→cone→billboard) e `createBuildingLOD` (detalhado→simples→wireframe); `update(camera)` por frame.

**6. InstancedForest + DeviceOrientation** (`instanced-helpers.js`, `device-orientation.js`) — 1000 árvores em 1 draw call (InstancedMesh + frustum culling) + vento via shader; orientation/motion com permissão iOS 13+ → `getCameraRotation()` (Euler pitch/yaw/roll).

**Integração** (`main-responsive.js`): renderer → scene/camera → input → adaptive → LOD → orientation → forest → animate loop → cleanup. Uso:

```javascript
import { ResponsiveRenderer } from './scripts/responsive-renderer.js';
import { AdaptiveQuality } from './scripts/adaptive-quality.js';
const renderer = new ResponsiveRenderer(canvas);
await renderer.autoDetectQuality();
new AdaptiveQuality(renderer.renderer, scene, camera, { targetFPS: 60 });
```

## Checklist de Entrega

- [ ] `ResponsiveRenderer` (presets + auto-detect)
- [ ] `UnifiedInput` (touch/mouse/pointer) + helpers (debounce, throttle, device)
- [ ] `AdaptiveQuality` (metrics + auto-adjust)
- [ ] `LODSystem` (factories) + `InstancedForest` + `DeviceOrientation` (iOS permission)
- [ ] `main-responsive.js` integração completa

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, commands, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```

## Referências Oficiais (Validados 2026-08-30)

- [Responsive Scenes](https://threejs.org/docs/#manual/en/introduction/How-to-create-responsive-scenes) · [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) · [InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh) · [LOD](https://threejs.org/docs/#api/en/objects/LOD) · [DeviceOrientation](https://developer.mozilla.org/en-US/docs/Web/API/Device_Orientation_API)
