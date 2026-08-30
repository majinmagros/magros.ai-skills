---
name: hyper3d-rodin-api
description: |
  API/credits system, model versions (DreamFace v1/v2, cartoon, hero), download formats (FBX/GLB/USDZ), MetaHuman/Studio export, credit optimization strategies. Baseado no vídeo Joy Dev Studio "3D Face Modeling is a THING OF THE PAST!".
  Use quando: "hyper3d rodin api", "rodin api credits", "rodin model versions", "rodin download formats", "rodin api credits", "rodin credit optimization", "hyper3d rodin api key".
  Não use para: ChatAvatar pipeline (use hyper3d-rodin-pipeline), MetaHuman Identity (use metahuman-identity-pipeline), MetaHuman to Unreal (use metahuman-to-unreal-pipeline).
  Outcome: API/credits system, model versions (DreamFace v1/v2, cartoon, hero), download formats (FBX/GLB/USDZ), MetaHuman/Studio export, credit optimization strategies.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=J2LkNI2MzKM (Joy Dev Studio video)
    - https://www.hyper3d.ai/rodin
    - https://www.hyper3d.ai/chatavatar
    - https://github.com/hyper3d-ai/rodin
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Hyper3D Rodin API — API/Credits System & Model Management

API/credits system, model versions (DreamFace v1/v2, cartoon, hero), download formats (FBX/GLB/USDZ), MetaHuman/Studio export, credit optimization strategies.

## Quando usar (gatilhos concretos)

- "hyper3d rodin api"
- "rodin api credits"
- "rodin model versions"
- "rodin download formats"
- "rodin api credits"
- "rodin credit optimization"
- "hyper3d rodin api key"

## Quando NÃO usar

- ChatAvatar pipeline → use `hyper3d-rodin-pipeline`
- MetaHuman Identity → use `metahuman-identity-pipeline`
- MetaHuman to Unreal → use `metahuman-to-unreal-pipeline`
- Full pipeline → use `hyper3d-rodin-pipeline`

## API Overview

### Authentication & Credits

```python
# rodin_api.py
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
```

### Model Versions

```python
# model_versions.py
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
```

### Download Formats

```python
# download_formats.py
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
```

### Credit Optimization Strategies

```python
# credit_optimizer.py
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
```

### Credit Monitoring Dashboard

```python
# credit_dashboard.py
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
```

### Free Tier Optimization

```python
# free_tier.py
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
```

---

## Credit Cost Calculator

```python
# cost_calculator.py
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
```

---

## Referências Oficiais (Validados 2026-08-30)

- [Hyper3D Rodin](https://www.hyper3d.ai/rodin)
- [Hyper3D ChatAvatar](https://www.hyper3d.ai/chatavatar)
- [Rodin GitHub](https://github.com/hyper3d-ai/rodin)

---

## Checklist de Entrega

- [ ] `rodin_api.py` — API client com autenticação e créditos
- [ ] `model_versions.py` — Model versions (DreamFace v1/v2, cartoon, hero, Rodin v1/v2)
- [ ] `download_formats.py` — Download formats (FBX/GLB/USDZ/OBJ)
- [ ] `credit_optimizer.py` — Credit optimization strategies
- [ ] `credit_dashboard.py` — Credit monitoring dashboard
- [ ] `free_tier.py` — Free tier optimization
- [ ] `cost_calculator.py` — Cost calculator
- [ ] Testes de integração

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   ├── commands/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```