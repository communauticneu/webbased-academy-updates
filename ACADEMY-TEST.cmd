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

echo [1/3] Exakten GitHub-Entwicklungsstand holen...
git fetch origin dev-stage-composition
if errorlevel 1 goto :error
git reset --hard origin/dev-stage-composition
if errorlevel 1 goto :error

echo.
echo [2/3] Vollstaendige Testsuite ausfuehren...
call npm.cmd test
if errorlevel 1 goto :error
set "TEST_STATUS=GREEN"
call :write_diagnostics

echo.
echo [3/3] Alle Tests gruen - Creator wird gestartet...
echo.
call npm.cmd start
goto :end

:error
set "TEST_STATUS=ERROR"
call :write_diagnostics
echo.
echo ==============================================
echo   FEHLER - Creator wurde NICHT gestartet.
echo ==============================================
echo.
echo Diagnose wurde lokal in academy-diagnostics.txt gespeichert.
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

:end
endlocal
