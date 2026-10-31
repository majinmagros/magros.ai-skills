# Ações compartilhadas entre UI e agente (app nativo de agente)

Fonte: `jouKaJ4qlAg` (@aicodeking), walkthrough do Agent Native — framework
TypeScript open source da Builder.io para agentes com interface interativa
(React, modelo próprio, código no seu repo). Os apps de exemplo estão em alpha;
trate o framework como referência de arquitetura, não como promessa de qualidade.

## O problema que o padrão resolve

O usuário pede uma apresentação, o agente entrega um rascunho, ele ajusta um
título e arrasta um slide. Se o agente guarda a própria cópia do documento, o
próximo pedido **parte de uma versão morta** e desfaz o ajuste humano. O sintoma
clássico: "o agente trouxe o título antigo de volta".

## A camada de ações

Uma ação é uma operação nomeada com três partes:

- `description` — o que a operação faz (é o que o agente lê para escolher).
- `schema` — entradas tipadas (ex.: `deckId`, `slideId`, substituição ou conteúdo novo).
- `run` — o código que executa, com validação e permissão dentro dele.

A mesma ação é chamada por dois clientes: a interface (hooks de leitura e de
mutação) e o agente (HTTP ou MCP). Regra de negócio fica em **um** lugar: se
"título vazio é inválido", os dois caminhos recusam sem duplicar código.

Detalhe de implementação que vale copiar: no editor de slides, o editor do
navegador manda operações granulares via `patch deck`, enquanto o agente tem
ações dedicadas (`update slide`). As duas passam pelo **mesmo mecanismo de lock
e o mesmo dado**. Ao inspecionar um projeto assim, olhe como as operações se
conectam — não presuma que são caminhos separados.

## Contexto: o que está aberto e o que está selecionado

A interface informa a visão atual e a seleção; uma ação de "ver tela" busca os
registros correspondentes. Sem isso o agente adivinha entre documentos de nome
parecido.

- Comece com poucos IDs úteis + a seleção atual.
- Garanta que o agente consegue recuperar o conteúdo correspondente.
- Contexto de aplicação (view/seleção) e dados persistidos no banco são coisas
  diferentes e as duas importam.

## Teste de contexto (barato e decisivo)

1. Abra o rascunho A, faça uma edição manual, peça "resuma a versão atual".
2. Troque para o rascunho B e repita.
3. A resposta tem que seguir **o objeto aberto**, não o histórico do chat.

## Teste de alternância (o que separa demo de produto)

Alterne humano e agente na mesma tarefa:

- O agente preserva a edição humana?
- A interface mostra o último resultado?
- Dá para voltar atrás quando a revisão piora o texto?

## Quando isso não se paga

Se o caso de uso é pergunta e resposta curta, um chat simples já resolve. O
padrão ganha quando a pessoa precisa navegar, selecionar, editar e revisar em
várias rodadas — apresentação, documento, calendário de conteúdo.

## Notas do framework (para não confundir com o padrão)

- Requer Node 22.22+ e pnpm; o starter roda por `npx` e abre um onboarding local.
- Conectar modelo e fazer login são passos separados: confira o provedor e o
  modelo padrão antes de culpar a geração.
- Exporta HTML, PDF, PPTX e Google Slides — **confira o arquivo exportado**,
  porque fonte e layout mudam entre editores.
- O framework é gratuito; modelo e infraestrutura continuam custando. Comece com
  um deck pequeno e sem imagem para entender o fluxo de edição antes de gastar.
- Como o código é seu, o mesmo agente de código (Claude Code, Codex) customiza o
  app: peça para inspecionar a estrutura existente e seguir os padrões do projeto.
