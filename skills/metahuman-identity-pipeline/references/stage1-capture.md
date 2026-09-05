# Stage 1 - Photo Requirements and Capture

## Photo Requirements (Oficial Epic Games)

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

## Photo Validation Script

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
