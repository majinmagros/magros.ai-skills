# World Labs Marble / LWM API Interface

## Core Capabilities (per World Labs public info)

| Capability | Description | API Endpoint Pattern |
|------------|-------------|----------------------|
| **3D Scene Generation** | Single image → consistent 3D scene with geometry, materials, lighting | `POST /v1/scenes/generate` |
| **Spatial Reasoning** | Object permanence, physics simulation, affordance queries | `POST /v1/spatial/reason` |
| **Camera Trajectory** | Generate novel views, flythroughs, consistent multi-view | `POST /v1/scenes/render` |
| **Robotics Planning** | End-effector trajectories, grasp planning, task planning | `POST /v1/robotics/plan` |
| **Scene Editing** | Add/remove objects, modify materials, relight | `POST /v1/scenes/edit` |

## Authentication & Setup

```bash
# Environment variables required
export WORLD_LABS_API_KEY="your_api_key"
export WORLD_LABS_BASE_URL="https://api.worldlabs.ai"  # or Marble endpoint
```

## Request/Response Schemas

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
