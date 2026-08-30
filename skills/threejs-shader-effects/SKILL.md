---
name: threejs-shader-effects
description: |
  Efeitos customizados Three.js: pixelation, comet trails, mouse distortion, post-processing, shadertoy integration, custom shaders GLSL. Baseado nos efeitos do Gustavo Campelo (pixelation, comet trails, mouse distortion).
  Use quando: "threejs custom shader", "threejs pixelation effect", "threejs mouse distortion", "threejs post processing", "threejs comet trails", "threejs shadertoy", "glsl threejs".
  Não use para: composição de cena (use threejs-scene-composer), deploy (use threejs-deploy-pipeline), patterns responsivos (use threejs-responsive-patterns).
  Outcome: Biblioteca de shaders customizados GLSL para Three.js com efeitos visuais avançados (pixelation, trails, distortion, post-processing).
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

# Three.js Shader Effects — Efeitos Customizados GLSL

Biblioteca de shaders customizados GLSL para Three.js com efeitos visuais avançados: **pixelation, comet trails, mouse distortion, post-processing, shadertoy integration**.

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

## Biblioteca de Shaders

### 1. Pixelation Effect (Baseado no vídeo do Gustavo)

```glsl
// shaders/pixelation.frag
uniform sampler2D tDiffuse;
uniform float pixelSize;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
  vec2 d = 1.0 / resolution;
  vec2 uv = floor(vUv / pixelSize) * pixelSize;
  gl_FragColor = texture2D(tDiffuse, uv);
}

// Uso JavaScript
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const pixelationShader = {
  uniforms: {
    tDiffuse: { value: null },
    pixelSize: { value: 8.0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float pixelSize;
    uniform vec2 resolution;
    varying vec2 vUv;
    void main() {
      vec2 d = 1.0 / resolution;
      vec2 uv = floor(vUv / pixelSize) * pixelSize;
      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `
};

// Uso
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const pixelationPass = new ShaderPass(pixelationShader);
pixelationPass.uniforms.pixelSize.value = 8.0;
composer.addPass(pixelationPass);
```

### 2. Comet Trails Effect

```glsl
// shaders/comet-trails.frag
uniform sampler2D tDiffuse;
uniform float time;
uniform float trailLength;
uniform float trailIntensity;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 color = vec3(0.0);
  float totalWeight = 0.0;
  
  for (int i = 0; i < 16; i++) {
    float offset = float(i) * trailLength / 16.0;
    vec2 sampleUv = uv - vec2(time * 0.5, 0.0) * offset;
    
    // Wrap UV
    sampleUv = fract(sampleUv);
    
    vec3 sampleColor = texture2D(tDiffuse, sampleUv).rgb;
    float weight = 1.0 - float(i) / 16.0;
    weight = pow(weight, 2.0) * trailIntensity;
    
    color += sampleColor * weight;
    totalWeight += weight;
  }
  
  if (totalWeight > 0.0) {
    color /= totalWeight;
  }
  
  vec3 original = texture2D(tDiffuse, uv).rgb;
  gl_FragColor = vec4(mix(original, color, 0.5), 1.0);
}

// Uso
const cometTrailsShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    trailLength: { value: 0.1 },
    trailIntensity: { value: 0.8 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `/* GLSL above */`
};

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  cometPass.uniforms.time.value = clock.getElapsedTime();
  composer.render();
}
```

### 3. Mouse Distortion Effect

```glsl
// shaders/mouse-distortion.frag
uniform sampler2D tDiffuse;
uniform vec2 mouse;
uniform float distortionStrength;
uniform float distortionRadius;
uniform vec2 resolution;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 center = mouse / resolution;
  float dist = distance(uv, center);
  
  if (dist < distortionRadius) {
    float factor = 1.0 - smoothstep(0.0, distortionRadius, dist);
    vec2 offset = (uv - center) * factor * distortionStrength;
    uv += offset;
  }
  
  gl_FragColor = texture2D(tDiffuse, uv);
}

// Uso com rastreamento de mouse
const mouseDistortionShader = {
  uniforms: {
    tDiffuse: { value: null },
    mouse: { value: new THREE.Vector2(0.5, 0.5) },
    distortionStrength: { value: 0.3 },
    distortionRadius: { value: 0.3 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `/* GLSL above */`
};

// Rastreamento de mouse
document.addEventListener('mousemove', (e) => {
  mouseDistortionPass.uniforms.mouse.value.set(
    e.clientX / window.innerWidth,
    1.0 - e.clientY / window.innerHeight
  );
});
```

### 4. Post-Processing Pipeline Completo

```javascript
// post-processing-setup.js
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { BloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

export function createPostProcessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  
  // 1. Render Pass
  composer.addPass(new RenderPass(scene, camera));
  
  // 2. Custom Shader Passes (adicionados dinamicamente)
  // pixelationPass, cometTrailsPass, mouseDistortionPass
  
  // 3. Bloom (opcional)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5,  // strength
    0.4,  // radius
    0.85  // threshold
  );
  composer.addPass(bloomPass);
  
  // 4. Film grain (opcional)
  const filmPass = new FilmPass(
    0.35,   // noiseIntensity
    0.025,  // scanlinesIntensity
    648,    // scanlinesCount
    false   // grayscale
  );
  composer.addPass(filmPass);
  
  // 5. SMAA Anti-aliasing
  const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
  composer.addPass(smaaPass);
  
  return composer;
}

// Uso
const composer = createPostProcessing(renderer, scene, camera);

// Adicionar passes customizados
composer.addPass(pixelationPass);
composer.addPass(cometTrailsPass);
composer.addPass(mouseDistortionPass);

// Render loop
function animate() {
  requestAnimationFrame(animate);
  composer.render();
}
```

### 5. Shadertoy Integration

```javascript
// shadertoy-integration.js
// Conversão básica Shadertoy → Three.js

export function shadertoyToThreeJS(shadertoyCode) {
  // Shadertoy usa: void mainImage(out vec4 fragColor, in vec2 fragCoord)
  // Three.js usa: void main() { gl_FragColor = ...; }
  
  const header = `
    uniform float time;
    uniform vec2 resolution;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
  `;
  
  const mainFunction = `
    void main() {
      vec2 fragCoord = vUv * resolution;
      vec4 fragColor;
      mainImage(fragColor, vUv * resolution);
      gl_FragColor = fragColor;
    }
  `;
  
  // Extrai mainImage do código Shadertoy
  const mainImageMatch = shadertoyCode.match(/void mainImage\s*\([^)]*\)\s*\{([\s\S]*?)\}/);
  if (!mainImageMatch) throw new Error('mainImage não encontrado');
  
  return header + mainImageMatch[1] + mainFunction;
}

// Exemplo uso
const shadertoyExample = `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0,2,4));
  fragColor = vec4(col, 1.0);
}
`;

const threeJSShader = shadertoyToThreeJS(shadertoyExample);
// Use com ShaderMaterial
```

### 6. Post-Processing Presets

```javascript
// presets.js
export const postProcessingPresets = {
  // Estilo retro/pixelado
  retro: {
    pixelation: { pixelSize: 8 },
    bloom: { strength: 0.3, radius: 0.4 },
    film: { noise: 0.3, scanlines: 0.02 },
    colorGrading: { contrast: 1.2, saturation: 1.1 }
  },
  
  // Estilo cyberpunk
  cyberpunk: {
    bloom: { strength: 1.5, radius: 0.8, threshold: 0.7 },
    colorGrading: { 
      hueShift: 0.1, 
      saturation: 1.5, 
      contrast: 1.3 
    },
    chromaticAberration: { offset: 0.005 }
  },
  
  // Estilo cinematográfico
  cinematic: {
    bloom: { strength: 0.5, radius: 0.6 },
    film: { noise: 0.1, scanlines: 0.01, grayscale: false },
    colorGrading: { 
      lift: [0.02, 0.01, 0.0], 
      gamma: [1.0, 1.0, 1.0], 
      gain: [1.05, 1.02, 1.0] 
    },
    vignette: { amount: 0.3 }
  },
  
  // Estilo minimal/clean
  clean: {
    smaa: true,
    colorGrading: { contrast: 1.05 },
    pixelation: null
  }
};

// Aplicar preset
export function applyPreset(composer, presetName, customOverrides = {}) {
  const preset = postProcessingPresets[presetName];
  if (!preset) throw new Error(`Preset ${presetName} não encontrado`);
  
  const config = { ...preset, ...customOverrides };
  // Aplicar configurações aos passes...
}
```

---

## Referências Oficiais (Validados 2026-08-30)

- [Three.js Post Processing](https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing)
- [Three.js ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [EffectComposer](https://threejs.org/docs/#api/en/postprocessing/EffectComposer)
- [Shadertoy](https://www.shadertoy.com/)

---

## Checklist de Entrega

- [ ] Pixelation shader funcional
- [ ] Comet trails shader funcional  
- [ ] Mouse distortion shader funcional
- [ ] Post-processing pipeline configurável
- [ ] Shadertoy integration helper
- [ ] 4 presets prontos (retro, cyberpunk, cinematic, clean)
- [ ] Documentação GLSL comentada
- [ ] Exemplos de uso completos

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