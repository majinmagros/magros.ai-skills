---
name: spatial-intelligence-world-models
description: Interface for World Labs Marble/LWM APIs (3D scene generation, spatial reasoning, robotics integration). Benchmarks spatial tasks (object permanence, physics prediction, affordance detection). Integrates with robotics (robotic arm door opening, sandwich making per Fei-Fei Li/World Labs demos). Follows Agent Skills pattern: frontmatter, clear triggers, 3 layers (direction, blueprints, solutions).
metadata:
  origin: ECC
tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch
---

# Spatial Intelligence / World Models

A skill for working with Large World Models (LWMs), spatial reasoning, 3D scene generation, and robotics integration via World Labs Marble API and related platforms.

## When to Activate

**Use this skill for:**
- Calling World Labs Marble API for 3D scene generation from single images
- Spatial reasoning tasks: object permanence, physics prediction, affordance detection
- Robotics integration: planning robotic arm trajectories, door opening, manipulation tasks
- Benchmarking spatial intelligence capabilities against standardized tasks
- Building applications that need 3D world understanding (AR/VR, robotics, simulation)
- Converting 2D inputs to 3D scenes with consistent geometry and physics

**Do not use for:**
- General 3D modeling/CAD — use Blender, CAD tools directly
- Pure 2D image generation — use `fal-ai-media`, `ai-media-generator`
- Video generation without 3D consistency — use `pipeline-video-agente`
- Blender animation inspection — use `blender-motion-state-inspection`
- General PyTorch training — use `pytorch-patterns`

## World Labs Marble / LWM API Interface

### Core Capabilities (per World Labs public info)

| Capability | Description | API Endpoint Pattern |
|------------|-------------|----------------------|
| **3D Scene Generation** | Single image → consistent 3D scene with geometry, materials, lighting | `POST /v1/scenes/generate` |
| **Spatial Reasoning** | Object permanence, physics simulation, affordance queries | `POST /v1/spatial/reason` |
| **Camera Trajectory** | Generate novel views, flythroughs, consistent multi-view | `POST /v1/scenes/render` |
| **Robotics Planning** | End-effector trajectories, grasp planning, task planning | `POST /v1/robotics/plan` |
| **Scene Editing** | Add/remove objects, modify materials, relight | `POST /v1/scenes/edit` |

### Authentication & Setup

```bash
# Environment variables required
export WORLD_LABS_API_KEY="your_api_key"
export WORLD_LABS_BASE_URL="https://api.worldlabs.ai"  # or Marble endpoint
```

### Request/Response Schemas

**3D Scene Generation:**
```json
{
  "input": {
    "image_url": "https://...",
    "prompt": "optional text guidance"
  },
  "parameters": {
    "resolution": "1024x1024",
    "num_views": 8,
    "physics_enabled": true,
    "material_estimation": true
  }
}
```

**Spatial Reasoning Query:**
```json
{
  "scene_id": "scene_abc123",
  "queries": [
    {"type": "object_permanence", "object_id": "obj_1"},
    {"type": "physics_prediction", "object_id": "obj_2", "time_horizon": 2.0},
    {"type": "affordance_detection", "region": "door_handle"}
  ]
}
```

**Robotics Planning:**
```json
{
  "scene_id": "scene_abc123",
  "task": "open_door",
  "robot_config": {
    "type": "franka_panda",
    "ee_frame": "panda_hand"
  },
  "constraints": {
    "collision_avoidance": true,
    "force_limits": [10, 10, 10, 2, 2, 2]
  }
}
```

## Spatial Reasoning Benchmarks

### Standardized Task Suite

| Benchmark | Description | Metric | Target |
|-----------|-------------|--------|--------|
| **Object Permanence** | Track objects through occlusion | Accuracy % | ≥ 90% |
| **Physics Prediction** | Predict object trajectories under forces | MSE vs ground truth | ≤ 0.05 |
| **Affordance Detection** | Identify graspable regions, pushable surfaces | IoU vs human labels | ≥ 0.75 |
| **Novel View Synthesis** | Render unseen viewpoints | PSNR / LPIPS | ≥ 28 dB / ≤ 0.15 |
| **Multi-step Planning** | Plan 5+ step manipulation tasks | Success rate | ≥ 80% |
| **Sim-to-Real Transfer** | Execute planned trajectory on real robot | Real-world success | ≥ 70% |

### Benchmark Execution Flow

```python
# Pseudocode for benchmark runner
def run_spatial_benchmark(model_api, benchmark_name, num_trials=100):
    results = []
    for trial in range(num_trials):
        task = load_benchmark_task(benchmark_name, trial)
        prediction = model_api.spatial_reason(task.scene, task.query)
        score = evaluate(task.ground_truth, prediction)
        results.append(score)
    return aggregate(results)
```

## Robotics Integration

### Supported Robot Platforms

| Platform | Configuration | Use Case |
|----------|---------------|----------|
| **Franka Emika Panda** | 7-DoF, force-torque sensing | Precision manipulation, door opening |
| **UR5/UR10** | 6-DoF, collaborative | Pick-place, sandwich assembly |
| **Boston Dynamics Spot** | Quadruped, arm attachment | Mobile manipulation |
| **Custom (MuJoCo/Isaac Sim)** | Configurable | Simulation-first development |

### Door Opening Pipeline (Fei-Fei Li / World Labs Demo)

```
1. Scene Capture      → RGB-D / NeRF / Marble scene
2. Door Detection     → Spatial reasoning: hinge, handle, swing direction
3. Grasp Planning     → Affordance detection on handle
4. Trajectory Opt     → Collision-free path with force constraints
5. Execution          → Impedance control on real robot
6. Verification       → Vision confirmation door opened
```

### Sandwich Making Pipeline

```
1. Scene Understanding → Ingredient detection, tool localization
2. Task Decomposition  → Subtask graph: grasp bread → place → grasp knife → spread → ...
3. Motion Planning     → RRT* / MPC for each sub-task
4. Bimanual Coord      → Synchronize two arms (if applicable)
5. Force Control       → Compliant spreading, pressing
6. Quality Check       → Visual + tactile verification
```

## Workflow: End-to-End Spatial Intelligence Pipeline

### Phase 1: Scene Acquisition
```bash
# Option A: Single image → 3D scene (Marble)
worldlabs generate-scene --image input.jpg --output scene.glb

# Option B: Video → 3D scene (if supported)
worldlabs generate-scene --video input.mp4 --output scene.glb

# Option C: Robot onboard sensors → live scene
worldlabs ingest-sensor --robot franka --topic /camera/depth --output live_scene
```

### Phase 2: Spatial Reasoning
```bash
# Query object permanence
worldlabs reason --scene scene.glb --query object_permanence --object cup_1

# Predict physics
worldlabs reason --scene scene.glb --query physics_prediction --object ball_1 --horizon 3.0

# Detect affordances
worldlabs reason --scene scene.glb --query affordances --region all
```

### Phase 3: Robotics Planning
```bash
# Plan door opening
worldlabs plan --scene scene.glb --task open_door --robot franka_panda --output plan.json

# Plan sandwich making
worldlabs plan --scene scene.glb --task make_sandwich --robot ur5 --output plan.json

# Execute on robot (requires robot driver)
worldlabs execute --plan plan.json --robot franka_panda --mode impedance
```

### Phase 4: Verification & Iteration
```bash
# Verify execution
worldlabs verify --scene scene.glb --expected "door_open" --robot franka_panda

# Benchmark
worldlabs benchmark --suite spatial_reasoning --model marble_v1 --trials 100
```

## Error Handling & Fallbacks

| Error Type | Detection | Fallback |
|------------|-----------|----------|
| API quota exceeded | 429 response | Queue request, exponential backoff |
| Scene generation failed | Low quality score | Retry with higher resolution / different seed |
| Physics prediction unstable | NaN / extreme values | Clamp to physical bounds, re-simulate |
| Robot execution failed | Force/torque threshold breach | Emergency stop, replan with larger clearance |
| Sim-to-real gap | Verification fails | Domain randomization, fine-tune on real data |

## Anti-Patterns to Avoid

- **Don't** treat 2D-to-3D as a black box — validate geometry consistency
- **Don't** skip physics simulation before robot execution
- **Don't** assume affordances transfer across object categories without verification
- **Don't** use single-view generation for precision robotics — multi-view or depth required
- **Don't** ignore sim-to-real gap — always verify on hardware before deployment
- **Don't** hardcode robot configs — use parameterized robot descriptions (URDF/MJCF)

## Related Skills

- `blender-motion-state-inspection` — Inspect Blender character rigs/animations (not world models)
- `pytorch-patterns` — General PyTorch training patterns
- `fal-ai-media` — General media generation (2D images/video)
- `pipeline-video-agente` — Video generation pipelines
- `agent-harness-construction` — Building agent action spaces for spatial tasks
- `benchmark-optimization-loop` — Optimizing spatial reasoning benchmarks
- `graph-engineering` — Parallel verification of spatial reasoning candidates
- `engineering-de-grafos` — Orchestrating parallel spatial reasoning tasks

## References

- World Labs: https://www.worldlabs.ai/
- World Labs About: https://www.worldlabs.ai/about
- Fei-Fei Li TIME Essay: https://time.com/7339693/fei-fei-li-ai/
- Marble API Docs: https://docs.worldlabs.ai/ (when available)

## Scripts

See `scripts/` directory for:
- `worldlabs_client.py` — Python client for Marble/LWM API
- `spatial_benchmark.py` — Benchmark runner for spatial tasks
- `robotics_planner.py` — Robotics planning and execution helpers
- `scene_validator.py` — Geometry/physics consistency validation