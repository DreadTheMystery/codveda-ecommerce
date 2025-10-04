#!/bin/bash

# Frontend build script for Render
echo "Building frontend for production..."

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build the project
npm run build

# Copy built files to serve
echo "Build complete!"
ls -la dist/
