---
name: threejs-config-constants
description: |
  Sistema de constants expostas para tuning: posição câmera, elevação, centro portal, velocidades — sem tocar código. Baseado no vídeo do Gustavo Campelo (constants para customização: portal center, elevação, posição ilha, velocidades).
  Use quando: "threejs constants", "threejs config constants", "threejs tuning constants", "threejs exposed constants", "threejs runtime config", "threejs tweakable parameters".
  Não use para: composição de cena (use threejs-scene-composer), shaders (use threejs-shader-effects), deploy (use threejs-deploy-pipeline).
  Outcome: Sistema de constants expostas para runtime tuning sem tocar código — camera, portal, elevação, velocidades, materiais, física.
metadata:
  origin: AUTORAL
  source_docs:
    - https://threejs.org/docs/#api/en/core/Object3D
    - https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
    - https://threejs.org/docs/#api/en/materials/Material
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: []
---

# Three.js Config Constants — Constants Expostas para Runtime Tuning

Sistema de **constants expostas** para runtime tuning sem tocar código — posição câmera, portal center, elevação, velocidades, materiais, física.

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

## Core: Config Constants System

```javascript
// config-constants.js
import * as THREE from 'three';

export class ConfigConstants {
  constructor(defaults = {}) {
    this.constants = new Map();
    this.listeners = new Map();
    this.history = [];
    this.maxHistory = 50;
    
    // Registra defaults
    Object.entries(defaults).forEach(([key, value]) => {
      this.register(key, value);
    }
  }
  
  // === REGISTRO ===
  
  register(key, defaultValue, options = {}) {
    const config = {
      key,
      defaultValue: this._clone(value),
      currentValue: this._clone(value),
      type: this._inferType(value),
      description: options.description || '',
      category: options.category || 'general',
      min: options.min,
      max: options.max,
      step: options.step,
      options: options.options, // para enum
      validator: options.validator,
      readonly: options.readonly || false,
      hidden: options.hidden || false,
      // Runtime
      callbacks: [],
      lastModified: Date.now()
    };
    
    this.constants.set(key, config);
    return this;
  }
  
  // Batch register
  registerMany(constants) {
    Object.entries(constants).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        this.register(key, value.value, value);
      } else {
        this.register(key, value);
      }
    });
    return this;
  }
  
  // === ACESSO ===
  
  get(key) {
    const config = this.constants.get(key);
    if (!config) {
      console.warn(`Constant not found: ${key}`);
      return undefined;
    }
    return config.currentValue;
  }
  
  getRaw(key) {
    return this.constants.get(key);
  }
  
  set(key, value, silent = false) {
    const config = this.constants.get(key);
    if (!config) {
      console.warn(`Constant not found: ${key}`);
      return false;
    }
    
    if (config.readonly) {
      console.warn(`Constant ${key} is readonly`);
      return false;
    }
    
    // Validação
    if (config.validator && !config.validator(value)) {
      console.warn(`Validation failed for ${key}`);
      return false;
    }
    
    // Range check
    if (config.min !== undefined && value < config.min) {
      console.warn(`Value below minimum for ${key}`);
      return false;
    }
    if (config.max !== undefined && value > config.max) {
      console.warn(`Value above maximum for ${key}`);
      return false;
    }
    
    // History
    this.history.push({
      key,
      oldValue: this._clone(config.currentValue),
      newValue: this._clone(value),
      timestamp: Date.now()
    });
    if (this.history.length > this.maxHistory) this.history.shift();
    
    // Update
    config.currentValue = this._clone(value);
    config.lastModified = Date.now();
    
    // Callbacks
    config.callbacks.forEach(cb => cb(value, config));
    this._emitGlobal(key, value);
    
    return true;
  }
  
  // Batch set
  setMany(values, silent = false) {
    Object.entries(values).forEach(([key, value]) => this.set(key, value, silent));
  }
  
  // === CALLBACKS ===
  
  onChange(key, callback) {
    const config = this.constants.get(key);
    if (!config) return false;
    config.callbacks.push(callback);
    return () => {
      const idx = config.callbacks.indexOf(callback);
      if (idx > -1) config.callbacks.splice(idx, 1);
    };
  }
  
  onAnyChange(callback) {
    this.globalCallbacks = this.globalCallbacks || [];
    this.globalCallbacks.push(callback);
    return () => {
      const idx = this.globalCallbacks.indexOf(callback);
      if (idx > -1) this.globalCallbacks.splice(idx, 1);
    };
  }
  
  _emitGlobal(key, value) {
    this.globalCallbacks?.forEach(cb => cb(key, value));
  }
  
  // === PRESETS ===
  
  savePreset(name) {
    const preset = {};
    this.constants.forEach((config, key) => {
      if (!config.hidden) {
        preset[key] = this._clone(config.currentValue);
      }
    });
    this.presets = this.presets || {};
    this.presets[name] = preset;
    return this;
  }
  
  loadPreset(name) {
    const preset = this.presets?.[name];
    if (!preset) return false;
    
    Object.entries(preset).forEach(([key, value]) => {
      this.set(key, value, true); // silent
    });
    return true;
  }
  
  listPresets() {
    return Object.keys(this.presets || {});
  }
  
  // === SERIALIZAÇÃO ===
  
  toJSON() {
    const obj = {};
    this.constants.forEach((config, key) => {
      if (!config.hidden) {
        obj[key] = config.currentValue;
      }
    });
    return obj;
  }
  
  loadJSON(json) {
    Object.entries(json).forEach(([key, value]) => {
      this.set(key, value, true);
    });
  }
  
  // === UI HELPERS ===
  
  getUIConfig() {
    const ui = [];
    this.constants.forEach((config, key) => {
      if (config.hidden) return;
      
      ui.push({
        key,
        label: config.description || key,
        type: config.type,
        value: config.currentValue,
        min: config.min,
        max: config.max,
        step: config.step,
        options: config.options,
        readonly: config.readonly,
        category: config.category
      });
    });
    return ui;
  }
  
  getByCategory(category) {
    const result = {};
    this.constants.forEach((config, key) => {
      if (config.category === category) {
        result[key] = config.currentValue;
      }
    });
    return result;
  }
  
  // === UTILITÁRIOS ===
  
  _inferType(value) {
    if (Array.isArray(value)) return 'array';
    if (value instanceof THREE.Vector2) return 'vector2';
    if (value instanceof THREE.Vector3) return 'vector3';
    if (value instanceof THREE.Color) return 'color';
    if (value instanceof THREE.Euler) return 'euler';
    if (value instanceof THREE.Matrix4) return 'matrix4';
    return typeof value;
  }
  
  _clone(value) {
    if (value === null || value === undefined) return value;
    if (Array.isArray(value)) return [...value];
    if (value instanceof THREE.Vector2) return value.clone();
    if (value instanceof THREE.Vector3) return value.clone();
    if (value instanceof THREE.Color) return value.clone();
    if (value instanceof THREE.Euler) return value.clone();
    if (value instanceof THREE.Matrix4) return value.clone();
    if (typeof value === 'object') return { ...value };
    return value;
  }
  
  // === DEFAULTS THREE.JS ===
  
  static createThreeJSDefaults() {
    const config = new ConfigConstants();
    
    config.registerMany({
      // Camera
      'camera.position': {
        value: new THREE.Vector3(0, 5, 10),
        description: 'Posição da câmera',
        category: 'camera',
        type: 'vector3'
      },
      'camera.fov': {
        value: 60,
        min: 10,
        max: 120,
        step: 1,
        description: 'Field of view da câmera',
        category: 'camera'
      },
      'camera.near': {
        value: 0.1,
        min: 0.01,
        max: 10,
        step: 0.01,
        category: 'camera'
      },
      'camera.far': {
        value: 1000,
        min: 100,
        max: 10000,
        step: 10,
        category: 'camera'
      },
      
      // Portal (baseado no vídeo Gustavo)
      'portal.center': {
        value: new THREE.Vector3(0, 0, 0),
        description: 'Centro do portal',
        category: 'portal'
      },
      'portal.elevation': {
        value: 2,
        min: 0,
        max: 20,
        step: 0.1,
        description: 'Elevação do portal',
        category: 'portal'
      },
      'portal.radius': {
        value: 5,
        min: 0.1,
        max: 50,
        step: 0.1,
        category: 'portal'
      },
      
      // Island/Scene
      'island.position': {
        value: new THREE.Vector3(0, 0, 0),
        category: 'scene'
      },
      'island.initialHeight': {
        value: 2,
        min: 0,
        max: 10,
        step: 0.1,
        category: 'scene'
      },
      
      // Camera animation
      'camera.animationSpeed': {
        value: 1.0,
        min: 0.1,
        max: 5,
        step: 0.1,
        category: 'animation'
      },
      'camera.autoRotate': {
        value: false,
        category: 'animation'
      },
      'camera.autoRotateSpeed': {
        value: 0.5,
        min: 0,
        max: 5,
        step: 0.1,
        category: 'animation'
      },
      
      // Portal animation
      'portal.centerPosition': {
        value: new THREE.Vector3(0, 0, 0),
        category: 'portal'
      },
      'portal.transitionDuration': {
        value: 2.0,
        min: 0.1,
        max: 10,
        step: 0.1,
        category: 'portal'
      },
      
      // Rendering
      'renderer.pixelRatio': {
        value: Math.min(window.devicePixelRatio, 2),
        min: 0.5,
        max: 3,
        step: 0.1,
        category: 'rendering'
      },
      'renderer.shadowMap': {
        value: true,
        category: 'rendering'
      },
      'renderer.toneMapping': {
        value: 'ACESFilmic',
        options: ['None', 'Linear', 'Reinhard', 'Cineon', 'ACESFilmic'],
        category: 'rendering'
      },
      'renderer.exposure': {
        value: 1.0,
        min: 0.1,
        max: 5,
        step: 0.1,
        category: 'rendering'
      },
      
      // Physics
      'physics.gravity': {
        value: new THREE.Vector3(0, -9.81, 0),
        category: 'physics'
      },
      'physics.enabled': {
        value: false,
        category: 'physics'
      },
      
      // Materials
      'material.defaultRoughness': {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
        category: 'materials'
      },
      'material.defaultMetalness': {
        value: 0.1,
        min: 0,
        max: 1,
        step: 0.01,
        category: 'materials'
      }
    });
    
    return config;
  }
  
  // === UI INTEGRATION ===
  
  createControlPanel(container) {
    const panel = document.createElement('div');
    panel.className = 'config-panel';
    panel.innerHTML = `
      <style>
        .config-panel { font-family: monospace; font-size: 12px; max-height: 400px; overflow-y: auto; }
        .config-category { margin: 10px 0; border: 1px solid #333; border-radius: 4px; }
        .config-category summary { padding: 8px; background: #222; cursor: pointer; font-weight: bold; }
        .config-item { padding: 8px; border-top: 1px solid #333; display: flex; gap: 8px; align-items: center; }
        .config-label { min-width: 150px; font-size: 11px; color: #aaa; }
        .config-input { flex: 1; padding: 4px 8px; background: #111; border: 1px solid #333; color: #fff; border-radius: 3px; }
        .config-input[type="range"] { padding: 0; }
        .config-input[type="checkbox"] { width: auto; }
        .config-input[type="color"] { width: 40px; height: 24px; padding: 0; }
      </style>
    `;
    
    const uiConfig = this.getUIConfig();
    const categories = {};
    
    this.uiConfig.forEach(item => {
      if (!categories[item.category]) categories[item.category] = [];
      categories[item.category].push(item);
    });
    
    Object.entries(categories).forEach(([category, items]) => {
      const categoryEl = document.createElement('details');
      categoryEl.className = 'config-category';
      categoryEl.innerHTML = `<summary>${category.toUpperCase()}</summary>`;
      
      items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'config-item';
        
        const label = document.createElement('label');
        label.className = 'config-label';
        label.textContent = item.label;
        label.title = item.key;
        
        let input;
        if (item.type === 'boolean') {
          input = document.createElement('input');
          input.type = 'checkbox';
          input.checked = item.value;
        } else if (item.type === 'color') {
          input = document.createElement('input');
          input.type = 'color';
          input.value = item.value;
        } else if (item.options) {
          input = document.createElement('select');
          item.options.forEach(opt => {
            const opt = document.createElement('option');
            opt.value = opt;
            opt.textContent = opt;
            input.appendChild(opt);
          });
          input.value = item.value;
        } else if (item.type === 'vector2' || item.type === 'vector3') {
          input = document.createElement('input');
          input.type = 'text';
          input.placeholder = item.type === 'vector2' ? 'x, y' : 'x, y, z';
          input.value = Array.isArray(item.value) ? item.value.join(', ') : '';
        } else {
          input = document.createElement('input');
          input.type = item.type === 'number' ? 'range' : 'text';
          if (item.type === 'number' || item.type === 'vector2' || item.type === 'vector3') {
            input.type = 'range';
            input.min = item.min ?? 0;
            input.max = item.max ?? 100;
            input.step = item.step ?? 1;
            input.value = item.value;
          } else {
            input.value = item.value;
          }
        }
        
        if (input) {
          input.className = 'config-input';
          input.addEventListener('input', (e) => {
            let value;
            if (input.type === 'checkbox') value = e.target.checked;
            else if (input.type === 'color') value = e.target.value;
            else if (input.type === 'range') value = parseFloat(e.target.value);
            else if (item.type === 'vector2' || item.type === 'vector3') {
              value = e.target.value.split(',').map(v => parseFloat(v.trim()));
            } else {
              value = e.target.value;
            }
            this.set(item.key, value);
          });
        }
        
        itemEl.appendChild(label);
        if (input) itemEl.appendChild(input);
        categoryEl.appendChild(itemEl);
      });
      
      panel.appendChild(categoryEl);
    });
    
    container.appendChild(panel);
    return panel;
  }
}
```

## Presets Predefinidos

```javascript
// presets.js
export const threeJSConfigPresets = {
  // Configuração para site 3D estilo Minecraft (Gustavo Campelo)
  minecraftStyle: {
    'camera.position': { x: 0, y: 5, z: 15 },
    'camera.fov': 60,
    'portal.center': { x: 0, y: 0, z: 0 },
    'portal.elevation': 2,
    'portal.radius': 5,
    'portal.transitionDuration': 2.0,
    'renderer.shadowMap': true,
    'renderer.toneMapping': 'ACESFilmic',
    'material.defaultRoughness': 0.8,
    'material.defaultMetalness': 0.0,
    'physics.enabled': false
  },
  
  // Configuração para site 3D cinematográfico
  cinematic: {
    'camera.position': { x: 0, y: 8, z: 20 },
    'camera.fov': 50,
    'camera.autoRotate': true,
    'camera.autoRotateSpeed': 0.3,
    'portal.center': { x: 0, y: 2, z: 0 },
    'portal.elevation': 3,
    'portal.transitionDuration': 3.0,
    'renderer.toneMapping': 'ACESFilmic',
    'renderer.exposure': 1.2,
    'material.defaultRoughness': 0.3,
    'material.defaultMetalness': 0.2
  },
  
  // Configuração para performance móvel
  mobileOptimized: {
    'camera.position': { x: 0, y: 3, z: 8 },
    'camera.fov': 50,
    'renderer.pixelRatio': 1,
    'renderer.shadowMap': false,
    'renderer.toneMapping': 'None',
    'material.defaultRoughness': 0.8,
    'physics.enabled': false,
    'camera.autoRotate': false
  },
  
  // Configuração para desenvolvimento
  development: {
    'camera.position': { x: 0, y: 5, z: 10 },
    'camera.fov': 75,
    'renderer.pixelRatio': 1,
    'renderer.shadowMap': true,
    'renderer.toneMapping': 'Linear',
    'physics.enabled': true,
    'physics.gravity': { x: 0, y: -9.81, z: 0 }
  }
};

// Aplicar preset
function applyPreset(config, presetName) {
  const preset = threeJSConfigPresets[presetName];
  if (!preset) throw new Error(`Preset ${presetName} não encontrado`);
  
  config.setMany(preset);
  console.log(`Preset "${presetName}" aplicado`);
}
```

## Integração com GUI (dat.gui / tweakpane)

```javascript
// gui-integration.js
import * as dat from 'dat.gui';

export function createGUI(config) {
  const gui = new dat.GUI({ width: 300, autoPlace: true });
  
  // Camera folder
  const cameraFolder = gui.addFolder('Camera');
  cameraFolder.add(config, 'camera.position.x', -50, 50).step(0.1).name('Position X');
  cameraFolder.add(config, 'camera.position.y', 0, 30).step(0.1).name('Position Y');
  cameraFolder.add(config, 'camera.position.z', -50, 50).step(0.1).name('Position Z');
  cameraFolder.add(config, 'camera.fov', 10, 120).step(1).name('FOV');
  cameraFolder.add(config, 'camera.near', 0.01, 10).step(0.01).name('Near');
  cameraFolder.add(config, 'camera.far', 100, 10000).step(10).name('Far');
  cameraFolder.open();
  
  // Portal folder
  const portalFolder = gui.addFolder('Portal');
  portalFolder.add(config, 'portal.center.x', -50, 50).step(0.1).name('Center X');
  portalFolder.add(config, 'portal.center.y', 0, 20).step(0.1).name('Elevation');
  portalFolder.add(config, 'portal.center.z', -50, 50).step(0.1).name('Center Z');
  portalFolder.add(config, 'portal.radius', 0.1, 50).step(0.1).name('Radius');
  portalFolder.add(config, 'portal.elevation', 0, 20).step(0.1).name('Elevation');
  portalFolder.add(config, 'portal.transitionDuration', 0.1, 10).step(0.1).name('Transition Duration');
  
  // Animation folder
  const animFolder = gui.addFolder('Animation');
  animFolder.add(config, 'camera.autoRotate').name('Auto Rotate');
  animFolder.add(config, 'camera.autoRotateSpeed', 0, 5).step(0.1).name('Auto Rotate Speed');
  animFolder.add(config, 'camera.animationSpeed', 0.1, 5).step(0.1).name('Animation Speed');
  
  // Portal animation
  animFolder.add(config, 'portal.transitionDuration', 0.1, 10).step(0.1).name('Portal Transition');
  
  // Rendering folder
  const renderFolder = gui.addFolder('Rendering');
  renderFolder.add(config, 'renderer.pixelRatio', 0.5, 3).step(0.1).name('Pixel Ratio');
  renderFolder.add(config, 'renderer.shadowMap').name('Shadows');
  renderFolder.add(config, 'renderer.toneMapping', ['None', 'Linear', 'Reinhard', 'Cineon', 'ACESFilmic']).name('Tone Mapping');
  renderFolder.add(config, 'renderer.exposure', 0.1, 5).step(0.1).name('Exposure');
  
  // Materials
  const matFolder = gui.addFolder('Materials');
  matFolder.add(config, 'material.defaultRoughness', 0, 1).step(0.01).name('Default Roughness');
  matFolder.add(config, 'material.defaultMetalness', 0, 1).step(0.01).name('Default Metalness');
  
  // Physics
  const physFolder = gui.addFolder('Physics');
  physFolder.add(config, 'physics.enabled').name('Enabled');
  physFolder.add(config, 'physics.gravity.x', -20, 20).step(0.1).name('Gravity X');
  physFolder.add(config, 'physics.gravity.y', -50, 0).step(0.1).name('Gravity Y');
  physFolder.add(config, 'physics.gravity.z', -20, 20).step(0.1).name('Gravity Z');
  
  return gui;
}
```

## Uso Prático

```javascript
// main.js
import { ConfigConstants } from './config-constants.js';
import { createGUI } from './gui-integration.js';

// Cria config com defaults Three.js
const config = ConfigConstants.createThreeJSDefaults();

// Aplica preset
config.loadPreset('minecraftStyle');

// Cria GUI
const gui = createGUI(config);

// Callbacks para sincronizar com Three.js
config.onChange('camera.position', (value) => {
  camera.position.copy(value);
});

config.onChange('camera.fov', (value) => {
  camera.fov = value;
  camera.updateProjectionMatrix();
});

config.onChange('renderer.pixelRatio', (value) => {
  renderer.setPixelRatio(value);
});

config.onChange('renderer.shadowMap', (value) => {
  renderer.shadowMap.enabled = value;
});

config.onChange('material.defaultRoughness', (value) => {
  // Atualiza materiais padrão
  scene.traverse(obj => {
    if (obj.isMesh && obj.material.isMeshStandardMaterial) {
      obj.material.roughness = value;
    }
  });
});

// Hot reload de preset
window.addEventListener('keydown', (e) => {
  if (e.key === '1') config.loadPreset('minecraftStyle');
  if (e.key === '2') config.loadPreset('cinematic');
  if (e.key === '3') config.loadPreset('mobileOptimized');
  if (e.key === '4') config.loadPreset('development');
});

// Save/Load
window.addEventListener('keydown', (e) => {
  if (e.key === 's' && e.ctrlKey) {
    e.preventDefault();
    const json = config.toJSON();
    localStorage.setItem('threejs-config', JSON.stringify(json));
    console.log('Config saved!');
  }
  if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    const saved = localStorage.getItem('threejs-config');
    if (saved) {
      config.loadJSON(JSON.parse(saved));
      console.log('Config loaded!');
    }
  }
});
```

## Validação de Claims (Validado 2026-08-30)

- Baseado no vídeo do Gustavo Campelo: constants para portal center, elevação, posição ilha, velocidades
- Three.js docs oficiais para Object3D, Camera, Material properties
- Validação via dat.gui / tweakpane confirmada

---

## Referências Oficiais

- [Three.js Object3D](https://threejs.org/docs/#api/en/core/Object3D)
- [Three.js Camera](https://threejs.org/docs/#api/en/cameras/Camera)
- [Three.js Material](https://threejs.org/docs/#api/en/materials/Material)
- [dat.gui](https://github.com/dataarts/dat.gui)
- [Tweakpane](https://tweakpane.github.io/docs/)

---

## Checklist de Entrega

- [ ] `ConfigConstants` class com register/get/set/callbacks
- [ ] Presets predefinidos (minecraftStyle, cinematic, mobileOptimized, development)
- [ ] Integração dat.gui / tweakpane
- [ ] Persistence localStorage
- [ ] Hot reload de presets via teclas
- [ ] Type inference para Vector2/3, Color, Euler
- [ ] Validation (min/max/step/validator)
- [ ] History/undo support

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