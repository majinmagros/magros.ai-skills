@echo off
echo [MAGROS.AI-SKILLS] Sincronizando skills e atualizando ambiente...
powershell -ExecutionPolicy Bypass -File "%~dp0sync_global_opencode.ps1"
echo [MAGROS.AI-SKILLS] Sincronizacao concluida!
pause
