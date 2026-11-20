# Quando dobrar sub-agentes no loop principal

Fonte: artigo da Anthropic "When to fold sub-agents into your main agent loop"
(Diane Sarkis, 22/10/2026), resumido em `fdtkh30oFA8` (@aicodeking). O artigo
argumenta que a maioria dos times **copiou o organograma para dentro do agente**:
um sub-agente por área, um orquestrador roteando. Isso é a lei de Conway
aplicada a software — o sistema fica com a forma do time que o construiu. Fica
bonito no diagrama e costuma piorar qualidade, custo e latência.

O padrão que ele propõe é o inverso: **um loop principal que carrega skill e
ferramenta só quando a tarefa precisa** (progressive disclosure). A Anthropic
cortou mais de 80% do system prompt do Claude Code nos modelos mais avançados em
parte por divulgar skill/tool sob demanda em vez de carregar tudo no início.

## Teste de decisão: fica no loop principal quando…

| Sinal | Por quê |
|---|---|
| Cada passo depende do anterior | handoff perde o encadeamento |
| Os passos compartilham os mesmos dados | vira cópia desatualizada em cada agente |
| Você quase sempre chama os dois juntos | dividir só cria handoff no meio |

## Onde cada coisa mora (dentro do loop único)

- **Julgamento de domínio** (como um especialista trata o caso) → `skill`.
- **Ação, dado ao vivo ou limite rígido** → `tool`.
- **Fato que só às vezes importa** → `knowledge base`, consultado quando precisa.

Esse único corte resolve a maior parte dos setups bagunçados.

## Limite de ferramentas

A escolha de ferramenta degrada depois de ~30–50 definições no prompt. Dobrar
não é empilhar: um loop, poucas ferramentas bem nomeadas por intenção do
usuário, o resto divulgado sob demanda.

## Quando o sub-agente se paga (só com uma destas três)

1. Você **mede** que o contexto dele piora o agente principal.
2. O trabalho roda em paralelo, em contexto novo que pode ser descartado.
3. O agente único trava em escolha de ferramenta ou em instruções conflitantes.

Regra por trás das três: **divida por contexto, não por tipo de problema**. Dê ao
sub-agente trabalho que precisa de pouco do resto do sistema e que devolve um
resultado compacto — pesquisa independente, checagem de caixa-preta em trabalho
pronto, verificação de quem não construiu.

## Modos de falha a nomear (todos vistos na prática)

- **Brawl de sub-agentes**: cada time publica o seu, sobreposto, e ninguém é dono do conjunto.
- **FrankenPrompt**: cada time acrescenta uma frase ao system prompt até as regras brigarem.
- **Telefone sem fio**: cada handoff perde detalhe; o último agente trabalha de uma cópia desbotada.
- **Latência**: cada sub-agente é uma execução completa. Num caso de cliente citado no artigo, o loop único rodou ~2x mais rápido que o multi-agente que substituiu. É um caso — vale como direção, não como benchmark.

## Migração sem quebrar o que funciona

1. Dobre **um** sub-agente por vez: o par mais usado ou mais acoplado.
2. O prompt dele vira `skill`; as chamadas de API viram `tool`.
3. Meça antes de tocar no próximo. Dez exemplos dourados já bastam para começar:
   tarefas reais em que você sabe qual é o bom resultado.
4. Rode cada eval **mais de uma vez**. O artigo descreve uma cadeia de suporte em
   que a dobra quebrou o fluxo e a quebra apareceu em 1 de 2 execuções. Passar
   uma vez é moeda lançada ao ar.
5. Também dá para dobrar os roteadores, planejadores e classificadores estreitos
   construídos no ano anterior: o modelo principal já faz boa parte desse
   roteamento no raciocínio normal. O exemplo do artigo troca classificador +
   pipeline + ramos + orquestrador por **um prompt claro, 4–5 ferramentas finas
   e guardrails firmes**.

Uma linha: **meça, mude uma coisa por vez, mantenha o que se sustenta.** Não
reestruture por intuição em nenhuma das duas direções.

## Nota de escopo

A segunda metade do vídeo demonstra o modo "team" do Panda Code (arquiteto +
workers com escopo de arquivo, dependências e follow-up que preserva o contexto
do worker). É a implementação do autor, não o que o artigo diz — ele mesmo
separa as duas coisas. Serve como exemplo de que dobrar e desdobrar deve ser uma
decisão no início da tarefa, não uma reescrita.
