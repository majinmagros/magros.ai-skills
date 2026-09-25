# Verificacao de sincronizacao das skills (somente leitura, nunca aplica).
# Usado pelo atalho da pasta Inicializar. Nao copia, nao baixa, nao instala nada.
# Se houver divergencia, apenas avisa e indica o comando manual.
# Saida sempre 0 para nunca bloquear o logon.

$sourceSkills = Join-Path $PSScriptRoot "..\skills"
$targetSkills = "$env:USERPROFILE\.config\opencode\skills"
$manualSync = Join-Path $PSScriptRoot "sync_global_opencode.ps1"

if (!(Test-Path -LiteralPath $sourceSkills)) {
    Write-Host "[MAGROS.AI-SKILLS] AVISO: pasta local de skills nao encontrada: $sourceSkills" -ForegroundColor Yellow
    exit 0
}

if (!(Test-Path -LiteralPath $targetSkills)) {
    Write-Host "[MAGROS.AI-SKILLS] AVISO: skills globais nunca sincronizadas." -ForegroundColor Yellow
    Write-Host "[MAGROS.AI-SKILLS] Para sincronizar manualmente rode: powershell -File `"$manualSync`""
    exit 0
}

$src = Get-ChildItem -LiteralPath $sourceSkills -Recurse -File -ErrorAction SilentlyContinue |
    ForEach-Object { $_.FullName.Substring($sourceSkills.Length) + "|" + $_.Length }
$tgt = Get-ChildItem -LiteralPath $targetSkills -Recurse -File -ErrorAction SilentlyContinue |
    ForEach-Object { $_.FullName.Substring($targetSkills.Length) + "|" + $_.Length }

$diff = Compare-Object -ReferenceObject $src -DifferenceObject $tgt
if ($diff) {
    Write-Host "[MAGROS.AI-SKILLS] AVISO: skills globais fora de sincronia com o repositorio." -ForegroundColor Yellow
    Write-Host "[MAGROS.AI-SKILLS] Para sincronizar manualmente rode: powershell -File `"$manualSync`""
} else {
    Write-Host "[MAGROS.AI-SKILLS] Skills globais em dia."
}
exit 0
