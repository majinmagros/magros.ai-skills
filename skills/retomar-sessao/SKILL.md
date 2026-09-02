---
name: retomar-sessao
description: "Use when recupera o historico de uma sessao do opencode travada/perdida e exporta para um arquivo markdown de retomada. Triggers em \"perdi a sessao\", \"janela travou\", \"recupera historico\", \"retoma a tarefa\", \"meu contexto sumiu\", \"opencode.db\". Lê o SQLite de sessoes, lis... Triggers on \"retomar-sessao\", \"retomar sessao\", \"sessao\"."
---

# Retomar Sessao Perdida

O historico de TODAS as sessoes do opencode fica em SQLite em
`%USERPROFILE%\.local\share\opencode\opencode.db`. Quando uma janela trava
e o usuario perde o contexto, a conversa continua la e pode ser exportada.

## Fluxo

1. **Listar sessoes recentes** (achar a sessao travada pela data/titulo):
   ```powershell
   node "scripts\retomar-sessao.mjs" list
   ```

2. **Exportar a sessao** (substitua <id> pelo id `ses_...`):
   ```powershell
   node "scripts\retomar-sessao.mjs" <id>
   ```
   O arquivo sai em `%USERPROFILE%\projetos\retomadas\retomada_<data>_<titulo>.md`.

3. **Reler o contexto**: leia o arquivo exportado e use-o como base da
   proxima sessao (resumo do que foi feito + proximos passos).

## Observacoes

- O script abre o banco em modo somente-leitura (nao corrompe nada).
- O banco fica na maquina local — nenhum dado vai para a nuvem.
- Formato do export: `## [role] timestamp`, texto na integra,
  raciocinio em `<details>` e chamadas de ferramenta resumidas
  (25 primeiras linhas do output).
- Se o usuario nao sabe qual sessao era, use `list` e confirme pelo titulo/data.

## Fallback (se o banco estiver em uso/bloqueado)

O SQLite WAL permite leitura mesmo com o opencode aberto. Se der erro de
"database is locked", copie o arquivo antes de ler:
```powershell
Copy-Item "$env:USERPROFILE\.local\share\opencode\opencode.db" "$env:TEMP\oc-bak.db" -Force
```
e aponte o script para a copia (edite o caminho na linha `new Database(...)`).