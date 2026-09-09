// instanced-blocks.js — InstancedBlockManager: 100k instâncias por tipo, swap-remove, batch, clear
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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
