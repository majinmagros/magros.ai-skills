---
name: mcp-hardware-arduino
description: "Use when bringing up low-cost robot hardware through MCP with iterative echo-to-autonomy steps, depth-from-mono, topological mapping, and hybrid line-plus-VLM driving. Triggers on \"esp32 cam\", \"mcp hardware\", \"arduino bring-up\", \"pca9685\", \"ratslam\", \"line follower vlm\". Non-triggers: pure software MCP server with no hardware (use mcp-server-patterns), buying local AI rigs (use local-ai-hardware). Outcome: a versioned bring-up log plus a hybrid autonomy loop running on the bench."
metadata:
  origin: ECC
---

# MCP Hardware Arduino

Bring up cheap robot hardware through MCP in small verified steps:
echo -> motors -> camera -> web, then depth, then mapping, then hybrid
autonomy. Low priority but real: one hobby demo proves the loop, heavy
scaffolding is expected, so keep scope to one cart and one room.

## When To Activate

- The user says ESP32-CAM, PCA9685, SG90, MX12E-class driver, or MCP +
  hardware robot.
- The task is iterative bring-up (motors, servo tilt, camera, web UI).
- The task needs depth-from-mono, topological mapping, or hybrid
  line-follower + VLM driving.
- A previous hardware run jumped to autonomy before actuators were proven.

## Workflow

1. Echo first: prove board link and serial echo before wiring anything
   that moves. Log firmware, pins, and power source per step.
2. Motors: drive each channel forward and stop through the PWM driver,
   then document direction limits (for example forward-only if the
   driver has no reverse). Never tune autonomy on unproven motors.
3. Camera: bring up the ESP32-CAM stream, then tilt servo sweep, then a
   minimal web page showing stream plus manual jog buttons.
4. Depth: add depth-from-mono on a CUDA-capable bench machine to
   disambiguate near vs far. Record fallback behavior when depth fails.
5. Map: build a topological map in RatSLAM style (object landmarks such
   as fridge, bike, grill; count corridor crossings). Version each map
   correction; never overwrite the last working map.
6. Hybrid autonomy: follow the line (floor seam) where it exists, drive
   "by eye" via VLM photos where it does not. Deterministic controller
   owns the wheels; VLM only issues short guarded intents.
7. Harden: cap speed, add kill switch, bound runs to the mapped room, and
   keep every run log (map version, depth mode, interventions).

## Anti-Patterns

- Full autonomy before echo, motors, and camera each pass alone.
- Tuning on an unversioned map that gets overwritten per run.
- Letting the VLM drive wheels directly with no deterministic guard.
- Ignoring power limits (brownouts look like software bugs).
- Bench-only success claimed as room-level autonomy.

## Relations

- `mcp-server-patterns`: tool, resource, and transport shape for the MCP
  layer in front of the hardware.
- `local-ai-hardware`: bench GPU sizing for the depth-from-mono step.
- `spatial-intelligence-world-models`: high-end spatial reasoning behind
  the low-cost landmark mapping used here.

## Sources

- No external hardware URL confirmed at write time - verify part
  datasheets (ESP32-CAM, PWM driver, servo) against the parts on your
  bench before wiring; do not trust video pinouts blindly.
- Bring-up order, driver mix, depth-from-mono on CUDA, RatSLAM-style