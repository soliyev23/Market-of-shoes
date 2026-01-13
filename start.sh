#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Stylish Shoes Store...${NC}"

# Change to project root
cd "$(dirname "$0")"

# Start backend in background
echo -e "${GREEN}Starting backend on port 8000...${NC}"
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Give backend time to start
sleep 2

# Start frontend in background
echo -e "${GREEN}Starting frontend on port 3000...${NC}"
cd ..
python -m http.server 3000 &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}✓ Backend running on: http://localhost:8000${NC}"
echo -e "${GREEN}✓ Frontend running on: http://localhost:3000${NC}"
echo -e "${GREEN}✓ API docs on: http://localhost:8000/docs${NC}"
echo ""
echo "Press Ctrl+C to stop both servers..."
echo ""

# Trap Ctrl+C and kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo -e '\n${BLUE}Servers stopped.${NC}'; exit" INT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
