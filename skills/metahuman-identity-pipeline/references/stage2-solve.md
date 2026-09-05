# Stage 2 - Identity Solve and Auto-Rigging

## Identity Solve Process

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
