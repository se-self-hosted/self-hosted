#!/bin/bash

echo "🚀 Starting Docker containers (waits until PostgreSQL and MinIO report healthy)..."
docker compose up -d --wait

echo "🛠️ Pushing database schema..."
docker compose exec -T app npx -y prisma db push

echo "🌱 Seeding default user..."
docker compose exec -T app npx -y prisma db seed

echo "✅ Server is fully running!"
echo "👉 App: http://localhost:3000"
echo "👉 Prisma Studio: http://localhost:5555"
