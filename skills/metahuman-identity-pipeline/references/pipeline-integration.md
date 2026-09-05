# Complete Pipeline Integration

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
