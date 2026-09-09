# cost_calculator.py — CostCalculator: custo por job (operação × qualidade × resolução × steps) + batch
# Extraído de SKILL.md (2026-09-09).


class CostCalculator:
    @staticmethod
    def calculate_job_cost(job_config: dict) -> int:
        """
        Calcula custo estimado de um job.
        """
        base_cost = 0

        # Base cost by operation
        if job_config["operation"] == "chatavatar_text":
            base_cost = 10
        elif job_config["operation"] == "chatavatar_image":
            base_cost = 15
        elif job_config["operation"] == "rodin_generate":
            base_cost = 20
        elif job_config["operation"] == "metahuman_export":
            base_cost = 5

        # Quality multiplier
        quality_multipliers = {
            "draft": 0.5,
            "standard": 1.0,
            "high": 1.5,
            "hero": 2.0
        }
        quality = job_config.get("quality", "standard")
        base_cost *= quality_multipliers.get(quality, 1.0)

        # Resolution multiplier
        resolution = job_config.get("texture_resolution", 1024)
        if resolution >= 4096:
            base_cost *= 1.5
        elif resolution >= 2048:
            base_cost *= 1.2

        # Steps multiplier
        steps = job_config.get("steps", 30)
        if steps > 40:
            base_cost *= 1.3
        elif steps > 50:
            base_cost *= 1.5

        return int(base_cost)

    @staticmethod
    def estimate_batch(jobs: list) -> dict:
        total = sum(CostCalculator.calculate_job_cost(j) for j in jobs)
        return {
            "total_estimated_cost": total,
            "per_job": [CostCalculator.calculate_job_cost(j) for j in jobs],
            "recommendation": "Consider batching similar jobs" if len(jobs) > 5 else "OK"
        }
