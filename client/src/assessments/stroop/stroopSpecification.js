// client/src/assessments/stroop/stroopSpecification.js

export const stroopSpecification = {
  id: "stroop",
  name: "Stroop Test",
  shortName: "Stroop",
  category: "Executive Function",
  type: "reaction_time",

  description:
    "Measures selective attention, processing speed, and inhibitory control by requiring participants to identify the ink colour of a word while ignoring the word's semantic meaning.",

  estimatedDurationMinutes: 5,

  instructions:
    "Respond to the colour of the ink, not the word itself. Work as quickly and accurately as possible.",

  defaultConfig: {
    includePractice: true,
    practiceTrials: 6,
    testTrials: 48,

    stimulusDurationMs: 3000,
    interTrialIntervalMs: 700,

    colors: ["red", "blue", "green", "yellow"],
    conditions: ["congruent", "incongruent", "neutral"],

    showKeyboardHints: true,
  },

  responseOptions: {
    mode: "keyboard_and_mouse",
    keyboardMap: {
      r: "red",
      b: "blue",
      g: "green",
      y: "yellow",
    },
  },

  trialSchema: [
    "trialNumber",
    "trialIndex",
    "trialPhase",
    "condition",
    "stimulus",
    "word",
    "inkColor",
    "expectedResponse",
    "actualResponse",
    "correct",
    "reactionTimeMs",
    "isPractice",
    "startedAt",
    "answeredAt",
  ],

  summaryMetrics: [
    "totalTrials",
    "correctTrials",
    "incorrectTrials",
    "accuracy",
    "meanReactionTime",
    "congruentMeanRt",
    "incongruentMeanRt",
    "neutralMeanRt",
    "stroopInterferenceRt",
    "stroopInterferenceAccuracy",
  ],

  scoringNotes: {
    accuracy:
      "Proportion of non-practice trials answered correctly.",

    meanReactionTime:
      "Average reaction time across correct non-practice trials.",

    stroopInterferenceRt:
      "Difference between incongruent and congruent mean reaction times.",

    stroopInterferenceAccuracy:
      "Optional difference in accuracy between congruent and incongruent trials.",
  },

  references: [
    {
      authors: "Stroop JR",
      year: 1935,
      title:
        "Studies of Interference in Serial Verbal Reactions",
      journal: "Journal of Experimental Psychology",
      volume: "18",
      pages: "643-662",
    },
  ],
};