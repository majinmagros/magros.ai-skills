---
name: prompt-builder
description: Use when the user wants a lazy/vague prompt improved or adapted â€” generate from scratch, fix, or port to another model/tool. Triggers on "melhora esse prompt", "estrutura o prompt", "prompt melhor", "conserta meu prompt", "garbage in garbage out", "prompt para imagem/vÃ­deo/cÃ³digo". Applies the 4 pillars of good prompting.
---

# Skill: Prompt-builder â€” transforma instruÃ§Ã£o preguiÃ§osa em prompt bom

Resolve a "preguiÃ§a humana": a IA sÃ³ responde tÃ£o bem quanto a instruÃ§Ã£o
(garbage in, garbage out). Esta skill estrutura o prompt antes de usar.

## 1. Os 4 pilares de um bom prompt

| Pilar | Pergunta a responder |
|---|---|
| **Objetivo** | O que exatamente deve ser entregue? |
| **Contexto** | Quem Ã© o pÃºblico, qual o cenÃ¡rio, o que jÃ¡ se sabe? |
| **Exemplo** | Um exemplo de entrada/saÃ­da esperada, se houver. |
| **RestriÃ§Ãµes** | Formato, tom, idioma, limites, o que NÃƒO fazer. |

## 2. Modos de uso

- **Gerar do zero**: recebe ideia solta â†’ vira prompt estruturado.
- **Consertar**: recebe prompt que dÃ¡ resultado ruim â†’ identifica o pilar fraco â†’ corrige.
- **Adaptar por modelo**: Claude, GPT e Gemini respondem diferente â€” ajuste a Ãªnfase
  (ex.: Claude = instruÃ§Ãµes diretas; modelos de imagem/vÃ­deo = prompt descritivo visual).
- **Adaptar por mÃ­dia**: texto, imagem, vÃ­deo, cÃ³digo â€” cada um quer vocabulÃ¡rio prÃ³prio.

## 3. Processo

1. Se o prompt de origem for vago, **pergunte** o mÃ­nimo necessÃ¡rio para os 4 pilares
   (ou use contexto jÃ¡ disponÃ­vel â€” nÃ£o encha de perguntas se jÃ¡ dÃ¡ pra inferir).
2. Reescreva estruturado: objetivo em 1 frase + contexto + exemplo + restriÃ§Ãµes.
3. Entregue **o prompt final pronto para colar** + 1 linha: o que mudou e por quÃª.

## 4. Exemplo (preguiÃ§oso â†’ estruturado)

> Lazy: "me ajuda com marketing"
>
> Bom: "Crie 3 opÃ§Ãµes de legenda de Instagram para um cafÃ© local de bairro,
> tom casual e caloroso, mÃ¡ximo 90 caracteres cada, incluindo 1 CTA ('vem
> provar o novo cold brew'). NÃ£o usar hashtags."

## 5. Regra

- Prompt bom nÃ£o Ã© prompt longo â€” Ã© prompt que preenche os 4 pilares sem encher linguiÃ§a.
