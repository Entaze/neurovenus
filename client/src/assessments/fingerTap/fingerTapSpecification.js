export const fingerTapSpecification = {
  id: "fingerTap",
  name: "Finger Tapping",
  shortName: "Finger Tapping",
  category: "Motor",
  type: "motor_speed",

  description:
    "Measures motor speed and fine motor control by recording the number of taps completed within a fixed time period.",

  estimatedDurationMinutes: 3,

  instructions:
    "Tap the response key as quickly as possible until the trial ends.",

  defaultConfig: {
    includePractice: true,
    practiceDurationSeconds: 5,
    trialDurationSeconds: 10,
    trialsPerHand: 5,
    hands: ["dominant", "nonDominant"],
    interTrialIntervalMs: 2000,
  },

  responseOptions: {
    mode: "keyboard",
    keyboardMap: {
      space: "tap",
    },
  },

  trialSchema: [
    "trialNumber",
    "hand",
    "tapCount",
    "trialDurationMs",
    "startedAt",
    "endedAt",
  ],

  summaryMetrics: [
    "dominantMeanTaps",
    "nonDominantMeanTaps",
    "dominantBestTrial",
    "nonDominantBestTrial",
    "lateralityDifference",
  ],

  references: [
    {
      authors: "Reitan RM, Wolfson D",
      year: 1993,
      title: "The Halstead-Reitan Neuropsychological Test Battery",
      publisher: "Neuropsychology Press",
    },
  ],
};