#!/bin/bash

# Project status check script

echo "📊 Text Summarizer Project Status"
echo "=================================="
echo ""

# Check Node.js version
echo "🟢 Node.js version:"
node --version
echo ""

# Check npm version
echo "🟢 npm version:"
npm --version
echo ""

# Check if Docker is running
echo "🐳 Docker status:"
if docker info >/dev/null 2>&1; then
    echo "✅ Docker is running"
else
    echo "❌ Docker is not running"
fi
echo ""

# Check database container
echo "🐘 Database status:"
if docker ps | grep -q text-summarizer-db; then
    echo "✅ PostgreSQL container is running"
else
    echo "❌ PostgreSQL container is not running"
    echo "   Run: npm run db:up"
fi
echo ""

# Check project structure
echo "📁 Project structure:"
echo "├── text-summarizer/"
if [ -d "backend" ]; then
    echo "│   ├── ✅ backend/"
else
    echo "│   ├── ❌ backend/"
fi

if [ -d "frontend" ]; then
    echo "│   ├── ✅ frontend/"
else
    echo "│   ├── ❌ frontend/"
fi

if [ -d "docs" ]; then
    echo "│   ├── ✅ docs/"
else
    echo "│   ├── ❌ docs/"
fi

if [ -d "scripts" ]; then
    echo "│   └── ✅ scripts/"
else
    echo "│   └── ❌ scripts/"
fi
echo ""

# Check dependencies
echo "📦 Dependencies:"

if [ -f "backend/package.json" ]; then
    if [ -d "backend/node_modules" ]; then
        echo "✅ Backend dependencies installed"
    else
        echo "❌ Backend dependencies not installed"
        echo "   Run: cd backend && npm install"
    fi
else
    echo "❌ Backend package.json not found"
fi

if [ -f "frontend/package.json" ]; then
    if [ -d "frontend/node_modules" ]; then
        echo "✅ Frontend dependencies installed"
    else
        echo "❌ Frontend dependencies not installed"
        echo "   Run: cd frontend && npm install"
    fi
else
    echo "❌ Frontend package.json not found"
fi
echo ""

# Check configuration files
echo "⚙️  Configuration:"

if [ -f "backend/.env" ]; then
    echo "✅ Backend .env file exists"
else
    echo "❌ Backend .env file missing"
    echo "   Run: cp backend/.env.example backend/.env"
fi

if [ -f "docker-compose.yml" ]; then
    echo "✅ Docker Compose configuration exists"
else
    echo "❌ Docker Compose configuration missing"
fi
echo ""

echo "🚀 To start development:"
echo "   npm run setup    # Initial setup"
echo "   npm run dev      # Start all services"
echo "   npm run db:up    # Start database only"
echo ""