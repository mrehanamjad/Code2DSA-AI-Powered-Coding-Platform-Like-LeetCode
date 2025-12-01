// ============================================================================
// Difficulty Configuration (Score & XP Tables)
// ============================================================================
//
// These tables define the reward system for accepted solutions.
// Score is used for leaderboards.
// XP is used for leveling and user progression.
// ============================================================================

export const SCORE_TABLE = {
  Easy: 5,
  Medium: 10,
  Hard: 20,
};

export const XP_TABLE = {
  Easy: 10,
  Medium: 25,
  Hard: 50,
};

// When a user solves the same problem again, grant partial XP.
export const REPEAT_SOLVE_XP_MULTIPLIER = 0.5;

// XP for effort (wrong answers, TLE)
export const ATTEMPT_XP = 2;

// Daily streak XP bonus
export const STREAK_BONUS_XP = 20;

// ============================================================================
// Calculate Score
// ============================================================================
//
// Score is awarded ONLY for first-time accepted solutions.
// Repeated accepted submissions do NOT give score.
// Score is tied to problem difficulty.
//
// Returns: number
// ============================================================================
export function calculateScore(
  difficulty: "Easy" | "Medium" | "Hard",
  isFirstSolve: boolean,
  status: string
) {
  const normalizedStatus = status.toLowerCase();

  return normalizedStatus === "accepted" && isFirstSolve
    ? SCORE_TABLE[difficulty]
    : 0;
}

// ============================================================================
// Calculate XP
// ============================================================================
//
// XP Rules:
//
// ✔ First-time accepted → full XP based on difficulty
// ✔ Repeated accepted   → 50% XP
// ✔ Any failed attempt  → small XP reward (ATTEMPT_XP = 1)
// ✔ Streak bonus        → +20 XP added only on accepted submissions
//
// This system encourages:
// - Learning through attempts
// - Not punishing failure
// - Preventing XP farming
// - Rewarding consistency
//
// Returns: number
// 
// Note: Duplicate solutions are blocked by the submission API, so repeated identical submissions are not recorded.
// ============================================================================
export function calculateXP({
  difficulty,
  isFirstSolve,
  status,
  streakActive,
}: {
  difficulty: "Easy" | "Medium" | "Hard";
  isFirstSolve: boolean;
  status: string;
  streakActive: boolean;
}) {
  let xp = 0;

  const normalizedStatus = status.toLowerCase();

  // Accepted submissions
if (normalizedStatus === "accepted") {
    let xp = isFirstSolve
      ? XP_TABLE[difficulty]
      : Math.floor(XP_TABLE[difficulty] * REPEAT_SOLVE_XP_MULTIPLIER);

    // add streak bonus
    if (streakActive) xp += STREAK_BONUS_XP;

    return xp;
  }

  // Wrong Answer  / TLE → give small XP
  if (["wronganswer", "tle"].includes(normalizedStatus)) {
    return ATTEMPT_XP;
  }

  // Compilation or runtime error  → no xp
  return 0;
}

// ---------------------------------------------
// Calculate Level
// ---------------------------------------------
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1;
}

// ============================================================================
// Streak Utilities
// ============================================================================
//
// A streak continues if the user solved something *yesterday*.
// A streak breaks if the gap is 2+ days.
// Solving multiple problems on the same day does NOT extend streak.
//
// ============================================================================


// Check if streak should continue (last solve = yesterday)
export function isStreakContinued(lastSolveDate: Date): boolean {
  const today = new Date();
  const prev = new Date(lastSolveDate);

  const diffDays =
    (today.setHours(0, 0, 0, 0) - prev.setHours(0, 0, 0, 0)) /
    (1000 * 60 * 60 * 24);

  return diffDays === 1;
}

// Check if streak is broken (no solve for 2+ days)
export function isStreakBroken(lastSolveDate: Date): boolean {
  const today = new Date();
  const prev = new Date(lastSolveDate);

  const diffDays =
    (today.setHours(0, 0, 0, 0) - prev.setHours(0, 0, 0, 0)) /
    (1000 * 60 * 60 * 24);

  return diffDays > 1;
}


// ============================================================================
// Update Streak Values
// ============================================================================
//
// Logic:
//
// 1) If it's the user's first solve → streak = 1
// 2) If streak broken → reset to 1
// 3) If solved today → streak unchanged
// 4) If solved yesterday → streak + 1
//
// Returns: { currentStreak, maxStreak }
// ============================================================================

export function updateStreak({
  lastSolveDate,
  currentStreak,
  maxStreak,
}: {
  lastSolveDate: Date;
  currentStreak: number;
  maxStreak: number;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // First solve ever
  if (!lastSolveDate) {
    return { currentStreak: 1, maxStreak: 1 };
  }

  const prev = new Date(lastSolveDate);
  prev.setHours(0, 0, 0, 0);

  const diffDays = (today.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

  // Streak broken
  if (diffDays > 1) {
    return { currentStreak: 1, maxStreak };
  }

  // Solved today → no change
  if (diffDays === 0) {
    return { currentStreak, maxStreak };
  }

  // Streak continues (solved yesterday)
  const newStreak = currentStreak + 1;

  return {
    currentStreak: newStreak,
    maxStreak: Math.max(maxStreak, newStreak),
  };
}