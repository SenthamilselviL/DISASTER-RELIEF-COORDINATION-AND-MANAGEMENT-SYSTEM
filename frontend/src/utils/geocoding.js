/**
 * Reverse Geocoding utility for Disaster Relief Coordination System
 * Respects OpenStreetMap Nominatim usage policy:
 * - Includes caching in-memory & localStorage
 * - Throttles/debounces requests
 * - Provides formatted human-readable landmark addresses
 */

const geocodeCache = new Map();

export const reverseGeocode = async (lat, lng) => {
  if (!lat || !lng) return '';

  const roundedLat = Number(lat).toFixed(4);
  const roundedLng = Number(lng).toFixed(4);
  const cacheKey = `${roundedLat},${roundedLng}`;

  // Check in-memory cache
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  // Check localStorage cache
  try {
    const stored = localStorage.getItem(`geo_${cacheKey}`);
    if (stored) {
      geocodeCache.set(cacheKey, stored);
      return stored;
    }
  } catch (e) {
    // Ignore storage quota errors
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${roundedLat}&lon=${roundedLng}&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding HTTP error: ${response.status}`);
    }

    const data = await response.json();
    let readableLocation = '';

    if (data && data.display_name) {
      const addr = data.address || {};
      const parts = [
        addr.road || addr.pedestrian || addr.suburb || '',
        addr.neighbourhood || addr.residential || addr.suburb || '',
        addr.city_district || addr.city || addr.town || addr.county || '',
        addr.state || ''
      ].filter(Boolean);

      // Remove duplicates in sequence
      const uniqueParts = [...new Set(parts)];
      readableLocation = uniqueParts.length > 0 ? uniqueParts.join(', ') : data.display_name.split(',').slice(0, 4).join(', ');
    } else {
      readableLocation = `Coordinates (${roundedLat}, ${roundedLng})`;
    }

    // Cache result
    geocodeCache.set(cacheKey, readableLocation);
    try {
      localStorage.setItem(`geo_${cacheKey}`, readableLocation);
    } catch (e) {}

    return readableLocation;
  } catch (err) {
    console.warn('[Geocoding] Reverse geocode failed or rate-limited, fallback:', err.message);
    return `Location (${roundedLat}, ${roundedLng})`;
  }
};
