// lib/actions/updateUserStats.ts
import UserStatistic from "@/models/userStatistic.model";
import Submission from "@/models/submission.model";
import Problem from "@/models/problem.model"; // Assuming you have this
import {
  calculateScore,
  calculateXP,
  calculateLevel,
  updateStreak,
  isStreakContinued,
} from "@/lib/stats";

interface UpdateStatsParams {
  userId: string;
  problemId: string;
  status: string;
  language: string;
}

export async function updateUserStatistics({
  userId,
  problemId,
  status,
  language,
}: UpdateStatsParams) {
  const now = new Date();
  const normalizedStatus = status.toLowerCase();

  // 1. Fetch necessary data (Parallelize for performance)
  const [userStats, problem, previousSolves] = await Promise.all([
    UserStatistic.findOne({ userId }),
    Problem.findById(problemId).select("difficulty topics"), // topics = skills
    Submission.countDocuments({
      userId,
      problemId,
      status: "accepted",
    }),
  ]);

  if (!problem) throw new Error("Problem not found");

  // Initialize stats if user is new
  let stats = userStats || new UserStatistic({ userId });

  // 2. Determine Context
  // If count is 0 (or 1 and we just saved it), it's a first solve.
  // Since we run this AFTER saving the submission, '1' means this current one is the first.
  const isFirstSolve = previousSolves <= 1;
  const difficulty = problem.difficulty;

  // 3. Calculate Streak
  // Check if streak is active BEFORE updating the date
  const streakActive = isStreakContinued(stats.currentStreak.date);

  //  update streak
  const { currentStreak, maxStreak } = updateStreak({
    lastSolveDate: stats.currentStreak.date,
    currentStreak: stats.currentStreak.value,
    maxStreak: stats.maxStreak,
  });

  stats.currentStreak.value = currentStreak;
  stats.currentStreak.date = now;
  stats.maxStreak = maxStreak;

  // 4. Calculate Rewards
  const xpEarned = calculateXP({
    difficulty,
    isFirstSolve,
    status: normalizedStatus,
    streakActive,
  });

  const scoreEarned = calculateScore(
    difficulty,
    isFirstSolve,
    normalizedStatus
  );

  // 5. Apply Updates to Stats Object

  // -- Basics
  stats.totalSubmissions += 1;
  stats.xp += xpEarned;
  stats.score += scoreEarned;
  stats.level = calculateLevel(stats.xp);

  // -- Difficulty Counts (Only on Accept)
  if (normalizedStatus === "accepted") {
    stats.problemSolved[difficulty] += 1;

    // -- Language Stats (Array Management)
    const langIndex = stats.languages.findIndex(
      (l: { name: string; questionSolved: number }) => l.name === language
    );
    if (langIndex > -1) {
      stats.languages[langIndex].questionSolved += 1;
    } else {
      stats.languages.push({ name: language, questionSolved: 1 });
    }

    // -- Skills/topics Stats (Array Management)
    // Assuming problem.topics is array of strings e.g. ["Array", "DP"]
    if (problem.topics && Array.isArray(problem.topics)) {
      problem.topics.forEach((topic: string) => {
        const skillIndex = stats.skills.findIndex(
          (s: { name: string; questionSolved: number }) => s.name === topic
        );
        if (skillIndex > -1) {
          stats.skills[skillIndex].questionSolved += 1;
        } else {
          stats.skills.push({ name: topic, questionSolved: 1 });
        }
      });
    }
  }

  // 6. Save (Atomic save of the document)
  await stats.save();

  return stats;
}
