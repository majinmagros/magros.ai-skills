// main.js — Uso prático: defaults + preset + GUI + callbacks + hot reload + save/load
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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
