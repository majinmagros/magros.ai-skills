# anim_bp_setup.py — Stage 2: AnimBP (IK Rig ref, Virtual Bones, Foot Locking, Locomotion SM)
# Extraído de SKILL.md (2026-09-09).


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
