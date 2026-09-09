# retargeter_setup.py — Stage 3: Retargeter source→target IK Rigs + retarget de animação
# Extraído de SKILL.md (2026-09-09).


class RetargeterSetup:
    def setup_retargeter(self, source_ik_rig, target_ik_rig):
        """
        Configura Retargeter entre source e target IK Rigs.
        """
        retargeter = unreal.Retargeter()
        retargeter.source_ik_rig = source_ik_rig
        retargeter.target_ik_rig = target_ik_rig
        retargeter.root_bone = "root"

        # Configura bone mapping
        self._setup_bone_mapping(retargeter)

        return retargeter

    def retarget_animation(self, source_animation, target_skeleton):
        """
        Retargeta animação de source para target skeleton.
        """
        retargeted = self.retargeter.retarget_animation(
            source_animation,
            target_skeleton=target_skeleton
        )
        return retargeted
