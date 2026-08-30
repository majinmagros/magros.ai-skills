---
name: hyper3d-rodin-pipeline
description: |
  Pipeline completo ChatAvatar/Rodin: text-to-face, image-to-3D, prompt engineering com weights/seeds, seed control, model versions (DreamFace v1/v2, cartoon, hero), download formats (FBX/GLB/USDZ), MetaHuman/Studio export. Baseado no vídeo Joy Dev Studio "3D Face Modeling is a THING OF THE PAST!".
  Use quando: "hyper3d rodin pipeline", "chatavatar pipeline", "rodin pipeline", "text to face 3d", "image to 3d face", "hyper3d rodin", "rodin text to 3d", "rodin image to 3d".
  Não use para: MetaHuman Identity Solve (use metahuman-identity-pipeline), MetaHuman to Unreal (use metahuman-to-unreal-pipeline), animation retarget (use metahuman-animation-retarget).
  Outcome: Pipeline completo ChatAvatar/Rodin: text-to-face, image-to-3D, prompt engineering com weights/seeds, seed control, model versions, download formats, MetaHuman/Studio export.
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

# Hyper3D Rodin Pipeline — Pipeline Completo ChatAvatar/Rodin

Pipeline completo **ChatAvatar/Rodin** (Hyper3D): **text-to-face**, **image-to-3D**, **prompt engineering com weights/seeds**, **seed control**, **model versions** (DreamFace v1/v2, cartoon, hero), **download formats** (FBX/GLB/USDZ), **MetaHuman/Studio export**.

## Quando usar (gatilhos concretos)

- "Hyper3D Rodin pipeline"
- "ChatAvatar pipeline"
- "Rodin text to 3D face"
- "Rodin image to 3D face"
- "Hyper3D Rodin pipeline"
- "Rodin prompt engineering"
- "Rodin seed control"
- "Rodin model versions"
- "Rodin download formats"
- "Rodin MetaHuman export"

## Quando NÃO usar

- MetaHuman Identity Solve → use `metahuman-identity-pipeline`
- MetaHuman to Unreal → use `metahuman-to-unreal-pipeline`
- Animation retarget → use `metahuman-animation-retarget`
- API access → use `hyper3d-rodin-api`
- Unreal Blueprint → use `metahuman-unreal-blueprint`

## Pipeline Overview (Baseado no vídeo Joy Dev Studio)

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  TEXT PROMPT    │────▶│  CHATAVATAR     │────▶│  RODIN GENERATE │────▶│  DOWNLOAD/EXPORT│
│  (text-to-face) │     │  (text-to-face) │     │  (image-to-3D)  │     │  (FBX/GLB/USDZ) │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
         │                      │                      │                      │
         ▼                      ▼                      ▼                      ▼
   Prompt Engineering     Model Selection        Generation Params      Format Selection
   - Weights/Seeds        - DreamFace v1/v2       - Seeds/Steps          - FBX/GLB/USDZ
   - Weights              - Cartoon/Hero          - Guidance Scale       - MetaHuman Export
   - Seeds                - Style Transfer        - Guidance Scale       - Studio Export
```

## Pipeline Stages

### Stage 1: ChatAvatar (Text-to-Face)

```python
# chatavatar.py
class ChatAvatarPipeline:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.hyper3d.ai/v1"
    
    def generate_face(self, prompt: str, options: dict = {}) -> dict:
        """
        Gera rosto a partir de prompt de texto.
        
        Args:
            prompt: Descrição textual do rosto
            options:
                - model: "dreamface_v1", "dreamface_v2", "cartoon", "hero"
                - seed: int (para reprodutibilidade)
                - weights: dict com pesos para características
                - style: "realistic", "stylized", "cartoon"
        """
        payload = {
            "prompt": prompt,
            "model": options.get("model", "dreamface_v2"),
            "seed": options.get("seed"),
            "weights": options.get("weights", {}),
            "style": options.get("style", "realistic")
        }
        
        response = self._post("/chatavatar/generate", payload)
        return response  # Retorna job_id para polling
    
    def generate_from_image(self, image_path: str, options: dict = {}) -> dict:
        """
        Gera rosto a partir de imagem (image-to-3D).
        """
        with open(image_path, 'rb') as f:
            files = {'image': f}
            data = {
                'model': options.get('model', 'dreamface_v2'),
                'seed': options.get('seed'),
                'weights': json.dumps(options.get('weights', {}))
            }
            response = self._post_multipart("/chatavatar/generate", data, files)
            return response
    
    def poll_job(self, job_id: str, timeout: int = 300) -> dict:
        """Polling para verificar status do job."""
        start = time.time()
        while time.time() - start < timeout:
            status = self._get(f"/jobs/{job_id}/status")
            if status['status'] == 'completed':
                return status['result']
            elif status['status'] == 'failed':
                raise Exception(f"Job failed: {status.get('error')}")
            time.sleep(5)
        raise TimeoutError(f"Job {job_id} timed out")
```

### Stage 2: Rodin Generate (Image-to-3D)

```python
# rodin.py
class RodinPipeline:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.hyper3d.ai/v1"
    
    def generate_3d(self, image_path: str, options: dict = {}) -> dict:
        """
        Gera modelo 3D a partir de imagem.
        
        Args:
            image_path: Caminho para imagem de referência
            options:
                - model: "rodin_v1", "rodin_v2"
                - seed: int
                - guidance_scale: float (1-20)
                - steps: int (10-50)
                - seed: int
                - texture_resolution: 512, 1024, 2048
        """
        payload = {
            "image": self._encode_image(image_path),
            "model": options.get("model", "rodin_v2"),
            "seed": options.get("seed"),
            "guidance_scale": options.get("guidance_scale", 7.5),
            "steps": options.get("steps", 30),
            "texture_resolution": options.get("texture_resolution", 1024)
        }
        
        response = self._post("/rodin/generate", payload)
        return response  # job_id
    
    def get_model_versions(self) -> dict:
        """Retorna versões disponíveis do modelo."""
        return self._get("/models/versions")
    
    def get_generation_params(self) -> dict:
        """Retorna parâmetros recomendados por caso de uso."""
        return {
            "face": {"guidance_scale": 7.5, "steps": 30},
            "character": {"guidance_scale": 8.0, "steps": 40},
            "environment": {"guidance_scale": 6.0, "steps": 50}
        }
```

### Stage 3: Download & Export

```python
# export.py
class ExportPipeline:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.hyper3d.ai/v1"
    
    def download_model(self, job_id: str, format: str = "fbx", options: dict = {}) -> str:
        """
        Baixa modelo 3D gerado.
        
        Formats: fbx, glb, usdz, obj
        Options:
            - texture_resolution: 512, 1024, 2048, 4096
            - include_textures: bool
            - include_rig: bool (para MetaHuman)
            - lod_levels: int (LOD levels)
        """
        params = {
            "format": format,
            "texture_resolution": options.get("texture_resolution", 1024),
            "include_textures": options.get("include_textures", True),
            "include_rig": options.get("include_rig", False),
            "lod_levels": options.get("lod_levels", 1)
        }
        
        response = self._get(f"/jobs/{job_id}/download", params=params)
        return response['download_url']
    
    def export_metahuman(self, job_id: str) -> dict:
        """Exporta diretamente para MetaHuman Creator."""
        return self._post(f"/jobs/{job_id}/export/metahuman", {})
    
    def export_studio(self, job_id: str) -> dict:
        """Exporta para Hyper3D Studio."""
        return self._post(f"/jobs/{job_id}/export/studio", {})
```

## Prompt Engineering (Weights/Seeds)

```python
# prompt_engineering.py
class PromptEngineer:
    """
    Prompt engineering para Hyper3D Rodin/ChatAvatar.
    Baseado no vídeo Joy Dev Studio - prompt engineering com weights/seeds.
    """
    
    # Weights padrão para características faciais
    FACE_WEIGHTS = {
        "face_shape": 1.0,
        "eye_shape": 1.0,
        "nose_shape": 1.0,
        "mouth_shape": 1.0,
        "skin_texture": 0.8,
        "hair_style": 0.7,
        "facial_hair": 0.5,
        "makeup": 0.3,
        "age": 0.6,
        "ethnicity": 0.7,
        "expression": 0.5
    }
    
    # Seeds recomendadas por tipo
    SEED_PRESETS = {
        "consistent": 42,           # Reprodutível
        "variation": None,          # Aleatório
        "diverse": [42, 123, 456, 789, 999],  # Para batch
        "experimental": 999999      # Exploratório
    }
    
    @classmethod
    def build_prompt(cls, description: str, weights: dict = None, style: str = "realistic") -> str:
        """
        Constrói prompt otimizado para ChatAvatar.
        
        Args:
            description: Descrição base do rosto
            weights: Pesos personalizados (merge com FACE_WEIGHTS)
            style: "realistic", "stylized", "cartoon", "anime"
        """
        weights = {**cls.FACE_WEIGHTS, **(weights or {})}
        
        weight_str = ", ".join([f"{k}:{v}" for k, v in weights.items() if v > 0])
        
        style_prompts = {
            "realistic": "photorealistic, 8k, highly detailed, raw photo",
            "stylized": "stylized, artistic, exaggerated features",
            "cartoon": "cartoon style, cel shaded, exaggerated proportions",
            "anime": "anime style, manga, large eyes, stylized"
        }
        
        prompt = f"{description}, {style_prompts.get(style, '')}, {weight_str}"
        return prompt
    
    @classmethod
    def generate_batch_prompts(cls, base_description: str, count: int = 5, variation: float = 0.2) -> list:
        """Gera lote de prompts com variação controlada."""
        prompts = []
        base_weights = cls.FACE_WEIGHTS.copy()
        
        for i in range(count):
            # Varia pesos ligeiramente
            varied_weights = {}
            for k, v in base_weights.items():
                varied_weights[k] = max(0, min(1, v + random.uniform(-variation, variation)))
            
            prompts.append(cls.build_prompt(base_description, varied_weights))
        
        return prompts
```

## Model Versions & Parameters

```python
# model_config.py
MODEL_CONFIGS = {
    "dreamface_v1": {
        "description": "Versão original, boa para rostos gerais",
        "best_for": ["general", "quick_iteration"],
        "params": {"guidance_scale": 7.5, "steps": 30}
    },
    "dreamface_v2": {
        "description": "Versão melhorada, mais detalhes",
        "best_for": ["high_quality", "production"],
        "params": {"guidance_scale": 7.5, "steps": 40}
    },
    "cartoon": {
        "description": "Estilo cartoon/exagerado",
        "best_for": ["stylized", "games", "animation"],
        "params": {"guidance_scale": 6.0, "steps": 30}
    },
    "hero": {
        "description": "Estilo herói/realista aprimorado",
        "best_for": ["hero_characters", "cinematic"],
        "params": {"guidance_scale": 8.0, "steps": 50}
    },
    "rodin_v1": {
        "description": "Rodin original",
        "best_for": ["general_3d", "fast"],
        "params": {"guidance_scale": 7.5, "steps": 30}
    },
    "rodin_v2": {
        "description": "Rodin melhorado",
        "best_for": ["high_quality", "production"],
        "params": {"guidance_scale": 7.5, "steps": 40}
    }
}

# Parâmetros de geração recomendados
GENERATION_PRESETS = {
    "face_high_quality": {
        "model": "dreamface_v2",
        "guidance_scale": 7.5,
        "steps": 40,
        "texture_resolution": 2048
    },
    "face_fast": {
        "model": "dreamface_v1",
        "guidance_scale": 6.0,
        "steps": 20,
        "texture_resolution": 1024
    },
    "rodin_high_quality": {
        "model": "rodin_v2",
        "guidance_scale": 7.5,
        "steps": 50,
        "texture_resolution": 2048
    },
    "rodin_fast": {
        "model": "rodin_v1",
        "guidance_scale": 6.0,
        "steps": 25,
        "texture_resolution": 1024
    }
}
```

## Export Formats & MetaHuman Integration

```python
# export_formats.py
EXPORT_FORMATS = {
    "fbx": {
        "description": "Autodesk FBX - Universal",
        "supports_rig": True,
        "supports_animation": True,
        "meta_human_ready": True,
        "max_texture": 4096
    },
    "glb": {
        "description": "GLTF Binary - Web/Universal",
        "supports_rig": True,
        "supports_animation": True,
        "meta_human_ready": True,
        "max_texture": 4096
    },
    "usdz": {
        "description": "Universal Scene Description - Apple/AR",
        "supports_rig": False,
        "supports_animation": False,
        "meta_human_ready": False,
        "max_texture": 2048
    },
    "obj": {
        "description": "Wavefront OBJ - Universal",
        "supports_rig": False,
        "supports_animation": False,
        "meta_human_ready": False,
        "max_texture": 4096
    },
    "usd": {
        "description": "Universal Scene Description - Pixar/USD",
        "supports_rig": True,
        "supports_animation": True,
        "meta_human_ready": True,
        "max_texture": 4096
    }
}

METAHUMAN_EXPORT_OPTIONS = {
    "include_rig": True,
    "include_blendshapes": True,  # 51+ blendshapes
    "include_eye_rig": True,
    "include_tongue_rig": True,
    "texture_resolution": [512, 1024, 2048, 4096],
    "lod_levels": [0, 1, 2, 3],
    "naming_convention": "metahuman_standard"
}
```

## Pipeline Completo - Exemplo de Uso

```python
# main_pipeline.py
async def run_full_pipeline(prompt: str, reference_image: str = None, output_dir: str = "./output"):
    """
    Pipeline completo: Prompt → ChatAvatar → Rodin → Export → MetaHuman
    """
    from hyper3d_rodin_pipeline.chatavatar import ChatAvatarPipeline
    from hyper3d_rodin_pipeline.rodin import RodinPipeline
    from hyper3d_rodin_pipeline.export import ExportPipeline
    
    chatavatar = ChatAvatarPipeline(api_key=API_KEY)
    rodin = RodinPipeline(api_key=API_KEY)
    export = ExportPipeline(api_key=API_KEY)
    
    # 1. ChatAvatar - Text-to-Face
    print("🎨 Gerando rosto via ChatAvatar...")
    job = chatavatar.generate_face(
        prompt="Realistic male, 30s, strong jawline, blue eyes, short brown hair, slight beard",
        options={"model": "dreamface_v2", "seed": 42}
    )
    face_result = chatavatar.poll_job(job['job_id'])
    
    # 2. Rodin - Image to 3D (usando imagem gerada ou referência)
    print("🎯 Gerando modelo 3D via Rodin...")
    if reference_image:
        rodin_job = rodin.generate_3d(reference_image, options={
            "model": "rodin_v2",
            "guidance_scale": 7.5,
            "steps": 40,
            "texture_resolution": 2048
        })
    else:
        # Usa imagem gerada pelo ChatAvatar
        rodin_job = rodin.generate_3d(face_result['image_url'], options={
            "model": "rodin_v2",
            "guidance_scale": 7.5,
            "steps": 40
        })
    
    rodin_result = rodin.poll_job(rodin_job['job_id'])
    
    # 3. Export para MetaHuman
    print("📦 Exportando para MetaHuman...")
    export_result = export.download_model(
        rodin_result['job_id'],
        format="fbx",
        options={
            "include_rig": True,
            "texture_resolution": 2048,
            "lod_levels": 2
        }
    )
    
    # 4. Export MetaHuman directo
    metahuman_export = export.export_metahuman(rodin_result['job_id'])
    
    return {
        "face": face_result,
        "rodin": rodin_result,
        "export": export_result,
        "metahuman": metahuman_export
    }

# Uso
if __name__ == "__main__":
    import asyncio
    result = asyncio.run(run_full_pipeline(
        prompt="Realistic female, 20s, freckles, green eyes, red hair",
        output_dir="./my_character"
    ))
    print(f"✅ Pipeline completo: {result}")
```

---

## Referências Oficiais (Validados 2026-08-30)

- [Hyper3D Rodin](https://www.hyper3d.ai/rodin)
- [Hyper3D ChatAvatar](https://www.hyper3d.ai/chatavatar)
- [Rodin GitHub](https://github.com/hyper3d-ai/rodin)
- [Joy Dev Studio Video](https://www.youtube.com/watch?v=J2LkNI2MzKM)

---

## Checklist de Entrega

- [ ] `chatavatar.py` — ChatAvatar pipeline (text-to-face, image-to-3D)
- [ ] `rodin.py` — Rodin pipeline (image-to-3D, model versions)
- [ ] `export.py` — Export pipeline (FBX/GLB/USDZ, MetaHuman, Studio)
- [ ] `prompt_engineering.py` — Prompt engineering com weights/seeds
- [ ] `model_config.py` — Model configs (DreamFace v1/v2, Cartoon, Hero, Rodin v1/v2)
- [ ] `export_formats.py` — Export formats (FBX/GLB/USDZ/OBJ/USD)
- [ ] `prompt_engineering.py` — Prompt engineering com weights/seeds
- [ ] `main_pipeline.py` — Pipeline completo end-to-end
- [ ] Testes de integração
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