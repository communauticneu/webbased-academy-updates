@echo off
setlocal
cd /d "%~dp0"

set "BACKUP_TARGET=\\FILESERVER\datenarchiv\communautic_Ebenbichler_KG\Webbased_Academy_Backups"
set "KEEP_BACKUPS=30"

if not exist "%BACKUP_TARGET%\" (
  echo.
  echo BACKUP FEHLER: FILESERVER oder Backup-Ordner nicht erreichbar.
  echo %BACKUP_TARGET%
  echo.
  pause
  exit /b 1
)

for /f %%I in ('powershell.exe -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HHmmss"') do set "STAMP=%%I"
set "BACKUP_NAME=Webbased-Academy-Creator_Backup_%STAMP%.zip"
set "BACKUP_FILE=%BACKUP_TARGET%\%BACKUP_NAME%"
set "STAGE=%TEMP%\Webbased-Academy-Creator_Backup_%RANDOM%_%RANDOM%"

mkdir "%STAGE%" >nul 2>&1
if errorlevel 1 goto :error

robocopy "%CD%" "%STAGE%" /E /XD ".git" "node_modules" "releases" /XF "academy-diagnostics.txt" ".env" ".env.*" "*.log" "%BACKUP_NAME%" /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 goto :error

powershell.exe -NoProfile -Command "Compress-Archive -Path '%STAGE%\*' -DestinationPath '%BACKUP_FILE%' -CompressionLevel Optimal -Force"
if errorlevel 1 goto :error

if not exist "%BACKUP_FILE%" goto :error
for %%A in ("%BACKUP_FILE%") do if %%~zA LEQ 0 goto :error

rmdir /s /q "%STAGE%" >nul 2>&1

echo.
echo ================================================
echo BACKUP ERFOLGREICH
echo %BACKUP_FILE%
echo ================================================
echo.

powershell.exe -NoProfile -Command "$keep=%KEEP_BACKUPS%; Get-ChildItem -LiteralPath '%BACKUP_TARGET%' -Filter 'Webbased-Academy-Creator_Backup_*.zip' -File ^| Sort-Object LastWriteTime -Descending ^| Select-Object -Skip $keep ^| Remove-Item -Force"
if errorlevel 1 (
  echo HINWEIS: Backup ist sicher, aber alte Backups konnten nicht vollstaendig bereinigt werden.
) else (
  echo Backup-Bestand automatisch auf maximal %KEEP_BACKUPS% Pakete begrenzt.
)

echo.
pause
exit /b 0

:error
rmdir /s /q "%STAGE%" >nul 2>&1
if exist "%BACKUP_FILE%" del /q "%BACKUP_FILE%" >nul 2>&1
echo.
echo ================================================
echo BACKUP FEHLER - es wurde kein gueltiges Backup bestaetigt.
echo ================================================
echo.
pause
exit /b 1
