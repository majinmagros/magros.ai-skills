# retarget_pipeline.py — Pipeline completo: ABP Mannequin → MetaHuman AnimBP
# Extraído de SKILL.md (2026-09-09). Orquestra copy_anim_bp + ik_rig_setup +
# retargeter_setup + virtual_bones + foot_locking + complete_anim_bp.


class AnimationRetargetPipeline:
    def __init__(self):
        self.ik_rig_setup = IKRigSetup()
        self.retargeter_setup = RetargeterSetup()
        self.virtual_bones = VirtualBoneSetup()
        self.foot_locking = FootLockingIK()
        self.anim_bp_setup = CompleteAnimBPSetup()

    def retarget_mannequin_to_metahuman(self, metahuman_skeleton):
        """
        Pipeline completo: ABP Mannquin -> MetaHuman AnimBP.
        """
        # 1. Copy ABP Mannquin
        source_abp = unreal.load_asset("/Engine/EngineMeshes/Mannequin/AnimBP_Mannquin")
        target_abp = unreal.EditorAssetLibrary.duplicate_asset(
            source_abp.get_path_name(),
            "/Game/Blueprints/MetaHumans/MM_AnimBP"
        )
        target_abp.target_skeleton = metahuman_skeleton

        # 2. Setup IK Rigs
        source_ik = self.ik_rig_setup.create_ik_rig(
            unreal.load_asset("/Engine/EngineMeshes/Mannequin/Mannequin_Skeleton"),
            "Mannquin_IKRig"
        )

        target_ik = self.ik_rig_setup.create_ik_rig(
            metahuman_skeleton,
            "MetaHuman_IKRig"
        )

        # 3. Setup Retargeter
        retargeter = self.retargeter_setup.setup_retargeter(source_ik, target_ik)

        # 3. Retarget Animations
        source_animations = self._get_mannequin_animations()
        retargeted = []
        for anim in source_animations:
            retargeted_anim = self.retargeter_setup.retarget_animation(anim, metahuman_skeleton)
            retargeted.append(retargeted_anim)

        # 4. Setup AnimBP with retargeted animations
        self.anim_bp_setup.setup_metahuman_anim_bp(target_abp)

        return {
            "anim_bp": target_abp,
            "retargeted_animations": retargeted,
            "virtual_bones": ["vbot", "vb_fk_r", "vb_fk_l", "vb_ik_r", "vb_ik_l"]
        }
