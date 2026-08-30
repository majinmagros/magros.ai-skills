#!/usr/bin/env node
/**
 * Generate universal command registry for portability
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const ROOT = join(__dirname, "..");

const modules = JSON.parse(readFileSync(join(ROOT, "manifests/install-modules.json"), "utf8"));

function readSkillMeta(skillPath) {
  const skillMd = join(skillPath, "SKILL.md");
  if (!existsSync(skillMd)) return null;
  const content = readFileSync(skillMd, "utf8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  try {
    const yaml = fmMatch[1];
    const nameMatch = yaml.match(/name:\s*(.+)/);
    const descMatch = yaml.match(/description:\s*\|?\s*([\s\S]*?)(?:\n\w+:|$)/);
    return {
      name: nameMatch ? nameMatch[1].trim() : basename(skillPath),
      description: descMatch ? descMatch[1].trim().slice(0, 200) : ""
    };
  } catch { return null; }
}

const skillDirs = readdirSync(join(ROOT, "skills")).filter(d => {
  return existsSync(join(ROOT, "skills", d, "SKILL.md"));
});

const skills = [];
for (const dir of skillDirs) {
  const meta = readSkillMeta(join(ROOT, "skills", dir));
  if (meta) {
    meta.id = dir;
    meta.path = "skills/" + dir;
    skills.push(meta);
  }
}

const rootCommands = [];
if (existsSync(join(ROOT, "commands"))) {
  for (const file of readdirSync(join(ROOT, "commands")).filter(f => f.endsWith(".md"))) {
    const content = readFileSync(join(ROOT, "commands", file), "utf8");
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let name = file.replace(".md", "");
    let description = "";
    if (fmMatch) {
      const descMatch = fmMatch[1].match(/description:\s*(.+)/);
      if (descMatch) description = descMatch[1].trim();
    }
    rootCommands.push({
      name,
      description,
      type: "slash",
      source: "core",
      file: "commands/" + file
    });
  }
}

const skillCommands = [];
for (const skill of skills) {
  const cmdDir = join(ROOT, "skills", skill.id, "references", "claude-commands");
  if (existsSync(cmdDir)) {
    for (const file of readdirSync(cmdDir).filter(f => f.endsWith(".md"))) {
      const content = readFileSync(join(cmdDir, file), "utf8");
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
      let name = file.replace(".md", "");
      let description = "";
      if (fmMatch) {
        const descMatch = fmMatch[1].match(/description:\s*(.+)/);
        if (descMatch) description = descMatch[1].trim();
      }
      skillCommands.push({
        name,
        description,
        type: "slash",
        source: "skill",
        skill: skill.id,
        file: "skills/" + skill.id + "/references/claude-commands/" + file
      });
    }
  }
}

const hooks = [];
const hookDirs = [
  { path: join(ROOT, "hooks"), source: "core" },
  ...skills.filter(s => existsSync(join(ROOT, "skills", s.id, "hooks"))).map(s => ({
    path: join(ROOT, "skills", s.id, "hooks"),
    source: "skill",
    skill: s.id
  }))
];

for (const { path, source, skill } of hookDirs) {
  if (existsSync(path)) {
    for (const file of readdirSync(path).filter(f => /\.(mjs|js|py|sh)$/.test(f))) {
      hooks.push({
        name: file,
        type: "hook",
        source,
        skill,
        file: (source === "core" ? "hooks" : "skills/" + skill + "/hooks") + "/" + file
      });
    }
  }
}

const mcpConfigs = [];
if (existsSync(join(ROOT, "mcp-configs"))) {
  for (const file of readdirSync(join(ROOT, "mcp-configs")).filter(f => f.endsWith(".json"))) {
    mcpConfigs.push({
      name: file.replace(".json", ""),
      type: "mcp",
      source: "core",
      file: "mcp-configs/" + file
    });
  }
}

const settingsHooks = [];
for (const skill of skills) {
  const shPath = join(ROOT, "skills", skill.id, "references", "settings-hooks.json");
  if (existsSync(shPath)) {
    settingsHooks.push({
      name: skill.id + "-settings-hooks",
      type: "settings-hooks",
      source: "skill",
      skill: skill.id,
      file: "skills/" + skill.id + "/references/settings-hooks.json"
    });
  }
}

const registry = {
  generatedAt: new Date().toISOString(),
  version: "1.0",
  total: {
    skills: skills.length,
    rootCommands: rootCommands.length,
    skillCommands: skillCommands.length,
    hooks: hooks.length,
    mcpConfigs: mcpConfigs.length,
    settingsHooks: settingsHooks.length
  },
  skills,
  commands: { root: rootCommands, skill: skillCommands },
  hooks,
  mcpConfigs,
  settingsHooks
};

const platformMatrix = {
  platforms: [
    "claude-code", "claude-project", "opencode", "cursor", "codex",
    "gemini-cli", "zed", "qwen", "kimi", "hermes", "openclaw", "antigravity"
  ],
  capabilities: {
    slashCommands: {
      "claude-code": { native: true, path: ".claude/commands/", ext: ".md" },
      "claude-project": { native: true, path: ".claude/commands/", ext: ".md" },
      "opencode": { native: true, path: ".opencode/commands/", ext: ".md" },
      "cursor": { native: true, path: ".cursor/commands/", ext: ".md" },
      "codex": { native: true, path: "CODEX_COMMANDS.md", ext: "md" },
      "gemini-cli": { native: false, adapter: "gemini-skills", note: "Uses Agent Skills system" },
      "zed": { native: false, adapter: "zed-extensions", note: "Extension-based" },
      "qwen": { native: false, adapter: "qwen-skills", note: "Skills-based" },
      "kimi": { native: false, adapter: "kimi-skills", note: "Skills-based" },
      "hermes": { native: true, path: ".hermes/commands/", ext: ".md" },
      "openclaw": { native: true, path: ".openclaw/commands/", ext: ".md" },
      "antigravity": { native: false, adapter: "antigravity-skills", note: "Custom" }
    },
    hooks: {
      "claude-code": { native: true, events: ["PreToolUse", "PostToolUse", "Stop", "StartSession", "SubAgentStop", "Notification"], config: ".claude/settings.json" },
      "claude-project": { native: true, events: ["PreToolUse", "PostToolUse", "Stop", "StartSession", "SubAgentStop", "Notification"], config: ".claude/settings.json" },
      "opencode": { native: true, events: ["pre_tool", "post_tool", "stop", "start_session"], config: ".opencode/hooks.json" },
      "cursor": { native: true, events: ["onSave", "onRun", "onTerminal"], config: ".cursor/rules/" },
      "codex": { native: true, events: ["pre_exec", "post_exec"], config: "codex-hooks.json" },
      "gemini-cli": { native: false, adapter: "gemini-hooks", note: "Via Agent Skills" },
      "zed": { native: false, adapter: "zed-hooks", note: "Extension API" },
      "qwen": { native: false },
      "kimi": { native: false },
      "hermes": { native: true, config: ".hermes/hooks.json" },
      "openclaw": { native: true, config: ".openclaw/hooks.json" },
      "antigravity": { native: false }
    },
    mcp: {
      "claude-code": { native: true, config: "mcp-config.json" },
      "claude-project": { native: true, config: "mcp-config.json" },
      "opencode": { native: true, config: ".opencode/mcp.json" },
      "cursor": { native: true, config: ".cursor/mcp.json" },
      "codex": { native: true, config: "mcp.json" },
      "gemini-cli": { native: true, config: ".gemini/mcp.json" },
      "zed": { native: true, config: ".zed/mcp.json" },
      "qwen": { native: false },
      "kimi": { native: false },
      "hermes": { native: true },
      "openclaw": { native: true },
      "antigravity": { native: false }
    },
    skillsLoading: {
      "claude-code": { native: true, path: ".claude/skills/", auto: true },
      "claude-project": { native: true, path: ".claude/skills/", auto: true },
      "opencode": { native: true, path: ".opencode/skills/", auto: true },
      "cursor": { native: true, path: ".cursor/skills/", auto: true },
      "codex": { native: true, path: ".codex/skills/", auto: true },
      "gemini-cli": { native: true, path: ".gemini/skills/", note: "Agent Skills format" },
      "zed": { native: false, note: "Via extensions" },
      "qwen": { native: true, path: ".qwen/skills/" },
      "kimi": { native: true, path: ".kimi/skills/" },
      "hermes": { native: true, path: ".hermes/skills/" },
      "openclaw": { native: true, path: ".openclaw/skills/" },
      "antigravity": { native: false }
    },
    costTracking: {
      "claude-code": { native: true, note: "Via hooks + cost-tracker skill" },
      "claude-project": { native: true, note: "Via hooks + cost-tracker skill" },
      "opencode": { native: false, note: "Requires custom implementation" },
      "cursor": { native: false },
      "codex": { native: false },
      "gemini-cli": { native: false },
      "zed": { native: false },
      "qwen": { native: false },
      "kimi": { native: false },
      "hermes": { native: false },
      "openclaw": { native: false },
      "antigravity": { native: false }
    },
    memory: {
      "claude-code": { native: true, type: "file-based", path: ".claude/memory/" },
      "claude-project": { native: true, type: "file-based", path: ".claude/memory/" },
      "opencode": { native: true, type: "sqlite", path: ".opencode/memory.db" },
      "cursor": { native: false },
      "codex": { native: false },
      "gemini-cli": { native: true, type: "notebook", path: ".gemini/notebooks/" },
      "zed": { native: false },
      "qwen": { native: false },
      "kimi": { native: false },
      "hermes": { native: true, type: "file-based" },
      "openclaw": { native: true, type: "file-based" },
      "antigravity": { native: false }
    },
    permissions: {
      "claude-code": { model: "auto/ask/manual", config: ".claude/settings.json" },
      "claude-project": { model: "auto/ask/manual", config: ".claude/settings.json" },
      "opencode": { model: "allow/deny/ask", config: ".opencode/permissions.json" },
      "cursor": { model: "per-command", config: ".cursor/rules/" },
      "codex": { model: "auto/ask", config: "codex-permissions.json" },
      "gemini-cli": { model: "per-skill", note: "Agent Skills permissions" },
      "zed": { model: "per-extension" },
      "qwen": { model: "per-skill" },
      "kimi": { model: "per-skill" },
      "hermes": { model: "auto/ask/manual" },
      "openclaw": { model: "auto/ask/manual" },
      "antigravity": { model: "custom" }
    }
  }
};

const output = { registry, platformMatrix };

writeFileSync(join(ROOT, "docs", "command-registry.json"), JSON.stringify(output, null, 2));
console.log("Generated docs/command-registry.json");
console.log("   Skills: " + output.registry.total.skills);
console.log("   Root commands: " + output.registry.total.rootCommands);
console.log("   Skill commands: " + output.registry.total.skillCommands);
console.log("   Hooks: " + output.registry.total.hooks);
console.log("   MCP configs: " + output.registry.total.mcpConfigs);
console.log("   Settings hooks: " + output.registry.total.settingsHooks);
console.log("   Platforms: " + output.platformMatrix.platforms.length);