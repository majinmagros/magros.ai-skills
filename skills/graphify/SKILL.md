---
name: graphify
description: Use when answering questions about a large/legacy codebase burns tokens or hallucinates, or when onboarding to a new repo. Triggers on "graphify", "grafo de conhecimento", "mapa do repositório", "entender a arquitetura", "consome muitos tokens", "como X conecta com Y", "onboarding em projeto". Turns a repo into a queryable knowledge graph.
---

# Skill: Graphify — repositório vira grafo de conhecimento

Transforma um repositório inteiro (código, docs, PDFs, áudio, vídeo) num
grafo de conhecimento consultável. Em vez de varrer arquivo por arquivo
(grep/ctrl+F cegos queimando tokens e errando), o agente consulta o mapa.

## 1. Quando usar

- Perguntas sobre projeto grande: "como o login conecta com a tabela de
  usuários?" (cadeia form → endpoint → serviço → tabela).
- Onboarding em projeto novo ou herdado.
- Respostas com alucinação porque o agente não viu as conexões reais.
- Economizar tokens em consultas frequentes sobre a mesma base.

## 2. RAG vetorial vs grafo (tradeoff)

| | RAG vetorial | Grafo |
|---|---|---|
| Responde | "o que é parecido" | "como as coisas se conectam" |
| Ideal | Textos soltos por tema | Arquitetura/dependências |
| Mudança | Re-embeda TUDO de novo | Grafo vivo: atualiza só o que mudou |

## 3. Instalação/uso

- Open source, MIT, ~70k★ (`graphify` no GitHub). Funciona com qualquer agente.
- Vem com **skill embutida** que ensina o próprio Claude a usar.
- Comandos principais: `/graphify` (indexa o diretório), `/graphify explain`
  (consulta o grafo), `/graphify claude install` (fica sempre ligado, consulta
  o grafo em toda pergunta), flag Obsidian (`/graphify obsidian`).
- 3 camadas de indexação: estrutura de código (determinística, sem LLM) →
  áudio/vídeo (whisper) → docs/imagens (semântica com LLM).

## 4. Processo

1. Confirme que o repo está indexado (ou rode `/graphify`).
2. Para perguntas de conexão/arquitetura: force consulta ao grafo
   ("olhe o grafo antes de responder").
3. Entregue a resposta com o caminho das conexões (nó → aresta → nó).
4. Se o código mudou muito, re-indexe (grafo vivo atualiza só o afetado).

## 5. Regra

- Grafo é para RELAÇÕES. Conteúdo solto por tema ainda é caso de vetorial —
  não force grafo onde RAG resolve.
