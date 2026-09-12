---
name: game-npc-ai-integration
description: "Use when integrating LLMs into game NPCs with persistent memory, personality, world state sync, and multi-player coordination. Triggers on \"game-npc-ai-integration\", \"NPC com IA\", \"game NPC LLM\", \"personagem nao-jogador\"."
metadata:
  origin: ECC
---

# Game NPC AI Integration

LLM-driven NPCs: memory, personality, world-state sync, multi-player coordination. Detalhes em `references/`.

## When to Activate

- Building autonomous NPCs with dialogue or decision-making
- Adding persistent memory (episodic, semantic, working) to NPCs
- Defining personalities, quirks, speech patterns, relationships
- Syncing position, inventory, quests, factions with the game engine
- Coordinating NPC parties: chat, shared knowledge, combat tactics
- Targeting Mineflayer, FiveM/RageMP, or Unity/Unreal adapters

## Core Principles

1. **Engine is source of truth** — NPC syncs TO it, validates speech against it
2. **Prune memory** — forgetting curves; never grow unbounded
3. **Latency budget <200ms** — cache greetings and common responses
4. **Cheap model routine, strong model complex** — route via `cost-aware-llm-pipeline`
5. **No hallucinated objects** — validate items/locations before sending

## Example

```python
bot = MineflayerNPC(username="Trader",
    personality=PersonalityProfile.from_preset("villager_merchant"),
    memory=MemoryManager())
bot.connect("localhost", 25565)
```

## References

- `references/architecture.md` — NPC AI core diagram + foundation setup
- `references/memory-personality.md` — memory tiers, traits, quirks, relationships
- `references/world-multiplayer.md` — position/inventory/quest sync, party, combat
- `references/adapters.md` — LLM routing, scripts, patterns, configs, practices

## Checklist

- [ ] Memory persists across sessions; pruning configured
- [ ] Traits visibly affect dialogue; presets load correctly
- [ ] World drift <1s; disconnect/reconnect handled
- [ ] Party coordination works with 2+ players
- [ ] LLM costs budgeted; zero hallucinated game objects
