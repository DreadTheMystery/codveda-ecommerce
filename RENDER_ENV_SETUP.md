# Environment Variable Setup for Render Frontend

## IMPORTANT: Set Environment Variable in Render Dashboard

After pushing the code, you need to set the environment variable in your Render static site dashboard:

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your static site (nafsykay)
3. Go to "Environment" tab
4. Add the following environment variable:

   - **Key**: `VITE_API_URL`
   - **Value**: `https://codveda-ecommerce.onrender.com`

5. Click "Save Changes"
6. This will trigger an automatic redeploy

## Alternative: Manual Redeploy

If the environment variable doesn't trigger a redeploy:

1. Go to the "Settings" tab
2. Scroll down to "Deploy Hook"
3. Click "Manual Deploy" → "Clear build cache & deploy"

## Verification

After the deploy completes (usually 2-3 minutes):

1. Visit your site: https://nafsykay.onrender.com
2. Products should now load correctly
3. You can verify the API calls in browser developer tools (F12) → Network tab

## What This Fixes

- The frontend will now use the correct backend URL
- API calls will go to `https://codveda-ecommerce.onrender.com/api/products`
- All CORS issues are resolved since both frontend and backend are on Render
- Products should display properly on the homepage

## Files Updated

- `frontend/.env.production` - Updated with correct backend URL
- Frontend rebuild completed with new environment variables
