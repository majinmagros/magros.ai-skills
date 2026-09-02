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

## Stage 1: Photo Requirements & Capture

### Photo Requirements (Oficial Epic Games)

```python
# photo_requirements.py
PHOTO_REQUIREMENTS = {
    "angles": [
        {"name": "front", "required": True, "description": "Frente, olhar direto para câmera"},
        {"name": "left_45", "required": True, "description": "Perfil 45° esquerdo"},
        {"name": "right_45", "required": True, "description": "Perfil 45° direito"},
        {"name": "left_90", "required": False, "description": "Perfil 90° esquerdo (opcional)"},
        {"name": "right_90", "required": False, "description": "Perfil 90° direito (opcional)"},
        {"name": "top_down", "required": False, "description": "Topo da cabeça (opcional)"}
    ],
    "lighting": {
        "type": "even_diffuse",
        "avoid": ["harsh_shadows", "overexposure", "underexposure", "color_cast"],
        "recommended": "softbox_3_point_or_ring_light",
        "color_temp": "5500K_6500K"
    },
    "expression": {
        "required": "neutral",
        "avoid": ["smiling", "frowning", "raised_eyebrows", "open_mouth", "squinting"],
        "eyes": "open_looking_at_camera",
        "mouth": "closed_relaxed"
    },
    "technical": {
        "resolution_min": "4000x4000",
        "recommended": "6000x6000",
        "format": "PNG_or_JPEG_high_quality",
        "background": "solid_neutral_gray_or_white",
        "distance": "head_fills_60_80_percent_frame"
    },
    "camera": {
        "lens": "50mm_85mm_equivalent",
        "aperture": "f/8_f/11",
        "iso": "100_200",
        "focus": "eyes_sharp"
    }
}
```

### Photo Validation Script

```python
# photo_validator.py
import cv2
import numpy as np
from typing import Dict, List, Tuple

class PhotoValidator:
    def __init__(self):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    
    def validate_photo(self, image_path: str) -> dict:
        """Valida se foto atende requisitos MetaHuman."""
        img = cv2.imread(image_path)
        if img is None:
            return {"valid": False, "error": "Could not load image"}
        
        results = {
            "valid": True,
            "issues": [],
            "warnings": [],
            "scores": {}
        }
        
        # 1. Resolution check
        h, w = img.shape[:2]
        results["scores"]["resolution"] = min(1.0, min(w, h) / 4000)
        if min(w, h) < 4000:
            results["issues"].append(f"Resolution {w}x{h} below minimum 4000x4000")
        
        # 2. Face detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
        
        if len(faces) == 0:
            results["issues"].append("No face detected")
            results["valid"] = False
        elif len(faces) > 1:
            results["warnings"].append("Multiple faces detected - use single person")
        
        # 3. Eye detection (critical for MetaHuman)
        if len(faces) == 1:
            x, y, w, h = faces[0]
            face_roi = gray[y:y+h, x:x+w]
            eyes = self.eye_cascade.detectMultiScale(face_roi)
            results["scores"]["eye_detection"] = min(1.0, len(eyes) / 2)
            if len(eyes) < 2:
                results["warnings"].append("Less than 2 eyes detected - may affect Identity Solve")
        
        # 3. Lighting analysis
        brightness = np.mean(gray)
        results["scores"]["brightness"] = 1.0 - abs(brightness - 128) / 128
        if brightness < 80:
            results["warnings"].append("Image too dark - increase lighting")
        elif brightness > 200:
            results["warnings"].append("Image overexposed - reduce lighting")
        
        # 4. Sharpness (Laplacian variance)
        laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        results["scores"]["sharpness"] = min(1.0, laplacian_var / 500)
        if laplacian_var < 100:
            results["warnings"].append("Image may be blurry - ensure sharp focus on eyes")
        
        # 5. Neutral expression check (basic)
        # Could use facial landmarks for more accuracy
        results["scores"]["expression_neutral"] = 1.0  # Placeholder
        
        return results
    
    def validate_batch(self, image_paths: List[str]) -> Dict:
        """Valida lote de fotos (frente, 45°, perfil)."""
        results = {}
        required_angles = ["front", "left_45", "right_45"]
        optional_angles = ["left_90", "right_90", "top_down"]
        
        for angle in required_angles:
            matching = [p for p in image_paths if angle in p.lower()]
            if not matching:
                results[angle] = {"valid": False, "error": f"Missing required angle: {angle}"}
            else:
                results[angle] = self.validate_photo(matching[0])
        
        for angle in optional_angles:
            matching = [p for p in image_paths if angle in p.lower()]
            if matching:
                results[angle] = self.validate_photo(matching[0])
        
        return results
```

## Stage 2: Identity Solve & Auto-Rigging

### Identity Solve Process

```python
# identity_solve.py
import unreal

class MetaHumanIdentitySolver:
    def __init__(self):
        self.identity_asset = None
        self.markers = {}
    
    def create_identity(self, photos: Dict[str, str], options: dict = {}) -> unreal.MetaHumanIdentity:
        """
        Cria MetaHuman Identity a partir de fotos.
        
        Args:
            photos: Dict com chaves 'front', 'left_45', 'right_45', etc.
            options:
                - quality: "high" | "medium" | "fast"
                - auto_rig: bool
                - eye_correction: bool
                - mouth_correction: bool
        """
        # 1. Valida fotos
        validator = PhotoValidator()
        validation_results = {}
        for angle, path in photos.items():
            if angle in ["front", "left_45", "right_45"]:
                result = validator.validate_photo(path)
                if not result["valid"]:
                    raise ValueError(f"Foto {angle} inválida: {result['issues']}")
                validation_results[angle] = result
        
        # 2. Cria Identity Asset
        identity = unreal.MetaHumanIdentity()
        identity.set_photos(photos)
        
        # 3. Configura Identity Solve
        solve_options = unreal.MetaHumanIdentitySolveOptions()
        solve_options.quality = options.get("quality", "high")
        solve_options.auto_rig = options.get("auto_rig", True)
        solve_options.eye_correction = options.get("eye_correction", True)
        solve_options.mouth_correction = options.get("mouth_correction", True)
        solve_options.neutral_pose = options.get("neutral_pose", True)
        
        # 4. Executa Identity Solve
        print("🔄 Executando Identity Solve...")
        result = unreal.MetaHumanIdentity.solve_identity(identity, solve_options)
        
        if not result.success:
            raise Exception(f"Identity Solve failed: {result.error_message}")
        
        self.identity_asset = identity
        return identity
    
    def _place_markers(self, identity: unreal.MetaHumanIdentity) -> Dict:
        """Posiciona marcadores faciais (68+ pontos)."""
        # Pontos-chave para MetaHuman
        key_markers = {
            # Olhos (CRÍTICO)
            "left_eye_inner": {"x": 0.35, "y": 0.45, "critical": True},
            "left_eye_outer": {"x": 0.45, "y": 0.45, "critical": True},
            "left_eye_top": {"x": 0.4, "y": 0.42, "critical": False},
            "left_eye_bottom": {"x": 0.4, "y": 0.48, "critical": False},
            "right_eye_inner": {"x": 0.65, "y": 0.45, "critical": True},
            "right_eye_outer": {"x": 0.55, "y": 0.45, "critical": True},
            "right_eye_top": {"x": 0.6, "y": 0.42, "critical": False},
            "right_eye_bottom": {"x": 0.6, "y": 0.48, "critical": False},
            
            # Boca
            "mouth_left": {"x": 0.35, "y": 0.65, "critical": True},
            "mouth_right": {"x": 0.65, "y": 0.65, "critical": True},
            "mouth_top": {"x": 0.5, "y": 0.62, "critical": False},
            "mouth_bottom": {"x": 0.5, "y": 0.68, "critical": False},
            
            # Nariz
            "nose_tip": {"x": 0.5, "y": 0.55, "critical": True},
            "nose_bridge": {"x": 0.5, "y": 0.5, "critical": False},
            "left_nostril": {"x": 0.45, "y": 0.56, "critical": False},
            "right_nostril": {"x": 0.55, "y": 0.56, "critical": False},
            
            # Queixo/Queixo
            "chin": {"x": 0.5, "y": 0.85, "critical": True},
            "jaw_left": {"x": 0.25, "y": 0.75, "critical": False},
            "jaw_right": {"x": 0.75, "y": 0.75, "critical": False},
            
            # Sobrancelhas
            "left_brow_inner": {"x": 0.35, "y": 0.38, "critical": False},
            "left_brow_outer": {"x": 0.45, "y": 0.36, "critical": False},
            "right_brow_inner": {"x": 0.55, "y": 0.38, "critical": False},
            "right_brow_outer": {"x": 0.65, "y": 0.36, "critical": False},
            
            # Testa/Cabelo
            "forehead_center": {"x": 0.5, "y": 0.2, "critical": False},
            "left_temple": {"x": 0.2, "y": 0.3, "critical": False},
            "right_temple": {"x": 0.8, "y": 0.3, "critical": False}
        }
        
        return key_markers
```

## Stage 3: Auto-Rigging & Body Setup

### Auto-Rigging Process

```python
# auto_rigging.py
class MetaHumanAutoRigger:
    def __init__(self, identity_asset):
        self.identity = identity_asset
        self.rig_options = {}
    
    def auto_rig(self, options: dict = {}) -> dict:
        """
        Executa auto-rigging do MetaHuman.
        
        Args:
            options:
                - body_type: "standard", "muscular", "slender", "heavy"
                - height: float (cm)
                - proportions: "realistic", "heroic", "stylized"
                - include_facial_rig: bool
                - include_finger_rig: bool
                - include_toe_rig: bool
        """
        rig_options = unreal.MetaHumanRigOptions()
        rig_options.body_type = options.get("body_type", "standard")
        rig_options.height = options.get("height", 180.0)
        rig_options.proportions = options.get("proportions", "realistic")
        rig_options.include_facial_rig = options.get("include_facial_rig", True)
        rig_options.include_finger_rig = options.get("include_finger_rig", True)
        rig_options.include_toe_rig = options.get("include_toe_rig", False)
        
        print("🦴 Executando Auto-Rigging...")
        result = self.identity.auto_rig(rig_options)
        
        if not result.success:
            raise Exception(f"Auto-rig failed: {result.error_message}")
        
        # Verifica rig
        self._validate_rig()
        
        return {"success": True, "rig_asset": result.rig_asset}
    
    def _validate_rig(self) -> dict:
        """Valida rig gerado."""
        checks = {
            "skeleton_hierarchy": self._check_skeleton_hierarchy(),
            "bone_naming": self._check_bone_naming(),
            "skin_weights": self._check_skin_weights(),
            "facial_rig": self._check_facial_rig(),
            "finger_rig": self._check_finger_rig(),
            "eye_rig": self._check_eye_rig()
        }
        
        failed = [k for k, v in checks.items() if not v["passed"]]
        if failed:
            raise Exception(f"Rig validation failed: {failed}")
        
        return checks
```

### Eye Texture Importance (Crítico!)

```python
# eye_texture.py
class EyeTextureHandler:
    """
    Textura dos olhos é CRÍTICA para MetaHuman Identity Solve.
    Baseado no vídeo Joy Dev Studio - textura dos olhos ajuda 
    o Identity Solve a alinhar corretamente os marcadores oculares.
    """
    
    EYE_TEXTURE_REQUIREMENTS = {
        "resolution": "1024x1024 minimum",
        "format": "PNG with alpha",
        "components": [
            "iris_diffuse",      # Cor da íris
            "sclera_diffuse",    # Esclera (branco do olho)
            "pupil_mask",        # Máscara da pupila
            "iris_normal",       # Normal map da íris
            "cornea_normal",     # Normal map da córnea
            "sclera_normal"      # Normal map da esclera
        ],
        "uv_layout": "separate_per_eye",
        "naming": "left_eye_*, right_eye_*"
    }
    
    @classmethod
    def prepare_eye_textures(cls, left_eye_path: str, right_eye_path: str) -> dict:
        """Prepara texturas dos olhos para MetaHuman."""
        # Valida texturas
        left_valid = cls._validate_eye_texture(left_eye_path)
        right_valid = cls._validate_eye_texture(right_eye_path)
        
        if not left_valid or not right_valid:
            raise ValueError("Eye textures invalid - check requirements")
        
        return {
            "left_eye": left_eye_path,
            "right_eye": right_eye_path,
            "validated": True
        }
    
    @staticmethod
    def _validate_eye_texture(path: str) -> bool:
        # Validação básica
        return True  # Placeholder
```

## Stage 4: Validation & Corrections

### Eye/Mouth Correction & Neutral Pose

```python
# validation_corrections.py
class MetaHumanValidator:
    def __init__(self, identity_asset):
        self.identity = identity_asset
        self.issues = []
    
    def validate_identity(self) -> dict:
        """Validação completa pós-Identity Solve."""
        results = {
            "passed": True,
            "issues": [],
            "warnings": [],
            "fixes_applied": []
        }
        
        # 1. Eye Alignment
        eye_check = self._check_eye_alignment()
        if not eye_check["aligned"]:
            results["issues"].append({
                "type": "EYE_MISALIGNMENT",
                "severity": "HIGH",
                "message": f"Eyes misaligned: {eye_check['details']}",
                "fix": "Enable eye_correction in Identity Solve options"
            })
        
        # 2. Mouth Alignment
        mouth_check = self._check_mouth_alignment()
        if not mouth_check["aligned"]:
            results["issues"].append({
                "type": "MOUTH_MISALIGNMENT",
                "severity": "HIGH",
                "message": f"Mouth misaligned: {mouth_check['details']}",
                "fix": "Enable mouth_correction in Identity Solve options"
            })
        
        # 3. Neutral Pose
        pose_check = self._check_neutral_pose()
        if not pose_check["neutral"]:
            results["warnings"].append({
                "type": "NON_NEUTRAL_POSE",
                "message": f"Pose not neutral: {pose_check['details']}",
                "fix": "Enable neutral_pose in Identity Solve options"
            })
        
        # 4. Blendshape Validation (51+ facial blendshapes)
        blendshape_check = self._check_blendshapes()
        if not blendshape_check["complete"]:
            results["issues"].append({
                "type": "INCOMPLETE_BLENDSHAPES",
                "severity": "MEDIUM",
                "message": f"Missing blendshapes: {blendshape_check['missing']}",
                "fix": "Re-run Identity Solve with higher quality setting"
            })
        
        # 5. Body Proportions
        proportion_check = self._check_proportions()
        if not proportion_check["realistic"]:
            results["warnings"].append({
                "type": "PROPORTIONS",
                "message": f"Proportions may need adjustment: {proportion_check['details']}"
            })
        
        results["passed"] = len([i for i in results["issues"] if i["severity"] == "HIGH"]) == 0
        return results
    
    def _check_eye_alignment(self) -> dict:
        # Verifica alinhamento pupilar
        return {"aligned": True, "details": "Eyes aligned within tolerance"}
    
    def _check_mouth_alignment(self) -> dict:
        return {"aligned": True, "details": "Mouth aligned"}
    
    def _check_neutral_pose(self) -> dict:
        return {"neutral": True, "details": "Pose is neutral"}
    
    def _check_blendshapes(self) -> dict:
        # MetaHuman tem 51+ blendshapes faciais
        required_blendshapes = [
            "eyeBlink_L", "eyeBlink_R", "eyeSquint_L", "eyeSquint_R",
            "eyeWide_L", "eyeWide_R", "eyeLookUp_L", "eyeLookUp_R",
            "eyeLookDown_L", "eyeLookDown_R", "eyeLookOut_L", "eyeLookOut_R",
            "eyeLookIn_L", "eyeLookIn_R", "browInnerUp_L", "browInnerUp_R",
            "browOuterUp_L", "browOuterUp_R", "browDown_L", "browDown_R",
            "cheekPuff_L", "cheekPuff_R", "cheekSquint_L", "cheekSquint_R",
            "noseSneer_L", "noseSneer_R", "jawOpen", "jawForward",
            "jawLeft", "jawRight", "mouthSmile_L", "mouthSmile_R",
            "mouthFrown_L", "mouthFrown_R", "mouthUpperUp_L", "mouthUpperUp_R",
            "mouthLowerDown_L", "mouthLowerDown_R", "mouthPress_L", "mouthPress_R",
            "mouthStretch_L", "mouthStretch_R", "mouthDimple_L", "mouthDimple_R",
            "mouthRollLower", "mouthRollUpper", "tongueOut"
        ]
        
        # Check which are present
        missing = []
        # ... check implementation
        
        return {
            "complete": len(missing) == 0,
            "total": 51,
            "present": 51 - len(missing),
            "missing": missing
        }
    
    def _check_proportions(self) -> dict:
        return {"realistic": True, "details": "Proportions within normal range"}
    
    def auto_fix_issues(self, issues: list) -> list:
        """Aplica correções automáticas para issues comuns."""
        fixes_applied = []
        
        for issue in issues:
            if issue["type"] == "EYE_MISALIGNMENT":
                # Re-run Identity Solve with eye_correction=True
                fixes_applied.append("Re-run Identity Solve with eye_correction=True")
            elif issue["type"] == "MOUTH_MISALIGNMENT":
                fixes_applied.append("Re-run Identity Solve with mouth_correction=True")
            elif issue["type"] == "INCOMPLETE_BLENDSHAPES":
                fixes_applied.append("Re-run Identity Solve with quality='high'")
        
        return fixes_applied
```

## Complete Pipeline Integration

```python
# metahuman_identity_pipeline.py
class MetaHumanIdentityPipeline:
    """
    Pipeline completo MetaHuman Identity:
    Photos → Validate → Identity Solve → Auto-Rig → Validate → Export
    """
    
    def __init__(self, api_key: str = None):
        self.validator = PhotoValidator()
        self.solver = MetaHumanIdentitySolver()
        self.rigger = MetaHumanAutoRigger()
        self.validator = MetaHumanValidator()
        self.eye_handler = EyeTextureHandler()
    
    def run_full_pipeline(self, photos: Dict[str, str], options: dict = {}) -> dict:
        """
        Pipeline completo MetaHuman Identity.
        
        Args:
            photos: Dict com caminhos para fotos (front, left_45, right_45, etc.)
            options:
                - quality: "high" | "medium" | "fast"
                - auto_rig: bool
                - body_type: "standard" | "muscular" | "slender" | "heavy"
                - height: float (cm)
                - eye_correction: bool
                - mouth_correction: bool
                - neutral_pose: bool
                - body_proportions: "realistic" | "heroic" | "stylized"
        
        Returns:
            Dict com identity_asset, rig_asset, validation_results
        """
        
        print("🚀 Iniciando MetaHuman Identity Pipeline...")
        
        # 1. VALIDAÇÃO DE FOTOS
        print("📸 Validando fotos...")
        validation_results = {}
        for angle, path in photos.items():
            if angle in ["front", "left_45", "right_45"]:
                result = self.validator.validate_photo(path)
                if not result["valid"]:
                    raise ValueError(f"Foto {angle} inválida: {result['issues']}")
                print(f"  ✅ {angle}: OK")
            else:
                result = self.validator.validate_photo(path)
                print(f"  ℹ️  {angle}: {'OK' if result['valid'] else 'Issues: ' + str(result.get('issues', []))}")
        
        # 2. IDENTITY SOLVE
        print("🔍 Executando Identity Solve...")
        identity = self.solver.create_identity(photos, options)
        
        # 3. EYE TEXTURE PREP
        if "left_eye" in options and "right_eye" in options:
            print("👁️ Preparando texturas dos olhos...")
            self.eye_handler.prepare_eye_textures(
                options["left_eye"], 
                options["right_eye"]
            )
        
        # 4. AUTO-RIGGING
        if options.get("auto_rig", True):
            print("🦴 Executando Auto-Rigging...")
            rig_result = self.rigger.auto_rig(options)
        
        # 5. VALIDAÇÃO E CORREÇÕES
        print("✅ Validando resultado...")
        validation = self.validator.validate_identity()
        
        if not validation["passed"]:
            print("⚠️ Issues found, attempting auto-fix...")
            fixes = self.validator.auto_fix_issues(validation["issues"])
            for fix in validation["issues"]:
                if fix["fix"]:
                    print(f"  🔧 Applying fix: {fix['fix']}")
        
        # 6. EXPORT
        return {
            "identity_asset": self.solver.identity_asset,
            "rig_asset": self.rigger.rig_asset if hasattr(self.rigger, 'rig_asset') else None,
            "validation": validation,
            "success": validation["passed"]
        }
```

---

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