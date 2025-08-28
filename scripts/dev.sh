#!/bin/bash

# Development startup script

echo "🚀 Starting Text Summarizer development environment..."

# Check if database is running
if ! docker ps | grep -q text-summarizer-db; then
    echo "📦 Starting database..."
    docker-compose up -d postgres
    echo "⏳ Waiting for database to be ready..."
    sleep 5
fi

# Start both frontend and backend
echo "🔥 Starting frontend and backend..."
npm run dev