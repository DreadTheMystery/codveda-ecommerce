# Railway Full-Stack Deployment

## Environment Variables Needed

Create these environment variables in your Railway dashboard:

### Backend Environment Variables:
```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
```

### Frontend Environment Variables:
```
VITE_API_URL=https://your-backend-url.railway.app
```

## Deployment Steps:

1. **Create Railway Account**: Go to https://railway.app
2. **Connect GitHub**: Link your GitHub account
3. **Deploy from GitHub**: Select your repository
4. **Set Environment Variables**: Add the variables above
5. **Deploy**: Railway will automatically build and deploy

## MongoDB Setup:

You'll need a MongoDB database. Options:
- **MongoDB Atlas** (recommended): Free tier available
- **Railway MongoDB**: Add from Railway services

## WhatsApp Integration:

Your WhatsApp number is already configured: +2348169200077
This will work automatically once deployed.

## Domain:

Railway provides:
- Free subdomain: `your-app-name.railway.app`
- Custom domain support (paid plans)

## Post-Deployment:

1. Test your live app
2. Add products via admin panel
3. Test WhatsApp integration
4. Update any hardcoded localhost URLs

Your app will be live and ready for customers! 🚀
