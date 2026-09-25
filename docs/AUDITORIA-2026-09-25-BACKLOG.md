# Backlog — Auditoria externa 25/09 (verificada localmente)

Origem: relatório externo "Auditoria do magros.ai-skills (25/09)", conferido arquivo a
arquivo neste repo em 25/09/2026. Onde o auditor deduziu sem acesso, marquei
`[auditor: dedução]` e o resultado da verificação local.

Convenções: `- [ ]` aberto · `- [x]` feito · cada item tem aceite verificável.

## Correções do próprio relatório (não viram tarefa)

1. `atualizar_sistema.bat` **não faz `git pull` nem `curl`** — só recopia o
   checkout local para `~/.config/opencode/skills` (`scripts/sync_global_opencode.ps1`).
   O risco do atalho de Startup é real, mas menor que "RCE por push".
2. `flutter-dart-code-review` e `quality-nonconformance` **têm** frontmatter hoje;
   o "sem cabeçalho" era BOM quebrando parser estrito (ver item P0-1).
3. Números de origem por word-count não reproduzem; contagem atual por frontmatter:
   `ECC 313 + ecc 3 + direct-port 8`, `community 36`, `AUTORAL 21`, **110 sem `origin`**.

## P0 — Segurança

- [x] **P0-1. Remover BOMs** — `skills/universal-portability/SKILL.md`,
  `docs/PORTABILITY.md`, `docs/maestros/OPORTUNIDADES.md`. Aceite: nenhum `.md`
  começa com `EF BB BF`. (Feito nesta sessão.)
- [x] **P0-2. Deletar `download-karine.js`** (lixo de 1 linha, sem refs).
  Aceite: arquivo ausente, `git status` limpo após commit. (Feito nesta sessão.)
- [x] **P0-3. Remover bloco Astraflow do `.env.example`** (chaves vazias +
  endpoints `umodelverse.ai` / `modelverse.cn`). Aceite: sem `ASTRAFLOW` no
  `.env.example`. (Feito nesta sessão. NOTA: o provider continua em
  `src/llm/providers/astraflow.py` — ver P0-9.)
- [x] **P0-4. `SECURITY.md` reapontado ao fork** — report para
  `majinmagros/magros.ai-skills/security/advisories/new` e
  `majinmagros@gmail.com`; scope/surfaces do fork com nota de upstream;
  `main` → `master`. Aceite: nenhum relato direcionado a `affaan@ecc.tools`.
  (Feito nesta sessão.)
- [x] **P0-5. Startup notify-only** — `scripts/atualizar_sistema.bat` agora chama
  `scripts/verificar_sync_opencode.ps1` (novo, somente leitura, exit 0 sempre);
  sem `-ExecutionPolicy Bypass`, sem `pause`. `criar_atalho_startup.ps1` cria
  `VerificarMagrosAISkills.lnk` e remove o `.lnk` antigo. Aceite: script de check
  executado localmente com exit 0, sem cópia. (Feito 25/09.)
- [x] **P0-6. `curl | bash` com gate de confirmação** —
  `skills/context-ledger/SKILL.md`, `skills/zed-deltadb-versioning/SKILL.md`,
  `skills/blender-mcp-ops/SKILL.md` ganharam gate (confirmação explícita +
  baixar/ler/fixar versão antes de executar). Sem SHA inventado: pin exato fica
  para revisão com rede de cada upstream. (Feito 25/09.)
- [x] **P0-7. `allowed-tools` restritas** — `inherit-legacy-style`: `Bash` →
  `Bash(git:*)` + nota de least-privilege (escritas só em `.ai-style-rules.md` /
  `CLAUDE.md`); `videodb`: guardrails no corpo (só `python`, sem `pip install`,
  confirmação p/ background). `Bash(python:*)` mantido porque os references
  executam SDK arbitrário — escopo maior quebraria a skill. (Feito 25/09.)
- [x] **P0-8. Pins reais** — Actions por SHA (checkout `11d5960a…`, setup-node
  `49933ea5…`, gitleaks `ff98106e…`, configure-pages `983d7736…`,
  upload-artifact `56afc609…`, deploy-pages `d6db9016…`, SHAs resolvidos via
  `git ls-remote` em 25/09, comentários `# vX` mantidos); `.mcp.json`:
  `chrome-devtools-mcp@1.10.1` (versão via `npm view`). (Feito 25/09.)
- [x] **P0-9. Provider Astraflow REMOVIDO (25/09, decisão do dono: remover tudo)** —
  deletados `src/llm/providers/astraflow.py` e `tests/test_astraflow_provider.py`;
  limpos `providers/__init__.py`, `resolver.py`, `core/types.py`, `test_types.py`,
  `test_resolver.py`. Restam só menções históricas em docs (roadmap/evidências,
  não reescritas). Aceite: `pytest -q` 84 passed, zero refs em código.
- [x] **P0-10. `master` protegida (25/09, via API)** — checks `validate` estritos,
  `enforce_admins`, force-push e delete bloqueados; sem review obrigatório (fluxo
  solo preservado). Falta: **assinar commits** — sem GPG nesta máquina; caminho:
  commit signing via SSH (`git config gpg.format ssh` + chave do GitHub) ou
  instalar GnuPG. Aceite: `git log --show-signature` com assinaturas nos commits novos.
- [x] **P0-11. `gitleaks` no histórico completo (25/09)** — gitleaks v8.30.1,
  com `.gitleaks.toml` do repo: **0 leaks**. Aceite cumprido, nada a rotacionar.

## P1 — Governança

- [ ] **P1-1. Identidade do fork** — `package.json` (`repository` ainda aponta
  `affaan-m/ECC`), `.claude-plugin/plugin.json`, `marketplace.json`,
  `LICENSE` (só Affaan) + `NOTICE` de terceiros (ex. 12-factor CC BY-SA).
  Renomear slug `ecc` → próprio.
- [ ] **P1-2. `metadata.origin` padronizado** — `autoral|ecc|ecc-modificada` +
  SHA do original; hoje `ECC`/`ecc`/`AUTORAL` misturados e 110 skills sem origin.
- [ ] **P1-3. Frontmatter dentro da spec** — mover `version` (26), `homepage` (8),
  `license` (17) do topo para `metadata:`; manter `allowed-tools`/`argument-hint`
  (convenção de harness, não violação).
- [ ] **P1-4. Releases semver + tags** — `VERSION` = 2.2.0 sem tag; `git tag`
  vazio. Aceite: tag `v2.2.0` + releases por versão.
- [ ] **P1-5. Separar núcleo reutilizável de conteúdo pessoal** (música, finanças,
  pipeline YouTube) + zerar fila de 14 PRs do Dependabot.
- [ ] **P1-6. Reduzir peso do clone** — `.git` ~300 MB + `node_modules` ~120 MB
  vs `skills/` ~8 MB; documentar shallow clone / `.npmignore`.

## P2 — Corp-safe

- [ ] **P2-1. Perfil `corp-safe`** — base `minimal` (sem hooks, sem MCP remoto,
  sem instalador de rede) + allowlist fechada (`anti-hallucination`,
  `triagem-bug`, `clareza`, `checklist-requisitos` após remoção de contexto interno).
- [ ] **P2-2. Deny-list corporativa no CI** — estender
  `scripts/ci/validate-no-personal-paths.js` (já barra caminhos absolutos de usuário
  Windows/macOS e pastas pessoais de projetos) com termos `itau`, `orka`, repos internos, ARNs, hostnames.
  Aceite: push com termo barrado antes do site publicar.
- [ ] **P2-3. Revisar `scripts/codex/install-global-git-hooks.sh`** — afeta todos
  os repos da máquina, inclusive corporativos; documentar ou remover.
