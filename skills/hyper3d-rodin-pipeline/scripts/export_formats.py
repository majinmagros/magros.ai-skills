# export_formats.py — Export formats (FBX/GLB/USDZ/OBJ/USD) + MetaHuman options
# Extraído de SKILL.md (2026-09-09) para progressive disclosure.
EXPORT_FORMATS = {
    "fbx": {
        "description": "Autodesk FBX - Universal",
        "supports_rig": True,
        "supports_animation": True,
        "meta_human_ready": True,
        "max_texture": 4096
    },
    "glb": {
        "description": "GLTF Binary - Web/Universal",
        "supports_rig": True,
        "supports_animation": True,
        "meta_human_ready": True,
        "max_texture": 4096
    },
    "usdz": {
        "description": "Universal Scene Description - Apple/AR",
        "supports_rig": False,
        "supports_animation": False,
        "meta_human_ready": False,
        "max_texture": 2048
    },
    "obj": {
        "description": "Wavefront OBJ - Universal",
        "supports_rig": False,
        "supports_animation": False,
        "meta_human_ready": False,
        "max_texture": 4096
    },
    "usd": {
        "description": "Universal Scene Description - Pixar/USD",
        "supports_rig": True,
        "supports_animation": True,
        "meta_human_ready": True,
        "max_texture": 4096
    }
}

METAHUMAN_EXPORT_OPTIONS = {
    "include_rig": True,
    "include_blendshapes": True,  # 51+ blendshapes
    "include_eye_rig": True,
    "include_tongue_rig": True,
    "texture_resolution": [512, 1024, 2048, 4096],
    "lod_levels": [0, 1, 2, 3],
    "naming_convention": "metahuman_standard"
}
