@echo off
title TajikCraft Web Launcher
echo Starting TajikCraft Web Server on http://localhost:8000...

:: Start Python web server in background if not already running
netstat -ano | findstr :8000 >nul
if %ERRORLEVEL% NEQ 0 (
    start /B python -m http.server 8000 --directory web
    timeout /t 2 /nobreak >nul
)

echo Opening TajikCraft in your browser...
start http://localhost:8000
echo Enjoy exploring Tajikistan!
pause

