"""
Image proxy view for handling external image requests.
This prevents mixed-content errors by proxying HTTP images through HTTPS backend.
"""
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.views.decorators.http import require_GET
import requests
from urllib.parse import urlparse
import logging

logger = logging.getLogger(__name__)

# Whitelist of allowed image domains/hosts
ALLOWED_IMAGE_HOSTS = [
    'img.fkcdn.com',
    'rukminim2.flixcart.com',
    'm.media-amazon.com',
    'images-na.ssl-images-amazon.com',
    'placehold.co',
    'via.placeholder.com',
    'i.imgur.com',
    'images.unsplash.com',
    # Add more trusted image domains as needed
]

# Additional allowed patterns (for subdomains)
ALLOWED_DOMAIN_PATTERNS = [
    '.fkcdn.com',
    '.flixcart.com',
    '.amazon.com',
    '.amazonaws.com',
]


def is_allowed_host(hostname):
    """
    Check if a hostname is in the whitelist.
    Supports exact matches and domain patterns.
    """
    if not hostname:
        return False
    
    # Normalize hostname (remove port if present)
    hostname = hostname.split(':')[0].lower()
    
    # Check exact matches
    if hostname in ALLOWED_IMAGE_HOSTS:
        return True
    
    # Check domain patterns (for subdomains)
    for pattern in ALLOWED_DOMAIN_PATTERNS:
        if hostname.endswith(pattern):
            return True
    
    return False


@require_GET
def image_proxy(request):
    """
    Proxy image requests from external sources.
    
    Query parameter:
        url: The URL of the image to proxy (must be URL-encoded)
    
    Returns:
        HttpResponse with image data, or error response
    """
    image_url = request.GET.get('url')
    
    if not image_url:
        return HttpResponseBadRequest('Missing "url" parameter')
    
    try:
        # Parse and validate URL
        parsed = urlparse(image_url)
        
        # Only allow http and https schemes
        if parsed.scheme not in ('http', 'https'):
            return HttpResponseBadRequest('Invalid URL scheme. Only http and https are allowed.')
        
        # Validate hostname against whitelist
        if not is_allowed_host(parsed.hostname):
            logger.warning(f'Blocked image proxy request for unauthorized host: {parsed.hostname}')
            return HttpResponseForbidden(f'Image host "{parsed.hostname}" is not allowed')
        
        # Fetch the image
        try:
            # Set a reasonable timeout and user agent
            headers = {
                'User-Agent': 'CartNova-ImageProxy/1.0',
            }
            response = requests.get(
                image_url,
                headers=headers,
                timeout=10,
                stream=True,
                allow_redirects=True
            )
            response.raise_for_status()
            
            # Validate content type
            content_type = response.headers.get('Content-Type', '').lower()
            if not content_type.startswith('image/'):
                return HttpResponseBadRequest(f'URL does not point to an image (Content-Type: {content_type})')
            
            # Stream the image data
            image_data = response.content
            
            # Create response with appropriate headers
            http_response = HttpResponse(image_data, content_type=content_type)
            
            # Add caching headers
            http_response['Cache-Control'] = 'public, max-age=86400'  # 24 hours
            http_response['Access-Control-Allow-Origin'] = '*'  # Allow CORS for images
            
            return http_response
            
        except requests.exceptions.RequestException as e:
            logger.error(f'Error fetching image from {image_url}: {str(e)}')
            return HttpResponseBadRequest(f'Error fetching image: {str(e)}')
            
    except Exception as e:
        logger.error(f'Error processing image proxy request: {str(e)}')
        return HttpResponseBadRequest(f'Invalid request: {str(e)}')
