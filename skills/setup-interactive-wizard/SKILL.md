---
name: setup-interactive-wizard
description: Use when generating an interactive bash wizard to guide a human through manual operational steps that AI cannot perform (infrastructure provisioning, credential setup, third-party dashboard navigation, one-off migrations). Triggers on "wizard", "bash wizard", "passo a passo interativo", "guiar humano".
metadata:
  origin: Matt Pocock / ECC
---

# Setup Interactive Wizard

Generate interactive shell scripts/wizards to guide operators through manual setup steps.

## Core Concepts
- **Human-in-the-Loop Operations**: Bridging the gap when agents lack access, API keys, or permissions to complete provisioning steps.
- **Guided Workflows**: Interactive terminal prompts ensuring correct sequence, validation, and error checking for manual tasks.

## Workflow
1. Identify steps requiring human intervention (credentials, cloud consoles, manual approvals).
2. Generate an executable script (Node/Bash) with prompts, validation checks, and progress indicators.
3. Run and verify completion before proceeding with automated agent loops.

## Quando Ativar

- Passo manual que a IA não pode executar (provisionamento, credenciais, dashboard externo, migração one-off)
- Usuário diz "wizard", "bash wizard", "passo a passo interativo", "guiar humano"
- Guiar operador por sequência com validação e checagem de erro no terminal
- Coletar secrets/aprovações antes de retomar loop automatizado

## Exemplo

```bash
#!/usr/bin/env bash
read -rp "API key do provider: " API_KEY
[[ -z "$API_KEY" ]] && { echo "key obrigatória"; exit 1; }
echo "[1/3] key recebida — abrindo dashboard para confirmar..."
```
