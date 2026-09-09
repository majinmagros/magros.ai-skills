# free_tier.py — FREE_TIER_LIMITS + FreeTierOptimizer (clamp resolução/steps/modelo)
# Extraído de SKILL.md (2026-09-09).
FREE_TIER_LIMITS = {
    "daily_generations": 10,
    "monthly_credits": 100,
    "max_texture_resolution": 1024,
    "max_lod_levels": 1,
    "watermark": True
}


class FreeTierOptimizer:
    @staticmethod
    def optimize_for_free_tier(params: dict) -> dict:
        """Otimiza parâmetros para free tier."""
        optimized = params.copy()

        # Limita resolução
        if params.get("texture_resolution", 1024) > 1024:
            optimized["texture_resolution"] = 1024

        # Limita steps
        if params.get("steps", 30) > 30:
            optimized["steps"] = 30

        # Força modelo mais barato
        if "model" in params:
            if params["model"] in ["dreamface_v2", "rodin_v2", "hero"]:
                optimized["model"] = "dreamface_v1"  # Mais barato

        return optimized

    @staticmethod
    def can_afford(api: 'RodinAPI', estimated_cost: int) -> bool:
        credits = api._get_credits()
        return credits["remaining"] >= estimated_cost
