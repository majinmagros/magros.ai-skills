---
name: blender-mcp-ops
description: "Use when an AI agent must operate Blender 3D via the blender-mcp MCP server — setup, scene ops, materials, code execution, and the SVG-first cost-gate workflow. Triggers on \"Blender MCP\", \"blender-mcp\", \"uvx blender-mcp\", \"operate Blender\", \"SVG to mesh\", \"blender-mcp-ops\". Non-triggers: read-only rig/pose inspection (use blender-motion-state-inspection), image-to-Three.js/WebGL code (use img2threejs), Unreal/MetaHuman pipelines. Outcome: a working Blender+MCP loop that validates cheap (image/SVG) before spending tokens on meshes, with screenshots verifying every step."
metadata:
  origin: ECC
---

# Blender MCP Ops

Drive real Blender (not code that draws 3D) through the community
`blender-mcp` integration: an MCP server plus a Blender addon talking over a
local socket. Validated 2026-09-07 against
https://github.com/ahujasid/blender-mcp (third-party, not made by Blender).

## When To Activate

- The user wants the agent to model, edit, texture, or render in Blender.
- Image/SVG → 3D mesh workflows, scene assembly, material passes.
- `blender-mcp` install, connection, or tool errors.

## Setup (official quickstart)

1. Install `uv` with the **official installer** (not `pip install uv`):
   macOS `brew install uv`; Linux `curl -LsSf https://astral.sh/uv/install.sh | sh`;
   Windows `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`.
2. Register the MCP server (one instance only — never two clients at once):
   - Claude Code: `claude mcp add blender uvx blender-mcp`
   - Codex: `codex mcp add blender -- uvx blender-mcp`
   - Desktop/Cursor/VS Code: `{"command": "uvx", "args": ["blender-mcp"]}`
     (Windows GUI: `{"command": "cmd", "args": ["/c", "uvx", "blender-mcp"]}`).
   - OpenCode/Antigravity: same command with `BLENDER_HOST`/`BLENDER_PORT` env.
3. Install the addon: `uvx blender-mcp install-addon`, then Blender →
   Edit → Preferences → Add-ons → enable "Interface: MCP for Blender".
4. Connect: in the 3D viewport press `N` → "MCP for Blender" tab →
   Start MCP Server (default `localhost:9876`, env `BLENDER_HOST`/`BLENDER_PORT`).
5. Requirements: Blender 3.0+, Python 3.10+ (pin `--python 3.11` with
   `UV_PYTHON_PREFERENCE=only-managed` if conda/pyenv hijacks `uvx`).

## Capabilities

- Scene/object info, create/modify/delete objects, materials and colors.
- `execute_blender_code`: arbitrary Python in Blender — powerful, dangerous.
- Asset sources: Poly Haven (HDRIs/textures), Sketchfab, Poly Pizza low-poly
  (keys stored in addon preferences; ~69% of Poly Pizza needs attribution),
  Hyper3D Rodin / Hunyuan3D generated models.
- `BLENDER_MCP_SAFE_MODE=1` validates scripts before running (blocks file,
  process, network access; normal modeling still works). **Always save the
  .blend before executing generated code.**

## SVG-First Cost-Gate (mandatory)

Meshes and animation burn tokens. Never model blind:

1. **Image first**: concept art / sprite-sheet + lore; re-attach renders
   ("closer to the attachment") until the look converges.
2. **Cheap validation**: approve a short test scene or SVG before any mesh work.
3. **Mesh second**: SVG → mesh, materials, lighting — one pass at a time.
4. **Screenshot verify**: `get_viewport_screenshot` after every pass; fix from
   the screenshot, not from memory.
5. Long loops are normal (multi-hour to hit target fps/quality) — that is
   expected iteration, not failure.

## Troubleshooting

| Problem | Fix |