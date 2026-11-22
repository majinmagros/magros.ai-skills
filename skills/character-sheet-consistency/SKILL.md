---
name: character-sheet-consistency
description: "Use when a character must look the same across shots, segments or episodes — build a neutral character sheet (full body, profile, face close, object in hand, palette) and use it as the reference image. Triggers on \"ficha de personagem\", \"character sheet\", \"personagem consistente\", \"mesmo rosto\", \"consistência de personagem\", \"referência de personagem\"."
metadata:
  origin: ECC
---

# Character Sheet Consistency

Ficha neutra de personagem para o modelo não trocar rosto, roupa ou proporção entre segmentos. É o insumo mais barato para consistência — mais barato que regenerar clipe.

> Fonte: Willian IA `8DALo_Y2Z4I` (ficha usada como referência no H3) e `xbIDaBN8DmQ` (storyboard + personagem consistente).

## Quando usar

- Vídeo com o mesmo personagem em 2+ segmentos.
- Série/episódio com continuidade entre semanas.
- Quadrinho/mangá com personagem recorrente.
- Antes de gerar `ref2va` no H3, Seedance ou Kling.

## Quando NÃO usar

- Personagem aparece 1 vez, de costas ou desfocado.
- Estilo abstrato sem rosto.
- Você já tem turnaround oficial do personagem.

## Layout da ficha (6 painéis + paleta)

| # | Painel | Para quê |
|---|---|---|
| 1 | corpo inteiro, frente | proporção e roupa completa |
| 2 | corpo inteiro, 3/4 | volume e silhueta |
| 3 | corpo inteiro, perfil | nariz, queixo, postura |
| 4 | corpo inteiro, costas | cabelo e detalhe das costas |
| 5 | rosto close, neutro | traços que o modelo precisa repetir |
| 6 | mão segurando o objeto-chave | escala do objeto e jeito de segurar |
| — | paleta (5–7 swatches) | trava as cores |

O painel 6 é o que mais falta nas fichas caseiras: sem ele, o objeto muda de tamanho e de mão entre shots.

## Regras de geração

- **Luz plana e uniforme** (softbox frontal). Sem sombra dramática, sem contraluz.
- **Fundo neutro** cinza-claro ou branco. Nada de cenário.
- **Mesma escala** nos quatro painéis de corpo: personagem ocupa a mesma altura de quadro.
- **Mesma roupa** em todos os painéis. Troca de roupa é outra ficha.
- **Um personagem por ficha.** Dois personagens = duas fichas separadas.
- Corpo inteiro inclui **pés e mãos**; nada de corte no tornozelo.
- Rosto em close: expressão neutra, boca fechada, olhar para a câmera.
- Gerar em resolução alta o suficiente para o close (≥1024 px no rosto).

## Ficha de cenário (separada)

- Plano aberto do ambiente, mesma paleta, mesma luz.
- 1–2 detalhes de textura (ferrugem, azulejo, madeira).
- Serve de referência de **ambiente**, não de personagem.
- Nunca misture cenário e personagem na mesma imagem de referência: o modelo confunde o que é figurino e o que é fundo.

## Uso no vídeo

1. Gere a ficha e aprove.
2. No H3 local, anexe como `@image1` e cite `@image1` no prompt em **todos** os segmentos.
3. Use `ref2va` (referência → vídeo+áudio) em vez de `fl2va` para preservar o personagem.
4. `max` na resolução da referência quando a ficha for alta; `match` para economizar VRAM.
5. Repita os mesmos 2–4 traços no `subject_definitions` do prompt (nome, cabelo, cicatriz, roupa).

## Validação

Gere 3 testes baratos e compare com a ficha:

- [ ] Plano aberto (personagem pequeno) — rosto ainda reconhecível?
- [ ] Plano médio — roupa e cor batem?
- [ ] Close — cicatriz/marca/brinco no lugar certo?

Se falhar no plano aberto, o problema é a ficha (traço pequeno demais). Se falhar só no close, o problema é resolução da referência.

## Anti-padrões

- Ficha com luz cinematográfica (o modelo copia a sombra para a cena).
- Fundo colorido ou cenário na ficha.
- Painéis em escalas diferentes.
- Trocar roupa entre painéis "para mostrar variedade".
- Confiar só no texto do prompt sem imagem de referência.
- Ficha gerada com modelo diferente do que vai gerar o vídeo (drift de estilo).

## Skills relacionadas

- `h3-structured-video-prompt` — cita a ficha como `@image1`
- `blender-previs-animatic` — escala e câmera do shot
- `manga-generator` — ficha para HQ/página
- `pipeline-video-agente` — pipeline completo de vídeo
