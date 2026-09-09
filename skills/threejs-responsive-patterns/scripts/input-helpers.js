// input-helpers.js — normalizePointer, getDeviceType, hasTouch/hasPointer, debounce, throttle
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.

// Normaliza evento pointer para coordenadas normalizadas
export function normalizePointer(event, renderer) {
  const rect = renderer.domElement.getBoundingClientRect();
  return new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );
}

// Detecta tipo de dispositivo
export function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
  return 'desktop';
}

// Verifica suporte a touch
export const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
export const hasPointer = window.PointerEvent !== undefined;

// Debounce para resize
export function debounce(fn, delay = 150) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle para eventos frequentes
export function throttle(fn, limit = 16) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
