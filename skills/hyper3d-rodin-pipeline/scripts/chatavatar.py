# chatavatar.py — ChatAvatar pipeline (text-to-face, image-to-3D)
# Extraído de SKILL.md (2026-09-09) para progressive disclosure.
import json
import time


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
        """Gera rosto a partir de imagem (image-to-3D)."""
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
