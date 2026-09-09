# ik_rig_setup.py — Stage 2: cria IK Rig (bones + chains braços/pernas/spine)
# Extraído de SKILL.md (2026-09-09).


class IKRigSetup:
    def create_ik_rig(self, skeleton, rig_name):
        """
        Cria IK Rig para skeleton.
        """
        ik_rig = unreal.IKRigFactory().factory_create_new(
            f"/Game/IKRigs/{rig_name}",
            skeleton
        )

        controller = unreal.IKRigController(ik_rig)

        # Adiciona bones principais
        bones = [
            "root", "pelvis", "spine_01", "spine_02", "spine_03",
            "spine_04", "spine_05", "neck_01", "head",
            "clavicle_l", "upperarm_l", "lowerarm_l", "hand_l",
            "clavicle_r", "upperarm_r", "lowerarm_r", "hand_r",
            "thigh_l", "calf_l", "foot_l", "ball_l",
            "thigh_r", "calf_r", "foot_r", "ball_r"
        ]

        for bone in bones:
            ik_rig.add_ik_bone(bone)

        # Setup IK chains
        self._setup_chains(ik_rig)

        return ik_rig

    def _setup_chains(self, ik_rig):
        chains = [
            {"name": "arm_l", "root": "clavicle_l", "end": "hand_l", "pole": "lowerarm_l"},
            {"name": "arm_r", "root": "clavicle_r", "end": "hand_r", "pole": "lowerarm_r"},
            {"name": "leg_l", "root": "thigh_l", "end": "foot_l", "pole": "calf_l"},
            {"name": "leg_r", "root": "thigh_r", "end": "foot_r", "pole": "calf_r"},
            {"name": "spine", "root": "pelvis", "end": "head"}
        ]

        for chain in chains:
            ik_rig.add_ik_chain(chain["name"], chain["root"], chain["end"], chain.get("pole"))
