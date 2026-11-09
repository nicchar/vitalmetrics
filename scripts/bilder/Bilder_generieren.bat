@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul
if errorlevel 1 (
  echo Python ist nicht installiert. Bitte zuerst Python aus dem Microsoft Store installieren
  echo (Suchbegriff "Python 3.12"^) und dieses Fenster danach neu starten.
  pause
  exit /b 1
)
echo Pruefe benoetigte Pakete ...
py -3 -m pip install --quiet --disable-pip-version-check google-genai openpyxl pillow
py -3 gemini_bilder.py %*
echo.
pause
