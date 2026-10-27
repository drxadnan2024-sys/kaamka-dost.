@echo off
title KaamKa Dost - Smart Digital Assistant
echo ====================================================
echo   KaamKa Dost - Har chhote kaam ka, ek smart dost
echo   Starting local server...
echo ====================================================

set ELECTRON_RUN_AS_NODE=1
set NODE_EXE="C:\Users\sayed adnan\AppData\Local\Programs\antigravity\Antigravity.exe"

if exist %NODE_EXE% (
    start "" http://localhost:3000
    %NODE_EXE% server/server.js
) else (
    where node >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        start "" http://localhost:3000
        node server/server.js
    ) else (
        echo [ERROR] Node.js executable not found.
        echo Please ensure Node.js is installed or Antigravity is present.
        pause
    )
)
pause
