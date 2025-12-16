#!/bin/bash

# PsySafe Development Startup Script
# This script helps start both backend and frontend for development

echo "🚀 Starting PsySafe Development Environment"
echo "==========================================="
echo ""

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL..."
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running!"
    echo "   Start it with: sudo service postgresql start"
    exit 1
fi
echo "✅ PostgreSQL is running"
echo ""

# Check if backend is already running
echo "🔍 Checking if backend is already running..."
if curl -s http://localhost:8080 > /dev/null 2>&1; then
    echo "✅ Backend is already running on port 8080"
else
    echo "⚠️  Backend is not running"
    echo "   Start it manually with:"
    echo "   cd backend && mvn spring-boot:run"
    echo ""
    echo "   Or in Eclipse:"
    echo "   Right-click PsySafeApplication.java → Run As → Java Application"
fi
echo ""

# Start frontend
echo "🎨 Starting Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
fi

echo "✅ Starting Vite dev server..."
npm run dev
