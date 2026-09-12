---
name: metahuman-to-unreal-pipeline
description: Use when exporting Blender FBX through MetaHuman Identity, body setup, animation retarget to UE5 blueprint setup — camera, movement, virtual bones foot locking. Triggers on "metahuman to unreal pipeline", "metahuman export unreal", "metahuman fbx export", "metahuman blender to unreal", "metahuman unreal pipeline".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=J2LkNI2MzKM (Joy Dev Studio video)
    - https://docs.unrealengine.com/5.7/en-US/metaHumanExport/
    - https://docs.unrealengine.com/5.7/en-US/metaHumanFBXExport/
    - https://docs.unrealengine.com/5.7/en-US/metaHumanInUnrealEngine/
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# MetaHuman to Unreal Pipeline - Pipeline MetaHuman Unreal Engine 5

Pipeline completo MetaHuman to Unreal Engine 5: FBX export (Blender) to MetaHuman Identity to Body setup to Animation retarget to UE5 BP setup (camera, movement, virtual bones foot locking).

## Quando usar (gatilhos concretos)

- "MetaHuman to Unreal pipeline"
- "MetaHuman export Unreal"
- "MetaHuman FBX export"
- "MetaHuman Blender to Unreal"
- "MetaHuman Unreal pipeline"
- "MetaHuman FBX export Blender"

## Quando NÃO usar

- MetaHuman Identity Solve use metahuman-identity-pipeline
- Animation retarget use metahuman-animation-retarget
- MetaHuman Blueprint setup use metahuman-unreal-blueprint
- Hyper3D Rodin pipeline use hyper3d-rodin-pipeline

## Pipeline Overview

```
METAHUMAN CREATOR -> FBX EXPORT -> BLENDER PREP -> UNREAL IMPORT -> BP SETUP -> ANIM RETARGET -> VIRTUAL BONES -> FOOT LOCKING -> PLAYABLE CHARACTER
```

## Stage 1: MetaHuman Creator to Export

### Export Settings (MetaHuman Creator)

```python
# metahuman_export.py
class MetaHumanExporter:
    def __init__(self):
        self.export_options = {
            "format": "fbx",
            "quality": "high",
            "include_rig": True,
            "include_blendshapes": True,
            "include_eye_rig": True,
            "include_tongue_rig": True,
            "texture_resolution": 2048,
            "lod_levels": 3,
            "export_morph_targets": True,
            "export_animations": False,
            "embed_textures": True,
            "embed_materials": True
        }
    
    def export_metahuman(self, metahuman_asset, output_path, options=None):
        pass  # Implementation details