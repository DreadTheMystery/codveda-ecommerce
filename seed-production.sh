#!/bin/bash
# Production Database Seeding Script

echo "🌱 Seeding Production Database..."
echo "Using production MongoDB Atlas connection..."

# Set production environment
export NODE_ENV=production
export MONGO_URI="mongodb+srv://CodVedaProd2024:CodVedaProd2024%21@codveda-production.dxagkme.mongodb.net/?retryWrites=true&w=majority&appName=codveda-production"

# Run seed script
cd backend
node src/seed.js

echo "✅ Production database seeded successfully!"
echo "🚀 Ready for production deployment!"
