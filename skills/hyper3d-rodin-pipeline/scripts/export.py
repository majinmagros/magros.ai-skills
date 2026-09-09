# export.py — Export pipeline (FBX/GLB/USDZ, MetaHuman, Studio)
# Extraído de SKILL.md (2026-09-09) para progressive disclosure.


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
