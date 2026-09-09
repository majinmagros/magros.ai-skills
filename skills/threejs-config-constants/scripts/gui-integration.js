// gui-integration.js — Integração com dat.gui (pastas Camera/Portal/Animation/Rendering/Materials/Physics)
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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
