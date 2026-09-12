---
name: img2threejs
description: Use when converting a static image into optimized Three.js/WebGL code from scratch — geometry, materials, lighting, interactive scene. Triggers on "imagem para 3D", "img2threejs", "image to threejs", "gerar threejs de imagem", "static image to interactive 3D", "webgl from image".
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