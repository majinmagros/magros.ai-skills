// instanced-helpers.js — InstancedForest (1000+ árvores em 1 draw call) + vento via shader
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
import * as THREE from 'three';

export class InstancedForest {
  constructor(count = 1000, area = 100) {
    this.count = count;
    this.area = area;
    this.trees = null;
    this.geometry = null;
    this.material = null;
  }

  async init(treeModel) {
    // Clona geometria do modelo
    this.geometry = treeModel.geometry.clone();
    this.material = treeModel.material.clone();

    // Cria InstancedMesh
    this.trees = new THREE.InstancedMesh(
      this.geometry,
      this.material,
      this.count
    );

    // Gera posições aleatórias
    const dummy = new THREE.Object3D();
    const positions = [];

    for (let i = 0; i < this.count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * this.area,
        0,
        (Math.random() - 0.5) * this.area
      );

      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.scale.setScalar(0.8 + Math.random() * 0.4);

      dummy.updateMatrix();
      this.trees.setMatrixAt(i, dummy.matrix);

      positions.push(dummy.position.clone());
    }

    this.trees.instanceMatrix.needsUpdate = true;

    // Frustum culling otimizado
    this.trees.frustumCulled = true;
    this.trees.sortObjects = false;

    return this.trees;
  }

  // Animação de vento via shader
  applyWind(time, strength = 0.1) {
    if (!this.material.userData.wind) {
      this.material.onBeforeCompile = (shader) => {
        shader.uniforms.time = { value: 0 };
        shader.uniforms.windStrength = { value: 0.1 };

        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>
          float wind = sin(position.x * 0.5 + time * 0.5) * windStrength * 0.1;
          transformed.x += wind;
          transformed.z += wind * 0.5;
          `
        );
      };
      this.material.userData.wind = true;
    }

    this.material.userData.windStrength = strength;
    this.material.uniforms.time.value = time;
  }
}
