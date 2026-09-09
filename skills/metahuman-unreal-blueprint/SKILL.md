---
name: metahuman-unreal-blueprint
description: Use when setting up MetaHuman blueprints in Unreal — character BP with camera and movement, animation BP, IK rig reference, virtual bones, foot locking. Triggers on "metahuman blueprint setup", "metahuman character bp", "metahuman unreal blueprint", "metahuman anim bp", "metahuman camera setup", "metahuman ik rig reference".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=J2LkNI2MzKM (Joy Dev Studio video)
    - https://docs.unrealengine.com/5.7/en-US/metaHumanBlueprint/
    - https://docs.unrealengine.com/5.7/en-US/metaHumanAnimation/
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# MetaHuman Unreal Blueprint — Setup Completo

Blueprint setup: Character BP (Camera, Movement, Mesh), Animation BP, IK Rig reference, Virtual Bones, Foot Locking → MetaHuman playable. Código em `scripts/`.

## Quando usar (gatilhos concretos)

- "metahuman blueprint setup" / "metahuman character blueprint"
- "metahuman unreal blueprint" / "metahuman character bp"
- "metahuman anim bp" / "metahuman camera setup"
- "metahuman movement setup" / "metahuman ik rig reference"

## Quando NÃO usar

- MetaHuman Identity Solve → use `metahuman-identity-pipeline`
- Animation retarget → use `metahuman-animation-retarget`
- MetaHuman to Unreal → use `metahuman-to-unreal-pipeline`

## Pipeline (resumo)

```
SKELETAL MESH -> CHARACTER BP -> ANIM BP -> IK RIG REF -> VIRTUAL BONES -> FOOT LOCKING -> PLAYABLE
```

**Stage 1 — Character BP** (`scripts/character_bp.py`): mesh component + Camera (FOV 90, pawn rotation) + SpringArm (300, lag) + Movement (walk 600, crouch 300, jump 600, orient-to-movement) + Capsule (96×34) → compile + save.

**Stage 2 — AnimBP** (`scripts/anim_bp_setup.py`): factory create + IK Rig ref var + Virtual Bones + Foot Locking + Locomotion SM (Idle/Walk/Run/Crouch/Jump/Fall por Speed/IsInAir/IsCrouching).

**VB + Foot Locking** (`scripts/virtual_bones_footlocking.py`, `foot_locking_ik.py`): vbot, vb_fk_r/l, vb_ik_r/l opcionais; GetSocketTransform → LineTrace → Branch → VectorSubtract → TwoBoneIK (thigh→foot, joint calf).

**Orquestração** (`scripts/complete_blueprint_setup.py`, `metahuman_unreal_blueprint_pipeline.py`): `setup_complete_metahuman(mesh)` — BP → AnimBP → retarget → VB → foot locking → default pawn no GameMode. Retorna character_bp, anim_bp, virtual_bones.

## Checklist de Entrega

- [ ] `character_bp.py`, `anim_bp_setup.py`
- [ ] `virtual_bones_footlocking.py`, `foot_locking_ik.py`
- [ ] `complete_blueprint_setup.py`, `metahuman_unreal_blueprint_pipeline.py`
- [ ] Testes de integração com Unreal Engine 5.7+

## Adapters (Por Plataforma)

```
adapters/
├── opencode/ (hooks, commands, README)
├── cursor/ (hooks, README)
├── codex/ (hooks, README)
└── ...
```

## Referências Oficiais (Validados 2026-08-30)

- [Joy Dev Studio Video](https://www.youtube.com/watch?v=J2LkNI2MzKM) · [MetaHuman Blueprint](https://docs.unrealengine.com/5.7/en-US/metaHumanBlueprint/) · [MetaHuman Animation](https://docs.unrealengine.com/5.7/en-US/metaHumanAnimation/)
