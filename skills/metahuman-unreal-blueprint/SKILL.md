---
name: metahuman-unreal-blueprint
description: |
  BP setup: Character BP, Camera, Movement, Animation BP, IK Rig reference, Foot locking, Virtual bones. Baseado no vídeo Joy Dev Studio "3D Face Modeling is a THING OF THE PAST!".
  Use quando: "metahuman blueprint setup", "metahuman character blueprint", "metahuman unreal blueprint", "metahuman character bp", "metahuman anim bp", "metahuman camera setup", "metahuman movement setup", "metahuman ik rig reference".
  Não use para: MetaHuman Identity Solve (use metahuman-identity-pipeline), Animation retarget (use metahuman-animation-retarget), MetaHuman to Unreal (use metahuman-to-unreal-pipeline).
  Outcome: Blueprint setup completo: Character BP (Camera, Movement, Mesh), Animation BP (Retarget, IK Rig, Virtual Bones, Foot Locking), IK Rig reference, MetaHuman ready to play.
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=J2LkNI2MzKM (Joy Dev Studio video)
    - https://docs.unrealengine.com/5.7/en-US/metaHumanBlueprint/
    - https://docs.unrealengine.com/5.7/en-US/metaHumanAnimation/
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# MetaHuman Unreal Blueprint — Blueprint Setup Completo

Blueprint setup completo: Character BP (Camera, Movement, Mesh), Animation BP (Retarget, IK Rig, Virtual Bones, Foot Locking), IK Rig reference, MetaHuman ready to play.

## Quando usar (gatilhos concretos)

- "metahuman blueprint setup"
- "metahuman character blueprint"
- "metahuman unreal blueprint"
- "metahuman character bp"
- "metahuman anim bp"
- "metahuman camera setup"
- "metahuman movement setup"
- "metahuman ik rig reference"

## Quando NÃO usar

- MetaHuman Identity Solve → use `metahuman-identity-pipeline`
- Animation retarget → use `metahuman-animation-retarget`
- MetaHuman to Unreal → use `metahuman-to-unreal-pipeline`

## Pipeline Overview

```
SKELETAL MESH -> CHARACTER BP -> ANIM BP -> IK RIG REF -> VIRTUAL BONES -> FOOT LOCKING -> PLAYABLE
```

## Stage 1: Character Blueprint Setup

```python
# character_bp.py
class MetaHumanCharacterBP:
    def __init__(self):
        self.bp_asset = None
        self.skeletal_mesh = None
    
    def create_character_bp(self, skeletal_mesh_asset, bp_name, destination_path="/Game/Blueprints/MetaHumans"):
        """
        Cria Character Blueprint completo para MetaHuman.
        """
        # 1. Cria Blueprint class
        bp_factory = unreal.BlueprintFactory()
        bp_class = bp_factory.factory_create_new(
            destination_path + "/" + bp_name,
            unreal.Actor,
            unreal.Blueprint,
            bp_name + "_BP"
        )
        
        # 2. Adiciona Skeletal Mesh Component
        mesh_comp = unreal.BlueprintEditorLibrary.add_component(bp_class, unreal.SkeletalMeshComponent, "Mesh")
        unreal.BlueprintEditorLibrary.set_property_value(mesh_comp, "SkeletalMesh", skeletal_mesh_asset)
        
        # 3. Configura Mesh Component
        unreal.BlueprintEditorLibrary.set_property_value(mesh_comp, "RelativeLocation", unreal.Vector(0, 0, 0))
        unreal.BlueprintEditorLibrary.set_property_value(mesh_comp, "RelativeRotation", unreal.Rotator(0, 0, 0))
        unreal.BlueprintEditorLibrary.set_property_value(mesh_comp, "RelativeScale3D", unreal.Vector(1, 1, 1))
        
        # 4. Adiciona Camera Component
        camera_comp = unreal.BlueprintEditorLibrary.add_component(bp_class, unreal.CameraComponent, "Camera")
        unreal.BlueprintEditorLibrary.set_property_value(camera_comp, "RelativeLocation", unreal.Vector(0, 0, 64))
        unreal.BlueprintEditorLibrary.set_property_value(camera_comp, "RelativeRotation", unreal.Rotator(0, 0, 0))
        unreal.BlueprintEditorLibrary.set_property_value(camera_comp, "FieldOfView", 90.0)
        unreal.BlueprintEditorLibrary.set_property_value(camera_comp, "bUsePawnControlRotation", True)
        
        # 5. Adiciona Spring Arm
        spring_arm = unreal.BlueprintEditorLibrary.add_component(bp_class, unreal.SpringArmComponent, "CameraBoom")
        unreal.BlueprintEditorLibrary.set_property_value(spring_arm, "TargetArmLength", 300.0)
        unreal.BlueprintEditorLibrary.set_property_value(spring_arm, "SocketOffset", unreal.Vector(0, 0, 50))
        unreal.BlueprintEditorLibrary.set_property_value(spring_arm, "bUsePawnControlRotation", True)
        unreal.BlueprintEditorLibrary.set_property_value(spring_arm, "bEnableCameraLag", True)
        unreal.BlueprintEditorLibrary.set_property_value(spring_arm, "CameraLagSpeed", 10.0)
        
        # Attach camera to spring arm
        unreal.BlueprintEditorLibrary.set_property_value(camera_comp, "SetupAttachment", spring_arm)
        
        # 6. Setup Movement Component
        movement_comp = unreal.BlueprintEditorLibrary.add_component(bp_class, unreal.CharacterMovementComponent, "Movement")
        unreal.BlueprintEditorLibrary.set_property_value(movement_comp, "MaxWalkSpeed", 600.0)
        unreal.BlueprintEditorLibrary.set_property_value(movement_comp, "MaxWalkSpeedCrouched", 300.0)
        unreal.BlueprintEditorLibrary.set_property_value(movement_comp, "JumpZVelocity", 600.0)
        unreal.BlueprintEditorLibrary.set_property_value(movement_comp, "AirControl", 0.2)
        unreal.BlueprintEditorLibrary.set_property_value(movement_comp, "bOrientRotationToMovement", True)
        unreal.BlueprintEditorLibrary.set_property_value(movement_comp, "RotationRate", unreal.Rotator(0, 540, 0))
        
        # 6. Setup Capsule Component
        capsule = unreal.BlueprintEditorLibrary.get_component_by_class(bp_class, unreal.CapsuleComponent)
        unreal.BlueprintEditorLibrary.set_property_value(capsule, "CapsuleHalfHeight", 96.0)
        unreal.BlueprintEditorLibrary.set_property_value(capsule, "CapsuleRadius", 34.0)
        
        # 7. Configura Mesh como root
        unreal.BlueprintEditorLibrary.set_property_value(bp_class.get_default_object(), "Mesh", skeletal_mesh_asset)
        
        # 5. Compile & Save
        unreal.BlueprintEditorLibrary.compile_blueprint(bp_class)
        unreal.EditorAssetLibrary.save_asset(bp_class.get_path_name())
        
        return {"success": True, "blueprint_path": bp_class.get_path_name()}
```

## Stage 2: Animation Blueprint Setup

```python
# anim_bp_setup.py
class MetaHumanAnimBPSetup:
    def __init__(self):
        self.bp_asset = None
    
    def setup_animation_blueprint(self, skeletal_mesh_asset, bp_name="MM_AnimBP", destination_path="/Game/Blueprints/MetaHumans"):
        """
        Configura Animation Blueprint completo para MetaHuman.
        """
        # 1. Cria Animation Blueprint
        anim_bp_factory = unreal.AnimBlueprintFactory()
        anim_bp = anim_bp_factory.factory_create_new(
            destination_path + "/" + bp_name,
            unreal.AnimBlueprint,
            skeletal_mesh_asset
        )
        
        # 2. Configura IK Rig Reference
        self._setup_ik_rig_reference(anim_bp)
        
        # 3. Setup Virtual Bones
        vb_setup = VirtualBoneSetup()
        vb_result = vb_setup.setup_virtual_bones(anim_bp)
        
        # 4. Setup Foot Locking IK
        foot_lock = FootLockingIK()
        foot_lock.setup_foot_locking(anim_bp)
        
        # 4. Configura Locomotion State Machine
        self._setup_locomotion_state_machine(anim_bp)
        
        return {
            "success": True,
            "anim_bp_path": anim_bp.get_path_name(),
            "virtual_bones": vb_result
        }
    
    def _setup_ik_rig_reference(self, anim_bp):
        """Adiciona referência ao IK Rig no AnimBP."""
        # Adiciona variável IK Rig
        ik_rig_var = unreal.BlueprintEditorLibrary.add_member_variable(
            anim_bp,
            "IKRigReference",
            unreal.ObjectProperty,
            unreal.IKRig
        )
        
        # Define default value se IK Rig existir
        ik_rig = unreal.load_asset("/Game/IKRigs/MetaHuman_IKRig")
        if ik_rig:
            unreal.BlueprintEditorLibrary.set_default_value(ik_rig_var, ik_rig)
    
    def _setup_locomotion_state_machine(self, anim_bp):
        """Configura State Machine de locomoção completa."""
        # 1. Abre AnimGraph
        anim_graph = unreal.AnimationBlueprintEditor.get_anim_graph(anim_bp)
        
        # 2. Cria State Machine
        state_machine = unreal.AnimationBlueprintEditor.add_state_machine(anim_graph, "Locomotion")
        
        # 2. Estados
        states = {
            "Idle": {"transitions": ["Walk", "Run", "Crouch"]},
            "Walk": {"transitions": ["Idle", "Run", "Crouch"]},
            "Run": {"transitions": ["Walk", "Idle", "Crouch"]},
            "Crouch": {"transitions": ["Idle", "Walk"]},
            "Jump": {"transitions": ["Fall"]},
            "Fall": {"transitions": ["Idle", "Land"]}
        }
        
        for state_name, config in states.items():
            state = unreal.AnimationBlueprintEditor.add_state(state_machine, state_name)
            # Adiciona animações ao estado
            # ...
        
        # 3. Transições baseadas em Speed, IsInAir, IsCrouching
        # Speed > 0 && !IsInAir && !IsCrouching -> Walk
        # Speed > 300 && !IsInAir -> Run
        # IsInAir -> Jump/Fall
        # IsCrouching -> Crouch
```

## Stage 2: Virtual Bones & Foot Locking

```python
# virtual_bones_footlocking.py
class VirtualBoneSetup:
    def setup_virtual_bones(self, anim_bp):
        """
        Configura Virtual Bones para foot locking no MetaHuman.
        
        Virtual Bones necessários (convenção MetaHuman):
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

## Foot Locking IK

```python
# foot_locking_ik.py
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
```

## Complete Blueprint Setup

```python
# complete_blueprint_setup.py
class CompleteMetaHumanBlueprintSetup:
    def __init__(self):
        self.bp_setup = MetaHumanCharacterBP()
        self.anim_bp_setup = MetaHumanAnimBPSetup()
        self.retarget = MetaHumanAnimationRetarget()
        self.virtual_bones = VirtualBoneSetup()
        self.foot_locking = FootLockingIK()
    
    def setup_complete_metahuman(self, skeletal_mesh_asset, project_path="/Game/MetaHumans"):
        """
        Pipeline completo de setup Blueprint MetaHuman.
        """
        print("🚀 Setting up MetaHuman Blueprint...")
        
        # 1. CHARACTER BLUEPRINT
        print("📋 Criando Character Blueprint...")
        bp_result = self.bp_setup.create_character_bp(
            skeletal_mesh_asset,
            f"{skeletal_mesh.get_name()}_Character",
            "/Game/Blueprints/MetaHumans"
        )
        
        # 2. ANIMATION BLUEPRINT
        print("🎬 Configurando Animation Blueprint...")
        anim_bp_result = self.anim_bp_setup.setup_animation_blueprint(
            skeletal_mesh_asset,
            f"{skeletal_mesh.get_name()}_AnimBP"
        )
        
        # 2. ANIMATION RETARGET
        print("🎭 Configurando Animation Retargeting...")
        retarget_result = self.retarget.setup_retargeter(
            source_skeleton=unreal.load_asset("/Engine/EngineMeshes/Mannequin/Mannequin_Skeleton"),
            target_skeleton=skeletal_mesh.get_skeleton()
        )
        
        # 4. VIRTUAL BONES
        print("🦶 Configurando Virtual Bones...")
        anim_bp = unreal.load_asset(anim_bp_result["anim_bp_path"])
        vb_result = self.virtual_bones.setup_virtual_bones(anim_bp)
        
        # 5. FOOT LOCKING
        print("🦶 Configurando Foot Locking...")
        self.foot_locking.setup_foot_locking(anim_bp)
        
        # 5. MAKE PLAYABLE
        print("🎮 Finalizando Character Blueprint...")
        self._make_playable(bp_result["blueprint_path"])
        
        return {
            "success": True,
            "character_bp": bp_result["blueprint_path"],
            "anim_bp": anim_bp_result["anim_bp_path"],
            "virtual_bones": vb_result,
            "message": "MetaHuman Blueprint pronto para jogar!"
        }
    
    def _make_playable(self, bp_path):
        """Finaliza setup para jogabilidade."""
        bp = unreal.load_asset(bp_path)
        
        # Set as default pawn in GameMode
        game_mode = unreal.load_asset("/Game/Blueprints/GameModes/BP_GameMode")
        if game_mode:
            unreal.EditorUtilityLibrary.set_property_value(
                game_mode, "DefaultPawnClass", 
                unreal.load_asset(bp_path).generated_class()
            )
            unreal.EditorAssetLibrary.save_asset(game_mode.get_path_name())
        
        print("✅ MetaHuman pronto para jogar!")
```

## Complete Pipeline Integration

```python
# metahuman_unreal_blueprint_pipeline.py
class MetaHumanUnrealBlueprintPipeline:
    def __init__(self):
        self.character_bp = MetaHumanCharacterBP()
        self.anim_bp = MetaHumanAnimBPSetup()
        self.retarget = MetaHumanAnimationRetarget()
        self.virtual_bones = VirtualBoneSetup()
        self.foot_locking = FootLockingIK()
    
    def setup_complete_metahuman(self, skeletal_mesh_asset, project_path="/Game/MetaHumans"):
        """
        Pipeline completo: Skeletal Mesh -> Character BP -> Anim BP -> Retarget -> Virtual Bones -> Foot Locking
        """
        print("🚀 Iniciando MetaHuman Unreal Blueprint Pipeline...")
        
        # 1. CHARACTER BLUEPRINT
        bp_result = self.character_bp.create_character_bp(
            skeletal_mesh_asset,
            f"{skeletal_mesh.get_name()}_Character",
            project_path + "/Blueprints"
        )
        
        # 2. ANIMATION BLUEPRINT
        anim_bp_result = self.anim_bp.setup_animation_blueprint(
            skeletal_mesh_asset,
            f"{skeletal_mesh.get_name()}_AnimBP",
            project_path + "/Blueprints"
        )
        
        # 3. ANIMATION RETARGET
        retarget_result = self.retarget.setup_retargeter(
            source_skeleton=unreal.load_asset("/Engine/EngineMeshes/Mannequin/Mannequin_Skeleton"),
            target_skeleton=skeletal_mesh.get_skeleton()
        )
        
        # 4. VIRTUAL BONES
        anim_bp = unreal.load_asset(anim_bp_result["anim_bp_path"])
        vb_result = self.virtual_bones.setup_virtual_bones(anim_bp)
        
        # 4. FOOT LOCKING
        self.foot_locking.setup_foot_locking(anim_bp)
        
        # 5. MAKE PLAYABLE
        self._make_playable(bp_result["blueprint_path"])
        
        return {
            "success": True,
            "character_bp": bp_result["blueprint_path"],
            "anim_bp": anim_bp_result["anim_bp_path"],
            "retargeter": retarget_result["retargeter"],
            "virtual_bones": vb_result,
            "message": "MetaHuman Blueprint ready to play!"
        }
    
    def _make_playable(self, bp_path):
        bp = unreal.load_asset(bp_path)
        game_mode = unreal.load_asset("/Game/Blueprints/GameModes/BP_GameMode")
        if game_mode:
            unreal.EditorUtilityLibrary.set_property_value(
                game_mode, "DefaultPawnClass", 
                unreal.load_asset(bp_path).generated_class()
            )
            unreal.EditorAssetLibrary.save_asset(game_mode.get_path_name())
        
        print("✅ MetaHuman ready to play!")
```

---

## Referências Oficiais (Validados 2026-08-30)

- [Joy Dev Studio Video](https://www.youtube.com/watch?v=J2LkNI2MzKM)
- [MetaHuman Blueprint Documentation](https://docs.unrealengine.com/5.7/en-US/metaHumanBlueprint/)
- [MetaHuman Animation](https://docs.unrealengine.com/5.7/en-US/metaHumanAnimation/)

---

## Checklist de Entrega

- [ ] `character_bp.py` — Character BP creation
- [ ] `anim_bp_setup.py` — AnimBP setup (IK Rig, Virtual Bones, Foot Locking)
- [ ] `animation_retarget.py` — Animation retarget (IK Rig, Retargeter)
- [ ] `virtual_bones.py` — Virtual bones (vbot, vb_fk_r, vb_fk_l, vb_ik_r, vb_ik_l)
- [ ] `foot_locking.py` — Foot locking IK implementation
- [ ] `complete_blueprint_setup.py` — Complete pipeline orchestration
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