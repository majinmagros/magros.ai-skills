# complete_blueprint_setup.py — Orquestra Character BP + AnimBP + Retarget + VB + Foot Locking + Playable
# Extraído de SKILL.md (2026-09-09).


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
        print("Setting up MetaHuman Blueprint...")

        # 1. CHARACTER BLUEPRINT
        print("Criando Character Blueprint...")
        bp_result = self.bp_setup.create_character_bp(
            skeletal_mesh_asset,
            f"{skeletal_mesh.get_name()}_Character",
            "/Game/Blueprints/MetaHumans"
        )

        # 2. ANIMATION BLUEPRINT
        print("Configurando Animation Blueprint...")
        anim_bp_result = self.anim_bp_setup.setup_animation_blueprint(
            skeletal_mesh_asset,
            f"{skeletal_mesh.get_name()}_AnimBP"
        )

        # 2. ANIMATION RETARGET
        print("Configurando Animation Retargeting...")
        retarget_result = self.retarget.setup_retargeter(
            source_skeleton=unreal.load_asset("/Engine/EngineMeshes/Mannequin/Mannequin_Skeleton"),
            target_skeleton=skeletal_mesh.get_skeleton()
        )

        # 4. VIRTUAL BONES
        print("Configurando Virtual Bones...")
        anim_bp = unreal.load_asset(anim_bp_result["anim_bp_path"])
        vb_result = self.virtual_bones.setup_virtual_bones(anim_bp)

        # 5. FOOT LOCKING
        print("Configurando Foot Locking...")
        self.foot_locking.setup_foot_locking(anim_bp)

        # 5. MAKE PLAYABLE
        print("Finalizando Character Blueprint...")
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

        print("MetaHuman pronto para jogar!")
