# metahuman_unreal_blueprint_pipeline.py — Pipeline: Mesh → Character BP → AnimBP → Retarget → VB → Foot Locking
# Extraído de SKILL.md (2026-09-09).


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
        print("Iniciando MetaHuman Unreal Blueprint Pipeline...")

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

        print("MetaHuman ready to play!")
