#!/bin/bash

echo "🚀 Deploying CodVeda E-commerce to Vercel + Render"
echo "=================================================="

# Check if required tools are installed
echo "📋 Checking prerequisites..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "✅ All prerequisites met!"

# Deploy Frontend to Vercel
echo ""
echo "📱 Deploying Frontend to Vercel..."
echo "--------------------------------"
cd frontend

echo "🔨 Building frontend..."
npm run build

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Frontend deployed to Vercel!"

# Instructions for backend
cd ..
echo ""
echo "🔧 Backend Deployment Instructions:"
echo "===================================="
echo "1. Go to https://render.com"
echo "2. Sign up/Login with GitHub"
echo "3. Click 'New Web Service'"
echo "4. Select your 'codveda-ecommerce' repository"
echo "5. Configure:"
echo "   - Root Directory: backend"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "6. Add Environment Variables:"
echo "   - NODE_ENV=production"
echo "   - MONGODB_URI=your-mongodb-connection-string"
echo "   - JWT_SECRET=your-secret-key"
echo "   - FRONTEND_URL=https://your-app.vercel.app"

echo ""
echo "🗄️ Database Setup:"
echo "=================="
echo "1. Go to https://cloud.mongodb.com"
echo "2. Create free MongoDB Atlas cluster (512MB free)"
echo "3. Get connection string"
echo "4. Add it to Render environment variables"

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "Your frontend is now live on Vercel!"
echo "Complete the backend deployment on Render to finish setup."
echo ""
echo "📝 Don't forget to:"
echo "- Update VITE_API_URL in Vercel environment variables"
echo "- Test your live application"
echo "- Add products via admin panel"
