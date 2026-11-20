# OpenArt via MCP — imagem e vídeo dentro do carrossel

Fonte: `W_jYe1xNdSs` (@maestrosdaia). O OpenArt gera imagem e vídeo por crédito;
conectar por MCP coloca a geração dentro da mesma sessão que escreve o roteiro.

## Por que conectar (e não copiar prompt entre abas)

- O assistente que escreve o roteiro escreve também o prompt de cada slide, então a
  imagem sai coerente com o texto.
- Pelo MCP ele lista modelos, envia imagens de referência, organiza projetos e
  consulta o saldo de créditos.
- Mesma lógica em Claude, Codex e Cursor — o MCP é do cliente, não da plataforma.
- Sem MCP, tudo isso continua possível direto no site; o ganho é contexto, não acesso.

## Setup

1. Criar conta no OpenArt e conectar o MCP no cliente escolhido.
2. Confirmar que o agente consegue: listar modelos, ver saldo, gerar imagem e vídeo.
3. Fixar o teto de créditos da run antes da primeira geração.
4. Guardar a pasta de referências (personagens, robôs, paletas) na biblioteca da conta.

## Fluxo dentro do carrossel

1. Fatos e roteiro aprovados. **Nada de imagem antes disso** — refazer capa custa crédito
   e estraga o layout.
2. Escolher o estilo pelo número do catálogo.
3. Pedir a estimativa: "quantos créditos isso vai gastar e quanto sobra na conta?".
   Aprovar o número antes de gerar.
4. Capa em modelo de imagem; miolo em HTML/JS custa 0 crédito.
5. Se o orçamento apertar, reduzir slides com imagem (não reduzir a qualidade da capa).
6. Reaproveitar asset da biblioteca (mesmo robô, mesmo personagem) em vez de gerar de novo.

## Director Mode (vídeo)

- Recebe fotos de referência (fachada, produto, pessoa) e gera personagens coerentes
  entre cenas — utilíssimo quando o carrossel vira anúncio em vídeo.
- Timeline dentro da plataforma: cortar trecho, regerar uma cena, trocar só a
  introdução mantendo desenvolvimento e CTA de outra peça.
- Edição por comando de voz, por texto ou arrastando a barra; mantém o áudio sincronizado.
- Sincroniza música com a ação — é o que faz parecer dirigido, não montado.

## Ordem de grandeza de custo (out/2026, conta do canal)

| Peça | Créditos |
|---|---|
| Carrossel de 10 slides (capa + miolo com imagem) | ~760 |
| Anúncio em vídeo de 36 s no Director Mode | ~4.500 |

Números de referência para orçar, não tabela de preço: confirme o custo atual na conta.

## Regras

- Estimar crédito antes de gerar; nunca gerar "para ver como fica".
- Descrever cena, personagem, cor e enquadramento — cor de marca explícita
  ("robô vermelho, cor do Google") evita retrabalho.
- Fact-check antes da capa: dado errado descoberto depois queima crédito e o layout aprovado.
- Capa animada é o padrão quando há orçamento; o miolo pode ficar 100% em código.
- Crédito é a moeda: tratar como custo de produção do post, não como brinde.
