# Troubleshooting and Advanced Signals

## Troubleshooting

- **Pane not responding:** Switch to the pane directly or inspect it with `tmux capture-pane -pt <session>:0.<pane-index>`.
- **Merge conflicts:** Use git worktrees to isolate file changes per pane.
- **High token usage:** Reduce number of parallel panes. Each pane is a full agent session.
- **tmux not found:** Install with `brew install tmux` (macOS) or `apt install tmux` (Linux).

## cmux vs tmux (WAFUMBLOjHo)

- **cmux** (IndyDevDan): wrapper que dá **agentic access programático** a cada agente (poll status, send input, collect output sem estar no loop). **tmux** puro exige `capture-pane` manual. Se precisar orquestrar 3-tier (orchestrator→leads→experts) e evitar `token maxing`, prefira cmux/Herder + Pi SDK. Regra: `inside the loop = bottleneck` → use cmux para agentes se auto-coordenarem.

## Completion Signals Between Panes (wCSPgHpcxdc)

Fonte `wCSPgHpcxdc` (AIJasonZ, padrão "open agent teams"):

Sem cmux, o problema do tmux é o worker **avisar** o lead que terminou. Solução
com signals nativos:

```bash
# Worker: ao terminar, emite o sinal combinado
tmux send-keys -t work.1 "ao terminar rode: tmux wait-for -s done-worker1" Enter

# Lead: bloqueia até receber o sinal (não faz polling)
tmux wait-for done-worker1 && echo "worker 1 terminou"

# Ler o resultado sem entrar no pane
tmux capture-pane -p -t work.1 | tail -40
```

Padrão completo: instrua o agente worker (no próprio prompt) a emitir o sinal
como ÚLTIMO passo; o lead roda `wait-for` em background (`&`) para vários
workers e coleta com `capture-pane`. Encapsulado na skill "open agent teams"
do AIJasonZ (start/peek/wait/result por sessão nomeada).
