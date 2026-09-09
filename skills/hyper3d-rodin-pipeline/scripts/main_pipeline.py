# main_pipeline.py — Pipeline completo end-to-end: Prompt → ChatAvatar → Rodin → Export → MetaHuman
# Extraído de SKILL.md (2026-09-09) para progressive disclosure.
import asyncio

from hyper3d_rodin_pipeline.chatavatar import ChatAvatarPipeline
from hyper3d_rodin_pipeline.rodin import RodinPipeline
from hyper3d_rodin_pipeline.export import ExportPipeline

API_KEY = "SUA_API_KEY"  # Configure via env var em produção


async def run_full_pipeline(prompt: str, reference_image: str = None, output_dir: str = "./output"):
    """Pipeline completo: Prompt → ChatAvatar → Rodin → Export → MetaHuman."""
    chatavatar = ChatAvatarPipeline(api_key=API_KEY)
    rodin = RodinPipeline(api_key=API_KEY)
    export = ExportPipeline(api_key=API_KEY)

    # 1. ChatAvatar - Text-to-Face
    print("Gerando rosto via ChatAvatar...")
    job = chatavatar.generate_face(
        prompt="Realistic male, 30s, strong jawline, blue eyes, short brown hair, slight beard",
        options={"model": "dreamface_v2", "seed": 42}
    )
    face_result = chatavatar.poll_job(job['job_id'])

    # 2. Rodin - Image to 3D (usando imagem gerada ou referência)
    print("Gerando modelo 3D via Rodin...")
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
    print("Exportando para MetaHuman...")
    export_result = export.download_model(
        rodin_result['job_id'],
        format="fbx",
        options={
            "include_rig": True,
            "texture_resolution": 2048,
            "lod_levels": 2
        }
    )

    # 4. Export MetaHuman direto
    metahuman_export = export.export_metahuman(rodin_result['job_id'])

    return {
        "face": face_result,
        "rodin": rodin_result,
        "export": export_result,
        "metahuman": metahuman_export
    }


if __name__ == "__main__":
    result = asyncio.run(run_full_pipeline(
        prompt="Realistic female, 20s, freckles, green eyes, red hair",
        output_dir="./my_character"
    ))
    print(f"Pipeline completo: {result}")
