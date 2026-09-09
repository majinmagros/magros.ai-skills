# model_versions.py — MODEL_VERSIONS: ChatAvatar (dreamface_v1/v2, cartoon, hero) + Rodin (v1/v2)
# Extraído de SKILL.md (2026-09-09).
MODEL_VERSIONS = {
    "chatavatar": {
        "dreamface_v1": {
            "description": "Versão original, boa para rostos gerais",
            "release_date": "2024-01",
            "best_for": ["general", "quick_iteration", "prototyping"],
            "params": {"guidance_scale": 7.5, "steps": 30},
            "cost_per_generation": 10
        },
        "dreamface_v2": {
            "description": "Versão melhorada, mais detalhes e realismo",
            "release_date": "2024-06",
            "best_for": ["high_quality", "production", "close_up"],
            "params": {"guidance_scale": 7.5, "steps": 40},
            "cost_per_generation": 15
        },
        "cartoon": {
            "description": "Estilo cartoon/exagerado",
            "best_for": ["stylized", "games", "animation"],
            "params": {"guidance_scale": 6.0, "steps": 30},
            "cost_per_generation": 10
        },
        "hero": {
            "description": "Estilo herói/realista aprimorado",
            "best_for": ["hero_characters", "cinematic", "close_up"],
            "params": {"guidance_scale": 8.0, "steps": 50},
            "cost_per_generation": 20
        }
    },
    "rodin": {
        "rodin_v1": {
            "description": "Rodin original",
            "release_date": "2024-03",
            "best_for": ["general_3d", "fast", "prototyping"],
            "params": {"guidance_scale": 7.5, "steps": 30},
            "cost_per_generation": 15
        },
        "rodin_v2": {
            "description": "Rodin melhorado, mais detalhes",
            "release_date": "2024-08",
            "best_for": ["high_quality", "production", "hero_assets"],
            "params": {"guidance_scale": 7.5, "steps": 40},
            "cost_per_generation": 25
        }
    }
}
