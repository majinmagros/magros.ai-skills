---
name: threejs-config-constants
description: Use when exposing tweakable Three.js constants for runtime tuning — camera, portal, elevation, speeds — without touching code. Triggers on "threejs constants", "threejs config constants", "threejs tuning constants", "threejs runtime config", "threejs tweakable parameters".
metadata:
  origin: AUTORAL
  source_docs:
    - https://threejs.org/docs/#api/en/core/Object3D
    - https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
    - https://threejs.org/docs/#api/en/materials/Material
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: []
---

# Three.js Config Constants — Runtime Tuning sem Tocar Código

Sistema de **constants expostas** para tuning em runtime: câmera, portal center, elevação, velocidades, materiais, física. Código em `scripts/`.

## Quando usar (gatilhos concretos)

- "Three.js constants expostas para tuning"
- "Three.js config constants runtime"
- "Tuning camera position runtime"
- "Portal center constants"
- "Runtime config Three.js"
- "Tweakable parameters Three.js"

## Quando NÃO usar

- Composição de cena → use `threejs-scene-composer`
- Shaders customizados → use `threejs-shader-effects`
- Deploy → use `threejs-deploy-pipeline`
- Patterns responsivos → use `threejs-responsive-patterns`
- Voxel systems → use `threejs-voxel-block-system`

## Core (`scripts/config-constants.js`)

`ConfigConstants`: `register(key, default, {description, category, min/max/step, options, validator, readonly})` + `registerMany` → `get/set` (com validação, range check, history/undo até 50) → `onChange/onAnyChange` → `savePreset/loadPreset` → `toJSON/loadJSON` → `getUIConfig/getByCategory` → `createControlPanel(container)` (painel HTML por categoria). Tipos inferidos: array, vector2/3, color, euler, matrix4. `createThreeJSDefaults()` registra câmera, portal, ilha, animação, rendering, física e materiais.

```javascript
import { ConfigConstants } from './scripts/config-constants.js';
const config = ConfigConstants.createThreeJSDefaults();
config.onChange('camera.fov', (v) => { camera.fov = v; camera.updateProjectionMatrix(); });
```

## Presets (`scripts/presets.js`)

`minecraftStyle` (Gustavo Campelo), `cinematic`, `mobileOptimized`, `development` + `applyPreset(config, name)`. Hot reload: teclas 1-4. Save/load: Ctrl+S / Ctrl+L (localStorage).

## GUI (`scripts/gui-integration.js` + `scripts/main.js`)

`createGUI(config)` monta pastas dat.gui (Camera/Portal/Animation/Rendering/Materials/Physics). `main.js` mostra o fluxo completo: defaults → preset → GUI → callbacks Three.js → hot reload → save/load.

## Validação (2026-08-30)

- Baseado no vídeo do Gustavo Campelo (portal center, elevação, posição ilha, velocidades)
- Three.js docs (Object3D, Camera, Material); dat.gui / tweakpane confirmados

## Checklist de Entrega

- [ ] `ConfigConstants` (register/get/set/callbacks)
- [ ] Presets (minecraftStyle, cinematic, mobileOptimized, development)
- [ ] dat.gui / tweakpane + localStorage + hot reload
- [ ] Type inference (Vector2/3, Color, Euler) + validation + history/undo

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, commands, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```

## Referências Oficiais

- [Three.js Object3D](https://threejs.org/docs/#api/en/core/Object3D) · [Camera](https://threejs.org/docs/#api/en/cameras/Camera) · [Material](https://threejs.org/docs/#api/en/materials/Material) · [dat.gui](https://github.com/dataarts/dat.gui) · [Tweakpane](https://tweakpane.github.io/docs/)
