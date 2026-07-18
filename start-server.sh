#!/bin/bash

echo "🚀 Starting Docker containers..."
docker compose up -d

echo "⏳ Waiting for PostgreSQL and App containers to be ready..."
sleep 5

echo "🛠️ Pushing database schema..."
docker exec self-hosted-app-1 npx prisma db push

echo "🌱 Seeding default user..."
docker exec self-hosted-app-1 npx prisma db seed

echo "✅ Server is fully running!"
echo "👉 App: http://localhost:3000"
echo "👉 Prisma Studio: http://localhost:5555"
