# prompt_engineering.py — Prompt engineering com weights/seeds
# Extraído de SKILL.md (2026-09-09). Baseado no vídeo Joy Dev Studio.
import random


class PromptEngineer:
    """Prompt engineering para Hyper3D Rodin/ChatAvatar."""

    # Weights padrão para características faciais
    FACE_WEIGHTS = {
        "face_shape": 1.0,
        "eye_shape": 1.0,
        "nose_shape": 1.0,
        "mouth_shape": 1.0,
        "skin_texture": 0.8,
        "hair_style": 0.7,
        "facial_hair": 0.5,
        "makeup": 0.3,
        "age": 0.6,
        "ethnicity": 0.7,
        "expression": 0.5
    }

    # Seeds recomendadas por tipo
    SEED_PRESETS = {
        "consistent": 42,           # Reprodutível
        "variation": None,          # Aleatório
        "diverse": [42, 123, 456, 789, 999],  # Para batch
        "experimental": 999999      # Exploratório
    }

    @classmethod
    def build_prompt(cls, description: str, weights: dict = None, style: str = "realistic") -> str:
        """
        Constrói prompt otimizado para ChatAvatar.

        Args:
            description: Descrição base do rosto
            weights: Pesos personalizados (merge com FACE_WEIGHTS)
            style: "realistic", "stylized", "cartoon", "anime"
        """
        weights = {**cls.FACE_WEIGHTS, **(weights or {})}

        weight_str = ", ".join([f"{k}:{v}" for k, v in weights.items() if v > 0])

        style_prompts = {
            "realistic": "photorealistic, 8k, highly detailed, raw photo",
            "stylized": "stylized, artistic, exaggerated features",
            "cartoon": "cartoon style, cel shaded, exaggerated proportions",
            "anime": "anime style, manga, large eyes, stylized"
        }

        prompt = f"{description}, {style_prompts.get(style, '')}, {weight_str}"
        return prompt

    @classmethod
    def generate_batch_prompts(cls, base_description: str, count: int = 5, variation: float = 0.2) -> list:
        """Gera lote de prompts com variação controlada."""
        prompts = []
        base_weights = cls.FACE_WEIGHTS.copy()

        for i in range(count):
            # Varia pesos ligeiramente
            varied_weights = {}
            for k, v in base_weights.items():
                varied_weights[k] = max(0, min(1, v + random.uniform(-variation, variation)))

            prompts.append(cls.build_prompt(base_description, varied_weights))

        return prompts
