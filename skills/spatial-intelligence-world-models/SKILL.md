---
name: spatial-intelligence-world-models
description: "Use when interface for World Labs Marble/LWM APIs (3D scene generation, spatial reasoning, robotics integration). Benchmarks spatial tasks (object permanence, physics prediction, affordance detection). Integrates with robotics. Triggers on \"spatial-intelligence-world-models\", \"spatial intelligence world models\", \"models\"."
metadata:
  origin: ECC
---

# Spatial Intelligence / World Models

World Labs Marble/LWM: image→3D scenes, spatial reasoning, robotics planning. Detalhes em `references/`.

## When to Activate

- Generating 3D scenes from single images (Marble API)
- Spatial reasoning: permanence, physics prediction, affordances
- Planning robot trajectories (grasp, door opening, manipulation)
- Benchmarking spatial capabilities against standard tasks
- Apps needing 3D world understanding (AR/VR, robotics, simulation)
- Skip: CAD modeling, pure 2D gen → `fal-ai-media`, Blender inspection

## Core Principles

1. **Validate geometry** — never treat 2D→3D as a black box
2. **Simulate before executing** — physics check prior to robot motion
3. **Multi-view for precision** — single view is not enough for robotics
4. **Mind sim-to-real** — verify on hardware before deploying
5. **Parameterize robots** — URDF/MJCF, never hardcoded configs

## Example

```bash
export WORLD_LABS_API_KEY="your_api_key"
worldlabs generate-scene --image input.jpg --output scene.glb
worldlabs reason --scene scene.glb --query affordances --region all
```

## References

- `references/marble-api.md` — capabilities, auth, request/response schemas
- `references/benchmarks.md` — task suite, targets, runner flow
- `references/robotics.md` — platforms, door/sandwich pipelines
- `references/pipeline.md` — end-to-end phases, errors, anti-patterns, scripts

## Checklist

- [ ] API key configured; scene quality validated
- [ ] Affordances verified per object category
- [ ] Force/torque limits + collision avoidance in plan
- [ ] Benchmark targets met before hardware trials
- [ ] Sim-to-real verified; emergency stop path tested
