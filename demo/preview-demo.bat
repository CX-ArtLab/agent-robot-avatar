@echo off
setlocal
cd /d "%~dp0.."

for /f %%P in ('powershell -NoProfile -Command "$p=Get-Random -Minimum 18000 -Maximum 48000; while(Get-NetTCPConnection -State Listen -LocalPort $p -ErrorAction SilentlyContinue){$p=Get-Random -Minimum 18000 -Maximum 48000}; Write-Output $p"') do set PORT=%%P

where py >nul 2>nul
if %errorlevel%==0 (
  start "Agent Robot Avatar Demo" cmd /c "py -m http.server %PORT%"
  timeout /t 1 /nobreak >nul
  start "" "http://localhost:%PORT%/demo/?v=0.1.0"
  exit /b
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "Agent Robot Avatar Demo" cmd /c "python -m http.server %PORT%"
  timeout /t 1 /nobreak >nul
  start "" "http://localhost:%PORT%/demo/?v=0.1.0"
  exit /b
)

where npx >nul 2>nul
if %errorlevel%==0 (
  start "Agent Robot Avatar Demo" cmd /c "npx --yes http-server -p %PORT%"
  timeout /t 2 /nobreak >nul
  start "" "http://localhost:%PORT%/demo/?v=0.1.0"
  exit /b
)

echo.
echo No Python or Node.js was found on this computer.
echo Install either Python or Node.js, then run this file again.
echo.
pause
