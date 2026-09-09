// shaders/pixelation.js — Pixelation Effect (Baseado no vídeo do Gustavo)
// Extraído de SKILL.md (2026-09-09).
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export const pixelationShader = {
  uniforms: {
    tDiffuse: { value: null },
    pixelSize: { value: 8.0 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float pixelSize;
    uniform vec2 resolution;
    varying vec2 vUv;
    void main() {
      vec2 d = 1.0 / resolution;
      vec2 uv = floor(vUv / pixelSize) * pixelSize;
      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `
};

// Uso
// const composer = new EffectComposer(renderer);
// composer.addPass(new RenderPass(scene, camera));
// const pixelationPass = new ShaderPass(pixelationShader);
// pixelationPass.uniforms.pixelSize.value = 8.0;
// composer.addPass(pixelationPass);
