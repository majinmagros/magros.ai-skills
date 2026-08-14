$startup = [System.Environment]::GetFolderPath('Startup')
$scPath = Join-Path $startup 'AtualizarMagrosAISkills.lnk'
$ws = New-Object -ComObject WScript.Shell
$sc = $ws.CreateShortcut($scPath)
$sc.TargetPath = "C:\Projetos\magros.ai-skills\scripts\atualizar_sistema.bat"
$sc.WorkingDirectory = "C:\Projetos\magros.ai-skills\scripts"
$sc.Save()
Write-Host "Atalho criado com sucesso em: $scPath"
