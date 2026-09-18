---
name: repurpose-shorts-dm-funnel
description: Transforma video longo em shorts com funil de DM por palavra-chave, CTA em voz e publicacao multi-conta. Use para reaproveitar live/curso, gerar leads por comentario, escalar o mesmo corte em varias contas. Triggers PT: transformar live em shorts, funil comentario DM, palavra-chave DM, reaproveitar conteudo. Triggers EN: long to shorts funnel, keyword DM funnel, repurpose long-form, shorts lead funnel.
---

# Repurpose Shorts DM Funnel

## Quando usar

- Existe video longo (live, aula, podcast) e a meta é captacao via shorts + DM.
- A entrega esperada é: corte + palavra-chave + CTA + agenda multi-conta + automacao de DM.
- Há revisor disponivel para gate independente antes de publicar.

## Quando NAO usar

- Não edita video do zero, não transcreve para SEO, não configura automacao de DM do zero.
- Para essas camadas, orquestrar: `video-cut-pipeline`, `autopilot-content-factory`, `dm-keyword-automation`.
- Sem direito de uso do video original, não operar.

## Pipeline

1. **Selecionar momento-corte:** extrair 1 ideia por corte (gancho 0-3s + payoff). Rejeitar corte sem tese unica.
2. **Definir palavra-chave unica por corte:** 1 corte = 1 keyword curta, facil de digitar. Checar log anti-repeticao (`keyword | video-origem | data | conta`); se repetida em 90 dias, gerar variante.
3. **Roteirizar CTA de voz via TTS:** script de até 8s: `comente <KEYWORD> que eu te mando <entregavel>`. Voz e ritmo padrao da conta; sem promessa falsa.
4. **Montar pacote do corte:** video + legenda + keyword + entregavel de DM + thumbnail/titulo se Youtube Shorts.
5. **Gate de revisor independente (obrigatorio):** segundo olhar checa: claim exagerado, keyword errada, CTA inaudivel, legenda errada, problema de marca. Reprovado volta para edicao, não publica.
6. **Agendar/publicar multi-conta:** o mesmo corte pode rodar em N contas com janela de intervalo e legenda adaptada por conta. Registrar `corte | conta | data-hora | keyword`.
7. **Ligar automacao de DM:** delegar a `dm-keyword-automation`: keyword dispara entrega + qualificacao minima. Testar com conta fria antes de escalar.
8. **Medir por corte:** views, comentarios-keyword, DMs entregues, opt-ins, custo/tempo por corte. Matar keyword com CTR de comentario baixo apos 3 cortes.

## Regras

- 1 keyword por corte, sem excecao. Keyword generica (`info`, `quero`) é proibida.
- Log anti-repeticao é fonte de verdade — antes de criar keyword, consultar.
- TTS do CTA deve soar como o host; se ficar robotico, regravar ou trocar voz.
- Multi-conta não é spam sincronizado: espaçar publicacoes e variar legenda/hashtags.
- Nenhum corte publica sem carimbo do revisor.

## Output

- Lote de cortes com keyword unica, CTA em voz, calendario multi-conta e DM ligada.
- Done = corte aprovado, publicado, keyword rastreada no log e metrica coletada.

## Related skills

- `video-cut-pipeline` — corte e edição antes do funil.
- `autopilot-content-factory` — factory de conteúdo gerado.
- `dm-keyword-automation` — automação de DM por keyword.
- `youtube-packaging` — embalagem para Youtube Shorts.
