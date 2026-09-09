# rodin_api.py — RodinAPI client: auth, credits, per-job cost, pre-execution estimate
# Extraído de SKILL.md (2026-09-09).


class RodinAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.hyper3d.ai/v1"
        self.credits = self._get_credits()

    def _get_credits(self) -> dict:
        """Obtém saldo de créditos atual."""
        response = self._get("/credits")
        return {
            "total": response.get("total_credits", 0),
            "used": response.get("used_credits", 0),
            "remaining": response.get("remaining_credits", 0),
            "reset_date": response.get("reset_date"),
            "plan": response.get("plan", "free")
        }

    def get_credit_usage(self, job_id: str) -> dict:
        """Obtém custo de créditos de um job específico."""
        return self._get(f"/jobs/{job_id}/cost")

    def estimate_cost(self, operation: str, params: dict) -> int:
        """Estima custo em créditos antes de executar."""
        # Estimativas baseadas na documentação
        costs = {
            "chatavatar_text_to_face": 10,
            "chatavatar_image_to_3d": 15,
            "rodin_generate": 20,
            "rodin_high_quality": 30,
            "metahuman_export": 5,
            "studio_export": 5
        }
        return costs.get(operation, 10)
