@echo off
echo ===================================================
echo Shop Order Tracker - Offline Download Tool
echo ===================================================
echo.

:: Check if wget is installed
where wget >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo ERROR: wget is not installed or not in your PATH.
  echo Please install wget using Chocolatey with: choco install wget
  echo Or download it from: https://eternallybored.org/misc/wget/
  echo.
  echo See OFFLINE-ACCESS.md for more information.
  echo.
  pause
  exit /b 1
)

:: Check if the development server is running
echo Checking if development server is running...
powershell -Command "try { $null = (Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 2); Write-Host 'Server is running!' } catch { Write-Host 'ERROR: Development server is not running!'; exit 1 }"

if %ERRORLEVEL% neq 0 (
  echo.
  echo Please start the development server with: npm run dev
  echo Then run this script again.
  echo.
  pause
  exit /b 1
)

echo.
echo Starting download for offline access...
echo This may take a few minutes depending on your connection speed.
echo.

:: Create offline-version directory if it doesn't exist
if not exist "%~dp0..\offline-version" mkdir "%~dp0..\offline-version"

:: Run wget command
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent --no-host-directories --directory-prefix="%~dp0..\offline-version" --restrict-file-names=windows --no-check-certificate --no-clobber --user-agent="Mozilla/5.0" http://localhost:5173

if %ERRORLEVEL% neq 0 (
  echo.
  echo ERROR: Download failed. Please check the error messages above.
  echo.
  pause
  exit /b 1
)

echo.
echo Download completed successfully!
echo.
echo Your offline version is saved to: %~dp0..\offline-version
echo You can now access the website offline by opening index.html in that directory.
echo.

pause