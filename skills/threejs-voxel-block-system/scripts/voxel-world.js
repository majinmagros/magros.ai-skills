// voxel-world.js — VoxelWorld: chunks 16x256, terreno, set/get/remove, raycast, InstancedMesh, save/load
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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
