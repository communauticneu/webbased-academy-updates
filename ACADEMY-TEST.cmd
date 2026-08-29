@echo off
setlocal
cd /d "%~dp0"
title Webbased Academy Creator - Teststart
set "DIAG_FILE=academy-diagnostics.txt"
set "TEST_STATUS=STARTED"
call :write_diagnostics

echo.
echo ==============================================
echo   WEBBASED ACADEMY CREATOR - TESTSTART
echo ==============================================
echo.

echo [1/4] Exakten GitHub-Entwicklungsstand holen...
git fetch origin dev-stage-composition
if errorlevel 1 goto :error
git reset --hard origin/dev-stage-composition
if errorlevel 1 goto :error

echo.
echo [2/4] Vollstaendige Testsuite ausfuehren...
call npm.cmd test
if errorlevel 1 goto :error

echo.
echo [3/4] Automatischen Screenshot- und Layoutcheck ausfuehren...
call npm.cmd run visual:check
if errorlevel 1 goto :error

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
