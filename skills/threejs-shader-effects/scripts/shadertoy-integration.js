// shadertoy-integration.js — Conversão básica Shadertoy mainImage → Three.js ShaderMaterial
// Extraído de SKILL.md (2026-09-09).
// Shadertoy usa: void mainImage(out vec4 fragColor, in vec2 fragCoord)
// Three.js usa: void main() { gl_FragColor = ...; }

export function shadertoyToThreeJS(shadertoyCode) {
  const header = `
    uniform float time;
    uniform vec2 resolution;
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
  `;

  const mainFunction = `
    void main() {
      vec2 fragCoord = vUv * resolution;
      vec4 fragColor;
      mainImage(fragColor, vUv * resolution);
      gl_FragColor = fragColor;
    }
  `;

  // Extrai mainImage do código Shadertoy
  const mainImageMatch = shadertoyCode.match(/void mainImage\s*\([^)]*\)\s*\{([\s\S]*?)\}/);
  if (!mainImageMatch) throw new Error('mainImage não encontrado');

  return header + mainImageMatch[1] + mainFunction;
}

// Exemplo uso
const shadertoyExample = `
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 uv = fragCoord / iResolution.xy;
  vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0,2,4));
  fragColor = vec4(col, 1.0);
}
`;

const threeJSShader = shadertoyToThreeJS(shadertoyExample);
// Use com ShaderMaterial
