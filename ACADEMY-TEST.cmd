@echo off
setlocal
cd /d "%~dp0"
title Webbased Academy Creator - Teststart
set "DIAG_FILE=academy-diagnostics.txt"
set "TEST_LOG=academy-test-output.txt"
set "VISUAL_LOG=academy-visual-output.txt"
set "TEST_STATUS=STARTED"
set "DEV_REPO=https://github.com/communauticneu/webbased-academy-updates.git"
if exist "%TEST_LOG%" del /q "%TEST_LOG%" >nul 2>&1
if exist "%VISUAL_LOG%" del /q "%VISUAL_LOG%" >nul 2>&1
call :write_diagnostics

echo.
echo ==============================================
echo   WEBBASED ACADEMY CREATOR - TESTSTART
echo ==============================================
echo.

echo [1/4] Exakten GitHub-Entwicklungsstand holen...
git fetch --no-tags "%DEV_REPO%" dev-stage-composition
if errorlevel 1 goto :error
git reset --hard FETCH_HEAD
if errorlevel 1 goto :error
echo Aktueller Entwicklungsstand:
git rev-parse --short HEAD

echo.
echo [2/4] Vollstaendige Testsuite ausfuehren...
call npm.cmd test >"%TEST_LOG%" 2>&1
set "TEST_EXIT=%ERRORLEVEL%"
type "%TEST_LOG%"
if not "%TEST_EXIT%"=="0" goto :error

echo.
echo [3/4] Automatischen Screenshot- und Layoutcheck ausfuehren...
call npm.cmd run visual:check >"%VISUAL_LOG%" 2>&1
set "VISUAL_EXIT=%ERRORLEVEL%"
type "%VISUAL_LOG%"
if not "%VISUAL_EXIT%"=="0" goto :error

set "TEST_STATUS=GREEN"
call :write_diagnostics
call :publish_diagnostics

echo.
echo [4/4] Tests und Screenshotcheck gruen - Creator wird gestartet...
echo.
call npm.cmd start
goto :end

:error
set "TEST_STATUS=ERROR"
call :write_diagnostics
call :publish_diagnostics
echo.
echo ==============================================
echo   FEHLER - Creator wurde NICHT gestartet.
echo ==============================================
echo.
echo Diagnose wurde lokal in academy-diagnostics.txt gespeichert.
if exist "academy-visual-latest.png" echo Letzter visueller Test: academy-visual-latest.png
echo.
pause
exit /b 1

:write_diagnostics
>"%DIAG_FILE%" echo Webbased Academy Creator - Diagnose
>>"%DIAG_FILE%" echo Zeitpunkt: %DATE% %TIME%
>>"%DIAG_FILE%" echo Teststatus: %TEST_STATUS%
>>"%DIAG_FILE%" <nul set /p "=Version: "
>>"%DIAG_FILE%" node -p "require('./package.json').version" 2>nul
>>"%DIAG_FILE%" <nul set /p "=Commit: "
>>"%DIAG_FILE%" git rev-parse --short HEAD 2>nul
if /I "%TEST_STATUS%"=="ERROR" (
  if exist "%TEST_LOG%" (
    >>"%DIAG_FILE%" echo Fehlerdetails Tests:
    powershell -NoProfile -Command "$p=[regex]::Escape('%CD%'); $u=[regex]::Escape('%USERPROFILE%'); Get-Content -LiteralPath '%TEST_LOG%' ^| Select-Object -Last 80 ^| ForEach-Object { ($_ -replace $p,'<PROJECT>' -replace $u,'<USER>' -replace 'https?://\S+','<URL>') }" >>"%DIAG_FILE%" 2>nul
  )
  if exist "%VISUAL_LOG%" (
    >>"%DIAG_FILE%" echo Fehlerdetails Visual:
    powershell -NoProfile -Command "$p=[regex]::Escape('%CD%'); $u=[regex]::Escape('%USERPROFILE%'); Get-Content -LiteralPath '%VISUAL_LOG%' ^| Select-Object -Last 40 ^| ForEach-Object { ($_ -replace $p,'<PROJECT>' -replace $u,'<USER>' -replace 'https?://\S+','<URL>') }" >>"%DIAG_FILE%" 2>nul
  )
)
exit /b 0

:publish_diagnostics
set "DIAG_WORKTREE=%TEMP%\academy-creator-diagnostics"
git fetch origin academy-diagnostics >nul 2>&1
git worktree remove --force "%DIAG_WORKTREE%" >nul 2>&1
if exist "%DIAG_WORKTREE%" rmdir /s /q "%DIAG_WORKTREE%"
git worktree add --force -B academy-diagnostics "%DIAG_WORKTREE%" origin/academy-diagnostics >nul 2>&1
if errorlevel 1 exit /b 0
copy /y "%DIAG_FILE%" "%DIAG_WORKTREE%\academy-diagnostics.txt" >nul
pushd "%DIAG_WORKTREE%"
git add academy-diagnostics.txt
git diff --cached --quiet
if not errorlevel 1 goto :publish_cleanup
git commit -m "diagnostics: update latest test status" >nul 2>&1
if errorlevel 1 goto :publish_cleanup
git push origin HEAD:academy-diagnostics >nul 2>&1
:publish_cleanup
popd
git worktree remove --force "%DIAG_WORKTREE%" >nul 2>&1
exit /b 0

:end
endlocal
