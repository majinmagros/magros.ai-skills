---
name: threejs-voxel-block-system
description: Use when building Minecraft-style voxel block systems in Three.js — block registry, chunked voxel world, instanced rendering, Rapier physics, serialization. Triggers on "threejs voxel system", "threejs minecraft blocks", "threejs block registry", "threejs instanced mesh blocks", "threejs voxel blocks".
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

# Three.js Voxel Block System — Blocos Estilo Minecraft

Sistema de **blocos voxel estilo Minecraft**: registry de tipos, mundo com chunks, instanced rendering, física opcional, serialização. Código em `scripts/`.

## Quando usar (gatilhos concretos)

- "Sistema de blocos voxel Three.js"
- "Three.js Minecraft blocks"
- "Three.js block registry"
- "Three.js instanced mesh blocks"
- "Blocos estilo Minecraft Three.js"

## Quando NÃO usar

- Composição geral de cena → use `threejs-scene-composer`
- Shaders customizados → use `threejs-shader-effects`
- Deploy → use `threejs-deploy-pipeline`
- Patterns responsivos → use `threejs-responsive-patterns`
- Config constants → use `threejs-config-constants`

## Os 5 Módulos (resumo — código em `scripts/`)

**1. BlockRegistry** (`block-registry.js`) — `registerBlockType(id, {geometry, material, solid/transparent/collidable, tint/emissive, isFluid/isPlant/isTileEntity, states, renderType, drops, harvestTool/Level, onPlace/onBreak/onInteract/onTick, tags})` + filtros (`getByTag`, `getSolidBlocks`, `getTransparentBlocks`) + ~30 defaults: sólidos (grass, stone, dirt, obsidian, bedrock), minérios (coal/iron/gold/diamond/emerald), madeira, plantas, fluidos (water/lava), funcionais (crafting/furnace/chest), portal (frame/block), decorativos (torch/lantern/glowstone).

```javascript
import { BlockRegistry } from './scripts/block-registry.js';
const registry = new BlockRegistry();
registry.registerBlockType('grass_block', { color: 0x4a7c2e, tags: ['natural'] });
```

**2. VoxelWorld** (`voxel-world.js`) — chunks 16×256 (`getOrCreateChunk`, terreno procedural + ores), `setBlock/getBlock/removeBlock` (com callbacks onPlace/onBreak), raycast voxel com face atingida, mesh por chunk via InstancedMesh agrupado por tipo, `getVisibleChunks` + `render` (rebuild dirty, remove distantes), `serialize/deserialize` JSON.

**3. InstancedBlockManager** (`instanced-blocks.js`) — até 100k instâncias por tipo, `addBlock/removeBlock` (swap-remove O(1)), `setBlockBatch`, `clear` (dispose geometry/material).

**4. VoxelPhysics** (`voxel-physics.js`, opcional Rapier.js) — rigid bodies dinâmicos/kinemáticos, cuboid collider 1×1×1 (restitution/friction, `bouncy` tag), `step(delta)`, raycast Rapier. Degrada graciosamente sem Rapier.

**5. VoxelSerializer** (`serialization.js`) — `serialize/deserialize`, `saveToFile/loadFromFile` (download JSON), `compress/decompress` (LZ-string).

## Checklist de Entrega

- [ ] `BlockRegistry` com 50+ tipos padrão
- [ ] `VoxelWorld` com chunks (16x256) + raycast voxel-preciso
- [ ] `InstancedBlockManager` para rendering massivo
- [ ] `VoxelPhysics` com Rapier.js (opcional)
- [ ] `VoxelSerializer` com save/load + compressão
- [ ] Block states + tile entities + InstancedMesh otimizado

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, commands, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```

## Referências Oficiais

- [InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh) · [BoxGeometry](https://threejs.org/docs/#api/en/geometries/BoxGeometry) · [Instancing](https://github.com/mrdoob/three.js/tree/dev/examples/webgl_instancing) · [Voxel](https://github.com/mrdoob/three.js/tree/dev/examples/webgl_voxel)
