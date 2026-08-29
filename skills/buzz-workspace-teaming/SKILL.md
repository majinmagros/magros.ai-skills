---
name: buzz-workspace-teaming
description: Use when implementing Block Buzz workspace — humans and AI agents as teammates with shared workspace, identity system, starter agents, per-agent model routing, and free-tier AP usage (Kimi K3 via free APIs). Triggers on "Buzz", "Block Buzz", "workspace teammates", "human-agent teaming", "Kimi K3 free", "starter agents".
metadata:
  origin: ECC
---

# Buzz Workspace Teaming

Implement multi-agent team workspaces where humans and AI agents act as peers (Block Buzz pattern).

## Core Concepts
- **Shared Workspace**: Channel-based context where humans and agents collaborate.
- **Identity System**: Cryptographic or structured agent identities with distinct roles (e.g., researcher, copywriter, reviewer).
- **Per-Agent Model Routing**: Assign lightweight models for coordination/routing and frontier models for complex code generation.
- **Free/Cost-Effective Tiers**: Connect harness endpoints to low-cost or free-tier providers (OpenRouter, Nvidia Build API, local runtimes).

## Implementation Steps
1. Configure channel topologies and roles.
2. Set up agent harnesses (Claude Code, Codex, Goose) via Agent Client Protocol (ACP).
3. Bind specific models and routing rules per agent.
4. Establish verification gates to ensure agents do not merge unverified outputs.
