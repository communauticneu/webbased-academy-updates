@echo off
setlocal
cd /d "%~dp0"
title Webbased Academy Creator - Teststart

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

echo.
echo [3/3] Alle Tests gruen - Creator wird gestartet...
echo.
call npm.cmd start
goto :end

:error
echo.
echo ==============================================
echo   FEHLER - Creator wurde NICHT gestartet.
echo ==============================================
echo.
echo Bitte dieses Fenster offen lassen und einen Screenshot senden.
echo.
pause
exit /b 1

:end
endlocal
