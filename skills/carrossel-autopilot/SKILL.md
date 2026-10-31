---
name: carrossel-autopilot
description: "Use when producing an organic Instagram/TikTok/LinkedIn carousel that stops the scroll and earns saves and comments — facts, brief, 5 covers, slide script, HTML visuals, review checklist. Triggers PT: \"carrossel\", \"carrossel viral\", \"carrossel instagram\", \"fazer carrossel\", \"carrossel com ia\". Triggers EN: \"carousel post\", \"instagram carousel\", \"viral carousel\". Non-triggers: paid ad creatives with Meta/UTM publish (use ads-creative-factory); carousel derived from an episode (use post-production-pipeline). Outcome: approved carousel exported per platform plus caption, hashtags, DM checklist, and a style catalog that improves every run."
metadata:
  origin: ECC
  validated: 2026-10-31
  source_video: sFgPZZXwMMk
  official_sources:
    - https://www.facebook.com/business/ads-guide
    - https://help.instagram.com/1038071743007909
---

# Carrossel Autopilot — carrossel orgânico que para a rolagem

Método do @maestrosdaia (`sFgPZZXwMMk`): uma skill de carrossel treinada com prints
de referência, seis regras universais e seis etapas com aprovação humana entre elas.
Não é gerador de imagem: é um pipeline editorial que só vira imagem no fim.

## Quando usar

- Carrossel orgânico (IG, TikTok, LinkedIn) para notícia, tutorial, comparativo ou oferta.
- A conta já posta carrossel e quer padronizar estilo + velocidade.
- Existe uma pasta com 10–15 prints do estilo desejado (obrigatório; sem ela, não gerar).

## Quando NÃO usar

- Anúncio pago com UTM e publicação na Meta → `ads-creative-factory`.
- Carrossel derivado de episódio/podcast → `post-production-pipeline`.
- Notícia sem fonte oficial verificável → não publique: a regra 6 exige fato antes da capa.
- Sem referência visual e sem orçamento para imagem → o resultado sai medíocre e queima tokens.

## As 6 regras (dials)

1. **Capa para a rolagem** — ≤8 palavras, com número ou resultado específico.
2. **Slide 2 ganha o deslize** — prova que a capa não mentiu; nunca "oi, eu sou fulano".
3. **Todo slide se sustenta sozinho** — teste do print no WhatsApp: faz sentido isolado?
4. **Um slide precisa ser salvo** — desenhe esse primeiro e monte o resto em volta.
5. **CTA conquista ação** — comentar palavra-chave e receber material na DM, não "me siga".
6. **Ordem fixa** — fatos → brief → gancho → roteiro → visual → revisão. Nada vira imagem antes do texto final.

## Pipeline (6 etapas, gate humano em cada uma)

| # | Etapa | Entrega | Gate |
|---|---|---|---|
| 0 | Entrada | tema, público, objetivo, plataforma, CTA, @, animação? teto de créditos | sem referência visual = parar |
| 1 | Checagem de fatos | todo número com fonte oficial (Meta, docs do produto) + data | aprovar fatos |
| 2 | Brief | promessa, crença antes→depois, slide salvável, CTA provisório | aprovar brief |
| 3 | Gancho | 5 capas com fórmulas diferentes + slide 2 de cada, 1 recomendada | escolher capa |
| 4 | Roteiro | tabela: função, título, texto de apoio, direção visual | ajustar texto AQUI |
| 5 | Visual | capa em modelo de imagem, miolo em HTML/JS, painel de ajustes | escolher estilo e aprovar |
| 6 | Revisão | checklist preenchido + export por plataforma + legenda/hashtags | aprovar e exportar |

Custo: modelo de imagem só na capa (CTA opcional); miolo em código = 0 créditos.
Estilo 100% código existe, mas a capa decide o "parar ou passar" — é onde vale gastar.
Com OpenArt via MCP, pedir estimativa de créditos e saldo **antes** de gerar.

## Arquivos de apoio

- `references/metodo-completo.md` — prompts por etapa, campos de entrada, formato do catálogo de estilos, memória de temas, exportação.
- `references/catalogo-estilos.md` — os 13 estilos observados nas referências e como numerar o seu.
- `references/checklist-revisao.md` — checklist final antes de entregar/publicar.
- `references/openart-mcp.md` — conectar OpenArt por MCP, Director Mode, custo em créditos e reaproveitamento de assets.

## Regras de operação

- Cada erro registrado vira regra nova no catálogo — o próximo carrossel sai melhor.
- Antes de gerar, consulte a memória de temas: se já existe, pergunte se quer repetir.
- Referência é linguagem visual, não conteúdo: nunca copie @, foto ou texto de outro perfil.
- Publicação automática é etapa separada (`social-publisher`); esta skill entrega os arquivos.
