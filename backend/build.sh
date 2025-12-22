#!/bin/bash
# Build script for Render deployment
set -o errexit

# Create staticfiles directory if it doesn't exist
mkdir -p staticfiles

# Collect static files (with verbose output for debugging)
python manage.py collectstatic --noinput --clear || {
    echo "Warning: collectstatic failed, continuing anyway..."
}

# Run migrations
python manage.py migrate --noinput

# Create admin superuser if it doesn't exist
python manage.py create_admin || true

echo "Build completed successfully!"


