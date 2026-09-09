// shaders/mouse-distortion.js — Mouse Distortion Effect (lente que segue o cursor)
// Extraído de SKILL.md (2026-09-09).
import * as THREE from 'three';

export const mouseDistortionShader = {
  uniforms: {
    tDiffuse: { value: null },
    mouse: { value: new THREE.Vector2(0.5, 0.5) },
    distortionStrength: { value: 0.3 },
    distortionRadius: { value: 0.3 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 mouse;
    uniform float distortionStrength;
    uniform float distortionRadius;
    uniform vec2 resolution;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      vec2 center = mouse / resolution;
      float dist = distance(uv, center);
      if (dist < distortionRadius) {
        float factor = 1.0 - smoothstep(0.0, distortionRadius, dist);
        vec2 offset = (uv - center) * factor * distortionStrength;
        uv += offset;
      }
      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `
};

// Rastreamento de mouse
// document.addEventListener('mousemove', (e) => {
//   mouseDistortionPass.uniforms.mouse.value.set(
//     e.clientX / window.innerWidth,
//     1.0 - e.clientY / window.innerHeight
//   );
// });
