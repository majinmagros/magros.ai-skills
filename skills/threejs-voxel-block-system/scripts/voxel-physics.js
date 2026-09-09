// voxel-physics.js — VoxelPhysics opcional via Rapier.js (rigid bodies, colliders, raycast)
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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
