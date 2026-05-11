/// <reference types="vite/client" />

/**
 * Shared timing configuration for all cognitive tasks.
 *
 * Development (`npm run dev`)
 * - Uses shortened timings so tasks complete quickly.
 *
 * Production (`npm run build`)
 * - Uses the full research protocol timings.
 */

// export const DEV_MODE = import.meta.env.DEV;
export const DEV_MODE = false;

export const TASK_TIMING = {
  // Study/session timing
  study: {
    session2UnlockAfterHours: DEV_MODE ? 0 : 10,
    sessionExpirationHours: DEV_MODE ? 24 : 24,
  },

  // ---------------------------------------------------------------------------
  // Auditory-Verbal Learning Test (AVLT)
  // ---------------------------------------------------------------------------
  avlt: {
    // Time each word is shown on screen.
    // Protocol uses ~1.5 seconds per word.
    wordDisplayMs: DEV_MODE ? 800 : 1500,

    // Delay after "Get Ready" fixation before the first word appears.
    // Your AVLTTask previously used 3200 ms.
    readyDelayMs: DEV_MODE ? 700 : 3200,

    // Duration allowed for free recall.
    recallDurationSeconds: DEV_MODE ? 10 : 60,

    // Number of words shown.
    maxWords: DEV_MODE ? 5 : 15,
  },

  // ---------------------------------------------------------------------------
  // Finger Tapping Task
  // ---------------------------------------------------------------------------
  fingerTapping: {
    // Active tapping period.
    activeDurationSeconds: DEV_MODE ? 3 : 30,

    // Rest period between rounds.
    restDurationSeconds: DEV_MODE ? 2 : 30,

    // Total number of rounds.
    totalRounds: DEV_MODE ? 2 : 12,
  },

  // ---------------------------------------------------------------------------
  // N-Back Task
  // ---------------------------------------------------------------------------
  nBack: {
    // Fixation cross duration.
    fixationMs: DEV_MODE ? 1500 : 3500,

    // Letter stimulus duration.
    letterMs: DEV_MODE ? 700 : 500,

    // Number of trials per condition.
    // null means use the full sequence.
    maxTrialsPerCondition: DEV_MODE ? 8 : null,
  },
};