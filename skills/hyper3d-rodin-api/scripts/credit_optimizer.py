# credit_optimizer.py — CreditOptimizer: estratégias por qualidade + batch + tracking por job
# Extraído de SKILL.md (2026-09-09).


class CreditOptimizer:
    def __init__(self, api: 'RodinAPI'):
        self.api = api

    def optimize_generation(self, task_type: str, quality_needed: str) -> dict:
        """
        Sugere configuração ótima para economizar créditos.
        """
        strategies = {
            "prototyping": {
                "model": "dreamface_v1",
                "rodin_model": "rodin_v1",
                "steps": 20,
                "texture_resolution": 512,
                "estimated_cost": 10,
                "quality": "draft"
            },
            "production": {
                "model": "dreamface_v2",
                "rodin_model": "rodin_v2",
                "steps": 40,
                "texture_resolution": 2048,
                "estimated_cost": 40,
                "quality": "production"
            },
            "hero_character": {
                "model": "hero",
                "rodin_model": "rodin_v2",
                "steps": 50,
                "texture_resolution": 4096,
                "estimated_cost": 45,
                "quality": "hero"
            }
        }
        return strategies.get(quality_needed, strategies["production"])

    def batch_optimize(self, jobs: list) -> dict:
        """Otimiza lote de jobs para economizar créditos."""
        # Agrupa jobs similares
        # Reutiliza seeds quando possível
        # Evita regenerações desnecessárias
        pass

    def track_usage(self, job_id: str) -> dict:
        """Rastreia uso de créditos por job."""
        return self.api.get_credit_usage(job_id)
