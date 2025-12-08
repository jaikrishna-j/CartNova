# Environment Variables Reference

This file lists all environment variables needed for the CartNova backend deployment.

## Required Variables

### Django Core
- `SECRET_KEY` - Django secret key (generate a new one for production)
- `DEBUG` - Set to `False` for production
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts (e.g., `your-app.onrender.com,localhost`)

### Database
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `DB_PORT` - Database port (usually `3306` for MySQL or `5432` for PostgreSQL)

### Frontend Integration
- `FRONTEND_URL` - Your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
- `CORS_ALLOW_ALL_ORIGINS` - Set to `False` for production (use specific origins)

### Payment Gateways

#### Razorpay
- `RAZORPAY_KEY_ID` - Razorpay API key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API secret key

#### PayPal
- `PAYPAL_CLIENT_ID` - PayPal client ID
- `PAYPAL_CLIENT_SECRET` - PayPal client secret
- `PAYPAL_API_BASE_URL` - PayPal API URL (sandbox: `https://api-m.sandbox.paypal.com`)

### reCAPTCHA
- `GOOGLE_RECAPTCHA_SITE_KEY` - Google reCAPTCHA site key
- `GOOGLE_RECAPTCHA_SECRET_KEY` - Google reCAPTCHA secret key

## Optional Variables

### Security (Production)
- `SECURE_SSL_REDIRECT` - Set to `True` to force HTTPS redirects

## Generating SECRET_KEY

Run this command to generate a new Django secret key:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Or use Python:
```python
import secrets
print(secrets.token_urlsafe(50))
```


