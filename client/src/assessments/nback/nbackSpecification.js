export const nBackSpecification = {
  id: "nback",
  name: "N-Back",
  shortName: "N-Back",
  category: "Working Memory",
  type: "continuous_performance",

  description:
    "Measures working memory, sustained attention, and response inhibition by requiring participants to identify when the current stimulus matches one presented N trials earlier.",

  estimatedDurationMinutes: 8,

  instructions:
    "Respond whenever the current letter matches the one shown N positions back in the sequence.",

  defaultConfig: {
    includePractice: true,
    practiceTrials: 10,
    blocks: [
      { level: 0, trials: 20 },
      { level: 1, trials: 30 },
      { level: 2, trials: 30 },
    ],
    stimulusDurationMs: 500,
    interStimulusIntervalMs: 2500,
    targetProbability: 0.3,
    showKeyboardHints: true,
  },

  responseOptions: {
    mode: "keyboard_and_mouse",
    keyboardMap: {
      space: "match",
    },
  },

  trialSchema: [
    "trialNumber",
    "blockNumber",
    "nLevel",
    "stimulus",
    "isTarget",
    "actualResponse",
    "correct",
    "reactionTimeMs",
    "isPractice",
    "startedAt",
    "answeredAt",
  ],

  summaryMetrics: [
    "totalTrials",
    "correctResponses",
    "misses",
    "falseAlarms",
    "accuracy",
    "meanReactionTime",
    "dPrime",
  ],

  references: [
    {
      authors: "Kirchner WK",
      year: 1958,
      title: "Age Differences in Short-Term Retention of Rapidly Changing Information",
      journal: "Journal of Experimental Psychology",
      volume: "55",
      pages: "352-358",
    },
  ],
};