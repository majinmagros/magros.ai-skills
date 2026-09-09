# credit_dashboard.py — CreditDashboard: saldo, breakdown, projeção de esgotamento, alertas
# Extraído de SKILL.md (2026-09-09).


class CreditDashboard:
    def __init__(self, api: 'RodinAPI'):
        self.api = api

    def get_dashboard(self) -> dict:
        credits = self.api._get_credits()

        return {
            "total_credits": credits["total"],
            "used_credits": credits["used"],
            "remaining_credits": credits["remaining"],
            "plan": credits["plan"],
            "reset_date": credits["reset_date"],
            "usage_by_operation": self._get_usage_breakdown(),
            "projected_depletion": self._project_depletion(credits),
            "alerts": self._generate_alerts(credits)
        }

    def _get_usage_breakdown(self) -> dict:
        # Breakdown por tipo de operação
        return {
            "chatavatar": {"count": 45, "credits": 450},
            "rodin_generate": {"count": 12, "credits": 300},
            "metahuman_export": {"count": 8, "credits": 40}
        }

    def _project_depletion(self, credits: dict) -> str:
        daily_usage = credits["used"] / 30  # estimativa
        if daily_usage > 0:
            days_left = credits["remaining"] / daily_usage
            return f"~{int(days_left)} days"
        return "Unknown"

    def _generate_alerts(self, credits: dict) -> list:
        alerts = []
        if credits["remaining"] < credits["total"] * 0.1:
            alerts.append({"level": "CRITICAL", "message": "Less than 10% credits remaining"})
        elif credits["remaining"] < credits["total"] * 0.25:
            alerts.append({"level": "WARNING", "message": "Less than 25% credits remaining"})
        return alerts
