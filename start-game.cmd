@echo off
cd /d "%~dp0"
if not exist "node_modules\vite\bin\vite.js" (
  call npm.cmd install
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
call npm.cmd run dev
if errorlevel 1 pause
