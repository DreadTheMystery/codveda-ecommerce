# Render Frontend Deployment Configuration

## Static Site Settings for Render

**Build Command:**

```bash
cd frontend && npm install && npm run build
```

**Publish Directory:**

```
frontend/dist
```

**Environment Variables:**

```
VITE_API_URL=https://codveda-ecommerce.onrender.com
```

## Manual Setup Steps:

1. Go to [render.com](https://render.com)
2. Click "New +" → "Static Site"
3. Connect your GitHub repository: `codveda-ecommerce`
4. Configure:

   - **Name**: `codveda-ecommerce-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment Variables**:
     - `VITE_API_URL` = `https://codveda-ecommerce.onrender.com`

5. Click "Create Static Site"

## Expected Result:

- Frontend URL: `https://codveda-ecommerce-frontend.onrender.com`
- No CORS issues (same domain)
- Full functionality
