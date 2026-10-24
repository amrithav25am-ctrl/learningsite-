import { UserStats, SubjectId, TopicProgress } from '../types';

const STORAGE_KEY = 'visora_user_stats_v1';

const DEFAULT_STATS: UserStats = {
  xp: 140,
  streakDays: 3,
  completedTopicIds: ['c-pointers'],
  topicProgress: {
    'c-pointers': {
      topicId: 'c-pointers',
      subjectId: 'c',
      completed: true,
      quizScore: 100,
      attempts: 1,
      weak: false,
      lastPracticed: new Date(Date.now() - 86400000).toISOString(),
    },
    'c-malloc': {
      topicId: 'c-malloc',
      subjectId: 'c',
      completed: false,
      quizScore: 50,
      attempts: 2,
      weak: true,
      lastPracticed: new Date().toISOString(),
    },
  },
  lastActiveTopicId: 'c-pointers',
};

export function loadUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...parsed };
  } catch (e) {
    console.error('Failed to load user stats from storage', e);
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
}

export function recordQuizCompletion(
  topicId: string,
  subjectId: SubjectId,
  scorePercentage: number
): UserStats {
  const stats = loadUserStats();
  const current = stats.topicProgress[topicId] || {
    topicId,
    subjectId,
    completed: false,
    attempts: 0,
    weak: false,
  };

  const isPassing = scorePercentage >= 70;
  const earnedXp = Math.round(scorePercentage * 1.5) + (isPassing ? 50 : 10);

  const updatedProgress: TopicProgress = {
    ...current,
    quizScore: scorePercentage,
    attempts: current.attempts + 1,
    completed: isPassing || current.completed,
    weak: !isPassing,
    lastPracticed: new Date().toISOString(),
  };

  const completedSet = new Set(stats.completedTopicIds);
  if (isPassing) {
    completedSet.add(topicId);
  }

  const newStats: UserStats = {
    ...stats,
    xp: stats.xp + earnedXp,
    completedTopicIds: Array.from(completedSet),
    topicProgress: {
      ...stats.topicProgress,
      [topicId]: updatedProgress,
    },
    lastActiveTopicId: topicId,
  };

  saveUserStats(newStats);
  return newStats;
}

export function markTopicCompleted(topicId: string, subjectId: SubjectId): UserStats {
  const stats = loadUserStats();
  const completedSet = new Set(stats.completedTopicIds);
  completedSet.add(topicId);

  const current = stats.topicProgress[topicId] || {
    topicId,
    subjectId,
    completed: true,
    attempts: 1,
    weak: false,
  };

  const newStats: UserStats = {
    ...stats,
    xp: stats.xp + 40,
    completedTopicIds: Array.from(completedSet),
    topicProgress: {
      ...stats.topicProgress,
      [topicId]: {
        ...current,
        completed: true,
        lastPracticed: new Date().toISOString(),
      },
    },
    lastActiveTopicId: topicId,
  };

  saveUserStats(newStats);
  return newStats;
}

export function resetProgress(): UserStats {
  saveUserStats(DEFAULT_STATS);
  return DEFAULT_STATS;
}
