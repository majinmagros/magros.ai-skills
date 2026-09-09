// post-processing-setup.js — Pipeline: RenderPass → customs → Bloom → Film → SMAA
// Extraído de SKILL.md (2026-09-09).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { BloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

export function createPostProcessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);

  // 1. Render Pass
  composer.addPass(new RenderPass(scene, camera));

  // 2. Custom Shader Passes (adicionados dinamicamente)
  // pixelationPass, cometTrailsPass, mouseDistortionPass

  // 3. Bloom (opcional)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.5,  // strength
    0.4,  // radius
    0.85  // threshold
  );
  composer.addPass(bloomPass);

  // 4. Film grain (opcional)
  const filmPass = new FilmPass(
    0.35,   // noiseIntensity
    0.025,  // scanlinesIntensity
    648,    // scanlinesCount
    false   // grayscale
  );
  composer.addPass(filmPass);

  // 5. SMAA Anti-aliasing
  const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
  composer.addPass(smaaPass);

  return composer;
}

// Uso
// const composer = createPostProcessing(renderer, scene, camera);
// composer.addPass(pixelationPass);
// composer.addPass(cometTrailsPass);
// composer.addPass(mouseDistortionPass);
// function animate() {
//   requestAnimationFrame(animate);
//   composer.render();
// }
