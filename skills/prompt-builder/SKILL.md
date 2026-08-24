---
name: prompt-builder
description: Use when the user wants a lazy/vague prompt improved or adapted — generate from scratch, fix, or port to another model/tool. Triggers on "melhora esse prompt", "estrutura o prompt", "prompt melhor", "conserta meu prompt", "garbage in garbage out", "prompt para imagem/vídeo/código". Applies the 4 pillars of good prompting.
---

# Skill: Prompt-builder — transforma instrução preguiçosa em prompt bom

Resolve a "preguiça humana": a IA só responde tão bem quanto a instrução
(garbage in, garbage out). Esta skill estrutura o prompt antes de usar.

## 1. Os 4 pilares de um bom prompt

| Pilar | Pergunta a responder |
|---|---|
| **Objetivo** | O que exatamente deve ser entregue? |
| **Contexto** | Quem é o público, qual o cenário, o que já se sabe? |
| **Exemplo** | Um exemplo de entrada/saída esperada, se houver. |
| **Restrições** | Formato, tom, idioma, limites, o que NÃO fazer. |

## 2. Modos de uso

- **Gerar do zero**: recebe ideia solta → vira prompt estruturado.
- **Consertar**: recebe prompt que dá resultado ruim → identifica o pilar fraco → corrige.
- **Adaptar por modelo**: Claude, GPT e Gemini respondem diferente — ajuste a ênfase
  (ex.: Claude = instruções diretas; modelos de imagem/vídeo = prompt descritivo visual).
- **Adaptar por mídia**: texto, imagem, vídeo, código — cada um quer vocabulário próprio.

## 3. Processo

1. Se o prompt de origem for vago, **pergunte** o mínimo necessário para os 4 pilares
   (ou use contexto já disponível — não encha de perguntas se já dá pra inferir).
2. Reescreva estruturado: objetivo em 1 frase + contexto + exemplo + restrições.
3. Entregue **o prompt final pronto para colar** + 1 linha: o que mudou e por quê.

## 4. Exemplo (preguiçoso → estruturado)

> Lazy: "me ajuda com marketing"
>
> Bom: "Crie 3 opções de legenda de Instagram para um café local de bairro,
> tom casual e caloroso, máximo 90 caracteres cada, incluindo 1 CTA ('vem
> provar o novo cold brew'). Não usar hashtags."

## 5. Regra

- Prompt bom não é prompt longo — é prompt que preenche os 4 pilares sem encher linguiça.

## 6. Modo system-prompt (para agentes, 2026-08-24)

Os 4 pilares valem para **user prompts**; para agentes que rodam muitas vezes, o
maior leverage é o **system prompt** (aplica-se a toda entrada/saída). Padrões
validados (fonte: IndyDevDan `S_QdQ1G4GlU`; flags em code.claude.com/docs/en/cli-reference):

| Padrão | O que escrever |
|---|---|
| **Positive/negative patterns** | Seção "replicue estes padrões" + seção "evite estas palavras/padrões" (lista explícita de tiques do modelo). |
| **Reference points** | Códigos curtos por categoria (D1/D2=decisões, R1..Rn=risks, F=findings); "preserve os códigos na conversa; não crie códigos para respostas curtas". Permite retomar com "fale mais sobre R6". |
| **Hard operational boundaries** | "Entregue só o pedido no escopo; não expanda para cleanup/refactor; não afirme conclusão sem evidência; nunca adicione co-author em commit." |
| **Aliases** | Códigos que expandem na hora (SCR=simplifique/comprima/reponha; ELI18; FOC=sinal principal). Se aparecerem dentro de string maior, não expandir. |
| **Exemplos reais** | Par user→resposta boa vs user→resposta ruim ("in-context distillation"). Copie a resposta do modelo que você gosta, edite, e use como exemplo. |

Flags oficiais Claude Code: `--append-system-prompt` (preserva o default — usar
na maioria dos casos), `--system-prompt` (substitui tudo — cuidado), `-file`
variações (as file são Print-only). Efeito colateral desejado: menos output
tokens = menos custo e resposta mais rápida.
