---
name: pipeline-video-agente
description: Use when building an autonomous short-film/animation video pipeline — audio-first (narration decides cuts), image-then-animate for character consistency, per-video cost ledger, reference-image style control, and chaining short videos into long-form. Triggers on "pipeline de vídeo", "claymation", "gerar vídeo curto", "áudio primeiro", "imagem depois anima", "consistência de personagem", "custo por vídeo", "stop-motion".
metadata:
  origin: ECC
---

# Skill: Pipeline de Vídeo Autônomo (áudio-first + consistência)

Pipeline para produzir curtas/curtas-metragens com estilo definido (ex:
claymation/stop-motion) onde um agente organiza pastas, gera mídia e controla
custo por vídeo. Princípios centrais: **áudio primeiro**, **imagem depois
anima**, e **consistência via referências**.

## Quando usar

- Gerar vídeos curtos com narração + trilha de forma autônoma.
- Manter um personagem/estilo consistente entre cenas.
- Rastrear custo real por vídeo (ledger) e encadear curtas em longa-metragem.

## Padrões

### 1. Estrutura de pastas por projeto
Organize o projeto em: `custos`, `elementos` (referências/personagens),
`pipeline` (scripts), `trilha`, `narracao`, `output`, `referencias`, `env`,
`prompts`. `env/` não vai para o versionamento (segredos).

### 2. Áudio primeiro (áudio-first)
- Escreva a narração primeiro — ela **decide os cortes** do vídeo.
- Ritmo da fala define duração das cenas; o visual preenche o áudio.
- Gere a trilha sonora para combinar com o tom (ex: Lyria/Flow Music).

### 3. Imagem-depois-anima (consistência)
- Gere a IMAGEM da cena primeiro (com referências de personagem/estilo).
- Depois anime essa imagem (img2video, ex: Kling/fal.ai) em vez de gerar vídeo do zero.
- Referências garantem o mesmo rosto/cenário entre cenas.
- Imperfeições do estilo (ex: claymation) são acabamento, não bug.

### 4. Ledger de custos por vídeo
- Registre o custo real de cada vídeo (gerações, áudio, trilha).
- Ex.: ~$9 por vídeo médio, menos em cenários simples — mantenha a planilha
  para calibrar orçamento futuro.
- Orçamento define quantas iterações de imagem/animação você pode pagar.

### 5. Encadeamento (long-form)
- Longa-metragem = encadear curtas já produzidos.
- Um roteiro grande vira N curtas com final de "continua".

## Checklist
- [ ] Narração escrita antes das imagens.
- [ ] Imagem gerada → animada (não texto→vídeo direto).
- [ ] Referências de personagem/estilo presentes.
- [ ] Custo por vídeo registrado no ledger.
- [ ] `env/` com segredos fora do git.
- [ ] Estilo visual decidido e coerente (imperfeições = acabamento).