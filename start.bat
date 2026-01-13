@echo off
setlocal enabledelayedexpansion

echo Starting Stylish Shoes Store...

REM Start backend
echo Starting backend on port 8000...
cd backend
call venv\Scripts\activate
start "Backend" uvicorn main:app --reload --host 0.0.0.0 --port 8000

REM Wait for backend to start
timeout /t 2 /nobreak

REM Start frontend
echo Starting frontend on port 3000...
cd ..
start "Frontend" python -m http.server 3000

echo.
echo Backend running on: http://localhost:8000
echo Frontend running on: http://localhost:3000
echo API docs on: http://localhost:8000/docs
echo.
echo Close these windows to stop the servers.
pause
