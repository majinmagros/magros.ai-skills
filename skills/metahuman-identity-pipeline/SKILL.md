---
name: metahuman-identity-pipeline
description: Use when running MetaHuman Identity Solve — photo requirements, marker placement, eye texture, auto-rigging, eye/mouth correction, neutral pose. Triggers on "metahuman identity solve", "metahuman identity pipeline", "metahuman photo requirements", "metahuman marker placement", "metahuman eye texture", "metahuman auto rigging".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=J2LkNI2MzKM (Joy Dev Studio video)
    - https://docs.unrealengine.com/5.7/en-US/metaHumanCreator/
    - https://docs.unrealengine.com/5.7/en-US/metaHumanIdentity/
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# MetaHuman Identity Pipeline — Pipeline de Identidade MetaHuman

Pipeline completo **MetaHuman Identity Solve**: photo requirements, marker placement, eye texture importance, auto-rigging, eye/mouth correction, neutral pose setup. Baseado no workflow do Joy Dev Studio.

## Quando usar (gatilhos concretos)

- "MetaHuman Identity Solve"
- "MetaHuman photo requirements"
- "MetaHuman marker placement"
- "MetaHuman eye texture importance"
- "MetaHuman auto rigging"
- "MetaHuman eye alignment"
- "MetaHuman neutral pose"
- "MetaHuman Identity pipeline"

## Quando NÃO usar

- ChatAvatar/Rodin pipeline → use `hyper3d-rodin-pipeline`
- MetaHuman to Unreal → use `metahuman-to-unreal-pipeline`
- Animation retarget → use `metahuman-animation-retarget`
- Animation Blueprint → use `metahuman-unreal-blueprint`
- Rodin API → use `hyper3d-rodin-api`

## Pipeline Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  PHOTO INPUT    │────▶│  IDENTITY SOLVE │────▶│  AUTO-RIGGING   │────▶│  VALIDATION     │
│  (Photo Reqs)   │     │  (Auto-rig)     │     │  (Rig + Skin)   │     │  (QA + Fixes)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
       │                       │                       │                       │
       ▼                       ▼                       ▼                       ▼
  Photo Requirements     Marker Placement        Auto-rig + Skin       Eye/Mouth Fix
  - Front/Side/3/4       - 68+ markers           - Skeleton + Skin     - Eye alignment
  - Lighting/Quality     - Eye markers critical  - Blendshapes (51+)   - Mouth alignment
  - Neutral Expression   - Neutral pose          - Facial rig          - Neutral pose
  - Resolution           - Eye texture critical  - Body proportions    - Blendshape check
```

## Contents

| Etapa | Reference |
|---|---|
| 1. Photo requirements & capture | `references/stage1-capture.md` |
| 2. Identity solve & auto-rigging | `references/stage2-solve.md` |
| 3. Auto-rigging & body setup | `references/stage3-rigging.md` |
| 4. Validation & corrections | `references/stage4-validation.md` |
| Pipeline completo orquestrado | `references/pipeline-integration.md` |

## Referências Oficiais (Validados 2026-08-30)

- [Joy Dev Studio Video](https://www.youtube.com/watch?v=J2LkNI2MzKM)