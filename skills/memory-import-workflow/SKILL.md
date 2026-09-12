---
name: memory-import-workflow
description: Use when importing memory between sessions — export, prompt interview, voice input (Sponcle), validate, sync across sessions. Triggers on "memory import workflow", "importar memoria claude", "exportar memoria chatgpt para claude", "entrevista memoria voz", "sponcle voice workflow", "sincronizar memoria sessoes".
metadata:
  origin: AUTORAL
  source_docs:
    - https://www.youtube.com/watch?v=Bezlzmti6_U (Luciana Papini video)
    - https://docs.anthropic.com/en/docs/claude-code/memory
  platforms: [claude-code, opencode, cursor, codex, gemini-cli, hermes, openclaw]
  requires_adapters: [hooks, commands]
---

# Memory Import Workflow — Workflow Padronizado de Importação de Memória

Workflow padronizado para **importar memória de outras IAs → validar via entrevista de voz (Sponcle) → sincronizar entre sessões**.

## Quando usar (gatilhos concretos)

- "Importe minha memória do ChatGPT pro Claude"
- "Workflow de importação de memória"
- "Entrevista de voz para validar memória importada"
- "Sincronizar memória entre sessões do Claude"
- "Exportar memória do ChatGPT e importar no Claude"

## Quando NÃO usar

- Configurar conta do zero → use `claude-account-optimizer`
- Criar skills do zero → use `criar-skill`
- Gerenciar projetos → use `claude-project-template`

## Pipeline (Baseado no vídeo Luciana Papini)

### 1. Export Memory (Origem)

```bash
# ChatGPT
Settings → Memory → Export → Download JSON

# Outras ferramentas
# Exportar conversas/memórias em formato JSON
```

### 2. Import no Claude

```bash
# Settings → Memory → Import → Upload JSON
# O Claude organiza automaticamente
```

### 3. Entrevista de Validação (OBRIGATÓRIA)

```markdown
# Prompt de Entrevista (usar com Sponcle/Whisper)

"Me entreviste para me conhecer melhor e trabalhar melhor comigo.
Faça uma pergunta por vez sobre: minha vida, trabalho, negócio, objetivos, projetos,
e principalmente COMO EU GOSTO DE TRABALHAR.

Faça uma pergunta por vez. Aguarde minha resposta antes da próxima."
```

**Ferramenta recomendada:** Sponcle (voice-to-text gratuito, melhor que áudio nativo do Claude)

### 4. Validação & Sync
