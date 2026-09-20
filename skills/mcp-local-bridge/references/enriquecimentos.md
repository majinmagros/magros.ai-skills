# MCP Local Bridge — Enriquecimentos (YouTube 2026-09-20)

## Caso real: PenDev MCP no Windows + WSL — YouTube 2026-09-20

- Fonte `huaTd5sAwKU` (FullCycle, "Testei PenDev com Claude Code"): MCP STDIO do PenDev copiado do app falha dentro do WSL — o server roda no Windows e o path não resolve no Linux; fix: duplicar a linha de path apontando via `/mnt/c/...` (executável Windows chamado de dentro do WSL); em Linux nativo/Mac a config copiada funciona direto.
- Regra: falha de conexão MCP em setup Windows+WSL → inspecionar path do server primeiro (rewire `/mnt/c`), antes de mexer em transporte ou permissões; pedir ao próprio agente para aplicar o remap.
