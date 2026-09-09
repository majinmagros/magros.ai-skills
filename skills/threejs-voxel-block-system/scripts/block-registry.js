// block-registry.js — BlockRegistry: tipos, estados, texturas, defaults Minecraft-style
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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
      renderType: 'fluid',
      isFluid: true,
      roughness: 0.1,
      metalness: 0.0,
      ior: 1.33,
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
