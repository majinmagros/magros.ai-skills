---
name: hyper3d-rodin-pipeline
description: Use when generating 3D faces with Hyper3D ChatAvatar/Rodin — text-to-face, image-to-3D, weights/seeds prompt engineering, model versions, FBX/GLB/USDZ and MetaHuman export. Triggers on "hyper3d rodin pipeline", "chatavatar pipeline", "text to face 3d", "image to 3d face", "rodin seed control".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=J2LkNI2MzKM (Joy Dev Studio video)
    - https://www.hyper3d.ai/rodin
    - https://www.hyper3d.ai/chatavatar
    - https://github.com/hyper3d-ai/rodin
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Hyper3D Rodin Pipeline — ChatAvatar/Rodin

Pipeline **ChatAvatar/Rodin** (Hyper3D): **text-to-face**, **image-to-3D**, **weights/seeds**, **model versions** (DreamFace v1/v2, cartoon, hero), **FBX/GLB/USDZ**, **MetaHuman/Studio export**. Código em `scripts/`.

## Quando usar (gatilhos concretos)

- "Hyper3D Rodin pipeline"
- "ChatAvatar pipeline"
- "Rodin text to 3D face" / "Rodin image to 3D face"
- "Rodin prompt engineering" / "Rodin seed control"
- "Rodin model versions" / "Rodin download formats" / "Rodin MetaHuman export"

## Quando NÃO usar

- MetaHuman Identity Solve → use `metahuman-identity-pipeline`
- MetaHuman to Unreal → use `metahuman-to-unreal-pipeline`
- Animation retarget → use `metahuman-animation-retarget`
- API access → use `hyper3d-rodin-api`
- Unreal Blueprint → use `metahuman-unreal-blueprint`

## Pipeline (resumo)

```
TEXT PROMPT → CHATAVATAR (text-to-face) → RODIN (image-to-3D) → DOWNLOAD/EXPORT (FBX/GLB/USDZ)
```

**Stage 1 — ChatAvatar** (`scripts/chatavatar.py`): `generate_face(prompt, model/seed/weights/style)` + `generate_from_image()` + `poll_job()` com timeout.

**Stage 2 — Rodin** (`scripts/rodin.py`): `generate_3d(image, model/guidance_scale/steps/texture_resolution)` + `get_model_versions()` + presets por caso (face/character/environment).

**Stage 3 — Export** (`scripts/export.py`): `download_model(job, fbx|glb|usdz|obj)` + `export_metahuman()` + `export_studio()`.

**Prompt engineering** (`scripts/prompt_engineering.py`): `FACE_WEIGHTS` (11 características) + `SEED_PRESETS` (consistent 42, diverse batch, experimental) + `build_prompt()` com estilos (realistic/stylized/cartoon/anime) + `generate_batch_prompts()` com variação controlada.

**Models** (`scripts/model_config.py`): dreamface_v1/v2, cartoon, hero, rodin_v1/v2 + `GENERATION_PRESETS` (face/rodin × high_quality/fast).

**Formats** (`scripts/export_formats.py`): fbx/glb/usd (rig+anim+MetaHuman), usdz/obj (sem rig); `METAHUMAN_EXPORT_OPTIONS` (rig, 51+ blendshapes, eye/tongue, LODs).

**End-to-end** (`scripts/main_pipeline.py`): `run_full_pipeline(prompt, reference_image?, output_dir)` — ChatAvatar → Rodin → FBX → MetaHuman.

```python
from hyper3d_rodin_pipeline.prompt_engineering import PromptEngineer
prompt = PromptEngineer.build_prompt("Realistic female, 20s, freckles", style="realistic")
```

## Checklist de Entrega

- [ ] `scripts/chatavatar.py`, `rodin.py`, `export.py`
- [ ] `scripts/prompt_engineering.py`, `model_config.py`, `export_formats.py`
- [ ] `scripts/main_pipeline.py` end-to-end
- [ ] Testes de integração + documentação de uso