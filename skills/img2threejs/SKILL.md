---
name: img2threejs
description: >-
  Converte imagem estática em código Three.js/WebGL otimizado do zero. Analisa a imagem, identifica formas geométricas, materiais, iluminação e gera cena 3D interativa renderizada via WebGL/WebGPU. Use quando: "imagem para 3D", "img2threejs", "image to threejs", "gerar threejs de imagem", "static image to interactive 3D", "webgl from image". Non-triggers: modelagem 3D manual, GLTF/USDZ loaders, photogrammetry, AI 3D generation (Meshy, Tripo, CSM), Lottie/SVG animation. Outcome: código Three.js completo (scene, camera, renderer, geometry, materials, lights, controls, animation loop) escrito do zero, otimizado para performance, interativo (OrbitControls), sem depender de assets externos.
metadata:
  origin: ECC
  source_docs:
    - https://github.com/mrdoob/three.js
    - https://context7.com/mrdoob/three.js
    - https://threejs.org/docs/
    - https://threejs.org/examples/
---

# img2threejs — Image to Three.js/WebGL Generator

Analisa uma **imagem estática** de um objeto/forma e gera **do zero** todo o código Three.js + WebGL/WebGPU para renderizar um modelo 3D interativo e otimizado no navegador.

## Quando usar (gatilhos concretos)

- "Transforme esta imagem em Three.js"
- "Gere código 3D a partir desta imagem"
- "Crie modelo 3D interativo baseado nesta foto/ilustração"
- Precisa de objeto 3D leve, procedural, sem carregar GLTF/GLB externo
- Quer controle total sobre geometria, materiais, shaders, performance

## Quando NÃO usar

- Carregar modelos 3D prontos (use `GLTFLoader`, `OBJLoader`, `USDZLoader`)
- Fotogrametria / reconstrução 3D realista de múltiplas fotos (use Meshroom, RealityCapture, Polycam)
- Geração de 3D por IA generativa (Meshy, Tripo, CSM, Rodin, Trellis, Hunyuan3D)
- Animações Lottie/SVG 2D (use `motion-design-skill` ou `lottie-web`)
- Vídeo para 3D / NeRF / Gaussian Splatting

## Pipeline (baseado no vídeo + docs Three.js oficiais)

### 1. Análise da imagem (input)
- Recebe: URL da imagem, base64, ou File object
- Identifica: formas geométricas primárias (cubos, esferas, cilindros, torus, planos), simetrias, cores dominantes, materiais (metal, plástico, vidro, emissivo), iluminação aparente, fundo
- **Limitação**: funciona melhor com objetos "suaves" (formas geométricas, produtos, ícones 3D) — rostos/orgânicos complexos geram geometria pesada/imperfeita

### 2. Geração de código Three.js (output)
Produz arquivo(s) `.js`/`.ts` contendo:

```javascript
// Estrutura padrão gerada
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 1000);
camera.position.set(0, 0, 5);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(w, h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// 2. Controls (interatividade)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 3. Lights (baseado na análise da imagem)
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
const keyLight = new THREE.DirectionalLight(0xffffff, 1);
keyLight.position.set(5, 10, 7);
scene.add(ambient, keyLight);

// 4. Geometry + Materials (reconstruídos da imagem)
// Ex.: cubo arredondado → BoxGeometry + BevelModifier / RoundedBoxGeometry
// Ex.: esfera → SphereGeometry com segments otimizados
// Materiais: MeshStandardMaterial / MeshPhysicalMaterial com mapas gerados proceduralmente

// 5. Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // rotação automática opcional
  // mesh.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();

// 6. Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

### 3. Otimizações aplicadas automaticamente
- **Geometria**: `BufferGeometry` + `dispose()` cleanup; `mergeGeometries` para objetos estáticos
- **Materiais**: reutilizar `MeshStandardMaterial` onde possível; `texture.generateMipmaps = true`
- **Renderer**: `powerPreference: "high-performance"`, `antialias` condicional, `alpha: true` se fundo transparente
- **WebGPU** (opcional): `import * as THREE from 'three/webgpu'` + `WebGPURenderer` para browsers suportados
- **TSL (Three Shading Language)**: shaders customizados via `three/tsl` para materiais complexos

### 4. Entregáveis
- `scene.js` / `scene.ts` — código principal pronto para rodar (Vite, Next.js, vanilla)
- `scene.webgpu.js` — variante WebGPU/TSL (se solicitado)
- `README.md` — como integrar no projeto (imports, bundler, canvas target)

## Regras de geração (best practices Three.js conferidas 2026-08-29)

| Regra | Por quê |
|---|---|
| Sempre `OrbitControls` + `enableDamping` | Interatividade padrão esperada |
| `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` | Performance em mobile/retina |
| `MeshStandardMaterial` / `MeshPhysicalMaterial` | PBR realista, compatível com luzes |
| Geometrias procedurais (`BoxGeometry`, `SphereGeometry`, `CylinderGeometry`, `TorusGeometry`, `RoundedBoxGeometry`) | Leves, paramétricas, sem assets |
| `scene.traverse(obj => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) obj.material.dispose(); })` | Cleanup de memória |
| `requestAnimationFrame` loop + `controls.update()` | Padrão Three.js oficial |
| Evitar `MeshBasicMaterial` (exceto wireframe/debug) | Não reage a luz = visual pobre |

## Validação contra docs oficiais

- [Three.js Fundamentals](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene)
- [WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)
- [OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)
- [WebGPURenderer + TSL](https://github.com/mrdoob/three.js/tree/dev/examples/webgpu)
- [Performance Tips](https://threejs.org/docs/#manual/en/introduction/How-to-optimize-performance)

## Referências

- `references/threejs-boilerplate.js` — template base comentado
- `references/geometry-primitives.md` — mapeamento forma visual → Three.js primitive
- `references/material-presets.md` — presets de material por tipo visual (metal, plástico, vidro, matte, emissivo)
- `references/webgpu-tsl-guide.md` — guia rápido WebGPU + TSL para shaders customizados

## Outcome esperado

Dada uma imagem de entrada, a skill produz código Three.js que:
1. **Roda imediatamente** em Vite/Next.js/vanilla (npm i three + copiar arquivo)
2. **Renderiza objeto 3D reconhecível** baseado na imagem (geometria procedural aproximada)
3. **É interativo** (OrbitControls: rotação, zoom, pan)
4. **É performático** (< 100KB gzipped, 60fps em mobile)
5. **Não depende de assets externos** (texturas/procedurais, geometrias nativas)
6. **Inclui cleanup** para evitar memory leaks em SPA