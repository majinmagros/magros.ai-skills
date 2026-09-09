# foot_locking_ik.py — Foot Locking IK: GetSocketTransform → LineTrace → Branch → TwoBoneIK
# Extraído de SKILL.md (2026-09-09).


class FootLockingIK:
    def setup_foot_locking(self, anim_bp):
        """
        Configura Foot Locking IK no Animation Blueprint.

        Nodes no AnimGraph:
        1. Get Socket Transform (vb_fk_r, vb_fk_l)
        2. Line Trace by Channel (downward)
        3. Vector Math (offset calculation)
        4. TwoBoneIK (foot_r, foot_l)
        """

        # Blueprint nodes pseudo-code
        nodes = [
            # Get VB positions
            {"node": "GetSocketTransform", "params": {"SocketName": "vb_fk_r"}, "output": "RightFootTransform"},
            {"node": "GetSocketTransform", "params": {"SocketName": "vb_fk_l"}, "output": "LeftFootTransform"},

            # Line trace down
            {"node": "LineTraceByChannel",
             "params": {"Start": "RightFootTransform.Location", "End": "RightFootTransform.Location - Z(200)", "TraceChannel": "Visibility"},
             "output": "RightFootHit"},
            {"node": "LineTraceByChannel",
             "params": {"Start": "LeftFootTransform.Location", "End": "LeftFootTransform.Location - Z(200)", "TraceChannel": "Visibility"},
             "output": "LeftFootHit"},

            # Calculate offset
            {"node": "Branch", "params": {"Condition": "RightFootHit.bBlockingHit"}},
            {"true": [
                {"node": "VectorSubtract", "params": {"A": "RightFootHit.Location", "b": "RightFootTransform.Location"}, "output": "RightOffset"},
                {"node": "TwoBoneIK", "params": {"StartBone": "thigh_r", "EndBone": "foot_r", "TargetLocation": "RightFootTransform.Location + RightOffset"}}
            ]},
            {"false": []},

            # Left foot same logic
            {"node": "Branch", "params": {"Condition": "LeftFootHit.bBlockingHit"}},
            {"true": [
                {"node": "VectorSubtract", "params": {"A": "LeftFootHit.Location", "b": "LeftFootTransform.Location"}, "output": "LeftOffset"},
                {"node": "TwoBoneIK", "params": {"StartBone": "thigh_l", "EndBone": "foot_l", "TargetLocation": "LeftFootTransform.Location + LeftOffset"}}
            ]},
            {"false": []}
        ]

        return nodes
