---
name: metahuman-animation-retarget
description: |
  Retarget ABP mannequin to MetaHuman: animation blueprint copy, virtual bones (vbot, vbfk, vbik_fot, vbkf_r/l), foot locking. Baseado no vídeo Joy Dev Studio "3D Face Modeling is a THING OF THE PAST!".
  Use quando: "metahuman animation retarget", "metahuman animation retargeting", "metahuman abp retarget", "metahuman animation blueprint retarget", "metahuman foot locking", "metahuman virtual bones", "metahuman vbot", "metahuman vbik".
  Não use para: MetaHuman Identity Solve (use metahuman-identity-pipeline), MetaHuman to Unreal (use metahuman-to-unreal-pipeline), MetaHuman Blueprint setup (use metahuman-unreal-blueprint).
  Outcome: Retarget ABP mannequin to MetaHuman: animation blueprint copy, virtual bones (vbot, vbfk, vbik_fot, vbkf_r/l), foot locking, animation blueprint copy.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=J2LkNI2MzKM (Joy Dev Studio video)
    - https://docs.unrealengine.com/5.7/en-US/animationRetargeting/
    - https://docs.unrealengine.com/5.7/en-US/ikRig/
    - https://docs.unrealengine.com/5.7/en-US/metaHumanAnimation/
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# MetaHuman Animation Retarget — Retarget ABP Mannequin to MetaHuman

Retarget **ABP mannequin to MetaHuman**: animation blueprint copy, virtual bones (vbot, vbfk, vbik_fot, vbkf_r/l), foot locking, animation blueprint copy.

## Quando usar (gatilhos concretos)

- "metahuman animation retarget"
- "metahuman animation retargeting"
- "metahuman abp retarget"
- "metahuman animation blueprint retarget"
- "metahuman foot locking"
- "metahuman virtual bones"
- "metahuman vbot"
- "metahuman vbik"

## Quando NÃO usar

- MetaHuman Identity Solve → use `metahuman-identity-pipeline`
- MetaHuman to Unreal → use `metahuman-to-unreal-pipeline`
- MetaHuman Blueprint setup → use `metahuman-unreal-blueprint`

## Pipeline Overview

```
ABP MANNEQUIN -> COPY ANIM BP -> RETARGETER -> VIRTUAL BONES -> FOOT LOCKING -> METAHUMAN ANIM BP
```

## Stage 1: Copy Animation Blueprint

```python
# copy_anim_bp.py
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
```

## Stage 2: IK Rig Setup

```python
# ik_rig_setup.py
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
```

## Stage 3: Retargeter Setup

```python
# retargeter_setup.py
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
```

## Stage 3: Virtual Bones (Foot Locking)

```python
# virtual_bones.py
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

## Stage 4: Foot Locking IK

```python
# foot_locking.py
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

## Blueprint Nodes Implementation

```python
# anim_bp_nodes.py
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
```

## Complete AnimBP Setup

```python
# complete_anim_bp.py
class CompleteAnimBPSetup:
    def setup_metahuman_anim_bp(self, anim_bp_asset):
        """
        Setup completo do Animation Blueprint MetaHuman.
        """
        editor = unreal.AnimationBlueprintEditor(anim_bp_asset)
        
        # 1. Setup Virtual Bones
        vb_setup = VirtualBoneSetup()
        vb_result = vb_setup.setup_virtual_bones(anim_bp_asset)
        
        # 2. Setup Foot Locking IK
        foot_lock = FootLockingIK()
        foot_lock.setup_foot_locking(anim_bp_asset)
        
        # 3. Setup IK Rig reference
        self._setup_ik_rig_reference(anim_bp_asset)
        
        # 4. Configure Locomotion State Machine
        self._setup_locomotion_state_machine(anim_bp_asset)
        
        return {"success": True, "virtual_bones": vb_result}
    
    def _setup_ik_rig_reference(self, anim_bp):
        """Adiciona referência ao IK Rig no AnimBP."""
        # Add IK Rig reference in AnimBP
        pass
    
    def _setup_locomotion_state_machine(self, anim_bp):
        """Configura State Machine de locomoção."""
        # States: Idle, Walk, Run, Crouch, Jump, Fall
        # Transitions based on Speed, IsInAir, IsCrouching
        pass
```

## Complete Animation Retarget Pipeline

```python
# retarget_pipeline.py
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
```

---

## Referências Oficiais (Validados 2026-08-30)

- [Joy Dev Studio Video](https://www.youtube.com/watch?v=J2LkNI2MzKM)
- [Unreal Engine Animation Retargeting](https://docs.unrealengine.com/5.7/en-US/animationRetargeting/)
- [IK Rig Documentation](https://docs.unrealengine.com/5.7/en-US/ikRig/)
- [MetaHuman Animation](https://docs.unrealengine.com/5.7/en-US/metaHumanAnimation/)

---

## Checklist de Entrega

- [ ] `ik_rig_setup.py` - IK Rig creation
- [ ] `retargeter_setup.py` - Retargeter configuration
- [ ] `virtual_bones.py` - Virtual bones (vbot, vb_fk_r, vb_fk_l, vb_ik_r, vb_ik_l)
- [ ] `foot_locking.py` - Foot locking IK implementation
- [ ] `anim_bp_nodes.py` - Animation Blueprint nodes
- [ ] `complete_anim_bp.py` - Complete AnimBP setup
- [ ] `retarget_pipeline.py` - Complete pipeline
- [ ] Testes de integração com Unreal Engine 5.7+
- [ ] Documentação de uso

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   ├── commands/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```