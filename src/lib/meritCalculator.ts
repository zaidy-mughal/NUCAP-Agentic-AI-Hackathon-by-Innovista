/**
 * Merit Calculation Engine for NUCAP
 * Calculates merit based on university-specific formulas
 */

export interface MeritInput {
  matricPercentage: number;
  interPercentage: number;
  testScore?: number;
  universityShortName: string;
}

export interface MeritCriteria {
  matricWeight: number;
  interWeight: number;
  testWeight: number;
  maxTestScore: number;
}

export interface AdmissionChanceResult {
  chance: 'High' | 'Good' | 'Medium' | 'Low';
  message: string;
  color: string;
}

// Different universities have different merit formulas
export const MERIT_FORMULAS: Record<string, MeritCriteria> = {
  'NUST': {
    matricWeight: 0.10,  // 10%
    interWeight: 0.15,   // 15%
    testWeight: 0.75,    // 75%
    maxTestScore: 200
  },
  'FAST': {
    matricWeight: 0.10,
    interWeight: 0.40,
    testWeight: 0.50,
    maxTestScore: 100
  },
  'COMSATS': {
    matricWeight: 0.15,
    interWeight: 0.35,
    testWeight: 0.50,
    maxTestScore: 100
  },
  'PUNJAB': {
    matricWeight: 0.20,
    interWeight: 0.50,
    testWeight: 0.30,
    maxTestScore: 100
  },
  'PIEAS': {
    matricWeight: 0.10,
    interWeight: 0.15,
    testWeight: 0.75,
    maxTestScore: 200
  }
};

/**
 * Calculate merit based on university-specific formula
 */
export function calculateMerit(input: MeritInput): number {
  const criteria = MERIT_FORMULAS[input.universityShortName.toUpperCase()];
  
  if (!criteria) {
    throw new Error(`Unknown university: ${input.universityShortName}`);
  }

  // Normalize test score to percentage
  const normalizedTest = input.testScore 
    ? (input.testScore / criteria.maxTestScore) * 100 
    : 0;

  const merit = 
    (input.matricPercentage * criteria.matricWeight) +
    (input.interPercentage * criteria.interWeight) +
    (normalizedTest * criteria.testWeight);

  return Math.round(merit * 100) / 100;
}

/**
 * Calculate merit for all universities
 */
export function calculateAllMerits(
  matricPercentage: number,
  interPercentage: number,
  testScores: Record<string, number>
): Record<string, number> {
  const merits: Record<string, number> = {};

  for (const [university, criteria] of Object.entries(MERIT_FORMULAS)) {
    const testScore = testScores[university] || 0;
    
    try {
      merits[university] = calculateMerit({
        matricPercentage,
        interPercentage,
        testScore,
        universityShortName: university
      });
    } catch (error) {
      console.error(`Error calculating merit for ${university}:`, error);
      merits[university] = 0;
    }
  }

  return merits;
}

/**
 * Evaluate admission chances based on merit gap
 */
export function evaluateAdmissionChance(
  studentMerit: number,
  lastYearClosingMerit: number
): AdmissionChanceResult {
  const gap = studentMerit - lastYearClosingMerit;

  if (gap >= 5) {
    return {
      chance: 'High',
      message: 'Your merit is significantly above last year\'s closing merit!',
      color: 'green'
    };
  } else if (gap >= 0) {
    return {
      chance: 'Good',
      message: 'You are close to the closing merit. Good chances!',
      color: 'blue'
    };
  } else if (gap >= -3) {
    return {
      chance: 'Medium',
      message: 'Merit is tight. Keep this as a backup option.',
      color: 'yellow'
    };
  } else {
    return {
      chance: 'Low',
      message: 'Closing merit is higher. Consider improving test score.',
      color: 'red'
    };
  }
}

/**
 * Calculate match score (0-100) for university matching
 */
export function calculateMatchScore(
  studentMerit: number,
  closingMerit: number,
  preferredCities: string[],
  universityLocation: string,
  preferredFields: string[],
  departmentCategory: string
): number {
  let score = 0;

  // Merit compatibility (50 points)
  const meritGap = studentMerit - closingMerit;
  if (meritGap >= 5) score += 50;
  else if (meritGap >= 0) score += 40;
  else if (meritGap >= -3) score += 25;
  else if (meritGap >= -5) score += 10;

  // Location preference (25 points)
  if (preferredCities.length === 0 || preferredCities.includes(universityLocation)) {
    score += 25;
  } else {
    score += 10; // Partial points for flexibility
  }

  // Field preference (25 points)
  if (preferredFields.length === 0 || preferredFields.includes(departmentCategory)) {
    score += 25;
  } else {
    score += 10; // Partial points for flexibility
  }

  return Math.min(100, Math.round(score));
}

/**
 * Estimate required test score to reach target merit
 */
export function estimateRequiredTestScore(
  matricPercentage: number,
  interPercentage: number,
  targetMerit: number,
  universityShortName: string
): number {
  const criteria = MERIT_FORMULAS[universityShortName.toUpperCase()];
  
  if (!criteria) {
    throw new Error(`Unknown university: ${universityShortName}`);
  }

  // Calculate current merit without test
  const currentMerit = 
    (matricPercentage * criteria.matricWeight) +
    (interPercentage * criteria.interWeight);

  // Calculate required merit from test
  const requiredTestMerit = targetMerit - currentMerit;

  // Convert to test score
  const requiredTestPercentage = requiredTestMerit / criteria.testWeight;
  const requiredTestScore = (requiredTestPercentage / 100) * criteria.maxTestScore;

  return Math.ceil(requiredTestScore);
}

