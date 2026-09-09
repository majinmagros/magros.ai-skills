// adaptive-quality.js — Ajuste automático de qualidade por FPS (pixel ratio, shadows)
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
export class AdaptiveQuality {
  constructor(renderer, scene, camera, options = {}) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    this.targetFPS = options.targetFPS || 60;
    this.sampleSize = options.sampleSize || 60; // frames
    this.adjustmentThreshold = options.adjustmentThreshold || 0.1;

    this.frameTimes = [];
    this.currentQuality = 1.0;
    this.minQuality = 0.3;
    this.maxQuality = 1.0;
    this.adjustmentStep = 0.1;

    this.metrics = {
      fps: 0,
      frameTime: 0,
      drawCalls: 0,
      triangles: 0,
      gpuMemory: 0
    };

    this._startMonitoring();
  }

  _startMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;

    const measure = (now) => {
      const delta = now - lastTime;
      lastTime = now;
      frameCount++;

      this.frameTimes.push(delta);
      if (this.frameTimes.length > this.sampleSize) {
        this.frameTimes.shift();
      }

      if (frameCount % 60 === 0) {
        this._calculateMetrics();
        this._adjustQuality();
      }

      requestAnimationFrame(measure);
    };

    requestAnimationFrame(measure);
  }

  _calculateMetrics() {
    if (this.frameTimes.length < 2) return;

    const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.metrics.fps = 1000 / avgFrameTime;
    this.metrics.frameTime = avgFrameTime;

    // Stats do renderer
    const info = this.renderer.info;
    this.metrics.drawCalls = info.render.calls;
    this.metrics.triangles = info.render.triangles;
    this.metrics.gpuMemory = info.memory.geometries + info.memory.textures;
  }

  _adjustQuality() {
    const { fps, frameTime } = this.metrics;
    const targetFrameTime = 1000 / this.targetFPS;

    if (fps < this.targetFPS * 0.9) {
      // Performance baixa - reduz qualidade
      this.currentQuality = Math.max(this.minQuality, this.currentQuality - 0.1);
      this._applyQuality();
    } else if (fps > this.targetFPS * 1.1 && this.currentQuality < this.maxQuality) {
      // Performance boa - aumenta qualidade
      this.currentQuality = Math.min(this.maxQuality, this.currentQuality + 0.05);
      this._applyQuality();
    }
  }

  _applyQuality() {
    // Pixel ratio
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.currentQuality * 2));

    // Shadow map resolution
    const shadowSize = Math.floor(1024 * this.currentQuality);
    this.renderer.shadowMap.enabled = this.currentQuality > 0.4;

    // Post-processing quality
    // this.composer?.passes.forEach(p => p.enabled = this.currentQuality > 0.5);
  }

  getMetrics() {
    return { ...this.metrics, quality: this.currentQuality };
  }

  setTargetFPS(fps) { this.targetFPS = fps; }
  setQualityRange(min, max) { this.minQuality = min; this.maxQuality = max; }
  setQuality(q) { this.currentQuality = Math.max(this.minQuality, Math.min(this.maxQuality, q)); this._applyQuality(); }
  destroy() {}
}
