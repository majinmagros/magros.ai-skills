# foot_locking.py — Stage 4: Foot Locking IK (GetSocket → LineTrace → VectorSubtract → SetBone)
# Extraído de SKILL.md (2026-09-09).


class FootLockingIK:
    def setup_foot_locking(self, anim_bp):
        """
        Configura Foot Locking IK no Animation Blueprint.

        Nodes necessários no AnimGraph:
        1. Get Socket Location (vb_fk_r, vb_fk_l)
        2. Line Trace by Channel (downward)
        3. Vector Math (offset calculation)
        4. Set Bone Location (IK Foot)
        """

        # Blueprint nodes setup (pseudo-code)
        nodes = [
            # Get VB positions
            {"node": "GetSocketLocation", "socket": "vb_fk_r", "output": "RightFootPos"},
            {"node": "GetSocketLocation", "socket": "vb_fk_l", "output": "LeftFootPos"},

            # Line trace down
            {"node": "LineTraceByChannel", "start": "RightFootPos", "end": "RightFootPos - Z(100)", "output": "RightHit"},
            {"node": "LineTraceByChannel", "start": "LeftFootPos", "end": "LeftFootPos - Z(100)", "output": "LeftHit"},

            # Calculate offset
            {"node": "VectorSubtract", "a": "RightHit.Location", "b": "RightFootPos", "output": "RightOffset"},
            {"node": "VectorSubtract", "a": "LeftHit.Location", "b": "LeftFootPos", "output": "LeftOffset"},

            # Apply IK
            {"node": "SetBoneLocation", "bone": "foot_r", "location": "RightFootPos + RightOffset"},
            {"node": "SetBoneLocation", "bone": "foot_l", "location": "LeftFootPos + LeftOffset"}
        ]

        return nodes
