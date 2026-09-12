# Workflow: End-to-End Spatial Intelligence Pipeline

## Phase 1: Scene Acquisition

```bash
# Option A: Single image → 3D scene (Marble)
worldlabs generate-scene --image input.jpg --output scene.glb

# Option B: Video → 3D scene (if supported)
worldlabs generate-scene --video input.mp4 --output scene.glb

# Option C: Robot onboard sensors → live scene
worldlabs ingest-sensor --robot franka --topic /camera/depth --output live_scene
```

## Phase 2: Spatial Reasoning

```bash
# Query object permanence
worldlabs reason --scene scene.glb --query object_permanence --object cup_1

# Predict physics
worldlabs reason --scene scene.glb --query physics_prediction --object ball_1 --horizon 3.0

# Detect affordances
worldlabs reason --scene scene.glb --query affordances --region all
```

## Phase 3: Robotics Planning

```bash
# Plan door opening
worldlabs plan --scene scene.glb --task open_door --robot franka_panda --output plan.json

# Plan sandwich making
worldlabs plan --scene scene.glb --task make_sandwich --robot ur5 --output plan.json

# Execute on robot (requires robot driver)
worldlabs execute --plan plan.json --robot franka_panda --mode impedance
```

## Phase 4: Verification & Iteration

```bash
# Verify execution
worldlabs verify --scene scene.glb --expected "door_open" --robot franka_panda

# Benchmark
worldlabs benchmark --suite spatial_reasoning --model marble_v1 --trials 100
```

# Error Handling & Fallbacks

| Error Type | Detection | Fallback |
|------------|-----------|----------|
| API quota exceeded | 429 response | Queue request, exponential backoff |
| Scene generation failed | Low quality score | Retry with higher resolution / different seed |
| Physics prediction unstable | NaN / extreme values | Clamp to physical bounds, re-simulate |
| Robot execution failed | Force/torque threshold breach | Emergency stop, replan with larger clearance |
| Sim-to-real gap | Verification fails | Domain randomization, fine-tune on real data |

# Anti-Patterns to Avoid

- **Don't** treat 2D-to-3D as a black box — validate geometry consistency
- **Don't** skip physics simulation before robot execution
- **Don't** assume affordances transfer across object categories without verification
- **Don't** use single-view generation for precision robotics — multi-view or depth required
- **Don't** ignore sim-to-real gap — always verify on hardware before deployment
- **Don't** hardcode robot configs — use parameterized robot descriptions (URDF/MJCF)

# Related Skills

- `blender-motion-state-inspection` — Inspect Blender character rigs/animations (not world models)
- `pytorch-patterns` — General PyTorch training patterns
- `fal-ai-media` — General media generation (2D images/video)
- `pipeline-video-agente` — Video generation pipelines
- `agent-harness-construction` — Building agent action spaces for spatial tasks
- `benchmark-optimization-loop` — Optimizing spatial reasoning benchmarks
- `graph-engineering` — Parallel verification of spatial reasoning candidates
- `engineering-de-grafos` — Orchestrating parallel spatial reasoning tasks

# References

- World Labs: https://www.worldlabs.ai/
- World Labs About: https://www.worldlabs.ai/about
- Fei-Fei Li TIME Essay: https://time.com/7339693/fei-fei-li-ai/
- Marble API Docs: https://docs.worldlabs.ai/ (when available)

# Scripts

See `scripts/` directory for:

- `worldlabs_client.py` — Python client for Marble/LWM API
- `spatial_benchmark.py` — Benchmark runner for spatial tasks
- `robotics_planner.py` — Robotics planning and execution helpers
- `scene_validator.py` — Geometry/physics consistency validation
