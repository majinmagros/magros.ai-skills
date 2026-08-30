---
name: threejs-voxel-block-system
description: |
  Sistema modular blocos estilo Minecraft: registry, geometries, materials, instancing, instanced mesh. Baseado no vídeo do Gustavo Campelo (bloco por bloco: grama, pedra, obsidiana, portal, cerejeira, tronco).
  Use quando: "threejs voxel system", "threejs minecraft blocks", "threejs block registry", "threejs instanced mesh blocks", "threejs block system", "threejs voxel blocks".
  Não use para: composição geral de cena (use threejs-scene-composer), shaders (use threejs-shader-effects), deploy (use threejs-deploy-pipeline).
  Outcome: Sistema completo de blocos voxel estilo Minecraft com registry, geometries, materials, instanced rendering, physics opcional.
metadata:
  origin: AUTORAL
  source_docs:
    - https://threejs.org/docs/#api/en/objects/InstancedMesh
    - https://threejs.org/docs/#api/en/geometries/BoxGeometry
    - https://github.com/mrdoob/three.js/tree/dev/examples/webgl_instancing
    - https://github.com/mrdoob/three.js/tree/dev/examples/webgl_voxel
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: []
---

# Three.js Voxel Block System — Sistema de Blocos Voxel Estilo Minecraft

Sistema completo de **blocos voxel estilo Minecraft**: registry de tipos, geometries, materials, instanced rendering, physics opcional. Baseado no workflow "elemento por elemento" do Gustavo Campelo (grama, pedra, obsidiana, portal, cerejeira, tronco, porcão).

## Quando usar (gatilhos concretos)

- "Sistema de blocos voxel Three.js"
- "Three.js Minecraft blocks"
- "Three.js block registry"
- "Three.js instanced mesh blocks"
- "Sistema de blocos voxel Three.js"
- "Blocos estilo Minecraft Three.js"

## Quando NÃO usar

- Composição geral de cena → use `threejs-scene-composer`
- Shaders customizados → use `threejs-shader-effects`
- Deploy → use `threejs-deploy-pipeline`
- Patterns responsivos → use `threejs-responsive-patterns`
- Config constants → use `threejs-config-constants`

## Core: Block Registry

```javascript
// block-registry.js
import * as THREE from 'three';

export class BlockRegistry {
  constructor() {
    this.blockTypes = new Map();
    this.blockStates = new Map(); // para blocos com estados (ex: água fluindo, porta aberta)
    this.textures = new Map();
    this._registerDefaults();
  }
  
  // === REGISTRO DE TIPOS ===
  
  registerBlockType(id, definition) {
    const blockType = {
      id,
      name: definition.name || id,
      // Geometria
      geometry: definition.geometry || this._createCubeGeometry(definition),
      // Material
      material: definition.material || this._createDefaultMaterial(definition),
      // Propriedades físicas
      solid: definition.solid !== false,
      transparent: definition.transparent || false,
      collidable: definition.collidable !== false,
      // Propriedades visuais
      tintColor: definition.tintColor || 0xffffff,
      emissive: definition.emissive || 0x000000,
      emissiveIntensity: definition.emissiveIntensity || 0,
      // Propriedades especiais
      isFluid: definition.isFluid || false,
      isPlant: definition.isPlant || false,
      isTileEntity: definition.isTileEntity || false, // baú, fornalha, etc
      // Estados (para blocos com estados)
      states: definition.states || {},
      defaultState: definition.defaultState || 'default',
      // Rendering
      renderType: definition.renderType || 'solid', // solid, transparent, cutout, fluid
      cullFace: definition.cullFace !== false,
      // Drops
      drops: definition.drops || [{ item: id, count: 1 }],
      // Tool required
      harvestTool: definition.harvestTool || 'hand',
      harvestLevel: definition.harvestLevel || 0,
      // Callbacks
      onPlace: definition.onPlace,
      onBreak: definition.onBreak,
      onInteract: definition.onInteract,
      onTick: definition.onTick, // para blocos que atualizam (água, fogo, plantas)
      // Metadata
      tags: definition.tags || [],
      creativeTab: definition.creativeTab || 'building'
    };
    
    this.blockTypes.set(id, blockType);
    return this;
  }
  
  _createCubeGeometry(def) {
    const { width = 1, height = 1, depth = 1 } = def.dimensions || {};
    return new THREE.BoxGeometry(width, height, depth);
  }
  
  _createDefaultMaterial(def) {
    return new THREE.MeshStandardMaterial({
      color: def.color || 0x888888,
      roughness: def.roughness || 0.8,
      metalness: def.metalness || 0.0,
      transparent: def.transparent || false,
      opacity: def.opacity || 1.0,
      alphaTest: def.alphaTest || 0,
      side: def.side || THREE.FrontSide
    });
  }
  
  // Estados de bloco (para blocos com múltiplos estados)
  registerBlockState(blockId, stateName, stateDef) {
    const blockType = this.blockTypes.get(blockId);
    if (!blockType) return false;
    
    blockType.states[stateName] = {
      model: stateDef.model, // referência a outro blockId ou geometry
      properties: stateDef.properties || {},
      transitions: stateDef.transitions || {}
    };
    return true;
  }
  
  getBlockType(id) {
    return this.blockTypes.get(id);
  }
  
  hasBlockType(id) {
    return this.blockTypes.has(id);
  }
  
  // Iteração
  forEach(callback) {
    this.blockTypes.forEach((type, id) => callback(id, type));
  }
  
  getAllIds() {
    return Array.from(this.blockTypes.keys());
  }
  
  // Filtros
  getByTag(tag) {
    const result = [];
    this.blockTypes.forEach((type, id) => {
      if (type.tags.includes(tag)) result.push({ id, type });
    });
    return result;
  }
  
  getSolidBlocks() {
    const result = [];
    this.blockTypes.forEach((type, id) => {
      if (type.solid) result.push({ id, type });
    });
    return result;
  }
  
  getTransparentBlocks() {
    const result = [];
    this.blockTypes.forEach((type, id) => {
      if (type.transparent) result.push({ id, type });
    });
    return result;
  }
  
  // === DEFAULTS MINECRAFT-STYLE ===
  
  _registerDefaults() {
    // ===== BLOCOS SÓLIDOS =====
    
    this.registerBlockType('grass_block', {
      name: 'Grass Block',
      color: 0x4a7c2e,
      roughness: 0.8,
      metalness: 0.0,
      tags: ['natural', 'building', 'ground'],
      creativeTab: 'building'
    });
    
    this.registerBlockType('stone', {
      name: 'Stone',
      color: 0x888888,
      roughness: 0.9,
      metalness: 0.1,
      tags: ['natural', 'building', 'underground'],
      harvestTool: 'pickaxe',
      harvestLevel: 1
    });
    
    this.registerBlockType('dirt', {
      name: 'Dirt',
      color: 0x6b4423,
      roughness: 0.95,
      tags: ['natural', 'ground'],
      creativeTab: 'building'
    });
    
    this.registerBlockType('cobblestone', {
      name: 'Cobblestone',
      color: 0x666666,
      roughness: 0.9,
      tags: ['building', 'crafted'],
      harvestTool: 'pickaxe',
      harvestLevel: 1
    });
    
    this.registerBlockType('obsidian', {
      name: 'Obsidian',
      color: 0x1a0a1a,
      roughness: 0.3,
      metalness: 0.2,
      tags: ['rare', 'nether', 'explosion_proof'],
      harvestTool: 'pickaxe',
      harvestLevel: 3
    });
    
    this.registerBlockType('bedrock', {
      name: 'Bedrock',
      color: 0x1a1a1a,
      roughness: 0.5,
      tags: ['unbreakable', 'world_border'],
      harvestTool: 'none', // inquebrável
      harvestLevel: 999
    });
    
    // ===== MINÉRIOS =====
    
    this.registerBlockType('coal_ore', {
      name: 'Coal Ore',
      color: 0x3a3a3a,
      roughness: 0.8,
      tags: ['ore', 'fuel'],
      harvestTool: 'pickaxe',
      harvestLevel: 1,
      drops: [{ item: 'coal', count: { min: 1, max: 2 } }]
    });
    
    this.registerBlockType('iron_ore', {
      name: 'Iron Ore',
      color: 0xd4a574,
      roughness: 0.7,
      metalness: 0.3,
      tags: ['ore', 'metal'],
      harvestTool: 'pickaxe',
      harvestLevel: 1,
      drops: [{ item: 'raw_iron', count: { min: 1, max: 3 } }]
    });
    
    this.registerBlockType('gold_ore', {
      name: 'Gold Ore',
      color: 0xffd700,
      roughness: 0.6,
      metalness: 0.5,
      tags: ['ore', 'precious'],
      harvestTool: 'pickaxe',
      harvestLevel: 2,
      drops: [{ item: 'raw_gold', count: { min: 1, max: 2 } }]
    });
    
    this.registerBlockType('diamond_ore', {
      name: 'Diamond Ore',
      color: 0x00ffff,
      roughness: 0.5,
      metalness: 0.4,
      emissive: 0x00ffff,
      emissiveIntensity: 0.1,
      tags: ['ore', 'gem', 'rare'],
      harvestTool: 'pickaxe',
      harvestLevel: 2,
      drops: [{ item: 'diamond', count: 1 }]
    });
    
    this.registerBlockType('emerald_ore', {
      name: 'Emerald Ore',
      color: 0x50c878,
      roughness: 0.5,
      tags: ['ore', 'gem', 'rare', 'trading'],
      harvestTool: 'pickaxe',
      harvestLevel: 2,
      drops: [{ item: 'emerald', count: 1 }]
    });
    
    // ===== MADEIRA =====
    
    this.registerBlockType('oak_log', {
      name: 'Oak Log',
      color: 0x8b5a2b,
      roughness: 0.9,
      tags: ['wood', 'natural', 'tree'],
      harvestTool: 'axe',
      tags: ['wood', 'building']
    });
    
    this.registerBlockType('oak_planks', {
      name: 'Oak Planks',
      color: 0xdeb887,
      roughness: 0.8,
      tags: ['wood', 'crafted', 'building'],
      harvestTool: 'axe'
    });
    
    this.registerBlockType('oak_leaves', {
      name: 'Oak Leaves',
      color: 0x2d5a1a,
      roughness: 0.9,
      transparent: true,
      alphaTest: 0.5,
      renderType: 'cutout',
      isPlant: true,
      tags: ['leaves', 'natural', 'decoration'],
      harvestTool: 'shears'
    });
    
    // ===== PLANTAS / FLORES =====
    
    this.registerBlockType('cherry_sapling', {
      name: 'Cherry Sapling',
      color: 0xffb7c5,
      transparent: true,
      alphaTest: 0.5,
      renderType: 'cutout',
      isPlant: true,
      tags: ['plant', 'decoration', 'tree'],
      harvestTool: 'hand'
    });
    
    this.registerBlockType('grass', {
      name: 'Grass',
      color: 0x4a7c2e,
      transparent: true,
      alphaTest: 0.5,
      renderType: 'cutout',
      isPlant: true,
      tags: ['plant', 'ground_cover'],
      harvestTool: 'shears'
    });
    
    this.registerBlockType('flower_poppy', {
      name: 'Poppy',
      color: 0xff0000,
      transparent: true,
      alphaTest: 0.5,
      renderType: 'cutout',
      isPlant: true,
      tags: ['flower', 'decoration', 'red'],
      harvestTool: 'hand'
    });
    
    // ===== BLOCOS ESPECIAIS =====
    
    this.registerBlockType('water', {
      name: 'Water',
      color: 0x006994,
      transparent: true,
      opacity: 0.8,
      transparent: true,
      renderType: 'fluid',
      isFluid: true,
      transparent: true,
      opacity: 0.8,
      roughness: 0.1,
      metalness: 0.0,
      ior: 1.33,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      tags: ['fluid', 'natural'],
      harvestTool: 'bucket',
      onInteract: (world, pos, player) => {
        // Encher balde
        player.inventory.addItem('water_bucket', 1);
        world.setBlock(pos, 'air');
      }
    });
    
    this.registerBlockType('lava', {
      name: 'Lava',
      color: 0xff4400,
      emissive: 0xff4400,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9,
      renderType: 'fluid',
      isFluid: true,
      tags: ['fluid', 'danger', 'nether'],
      harvestTool: 'bucket'
    });
    
    this.registerBlockType('glass', {
      name: 'Glass',
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.0,
      metalness: 0.9,
      renderType: 'transparent',
      tags: ['building', 'decoration', 'window'],
      harvestTool: 'silk_touch'
    });
    
    this.registerBlockType('glowstone', {
      name: 'Glowstone',
      color: 0xffffaa,
      emissive: 0xffffaa,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      tags: ['light', 'nether', 'bright'],
      harvestTool: 'silk_touch'
    });
    
    // ===== BLOCOS FUNCIONAIS =====
    
    this.registerBlockType('crafting_table', {
      name: 'Crafting Table',
      color: 0x8b5a2b,
      roughness: 0.8,
      isTileEntity: true,
      tileEntityType: 'crafting_table',
      tags: ['utility', 'crafting', 'utility'],
      harvestTool: 'axe'
    });
    
    this.registerBlockType('furnace', {
      name: 'Furnace',
      color: 0x666666,
      roughness: 0.8,
      isTileEntity: true,
      tileEntityType: 'furnace',
      tags: ['utility', 'smelting', 'cooking'],
      harvestTool: 'pickaxe'
    });
    
    this.registerBlockType('chest', {
      name: 'Chest',
      color: 0x8b5a2b,
      roughness: 0.8,
      isTileEntity: true,
      tileEntityType: 'chest',
      tags: ['storage', 'utility'],
      harvestTool: 'axe'
    });
    
    // ===== PORTAL / ESPECIAIS (Gustavo Campelo) =====
    
    this.registerBlockType('portal_frame', {
      name: 'Portal Frame',
      color: 0x444444,
      roughness: 0.5,
      metalness: 0.3,
      emissive: 0x00ffff,
      emissiveIntensity: 0.3,
      tags: ['portal', 'magic', 'structure'],
      onInteract: (world, pos, player) => {
        // Ativar portal
        world.activatePortal(pos);
      }
    });
    
    this.registerBlockType('portal_block', {
      name: 'Portal Block',
      color: 0x00ffff,
      transparent: true,
      opacity: 0.7,
      emissive: 0x00ffff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7,
      renderType: 'transparent',
      isFluid: false,
      tags: ['portal', 'magic', 'teleport'],
      onInteract: (world, pos, player) => {
        world.teleportPlayer(player, world.getLinkedPortal(pos));
      }
    });
    
    // ===== DECORATIVOS =====
    
    this.registerBlockType('torch', {
      name: 'Torch',
      color: 0xffaa00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.8,
      transparent: true,
      alphaTest: 0.5,
      renderType: 'cutout',
      tags: ['light', 'decoration'],
      harvestTool: 'hand'
    });
    
    this.registerBlockType('lantern', {
      name: 'Lantern',
      color: 0xffcc00,
      emissive: 0xffcc00,
      emissiveIntensity: 1.0,
      roughness: 0.3,
      metalness: 0.5,
      tags: ['light', 'decoration', 'hanging'],
      harvestTool: 'hand'
    });
    
    // ===== REGISTRO DE TEXTURAS =====
    
    registerTexture(id, texture) {
      this.textures.set(id, texture);
    }
    
    getTexture(id) {
      return this.textures.get(id);
    }
    
    // ===== BLOCK STATE MANAGEMENT =====
    
    // Para blocos com estados (ex: água com nível, porta aberta/fechada)
    getState(blockId, stateName) {
      const blockType = this.blockTypes.get(blockId);
      if (!blockType) return null;
      return blockType.states[stateName];
    }
    
    setState(world, position, blockId, stateName) {
      const state = this.getState(blockId, stateName);
      if (!state) return false;
      
      // Atualiza o bloco no mundo
      world.setBlockState(position, blockId, stateName);
      
      // Trigger transitions
      const blockType = this.blockTypes.get(blockId);
      if (blockType?.states[stateName]?.transitions) {
        // Handle transitions...
      }
      
      return true;
    }
  }
}
```

## Block World / Chunk System

```javascript
// voxel-world.js
import * as THREE from 'three';
import { InstancedMesh } from 'three';
import { BlockRegistry } from './block-registry.js';

export class VoxelWorld {
  constructor(blockRegistry, options = {}) {
    this.registry = blockRegistry;
    this.chunkSize = options.chunkSize || 16;
    this.chunkHeight = options.chunkHeight || 256;
    this.renderDistance = options.renderDistance || 4; // chunks
    
    // Chunk storage
    this.chunks = new Map(); // key: "x,z" -> Chunk
    this.blockData = new Map(); // "x,y,z" -> { blockId, state, data }
    
    // Instanced meshes por tipo de bloco
    this.instancedMeshes = new Map();
    
    // Geometry cache
    this.geometryCache = new Map();
    this.materialCache = new Map();
    
    // Chunk loading queue
    this.loadQueue = [];
    this.loading = false;
  }
  
  // === CHUNK MANAGEMENT ===
  
  getChunkKey(x, z) {
    const cx = Math.floor(x / this.chunkSize);
    const cz = Math.floor(z / this.chunkSize);
    return `${cx},${cz}`;
  }
  
  getChunk(x, z) {
    const key = this.getChunkKey(x, z);
    return this.chunks.get(key);
  }
  
  getOrCreateChunk(x, z) {
    const key = this.getChunkKey(x, z);
    let chunk = this.chunks.get(key);
    
    if (!chunk) {
      chunk = this._createChunk(x, z);
      this.chunks.set(key, chunk);
    }
    
    return chunk;
  }
  
  _createChunk(cx, cz) {
    const chunk = {
      cx, cz,
      blocks: new Map(), // "x,y,z" -> { blockId, state, data }
      mesh: null, // InstancedMesh consolidado
      dirty: true,
      lastUpdate: Date.now()
    };
    
    // Gera terreno básico
    this._generateTerrain(chunk);
    
    return chunk;
  }
  
  _generateTerrain(chunk) {
    const { cx, cz } = chunk;
    const baseX = cx * this.chunkSize;
    const baseZ = cz * this.chunkSize;
    
    for (let x = 0; x < this.chunkSize; x++) {
      for (let z = 0; z < this.chunkSize; z++) {
        const worldX = baseX + x;
        const worldZ = baseZ + z;
        
        // Noise para altura do terreno
        const height = this._getTerrainHeight(worldX, worldZ);
        
        for (let y = 0; y <= height; y++) {
          const blockId = y === height ? 'grass_block' : 
                         y > height - 4 ? 'dirt' : 'stone';
          
          this.setBlock(worldX, y, worldZ, blockId);
        }
        
        // Ores aleatórios
        if (Math.random() < 0.02) {
          this.setBlock(worldX, height - 1, worldZ, 'coal_ore');
        }
      }
    }
    
    _getTerrainHeight(x, z) {
      // Simplex noise ou Perlin noise simplificado
      const scale = 0.01;
      const height = Math.floor(
        Math.abs(Math.sin(x * scale) * Math.cos(z * scale) * 10) + 
        Math.abs(Math.sin(x * 0.02) * Math.sin(z * 0.02) * 5) + 
        60
      );
      return Math.max(0, Math.min(height, this.chunkHeight - 1));
    }
  }
  
  // === BLOCK OPERATIONS ===
  
  setBlock(x, y, z, blockId, state = 'default', data = {}) {
    if (y < 0 || y >= this.chunkHeight) return false;
    
    const cx = Math.floor(x / this.chunkSize);
    const cz = Math.floor(z / this.chunkSize);
    const chunk = this.getOrCreateChunk(cx, cz);
    
    const lx = ((x % this.chunkSize) + this.chunkSize) % this.chunkSize;
    const lz = ((z % this.chunkSize) + this.chunkSize) % this.chunkSize;
    const key = `${lx},${y},${lz}`;
    
    const blockType = this.registry.getBlockType(blockId);
    if (!blockType) return false;
    
    const oldBlock = chunk.blocks.get(key);
    chunk.blocks.set(key, { blockId, state, data, timestamp: Date.now() });
    chunk.dirty = true;
    
    // Callback
    if (blockType.onPlace) {
      blockType.onPlace(this, { x, y, z }, blockId, state);
    }
    
    // Invalidate mesh
    chunk.mesh = null;
    
    return true;
  }
  
  getBlock(x, y, z) {
    if (y < 0 || y >= this.chunkHeight) return null;
    
    const cx = Math.floor(x / this.chunkSize);
    const cz = Math.floor(z / this.chunkSize);
    const chunk = this.chunks.get(this.getChunkKey(cx, cz));
    
    if (!chunk) return { blockId: 'air', state: 'default' };
    
    const lx = ((x % this.chunkSize) + this.chunkSize) % this.chunkSize;
    const lz = ((z % this.chunkSize) + this.chunkSize) % this.chunkSize;
    
    return chunk.blocks.get(`${lx},${y},${lz}`) || { blockId: 'air', state: 'default' };
  }
  
  removeBlock(x, y, z) {
    const block = this.getBlock(x, y, z);
    if (!block || block.blockId === 'air') return false;
    
    const blockType = this.registry.getBlockType(block.blockId);
    if (blockType?.onBreak) {
      blockType.onBreak(this, { x, y, z }, block.blockId);
    }
    
    return this.setBlock(x, y, z, 'air');
  }
  
  // === RAYCASTING ===
  
  raycast(origin, direction, maxDistance = 100) {
    const raycaster = new THREE.Raycaster(origin, direction.normalize(), 0, maxDistance);
    
    // Varre chunks na direção do raio
    const step = 0.1;
    let current = origin.clone();
    const end = origin.clone().add(direction.clone().multiplyScalar(maxDistance));
    
    while (current.distanceTo(end) > 0.1) {
      current.addScaledVector(direction, step);
      
      const block = this.getBlock(
        Math.floor(current.x),
        Math.floor(current.y),
        Math.floor(current.z)
      );
      
      if (block && block.blockId !== 'air') {
        const blockType = this.registry.getBlockType(block.blockId);
        if (blockType && blockType.collidable) {
          const bx = Math.floor(current.x);
          const by = Math.floor(current.y);
          const bz = Math.floor(current.z);
          
          // Calcula face atingida
          const prev = current.clone().sub(direction.clone().multiplyScalar(step));
          let face = 'top';
          
          if (prev.x < bx) face = 'west';
          else if (prev.x > bx + 1) face = 'east';
          else if (prev.y < by) face = 'bottom';
          else if (prev.y > by + 1) face = 'top';
          else if (prev.z < bz) face = 'north';
          else if (prev.z > bz + 1) face = 'south';
          
          return {
            position: { x: bx, y: by, z: bz },
            block: block.blockId,
            face,
            distance: origin.distanceTo(current)
          };
        }
      }
      
      current.addScaledVector(direction, step);
    }
    
    return null;
  }
  
  // === MESH GENERATION (InstancedMesh) ===
  
  rebuildChunkMesh(chunk) {
    if (!chunk.dirty) return;
    
    // Agrupa blocos por tipo para InstancedMesh
    const blocksByType = new Map();
    
    chunk.blocks.forEach(({ blockId, state, data }, key) => {
      if (!blockId || blockId === 'air') return;
      
      const [lx, y, lz] = key.split(',').map(Number);
      const cx = chunk.cx * this.chunkSize;
      const cz = chunk.cz * this.chunkSize;
      const wx = cx + parseInt(lx);
      const wz = cz + parseInt(lz);
      
      if (!this.instancedMeshes.has(blockId)) {
        this._createInstancedMesh(blockId);
      }
      
      if (!this.instancedMeshes.has(blockId)) return;
      
      const mesh = this.instancedMeshes.get(blockId);
      const index = mesh.count;
      
      const dummy = new THREE.Object3D();
      dummy.position.set(
        (lx + 0.5),
        (y + 0.5),
        (lz + 0.5)
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
      
      if (!blocksByType.has(blockId)) {
        blocksByType.set(blockId, []);
      }
      blocksByType.get(blockId).push({ x: lx, y, z: lz, matrix: dummy.matrix });
    });
    
    // Atualiza InstancedMeshes
    blocksByType.forEach((instances, blockId) => {
      const mesh = this.instancedMeshes.get(blockId);
      if (!mesh) return;
      
      instances.forEach((inst, i) => {
        mesh.setMatrixAt(i, inst.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      mesh.count = instances.length;
    });
    
    chunk.dirty = false;
    chunk.mesh = this._createChunkMesh(chunk);
    return chunk.mesh;
  }
  
  _createInstancedMesh(blockId) {
    const blockType = this.registry.getBlockType(blockId);
    if (!blockType) return;
    
    const geometry = blockType.geometry;
    const material = blockType.material;
    
    // Estima contagem máxima
    const maxCount = this.chunkSize * this.chunkSize * this.chunkHeight / 10;
    
    const mesh = new THREE.InstancedMesh(
      geometry,
      material,
      maxCount
    );
    
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = true;
    mesh.sortObjects = false;
    
    this.instancedMeshes.set(blockId, mesh);
    return mesh;
  }
  
  _createChunkMesh(chunk) {
    const group = new THREE.Group();
    
    this.instancedMeshes.forEach((mesh, blockId) => {
      if (mesh.count > 0) {
        group.add(mesh);
      }
    });
    
    return group;
  }
  
  rebuildDirtyChunks() {
    this.chunks.forEach(chunk => {
      if (chunk.dirty) {
        this.rebuildChunkMesh(chunk);
      }
    });
  }
  
  // === RENDER ===
  
  getVisibleChunks(camera, maxDistance) {
    const cx = Math.floor(camera.position.x / this.chunkSize);
    const cz = Math.floor(camera.position.z / this.chunkSize);
    const chunkRadius = Math.ceil(maxDistance / this.chunkSize);
    
    const visible = [];
    
    for (let dx = -chunkRadius; dx <= chunkRadius; dx++) {
      for (let dz = -chunkRadius; dz <= chunkRadius; dz++) {
        const chunk = this.chunks.get(`${cx + dx},${cz + dz}`);
        if (chunk) visible.push(chunk);
      }
    }
    
    return visible;
  }
  
  render(renderer, scene, camera) {
    // Atualiza chunks visíveis
    const visible = this.getVisibleChunks(camera, 100);
    visible.forEach(chunk => {
      if (chunk.dirty) this.rebuildChunkMesh(chunk);
      if (chunk.mesh) scene.add(chunk.mesh);
    });
    
    // Remove chunks distantes
    this.chunks.forEach((chunk, key) => {
      if (!visible.includes(chunk) && chunk.mesh) {
        scene.remove(chunk.mesh);
      }
    });
  }
  
  // === SAVE/LOAD ===
  
  serialize() {
    const data = {
      chunks: {},
      metadata: {
        chunkSize: this.chunkSize,
        chunkHeight: this.chunkHeight,
        version: 1
      }
    };
    
    this.chunks.forEach((chunk, key) => {
      if (chunk.blocks.size === 0) return;
      
      data.chunks[key] = {
        cx: chunk.cx,
        cz: chunk.cz,
        blocks: {}
      };
      
      chunk.blocks.forEach((value, key) => {
        if (value.blockId !== 'air') {
          data.chunks[key].blocks[key] = {
            blockId: value.blockId,
            state: value.state,
            data: value.data
          };
        }
      });
    });
    
    return JSON.stringify(data);
  }
  
  static deserialize(json, registry) {
    const data = JSON.parse(json);
    const world = new VoxelWorld(registry, {
      chunkSize: data.metadata.chunkSize,
      chunkHeight: data.metadata.chunkHeight
    });
    
    Object.entries(data.chunks).forEach(([key, chunkData]) => {
      const chunk = world._createChunk(chunkData.cx, chunkData.cz);
      Object.entries(chunkData.blocks).forEach(([key, blockData]) => {
        const [lx, y, lz] = key.split(',').map(Number);
        chunk.blocks.set(key, blockData);
      });
      chunk.dirty = true;
    });
    
    return world;
  }
}
```

## InstancedMesh para Performance Massiva

```javascript
// instanced-blocks.js
import * as THREE from 'three';

export class InstancedBlockManager {
  constructor(registry, options = {}) {
    this.registry = registry;
    this.maxInstancesPerType = options.maxInstancesPerType || 100000;
    this.meshes = new Map(); // blockId -> InstancedMesh
    this.counts = new Map(); // blockId -> count
    this.matrices = new Map(); // blockId -> Float32Array
    this.dummy = new THREE.Object3D();
  }
  
  addBlock(blockId, position, rotation = new THREE.Euler(), scale = new THREE.Vector3(1, 1, 1)) {
    if (!this.meshes.has(blockId)) {
      this._createMesh(blockId);
    }
    
    const mesh = this.meshes.get(blockId);
    const index = this.counts.get(blockId) || 0;
    
    if (index >= this.maxInstancesPerType) {
      console.warn(`Max instances reached for ${blockId}`);
      return false;
    }
    
    this.dummy.position.copy(position);
    this.dummy.rotation.copy(rotation);
    this.dummy.scale.copy(scale);
    this.dummy.updateMatrix();
    
    this.meshes.get(blockId).setMatrixAt(index, this.dummy.matrix);
    this.meshes.get(blockId).instanceMatrix.needsUpdate = true;
    this.counts.set(blockId, index + 1);
    
    return { mesh: this.meshes.get(blockId), index };
  }
  
  removeBlock(blockId, index) {
    const mesh = this.meshes.get(blockId);
    if (!mesh) return false;
    
    const lastIndex = (this.counts.get(blockId) || 0) - 1;
    
    if (index !== lastIndex) {
      // Swap com último
      const lastMatrix = new THREE.Matrix4();
      this.meshes.get(blockId).getMatrixAt(lastIndex, lastMatrix);
      this.meshes.get(blockId).setMatrixAt(index, lastMatrix);
    }
    
    this.counts.set(blockId, lastIndex);
    this.meshes.get(blockId).instanceMatrix.needsUpdate = true;
    this.meshes.get(blockId).count = lastIndex;
    
    return true;
  }
  
  _createMesh(blockId) {
    const blockType = this.registry.getBlockType(blockId);
    if (!blockType) return;
    
    const geometry = blockType.geometry;
    const material = blockType.material.clone();
    
    const mesh = new THREE.InstancedMesh(
      geometry,
      material,
      this.maxInstancesPerType
    );
    
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = true;
    mesh.sortObjects = false;
    
    this.meshes.set(blockId, mesh);
    this.counts.set(blockId, 0);
    
    return mesh;
  }
  
  getMesh(blockId) {
    return this.meshes.get(blockId);
  }
  
  getCount(blockId) {
    return this.counts.get(blockId) || 0;
  }
  
  getAllMeshes() {
    return Array.from(this.meshes.values());
  }
  
  // Batch operations
  setBlockBatch(blocks) {
    blocks.forEach(({ blockId, position, rotation, scale }) => {
      this.addBlock(blockId, position, rotation, scale);
    });
    
    // Update all meshes
    this.meshes.forEach(mesh => {
      mesh.instanceMatrix.needsUpdate = true;
    });
  }
  
  clear() {
    this.meshes.forEach(mesh => {
      mesh.geometry.dispose();
      mesh.material.dispose();
    });
    this.meshes.clear();
    this.counts.clear();
  }
}
```

## Physics Integration (Opcional - Rapier.js)

```javascript
// voxel-physics.js
import * as THREE from 'three';

export class VoxelPhysics {
  constructor(world, options = {}) {
    this.world = world;
    this.enabled = false;
    this.rapier = null;
    this.bodies = new Map(); // block position -> Rapier body
    
    this._initRapier();
  }
  
  async _initRapier() {
    try {
      const Rapier = await import('@dimforge/rapier3d');
      this.rapier = Rapier;
      
      this.world = new Rapier.World({ x: 0.0, y: -9.81, z: 0.0 });
      this.enabled = true;
      console.log('Rapier physics initialized');
    } catch (e) {
      console.warn('Rapier not available, physics disabled:', e.message);
      this.enabled = false;
    }
  }
  
  addRigidBody(blockId, position, options = {}) {
    if (!this.enabled) return null;
    
    const blockType = this.world.registry.getBlockType(blockId);
    if (!blockType || !blockType.collidable) return null;
    
    const { 
      mass = blockType.mass || 1,
      restitution = 0.1,
      friction = 0.5,
      isKinematic = false
    } = options;
    
    const bodyDesc = isKinematic 
      ? this.rapier.RigidBodyDesc.kinematicPositionBased()
      : this.rapier.RigidBodyDesc.dynamic();
    
    bodyDesc.setTranslation(position.x, position.y, position.z);
    bodyDesc.setCanSleep(true);
    
    const body = this.world.createRigidBody(bodyDesc);
    
    // Collider shape (cubo 1x1x1)
    const colliderDesc = this.rapier.ColliderDesc.cuboid(0.5, 0.5, 0.5)
      .setRestitution(restitution)
      .setFriction(friction);
    
    if (blockType.tags.includes('bouncy')) {
      colliderDesc.setRestitution(0.8);
    }
    
    this.world.createCollider(colliderDesc, body);
    
    this.bodies.set(`${blockId}_${position.x}_${position.y}_${position.z}`, body);
    
    return body;
  }
  
  removeBody(blockId, position) {
    const key = `${blockId}_${position.x}_${position.y}_${position.z}`;
    const body = this.bodies.get(key);
    if (body) {
      this.world.removeRigidBody(body);
      this.bodies.delete(key);
    }
  }
  
  step(deltaTime) {
    if (!this.enabled) return;
    this.world.step(deltaTime);
    
    // Sync Three.js meshes com Rapier bodies
    this.bodies.forEach((body, key) => {
      const pos = body.translation();
      const rot = body.rotation();
      // Atualiza InstancedMesh correspondente
      // ...
    });
  }
  
  raycast(origin, direction, maxDistance = 100) {
    if (!this.enabled) return null;
    
    const ray = new this.rapier.Ray(origin, direction);
    const hit = this.world.castRay(ray, maxDistance, true);
    
    if (hit) {
      return {
        hit: true,
        distance: hit.toi,
        point: { x: origin.x + direction.x * hit.toi, y: origin.y + direction.y * hit.toi, z: origin.z + direction.z * hit.toi },
        normal: { x: hit.normal.x, y: hit.normal.y, z: hit.normal.z }
      };
    }
    return { hit: false };
  }
}
```

## Serialização Completa

```javascript
// serialization.js
export class VoxelSerializer {
  static serialize(world) {
    return JSON.stringify(world.serialize(), null, 2);
  }
  
  static deserialize(json, registry) {
    const data = JSON.parse(json);
    return VoxelWorld.deserialize(data, registry);
  }
  
  static saveToFile(world, filename) {
    const data = this.serialize(world);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `world-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  static loadFromFile(file, registry) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const world = this.deserialize(e.target.result, registry);
          resolve(world);
        } catch (e) {
          reject(e);
        }
      };
      reader.readAsText(file);
    });
  }
  
  // Compressão para save files grandes
  static compress(json) {
    // LZ-string ou similar
    return LZString.compress(json);
  }
  
  static decompress(compressed) {
    return LZString.decompress(compressed);
  }
}
```

---

## Referências Oficiais (Validados 2026-08-30)

- [Three.js InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)
- [Three.js BoxGeometry](https://threejs.org/docs/#api/en/geometries/BoxGeometry)
- [Three.js Instancing Example](https://github.com/mrdoob/three.js/tree/dev/examples/webgl_instancing)
- [Three.js Voxel Example](https://github.com/mrdoob/three.js/tree/dev/examples/webgl_voxel)

---

## Checklist de Entrega

- [ ] `BlockRegistry` com 50+ tipos de blocos padrão
- [ ] `VoxelWorld` com chunk system (16x256x16)
- [ ] `InstancedBlockManager` para rendering massivo
- [ ] `VoxelPhysics` com Rapier.js (opcional)
- [ ] `VoxelSerializer` com save/load + compressão
- [ ] Block states (água, portas, plantas)
- [ ] Tile entities (baú, fornalha, crafting table)
- [ ] InstancedMesh rendering otimizado
- [ ] Raycasting voxel-preciso
- [ ] Serialização JSON + compressão

---

## Referências Oficiais

- [Three.js InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)
- [Three.js BoxGeometry](https://threejs.org/docs/#api/en/geometries/BoxGeometry)
- [Three.js Instancing Example](https://github.com/mrdoob/three.js/tree/dev/examples/webgl_instancing)
- [Three.js Voxel Example](https://github.com/mrdoob/three.js/tree/dev/examples/webgl_voxel)

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   ├── commands/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```