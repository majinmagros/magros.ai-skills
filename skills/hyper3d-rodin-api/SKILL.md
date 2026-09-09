---
name: hyper3d-rodin-api
description: Use when working with the Hyper3D Rodin API — credits system, model versions, download formats, MetaHuman export, credit optimization. Triggers on "hyper3d rodin api", "rodin api credits", "rodin model versions", "rodin download formats", "rodin credit optimization", "hyper3d rodin api key".
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

# Hyper3D Rodin API — Credits, Models & Export

API/credits system, model versions, download formats, MetaHuman/Studio export, credit optimization. Código em `scripts/`.

## Quando usar (gatilhos concretos)

- "hyper3d rodin api" / "hyper3d rodin api key"
- "rodin api credits" / "rodin credit optimization"
- "rodin model versions" / "rodin download formats"

## Quando NÃO usar

- ChatAvatar pipeline → use `hyper3d-rodin-pipeline`
- MetaHuman Identity → use `metahuman-identity-pipeline`
- MetaHuman to Unreal → use `metahuman-to-unreal-pipeline`
- Full pipeline → use `hyper3d-rodin-pipeline`

## Módulos (resumo — código em `scripts/`)

- **`rodin_api.py`**: `RodinAPI` — saldo (`total/used/remaining/reset/plan`), custo por job, `estimate_cost` pré-execução (chatavatar 10-15, rodin 20-30, exports 5)
- **`model_versions.py`**: ChatAvatar (dreamface_v1/v2, cartoon, hero) + Rodin (v1/v2) — descrição, release, best_for, params, custo por geração
- **`download_formats.py`**: fbx/glb (rig+blendshapes+anim+MetaHuman+LOD) · usdz (Apple/AR, sem anim) · usd · obj (sem rig) — todos até 4K
- **`credit_optimizer.py`**: estratégias prototyping (10cr) / production (40cr) / hero (45cr) + `batch_optimize` (agrupa, reusa seeds) + `track_usage`
- **`credit_dashboard.py`**: saldo, breakdown por operação, projeção de esgotamento (uso/dia), alertas CRITICAL <10% / WARNING <25%
- **`free_tier.py`**: limites (10/dia, 100/mês, 1024px, 1 LOD, watermark) + clamp automático (resolução, steps, modelo barato) + `can_afford`
- **`cost_calculator.py`**: custo = base(operação) × qualidade (draft 0.5 → hero 2.0) × resolução (4K ×1.5, 2K ×1.2) × steps (>40 ×1.3) + `estimate_batch`

```python
from scripts.cost_calculator import CostCalculator
from scripts.free_tier import FreeTierOptimizer
cost = CostCalculator.calculate_job_cost({"operation": "rodin_generate", "quality": "high", "texture_resolution": 2048, "steps": 40})
if FreeTierOptimizer.can_afford(api, cost):
    ...  # executa
```

## Checklist de Entrega

- [ ] `rodin_api.py` (auth + créditos)
- [ ] `model_versions.py` + `download_formats.py`
- [ ] `credit_optimizer.py` + `credit_dashboard.py`
- [ ] `free_tier.py` + `cost_calculator.py`
- [ ] Testes de integração

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, commands, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```

## Referências Oficiais (Validados 2026-08-30)

- [Hyper3D Rodin](https://www.hyper3d.ai/rodin) · [ChatAvatar](https://www.hyper3d.ai/chatavatar) · [Rodin GitHub](https://github.com/hyper3d-ai/rodin)
