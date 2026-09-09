---
name: metahuman-animation-retarget
description: Use when retargeting ABP mannequin animations to MetaHuman — blueprint copy, IK rigs, retargeter, virtual bones, foot locking IK. Triggers on "metahuman animation retarget", "metahuman abp retarget", "metahuman foot locking", "metahuman virtual bones", "metahuman vbot", "metahuman vbik".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=J2LkNI2MzKM (Joy Dev Studio video)
    - https://docs.unrealengine.com/5.7/en-US/animationRetargeting/
    - https://docs.unrealengine.com/5.7/en-US/ikRig/
    - https://docs.unrealengine.com/5.7/en-US/metaHumanAnimation/
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# MetaHuman Animation Retarget — ABP Mannequin → MetaHuman

Retarget **ABP mannequin → MetaHuman**: blueprint copy, IK rigs, retargeter, virtual bones (vbot, vb_fk_r/l, vb_ik_r/l), foot locking IK. Código em `scripts/`.

## Quando usar (gatilhos concretos)

- "metahuman animation retarget" / "metahuman animation retargeting"
- "metahuman abp retarget" / "metahuman animation blueprint retarget"
- "metahuman foot locking" / "metahuman virtual bones"
- "metahuman vbot" / "metahuman vbik"

## Quando NÃO usar

- MetaHuman Identity Solve → use `metahuman-identity-pipeline`
- MetaHuman to Unreal → use `metahuman-to-unreal-pipeline`
- MetaHuman Blueprint setup → use `metahuman-unreal-blueprint`

## Pipeline (resumo)

```
ABP MANNEQUIN -> COPY ANIM BP -> RETARGETER -> VIRTUAL BONES -> FOOT LOCKING -> METAHUMAN ANIM BP
```

**Stage 1 — Copy AnimBP** (`scripts/copy_anim_bp.py`): duplica `AnimBP_Mannquin` → `/Game/Blueprints/MetaHumans/MM_AnimBP`, redireciona skeleton, recompila.

**Stage 2 — IK Rig** (`scripts/ik_rig_setup.py`): 26 bones + chains (arm_l/r com pole, leg_l/r com pole, spine).

**Stage 3 — Retargeter** (`scripts/retargeter_setup.py`): source/target IK rigs + root bone + bone mapping + `retarget_animation()`.

**Virtual Bones** (`scripts/virtual_bones.py`): vbot (root→root), vb_fk_r/l (vbot→foot), vb_ik_r/l opcionais.

**Foot Locking** (`scripts/foot_locking.py` + `anim_bp_nodes.py`): GetSocket (vb_fk) → LineTrace down → VectorSubtract offset → SetBoneLocation / TwoBoneIK (thigh→foot, joint calf).

**Setup completo** (`scripts/complete_anim_bp.py`): VB + foot locking + IK Rig ref + locomotion SM (Idle/Walk/Run/Crouch/Jump/Fall).

**Pipeline** (`scripts/retarget_pipeline.py`): `retarget_mannequin_to_metahuman(skeleton)` — copy → IK rigs → retargeter → retarget anims → AnimBP setup. Retorna anim_bp, retargeted_animations, virtual_bones.

## Checklist de Entrega

- [ ] `copy_anim_bp.py`, `ik_rig_setup.py`, `retargeter_setup.py`
- [ ] `virtual_bones.py` (vbot, vb_fk_r/l, vb_ik_r/l), `foot_locking.py`
- [ ] `anim_bp_nodes.py`, `complete_anim_bp.py`, `retarget_pipeline.py`
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

- [Joy Dev Studio Video](https://www.youtube.com/watch?v=J2LkNI2MzKM) · [Animation Retargeting](https://docs.unrealengine.com/5.7/en-US/animationRetargeting/) · [IK Rig](https://docs.unrealengine.com/5.7/en-US/ikRig/) · [MetaHuman Animation](https://docs.unrealengine.com/5.7/en-US/metaHumanAnimation/)
