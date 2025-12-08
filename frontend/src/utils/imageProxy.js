/**
 * Image proxy utility for handling external images.
 * Proxies images through the backend to avoid mixed-content errors.
 */

import { BASE_URL } from '@/api';

/**
 * Get proxied image URL for external images.
 * If the image is already a relative path or local image, returns it as-is.
 * For external HTTP/HTTPS images, returns a proxied URL through the backend.
 * 
 * @param {string} originalImageUrl - The original image URL from the database
 * @returns {string} - Proxied URL or original URL if local
 */
export function getProxiedImageUrl(originalImageUrl) {
  if (!originalImageUrl || typeof originalImageUrl !== 'string') {
    return '';
  }

  // If it's already a placeholder or empty, return as-is
  if (originalImageUrl.includes('placehold.co') || originalImageUrl === '') {
    return originalImageUrl;
  }

  // If it's a relative path (starts with / or no protocol), construct full URL
  if (!originalImageUrl.startsWith('http://') && !originalImageUrl.startsWith('https://')) {
    // Relative path - construct full URL using BASE_URL
    const cleanedBaseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    const cleanedImagePath = originalImageUrl.startsWith('/') 
      ? originalImageUrl.slice(1) 
      : originalImageUrl;
    return `${cleanedBaseUrl}/${cleanedImagePath}`;
  }

  // External HTTP/HTTPS URL - proxy through backend
  const apiBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const proxiedUrl = `${apiBase}/api/image-proxy/?url=${encodeURIComponent(originalImageUrl)}`;
  return proxiedUrl;
}
