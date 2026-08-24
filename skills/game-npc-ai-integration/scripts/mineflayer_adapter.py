"""
Mineflayer Adapter — Minecraft Bot NPC Integration
Connects NPC AI core to Mineflayer bots for Minecraft.
"""

from __future__ import annotations
import asyncio
import time
import threading
from typing import Optional
from dataclasses import dataclass
from abc import ABC

try:
    import mineflayer
    from mineflayer import Bot
    MINECRAFT_AVAILABLE = True
except ImportError:
    mineflayer = None
    Bot = object
    MINECRAFT_AVAILABLE = False

from .npc_memory import MemoryManager, EpisodicMemory
from .personality_engine import PersonalityProfile, RelationshipManager
from .world_state_sync import WorldState, WorldStateSync, Position, InventoryItem, Quest, QuestStatus, Faction
from .multiplayer_coord import PartyManager, PartyMember, PartyRole, CombatState


class MineflayerWorldSync(WorldStateSync):
    """World state synchronization for Mineflayer bots."""

    def __init__(self, bot: Bot, world_state: WorldState, sync_interval: float = 0.5):
        super().__init__(world_state, sync_interval)
        self.bot = bot
        self._setup_event_listeners()

    def _setup_event_listeners(self) -> None:
        """Set up Mineflayer event listeners for real-time updates."""
        @self.bot.on('position')
        def on_position(*args):
            # Position updates come from physics ticks
            pass

        @self.bot.on('inventoryUpdate')
        def on_inventory_update(item, window):
            if window == self.bot.inventory:
                self._sync_inventory_item(item)

        @self.bot.on('entityGone')
        def on_entity_gone(entity):
            self._handle_entity_gone(entity)

        @self.bot.on('entitySpawn')
        def on_entity_spawn(entity):
            self._handle_entity_spawn(entity)

        @self.bot.on('entityMoved')
        def on_entity_moved(entity):
            self._handle_entity_moved(entity)

        @self.bot.on('chat')
        def on_chat(username, message, *args):
            self._handle_chat(username, message)

    def _sync_inventory_item(self, item) -> None:
        """Sync single inventory item change."""
        if item:
            inv_item = InventoryItem(
                item_id=item.name,
                name=item.displayName or item.name,
                count=item.count,
                slot=item.slot,
                metadata={
                    'durability': getattr(item, 'durability', None),
                    'enchantments': getattr(item, 'enchantments', {}),
                    'nbt': getattr(item, 'nbt', None)
                }
            )
        else:
            return
        with self.world_state._lock:
            self.world_state.inventory[item.slot] = inv_item

    def _handle_entity_spawn(self, entity) -> None:
        from .world_state_sync import Position
        pos = Position(entity.position.x, entity.position.y, entity.position.z,
                      dimension=self.bot.game.dimension)
        self.world_state.update_known_entity(
            str(entity.id),
            entity.kind if hasattr(entity, 'kind') else 'unknown',
            pos
        )

    def _handle_entity_gone(self, entity) -> None:
        # Entity despawned - could mark as gone
        pass

    def _handle_entity_moved(self, entity) -> None:
        from .world_state_sync import Position
        pos = Position(entity.position.x, entity.position.y, entity.position.z,
                      dimension=self.bot.game.dimension)
        self.world_state.update_known_entity(
            str(entity.id),
            entity.kind if hasattr(entity, 'kind') else 'unknown',
            pos
        )

    def _handle_chat(self, username: str, message: str) -> None:
        # Could trigger memory recording or knowledge sharing
        pass

    def fetch_position(self) -> Position:
        pos = self.bot.entity.position
        return Position(pos.x, pos.y, pos.z, dimension=self.bot.game.dimension)

    def fetch_inventory(self) -> dict[int, InventoryItem]:
        inv = {}
        for slot, item in self.bot.inventory.slots.items():
            if item:
                inv[slot] = InventoryItem(
                    item_id=item.name,
                    name=item.displayName or item.name,
                    count=item.count,
                    slot=slot,
                    metadata={
                        'durability': getattr(item, 'durability', None),
                        'enchantments': getattr(item, 'enchantments', {}),
                    }
                )
        return inv

    def fetch_quests(self) -> list[Quest]:
        # Minecraft doesn't have native quests - would integrate with quest plugin
        return []

    def fetch_factions(self) -> list[Faction]:
        # Could integrate with factions plugin
        return []

    def fetch_nearby_entities(self, radius: float) -> list[dict]:
        entities = []
        bot_pos = self.bot.entity.position
        for entity in self.bot.entities.values():
            if entity == self.bot.entity:
                continue
            dist = bot_pos.distanceTo(entity.position)
            if dist <= radius:
                entities.append({
                    'entity_id': str(entity.id),
                    'type': entity.kind if hasattr(entity, 'kind') else 'unknown',
                    'position': {'x': entity.position.x, 'y': entity.position.y, 'z': entity.position.z},
                    'distance': dist
                })
        return entities


@dataclass
class MineflayerNPCConfig:
    """Configuration for Mineflayer NPC."""
    username: str
    host: str = "localhost"
    port: int = 25565
    auth: str = "offline"  # offline, microsoft, mojang
    version: str = "1.20.1"
    personality_preset: str = "villager_merchant"
    memory_path: Optional[str] = None
    auto_reconnect: bool = True
    reconnect_delay: float = 5.0


class MineflayerNPC:
    """Main NPC class integrating all AI systems with Mineflayer bot."""

    def __init__(self, config: MineflayerNPCConfig):
        if not MINECRAFT_AVAILABLE:
            raise RuntimeError("mineflayer not installed. Run: npm install mineflayer")

        self.config = config
        self.bot: Optional[Bot] = None
        self.running = False
        self._loop: Optional[asyncio.AbstractEventLoop] = None
        self._thread: Optional[threading.Thread] = None

        # Core AI systems
        memory_path = config.memory_path or f"./npc_memory_{config.username}"
        self.memory = MemoryManager(Path(memory_path))
        self.personality = PersonalityProfile.from_preset(config.personality_preset)
        self.relationships = RelationshipManager()
        self.world_state = WorldState(config.username)

        # World sync
        self.world_sync: Optional[MineflayerWorldSync] = None

        # Party coordination
        self.party: Optional[PartyManager] = None

        # LLM integration (to be plugged in)
        self.llm_client = None
        self.llm_config = {
            'model': 'gpt-4o-mini',
            'temperature': 0.7,
            'max_tokens': 500
        }

    def connect(self) -> None:
        """Connect to Minecraft server."""
        self.bot = mineflayer.createBot({
            'host': self.config.host,
            'port': self.config.port,
            'username': self.config.username,
            'auth': self.config.auth,
            'version': self.config.version,
        })

        self._setup_bot_events()
        self._start_async_loop()

    def _setup_bot_events(self) -> None:
        @self.bot.once('spawn')
        def on_spawn():
            print(f"[{self.config.username}] Spawned in world")
            self.world_state.update_position(self._get_position())
            self.world_sync = MineflayerWorldSync(self.bot, self.world_state, sync_interval=0.5)
            self.world_sync.start()
            self._on_spawn()

        @self.bot.on('error')
        def on_error(err):
            print(f"[{self.config.username}] Error: {err}")

        @self.bot.on('end')
        def on_end():
            print(f"[{self.config.username}] Disconnected")
            self._on_disconnect()

        @self.bot.on('chat')
        def on_chat(username, message, *args):
            if username != self.config.username:
                self._handle_player_chat(username, message)

        @self.bot.on('whisper')
        def on_whisper(username, message, *args):
            self._handle_player_whisper(username, message)

    def _start_async_loop(self) -> None:
        """Start async event loop in background thread."""
        def run_loop():
            self._loop = asyncio.new_event_loop()
            asyncio.set_event_loop(self._loop)
            self._loop.run_forever()

        self._thread = threading.Thread(target=run_loop, daemon=True)
        self._thread.start()
        # Wait for loop to be ready
        while self._loop is None:
            time.sleep(0.01)

    def _get_position(self) -> Position:
        pos = self.bot.entity.position
        return Position(pos.x, pos.y, pos.z, dimension=self.bot.game.dimension)

    def _on_spawn(self) -> None:
        """Called when bot spawns - initialize systems."""
        # Load memory if exists
        memory_file = Path(self.config.memory_path or f"./npc_memory_{self.config.username}") / "memory_backup.json"
        if memory_file.exists():
            self.memory.load_all(memory_file)

    def _on_disconnect(self) -> None:
        """Save memory on disconnect."""
        memory_file = Path(self.config.memory_path or f"./npc_memory_{self.config.username}") / "memory_backup.json"
        memory_file.parent.mkdir(parents=True, exist_ok=True)
        self.memory.save_all(memory_file)

        if self.world_sync:
            self.world_sync.stop()

        if self.config.auto_reconnect:
            print(f"[{self.config.username}] Reconnecting in {self.config.reconnect_delay}s...")
            time.sleep(self.config.reconnect_delay)
            self.connect()

    def _handle_player_chat(self, username: str, message: str) -> None:
        """Handle public chat from players."""
        # Record in memory
        self.memory.record_event(
            event_type="dialogue",
            description=f"{username}: {message}",
            location=self._get_position().to_tuple(),
            participants=[username],
            emotional_valence=0.0,
            importance=0.5
        )

        # Update relationship
        self.relationships.modify(username, 0.1, "chat_interaction")

        # Check if addressed to NPC
        if self._is_addressed_to_npc(message):
            self._process_player_message(username, message, is_public=True)

    def _handle_player_whisper(self, username: str, message: str) -> None:
        """Handle private whisper from players."""
        self.memory.record_event(
            event_type="dialogue",
            description=f"[whisper] {username}: {message}",
            location=self._get_position().to_tuple(),
            participants=[username],
            emotional_valence=0.1,
            importance=0.7
        )

        self.relationships.modify(username, 0.2, "private_conversation")
        self._process_player_message(username, message, is_public=False)

    def _is_addressed_to_npc(self, message: str) -> bool:
        """Check if message is addressed to this NPC."""
        name_lower = self.config.username.lower()
        message_lower = message.lower()
        return (name_lower in message_lower or
                any(trigger in message_lower for trigger in ['hey', 'hello', 'hi', 'excuse me', 'npc']))

    def _process_player_message(self, username: str, message: str, is_public: bool) -> None:
        """Process player message and generate response."""
        # This is where LLM integration would happen
        # For now, use personality-based responses
        response = self._generate_personality_response(username, message, is_public)
        if response:
            if is_public:
                self.bot.chat(response)
            else:
                self.bot.whisper(username, response)

    def _generate_personality_response(self, username: str, message: str, is_public: bool) -> Optional[str]:
        """Generate response based on personality (placeholder for LLM)."""
        # Get context from memory
        context = self.memory.get_context_for_llm(message)

        # Get personality style
        style = self.personality.generate_response_style()

        # Simple template-based response (replace with LLM call)
        templates = {
            'greeting': [
                f"Hello there, {username}!",
                f"Greetings, {username}.",
                f"Well met, {username}."
            ],
            'trade': [
                "Looking to trade? I have fine wares.",
                "What can I get you today?",
                "Best prices in the region, friend."
            ],
            'quest': [
                "A task, you say? Tell me more.",
                "I might have work for an adventurer.",
                "Depends on the reward..."
            ],
            'default': [
                "Interesting...",
                "I see.",
                "Tell me more."
            ]
        }

        message_lower = message.lower()
        if any(w in message_lower for w in ['hello', 'hi', 'hey', 'greetings']):
            category = 'greeting'
        elif any(w in message_lower for w in ['trade', 'buy', 'sell', 'price', 'cost']):
            category = 'trade'
        elif any(w in message_lower for w in ['quest', 'task', 'job', 'work', 'mission']):
            category = 'quest'
        else:
            category = 'default'

        import random
        base_response = random.choice(templates[category])

        # Apply speech pattern
        styled = self.personality.speech.apply(base_response)

        # Check quirks
        quirks = self.personality.check_quirks("player_chat", time.time())
        if quirks:
            styled += f" [{quirks[0]}]"

        return styled

    # Movement and action methods
    def move_to(self, x: float, y: float, z: float) -> None:
        """Move to position using pathfinder."""
        if hasattr(self.bot, 'pathfinder'):
            from mineflayer.pathfinder import Movements, goals
            movements = Movements(self.bot)
            self.bot.pathfinder.setMovements(movements)
            self.bot.pathfinder.setGoal(goals.GoalNear(x, z, y, 1))

    def look_at(self, x: float, y: float, z: float) -> None:
        """Look at position."""
        self.bot.lookAt(x, y, z)

    def attack(self, entity) -> None:
        """Attack entity."""
        if hasattr(self.bot, 'pvp'):
            self.bot.pvp.attack(entity)

    def equip_item(self, slot: int) -> None:
        """Equip item from inventory slot."""
        self.bot.equip(slot, 'hand')

    def use_item(self, slot: int) -> None:
        """Use item in hand."""
        self.bot.activateItem()

    def craft(self, recipe_name: str, count: int = 1) -> None:
        """Craft item using recipe."""
        if hasattr(self.bot, 'craft'):
            self.bot.craft(recipe_name, count)

    # Party management
    def create_party(self, party_id: str) -> PartyManager:
        """Create a new party with this NPC as leader."""
        self.party = PartyManager(party_id, self.config.username)
        npc_member = PartyMember(
            entity_id=self.config.username,
            name=self.config.username,
            is_npc=True,
            role=PartyRole.SUPPORT,
            level=1,
            position=self._get_position().to_tuple()
        )
        self.party.add_member(npc_member)
        return self.party

    def join_party(self, party: PartyManager) -> None:
        """Join existing party."""
        self.party = party
        npc_member = PartyMember(
            entity_id=self.config.username,
            name=self.config.username,
            is_npc=True,
            role=PartyRole.SUPPORT,
            level=1,
            position=self._get_position().to_tuple()
        )
        party.add_member(npc_member)

    def update_party_position(self) -> None:
        """Update NPC position in party."""
        if self.party and self.bot:
            pos = self._get_position().to_tuple()
            self.party.tactics.update_member(PartyMember(
                entity_id=self.config.username,
                name=self.config.username,
                is_npc=True,
                role=PartyRole.SUPPORT,
                position=pos
            ))

    # LLM Integration (to be implemented with actual LLM client)
    async def generate_llm_response(self, prompt: str, context: str) -> str:
        """Generate response using LLM (implement with your LLM client)."""
        # Example with OpenAI:
        # response = await openai.ChatCompletion.acreate(
        #     model=self.llm_config['model'],
        #     messages=[
        #         {"role": "system", "content": self._build_system_prompt()},
        #         {"role": "user", "content": f"Context:\n{context}\n\nPlayer: {prompt}"}
        #     ],
        #     temperature=self.llm_config['temperature'],
        #     max_tokens=self.llm_config['max_tokens']
        # )
        # return response.choices[0].message.content

        # Placeholder
        return self._generate_personality_response("Player", prompt, True)

    def _build_system_prompt(self) -> str:
        """Build system prompt for LLM based on personality."""
        traits = self.personality.get_trait_category(TraitCategory.GAME_SPECIFIC)
        big_five = self.personality.get_trait_category(TraitCategory.BIG_FIVE)

        prompt = f"""You are {self.config.username}, an NPC in Minecraft.

Personality Traits:
"""
        for name, value in big_five.items():
            prompt += f"  {name}: {value:.2f}\n"
        for name, value in traits.items():
            prompt += f"  {name}: {value:.2f}\n"

        prompt += f"""
Speech Style:
  Formality: {self.personality.speech.formality}
  Verbosity: {self.personality.speech.verbosity}
  Humor: {self.personality.speech.humor}
  Dialect: {', '.join(self.personality.speech.dialect_markers)}
  Catchphrases: {', '.join(self.personality.speech.catchphrases)}

Current World State:
  Position: {self.world_state.position.to_tuple()}
  Health: {self.bot.health if self.bot else 'unknown'}
  Inventory slots used: {len(self.world_state.inventory)}

Respond naturally as this character. Keep responses concise for chat.
"""
        return prompt

    def disconnect(self) -> None:
        """Clean disconnect."""
        self.running = False
        if self.bot:
            self.bot.quit()
        if self._loop:
            self._loop.call_soon_threadsafe(self._loop.stop)
        if self._thread:
            self._thread.join(timeout=2.0)


# Convenience function for quick setup
def create_mineflayer_npc(username: str, host: str = "localhost", port: int = 25565,
                          personality: str = "villager_merchant") -> MineflayerNPC:
    """Quick creation of Mineflayer NPC."""
    config = MineflayerNPCConfig(
        username=username,
        host=host,
        port=port,
        personality_preset=personality
    )
    npc = MineflayerNPC(config)
    npc.connect()
    return npc