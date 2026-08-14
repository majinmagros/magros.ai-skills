# Script de Sincronização Global do Opencode
# Sincroniza a pasta de skills/agents local do repositório para a raiz global (~/.config/opencode)

$sourceSkills = "C:\Projetos\magros.ai-skills\skills"
$targetSkills = "$env:USERPROFILE\.config\opencode\skills"

if (!(Test-Path $targetSkills)) {
    New-Item -ItemType Directory -Path $targetSkills -Force
}

Copy-Item -Path "$sourceSkills\*" -Destination $targetSkills -Recurse -Force
Write-Host "Sincronização concluída com sucesso para $targetSkills" -ForegroundColor Green
