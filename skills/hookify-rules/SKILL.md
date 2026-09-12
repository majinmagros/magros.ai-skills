---
name: hookify-rules
description: "Use when this skill should be used when the user asks to create a hookify rule, write a hook rule, configure hookify, add a hookify rule, or needs guidance on hookify rule syntax and patterns. Triggers on \"hookify-rules\", \"hookify rules\", \"rules\"."
---

# Writing Hookify Rules

## Overview

Hookify rules are markdown files with YAML frontmatter that define patterns to watch for and messages to show when those patterns match. Rules are stored in `.claude/hookify.{rule-name}.local.md` files.

## Rule File Format

### Basic Structure

```markdown
---
name: rule-identifier
enabled: true
event: bash|file|stop|prompt|all
pattern: regex-pattern-here
---

Message to show Claude when this rule triggers.
Can include markdown formatting, warnings, suggestions, etc.
```

### Frontmatter Fields

| Field | Required | Values | Description |
|-------|----------|--------|-------------|
| name | Yes | kebab-case string | Unique identifier (verb-first: warn-*, block-*, require-*) |
| enabled | Yes | true/false | Toggle without deleting |
| event | Yes | bash/file/stop/prompt/all | Which hook event triggers this |
| action | No | warn/block | warn (default) shows message; block prevents operation |
| pattern | Yes* | regex string | Pattern to match (*or use conditions for complex rules) |

### Advanced Format (Multiple Conditions)

```markdown
---
name: warn-env-api-keys
enabled: true
event: file
conditions:
  - field: file_path
    operator: regex_match
    pattern: \.env$
  - field: new_text
    operator: contains
    pattern: API_KEY
---

You're adding an API key to a .env file. Ensure this file is in .gitignore!
```

**Condition fields by event:**
- bash: `command`
- file: `file_path`, `new_text`, `old_text`, `content`
- prompt: `user_prompt`

**Operators:** `regex_match`, `contains`, `equals`, `not_contains`, `starts_with`, `ends_with`

All conditions must match for rule to trigger.
