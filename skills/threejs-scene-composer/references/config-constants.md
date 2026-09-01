# Config Constants System Reference (Baseado no vídeo Gustavo Campelo)

## Conceito

Sistema de constants expostas para tuning em tempo de execução — sem tocar código. Permite ajustar posição da câmera, elevação, centro do portal, velocidades, materiais, física via arquivo de configuração ou painel admin.

---

## Estrutura do Arquivo (config/constants.js)

```javascript
// config/constants.js
export const CONFIG = {
  // === CÂMERA ===
  camera: {
    fov: 60,                    // Field of view (graus)
    position: [15, 15, 15],     // Posição inicial [x, y, z]
    target: [0, 0, 0],          // LookAt target [x, y, z]
    near: 0.1,                  // Near clipping plane
    far: 1000,                  // Far clipping plane
    minZoom: 5,                 // Zoom mínimo (OrbitControls)
    maxZoom: 100,               // Zoom máximo
    minPolarAngle: 0,           // Limite vertical mínimo
    maxPolarAngle: Math.PI / 2 - 0.01, // Limite vertical máximo (evita flip)
    dampingFactor: 0.05,        // Suavização (OrbitControls)
    autoRotate: false,          // Auto-rotação
    autoRotateSpeed: 0.5        // Velocidade auto-rotação
  },

  // === PORTAL ===
  portal: {
    center: [0, 2, 0],          // Centro do portal [x, y, z]
    radius: 2,                  // Raio do anel
    thickness: 0.2,             // Espessura
    rotationSpeed: 0.01,        // Velocidade rotação (rad/frame)
    floatAmplitude: 0.3,        // Amplitude flutuação Y
    floatFrequency: 0.5,        // Frequência flutuação
    colorA: 0x00ffff,           // Cor A (shader)
    colorB: 0xff00ff,           // Cor B (shader)
    particleCount: 1000,        // Partículas
    particleSize: 0.05          // Tamanho partícula
  },

  // === ILHA / TERRENO ===
  island: {
    elevation: 0.5,             // Elevação base
    position: [0, 0, 0],        // Centro [x, y, z]
    size: 20,                   // Tamanho (largura/profundidade)
    segments: 64,               // Subdivisão malha
    noiseScale: 0.1,            // Escala ruído (terreno)
    noiseAmplitude: 2,          // Amplitude ruído
    waterLevel: 0               // Nível água
  },

  // === VELOCIDADES ===
  speeds: {
    camera: 0.05,               // Velocidade movimento câmera
    rotation: 0.005,            // Rotação geral (rad/frame)
    float: 0.02,                // Flutuação objetos
    orbit: 0.01,                // Órbita câmera scroll
    particle: 0.01,             // Partículas
    wave: 0.02                  // Ondas água
  },

  // === MATERIAIS ===
  materials: {
    grass: {
      color: 0x4CAF50,
      roughness: 0.8,
      metalness: 0.1,
      map: null,                // Texture URL
      normalMap: null,
      aoMap: null
    },
    stone: {
      color: 0x757575,
      roughness: 0.9,
      metalness: 0.05
    },
    obsidian: {
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.8
    },
    portal: {
      vertexShader: `portalVertexShader`,
      fragmentShader: `portalFragmentShader`,
      uniforms: {
        time: { value: 0 },
        colorA: { value: 0x00ffff },
        colorB: { value: 0xff00ff },
        speed: { value: 0.5 },
        intensity: { value: 1.0 }
      }
    },
    water: {
      color: 0x0066cc,
      roughness: 0.1,
      metalness: 0.5,
      transparent: true,
      opacity: 0.8
    }
  },

  // === FÍSICA / ANIMAÇÃO ===
  physics: {
    gravity: -9.8,              // Gravidade
    bounce: 0.3,                // Restituição
    friction: 0.5,              // Atrito
    windForce: [0, 0, 0],       // Vento [x, y, z]
    windStrength: 0             // Força vento
  },

  // === PERFORMANCE ===
  performance: {
    targetFPS: 60,              // FPS alvo
    maxPixelRatio: 2,           // Máximo devicePixelRatio
    shadowMapSize: 2048,        // Shadow map resolution
    maxShadows: 10,             // Máximo sombras simultâneas
    instancedThreshold: 50,     // Usar InstancedMesh acima de N objetos iguais
    frustumCulling: true,       // Frustum culling
    lodDistances: [10, 30, 60], // Distâncias LOD
    lodLevels: 3                // Níveis LOD
  },

  // === RESPONSIVE ===
  responsive: {
    breakpoints: {
      mobile: 640,
      tablet: 1024,
      desktop: 1280
    },
    qualityPresets: {
      low: {
        pixelRatio: 1,
        shadowMap: false,
        antialias: false,
        toneMapping: THREE.NoToneMapping,
        maxPixelRatio: 1
      },
      medium: {
        pixelRatio: 1.5,
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
    defaultPreset: 'medium',
    autoDetect: true
  },

  // === DEBUG ===
  debug: {
    showStats: false,           // Stats.js
    showHelpers: false,         // CameraHelper, LightHelper
    showWireframe: false,       // Wireframe mode
    logPerformance: false,      // Log FPS/frame time
    showGrid: true,             // GridHelper
    gridSize: 20,               // Grid size
    gridDivisions: 20           // Grid divisions
  }
};

// === HELPER FUNCTIONS ===

export function getConfig(path) {
  // Acesso por string: "camera.fov", "portal.colorA"
  return path.split('.').reduce((obj, key) => obj?.[key], CONFIG);
}

export function setConfig(path, value) {
  // Set por string: setConfig("camera.fov", 75)
  const keys = path.split('.');
  const last = keys.pop();
  const obj = keys.reduce((o, k) => o[k], CONFIG);
  if (obj && last in obj) {
    obj[last] = value;
    return true;
  }
  return false;
}

export function resetConfig() {
  // Reset para defaults (requer reload página para aplicar)
  Object.assign(CONFIG, DEFAULT_CONFIG);
}

export function exportConfig() {
  // Export para JSON (salvar no localStorage)
  return JSON.stringify(CONFIG, null, 2);
}

export function importConfig(jsonString) {
  // Import de JSON (merge com defaults)
  try {
    const imported = JSON.parse(jsonString);
    mergeDeep(CONFIG, imported);
    return true;
  } catch {
    return false;
  }
}

function mergeDeep(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target) {
      mergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
}

// Defaults para reset
const DEFAULT_CONFIG = JSON.parse(JSON.stringify(CONFIG));

export default CONFIG;
```

---

## Uso no Código

```javascript
// Import
import { CONFIG, getConfig, setConfig } from './config/constants.js';

// Uso direto
const camera = new THREE.PerspectiveCamera(
  CONFIG.camera.fov,
  window.innerWidth / window.innerHeight,
  CONFIG.camera.near,
  CONFIG.camera.far
);

// Acesso dinâmico
const portalSpeed = getConfig('portal.rotationSpeed');
const cameraPos = getConfig('camera.position');

// Tuning em runtime (ex: via console ou UI admin)
setConfig('camera.fov', 75);
setConfig('speeds.rotation', 0.01);
setConfig('portal.colorA', 0xff0000);

// Persistir no localStorage
localStorage.setItem('threejs-config', exportConfig());

// Carregar salvo
const saved = localStorage.getItem('threejs-config');
if (saved) importConfig(saved);
```

---

## UI de Tuning (Opcional - dat.gui)

```javascript
import { GUI } from 'dat.gui';
import { CONFIG, getConfig, setConfig, exportConfig, importConfig } from './config/constants.js';

const gui = new GUI({ title: 'Three.js Tuning' });

// Camera folder
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add(CONFIG.camera, 'fov', 30, 120).name('FOV').onChange(v => {
  camera.fov = v; camera.updateProjectionMatrix();
});
cameraFolder.add(CONFIG.camera, 'position', 0, 50, 1).name('Distance');
cameraFolder.add(CONFIG.camera, 'autoRotate').name('Auto Rotate');
cameraFolder.add(CONFIG.camera, 'autoRotateSpeed', 0, 5).name('Rotate Speed');

// Portal folder
const portalFolder = gui.addFolder('Portal');
portalFolder.add(CONFIG.portal, 'rotationSpeed', 0, 0.1).name('Rotation Speed');
portalFolder.addColor(CONFIG.portal, 'colorA').name('Color A');
portalFolder.addColor(CONFIG.portal, 'colorB').name('Color B');

// Speeds folder
const speedFolder = gui.addFolder('Speeds');
speedFolder.add(CONFIG.speeds, 'rotation', 0, 0.1).name('Rotation');
speedFolder.add(CONFIG.speeds, 'float', 0, 0.1).name('Float');
speedFolder.add(CONFIG.speeds, 'camera', 0, 0.2).name('Camera Move');

// Performance folder
const perfFolder = gui.addFolder('Performance');
perfFolder.add(CONFIG.performance, 'targetFPS', 30, 120).name('Target FPS');
perfFolder.add(CONFIG.performance, 'maxPixelRatio', 1, 3).name('Max Pixel Ratio');
perfFolder.add(CONFIG.performance, 'shadowMapSize', 512, 4096, 256).name('Shadow Map Size');

// Actions
const actions = {
  exportConfig: () => {
    const blob = new Blob([exportConfig()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'threejs-config.json'; a.click();
  },
  importConfig: () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const reader = new FileReader();
      reader.onload = (evt) => { importConfig(evt.target.result); location.reload(); };
      reader.readAsText(e.target.files[0]);
    };
    input.click();
  },
  resetConfig: () => { /* reset logic */ location.reload(); }
};
gui.add(actions, 'exportConfig').name('📥 Export Config');
gui.add(actions, 'importConfig').name('📤 Import Config');
gui.add(actions, 'resetConfig').name('🔄 Reset Defaults');

gui.close(); // Start closed
```

---

## Persistência Automática

```javascript
// Auto-save no localStorage (debounced)
let saveTimeout;
function autoSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem('threejs-config-v1', exportConfig());
    console.log('💾 Config auto-saved');
  }, 1000);
}

// Interceptar setConfig para auto-save
const originalSetConfig = setConfig;
function setConfig(path, value) {
  const result = originalSetConfig(path, value);
  if (result) autoSave();
  return result;
}

// Carregar ao iniciar
function loadSavedConfig() {
  const saved = localStorage.getItem('threejs-config-v1');
  if (saved) {
    try {
      importConfig(saved);
      console.log('📂 Config loaded from localStorage');
    } catch (e) {
      console.warn('Failed to load config:', e);
    }
  }
}

loadSavedConfig();
```

---

## Referências

- dat.gui: https://github.com/dataarts/dat.gui
- Three.js + dat.gui examples: https://threejs.org/examples/#misc_controls_dat_gui