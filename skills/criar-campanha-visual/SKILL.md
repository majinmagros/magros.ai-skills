---
name: criar-campanha-visual
description: Use when creating visual ad campaigns (images/video) with budget control and brand references. Triggers on "gera campanha", "anúncios para a marca", "campanha visual", "imagens da marca", "orçamento de geração", "modelo mais barato". Routes to the cheapest available model, uses brand reference images, logs every generation.
---

# Skill: Criar-campanha-visual — anúncios com orçamento e referências de marca

Gera campanha visual (imagens/site/vídeo) seguindo a identidade da marca,
escolhendo o fornecedor mais barato e registrando o histórico. Substitui
assinaturas de plataforma por pagamento por uso, com POSSE dos arquivos.

## 1. Estrutura da skill/do repositório

```
.env                  # chaves de API (nunca no git)
referencias/          # logo, fotos, estilo visual da marca (inputs)
geracoes/             # imagens/vídeos gerados (outputs)
modelos-imagem/       # lista de modelos permitidos
modelos-video/        # lista de modelos permitidos
SKILL.md              # instruções de funcionamento
```

## 2. Processo (4 etapas)

1. **Roteirizar**: consulte os fornecedores de imagem/vídeo disponíveis e
   escolha o modelo mais barato para o pedido (evite modelos aleatórios).
2. **Preparar referências**: carregue imagens reais da pasta `referencias/`
   (logo, fotos, estilo) — resultado fica próximo da marca.
3. **Gerar**: chame a API com o modelo escolhido; confira status; salve em
   `geracoes/`.
4. **Registrar**: grave o prompt usado + modelo + resultado em JSON/histórico —
   permite regenerar depois sem depender da plataforma.

## 3. Regras do prompt de campanha

- **Orçamento fechado**: "orçamento total $X, não ultrapasse".
- **Modelos permitidos**: liste os que podem ser usados (ex.: GPT Image 2,
  Nano Banana Pro/2/2 Lite).
- **Provedor mais barato** entre os acessíveis.
- **Cada anúncio/imagem deve apresentar o produto**.
- **Referências**: anexe imagens da marca.

## 4. Regras

- **Posse**: prompts e arquivos ficam locais — cancele assinatura sem perder nada.
- Chaves em `.env`, `.gitignore` cobrindo o arquivo.
- Se um modelo/fornecedor sumir, o histórico permite regenerar em outro.

## Enriquecimento 2026-08-24 — instruction file de estilo visual aprovado

Fonte `hC00Qdhfjww` (AI Foundations). Quando uma imagem/capa gerada for aprovada: extraia o estilo dela ("extraia este estilo") e persista em `image-styles/<nome>.md` reutilizável — próximas gerações partem do estilo congelado em vez de re-descrever do zero. Mesmo princípio do warm start do `score-loop`, aplicado a identidade visual.
