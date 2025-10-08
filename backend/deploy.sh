#!/bin/bash

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create admin user for production
echo "👤 Creating admin user..."
node src/createAdmin.js

echo "✅ Deployment completed successfully!"
