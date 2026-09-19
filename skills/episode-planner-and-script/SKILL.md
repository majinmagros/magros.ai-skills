---
name: episode-planner-and-script
description: Lê a pesquisa bruta, consulta o histórico de episódios anteriores (memória de contexto), seleciona os 4 principais destaques e gera o roteiro completo seguindo o tom de voz do canal. Trigger: "planeja episódio", "gera roteiro da semana", "seleciona 4 notícias roteiro".
metadata:
  origin: ECC
  depends_on:
    - multi-source-researcher
    - domain-context-model
    - brand-voice
---

# Skill: Episode Planner & Script Generator

Transforma `research/pesquisa-bruta-NN.md` em `episodes/eps-NN-roteiro.md`, garantindo alinhamento com o tom de voz e evitando repetição de temas já abordados nos episódios anteriores.

## Quando usar

- "planeja o episódio dessa semana"
- "gera o roteiro com base na pesquisa bruta"
- Roda após `multi-source-researcher`

## Entradas

1. `research/pesquisa-bruta-2026-W38.md`
2. Histórico de contexto: `episodes/` (episódios 1 até N-1) para evitar duplicação
3. Perfil de voz (`brand-voice` / `CONTEXT.md` / `agents.md`)

## Saída

`episodes/eps-33-roteiro.md`

```markdown
# Episódio 33 - Roteiro Oficial
**Data de gravação**: 2026-09-18
**Status**: Pronto para gravação

## 1. Intro (00:00 - 00:45)
- Gancho da semana (recap 32 semanas religiosamente)
- Menção rápida ao agente (Cloud Code / Ratos OS)

## 2. Destaque 1: [Tema A] (00:45 - 02:30)
- Contexto da notícia (fonte X e Y)
- Por que importa pro dev/engenheiro de IA

## 3. Destaque 2: [Tema B] (02:30 - 04:15)
...
## 6. Encerramento & Call to Action (08:00 - 09:00)
- Pedir like / comentário / inscrição no Ratos OS
```

## Regras de Execução

1. **Anti-duplicação**: checa se os últimos 3 episódios cobriram o mesmo tema exato. Se sim, descarta ou traz um ângulo 100% novo.
2. **Seleção**: escolhe estritamente os **4 melhores** itens da pesquisa (impacto real em IA/dev).
3. **Tom de voz**: linguagem direta, técnica mas acessível, sem termos corporativos vazios ("sinergia", "disruptivo").

## Gate de aceite

- Roteiro gerado com exatamente 4 notícias centrais
- Sem repetição com os últimos 3 episódios salvos
- Estrutura completa (Intro + 4 Tópicos + Encerramento/CTA)