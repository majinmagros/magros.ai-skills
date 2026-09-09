# copy_anim_bp.py — Stage 1: duplica ABP_Mannequin, redireciona skeleton, recompila
# Extraído de SKILL.md (2026-09-09).


class AnimBPCopier:
    def copy_mannequin_anim_bp(self, target_skeleton, bp_name="MM_AnimBP"):
        """
        Copia ABP_Mannquin e retargeta para skeleton MetaHuman.
        """
        # 1. Localiza ABP_Mannquin padrão
        source_abp = unreal.load_asset("/Engine/EngineMeshes/Mannequin/AnimBP_Mannquin")
        if not source_abp:
            raise Exception("ABP_Mannquin not found")

        # 2. Cria cópia
        dest_path = f"/Game/Blueprints/MetaHumans/{bp_name}"
        copied_abp = unreal.EditorAssetLibrary.duplicate_asset(
            source_abp.get_path_name(),
            dest_path
        )

        # 3. Redireciona skeleton
        copied_abp.target_skeleton = target_skeleton

        # 4. Recompila
        unreal.BlueprintEditorLibrary.compile_blueprint(copied_abp)

        return copied_abp
