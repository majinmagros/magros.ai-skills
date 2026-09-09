# anim_bp_nodes.py — Blueprint Nodes: GetSocketTransform → LineTrace → Branch → TwoBoneIK
# Extraído de SKILL.md (2026-09-09).
ANIM_BP_NODES = {
    "foot_locking": [
        {
            "node": "GetSocketTransform",
            "params": {"SocketName": "vb_fk_r", "SocketSpace": "World"},
            "output": "RightFootTransform"
        },
        {
            "node": "GetSocketTransform",
            "params": {"SocketName": "vb_fk_l", "SocketSpace": "World"},
            "output": "LeftFootTransform"
        },
        {
            "node": "LineTraceByChannel",
            "params": {
                "Start": "RightFootTransform.Location",
                "End": "RightFootTransform.Location - Vector(0,0,200)",
                "TraceChannel": "Visibility",
                "bTraceComplex": True
            },
            "output": "RightFootHit"
        },
        {
            "node": "Branch",
            "params": {"Condition": "RightFootHit.bBlockingHit"},
            "true": [
                {
                    "node": "VectorSubtract",
                    "params": {"A": "RightFootHit.Location", "B": "RightFootTransform.Location"},
                    "output": "RightFootOffset"
                },
                {
                    "node": "TwoBoneIK",
                    "params": {
                        "StartBone": "thigh_r",
                        "EndBone": "foot_r",
                        "TargetLocation": "RightFootTransform.Location + RightFootOffset",
                        "JointTargetLocation": "calf_r"
                    }
                }
            ],
            "false": []
        },
        # Repeat for left foot
    ]
}
