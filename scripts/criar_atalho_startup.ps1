$startup = [System.Environment]::GetFolderPath('Startup')
$scPath = Join-Path $startup 'AtualizarMagrosAISkills.lnk'
$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($scPath)
$sc.TargetPath = Join-Path $PSScriptRoot 'atualizar_sistema.bat'
$sc.WorkingDirectory = $PSScriptRoot
$sc.Save()
Write-Host "Atalho criado com sucesso em: $scPath"
