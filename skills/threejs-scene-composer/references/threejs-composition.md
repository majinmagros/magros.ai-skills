# Three.js Scene Composition Reference (Validado via Context7)

## Library: Three.js (`/mrdoob/three.js`)

### Core Scene Setup

```javascript
import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // Sky blue
scene.fog = new THREE.Fog(0x87CEEB, 10, 100);

// Camera
const camera = new THREE.PerspectiveCamera(
  60, // fov
  window.innerWidth / window.innerHeight, // aspect
  0.1, // near
  1000 // far
);
camera.position.set(15, 15, 15);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#three-canvas'),
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  // Update logic here
  renderer.render(scene, camera);
}
animate();
```

### Geometry + Material + Mesh (Block Pattern)

```javascript
// Block factory pattern
export function createBlock(type, position, options = {}) {
  let geometry, material;
  
  switch (type) {
    case 'box':
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(0.5, 32, 32);
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
      break;
    case 'plane':
      geometry = new THREE.PlaneGeometry(1, 1);
      break;
    case 'ring':
      geometry = new THREE.RingGeometry(0.5, 1, 32);
      break;
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
  }

  // Material based on type
  const materialOptions = {
    color: options.color || 0xffffff,
    roughness: options.roughness ?? 0.8,
    metalness: options.metalness ?? 0.1,
    ...options.materialProps
  };
  
  material = new THREE.MeshStandardMaterial(materialOptions);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = { type, ...options };
  
  return mesh;
}

// InstancedMesh for performance (many same blocks)
export function createInstancedBlocks(type, count, positions, materialOptions) {
  const geometry = type === 'box' 
    ? new THREE.BoxGeometry(1, 1, 1)
    : new THREE.SphereGeometry(0.5, 16, 16);
  
  const material = new THREE.MeshStandardMaterial(materialOptions);
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  
  const dummy = new THREE.Object3D();
  positions.forEach((pos, i) => {
    dummy.position.set(...pos);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  
  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  return mesh;
}
```

### Lighting Setup

```javascript
export function setupLighting(scene) {
  // Ambient
  const ambient = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambient);

  // Directional (sun)
  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(10, 20, 10);
  directional.castShadow = true;
  directional.shadow.mapSize.width = 2048;
  directional.shadow.mapSize.height = 2048;
  directional.shadow.camera.near = 0.5;
  directional.shadow.camera.far = 50;
  directional.shadow.camera.left = -20;
  directional.shadow.camera.right = 20;
  directional.shadow.camera.top = 20;
  directional.shadow.camera.bottom = -20;
  directional.shadow.bias = -0.0001;
  scene.add(directional);

  // Hemisphere (sky/ground)
  const hemisphere = new THREE.HemisphereLight(0x87CEEB, 0x4CAF50, 0.3);
  scene.add(hemisphere);

  return { ambient, directional, hemisphere };
}
```

### Controls (OrbitControls)

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = true;
  controls.minDistance = 5;
  controls.maxDistance = 100;
  controls.maxPolarAngle = Math.PI / 2 - 0.01;
  controls.target.set(0, 0, 0);
  return controls;
}

// Touch support
function setupTouchControls(controls) {
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN
  };
}
```

### InstancedMesh for Performance (Voxel-style)

```javascript
export function createVoxelWorld(blocks, blockSize = 1) {
  // blocks = [{ type: 'grass', position: [x,y,z] }, ...]
  
  const geometries = {
    grass: new THREE.BoxGeometry(blockSize, blockSize, blockSize),
    stone: new THREE.BoxGeometry(blockSize, blockSize, blockSize),
    // ...
  };

  const materials = {
    grass: new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.8 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x757575, roughness: 0.9 }),
    // ...
  };

  const meshes = {};
  
  Object.keys(geometries).forEach(type => {
    const positions = blocks.filter(b => b.type === type).map(b => b.position);
    if (positions.length === 0) return;
    
    const mesh = new THREE.InstancedMesh(
      geometries[type],
      materials[type],
      positions.length
    );
    
    const dummy = new THREE.Object3D();
    positions.forEach((pos, i) => {
      dummy.position.set(...pos).multiplyScalar(blockSize);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.instanceMatrix.needsUpdate = true;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    meshes[type] = mesh;
  });

  return meshes;
}
```

---

## Referências Oficiais

- GitHub: https://github.com/mrdoob/three.js
- Context7: `/mrdoob/three.js`
- Benchmark: 79.44
- Docs: https://threejs.org/docs/
- Examples: https://threejs.org/examples/