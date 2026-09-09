// presets.js — Presets prontos: retro, cyberpunk, cinematic, clean
// Extraído de SKILL.md (2026-09-09).
export const postProcessingPresets = {
  // Estilo retro/pixelado
  retro: {
    pixelation: { pixelSize: 8 },
    bloom: { strength: 0.3, radius: 0.4 },
    film: { noise: 0.3, scanlines: 0.02 },
    colorGrading: { contrast: 1.2, saturation: 1.1 }
  },

  // Estilo cyberpunk
  cyberpunk: {
    bloom: { strength: 1.5, radius: 0.8, threshold: 0.7 },
    colorGrading: {
      hueShift: 0.1,
      saturation: 1.5,
      contrast: 1.3
    },
    chromaticAberration: { offset: 0.005 }
  },

  // Estilo cinematográfico
  cinematic: {
    bloom: { strength: 0.5, radius: 0.6 },
    film: { noise: 0.1, scanlines: 0.01, grayscale: false },
    colorGrading: {
      lift: [0.02, 0.01, 0.0],
      gamma: [1.0, 1.0, 1.0],
      gain: [1.05, 1.02, 1.0]
    },
    vignette: { amount: 0.3 }
  },

  // Estilo minimal/clean
  clean: {
    smaa: true,
    colorGrading: { contrast: 1.05 },
    pixelation: null
  }
};

// Aplicar preset
export function applyPreset(composer, presetName, customOverrides = {}) {
  const preset = postProcessingPresets[presetName];
  if (!preset) throw new Error(`Preset ${presetName} não encontrado`);

  const config = { ...preset, ...customOverrides };
  // Aplicar configurações aos passes...
}
