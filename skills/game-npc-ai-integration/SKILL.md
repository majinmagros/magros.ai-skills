---
name: game-npc-ai-integration
description: >-
  Integrate LLMs into game NPCs with persistent memory, personality, world state sync, and multi-player coordination.
  
  **Triggers (when to use):**
  - "NPC com IA", "NPC autônomo", "game NPC LLM", "personagem não-jogador inteligente"
  - "memória persistente NPC", "personalidade NPC", "world state sync NPC"
  - "multi-player NPC coordination", "party chat NPC", "combate tático NPC"
  - "Mineflayer NPC AI", "FiveM NPC LLM", "RageMP NPC AI", "Unity NPC LLM", "Unreal NPC AI"
  - "NPC dialogue system", "NPC relationship system", "NPC quest integration"
  
  **Non-triggers (when NOT to use):**
  - Generic agent harness construction (use agent-harness-construction)
  - Non-game AI agents (use agentic-engineering, autonomous-agent-harness)
  - Simple chatbot without game context (use agent-harness-construction)
  - Game logic without LLM integration (use game-dev-patterns if available)
  
  **Outcome:** Production-ready NPC AI integration with episodic/semantic/working memory, personality engine, world state synchronization, and multi-player coordination for Mineflayer (Minecraft), FiveM/RageMP (GTA V), Unity, and Unreal.
module: agentic-patterns
version: 1.0.0
stability: beta
cost: medium
tags:
  - game-dev
  - npc
  - llm-integration
  - mineflayer
  - fivem
  - ragemp
  - unity
  - unreal
  - multiplayer
dependencies:
  - agent-harness-construction
  - agentic-engineering
  - unified-memory
  - cost-aware-llm-pipeline
---

# Game NPC AI Integration

Production patterns for integrating LLMs into game NPCs with persistent memory, personality, world state synchronization, and multi-player coordination.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     NPC AI CORE                                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   MEMORY     │  │ PERSONALITY  │  │ WORLD STATE  │          │
│  │  SYSTEM      │  │  ENGINE      │  │   SYNC       │          │
│  │              │  │              │  │              │          │
│  │ • Episodic   │  │ • Traits     │  │ • Position   │          │
│  │ • Semantic   │  │ • Quirks     │  │ • Inventory  │          │
│  │ • Working    │  │ • Speech     │  │ • Quests     │          │
│  │              │  │ • Relations  │  │ • Factions   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └─────────────────┼─────────────────┘                   │
│                           ▼                                     │
│              ┌────────────────────────┐                         │
│              │   MULTI-PLAYER COORD   │                         │
│              │                        │                         │
│              │ • Party Chat           │                         │
│              │ • Shared Knowledge     │                         │
│              │ • Combat Tactics       │                         │
│              └────────────┬───────────┘                         │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            ▼
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
    ┌─────────┐       ┌─────────┐       ┌─────────┐
    │Mineflayer│      │ FiveM/  │       │ Unity/  │
    │ Adapter │       │ RageMP  │       │ Unreal  │
    └─────────┘       └─────────┘       └─────────┘
```

## Step-by-Step Workflow

### Phase 1: Foundation Setup

1. **Choose Game Platform Adapter**
   - Mineflayer (Minecraft bots) → `scripts/mineflayer_adapter.py`
   - FiveM/RageMP (GTA V) → `scripts/fivem_adapter.py`
   - Unity/Unreal → Custom adapter (extend base class)

2. **Initialize Core Systems**
   - Memory System: `scripts/npc_memory.py`
   - Personality Engine: `scripts/personality_engine.py`
   - World State Sync: `scripts/world_state_sync.py`
   - Multi-player Coordination: `scripts/multiplayer_coord.py`

### Phase 2: Memory System Configuration

3. **Configure Episodic Memory**
   - Store significant events (combat, dialogue, discoveries)
   - Timestamp, location, participants, emotional valence
   - Retrieval by similarity, recency, importance

4. **Configure Semantic Memory**
   - Facts about world, players, NPCs, locations
   - Knowledge graph structure with relationships
   - Update on new observations

5. **Configure Working Memory**
   - Current context: nearby entities, active quest, immediate goals
   - Short-term buffer (last N interactions)
   - Attention mechanism for relevant context

### Phase 3: Personality Engine

6. **Define Personality Traits** (Big Five + game-specific)
   - Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
   - Game-specific: Bravery, Curiosity, Loyalty, Greed, Honor

7. **Configure Quirks & Speech Patterns**
   - Verbal tics, catchphrases, dialect markers
   - Formality level, verbosity, humor style
   - Reaction templates for common situations

8. **Setup Relationship System**
   - Track relationship values with players/NPCs (-100 to +100)
   - Relationship types: ally, rival, friend, enemy, neutral
   - Decay over time, events modify values

### Phase 4: World State Synchronization

9. **Position & Movement Tracking**
   - Real-time position updates from game engine
   - Pathfinding integration for navigation
   - Visibility/awareness radius

10. **Inventory & Equipment Sync**
    - Item acquisition, loss, usage
    - Equipment changes affecting capabilities
    - Trade/gift interactions with players

11. **Quest & Faction State**
    - Active quest objectives, progress
    - Faction reputation, standing
    - Dynamic quest generation based on world state

### Phase 5: Multi-Player Coordination

12. **Party Chat System**
    - Shared communication channel for NPC+player party
    - Context-aware responses referencing shared history
    - Tactical callouts during combat

13. **Shared Knowledge Base**
    - Synchronized world facts across party members
    - Discovery propagation (fog of war clearing)
    - Strategic planning with shared information

14. **Combat Tactics Coordination**
    - Role assignment (tank, DPS, support, scout)
    - Focus targeting, ability combos
    - Retreat/regroup decisions

### Phase 6: LLM Integration & Optimization

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

## Scripts Reference

| Script | Purpose | Key Classes/Functions |
|--------|---------|----------------------|
| `npc_memory.py` | Three-tier memory system | `EpisodicMemory`, `SemanticMemory`, `WorkingMemory`, `MemoryManager` |
| `personality_engine.py` | Personality & relationships | `PersonalityProfile`, `TraitSystem`, `SpeechPattern`, `RelationshipManager` |
| `world_state_sync.py` | Game state synchronization | `WorldState`, `PositionTracker`, `InventorySync`, `QuestManager`, `FactionManager` |
| `multiplayer_coord.py` | Party coordination | `PartyChat`, `SharedKnowledge`, `CombatTactics`, `PartyManager` |
| `mineflayer_adapter.py` | Minecraft bot integration | `MineflayerNPC`, `MinecraftWorldAdapter`, `BlockInteraction` |
| `fivem_adapter.py` | FiveM/RageMP integration | `FiveMNPC`, `GTAWorldAdapter`, `VehicleInteraction`, `PedManagement` |

## Integration Patterns

### Mineflayer (Minecraft)
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

### FiveM/RageMP (GTA V)
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

### Unity/Unreal (Custom Adapter)
```python
# Extend base classes from scripts/
class UnityNPC(BaseNPC):
    def __init__(self, game_object):
        super().__init__()
        self.game_object = game_object
        # Implement: get_position, get_nearby_entities, send_chat, etc.
```

## Configuration Files

Place in `references/`:
- `personality_presets.json` — Pre-built personality archetypes
- `speech_patterns.json` — Dialect/voice templates
- `memory_config.yaml` — Memory retention/forgetting policies
- `world_sync_config.yaml` — Sync intervals, priorities
- `combat_tactics.json` — Role definitions, ability priorities

## Best Practices

1. **Memory Pruning**: Implement forgetting curves; don't let memory grow unbounded
2. **Personality Consistency**: Validate responses against trait scores before sending
3. **World State Authority**: Game engine is source of truth; NPC syncs TO it, not from it
4. **Latency Budget**: Target <200ms for NPC response; use cached responses for common cases
5. **Multi-player Consistency**: Use eventual consistency for shared knowledge; resolve conflicts by timestamp
6. **Testing**: Use `agent-eval` to benchmark NPC behavior quality across scenarios

## Validation Checklist

- [ ] Memory system persists across sessions
- [ ] Personality traits visibly affect dialogue choices
- [ ] World state stays in sync with game engine (<1s drift)
- [ ] Multi-player coordination works with 2+ players
- [ ] Adapters handle disconnection/reconnection gracefully
- [ ] LLM costs stay within budget (monitor via `cost-aware-llm-pipeline`)
- [ ] No hallucinated game objects/locations in NPC speech
- [ ] Personality presets load and apply correctly

## References

- Mineflayer API: https://github.com/PrismarineJS/mineflayer
- FiveM NPC AI: https://github.com/search?q=fivem+npc+ai+llm
- RageMP AI: https://github.com/search?q=ragemp+llm+npc
- Agent Harness Construction: `skills/agent-harness-construction`
- Unified Memory: `skills/unified-memory`
- Cost-Aware LLM Pipeline: `skills/cost-aware-llm-pipeline`