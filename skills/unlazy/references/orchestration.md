# Orchestration (tree 4+)

Ver upstream: https://github.com/Leonxlnx/unlazy/blob/main/references/orchestration.md

- `PLAN.md` com tabela dispatch: Owns / Needs / Tier / Planned wave / State
- `gates/leaf-*.md` por leaf, `gates/branch-*.md` por branch
- `dispatch.json` = estado real de launch waves
- Waves: `open wave → launch agents → seal wave → wait → parent --reverify → release lease`

Rolling dispatch: libera wave seguinte assim que leaf anterior for parent-verificado e lease liberado.
