# Robotics Integration

## Supported Robot Platforms

| Platform | Configuration | Use Case |
|----------|---------------|----------|
| **Franka Emika Panda** | 7-DoF, force-torque sensing | Precision manipulation, door opening |
| **UR5/UR10** | 6-DoF, collaborative | Pick-place, sandwich assembly |
| **Boston Dynamics Spot** | Quadruped, arm attachment | Mobile manipulation |
| **Custom (MuJoCo/Isaac Sim)** | Configurable | Simulation-first development |

## Door Opening Pipeline (Fei-Fei Li / World Labs Demo)

```
1. Scene Capture      → RGB-D / NeRF / Marble scene
2. Door Detection     → Spatial reasoning: hinge, handle, swing direction
3. Grasp Planning     → Affordance detection on handle
4. Trajectory Opt     → Collision-free path with force constraints
5. Execution          → Impedance control on real robot
6. Verification       → Vision confirmation door opened
```

## Sandwich Making Pipeline

```
1. Scene Understanding → Ingredient detection, tool localization
2. Task Decomposition  → Subtask graph: grasp bread → place → grasp knife → spread → ...
3. Motion Planning     → RRT* / MPC for each sub-task
4. Bimanual Coord      → Synchronize two arms (if applicable)
5. Force Control       → Compliant spreading, pressing
6. Quality Check       → Visual + tactile verification
```
