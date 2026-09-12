# Phase 6: LLM Integration & Optimization

15. **Model Selection & Routing**
    - Use `cost-aware-llm-pipeline` for model routing
    - Cheap model for routine decisions, strong for complex
    - Cache frequent responses (greetings, common queries)

16. **Context Window Management**
    - Compress memory with `content-hash-cache-pattern`
    - Prioritize relevant context for current situation
    - Summarize long histories

17. **Response Generation Pipeline**
    - Retrieve relevant memories → Apply personality → Generate response
    - Validate against world state (no hallucinated items/locations)
    - Post-process for speech patterns

# Scripts Reference

| Script | Purpose | Key Classes/Functions |
|--------|---------|----------------------|
| `npc_memory.py` | Three-tier memory system | `EpisodicMemory`, `SemanticMemory`, `WorkingMemory`, `MemoryManager` |
| `personality_engine.py` | Personality & relationships | `PersonalityProfile`, `TraitSystem`, `SpeechPattern`, `RelationshipManager` |
| `world_state_sync.py` | Game state synchronization | `WorldState`, `PositionTracker`, `InventorySync`, `QuestManager`, `FactionManager` |
| `multiplayer_coord.py` | Party coordination | `PartyChat`, `SharedKnowledge`, `CombatTactics`, `PartyManager` |
| `mineflayer_adapter.py` | Minecraft bot integration | `MineflayerNPC`, `MinecraftWorldAdapter`, `BlockInteraction` |
| `fivem_adapter.py` | FiveM/RageMP integration | `FiveMNPC`, `GTAWorldAdapter`, `VehicleInteraction`, `PedManagement` |

# Integration Patterns

## Mineflayer (Minecraft)

```python
from scripts.mineflayer_adapter import MineflayerNPC
from scripts.npc_memory import MemoryManager
from scripts.personality_engine import PersonalityProfile

bot = MineflayerNPC(
    username="NPC_Name",
    personality=PersonalityProfile.from_preset("villager_merchant"),
    memory=MemoryManager()
)
bot.connect("localhost", 25565)
```

## FiveM/RageMP (GTA V)

```python
from scripts.fivem_adapter import FiveMNPC
from scripts.world_state_sync import WorldState

npc = FiveMNPC(
    model="a_m_y_business_01",
    personality=PersonalityProfile.from_preset("city_cop"),
    world_state=WorldState()
)
npc.spawn(vector3(100.0, -1000.0, 29.0))
```

## Unity/Unreal (Custom Adapter)

```python
# Extend base classes from scripts/
class UnityNPC(BaseNPC):
    def __init__(self, game_object):
        super().__init__()
        self.game_object = game_object
        # Implement: get_position, get_nearby_entities, send_chat, etc.
```

# Configuration Files (in `references/`)

- `personality_presets.json` — Pre-built personality archetypes
- `speech_patterns.json` — Dialect/voice templates (see `personality_presets.json` for bundled voices)
- `memory_config.yaml` — Memory retention/forgetting policies
- `world_sync_config.yaml` — Sync intervals, priorities
- `combat_tactics.json` — Role definitions, ability priorities

# Best Practices

1. **Memory Pruning**: Implement forgetting curves; don't let memory grow unbounded
2. **Personality Consistency**: Validate responses against trait scores before sending
3. **World State Authority**: Game engine is source of truth; NPC syncs TO it, not from it
4. **Latency Budget**: Target <200ms for NPC response; use cached responses for common cases
5. **Multi-player Consistency**: Use eventual consistency for shared knowledge; resolve conflicts by timestamp
6. **Testing**: Use `agent-eval` to benchmark NPC behavior quality across scenarios

# Validation Checklist

- [ ] Memory system persists across sessions
- [ ] Personality traits visibly affect dialogue choices
- [ ] World state stays in sync with game engine (<1s drift)
- [ ] Multi-player coordination works with 2+ players
- [ ] Adapters handle disconnection/reconnection gracefully
- [ ] LLM costs stay within budget (monitor via `cost-aware-llm-pipeline`)
- [ ] No hallucinated game objects/locations in NPC speech
- [ ] Personality presets load and apply correctly

# References

- Mineflayer API: https://github.com/PrismarineJS/mineflayer
- FiveM NPC AI: https://github.com/search?q=fivem+npc+ai+llm
- RageMP AI: https://github.com/search?q=ragemp+llm+npc
- Agent Harness Construction: `skills/agent-harness-construction`
- Unified Memory: `skills/unified-memory`
- Cost-Aware LLM Pipeline: `skills/cost-aware-llm-pipeline`
