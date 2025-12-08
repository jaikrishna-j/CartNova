# Render Deployment Guide for CartNova Backend

This guide will help you deploy the CartNova backend to Render.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. A MySQL database (can be created on Render or use external service like Railway)
3. All environment variables ready

## Deployment Steps

### 1. Create a New Web Service on Render

1. Go to your Render dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing this backend

### 2. Configure Build Settings

**Important**: Set **Root Directory** to `backend` in Render settings!

- **Name**: `cartnova-backend` (or your preferred name)
- **Environment**: `Python 3`
- **Root Directory**: `backend` ⚠️ **CRITICAL: Set this to `backend`**
- **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate --noinput && python manage.py create_admin || true`
- **Start Command**: `gunicorn cartnova.wsgi:application --bind 0.0.0.0:$PORT`

**Note**: If Root Directory is set to `backend`, the Procfile will automatically be used. Otherwise, use the commands above.

### 3. Set Environment Variables

Add the following environment variables in Render dashboard:

#### Required Variables:
```
SECRET_KEY=your-django-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-render-app.onrender.com,localhost
```

#### Database Configuration:
```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=3306
```

#### Frontend URL (for CORS):
```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### CORS Settings:
```
CORS_ALLOW_ALL_ORIGINS=False
```

#### Payment Gateway (Razorpay):
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

#### Payment Gateway (PayPal):
```
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_API_BASE_URL=https://api-m.sandbox.paypal.com
```

#### reCAPTCHA:
```
GOOGLE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
GOOGLE_RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

#### Admin Credentials (for automatic superuser creation):
```
ADMIN_USERNAME=krish
ADMIN_PASSWORD=krish365
ADMIN_EMAIL=admin@cartnova.com
```

**Note**: The admin user will be automatically created during deployment if it doesn't exist. You can access the admin panel at `https://your-backend.onrender.com/admin/` using these credentials.

#### Optional Security Settings:
```
SECURE_SSL_REDIRECT=True
```

### 4. Database Setup

If using Render's PostgreSQL (recommended), you'll need to:
1. Create a PostgreSQL database on Render
2. Update `DATABASES` in settings.py to use PostgreSQL instead of MySQL
3. Or continue using external MySQL database

### 5. Static Files

Static files are automatically collected during build and served via WhiteNoise middleware.

### 6. Media Files

For media files (user uploads), consider using:
- AWS S3 (recommended for production)
- Cloudinary
- Or Render's disk storage (ephemeral - files will be lost on redeploy)

### 7. Deploy

Click "Create Web Service" and Render will:
1. Install dependencies
2. Run migrations
3. Collect static files
4. Start the server

## Post-Deployment Checklist

- [ ] Verify the API is accessible
- [ ] Test database connection
- [ ] Verify static files are loading
- [ ] Test CORS with frontend
- [ ] Verify payment gateway integration
- [ ] Check admin panel access
- [ ] Test authentication endpoints

## Troubleshooting

### Database Connection Issues
- Verify database credentials
- Check if database allows connections from Render's IPs
- Ensure database is running

### Static Files Not Loading
- Check if `collectstatic` ran successfully
- Verify `STATIC_ROOT` path
- Check WhiteNoise middleware is enabled

### CORS Errors
- Verify `FRONTEND_URL` is set correctly
- Check `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Ensure `CORS_ALLOW_ALL_ORIGINS` is set appropriately

### 500 Errors
- Check Render logs for detailed error messages
- Verify all environment variables are set
- Ensure `SECRET_KEY` is set
- Check database migrations completed successfully

## Notes

- Render provides a free tier with limitations
- The free tier spins down after 15 minutes of inactivity
- Consider upgrading for production use
- Always use environment variables for sensitive data
- Never commit `.env` file to version control


