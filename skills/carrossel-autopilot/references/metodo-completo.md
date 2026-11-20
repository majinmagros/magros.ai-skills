# Método completo — carrossel autopilot

Fonte: `sFgPZZXwMMk` (@maestrosdaia, 2026-10-2x). A transcrição dedup fica fora
do repo, em `Oportunidades/maestros-da-ia/sFgPZZXwMMk.pt.dedup.txt`.

## Contents

- [0. Entrada](#0-entrada)
- [1. Checagem de fatos](#1-checagem-de-fatos)
- [2. Brief](#2-brief)
- [3. Gancho: 5 capas](#3-gancho-5-capas)
- [4. Roteiro em tabela](#4-roteiro-em-tabela)
- [5. Visual](#5-visual)
- [6. Revisão e exportação](#6-revisão-e-exportação)
- [Memória de temas](#memória-de-temas)

## 0. Entrada

A skill só começa quando estes campos existem (pergunte o que faltar, uma rodada só):

```text
Tema:
Público:
Objetivo: salvar | comentar | compartilhar | clicar
Plataforma: Instagram | TikTok | LinkedIn | YouTube
CTA: palavra-chave → recompensa na DM (ou "decido no último slide")
Assinatura: nome + @ para o rodapé
Animação: nenhuma | capa | CTA (opcional)
Teto de créditos: 0 | N (pergunta antes de qualquer geração paga)
Pasta de referências: caminho absoluto no computador
```

Sem pasta de referências, **pare**. O canal mostra o agente recusando gerar: sem
estilo de referência o resultado é medíocre e gasta tokens à toa.

## 1. Checagem de fatos

Antes da capa, porque refazer capa depois de corrigir dado estraga o layout.

- Todo número que vai ao slide é conferido em fonte oficial (Meta, docs do produto, release).
- Registrar URL + data da consulta ao lado de cada fato.
- Nenhuma afirmação vai além do que a fonte diz (o canal corrigiu "pode zerar" → "pode reiniciar").
- Limites de texto e formatos de imagem: conferir na spec oficial da plataforma no momento da checagem.

Saída: tabela `fato | número | fonte | data`. Gate: usuário aprova os fatos.

## 2. Brief

```text
Promessa (o que a pessoa leva):
Crença antes → depois:
Slide que dá vontade de salvar (qual e por quê):
CTA provisório:
Nº de slides (padrão 9; 7–10 funciona):
Animações e teto de créditos assumidos:
```

Gate: usuário aprova o brief (pode abrir o arquivo e editar antes).

## 3. Gancho: 5 capas

Cinco capas, cada uma com uma fórmula diferente, cada uma com o seu slide 2.
Recomende uma e diga por quê. O usuário escolhe ou escreve outra.

| Fórmula | Exemplo do canal |
|---|---|
| Número + resultado | "Cinco erros que fazem seu anúncio não vender" |
| Erro comum com número | "125 caracteres e seu anúncio some" |
| Contraintuitivo | "Mexer no anúncio todo dia faz ele piorar" |
| Pergunta | "Anúncio gasta e não vende? Cinco motivos" |
| Segredo/bastidor | "Os 35% do Reels que devem ficar vazios" |

Regras da capa: ≤8 palavras, número ou resultado específico, legível em thumbnail.
Slide 2 sempre entrega a promessa — nunca apresentação pessoal.

## 4. Roteiro em tabela

Uma linha por slide. Ajuste de texto acontece **aqui**, antes do HTML: depois de
formatado, mexer em palavra quebra o layout.

| Slide | Função | Título | Texto de apoio | Direção visual | Fonte |
|---|---|---|---|---|---|
| 1 | Capa | ... | ... | ... | ... |
| 2 | Prova da promessa | ... | ... | ... | ... |
| 3–8 | 1 ideia por slide | ... | ... | ... | ... |
| 9 | Slide salvável + CTA | ... | ... | ... | ... |

Gate: usuário lê o roteiro e pede trocas antes de qualquer geração visual.

## 5. Visual

1. **Style sheet**: mostrar os estilos do catálogo (numerados) em miniaturas; usuário escolhe o número.
2. **Capa**: modelo de imagem (OpenArt, Freepik/Ryngfield, fal.ai, Kie AI — o que já estiver conectado). É o slide mais caro e o que decide o clique.
3. **Miolo**: HTML/CSS/JS na assinatura do Claude Code; custo zero por slide.
4. **CTA**: opcional — pode ser imagem ou código.
5. **Painel de ajustes** na prévia: tamanho de título, tamanho de texto, cor, fonte. Exportar JSON do painel e aplicar no código.
6. Sem modelo de imagem conectado: tudo em código é possível, mas a capa perde qualidade — avise antes.

## 6. Revisão e exportação

- Rodar `references/checklist-revisao.md` e mostrar o checklist preenchido (não só dizer "ok").
- Exportar PNG por plataforma (IG 4:5 ou 1:1; TikTok/Reels 9:16; LinkedIn 1:1) — confirmar spec vigente.
- Legenda do post: primeira linha repete a capa nova; hashtags no fim.
- Material da DM (quando o CTA promete): PDF A4 de uma página no estilo do carrossel.
- Salvar em pasta por tema: `downloads/carrossel/<tema>-<plataforma>/`.
- Publicação fica com `social-publisher` (ou manual) — a skill entrega os arquivos prontos.

## Memória de temas

Manter um índice `carrossel/<tema>/` com tema, data, plataforma e capa usada.
Ao pedir um tema já existente, perguntar: "já existe carrossel sobre X em <data>;
gerar outro ou atualizar?". Evita repetir pauta sem saber.

## Erros que viram regra

O canal registra cada feedback como regra nova no catálogo (ex.: "capa sem número
na frase principal" virou regra). Ao fim de cada run, se o usuário corrigiu algo
que o guia não cobria, proponha a regra nova e grave em `references/catalogo-estilos.md`.
