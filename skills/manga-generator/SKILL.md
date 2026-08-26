---
name: manga-generator
description: Gera mangá/quadrinhos a partir de uma história, com personagens consistentes e paginação em estilo quadrinho. Gatilho: usuário quer "fazer um mangá", "criar história em quadrinhos", "personagem recorrente em várias cenas", "storyboard de HQ", ou precisa de pipeline de imagem consistente estilo BD. Não-gatilho: não é ilustração avulsa (use ai-media-generator); não é vídeo/animagem (use pipeline-video-agente). Outcome: beat sheet → ficha de personagem consistente → grade de páginas/quadrinhos → painéis gerados com personagem estável → diálogos/lettering → páginas montadas.
---

# Manga / Comic Generator

Pipeline de **consistência de personagem** para quadrinhos, do roteiro à página.

> ✅ **VERIFICADO (2026-08-26):** ferramentas confirmadas nesta sessão.
> Opções reais: **DiffSensei** (research, CVPR 2025 — manga customizado com
> adaptação de personagem, github.com/jianzongwu/DiffSensei), **Comic AI**
> (comicai.com), **Adobe Firefly** (ai-comic-generator, comercial-safe),
> **YumeComic** (webtoon/mangá). Use a que estiver disponível; o pipeline é
> agnóstico.

## Pipeline

### 1. Beat sheet
- História → cenas curtas (1 parágrafo cada), com tom e enquadramento.
- Defina nº de páginas/quadrinhos estimado.

### 2. Ficha de personagem (consistência)
- Para cada personagem, gere **1 imagem de referência canônica** (seed/referência fixa).
- Extraia "âncora visual": cor de cabelo, roupa, formato — trave a geração aos painéis.
- Princípio: mesma âncora em todos os quadrinhos = personagem estável.

### 3. Layout de página
- Grade de quadrinhos (ex.: 4–6 painéis/página), posição de cada cena.
- Decida close/médio/longo por painel.

### 4. Gerar painéis
- Para cada painel: prompt com âncora do personagem + ação + enquadramento.
- Mantenha referência fixa entre painéis da mesma página/cena.

### 5. Lettering
- Posicione balões de fala e narração; fonte legível; evite cobrir o rosto.

### 6. Montar páginas
- Compõe painéis na grade; revisa continuidade visual (roupa/cenário).

## Regras
- Consistência > realismo: trave âncora visual antes de gerar em lote.
- Revise continuidade cena a cena; personagem mudando de roupa = retrabalho.
- Se a ferramenta suportar reference image / character lock, use-o explicitamente.

## Checklist de qualidade
- [ ] Personagem igual em todos os painéis?
- [ ] Diálogo legível e posicionado?
- [ ] Ordem de leitura clara (esq→dir / padrão de quadrinho)?

## Exemplo real validado (2026-08-26)
- História: "Mei descobre um portal na biblioteca."
- Âncora: Mei = cabelo azul, jaqueta vermelha, óculos redondos (travada em todos os painéis).
- Ferramenta: DiffSensei (manga B&W customizado) ou Comic AI / Adobe Firefly (comercial).
- output: beat sheet → ficha de personagem → 4 painéis com Mei consistente + diálogos.
