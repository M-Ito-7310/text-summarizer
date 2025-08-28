#!/bin/bash

# Text Summarizer Setup Script

set -e

echo "🚀 Setting up Text Summarizer project..."

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

echo "✅ Dependencies installed"

# Setup environment files
echo "⚙️  Setting up environment files..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env from template"
else
    echo "⚠️  backend/.env already exists, skipping"
fi

# Start database
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Test database connection
echo "🔌 Testing database connection..."
docker exec text-summarizer-db pg_isready -U postgres

echo "✅ Database is ready"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To start services separately:"
echo "  npm run dev:backend  # Backend on http://localhost:3001"
echo "  npm run dev:frontend # Frontend on http://localhost:5173"
echo ""
echo "To manage database:"
echo "  npm run db:up    # Start database"
echo "  npm run db:down  # Stop database"
echo "  npm run db:logs  # View database logs"
echo ""