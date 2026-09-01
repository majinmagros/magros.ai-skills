#!/usr/bin/env node
/**
 * compose-scene.js — SceneComposer class + block registry for modular Three.js scenes.
 * 
 * Uso: import { SceneComposer, blockRegistry, CONFIG } from './scripts/compose-scene.js';
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CONFIG } from '../config/constants.js';

// ============================================
// BLOCK REGISTRY — Factory functions por tipo
// ============================================

export const blockRegistry = {
  // Bloco grama
  grass: (position = [0, 0, 0], options = {}) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: options.color || CONFIG.materials.grass.color,
      roughness: options.roughness ?? CONFIG.materials.grass.roughness,
      metalness: options.metalness ?? CONFIG.materials.grass.metalness,
      map: options.map || null,
      normalMap: options.normalMap || null
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { type: 'grass', ...options };
    return mesh;
  },

  // Bloco pedra
  stone: (position = [0, 0, 0], options = {}) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: options.color || CONFIG.materials.stone.color,
      roughness: options.roughness ?? CONFIG.materials.stone.roughness,
      metalness: options.metalness ?? CONFIG.materials.stone.metalness
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { type: 'stone', ...options };
    return mesh;
  },

  // Bloco obsidiana
  obsidian: (position = [0, 0, 0], options = {}) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: options.color || CONFIG.materials.obsidian.color,
      roughness: options.roughness ?? CONFIG.materials.obsidian.roughness,
      metalness: options.metalness ?? CONFIG.materials.obsidian.metalness
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { type: 'obsidian', ...options };
    return mesh;
  },

  // Portal (ShaderMaterial)
  portal: (position = [0, 2, 0], options = {}) => {
    const geometry = new THREE.RingGeometry(
      options.innerRadius || 0.5,
      options.outerRadius || 1,
      32
    );
    
    const material = new THREE.ShaderMaterial({
      vertexShader: options.vertexShader || portalVertexShader,
      fragmentShader: options.fragmentShader || portalFragmentShader,
      uniforms: {
        time: { value: 0 },
        colorA: { value: new THREE.Color(options.colorA || CONFIG.materials.portal.uniforms.colorA.value) },
        colorB: { value: new THREE.Color(options.colorB || CONFIG.materials.portal.uniforms.colorB.value) },
        speed: { value: options.speed || CONFIG.materials.portal.uniforms.speed.value },
        intensity: { value: options.intensity || CONFIG.materials.portal.uniforms.intensity.value }
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.x = -Math.PI / 2;
    mesh.userData = { type: 'portal', animated: true, ...options };
    return mesh;
  },

  // Cerejeira (cerejeira tree)
  cherry: (position = [0, 0, 0], options = {}) => {
    const group = new THREE.Group();
    
    // Tronco
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.15, 2, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a2c1a,
      roughness: 0.9,
      metalness: 0.1
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 1;
    trunk.castShadow = true;
    group.add(trunk);
    
    // Copa (folhas)
    const leavesGeometry = new THREE.SphereGeometry(1.5, 16, 16);
    const leavesMaterial = new THREE.MeshStandardMaterial({
      color: options.leavesColor || 0xff69b4,
      roughness: 0.8,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9
    });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 2.5;
    leaves.castShadow = true;
    group.add(leaves);
    
    // Partículas de pétalas (opcional)
    if (options.particles) {
      const particles = createPetalParticles(position);
      group.add(particles);
    }
    
    group.position.set(...position);
    group.userData = { type: 'cherry', animated: true };
    return group;
  },

  // Log (tronco caído)
  log: (position = [0, 0, 0], options = {}) => {
    const geometry = new THREE.CylinderGeometry(0.2, 0.25, 3, 8);
    const material = new THREE.MeshStandardMaterial({
      color: options.color || 0x3d2314,
      roughness: 0.9,
      metalness: 0.1
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.z = Math.PI / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { type: 'log', ...options };
    return mesh;
  }
};

// ============================================
// PORTAL SHADERS
// ============================================

export const portalVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const portalFragmentShader = `
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform float speed;
  uniform float intensity;
  
  varying vec2 vUv;
  varying vec3 vPosition;
  
  // Noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float dist = length(uv);
    
    // Ring mask
    float ring = smoothstep(0.4, 0.5, dist) * (1.0 - smoothstep(0.5, 0.6, dist));
    
    // Animated noise
    float n = fbm(vUv * 3.0 + time * speed);
    float wave = sin(dist * 10.0 - time * 2.0) * 0.1;
    
    // Color mix
    vec3 color = mix(colorA, colorB, n + wave);
    
    // Glow effect
    float glow = 1.0 - smoothstep(0.45, 0.55, dist);
    glow *= intensity;
    
    vec3 finalColor = color * ring + vec3(glow);
    float alpha = ring * 0.8 + glow * 0.5;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

// ============================================
// SCENE COMPOSER CLASS
// ============================================

export class SceneComposer {
  constructor(canvas, sceneSpec = {}) {
    this.canvas = canvas;
    this.sceneSpec = sceneSpec;
    this.blocks = new Map();
    this.portal = null;
    this.animatedObjects = [];
    
    this.init();
  }
  
  init() {
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupLighting();
    this.setupControls();
    this.composeScene();
    this.animate();
  }
  
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.physicallyCorrectLights = true;
    
    // Resize handler
    window.addEventListener('resize', () => this.resize());
  }
  
  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    this.scene.fog = new THREE.Fog(0x87CEEB, 20, 100);
  }
  
  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      CONFIG.camera.fov,
      window.innerWidth / window.innerHeight,
      CONFIG.camera.near,
      CONFIG.camera.far
    );
    this.camera.position.set(...CONFIG.camera.position);
    this.camera.lookAt(...CONFIG.camera.target);
  }
  
  setupLighting() {
    // Ambient
    const ambient = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambient);
    
    // Directional (sun)
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(10, 20, 10);
    directional.castShadow = true;
    directional.shadow.mapSize.width = 2048;
    directional.shadow.mapSize.height = 2048;
    directional.shadow.camera.near = 0.5;
    directional.shadow.camera.far = 50;
    directional.shadow.camera.left = -20;
    directional.shadow.camera.right = 20;
    directional.shadow.camera.top = 20;
    directional.shadow.camera.bottom = -20;
    directional.shadow.bias = -0.0001;
    this.scene.add(directional);
    
    // Hemisphere
    const hemisphere = new THREE.HemisphereLight(0x87CEEB, 0x4CAF50, 0.3);
    this.scene.add(hemisphere);
  }
  
  setupControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enablePan = true;
    this.controls.minDistance = CONFIG.camera.minZoom;
    this.controls.maxDistance = CONFIG.camera.maxZoom;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.01;
    this.controls.target.set(...CONFIG.camera.target);
    
    // Touch support
    this.controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };
  }
  
  composeScene() {
    const spec = this.sceneSpec;
    
    // Compose blocks
    if (spec.blocks) {
      Object.entries(spec.blocks).forEach(([id, blockSpec]) => {
        const createBlock = blockRegistry[blockSpec.type];
        if (createBlock) {
          const block = createBlock(blockSpec.position, blockSpec.options);
          this.scene.add(block);
          this.blocks.set(id, block);
        }
      });
    }
    
    // Portal
    if (spec.portal) {
      this.portal = blockRegistry.portal(spec.portal.position, spec.portal.options);
      this.scene.add(this.portal);
      this.animatedObjects.push(this.portal);
    }
    
    // Cherry trees
    if (spec.cherries) {
      spec.cherries.forEach((cherrySpec, i) => {
        const cherry = blockRegistry.cherry(cherrySpec.position, cherrySpec.options);
        this.scene.add(cherry);
        this.animatedObjects.push(cherry);
      });
    }
    
    // Logs
    if (spec.logs) {
      spec.logs.forEach((logSpec, i) => {
        const log = blockRegistry.log(logSpec.position, logSpec.options);
        this.scene.add(log);
      });
    }
    
    // Island ground
    this.createIsland();
  }
  
  createIsland() {
    const geometry = new THREE.PlaneGeometry(
      CONFIG.island.size,
      CONFIG.island.size,
      CONFIG.island.segments,
      CONFIG.island.segments
    );
    
    // Apply noise to vertices for terrain
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const noise = this.noise2D(x * CONFIG.island.noiseScale, y * CONFIG.island.noiseScale);
      position.setZ(i, noise * CONFIG.island.noiseAmplitude + CONFIG.island.elevation);
    }
    geometry.computeVertexNormals();
    
    const material = new THREE.MeshStandardMaterial({
      color: 0x4CAF50,
      roughness: 0.8,
      metalness: 0.1
    });
    
    const island = new THREE.Mesh(geometry, material);
    island.rotation.x = -Math.PI / 2;
    island.position.set(...CONFIG.island.position);
    island.receiveShadow = true;
    this.scene.add(island);
  }
  
  // Simple 2D noise
  noise2D(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
  }
  
  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const time = performance.now() * 0.001;
    
    // Update controls
    if (this.controls) this.controls.update();
    
    // Animate portal
    if (this.portal && this.portal.material.uniforms) {
      this.portal.material.uniforms.time.value = performance.now() * 0.001;
      this.portal.rotation.z += CONFIG.speeds.rotation;
    }
    
    // Float animation for animated objects
    this.animatedObjects.forEach(obj => {
      if (obj.userData.animated) {
        obj.position.y += Math.sin(performance.now() * 0.001 * CONFIG.speeds.float) * 0.01;
      }
    });
    
    // Rotate portal
    if (this.portal) {
      this.portal.rotation.z += CONFIG.speeds.rotation;
    }
    
    // Rotate cherries
    this.animatedObjects.forEach(obj => {
      if (obj.userData.type === 'cherry') {
        obj.rotation.y += CONFIG.speeds.rotation * 0.5;
      }
    });
    
    // Update controls
    if (this.controls) this.controls.update();
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }
  
  // Public API
  addBlock(type, position, options = {}) {
    const createBlock = blockRegistry[type];
    if (!createBlock) throw new Error(`Block type ${type} not registered`);
    const block = createBlock(position, options);
    this.scene.add(block);
    return block;
  }
  
  removeBlock(id) {
    const block = this.blocks.get(id);
    if (block) {
      this.scene.remove(block);
      this.blocks.delete(id);
    }
  }
  
  setCameraPosition(position) {
    this.camera.position.set(...position);
    this.camera.lookAt(...CONFIG.camera.target);
  }
  
  setPortalColors(colorA, colorB) {
    if (this.portal && this.portal.material.uniforms) {
      this.portal.material.uniforms.colorA.value.set(colorA);
      this.portal.material.uniforms.colorB.value.set(colorB);
    }
  }
  
  // Cleanup
  dispose() {
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.canvas.removeEventListener('resize', this.resize);
    window.removeEventListener('resize', this.resize);
  }
}

// Export
export { CONFIG } from '../config/constants.js';
export { blockRegistry, SceneComposer, portalVertexShader, portalFragmentShader };