---
name: doctor
description: Remove "peso morto" de projetos, agentes e skills — instruções verbosas que modelos modernos não precisam mais, contexto duplicado, skills/plugins não usados e arquivos órfãos que inflam a janela de contexto e o custo por execução. Use quando a sessão engole tokens rápido, o contexto alcança o limite cedo demais, o CLAUDE.md está sobrecarregado, ou você nunca revisou/atualizou suas skills e agentes há meses.
---

# Doctor — Auditoria e Enxugamento de Contexto e Instruções

Inspirado no comando `/doctor` (e no removido `/harness-clean`, que foi fundido nele). A própria Anthropic descobriu que ~80% do system prompt do Claude Code era peso morto: instruções de proteção que modelos capazes de hoje já intuem sozinhos. Se o maior produto de IA do mundo tinha 80% de instruções obsoletas, os seus projetos/agentes/skills que você não revisa há meses provavelmente também têm — custando tokens e performance.

**Princípio central:** modelos mais novos precisam de cada vez menos instruções. O que era instrução essencial há 3–4 modelos virou ruído. Não apague por apagar: teste se os modelos atuais ainda precisam daquela instrução.

## Quando usar

- O contexto da sessão alcança o limite rápido demais ou os tokens são "engolidos" sem retorno.
- Você instalou muitos plugins/skills/agentes e nunca revisou o que é usado.
- O `CLAUDE.md` (ou agentes) sobrecarregado com instruções que equivalem a múltiplas skills.
- Carregamento de contexto desnecessário a cada requisição (conteúdo enviado mesmo quando a tarefa não precisa dele).
- Auditoria periódica (recomendado: a cada 2–6 meses, ou sempre que novos modelos forem lançados e ganharem intuição melhor).

Não use para: limpar código-fonte de produção (isso é refatoração), nem para reescrever comportamento das skills — o foco é **excesso de instruções/contexto**, não qualidade de escrita.

## Filosofia de design

1. **Quantifique antes de cortar.** Instruções muito longas custam. Meça tokens/caracteres do que é carregado a cada requisição.
2. **Contexto sob demanda.** Carregue um arquivo/pasta/skill **somente quando** a tarefa atual usa aquela informação. Nada é carregado sempre "por garantia".
3. **Deduplique.** Conteúdo igual replicado entre arquivos é desperdício puro.
4. **Humano no loop.** Cada edição é proposta e você aprova/reprova. Nada é deletado em massa sem o seu aval.
5. **Rollback garantido.** Tudo que for aplicado pode ser desfeito — via git/desfazer na própria sessão ou rodando na cópia duplicada.
6. **Sempre reversível.** Se houver risco, duplique o repositório e rode o doctor na cópia, comparando os dois resultados.

## Workflow

O doctor segue fases, do mínimo ao máximo invasivo — o padrão é **não alterar nada sem você pedir**:

### 1. Leitura (read-only)

Corra pelos projetos, agentes e skills entendendo o que existe. Primeiro entenda, não modifique nada.

### 2. Diagnóstico + Proposta

Identifique problemas **e** proponha um plano de ação para resolvê-los — como um médico que diagnostica *e* dá a receita. Problemas típicos:

| Problema | Sinal | Exemplo do vídeo |
|----------|-------|------------------|
| Instruções muito longas | Pipeline carregando ~43.000 chars / ~11.000 tokens a cada requisição | → 11.000 tokens de manual |
| Contexto enviado em toda requisição | Conteúdo carregado mesmo quando a tarefa não o usa | → milhões de tokens desperdiçados por execução |
| Skills/plugins não usados | Skills/plugins sem uso há um bom tempo (pelo histórico) | → desligar o que não roda |
| Conteúdo duplicado | Mesma informação repetida em arquivos diferentes | → remover duplicatas |
| Carregamento não-segmentado | Tudo numa pasta carregada sempre, em vez de só quando necessário | → segmentar contexto por ação |
| Hook desatualizado | Hook configurado aponta para lógica velha | → corrigir |
| CLAUDE.md sobrecarregado | Skills/instruções gigantes embutidas no CLAUDE.md | → extrair para skills, reduzir o arqivo |

### 3. Relatório + Aprovação

Apresente o diagnóstico e as propostas de edição. Dê opções: aprovar tudo, aprovar uma por uma, reprovar todas, ou misturas. O usuário mantém o controle total.

### 4. Aplicação

Aplique somente o que foi aprovado. As modificações dependem do contexto e do que foi autorizado.

### 5. Salvar + Rollback

Opcionalmente salve a nova versão no histórico. Voltar à anterior é sempre possível — rodar o comando de desfazer na própria sessão que gerou as mudanças, ou restaurar do git.

## Mensuração (use números, não impressões)

Quantifique a economia para justificar e acompanhar:

- **Tokens de entrada por requisição** antes vs depois.
- **Tokens totais por mês** = economizados por requisição × requisições/dia × dias.
- **Custo mensal desperdiçado** = custo extra por execução × execuções/dia × 30 dias. Exemplo do vídeo: ~US$ 1/execução extra, 6×/dia, 30 dias → ~US$ 10/mês por pipeline; × 3 contas × 10×/dia → ~US$ 900/mês (quase R$ 5.000/mês) de lixo evitável.
- **Performance**: janela de contexto mais enxuta → menos compressão, menos "viagens" do modelo, melhor precisão.

## Recomendações

- **Periodicidade não é só calendário.** Reavalie quando **novos modelos** são lançados (pode haver 3 numa semana). Novas gerações ganham intuição melhor — você pode remover instruções que antes pareciam indispensáveis.
- **Teste em um projeto secundário primeiro.** Não comece pelo agente mais importante da sua vida. Rode num secundário que não faz falta e, se funcionar, aplique nos demais.
- **Escale com confiança**: conforme você confia no processo, pode escolher "limpar tudo" — junto com a evolução dos modelos, é um caminho para cada vez menos instruções mantendo (ou melhorando) performance.
- **Entender o que está rodando importa.** Quem constrói via linguagem natural sem entender a arquitetura atinge um teto; quem usa os próprios projetos/skills para aprender o que fazem avança muito mais.

## Comandos de apoio

- Estimar tamanho de contexto de arquivos/pastas (tokens ≈ palavras × 1,3; chars / 4 para código):
  ```bash
  # total de chars de um conjunto relevante
  $files = Get-ChildItem -Recurse -Include *.md | Get-Content -Raw
  ($files | Measure-Object -Character).Characters
  ```
- Duplicar um repositório antes de arriscar:
  ```bash
  git clone <origem> ./copia-doctor   # depois rode o doctor na cópia e compare
  ```

## Skills relacionadas

- `context-budget` — **mede** a janela de contexto e prioriza economias de tokens. O doctor **age** removendo peso morto; rode o budget antes para saber onde o doctor deve focar.
- `config-gc` — GC da configuração do Claude Code (`~/.claude`). Complementa o doctor, que atua nos projetos/agentes/skills.
- `automation-audit-ops` — inventário de jobs/hooks/connectores vivas/quebradas/redundantes. O doctor também corrige hooks desatualizados no projeto.
- `production-audit` — prontidão de produção. Diferente: foca em "quebra em prod", não em custo de contexto.

## Anti-padrões

- **Sobrecarregar o CLAUDE.md.** Uma instrução que equivale a múltiplas skills dentro do CLAUDE.md é o erro mais básico — extraia para skills e deixe o arquivo magro.
- **Cortar por cortar.** Remover instrução que modelos de hoje ainda precisam piora performance. Teste antes de apagar.
- **Aprovação em massa sem revisão.** "Apagar tudo de uma vez" só depois que você já confia no processo em vários projetos.
- **Tratar "antigo" como "morto".** Uma skill não usada há 60 dias pode ser sazonal. Idade é sinal, não veredito — por isso há humano no loop.
- **Deixar peso morto correr em escala.** US$ 1 extra/execução é nada numa conta — mas vira US$ 900/mês com dezenas de contas em piloto automático.