@echo off
title AI CA Platform — Backend Server
cd /d "%~dp0"

echo ============================================================
echo  AI Chartered Accountant Platform — Backend Startup
echo  FastAPI + MongoDB  (Fallback: JSON)
echo ============================================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
  echo ERROR: Python not found. Please install Python 3.10+.
  pause
  exit /b 1
)

:: Install dependencies if not present
echo [1/3] Installing dependencies...
pip install -r requirements.txt --quiet

echo [2/3] Starting FastAPI server...
echo.
echo   API:    http://localhost:8000
echo   Docs:   http://localhost:8000/api/docs
echo   Admin:  Open admin.html in browser
echo.
echo   Press Ctrl+C to stop the server.
echo.

:: Launch server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload

pause
