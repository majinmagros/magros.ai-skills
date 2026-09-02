---
name: metahuman-to-unreal-pipeline
description: >-
  Export FBX (Blender) → MetaHuman Identity → Body setup → Animation retarget → UE5 BP setup (camera, movement, virtual bones foot locking). Baseado no vídeo Joy Dev Studio "3D Face Modeling is a THING OF THE PAST!".
  Use quando: "metahuman to unreal pipeline", "metahuman export unreal", "metahuman fbx export", "metahuman blender to unreal", "metahuman unreal pipeline", "metahuman fbx export blender".
  Não use para: MetaHuman Identity Solve (use metahuman-identity-pipeline), Animation retarget (use metahuman-animation-retarget), MetaHuman Blueprint setup (use metahuman-unreal-blueprint).
  Outcome: Pipeline completo MetaHuman to Unreal Engine 5: FBX export (Blender) to MetaHuman Identity to Body setup to Animation retarget to UE5 BP setup (camera, movement, virtual bones foot locking).
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
```

## Stage 2: Blender Preparation

### Blender Preparation Script

```python
# blender_prep.py
class BlenderMetaHumanPrep:
    def prepare_metahuman_fbx(self, fbx_path, output_path):
        pass  # Implementation details
    
    def _fix_bone_names(self):
        pass  # Rename bones to UE5 MetaHuman convention
    
    def _fix_materials_for_ue5(self):
        pass  # Fix materials for UE5 compatibility
```

## Stage 3: Unreal Engine Import & Setup

### Unreal Import Script

```python
# unreal_import.py
class UnrealMetaHumanImporter:
    def import_metahuman_fbx(self, fbx_path, destination_path):
        pass  # Implementation details
    
    def setup_metahuman_materials(self, skeletal_mesh_asset):
        pass  # Configure materials for UE5
```

### Blueprint Setup Automation

```python
# blueprint_setup.py
class MetaHumanBlueprintSetup:
    def create_metahuman_blueprint(self, skeletal_mesh_asset, bp_name):
        pass  # Create Character BP with camera, movement, etc.
    
    def setup_animation_blueprint(self, skeletal_mesh_asset, bp_name):
        pass  # Setup AnimBP with retargeting
```

## Stage 4: Animation Retargeting & Foot Locking

### Animation Retargeting (MetaHuman)

```python
# animation_retarget.py
class MetaHumanAnimationRetarget:
    def setup_retargeter(self, source_skeleton, target_skeleton):
        pass  # Setup IK Rig and Retargeter
    
    def retarget_animation(self, source_animation, target_skeleton):
        pass  # Retarget animation
```

### Virtual Bones for Foot Locking

```python
# virtual_bones.py
class VirtualBoneSetup:
    def setup_virtual_bones(self, anim_bp):
        pass  # Add virtual bones for foot locking
    
    def setup_foot_locking_ik(self, anim_bp):
        pass  # Foot locking IK setup
```

## Stage 5: Complete Blueprint Setup

### Complete MetaHuman Setup Pipeline

```python
# metahuman_pipeline.py
class CompleteMetaHumanSetup:
    def full_pipeline(self, metahuman_asset, project_path):
        pass  # Complete orchestrated pipeline
```

## Referências Oficiais (Validados 2026-08-30)

- [Joy Dev Studio Video](https://www.youtube.com/watch?v=J2LkNI2MzKM)
- [MetaHuman Export Documentation](https://docs.unrealengine.com/5.7/en-US/metaHumanExport/)
- [MetaHuman FBX Export](https://docs.unrealengine.com/5.7/en-US/metaHumanFBXExport/)
- [MetaHuman in Unreal Engine](https://docs.unrealengine.com/5.7/en-US/metaHumanInUnrealEngine/)

## Checklist de Entrega

- [ ] `metahuman_export.py` - Export MetaHuman Creator (FBX/GLB/USDZ)
- [ ] `blender_prep.py` - Blender prep (bone rename, material fix, cleanup)
- [ ] `unreal_import.py` - Unreal import (FBX, materials, skeletal mesh)
- [ ] `blueprint_setup.py` - Blueprint setup (Character BP, Camera, Movement)
- [ ] `animation_retarget.py` - Animation retarget (IK Rig, Retargeter, chains)
- [ ] `virtual_bones.py` - Virtual bones (foot locking, MetaHuman convention)
- [ ] `metahuman_pipeline.py` - Pipeline orquestrado completo
- [ ] Testes de integração com Unreal Engine 5.7+
- [ ] Documentação de uso

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