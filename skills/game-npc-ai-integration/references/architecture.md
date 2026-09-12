# Architecture Overview

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

# Phase 1: Foundation Setup

1. **Choose Game Platform Adapter**
   - Mineflayer (Minecraft bots) → `scripts/mineflayer_adapter.py`
   - FiveM/RageMP (GTA V) → `scripts/fivem_adapter.py`
   - Unity/Unreal → Custom adapter (extend base class)

2. **Initialize Core Systems**
   - Memory System: `scripts/npc_memory.py`
   - Personality Engine: `scripts/personality_engine.py`
   - World State Sync: `scripts/world_state_sync.py`
   - Multi-player Coordination: `scripts/multiplayer_coord.py`
