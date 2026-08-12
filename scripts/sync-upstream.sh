#!/usr/bin/env bash
# sync-upstream.sh
# Atualiza as skills herdadas do upstream ECC (affaan-m/ECC) no branch atual.
# NÃO toca nas skills autorais (doctor, engenharia-de-grafos, grills, score-loop):
# elas não existem no upstream, então o merge as deixa intactas.
#
# Uso:
#   ./scripts/sync-upstream.sh          # sync normal (fetch + merge)
#   ./scripts/sync-upstream.sh --dry-run  # mostra o que seria feito, sem aplicar
set -euo pipefail

UPSTREAM_URL="https://github.com/affaan-m/ECC.git"
UPSTREAM_BRANCH="main"   # ajuste se o upstream mudar de branch padrão

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
fi

log()  { printf '[sync-upstream] %s\n' "$*"; }
die()  { printf '[sync-upstream] ERRO: %s\n' "$*" >&2; exit 1; }

# 1) Garantir que o remoto upstream existe
if ! git remote get-url upstream >/dev/null 2>&1; then
  log "Adicionando remote upstream: $UPSTREAM_URL"
  if [[ $DRY_RUN -eq 0 ]]; then
    git remote add upstream "$UPSTREAM_URL"
  else
    log "[dry-run] git remote add upstream $UPSTREAM_URL"
  fi
fi

# 2) Garantir que não há mudanças não commitadas (sync sobre árvore limpa)
if [[ -n "$(git status --porcelain)" ]]; then
  die "Working tree sujo. Commit ou stash suas mudanças antes do sync."
fi

log "Fazendo fetch do upstream..."
if [[ $DRY_RUN -eq 0 ]]; then
  git fetch upstream
else
  log "[dry-run] git fetch upstream"
fi

# 3) Merge do upstream no branch atual
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
log "Merge de upstream/$UPSTREAM_BRANCH em $CURRENT_BRANCH"
if [[ $DRY_RUN -eq 0 ]]; then
  git merge "upstream/$UPSTREAM_BRANCH" \
    -m "chore: sync skills do upstream ECC (affaan-m/ECC)"
  log "Sync concluído."
else
  log "[dry-run] git merge upstream/$UPSTREAM_BRANCH -m 'chore: sync skills do upstream ECC'"
  log "Dry-run: nenhuma alteração aplicada."
fi

# 4) Aviso sobre conflitos
if git status --porcelain | grep -q '^UU'; then
  cat <<'EOF'
[sync-upstream] ATENÇÃO: há conflitos de merge para resolver.
  - Resolva manualmente (git add <arquivo> para marcar como resolvido).
  - Suas skills autorais (doctor, engenharia-de-grafos, grills, score-loop)
    NÃO estão no upstream, então não geram conflito.
EOF
fi
