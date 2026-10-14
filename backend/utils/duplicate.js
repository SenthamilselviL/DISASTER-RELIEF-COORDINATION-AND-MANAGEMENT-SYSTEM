import { calculateDistanceMeters, formatDistance } from './distance.js';

/**
 * Checks if a new request is a potential duplicate of existing active requests.
 * Evaluates same category, geographic proximity (within 500 meters), and active status.
 *
 * @param {Object} newRequest
 * @param {Array<Object>} existingRequests
 * @returns {{ isDuplicate: boolean, duplicateOf: string|null, score: number, warning: string }}
 */
export function detectDuplicate(newRequest, existingRequests = []) {
  const DUPLICATE_DISTANCE_THRESHOLD_METERS = 500; // 500 meters
  const MAX_HOURS_LOOKBACK = 72; // Within past 3 days
  const now = new Date().getTime();

  let closestMatch = null;
  let highestScore = 0;
  let matchDistance = 0;

  for (const existing of existingRequests) {
    // Exclude resolved requests from triggering active duplicates
    if (existing.status === 'RESOLVED') continue;

    // Check time window
    const createdAt = new Date(existing.createdAt).getTime();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
    if (hoursDiff > MAX_HOURS_LOOKBACK) continue;

    // Must be same emergency category (e.g. Food, Rescue, Medical)
    if (existing.category !== newRequest.category) continue;

    // Calculate distance using Haversine
    const distance = calculateDistanceMeters(
      newRequest.latitude,
      newRequest.longitude,
      existing.latitude,
      existing.longitude
    );

    if (distance <= DUPLICATE_DISTANCE_THRESHOLD_METERS) {
      // Calculate duplicate confidence score (0 to 100)
      // Closer distance = higher score
      const distanceScore = Math.max(0, 100 - Math.round((distance / DUPLICATE_DISTANCE_THRESHOLD_METERS) * 50));
      
      // Bonus if description shares common key tokens
      let textBonus = 0;
      const newTokens = new Set(
        (newRequest.description || '')
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(t => t.length > 3)
      );
      const existTokens = (existing.description || '')
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(t => t.length > 3);

      let sharedTokens = 0;
      for (const tok of existTokens) {
        if (newTokens.has(tok)) sharedTokens++;
      }
      if (sharedTokens > 0) {
        textBonus = Math.min(25, sharedTokens * 8);
      }

      const totalScore = Math.min(100, distanceScore + textBonus);

      if (totalScore > highestScore) {
        highestScore = totalScore;
        closestMatch = existing;
        matchDistance = distance;
      }
    }
  }

  if (closestMatch) {
    const formattedDist = formatDistance(matchDistance);
    return {
      isDuplicate: true,
      duplicateOf: closestMatch._id,
      score: highestScore,
      warning: `Possible duplicate of request #${closestMatch._id.toString().slice(-6)} (${closestMatch.category} at ${closestMatch.location}, ${formattedDist} away, status: ${closestMatch.status})`
    };
  }

  return {
    isDuplicate: false,
    duplicateOf: null,
    score: 0,
    warning: ''
  };
}
