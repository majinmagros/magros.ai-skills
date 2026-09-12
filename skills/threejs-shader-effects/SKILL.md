---
name: threejs-shader-effects
description: Use when creating custom Three.js shaders — pixelation, comet trails, mouse distortion, post-processing, Shadertoy integration, GLSL. Triggers on "threejs custom shader", "threejs pixelation effect", "threejs mouse distortion", "threejs post processing", "threejs comet trails", "threejs shadertoy", "glsl threejs".
metadata:
  origin: AUTORAL
  source_docs:
    - https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing
    - https://threejs.org/docs/#api/en/materials/ShaderMaterial
    - https://threejs.org/docs/#api/en/postprocessing/EffectComposer
    - https://github.com/mrdoob/three.js/tree/dev/examples/jsm/postprocessing
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: []
---

# Three.js Shader Effects — GLSL Customizado

Biblioteca de shaders GLSL: **pixelation, comet trails, mouse distortion, post-processing, Shadertoy integration**. Código em `scripts/`.

## Quando usar (gatilhos concretos)

- "Crie shader de pixelation para Three.js"
- "Efeito comet trails no Three.js"
- "Distortion no mouse Three.js"
- "Post-processing Three.js custom"
- "Integração Shadertoy Three.js"
- "Custom shader GLSL Three.js"

## Quando NÃO usar

- Composição de cena → use `threejs-scene-composer`
- Deploy → use `threejs-deploy-pipeline`
- Patterns responsivos → use `threejs-responsive-patterns`
- Constants para tuning → use `threejs-config-constants`

## Biblioteca (resumo — código em `scripts/`)

**1. Pixelation** (`shaders/pixelation.js`): quantiza UV por `pixelSize` (default 8.0) via ShaderPass após RenderPass.

**2. Comet trails** (`shaders/comet-trails.js`): 16 samples com decaimento quadrático × `trailIntensity`; `time` atualizado no loop (`clock.getElapsedTime()`).

**3. Mouse distortion** (`shaders/mouse-distortion.js`): lente em `mouse/resolution` com raio `distortionRadius` e força `distortionStrength`; mousemove atualiza uniform (Y invertido).

**4. Pipeline** (`post-processing-setup.js`): `createPostProcessing(renderer, scene, camera)` — RenderPass → customs → UnrealBloom (0.5/0.4/0.85) → Film (0.35/0.025/648) → SMAA.

**5. Shadertoy** (`shadertoy-integration.js`): `shadertoyToThreeJS(code)` — extrai `mainImage`, injeta header (`time/resolution/tDiffuse/vUv`) + `main()` wrapper → ShaderMaterial.

**6. Presets** (`presets.js`): retro / cyberpunk / cinematic / clean + `applyPreset(composer, name, overrides)`.

```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { pixelationShader } from './scripts/shaders/pixelation.js';

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const pixelationPass = new ShaderPass(pixelationShader);
pixelationPass.uniforms.pixelSize.value = 8.0;
composer.addPass(pixelationPass);
// no loop: composer.render();
```

## Checklist de Entrega

- [ ] Pixelation, comet trails e mouse distortion funcionais