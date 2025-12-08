#!/bin/bash
# Build script for Render deployment
set -o errexit

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate --noinput

echo "Build completed successfully!"


