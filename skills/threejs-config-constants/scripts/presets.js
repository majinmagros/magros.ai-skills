// presets.js — Presets predefinidos (minecraftStyle, cinematic, mobileOptimized, development)
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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
export function applyPreset(config, presetName) {
  const preset = threeJSConfigPresets[presetName];
  if (!preset) throw new Error(`Preset ${presetName} não encontrado`);

  config.setMany(preset);
  console.log(`Preset "${presetName}" aplicado`);
}
