// unified-input.js — Pointer Events unificando touch + mouse (+ pinch zoom, raycast)
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
import * as THREE from 'three';

export class UnifiedInput {
  constructor(renderer, camera, domElement) {
    this.renderer = renderer;
    this.camera = camera;
    this.domElement = domElement;

    this.pointer = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.isPointerDown = false;
    this.pointerDownPosition = new THREE.Vector2();

    // Touch vs Mouse detection
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    this._bindEvents();
  }

  _bindEvents() {
    // Pointer Events (unifica touch + mouse)
    this.domElement.addEventListener('pointerdown', this._onPointerDown.bind(this), { passive: true });
    this.domElement.addEventListener('pointermove', this._onPointerMove.bind(this), { passive: true });
    this.domElement.addEventListener('pointerup', this._onPointerUp.bind(this), { passive: true });
    this.domElement.addEventListener('pointerleave', this._onPointerUp.bind(this));
    this.domElement.addEventListener('pointercancel', this._onPointerUp.bind(this));

    // Wheel/Zoom
    this.domElement.addEventListener('wheel', this._onWheel.bind(this), { passive: false });

    // Touch gestures (pinch zoom, rotate)
    if (this.isTouchDevice) {
      this._setupTouchGestures();
    }

    // Context menu
    this.domElement.addEventListener('contextmenu', e => e.preventDefault());
  }

  _setupTouchGestures() {
    let initialDistance = 0;
    let initialScale = 1;

    this.domElement.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
        initialScale = this.camera.scale ? this.camera.scale.x : 1;
      }
    }, { passive: true });

    this.domElement.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
        const scale = initialScale * (distance / initialDistance);
        this._onPinchZoom(scale);
      }
    }, { passive: false });
  }

  _onPointerDown(e) {
    this.isPointerDown = true;
    this.pointerDownPosition.set(e.clientX, e.clientY);
    this._updatePointer(e);
    this.onPointerDown?.(this.pointer.clone(), e);
  }

  _onPointerMove(e) {
    this._updatePointer(e);
    this.onPointerMove?.(this.pointer.clone(), e);

    if (this.isPointerDown) {
      this.onDrag?.(this.pointer.clone(), e);
    }
  }

  _onPointerUp(e) {
    this.isPointerDown = false;
    this.onPointerUp?.(this.pointer.clone(), e);

    // Click detection (não foi drag)
    const dist = this.pointerDownPosition.distanceTo(new THREE.Vector2(e.clientX, e.clientY));
    if (dist < 5) {
      this.onClick?.(this.pointer.clone(), e);
    }
  }

  _updatePointer(e) {
    const rect = this.domElement.getBoundingClientRect();
    this.pointer.x = ((e.clientX - e.rect.left) / this.domElement.clientWidth) * 2 - 1;
    this.pointer.y = -((e.clientY - e.rect.top) / this.domElement.clientHeight) * 2 + 1;
  }

  _onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1.1 : 0.9;
    this.onZoom?.(delta, e);
  }

  _onPinchZoom(scale) {
    this.onPinchZoom?.(scale);
  }

  // Raycasting unificado
  raycast(objects, recursive = true) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    return this.raycaster.intersectObjects(objects, recursive);
  }

  // Cleanup
  destroy() {
    this.domElement.removeEventListener('pointerdown', this._onPointerDown);
    this.domElement.removeEventListener('pointermove', this._onPointerMove);
    this.domElement.removeEventListener('pointerup', this._onPointerUp);
    this.domElement.removeEventListener('wheel', this._onWheel);
  }
}
