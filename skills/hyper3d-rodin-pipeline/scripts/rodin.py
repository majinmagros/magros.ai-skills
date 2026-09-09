# rodin.py — Rodin pipeline (image-to-3D, model versions)
# Extraído de SKILL.md (2026-09-09) para progressive disclosure.


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
