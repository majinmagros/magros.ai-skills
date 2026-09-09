// responsive-renderer.js — Renderer responsivo com quality presets + auto-detect
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
import * as THREE from 'three';

export class ResponsiveRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      // Quality presets
      qualityPresets: {
        low: { pixelRatio: 1, shadowMap: false, antialias: false, toneMapping: THREE.NoToneMapping },
        medium: { pixelRatio: Math.min(window.devicePixelRatio, 1.5), shadowMap: true, antialias: true },
        high: { pixelRatio: window.devicePixelRatio, shadowMap: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping }
      },
      currentPreset: 'medium',
      ...options
    };

    this.renderer = this._createRenderer();
    this._setupResizeObserver();
    this._setupDevicePixelRatio();
  }

  _createRenderer() {
    const preset = this.options.qualityPresets[this.options.currentPreset];
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: preset.antialias,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });

    renderer.setPixelRatio(preset.pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (preset.shadowMap) {
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    if (preset.toneMapping) {
      renderer.toneMapping = preset.toneMapping;
      renderer.toneMappingExposure = 1.0;
    }

    return renderer;
  }

  _setupResizeObserver() {
    // ResizeObserver para container (mais performático que window.resize)
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        this.resize(width, height);
      }
    });

    this.resizeObserver.observe(this.canvas.parentElement);

    // Fallback para window.resize
    window.addEventListener('resize', () => this.resize());
  }

  _setupDevicePixelRatio() {
    // Detecta mudanças no devicePixelRatio (ex: usuário move janela entre monitores)
    let lastDPR = window.devicePixelRatio;
    setInterval(() => {
      if (window.devicePixelRatio !== lastDPR) {
        lastDPR = window.devicePixelRatio;
        this.setQualityPreset(this.options.currentPreset);
      }
    }, 1000);
  }

  resize(width, height) {
    this.renderer.setSize(width, height);
    // Notifica callbacks de resize
    this.onResizeCallbacks?.forEach(cb => cb(width, height));
  }

  setQualityPreset(presetName) {
    if (!this.options.qualityPresets[presetName]) return false;

    this.options.currentPreset = presetName;
    const preset = this.options.qualityPresets[presetName];

    this.renderer.setPixelRatio(preset.pixelRatio);
    this.renderer.shadowMap.enabled = preset.shadowMap;
    this.renderer.antialias = preset.antialias;

    if (preset.toneMapping) {
      this.renderer.toneMapping = preset.toneMapping;
    }

    // Re-render se necessário
    this.onQualityChangeCallbacks?.forEach(cb => cb(presetName));

    return true;
  }

  // Auto-detect quality baseado em performance
  async autoDetectQuality() {
    const benchmarks = await this._runBenchmarks();
    let preset = 'medium';

    if (benchmarks.fps < 30) preset = 'low';
    else if (benchmarks.fps > 55 && benchmarks.gpuScore > 70) preset = 'high';

    this.setQualityPreset(preset);
    return preset;
  }

  async _runBenchmarks() {
    // Benchmark rápido de 2 segundos
    const frames = [];
    const start = performance.now();

    return new Promise(resolve => {
      function frame() {
        frames.push(performance.now());
        if (performance.now() - start < 2000) {
          requestAnimationFrame(frame);
        } else {
          const fps = (frames.length / ((frames[frames.length - 1] - frames[0]) / 1000));
          resolve({ fps, frameCount: frames.length });
        }
      }
      requestAnimationFrame(frame);
    });
  }

  // Event callbacks
  onResize(callback) { this.onResizeCallbacks = this.onResizeCallbacks || []; this.onResizeCallbacks.push(callback); }
  onQualityChange(callback) { this.onQualityChangeCallbacks = this.onQualityChangeCallbacks || []; this.onQualityChangeCallbacks.push(callback); }

  dispose() {
    this.resizeObserver?.disconnect();
    this.renderer.dispose();
  }
}
