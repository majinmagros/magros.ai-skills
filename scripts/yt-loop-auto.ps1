#Requires -Version 5.1
<#
.SYNOPSIS
  Roda uma volta autonoma do loop de coleta de oportunidades do YouTube.
  sync-check -> catalog -> diff -> download(matches) -> state/yt-pending.json
.DESCRIPTION
  Portatil: nenhum caminho pessoal hardcoded. A raiz do repo sai do proprio
  path do script ($PSScriptRoot/..). Pastas de transcricoes vem de
  manifests/canais-vigilados.local.json (gitignored, por maquina).
  Logs vao para <parent-das-pastas>/logs (ex.: C:\Transcricoes\logs) ou $env:TEMP.
  Transcriacoes de terceiros NUNCA entram no repo.
.PARAMETER Since
  Data AAA-MM-DD para o diff (padrao: 3 dias atras).
.PARAMETER MaxDownloads
  Teto de videos baixados por volta (padrao 15). 0 = dry-run (só diff).
.PARAMETER SkipCatalog
  Pula o catalog-all (usa CATALOGO.json existente).
.EXAMPLE
  powershell -NoProfile -ExecutionPolicy Bypass -File scripts/yt-loop-auto.ps1
  powershell -NoProfile -File scripts/yt-loop-auto.ps1 -Since 2026-09-18 -MaxDownloads 0 -SkipCatalog
#>
param(
  [string]$Since = '',
  [int]$MaxDownloads = 15,
  [switch]$SkipCatalog
)

$ErrorActionPreference = 'Stop'
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $RepoRoot

function RepoLog($m) { Write-Host "[yt-loop] $m" }

# 0. Sync-check (trava multi-PC; --allow-stale libera com aviso)
RepoLog 'sync-check...'
$sync = & node scripts/yt-oportunidades.mjs sync-check --allow-stale 2>&1 | Out-String
Write-Host $sync
if ($sync -match 'ATRÁS do GitHub') {
  RepoLog 'BLOQUEADO: repo atras. Rode git pull --rebase e re-execute. Abortando.'
  exit 1
}

if (-not $Since) { $Since = (Get-Date).AddDays(-3).ToString('yyyy-MM-dd') }

# 1. Catalog
if (-not $SkipCatalog) {
  RepoLog 'catalog-all...'
  & node scripts/yt-oportunidades.mjs catalog-all
  if ($LASTEXITCODE -ne 0) { RepoLog 'catalog-all falhou. Abortando.'; exit 1 }
} else { RepoLog 'catalog pulado (SkipCatalog).' }

# 2. Diff
RepoLog "diff-all --since $Since ..."
$diffRaw = & node scripts/yt-oportunidades.mjs diff-all --since $Since 2>$null | Out-String
$diff = $diffRaw | ConvertFrom-Json

# Skiplist persistente: falhas deterministicas nao sao retentadas (members-only).
$skipsFile = Join-Path $RepoRoot 'state\yt-skips.json'
$skips = @{}
if (Test-Path -LiteralPath $skipsFile) {
  (Get-Content -LiteralPath $skipsFile -Raw | ConvertFrom-Json).PSObject.Properties |
    ForEach-Object { $skips[$_.Name] = $_.Value }
}
$cands = @()
foreach ($c in $diff) {
  foreach ($v in $c.sem_transcricao) {
    if ($v.matches_filtro -and -not $skips.ContainsKey($v.id)) {
      $cands += [pscustomobject]@{ canal = $c.canal; id = $v.id; title = $v.title; upload_date = $v.upload_date }
    }
  }
}
RepoLog ('match desde ' + $Since + ': ' + $cands.Count + ' video(s), ' + $skips.Count + ' em skiplist.')

# 3. Downloads (com teto; falhas nao abortam a volta — 429 e transitório)
$dl = @(); $fail = @()
$take = $cands | Select-Object -First $MaxDownloads
foreach ($t in $take) {
  RepoLog "download $($t.canal) / $($t.id) ..."
  $prevErr = $ErrorActionPreference; $ErrorActionPreference = 'Continue'
  try {
    $out = & node scripts/yt-oportunidades.mjs download --canal "$($t.canal)" "$($t.id)" 2>&1 | Out-String
    Write-Host $out
    if ($out -match 'members-only|Join this channel') {
      $skips[$t.id] = 'members-only'
      RepoLog "skiplist: $($t.id) = members-only (nao retentar)."
    }
  } catch {
    $firstLine = $_.Exception.Message.Split([Environment]::NewLine)[0]
    RepoLog ('falha (segue a volta): ' + $t.id + ' — ' + $firstLine)
  } finally { $ErrorActionPreference = $prevErr }
  $dl += $t
}
if ($cands.Count -gt $take.Count) {
  $rest = $cands | Select-Object -Skip $MaxDownloads
  RepoLog "$($rest.Count) match(es) acima do teto; ficam para a proxima volta."
}

# 4. Pending: baixados com .dedup.txt pronto e ainda nao analisados
$localCfg = Get-Content -LiteralPath (Join-Path $RepoRoot 'manifests\canais-vigilados.local.json') -Raw | ConvertFrom-Json
$pending = @()
foreach ($t in $dl) {
  $dir = $localCfg.pastas.($t.canal)
  if (-not $dir) { continue }
  $hits = @(Get-ChildItem -LiteralPath $dir -Filter "$($t.id).*dedup.txt" -ErrorAction SilentlyContinue)
  $anFile = Join-Path $dir 'ANALISADOS.json'
  $analyzed = @()
  if (Test-Path -LiteralPath $anFile) { $analyzed = @(Get-Content -LiteralPath $anFile -Raw | ConvertFrom-Json) }
  if ($hits.Count -gt 0 -and -not ($analyzed -contains $t.id)) {
    $pending += [pscustomobject]@{
      canal = $t.canal; id = $t.id; title = $t.title; upload_date = $t.upload_date
      transcript = $hits[0].FullName
    }
  } else {
    $fail += $t
  }
}
$pendingFile = Join-Path $RepoRoot 'state\yt-pending.json'
@{ generated_at = (Get-Date).ToUniversalTime().ToString('o'); since = $Since; pending = @($pending) } |
  ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $pendingFile -Encoding utf8
$skips | ConvertTo-Json -Depth 3 | Set-Content -LiteralPath $skipsFile -Encoding utf8
RepoLog ('pending: ' + $pending.Count + ' pronto(s) em state/yt-pending.json; ' + $fail.Count + ' sem transcricao (429 ou sem legenda, retenta na proxima).')
RepoLog 'Proximo passo (agente): analisar state/yt-pending.json, cruzar com skills/, CRIAR/ENRIQUECER, validar, mark, commit+push. Ver docs/YT-AUTOLOOP.md.'
