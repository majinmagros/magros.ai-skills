---
name: metahuman-identity-pipeline
description: >-
  MetaHuman Identity Solve: photo requirements, marker placement, eye texture importance, auto-rigging, eye/mouth correction, neutral pose. Baseado no vídeo Joy Dev Studio "3D Face Modeling is a THING OF THE PAST!".
  Use quando: "metahuman identity solve", "metahuman identity pipeline", "metahuman photo requirements", "metahuman marker placement", "metahuman eye texture", "metahuman auto rigging", "metahuman eye alignment", "metahuman neutral pose".
  Não use para: ChatAvatar/Rodin pipeline (use hyper3d-rodin-pipeline), MetaHuman to Unreal (use metahuman-to-unreal-pipeline), animation retarget (use metahuman-animation-retarget).
  Outcome: Pipeline completo MetaHuman Identity: photo requirements, marker placement, eye texture, auto-rigging, eye/mouth correction, neutral pose setup.
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
- [MetaHuman Identity Documentation](https://docs.unrealengine.com/5.7/en-US/metaHumanIdentity/)
- [MetaHuman Creator Docs](https://docs.unrealengine.com/5.7/en-US/metaHumanCreator/)
- [MetaHuman Identity Solve](https://docs.unrealengine.com/5.7/en-US/metaHumanIdentitySolve/)

---

## Checklist de Entrega

- [ ] `photo_requirements.py` — Photo validation (resolution, lighting, expression)
- [ ] `photo_validator.py` — Photo validation script (OpenCV)
- [ ] `identity_solve.py` — Identity Solve wrapper (Unreal Python API)
- [ ] `auto_rigging.py` — Auto-rigging wrapper (body types, proportions)
- [ ] `eye_texture.py` — Eye texture handler (critical for Identity Solve)
- [ ] `auto_rigging.py` — Auto-rigging wrapper (body types, proportions)
- [ ] `validation_corrections.py` — Validation & auto-fix (eyes, mouth, pose, blendshapes)
- [ ] `metahuman_identity_pipeline.py` — Pipeline completo orquestrado
- [ ] Testes de integração com Unreal Engine 5.7+
- [ ] Documentação de uso

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   ├── commands/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```

## Referências (arquivos)

- `references/stage1-capture.md` — fotos, validacao
- `references/stage2-solve.md` — identity solve
- `references/stage3-rigging.md` — rig, eye texture
- `references/stage4-validation.md` — correcoes
- `references/pipeline-integration.md` — orquestracao
