$startup = [System.Environment]::GetFolderPath('Startup')
$oldPath = Join-Path $startup 'AtualizarMagrosAISkills.lnk'
if (Test-Path -LiteralPath $oldPath) {
    Remove-Item -LiteralPath $oldPath -Force
    Write-Host "Atalho antigo removido: $oldPath"
}
$scPath = Join-Path $startup 'VerificarMagrosAISkills.lnk'
$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($scPath)
$sc.TargetPath = Join-Path $PSScriptRoot 'atualizar_sistema.bat'
$sc.WorkingDirectory = $PSScriptRoot
$sc.Save()
Write-Host "Atalho criado com sucesso em: $scPath"
