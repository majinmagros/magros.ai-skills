// device-orientation.js — DeviceOrientation + DeviceMotion (com permissão iOS 13+) → rotação de câmera
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
export class DeviceOrientation {
  constructor() {
    this.orientation = { alpha: 0, beta: 0, gamma: 0 };
    this.acceleration = { x: 0, y: 0, z: 0 };
    this.rotationRate = { alpha: 0, beta: 0, gamma: 0 };

    this._bindEvents();
  }

  _bindEvents() {
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', e => {
        this.orientation = {
          alpha: e.alpha || 0,
          beta: e.beta || 0,
          gamma: e.gamma || 0
        };
        this.onOrientationChange?.(this.orientation);
      });
    }

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', e => {
        this.acceleration = {
          x: e.acceleration?.x || 0,
          y: e.acceleration?.y || 0,
          z: e.acceleration?.z || 0
        };
        this.rotationRate = {
          alpha: e.rotationRate?.alpha || 0,
          beta: e.rotationRate?.beta || 0,
          gamma: e.rotationRate?.gamma || 0
        };
        this.onMotion?.(this.acceleration, this.rotationRate);
      });
    }

    // Solicita permissão (iOS 13+)
    if (DeviceOrientationEvent.requestPermission) {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') {
          window.addEventListener('deviceorientation', ...);
        }
      });

      if (DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission().then(state => {
          if (state === 'granted') {
            window.addEventListener('devicemotion', ...);
          }
        });
      }
    }
  }

  // Converte orientação para rotação de câmera
  getCameraRotation() {
    // Alpha = rotação Z (bússola)
    // Beta = inclinação frente/trás (pitch)
    // Gamma = inclinação esquerda/direita (roll)
    return new THREE.Euler(
      THREE.MathUtils.degToRad(-this.orientation.beta),   // pitch
      THREE.MathUtils.degToRad(this.orientation.alpha),    // yaw
      THREE.MathUtils.degToRad(-this.orientation.gamma)    // roll
    );
  }
}
