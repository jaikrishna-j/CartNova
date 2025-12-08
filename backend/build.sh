#!/bin/bash
# Build script for Render deployment
set -o errexit

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate --noinput

# Create admin superuser if it doesn't exist
python manage.py create_admin || true

echo "Build completed successfully!"


