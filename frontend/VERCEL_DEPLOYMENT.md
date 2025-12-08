# Vercel Deployment Guide for CartNova Frontend

This guide will help you deploy the CartNova frontend to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A GitHub account with your repository
3. Backend deployed on Render (or another hosting service)

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the repository containing the frontend

### 2. Configure Project Settings

**Important**: Set **Root Directory** to `frontend` in Vercel settings!

- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: `frontend` ⚠️ **CRITICAL: Set this to `frontend`**
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**Note**: If Root Directory is set to `frontend`, Vercel will automatically detect the configuration from `vercel.json`.

### 3. Set Environment Variables

Add the following environment variables in Vercel dashboard (Project Settings → Environment Variables):

#### Required Variables:

```
VITE_API_BASE_URL=https://your-backend-app.onrender.com
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

**Important Notes:**
- Replace `your-backend-app.onrender.com` with your actual Render backend URL
- Replace `your_recaptcha_site_key` with your Google reCAPTCHA site key
- These should match the values in your backend `.env` file

### 4. Deploy

1. Click "Deploy"
2. Vercel will:
   - Install dependencies (`npm install`)
   - Build the project (`npm run build`)
   - Deploy to production

### 5. Post-Deployment Configuration

After deployment, verify:

- [ ] Frontend is accessible at your Vercel URL
- [ ] API calls are working (check browser console)
- [ ] reCAPTCHA is loading correctly
- [ ] All routes are working (SPA routing)
- [ ] Payment gateways (Razorpay/PayPal) are accessible

## Configuration Files

### vercel.json

The `vercel.json` file includes:
- **Rewrites**: All routes redirect to `index.html` for SPA routing
- **Headers**: Cache control for static assets
- **Framework**: Vite configuration

### .env File

The `.env` file contains:
- `VITE_API_BASE_URL`: Backend API endpoint
- `VITE_RECAPTCHA_SITE_KEY`: Google reCAPTCHA site key

**Note**: Environment variables in Vercel dashboard override `.env` file values.

## Troubleshooting

### Build Errors

- **Module not found**: Ensure all dependencies are in `package.json`
- **Build timeout**: Check for large dependencies or slow build processes
- **TypeScript errors**: Fix any TypeScript/linting errors

### Runtime Errors

- **API calls failing**: Verify `VITE_API_BASE_URL` is correct and backend CORS is configured
- **reCAPTCHA not loading**: Check `VITE_RECAPTCHA_SITE_KEY` matches backend configuration
- **404 on routes**: Verify `vercel.json` rewrites are configured correctly

### CORS Issues

If you see CORS errors:
1. Verify backend `FRONTEND_URL` includes your Vercel domain
2. Check backend `CORS_ALLOWED_ORIGINS` includes your Vercel URL
3. Ensure backend `ALLOWED_HOSTS` includes backend domain

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://cartnova-backend.onrender.com` |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA site key | `6LdRFfkrAAAAAMGgrtj7n1Py_ZFri_G0dCKbXWZ` |

## Notes

- Vercel automatically provides HTTPS
- Environment variables are available at build time (Vite requirement)
- The `vercel.json` file handles SPA routing automatically
- Static assets are cached for optimal performance
- Free tier includes generous limits for most projects

## Updating Deployment

After making changes:
1. Push changes to your GitHub repository
2. Vercel will automatically trigger a new deployment
3. Preview deployments are created for pull requests
4. Production deployment happens on merge to main branch
