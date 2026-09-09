// shaders/comet-trails.js — Comet Trails Effect (16-sample motion blur direcional)
// Extraído de SKILL.md (2026-09-09).
import * as THREE from 'three';

export const cometTrailsShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    trailLength: { value: 0.1 },
    trailIntensity: { value: 0.8 },
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float trailLength;
    uniform float trailIntensity;
    uniform vec2 resolution;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      vec3 color = vec3(0.0);
      float totalWeight = 0.0;
      for (int i = 0; i < 16; i++) {
        float offset = float(i) * trailLength / 16.0;
        vec2 sampleUv = fract(uv - vec2(time * 0.5, 0.0) * offset);
        vec3 sampleColor = texture2D(tDiffuse, sampleUv).rgb;
        float weight = pow(1.0 - float(i) / 16.0, 2.0) * trailIntensity;
        color += sampleColor * weight;
        totalWeight += weight;
      }
      if (totalWeight > 0.0) { color /= totalWeight; }
      vec3 original = texture2D(tDiffuse, uv).rgb;
      gl_FragColor = vec4(mix(original, color, 0.5), 1.0);
    }
  `
};

// Animation loop
// const clock = new THREE.Clock();
// function animate() {
//   requestAnimationFrame(animate);
//   cometPass.uniforms.time.value = clock.getElapsedTime();
//   composer.render();
// }
