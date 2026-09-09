# model_config.py — Model configs (DreamFace v1/v2, Cartoon, Hero, Rodin v1/v2)
# Extraído de SKILL.md (2026-09-09) para progressive disclosure.
MODEL_CONFIGS = {
    "dreamface_v1": {
        "description": "Versão original, boa para rostos gerais",
        "best_for": ["general", "quick_iteration"],
        "params": {"guidance_scale": 7.5, "steps": 30}
    },
    "dreamface_v2": {
        "description": "Versão melhorada, mais detalhes",
        "best_for": ["high_quality", "production"],
        "params": {"guidance_scale": 7.5, "steps": 40}
    },
    "cartoon": {
        "description": "Estilo cartoon/exagerado",
        "best_for": ["stylized", "games", "animation"],
        "params": {"guidance_scale": 6.0, "steps": 30}
    },
    "hero": {
        "description": "Estilo herói/realista aprimorado",
        "best_for": ["hero_characters", "cinematic"],
        "params": {"guidance_scale": 8.0, "steps": 50}
    },
    "rodin_v1": {
        "description": "Rodin original",
        "best_for": ["general_3d", "fast"],
        "params": {"guidance_scale": 7.5, "steps": 30}
    },
    "rodin_v2": {
        "description": "Rodin melhorado",
        "best_for": ["high_quality", "production"],
        "params": {"guidance_scale": 7.5, "steps": 40}
    }
}

# Parâmetros de geração recomendados
GENERATION_PRESETS = {
    "face_high_quality": {
        "model": "dreamface_v2",
        "guidance_scale": 7.5,
        "steps": 40,
        "texture_resolution": 2048
    },
    "face_fast": {
        "model": "dreamface_v1",
        "guidance_scale": 6.0,
        "steps": 20,
        "texture_resolution": 1024
    },
    "rodin_high_quality": {
        "model": "rodin_v2",
        "guidance_scale": 7.5,
        "steps": 50,
        "texture_resolution": 2048
    },
    "rodin_fast": {
        "model": "rodin_v1",
        "guidance_scale": 6.0,
        "steps": 25,
        "texture_resolution": 1024
    }
}
