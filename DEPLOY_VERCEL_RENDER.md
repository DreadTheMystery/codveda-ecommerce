# 🚀 Deploy Frontend to Vercel + Backend to Render

## 🎯 **Why This Setup is Better:**
- **Vercel**: Unlimited free deployments for frontend
- **Render**: 750 hours/month free for backend (enough for small projects)
- **Both**: No time limits, just usage limits

---

## 📱 **Frontend Deployment (Vercel)**

### **Step 1: Prepare Frontend**
```bash
cd frontend
npm run build
```

### **Step 2: Deploy to Vercel**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Select your `codveda-ecommerce` repository
5. Set **Root Directory**: `frontend`
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. Deploy!

### **Step 3: Environment Variables on Vercel**
Add in Vercel Dashboard → Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-name.onrender.com
```

---

## 🔧 **Backend Deployment (Render)**

### **Step 1: Deploy to Render**
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New Web Service"
4. Select your `codveda-ecommerce` repository
5. Set **Root Directory**: `backend`
6. **Build Command**: `npm install`
7. **Start Command**: `npm start`

### **Step 2: Environment Variables on Render**
Add in Render Dashboard → Environment:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 🗄️ **Database Options (Free)**

### **Option 1: MongoDB Atlas (Recommended)**
- 512MB free forever
- Go to https://cloud.mongodb.com
- Create free cluster
- Get connection string

### **Option 2: Render PostgreSQL**
- Free PostgreSQL database with Render
- 1GB storage free

---

## 🔗 **Final Architecture**
```
Frontend (Vercel) → Backend (Render) → Database (MongoDB Atlas)
     ↓                    ↓                    ↓
Free Forever        750h/month          512MB Forever
```

---

## ⚡ **Quick Start Commands**

Deploy frontend:
```bash
cd frontend
vercel --prod
```

Your apps will be:
- **Store**: https://your-app.vercel.app
- **API**: https://your-backend.onrender.com
- **Admin**: https://your-app.vercel.app/admin.html

**All free and production-ready!** 🎉
