"""
FiveM/RageMP Adapter — GTA V NPC AI Integration
Connects NPC AI core to FiveM (C#/Lua) and RageMP (C#/TypeScript) for GTA V.
"""

from __future__ import annotations
import asyncio
import time
import threading
import json
import socket
from typing import Optional
from dataclasses import dataclass, field
from abc import ABC
from enum import Enum
from pathlib import Path

# These would be actual FiveM/RageMP Python bridges in production
# For now, we define the interface and mock implementations
try:
    import fivem  # Hypothetical FiveM Python bridge
    FIVEM_AVAILABLE = True
except ImportError:
    FIVEM_AVAILABLE = False

try:
    import ragemp  # Hypothetical RageMP Python bridge
    RAGEMP_AVAILABLE = True
except ImportError:
    RAGEMP_AVAILABLE = False


class GamePlatform(Enum):
    FIVEM = "fivem"
    RAGEMP = "ragemp"


@dataclass
class Vector3:
    """3D vector for GTA coordinates."""
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0

    def distance_to(self, other: Vector3) -> float:
        dx = self.x - other.x
        dy = self.y - other.y
        dz = self.z - other.z
        return (dx*dx + dy*dy + dz*dz) ** 0.5

    def to_tuple(self) -> tuple[float, float, float]:
        return (self.x, self.y, self.z)

    @classmethod
    def from_tuple(cls, t: tuple) -> Vector3:
        return cls(t[0], t[1], t[2])


@dataclass
class Ped:
    """GTA Ped (NPC or player)."""
    handle: int
    model: str
    position: Vector3
    heading: float = 0.0
    health: float = 100.0
    max_health: float = 100.0
    armor: float = 0.0
    is_player: bool = False
    vehicle: Optional[int] = None
    weapons: dict = field(default_factory=dict)
    current_weapon: Optional[str] = None


@dataclass
class Vehicle:
    """GTA Vehicle."""
    handle: int
    model: str
    position: Vector3
    heading: float = 0.0
    health: float = 1000.0
    max_health: float = 1000.0
    driver: Optional[int] = None
    passengers: list[int] = field(default_factory=list)


class GTAWorldAdapter(ABC):
    """Abstract adapter for GTA world interaction."""

    @abstractmethod
    def get_ped_position(self, handle: int) -> Vector3:
        pass

    @abstractmethod
    def get_ped_health(self, handle: int) -> tuple[float, float]:
        pass

    @abstractmethod
    def get_nearby_peds(self, position: Vector3, radius: float) -> list[Ped]:
        pass

    @abstractmethod
    def get_nearby_vehicles(self, position: Vector3, radius: float) -> list[Vehicle]:
        pass

    @abstractmethod
    def set_ped_position(self, handle: int, position: Vector3) -> None:
        pass

    @abstractmethod
    def task_go_to(self, handle: int, position: Vector3, speed: float = 1.0) -> None:
        pass

    @abstractmethod
    def task_combat(self, handle: int, target_handle: int) -> None:
        pass

    @abstractmethod
    def task_flee(self, handle: int, from_position: Vector3) -> None:
        pass

    @abstractmethod
    def play_animation(self, handle: int, dict_name: str, anim_name: str, duration: float) -> None:
        pass

    @abstractmethod
    def give_weapon(self, handle: int, weapon_hash: str, ammo: int) -> None:
        pass

    @abstractmethod
    def set_ped_relationship(self, handle: int, group_hash: str, relationship: int) -> None:
        pass

    @abstractmethod
    def send_chat_message(self, message: str, team: bool = False) -> None:
        pass

    @abstractmethod
    def register_command(self, name: str, handler: callable) -> None:
        pass

    @abstractmethod
    def trigger_server_event(self, event_name: str, *args) -> None:
        pass

    @abstractmethod
    def on_server_event(self, event_name: str, handler: callable) -> None:
        pass


class FiveMAdapter(GTAWorldAdapter):
    """FiveM-specific adapter using Lua/C# bridge."""

    def __init__(self, resource_name: str = "npc_ai"):
        self.resource_name = resource_name
        self._event_handlers: dict[str, list[callable]] = {}
        self._command_handlers: dict[str, callable] = {}
        self._setup_native_exports()

    def _setup_native_exports(self) -> None:
        """Set up exports for Lua/C# communication."""
        # In real implementation, this would register with FiveM's export system
        pass

    def get_ped_position(self, handle: int) -> Vector3:
        # Native: GetEntityCoords(handle, false)
        # Returns vector3
        raise NotImplementedError("Requires FiveM runtime")

    def get_ped_health(self, handle: int) -> tuple[float, float]:
        # Native: GetEntityHealth(handle), GetPedMaxHealth(handle)
        raise NotImplementedError("Requires FiveM runtime")

    def get_nearby_peds(self, position: Vector3, radius: float) -> list[Ped]:
        # Native: GetPedNearbyPeds or worldGetAllPeds with distance check
        raise NotImplementedError("Requires FiveM runtime")

    def get_nearby_vehicles(self, position: Vector3, radius: float) -> list[Vehicle]:
        raise NotImplementedError("Requires FiveM runtime")

    def set_ped_position(self, handle: int, position: Vector3) -> None:
        # Native: SetEntityCoords(handle, x, y, z, false, false, false, false)
        raise NotImplementedError("Requires FiveM runtime")

    def task_go_to(self, handle: int, position: Vector3, speed: float = 1.0) -> None:
        # Native: TaskGoStraightToCoord or TaskFollowNavMeshToCoord
        raise NotImplementedError("Requires FiveM runtime")

    def task_combat(self, handle: int, target_handle: int) -> None:
        # Native: TaskCombatPed
        raise NotImplementedError("Requires FiveM runtime")

    def task_flee(self, handle: int, from_position: Vector3) -> None:
        # Native: TaskSmartFleePed or TaskFleeFromCoord
        raise NotImplementedError("Requires FiveM runtime")

    def play_animation(self, handle: int, dict_name: str, anim_name: str, duration: float) -> None:
        # Native: RequestAnimDict, TaskPlayAnim
        raise NotImplementedError("Requires FiveM runtime")

    def give_weapon(self, handle: int, weapon_hash: str, ammo: int) -> None:
        # Native: GiveWeaponToPed
        raise NotImplementedError("Requires FiveM runtime")

    def set_ped_relationship(self, handle: int, group_hash: str, relationship: int) -> None:
        # Native: SetPedRelationshipGroupHash, SetRelationshipBetweenGroups
        raise NotImplementedError("Requires FiveM runtime")

    def send_chat_message(self, message: str, team: bool = False) -> None:
        # Native: TriggerEvent('chat:addMessage', ...) or exports.chat:addMessage
        raise NotImplementedError("Requires FiveM runtime")

    def register_command(self, name: str, handler: callable) -> None:
        self._command_handlers[name] = handler
        # Native: RegisterCommand(name, handler, false)

    def trigger_server_event(self, event_name: str, *args) -> None:
        # Native: TriggerServerEvent(event_name, ...)
        raise NotImplementedError("Requires FiveM runtime")

    def on_server_event(self, event_name: str, handler: callable) -> None:
        if event_name not in self._event_handlers:
            self._event_handlers[event_name] = []
        self._event_handlers[event_name].append(handler)
        # Native: RegisterNetEvent(event_name), AddEventHandler(event_name, handler)


class RageMPAdapter(GTAWorldAdapter):
    """RageMP-specific adapter using C#/TypeScript bridge."""

    def __init__(self, package_name: str = "npc_ai"):
        self.package_name = package_name
        self._event_handlers: dict[str, list[callable]] = {}
        self._command_handlers: dict[str, callable] = {}

    def get_ped_position(self, handle: int) -> Vector3:
        # Native: player.position or entity.position
        raise NotImplementedError("Requires RageMP runtime")

    def get_ped_health(self, handle: int) -> tuple[float, float]:
        # Native: player.health, player.maxHealth
        raise NotImplementedError("Requires RageMP runtime")

    def get_nearby_peds(self, position: Vector3, radius: float) -> list[Ped]:
        # Native: mp.peds.toArray() with distance filter
        raise NotImplementedError("Requires RageMP runtime")

    def get_nearby_vehicles(self, position: Vector3, radius: float) -> list[Vehicle]:
        raise NotImplementedError("Requires RageMP runtime")

    def set_ped_position(self, handle: int, position: Vector3) -> None:
        # Native: player.position = new mp.Vector3(x, y, z)
        raise NotImplementedError("Requires RageMP runtime")

    def task_go_to(self, handle: int, position: Vector3, speed: float = 1.0) -> None:
        # Native: player.taskGoStraightToCoord or AI::TASK_FOLLOW_NAV_MESH_TO_COORD
        raise NotImplementedError("Requires RageMP runtime")

    def task_combat(self, handle: int, target_handle: int) -> None:
        # Native: AI::TASK_COMBAT_PED
        raise NotImplementedError("Requires RageMP runtime")

    def task_flee(self, handle: int, from_position: Vector3) -> None:
        # Native: AI::TASK_SMART_FLEE_PED
        raise NotImplementedError("Requires RageMP runtime")

    def play_animation(self, handle: int, dict_name: str, anim_name: str, duration: float) -> None:
        # Native: player.playAnimation(dict, anim, duration)
        raise NotImplementedError("Requires RageMP runtime")

    def give_weapon(self, handle: int, weapon_hash: str, ammo: int) -> None:
        # Native: player.giveWeapon(weaponHash, ammo)
        raise NotImplementedError("Requires RageMP runtime")

    def set_ped_relationship(self, handle: int, group_hash: str, relationship: int) -> None:
        # Native: player.setRelationshipGroup(hash), mp.game.relationship.setRelationshipBetweenGroups
        raise NotImplementedError("Requires RageMP runtime")

    def send_chat_message(self, message: str, team: bool = False) -> None:
        # Native: mp.events.callRemote('chat:send', message) or chat API
        raise NotImplementedError("Requires RageMP runtime")

    def register_command(self, name: str, handler: callable) -> None:
        self._command_handlers[name] = handler
        # Native: mp.events.addCommand(name, handler)

    def trigger_server_event(self, event_name: str, *args) -> None:
        # Native: mp.events.callRemote(event_name, ...args)
        raise NotImplementedError("Requires RageMP runtime")

    def on_server_event(self, event_name: str, handler: callable) -> None:
        if event_name not in self._event_handlers:
            self._event_handlers[event_name] = []
        self._event_handlers[event_name].append(handler)
        # Native: mp.events.add(event_name, handler)


@dataclass
class FiveMNPCConfig:
    """Configuration for FiveM/RageMP NPC."""
    platform: GamePlatform = GamePlatform.FIVEM
    model: str = "a_m_y_business_01"
    spawn_position: Vector3 = field(default_factory=lambda: Vector3(0, 0, 72))
    personality_preset: str = "city_guard"
    memory_path: Optional[str] = None
    weapon_loadout: list[str] = field(default_factory=lambda: ["WEAPON_PISTOL", "WEAPON_BAT"])
    relationship_group: str = "CIVMALE"
    voice_name: str = "GENERIC_HI"  # GTA voice
    auto_spawn: bool = True
    sync_interval: float = 0.1  # 100ms for GTA


class FiveMNPC:
    """Main NPC class for FiveM/RageMP integrating all AI systems."""

    def __init__(self, config: FiveMNPCConfig):
        self.config = config
        self.handle: Optional[int] = None
        self.running = False
        self._thread: Optional[threading.Thread] = None
        self._loop: Optional[asyncio.AbstractEventLoop] = None

        # Select platform adapter
        if config.platform == GamePlatform.FIVEM:
            self.adapter = FiveMAdapter()
        else:
            self.adapter = RageMPAdapter()

        # Core AI systems (imported from sibling modules)
        from .npc_memory import MemoryManager
        from .personality_engine import PersonalityProfile, RelationshipManager
        from .world_state_sync import WorldState, WorldStateSync, Position, InventoryItem, Quest, QuestStatus, Faction
        from .multiplayer_coord import PartyManager, PartyMember, PartyRole, CombatState, TacticalCallout

        memory_path = config.memory_path or f"./npc_memory_{config.model}"
        self.memory = MemoryManager(Path(memory_path))
        self.personality = PersonalityProfile.from_preset(config.personality_preset)
        self.relationships = RelationshipManager()
        self.world_state = WorldState(config.model)

        # World sync
        self.world_sync: Optional[GTAWorldSync] = None

        # Party coordination
        self.party: Optional[PartyManager] = None

        # GTA-specific state
        self.current_vehicle: Optional[int] = None
        self.combat_target: Optional[int] = None
        self.patrol_route: list[Vector3] = []
        self.patrol_index: int = 0
        self.is_patrolling: bool = False

        # LLM integration
        self.llm_client = None
        self.llm_config = {
            'model': 'gpt-4o-mini',
            'temperature': 0.7,
            'max_tokens': 300  # Shorter for GTA chat
        }

    def spawn(self) -> int:
        """Spawn the NPC ped in the world."""
        # In real implementation:
        # self.handle = CreatePed(4, GetHashKey(self.config.model),
        #                        self.config.spawn_position.x, self.config.spawn_position.y,
        #                        self.config.spawn_position.z, 0.0, True, False)
        # SetPedRelationshipGroupHash(self.handle, GetHashKey(self.config.relationship_group))
        # Give weapons
        # for weapon in self.config.weapon_loadout:
        #     GiveWeaponToPed(self.handle, GetHashKey(weapon), 250, False, True)

        # Set up event handlers
        self._setup_event_handlers()

        # Start world sync
        self.world_sync = GTAWorldSync(self.adapter, self.world_state, self.config.sync_interval)
        self.world_sync.start()

        self.running = True
        print(f"[{self.config.model}] NPC spawned at {self.config.spawn_position.to_tuple()}")
        return self.handle or 0

    def _setup_event_handlers(self) -> None:
        """Set up game event handlers."""
        # Chat messages
        self.adapter.on_server_event('chatMessage', self._on_chat_message)
        self.adapter.on_server_event('playerChat', self._on_chat_message)

        # Damage events
        self.adapter.on_server_event('entityDamaged', self._on_entity_damaged)

        # Death events
        self.adapter.on_server_event('entityDied', self._on_entity_died)

        # Player join/leave
        self.adapter.on_server_event('playerJoining', self._on_player_joining)
        self.adapter.on_server_event('playerDropped', self._on_player_dropped)

        # Commands
        self.adapter.register_command('npc_talk', self._cmd_talk)
        self.adapter.register_command('npc_follow', self._cmd_follow)
        self.adapter.register_command('npc_patrol', self._cmd_patrol)

    def _on_chat_message(self, source_id: str, message: str, *args) -> None:
        """Handle chat messages from players."""
        # Record in memory
        pos = self.adapter.get_ped_position(self.handle) if self.handle else self.config.spawn_position
        self.memory.record_event(
            event_type="dialogue",
            description=f"{source_id}: {message}",
            location=pos.to_tuple(),
            participants=[source_id],
            emotional_valence=0.0,
            importance=0.5
        )

        # Update relationship
        self.relationships.modify(source_id, 0.1, "chat_interaction")

        # Check if addressed to NPC
        if self._is_addressed_to_npc(message):
            self._process_player_message(source_id, message)

    def _on_entity_damaged(self, victim: int, attacker: int, weapon: int, damage: float) -> None:
        """Handle damage events."""
        if victim == self.handle:
            # NPC took damage
            self.memory.record_event(
                event_type="combat",
                description=f"Took {damage} damage from {attacker} with weapon {weapon}",
                location=self.adapter.get_ped_position(self.handle).to_tuple(),
                participants=[str(attacker)],
                emotional_valence=-0.5,
                importance=0.8
            )
            self.relationships.modify(str(attacker), -10.0, "damaged_me")

            # React based on personality
            bravery = self.personality.get_trait("bravery")
            if bravery and bravery < 0.0:
                # Cowardly - flee
                self.adapter.task_flee(self.handle, self.adapter.get_ped_position(attacker))
            elif bravery and bravery > 0.5:
                # Brave - fight back
                self.adapter.task_combat(self.handle, attacker)
                self.combat_target = attacker

    def _on_entity_died(self, victim: int, killer: int) -> None:
        """Handle death events."""
        if victim == self.handle:
            # NPC died
            self.memory.record_event(
                event_type="combat",
                description=f"Killed by {killer}",
                location=self.adapter.get_ped_position(self.handle).to_tuple(),
                participants=[str(killer)],
                emotional_valence=-1.0,
                importance=1.0
            )
            # Respawn logic would go here

    def _on_player_joining(self, player_id: str) -> None:
        """Handle player joining."""
        self.relationships.modify(player_id, 0.0, "player_joined")

    def _on_player_dropped(self, player_id: str, reason: str) -> None:
        """Handle player leaving."""
        pass

    def _is_addressed_to_npc(self, message: str) -> bool:
        """Check if message is addressed to NPC."""
        # In GTA, check for proximity chat or direct mentions
        message_lower = message.lower()
        return any(trigger in message_lower for trigger in ['hey', 'hello', 'hi', 'excuse', 'officer', 'cop', 'guard'])

    def _process_player_message(self, source_id: str, message: str) -> None:
        """Process player message and generate response."""
        response = self._generate_personality_response(source_id, message)
        if response:
            self.adapter.send_chat_message(response)

    def _generate_personality_response(self, source_id: str, message: str) -> Optional[str]:
        """Generate response based on personality."""
        context = self.memory.get_context_for_llm(message)
        style = self.personality.generate_response_style()

        # GTA-specific templates
        templates = {
            'greeting': [
                "What do you want?",
                "Move along, citizen.",
                "Can I help you?",
                "Watch yourself."
            ],
            'hostile': [
                "You're asking for trouble.",
                "Back off, now.",
                "Last warning."
            ],
            'help': [
                "What seems to be the problem?",
                "Describe the situation.",
                "I'm listening."
            ],
            'default': [
                "Hmph.",
                "Right.",
                "Go on."
            ]
        }

        message_lower = message.lower()
        rel = self.relationships.get_value(source_id)

        if rel < -50:
            category = 'hostile'
        elif any(w in message_lower for w in ['hello', 'hi', 'hey', 'greetings']):
            category = 'greeting'
        elif any(w in message_lower for w in ['help', 'trouble', 'problem', 'emergency', '911']):
            category = 'help'
        else:
            category = 'default'

        import random
        base = random.choice(templates[category])
        styled = self.personality.speech.apply(base)

        quirks = self.personality.check_quirks("player_chat", time.time())
        if quirks:
            styled += f" *{quirks[0]}*"

        return styled

    # Command handlers
    def _cmd_talk(self, source: str, *args) -> None:
        """Command: /npc_talk <message> - Make NPC say something."""
        if args:
            message = ' '.join(args)
            self.adapter.send_chat_message(message)

    def _cmd_follow(self, source: str, *args) -> None:
        """Command: /npc_follow [player_id] - Make NPC follow player."""
        target_id = args[0] if args else source
        # In real impl: get target ped handle, then task_follow
        self.adapter.send_chat_message(f"Following {target_id}.")

    def _cmd_patrol(self, source: str, *args) -> None:
        """Command: /npc_patrol <x> <y> <z> [...] - Set patrol route."""
        if len(args) >= 3:
            self.patrol_route = [Vector3(float(args[i]), float(args[i+1]), float(args[i+2]))
                                for i in range(0, len(args), 3)]
            self.patrol_index = 0
            self.is_patrolling = True
            self._patrol_next()
            self.adapter.send_chat_message("Patrol route set.")
        else:
            self.is_patrolling = False
            self.adapter.send_chat_message("Patrol stopped.")

    def _patrol_next(self) -> None:
        """Move to next patrol point."""
        if not self.is_patrolling or not self.patrol_route:
            return
        target = self.patrol_route[self.patrol_index]
        self.adapter.task_go_to(self.handle, target, speed=1.5)
        # In real impl, listen for arrival event to call _patrol_next again
        self.patrol_index = (self.patrol_index + 1) % len(self.patrol_route)

    # Movement and combat
    def go_to(self, position: Vector3, speed: float = 1.0) -> None:
        """Move to position."""
        if self.handle:
            self.adapter.task_go_to(self.handle, position, speed)

    def attack_target(self, target_handle: int) -> None:
        """Attack target."""
        if self.handle:
            self.adapter.task_combat(self.handle, target_handle)
            self.combat_target = target_handle

    def flee_from(self, position: Vector3) -> None:
        """Flee from position."""
        if self.handle:
            self.adapter.task_flee(self.handle, position)

    def enter_vehicle(self, vehicle_handle: int, seat: int = -1) -> None:
        """Enter vehicle (seat -1 = driver)."""
        # Native: TaskEnterVehicle
        self.current_vehicle = vehicle_handle

    def exit_vehicle(self) -> None:
        """Exit current vehicle."""
        # Native: TaskLeaveVehicle
        self.current_vehicle = None

    def play_anim(self, dict_name: str, anim_name: str, duration: float = -1) -> None:
        """Play animation."""
        if self.handle:
            self.adapter.play_animation(self.handle, dict_name, anim_name, duration)

    def give_weapon(self, weapon_hash: str, ammo: int = 250) -> None:
        """Give weapon to NPC."""
        if self.handle:
            self.adapter.give_weapon(self.handle, weapon_hash, ammo)

    # Party management
    def create_party(self, party_id: str) -> PartyManager:
        """Create party with NPC as leader."""
        from .multiplayer_coord import PartyManager, PartyMember, PartyRole
        self.party = PartyManager(party_id, str(self.handle))
        npc_member = PartyMember(
            entity_id=str(self.handle),
            name=self.config.model,
            is_npc=True,
            role=PartyRole.TANK if self.config.personality_preset == "city_guard" else PartyRole.SUPPORT,
            position=self.adapter.get_ped_position(self.handle).to_tuple() if self.handle else self.config.spawn_position.to_tuple()
        )
        self.party.add_member(npc_member)
        return self.party

    def join_party(self, party: PartyManager) -> None:
        """Join existing party."""
        self.party = party
        from .multiplayer_coord import PartyMember, PartyRole
        npc_member = PartyMember(
            entity_id=str(self.handle),
            name=self.config.model,
            is_npc=True,
            role=PartyRole.TANK if self.config.personality_preset == "city_guard" else PartyRole.SUPPORT,
            position=self.adapter.get_ped_position(self.handle).to_tuple() if self.handle else self.config.spawn_position.to_tuple()
        )
        party.add_member(npc_member)

    def update_party_state(self) -> None:
        """Update NPC state in party."""
        if self.party and self.handle:
            pos = self.adapter.get_ped_position(self.handle)
            health, max_health = self.adapter.get_ped_health(self.handle)
            from .multiplayer_coord import PartyMember, PartyRole
            self.party.tactics.update_member(PartyMember(
                entity_id=str(self.handle),
                name=self.config.model,
                is_npc=True,
                role=PartyRole.TANK if self.config.personality_preset == "city_guard" else PartyRole.SUPPORT,
                health=health,
                max_health=max_health,
                position=pos.to_tuple()
            ))

    # LLM Integration
    async def generate_llm_response(self, prompt: str, context: str) -> str:
        """Generate response using LLM."""
        # Similar to Mineflayer but with GTA context
        return self._generate_personality_response("Player", prompt)

    def _build_system_prompt(self) -> str:
        """Build system prompt for LLM."""
        traits = self.personality.get_trait_category(self.personality.GAME_SPECIFIC if hasattr(self.personality, 'GAME_SPECIFIC') else None)

        prompt = f"""You are an NPC in GTA V: {self.config.model}.

Personality: {self.config.personality_preset}
Traits: {json.dumps({k: v for k, v in self.personality.traits.items() if v.value != 0}, indent=2)}

Current State:
  Position: {self.adapter.get_ped_position(self.handle).to_tuple() if self.handle else 'unknown'}
  Health: {self.adapter.get_ped_health(self.handle)[0] if self.handle else 'unknown'}/
          {self.adapter.get_ped_health(self.handle)[1] if self.handle else 'unknown'}
  In Vehicle: {self.current_vehicle is not None}
  Combat Target: {self.combat_target}

Speech Style: {self.personality.speech.formality:.1f} formal, {self.personality.speech.verbosity:.1f} verbose
Dialect: {', '.join(self.personality.speech.dialect_markers)}

Respond as this character in GTA V. Keep it short - chat messages are brief.
"""
        return prompt

    def despawn(self) -> None:
        """Despawn NPC and clean up."""
        self.running = False
        if self.world_sync:
            self.world_sync.stop()

        # Save memory
        memory_file = Path(self.config.memory_path or f"./npc_memory_{self.config.model}") / "memory_backup.json"
        memory_file.parent.mkdir(parents=True, exist_ok=True)
        self.memory.save_all(memory_file)

        # Native: DeletePed(self.handle)
        self.handle = None


class GTAWorldSync(WorldStateSync):
    """World state sync for GTA (FiveM/RageMP)."""

    def __init__(self, adapter: GTAWorldAdapter, world_state, sync_interval: float = 0.1):
        super().__init__(world_state, sync_interval)
        self.adapter = adapter
        self.npc_handle: Optional[int] = None

    def set_npc_handle(self, handle: int) -> None:
        self.npc_handle = handle

    def fetch_position(self) -> Position:
        from .world_state_sync import Position
        if self.npc_handle:
            pos = self.adapter.get_ped_position(self.npc_handle)
            return Position(pos.x, pos.y, pos.z, dimension="gta5")
        return Position()

    def fetch_inventory(self) -> dict[int, InventoryItem]:
        # GTA doesn't have traditional inventory - weapons are equipped
        inv = {}
        if self.npc_handle:
            # Would query ped weapons
            pass
        return inv

    def fetch_quests(self) -> list[Quest]:
        # Would integrate with quest system (e.g., esx_quests, qb-quests)
        return []

    def fetch_factions(self) -> list[Faction]:
        # Would integrate with gang/faction system
        return []

    def fetch_nearby_entities(self, radius: float) -> list[dict]:
        entities = []
        if self.npc_handle:
            pos = self.adapter.get_ped_position(self.npc_handle)

            # Nearby peds
            peds = self.adapter.get_nearby_peds(pos, radius)
            for ped in peds:
                entities.append({
                    'entity_id': str(ped.handle),
                    'type': 'ped' if not ped.is_player else 'player',
                    'position': ped.position.to_dict() if hasattr(ped.position, 'to_dict') else ped.position.__dict__,
                    'distance': pos.distance_to(ped.position)
                })

            # Nearby vehicles
            vehicles = self.adapter.get_nearby_vehicles(pos, radius)
            for veh in vehicles:
                entities.append({
                    'entity_id': str(veh.handle),
                    'type': 'vehicle',
                    'position': veh.position.to_dict() if hasattr(veh.position, 'to_dict') else veh.position.__dict__,
                    'distance': pos.distance_to(veh.position)
                })

        return entities


# Convenience functions
def create_fivem_npc(model: str = "a_m_y_business_01",
                     position: Vector3 = None,
                     personality: str = "city_guard") -> FiveMNPC:
    """Create FiveM NPC."""
    config = FiveMNPCConfig(
        platform=GamePlatform.FIVEM,
        model=model,
        spawn_position=position or Vector3(0, 0, 72),
        personality_preset=personality
    )
    npc = FiveMNPC(config)
    npc.spawn()
    return npc


def create_ragemp_npc(model: str = "a_m_y_business_01",
                      position: Vector3 = None,
                      personality: str = "city_guard") -> FiveMNPC:
    """Create RageMP NPC."""
    config = FiveMNPCConfig(
        platform=GamePlatform.RAGEMP,
        model=model,
        spawn_position=position or Vector3(0, 0, 72),
        personality_preset=personality
    )
    npc = FiveMNPC(config)
    npc.spawn()
    return npc


# Example Lua/C# integration snippets (for reference)
"""
--- FiveM Lua Client (client/main.lua) ---
local npcAI = exports['npc_ai']

RegisterNetEvent('npc_ai:spawnNPC')
AddEventHandler('npc_ai:spawnNPC', function(model, coords, personality)
    local ped = CreatePed(4, GetHashKey(model), coords.x, coords.y, coords.z, 0.0, true, false)
    npcAI.initializeNPC(ped, personality)
end)

RegisterCommand('npc_talk', function(source, args)
    local message = table.concat(args, " ")
    npcAI.sendChat(message)
end)

-- Server event for chat sync
RegisterNetEvent('chatMessage')
AddEventHandler('chatMessage', function(source, message)
    npcAI.onChatMessage(source, message)
end)


// RageMP TypeScript Client (packages/npc_ai/client/index.ts)
import { Ped, Vector3 } from '@ragemp/ragemp';

class NPCAI {
    private ped: Ped | null = null;

    spawn(model: string, position: Vector3, personality: string) {
        this.ped = mp.peds.new(model, position, 0.0);
        this.initializeAI(personality);
    }

    initializeAI(personality: string) {
        mp.events.callRemote('npc_ai:initialize', this.ped.handle, personality);
    }

    onChat(player: Player, message: string) {
        mp.events.callRemote('npc_ai:chat', player.id, message);
    }
}

mp.events.add('chatMessage', (player, message) => {
    npcAI.onChat(player, message);
});
"""