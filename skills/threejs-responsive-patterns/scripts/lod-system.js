// lod-system.js — LODSystem (register/update) + factories (tree, building)
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
import * as THREE from 'three';

export class LODSystem {
  constructor(camera, options = {}) {
    this.camera = camera;
    this.objects = new Map();
    this.levels = options.levels || [
      { distance: 0, detail: 1.0 },      // 0-20: full detail
      { distance: 20, detail: 0.5 },     // 20-50: half detail
      { distance: 50, detail: 0.25 },    // 50-100: quarter detail
      { distance: 100, detail: 0.1 }     // 100+: minimal
    ];
  }

  register(object, lodLevels) {
    // lodLevels: array de { distance, geometry, material } ou { distance, model }
    const lod = new THREE.LOD();

    lodLevels.forEach((level, i) => {
      const mesh = new THREE.Mesh(level.geometry, level.material);
      lod.addLevel(mesh, level.distance);
    });

    lod.position.copy(object.position);
    lod.rotation.copy(object.rotation);
    lod.scale.copy(object.scale);

    this.objects.set(object, { lod, original: object });

    // Substitui objeto original pelo LOD
    if (object.parent) {
      object.parent.add(lod);
      object.parent.remove(object);
    }
  }

  update() {
    // THREE.LOD atualiza automaticamente baseado na camera
    // Mas podemos forçar update manual se necessário
    this.objects.forEach(({ lod }) => {
      lod.update(this.camera);
    });
  }

  // Factory para criar LODs comuns
  static createTreeLOD(position) {
    const lod = new THREE.LOD();

    // Nível 0: 0-15m (detalhado)
    const detailedTree = new THREE.Group();
    // ... tronco detalhado + folhas detalhadas
    lod.addLevel(detailedTree, 15);

    // Nível 1: 15-50m (simplificado)
    const simpleTree = new THREE.Mesh(
      new THREE.ConeGeometry(2, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0x2d5a1a })
    );
    lod.addLevel(simpleTree, 50);

    // Nível 2: 50m+ (billboard)
    const billboard = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: treeTexture, transparent: true })
    );
    billboard.scale.set(10, 10, 1);
    lod.addLevel(billboard, 100);

    lod.position.copy(position);
    return lod;
  }

  static createBuildingLOD(position, floors = 10) {
    const lod = new THREE.LOD();

    // Detalhado
    const detailed = this._createDetailedBuilding(floors);
    lod.addLevel(detailed, 30);

    // Simplificado
    const simple = this._createSimpleBuilding(floors);
    lod.addLevel(simple, 80);

    // Caixa bounding
    const box = new THREE.Box3().setFromObject(detailed);
    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(...box.getSize(new THREE.Vector3()).toArray()),
      new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true, transparent: true, opacity: 0.1 })
    );
    lod.addLevel(boxMesh, 200);

    lod.position.copy(position);
    return lod;
  }
}
