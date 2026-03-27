@echo off
echo ===================================
echo Starting RoomSync Application
echo ===================================
echo.

echo Make sure you have created the MySQL database 'roomsync' and imported schema.sql and seed.sql
echo Example: mysql -u root -p roomsync ^< backend\schema.sql
echo.

echo Starting backend...
start cmd.exe /k "cd backend && npm start"

echo Starting frontend...
start cmd.exe /k "cd frontend && npm run dev"

echo.
echo Application started! 
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo.
pause
