# Render Deployment Checklist

Use this checklist to ensure your backend is ready for deployment on Render.

## ✅ Pre-Deployment Checklist

### 1. Files Verification
- [x] `Procfile` exists and is correct
- [x] `requirements.txt` includes all dependencies (gunicorn, whitenoise)
- [x] `runtime.txt` specifies Python version
- [x] `build.sh` exists (optional, can use Render's build commands)
- [x] `.env` is in `.gitignore` (secrets should NOT be committed)

### 2. Settings Configuration
- [x] All secrets moved to environment variables
- [x] `DEBUG=False` for production
- [x] `ALLOWED_HOSTS` configured via environment variable
- [x] WhiteNoise middleware configured for static files
- [x] CORS settings configured for frontend URL
- [x] CSRF trusted origins include frontend URL
- [x] Database configuration uses environment variables
- [x] Security settings enabled for production

### 3. Static Files
- [x] `STATIC_ROOT` configured
- [x] WhiteNoise middleware added
- [x] `collectstatic` command in build process

### 4. Database
- [x] Database credentials configured via environment variables
- [x] Migrations ready to run
- [x] Database is accessible from Render's servers

## 🚀 Render Configuration Steps

### Step 1: Create Web Service
1. Go to Render Dashboard → New → Web Service
2. Connect your GitHub repository
3. Select the repository

### Step 2: Configure Service Settings

**Basic Settings:**
- **Name**: `cartnova-backend` (or your preferred name)
- **Environment**: `Python 3`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your deployment branch)

**Build & Deploy:**
- **Root Directory**: `backend` ⚠️ **IMPORTANT: Set this to `backend`**
- **Build Command**: 
  ```
  pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate --noinput
  ```
- **Start Command**: 
  ```
  gunicorn cartnova.wsgi:application --bind 0.0.0.0:$PORT
  ```

**Note**: If Root Directory is set to `backend`, the commands above work. If Root Directory is repo root, use:
- Build: `cd backend && pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate --noinput`
- Start: `cd backend && gunicorn cartnova.wsgi:application --bind 0.0.0.0:$PORT`

### Step 3: Set Environment Variables

Add these in Render's Environment section:

#### Required Core Variables:
```
SECRET_KEY=<generate-new-secret-key>
DEBUG=False
ALLOWED_HOSTS=your-app-name.onrender.com,localhost
```

#### Database Variables:
```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=3306
```

#### Frontend Integration:
```
FRONTEND_URL=https://your-vercel-app.vercel.app
CORS_ALLOW_ALL_ORIGINS=False
```

#### Payment Gateways:
```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_API_BASE_URL=https://api-m.sandbox.paypal.com
```

#### reCAPTCHA:
```
GOOGLE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
GOOGLE_RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

#### Optional Security:
```
SECURE_SSL_REDIRECT=True
```

### Step 4: Generate SECRET_KEY

Run this locally to generate a secure secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Or:
```python
import secrets
print(secrets.token_urlsafe(50))
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will:
   - Install dependencies
   - Run migrations
   - Collect static files
   - Start the server

## 🔍 Post-Deployment Verification

After deployment, verify:

- [ ] Service is running (green status)
- [ ] API endpoints are accessible
- [ ] Database connection works
- [ ] Static files are loading
- [ ] CORS is working with frontend
- [ ] Admin panel is accessible
- [ ] Authentication endpoints work
- [ ] Payment gateway integration works

## 🐛 Troubleshooting

### Build Fails
- Check build logs for specific errors
- Verify all dependencies in `requirements.txt`
- Ensure Python version matches `runtime.txt`

### Database Connection Error
- Verify database credentials
- Check if database allows connections from Render IPs
- Ensure database is running

### Static Files Not Loading
- Check if `collectstatic` ran successfully
- Verify WhiteNoise middleware is enabled
- Check `STATIC_ROOT` path

### CORS Errors
- Verify `FRONTEND_URL` is set correctly
- Check `CORS_ALLOWED_ORIGINS` includes frontend URL
- Ensure `CORS_ALLOW_ALL_ORIGINS` is set appropriately

### 500 Internal Server Error
- Check Render logs for detailed errors
- Verify all environment variables are set
- Ensure `SECRET_KEY` is set
- Check database migrations completed

### Module Not Found Errors
- Verify all packages in `requirements.txt` are correct
- Check if virtual environment is being used correctly
- Ensure Python version compatibility

## 📝 Important Notes

1. **Root Directory**: Set to `backend` in Render settings
2. **Port**: Render provides `$PORT` environment variable automatically
3. **Static Files**: WhiteNoise handles static files in production
4. **Media Files**: Consider cloud storage (S3, Cloudinary) as Render's disk is ephemeral
5. **Free Tier**: Render free tier spins down after 15 minutes of inactivity
6. **Environment Variables**: Never commit `.env` file to Git
7. **Database**: Ensure your MySQL database allows connections from Render's IP ranges

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [WhiteNoise Documentation](https://whitenoise.readthedocs.io/)

