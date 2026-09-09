// main-responsive.js — Integração completa: renderer + input + adaptive + LOD + instancing + orientation
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
import * as THREE from 'three';
import { ResponsiveRenderer } from './responsive-renderer.js';
import { UnifiedInput } from './unified-input.js';
import { AdaptiveQuality } from './adaptive-quality.js';
import { LODSystem } from './lod-system.js';
import { InstancedForest } from './instanced-helpers.js';
import { DeviceOrientation } from './device-orientation.js';

// Setup completo
async function init() {
  // 1. Renderer responsivo
  const canvas = document.getElementById('canvas');
  const renderer = new ResponsiveRenderer(canvas, {
    qualityPresets: {
      low: { pixelRatio: 1, shadowMap: false, antialias: false },
      medium: { pixelRatio: Math.min(window.devicePixelRatio, 1.5), shadowMap: true, antialias: true },
      high: { pixelRatio: window.devicePixelRatio, shadowMap: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }
    }
  });

  // 2. Scene + Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  // 2. Input unificado
  const input = new UnifiedInput(renderer.renderer, camera, renderer.canvas);

  // 3. Adaptive quality
  const adaptiveQuality = new AdaptiveQuality(renderer.renderer, scene, camera, {
    targetFPS: 60
  });

  // 4. LOD System
  const lodSystem = new LODSystem(camera);

  // 4. Device orientation (opcional)
  const deviceOrientation = new DeviceOrientation();

  // 5. Instanced objects para performance
  const forest = new InstancedForest(500, 100);
  await forest.init(treeModel);
  scene.add(forest.trees);

  // 5. Adaptive quality callback
  adaptiveQuality.onQualityChange = (quality) => {
    console.log(`Quality adjusted to: ${(quality * 100).toFixed(0)}%`);
  };

  // 6. Device orientation → camera
  deviceOrientation.onOrientationChange = (orientation) => {
    const rotation = deviceOrientation.getCameraRotation();
    camera.quaternion.setFromEuler(rotation);
  };

  // 6. Render loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Update systems
    lodSystem.update();
    adaptiveQuality.update?.(delta);

    // Device orientation
    if (deviceOrientation.orientation.beta !== 0) {
      const rotation = deviceOrientation.getCameraRotation();
      camera.quaternion.slerp(rotation, 0.1);
    }

    // Render
    renderer.renderer.render(scene, camera);
  }

  animate();

  // Cleanup
  window.addEventListener('beforeunload', () => {
    renderer.dispose();
    input.destroy();
  });
}

init();
