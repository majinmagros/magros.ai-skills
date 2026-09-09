# virtual_bones.py — Virtual Bones p/ foot locking: vbot, vb_fk_r/l, vb_ik_r/l
# Extraído de SKILL.md (2026-09-09).


class VirtualBoneSetup:
    def setup_virtual_bones(self, anim_bp):
        """
        Configura Virtual Bones para foot locking no MetaHuman.

        Virtual Bones necessários:
        - vbot (root -> root)
        - vb_fk_r (vbot -> foot_r)
        - vb_fk_l (vbot -> foot_l)
        - vb_ik_r (vbot -> foot_r) - opcional
        - vb_ik_l (vbot -> foot_l) - opcional
        """
        skeleton = anim_bp.target_skeleton

        # 1. vbot (root -> root)
        vbot = self._add_virtual_bone(skeleton, "root", "root", "vbot")

        # 2. Right foot FK
        vb_fk_r = self._add_virtual_bone(skeleton, "vbot", "foot_r", "vb_fk_r")

        # 3. Left foot FK
        vb_fk_l = self._add_virtual_bone(skeleton, "vbot", "foot_l", "vb_fk_l")

        # Optional: IK virtual bones
        vb_ik_r = self._add_virtual_bone(skeleton, "vbot", "foot_r", "vb_ik_r")
        vb_ik_l = self._add_virtual_bone(skeleton, "vbot", "foot_l", "vb_ik_l")

        return {
            "vbot": vbot,
            "vb_fk_r": vb_fk_r,
            "vb_fk_l": vb_fk_l,
            "vb_ik_r": vb_ik_r,
            "vb_ik_l": vb_ik_l
        }

    def _add_virtual_bone(self, skeleton, parent_bone, child_bone, vb_name):
        vb = unreal.VirtualBone()
        vb.parent_bone = parent_bone
        vb.child_bone = child_bone
        vb.virtual_bone_name = vb_name
        return unreal.Skeleton.add_virtual_bone(skeleton, vb)
