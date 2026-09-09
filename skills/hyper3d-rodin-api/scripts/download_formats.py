# download_formats.py — DOWNLOAD_FORMATS: fbx/glb/usdz/usd/obj (rig, blendshapes, MetaHuman-ready)
# Extraído de SKILL.md (2026-09-09).
DOWNLOAD_FORMATS = {
    "fbx": {
        "description": "Autodesk FBX - Universal",
        "supports_rig": True,
        "supports_blendshapes": True,
        "supports_animation": True,
        "meta_human_ready": True,
        "max_texture": 4096,
        "supports_lods": True
    },
    "glb": {
        "description": "GLTF Binary - Web/Universal",
        "supports_rig": True,
        "supports_blendshapes": True,
        "supports_animation": True,
        "meta_human_ready": True,
        "max_texture": 4096,
        "supports_lods": True
    },
    "usdz": {
        "description": "Universal Scene Description - Apple/AR",
        "supports_rig": True,
        "supports_blendshapes": True,
        "supports_animation": False,
        "meta_human_ready": True,
        "max_texture": 4096,
        "supports_lods": False
    },
    "usd": {
        "description": "Universal Scene Description - Pixar/USD",
        "supports_rig": True,
        "supports_blendshapes": True,
        "meta_human_ready": True,
        "max_texture": 4096
    },
    "obj": {
        "description": "Wavefront OBJ - Universal",
        "supports_rig": False,
        "supports_blendshapes": False,
        "supports_animation": False,
        "meta_human_ready": False,
        "max_texture": 4096
    }
}
