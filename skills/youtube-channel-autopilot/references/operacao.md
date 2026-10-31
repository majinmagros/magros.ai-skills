# Operação — canal YouTube em autopilot

Fonte: `___J8OOGAh8` (@maestrosdaia). Números do case são medição do canal, não promessa.

## Contents

- [Case e premissa](#case-e-premissa)
- [Critérios de seleção do acervo](#critérios-de-seleção-do-acervo)
- [Seleção de trechos](#seleção-de-trechos)
- [Protocolo keyword-first](#protocolo-keyword-first)
- [Agenda e cadência](#agenda-e-cadência)
- [Produção](#produção)
- [Métricas](#métricas)
- [Modos de falha](#modos-de-falha)

## Case e premissa

- Canal adjacente `maestros.mp4`, inspirado no canal adjacente do Alex Hormozi
  (principal com 4,5M inscritos; adjacente ~30x menor e, segundo ele, com mais vendas).
- Resultado citado: ~45 mil views e 250+ horas em um período curto, 150+ inscritos novos;
  ~3.400 views nas últimas 48h; 14 reels agendados de um mesmo acervo.
- Hormozi: até 18 uploads em um dia; 10+ por dia é rotina, tocado por 1 pessoa com IA.
- A tese: o algoritmo premia consistência e cobertura de busca, não um viral isolado.

## Critérios de seleção do acervo

Entra no pipeline o vídeo longo que:

- tem 3+ trechos com tese própria (não é aula de tema único);
- tem áudio limpo e trechos de 3–8 min que se sustentam sem o contexto anterior;
- não é réplica de um vídeo já publicado no canal principal;
- tem termo de busca associado (ferramenta, erro, comparação, tutorial).

Fica fora: vídeo curto, live sem edição, tema que só faz sentido no minuto 40.

## Seleção de trechos

- 1 trecho = 1 tese = 1 keyword. Sem tese única, não corta.
- O trecho precisa ser específico, não um resumo do vídeo inteiro.
- Gravar o timestamp de entrada/saída na transcrição (EDL) para auditoria.
- Rejeitar trecho que depende de imagem/contexto que o corte perde.

## Protocolo keyword-first

1. Liste 10–20 termos que o público digitaria (ferramenta + tarefa + erro).
2. Cheque se o canal já tem vídeo para o termo (evitar canibalizar o principal).
3. Título: termo no começo, promessa específica, sem clickbait que o vídeo não paga.
4. Descrição: 2 linhas de contexto + capítulos + links + CTA padrão do canal.
5. Thumbnail: 3 variantes para teste (delegar a `youtube-packaging`).
6. CTA fixo no fim de todo vídeo (inscrever, playlist, material) — mesmo padrão, sem improviso.

## Agenda e cadência

```text
Dia 1: 09:00, 11:00, 13:30, 16:00, 18:30   (5 uploads, >=30 min)
Dia 2: mesma grade, variando tema
...
Rampa: 5/dia -> 10/dia -> 15/dia -> 20/dia
```

- Nunca dois uploads com menos de 30 min de intervalo.
- Preferir horários de busca do nicho, não "horário de influencer".
- Fila precisa de folga: se o acervo acabar, a cadência cai — não publique material ruim para cumprir tabela.
- 1 lote/semana renderizado + agendado é melhor que renderizar todo dia.

## Produção

- Transcrição local primeiro; API paga só se a qualidade local falhar.
- Render em fila (1 job por vez) para não estourar RAM.
- Avatar de IA só para conteúdo que não existe no acervo; não use avatar para "cortar" vídeo.
- Padronizar legenda, safe area e loudness uma vez; aplicar em todos os mids.

## Métricas

| Métrica | O que decide |
|---|---|
| CTR da thumbnail | título/thumb; trocar variante após 48h |
| Retenção média | corte muito longo ou tese fraca |
| Views por impressão | aderência do tema à busca |
| Inscritos por 1k views | força do CTA e da linha editorial |
| Views de origem externa | descoberta fora do canal (sinal do case) |

Matar tema com CTR baixo após 3 vídeos; dobrar no tema com retenção acima da média.

## Modos de falha

- **Rajada**: 10 uploads em 1h → canibalização e penalização de distribuição. Respeitar 30 min.
- **Réplica**: subir o vídeo longo fatiado sem transformação → política de conteúdo reutilizado.
- **Keyword errada**: título genérico ("dica de IA") não ranqueia nada.
- **Acervo raso**: 2 vídeos longos não sustentam 5/dia; a cadência quebra na segunda semana.
- **Automação sem gate**: primeiro lote sempre revisado por humano; só depois liberar o agendador.
