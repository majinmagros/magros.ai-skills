# Stage 3 - Auto-Rigging and Body Setup

## Auto-Rigging Process

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

## Eye Texture Importance (Crítico!)

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
