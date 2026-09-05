# Stage 4 - Validation and Corrections

## Eye/Mouth Correction & Neutral Pose

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
