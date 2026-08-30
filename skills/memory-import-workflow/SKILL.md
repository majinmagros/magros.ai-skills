---
name: memory-import-workflow
description: |
  Workflow padronizado de importação de memória: export memory → prompt interview → voice input (Sponcle) → validate → sync across sessions. Baseado no vídeo da Luciana Papini "Me de 34 minutos e eu te darei 10 000 horas de conhecimento do Claude".
  Use quando: "memory import workflow", "importar memoria claude", "exportar memoria chatgpt para claude", "entrevista memoria voz", "sponcle voice workflow", "sincronizar memoria sessoes". Non-triggers: criar skills do zero (use criar-skill), configurar conta do zero (use claude-account-optimizer).
  Outcome: Workflow padronizado memory import + voice interview (Sponcle) + validação + sync cross-session.
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

```python
# validate_memory_import.py
def validate_memory_import(memory_file: str) -> dict:
    with open(memory_file, 'r') as f:
        data = json.load(f)
    
    return {
        "conversations": len(data.get("conversations", [])),
        "memories": len(data.get("memories", [])),
        "valid": len(data.get("memories", [])) >= 5,
        "recommendations": [
            "Execute entrevista de voz se memories < 5"
        ]
    }
```

### 5. Sync Across Sessions

```json
// settings.json snippet
{
  "memory": {
    "auto_sync": true,
    "sync_interval_minutes": 30,
    "conflict_resolution": "newer_wins"
  }
}
```

---

## Checklist de Execução

- [ ] Exportar memory da ferramenta origem (JSON)
- [ ] Importar no Claude (Settings → Memory → Import)
- [ ] Executar entrevista de voz (Sponcle) - prompt acima
- [ ] Validar memórias importadas (mínimo 5 memórias)
- [ ] Configurar auto-sync entre sessões
- [ ] Testar recall em nova sessão

---

## Referências Oficiais (Validados 2026-08-30)

- [Luciana Papini Video](https://www.youtube.com/watch?v=Bezlzmti6_U)
- [Claude Code Memory Docs](https://docs.anthropic.com/en/docs/claude-code/memory)
- [Sponcle Voice Tool](https://sponcle.com)

---

## Adapters (Por Plataforma)

```
adapters/
├── opencode/
│   ├── hooks/
│   └── README.md
├── cursor/
│   ├── hooks/
│   └── README.md
├── codex/
│   ├── hooks/
│   └── README.md
└── ...
```