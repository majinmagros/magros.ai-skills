// serialization.js — VoxelSerializer: save/load JSON, arquivo, compressão LZ-string
// Extraído de SKILL.md (2026-09-09) para progressive disclosure.
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
