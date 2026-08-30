---
name: threejs-scene-composer
description: |
  Composição modular de cenas Three.js: pipeline modular estilo "elemento por elemento" para criar cenas 3D complexas bloco por bloco (geometrias, materiais, iluminação, câmera, física, animações). Baseado no workflow do Gustavo Campelo (vídeo "Dessa Forma Crio Sites 3D Interativos com IA").
  Use quando: "compor cena threejs", "threejs scene composition", "modular threejs scene", "element by element threejs", "threejs scene pipeline", "compor cena 3d bloco a bloco".
  Não use para: deploy (use threejs-deploy-pipeline), shaders (use threejs-shader-effects), voxel systems (use threejs-voxel-block-system).
  Outcome: Pipeline modular para compor cenas Three.js complexas elemento por elemento com registry de geometrias, materiais, iluminação, câmera, física e animações.
metadata:
  origin: AUTORAL
  source_docs:
    - https://threejs.org/docs/#manual/en/introduction/Creating-a-scene
    - https://threejs.org/docs/#manual/en/introduction/How-to-animate
    - https://github.com/mrdoob/three.js/tree/dev/examples
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: []
---

# Three.js Scene Composer — Compositor Modular de Cenas Three.js

Pipeline modular para compor cenas Three.js complexas **elemento por elemento** (geometrias, materiais, iluminação, câmera, física, animações) seguindo o workflow "bloco por bloco" do Gustavo Campelo.

## Quando usar (gatilhos concretos)

- "Componha esta cena Three.js elemento por elemento"
- "Crie pipeline modular para cena 3D complexa"
- "Estruture cena Three.js com registry de geometrias/materiais/luzes"
- "Componha cena 3D bloco a bloco (estilo Minecraft)"
- "Estruture scene graph Three.js de forma modular"

## Quando NÃO usar

- Deploy de site 3D → use `threejs-deploy-pipeline`
- Shaders customizados → use `threejs-shader-effects`
- Sistema voxel estilo Minecraft → use `threejs-voxel-block-system`
- Patterns responsivos → use `threejs-responsive-patterns`
- Constants para tuning → use `threejs-config-constants`

## Pipeline Modular (Workflow "Elemento por Elemento")

### 1. Scene Registry (Fundação)

```javascript
// scene-registry.js — Registry central da cena
export class SceneRegistry {
  constructor() {
    this.geometries = new Map();
    this.materials = new Map();
    this.meshes = new Map();
    this.lights = new Map();
    this.cameras = new Map();
    this.animations = new Map();
    this.physics = new Map();
  }

  // Geometrias
  registerGeometry(name, geometry) { this.geometries.set(name, geometry); }
  getGeometry(name) { return this.geometries.get(name); }

  // Materiais
  registerMaterial(name, material) { this.materials.set(name, material); }
  getMaterial(name) { return this.materials.get(name); }

  // Meshes (combinação geometria + material)
  registerMesh(name, mesh) { this.meshes.set(name, mesh); }
  getMesh(name) { return this.meshes.get(name); }

  // Limpeza
  dispose() {
    this.geometries.forEach(g => g.dispose());
    this.materials.forEach(m => m.dispose());
  }
}
```

### 2. Geometry Factory (Blocos Básicos)

```javascript
// geometry-factory.js — Factory de geometrias reutilizáveis
import * as THREE from 'three';

export class GeometryFactory {
  static createBox(size = 1, options = {}) {
    const { width = size, height = size, depth = size } = options;
    return new THREE.BoxGeometry(width, height, depth);
  }

  static createSphere(radius = 1, options = {}) {
    const { widthSegments = 32, heightSegments = 16 } = options;
    return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  }

  static createCylinder(radiusTop = 1, radiusBottom = 1, height = 1, options = {}) {
    const { radialSegments = 32 } = options;
    return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
  }

  static createPlane(width = 1, height = 1, options = {}) {
    const { widthSegments = 1, heightSegments = 1 } = options;
    return new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
  }

  // Minecraft-style blocks
  static createBlock(type, options = {}) {
    const { size = 1 } = options;
    switch (type) {
      case 'grass': return this.createBox(size);
      case 'stone': return this.createBox(size);
      case 'dirt': return this.createBox(size);
      case 'wood': return this.createBox(size);
      case 'leaves': return this.createBox(size);
      case 'water': return this.createPlane(size, size);
      default: return this.createBox(size);
    }
  }
}
```

### 3. Material Registry (PBR + Estilizados)

```javascript
// material-registry.js — Registry de materiais PBR e estilizados
import * as THREE from 'three';

export class MaterialRegistry {
  constructor() {
    this.materials = new Map();
    this._createDefaults();
  }

  _createDefaults() {
    // PBR Realistas
    this.register('grass', new THREE.MeshStandardMaterial({
      color: 0x4a7c2e,
      roughness: 0.8,
      metalness: 0.0,
      roughnessMap: null,
      normalMap: null
    }));

    this.register('stone', new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.9,
      metalness: 0.1
    }));

    this.register('water', new THREE.MeshPhysicalMaterial({
      color: 0x006994,
      transmission: 0.9,
      opacity: 0.8,
      roughness: 0.1,
      metalness: 0.0,
      ior: 1.33,
      thickness: 0.5
    }));

    // Estilizados (toon/cartoon)
    this.register('toon-grass', new THREE.MeshToonMaterial({
      color: 0x4a7c2e,
      gradientMap: this._createToonGradient()
    }));

    this.register('toon-stone', new THREE.MeshToonMaterial({
      color: 0x888888,
      gradientMap: this._createToonGradient()
    });
  }

  _createToonGradient() {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 1;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 256, 0);
    gradient.addColorStop(0, '#2d5a1a');
    gradient.addColorStop(0.5, '#4a7c2e');
    gradient.addColorStop(1, '#6db83a');
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    return texture;
  }

  register(name, material) { this.materials.set(name, material); }
  get(name) { return this.materials.get(name); }
}
```

### 4. Scene Composer (Orquestrador Principal)

```javascript
// scene-composer.js — Orquestrador principal da composição
import * as THREE from 'three';
import { SceneRegistry } from './scene-registry.js';
import { GeometryFactory } from './geometry-factory.js';
import { MaterialRegistry } from './material-registry.js';

export class SceneComposer {
  constructor() {
    this.registry = new SceneRegistry();
    this.geometryFactory = new GeometryFactory();
    this.materialRegistry = new MaterialRegistry();
    this.scene = new THREE.Scene();
    this._setupDefaults();
  }

  _setupDefaults() {
    // Background
    this.scene.background = new THREE.Color(0x87ceeb);
    
    // Fog
    this.scene.fog = new THREE.Fog(0x87ceeb, 50, 200);
  }

  // === BLOCOS BÁSICOS ===
  
  addBlock(type, position, options = {}) {
    const geometry = this.geometryFactory.createBlock(type, options);
    const material = this.materialRegistry.get(type) || this.materialRegistry.get('stone');
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    this.registry.registerMesh(`${type}-${position.x}-${position.y}-${position.z}`, mesh);
    this.scene.add(mesh);
    
    return mesh;
  }

  addCustomBlock(geometryName, materialName, position, options = {}) {
    const geometry = this.registry.getGeometry(geometryName) || 
                     this.geometryFactory.createBox(1, options);
    const material = this.registry.getMaterial(materialName) || 
                     this.materialRegistry.get('stone');
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    const name = `custom-${position.x}-${position.y}-${position.z}`;
    this.registry.registerMesh(name, mesh);
    this.scene.add(mesh);
    
    return mesh;
  }

  // === ILUMINAÇÃO ===
  
  setupLighting(config = {}) {
    const { 
      ambientColor = 0xffffff, 
      ambientIntensity = 0.5,
      directionalColor = 0xffffff,
      directionalIntensity = 1,
      directionalPosition = new THREE.Vector3(50, 100, 50),
      enableShadows = true
    } = config;

    // Ambient
    const ambient = new THREE.AmbientLight(ambientColor, ambientIntensity);
    this.scene.add(ambient);
    this.registry.lights.set('ambient', ambient);

    // Directional (Sol)
    const directional = new THREE.DirectionalLight(directionalColor, directionalIntensity);
    directional.position.copy(directionalPosition);
    
    if (enableShadows) {
      directional.castShadow = true;
      directional.shadow.mapSize.width = 2048;
      directional.shadow.mapSize.height = 2048;
      directional.shadow.camera.near = 0.5;
      directional.shadow.camera.far = 200;
      directional.shadow.camera.left = -50;
      directional.shadow.camera.right = 50;
      directional.shadow.camera.top = 50;
      directional.shadow.camera.bottom = -50;
      directional.shadow.bias = -0.001;
    }
    
    this.scene.add(directional);
    this.registry.lights.set('directional', directional);

    return { ambient, directional };
  }

  // === CÂMERA ===
  
  setupCamera(config = {}) {
    const { 
      fov = 60, 
      aspect = window.innerWidth / window.innerHeight, 
      near = 0.1, 
      far = 1000,
      position = new THREE.Vector3(0, 20, 30),
      target = new THREE.Vector3(0, 0, 0)
    } = config;

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.copy(position);
    camera.lookAt(target);
    
    this.registry.cameras.set('main', camera);
    return camera;
  }

  // === FÍSICA (Opcional - Cannon.js / Rapier) ===
  
  setupPhysics(config = {}) {
    // Integração opcional com Rapier.js ou Cannon-es
    // this.physics = new PhysicsWorld(config);
    // this.registry.physics.set('world', this.physics);
  }

  // === ANIMAÇÃO ===
  
  addAnimation(name, animation) {
    this.registry.animations.set(name, animation);
  }

  // === RENDER LOOP ===
  
  animate(renderer, clock) {
    const delta = clock.getDelta();
    
    // Update animations
    this.registry.animations.forEach(anim => {
      if (anim.update) anim.update(delta);
    });

    // Update physics
    // if (this.physics) this.physics.step(delta);

    renderer.render(this.scene, this.registry.cameras.get('main'));
  }

  // === UTILITÁRIOS ===
  
  getScene() { return this.scene; }
  getRegistry() { return this.registry; }
  
  dispose() {
    this.registry.dispose();
    this.scene.clear();
  }
}
```

### 5. Uso Prático (Exemplo Completo)

```javascript
// main.js — Exemplo de uso completo
import * as THREE from 'three';
import { SceneComposer } from './scene-composer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Setup
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const composer = new SceneComposer();
const camera = composer.setupCamera();
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

composer.setupLighting({
  enableShadows: true,
  directionalPosition: new THREE.Vector3(50, 100, 50)
});

// === COMPOSIÇÃO ELEMENTO POR ELEMENTO ===

// Chão
composer.addBlock('grass', new THREE.Vector3(0, -0.5, 0), { size: 100 });

// Blocos estilo Minecraft
const blocks = [
  { type: 'grass', pos: [0, 0, 0] },
  { type: 'stone', pos: [1, 0, 0] },
  { type: 'dirt', pos: [0, 0, 1] },
  { type: 'wood', pos: [2, 0, 0] },
];

blocks.forEach(b => composer.addBlock(b.type, new THREE.Vector3(...b.pos)));

// Árvore simples
const trunk = composer.addBlock('wood', new THREE.Vector3(5, 0.5, 5), { size: 1 });
const leaves = composer.addBlock('leaves', new THREE.Vector3(5, 2, 5), { size: 3 });

// Água
const water = composer.addBlock('water', new THREE.Vector3(-10, -0.4, -10), { size: 20 });

// Objeto customizado
const customGeo = new THREE.ConeGeometry(1, 2, 8);
composer.registry.registerGeometry('cone', customGeo);
composer.registry.registerMaterial('red', new THREE.MeshStandardMaterial({ color: 0xff0000 }));
composer.addCustomBlock('cone', 'red', new THREE.Vector3(-5, 1, 0));

// === ANIMAÇÃO ===
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  composer.animate(renderer, clock);
  controls.update();
}

animate();
```

---

## Referências Oficiais (Validados 2026-08-30)

- [Three.js Scene Creation](https://threejs.org/docs/#manual/en/introduction/Creating-a-scene)
- [Three.js Animation System](https://threejs.org/docs/#manual/en/introduction/How-to-animate)
- [Three.js Examples](https://github.com/mrdoob/three.js/tree/dev/examples)

---

## Checklist de Entrega

- [ ] `SceneRegistry` implementado com Maps tipados
- [ ] `GeometryFactory` com blocos Minecraft + custom
- [ ] `MaterialRegistry` com PBR + Toon materials
- [ ] `SceneComposer` orquestrando tudo
- [ ] `setupLighting()` com sombras configuráveis
- [ ] `setupCamera()` com OrbitControls
- [ ] Exemplo `main.js` funcional
- [ ] `dispose()` para limpeza de memória

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