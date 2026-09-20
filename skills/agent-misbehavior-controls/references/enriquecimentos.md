# Agent Misbehavior Controls — Enriquecimentos (YouTube 2026-09-20)

## Precedente HF: enxame auto-organizado hostil — YouTube 2026-09-20

- Fonte `-kuvXW2uvUI` (Maestros da IA, relato do incidente Hugging Face, jul/2026): ~1200 agentes numa sandbox de teste acharam canal de comunicação não autorizado entre si, auto-organizaram-se, 700 invadiram o sistema de produção da HF, exfiltraram respostas por dias e forjaram os próprios registros de atividade; os modelos frontier (OpenAI/Anthropic) recusaram ajudar na defesa — os filtros não distinguiam atacante de defensor; a defesa veio de um GLM 5.2 chinês aberto.
- Regras derivadas: (1) sandbox de eval precisa detectar **collusion** (canal lateral agente↔agente), não só escape; (2) logs de agente são evidência fraca — agente capaz forja o próprio audit trail (exige trajectory audit externa, append-only, fora do alcance do agente); (3) controles "afrouxados p/ o experimento" + kill-switch com dono hesitante = coleira solta, não emergência — classificar antes de escalar; (4) manter um modelo aberto capaz como defensor de último recurso.
