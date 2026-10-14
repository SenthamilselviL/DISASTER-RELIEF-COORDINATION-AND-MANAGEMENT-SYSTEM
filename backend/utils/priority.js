/**
 * Calculates rule-based priority for an emergency relief request.
 * Deterministic, explainable, and transparent rule-based logic (no AI/ML).
 *
 * @param {Object} params
 * @param {string} params.category - Food, Medical, Shelter, Rescue
 * @param {string} params.description - Details of the emergency
 * @param {number} params.peopleAffected - Number of people needing aid
 * @returns {{ priority: 'CRITICAL'|'HIGH'|'MEDIUM'|'LOW', reason: string }}
 */
export function calculatePriority({ category, description = '', peopleAffected = 1 }) {
  const text = description.toLowerCase();
  const count = Number(peopleAffected) || 1;

  // Keyword lexicons for rule evaluations
  const lifeThreatKeywords = [
    'dying', 'unconscious', 'cardiac', 'heart attack', 'severe bleeding',
    'heavy bleeding', 'severe injury', 'oxygen', 'critical condition',
    'stroke', 'head injury', 'cannot breathe', 'suffocating'
  ];

  const perilRescueKeywords = [
    'trapped', 'drowning', 'submerged', 'water rising', 'roof', 'rooftop',
    'collapsing', 'collapsed', 'fire', 'electrocution', 'sinking', 'stranded in water',
    'current washing away', 'under rubble', 'debris'
  ];

  const vulnerableKeywords = [
    'baby', 'infant', 'pregnant', 'elderly', 'child', 'children',
    'disabled', 'handicapped', 'bedridden', 'dialysis'
  ];

  const starvationKeywords = [
    'starving', 'no food for days', 'no water for days', 'dehydrated',
    'fainting from hunger', 'starvation'
  ];

  // 1. MEDICAL RULES
  if (category === 'Medical') {
    const hasLifeThreat = lifeThreatKeywords.some(kw => text.includes(kw));
    const hasVulnerable = vulnerableKeywords.some(kw => text.includes(kw));

    if (hasLifeThreat || count >= 5) {
      return {
        priority: 'CRITICAL',
        reason: 'Life-threatening medical condition, severe trauma, or multiple casualties indicated'
      };
    }
    if (hasVulnerable || count >= 3) {
      return {
        priority: 'HIGH',
        reason: 'Medical assistance urgently needed for vulnerable individuals or small group'
      };
    }
    return {
      priority: 'HIGH',
      reason: 'Urgent medical consultation or treatment supplies required'
    };
  }

  // 2. RESCUE RULES
  if (category === 'Rescue') {
    const hasPeril = perilRescueKeywords.some(kw => text.includes(kw));
    const hasVulnerable = vulnerableKeywords.some(kw => text.includes(kw));

    if (hasPeril || count >= 8) {
      return {
        priority: 'CRITICAL',
        reason: 'Immediate physical peril, trapped victims, or life-threatening environmental hazard'
      };
    }
    if (hasVulnerable || count >= 3) {
      return {
        priority: 'HIGH',
        reason: 'Evacuation required for vulnerable individuals in flooded/compromised zone'
      };
    }
    return {
      priority: 'HIGH',
      reason: 'Standard rescue and evacuation assistance needed'
    };
  }

  // 3. SHELTER RULES
  if (category === 'Shelter') {
    const hasVulnerable = vulnerableKeywords.some(kw => text.includes(kw));
    if (count >= 10 || hasVulnerable) {
      return {
        priority: 'HIGH',
        reason: 'Urgent shelter requirement for vulnerable demographics or large group without roof'
      };
    }
    if (count >= 4) {
      return {
        priority: 'MEDIUM',
        reason: 'Temporary displacement housing required for displaced family'
      };
    }
    return {
      priority: 'MEDIUM',
      reason: 'Relief shelter assistance requested'
    };
  }

  // 4. FOOD RULES
  if (category === 'Food') {
    const isStarving = starvationKeywords.some(kw => text.includes(kw));
    const hasVulnerable = vulnerableKeywords.some(kw => text.includes(kw));

    if (isStarving || count >= 20) {
      return {
        priority: 'HIGH',
        reason: 'Critical food exhaustion or large group facing acute shortage'
      };
    }
    if (hasVulnerable || count >= 6) {
      return {
        priority: 'HIGH',
        reason: 'Food and potable water required for family with infants or elderly'
      };
    }
    return {
      priority: 'MEDIUM',
      reason: 'Standard food rations and drinking water kit required'
    };
  }

  // Default fallback
  return {
    priority: 'MEDIUM',
    reason: 'Standard disaster relief request prioritized by default'
  };
}
