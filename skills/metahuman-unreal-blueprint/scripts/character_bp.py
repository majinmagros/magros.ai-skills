# character_bp.py — Stage 1: Character BP (mesh, camera+spring arm, movement, capsule)
# Extraído de SKILL.md (2026-09-09).


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
