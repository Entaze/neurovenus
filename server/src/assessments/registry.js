const assessmentRegistry = {
  avlt: {
    id: "avlt",
    name: "Auditory Verbal Learning Test",
    category: "memory",
    supportsScoring: true,
    supportsExport: true,
    versions: ["standard"],
    defaultConfig: {},
  },

  avltDelayedRecall: {
    id: "avltDelayedRecall",
    name: "AVLT Delayed Recall",
    category: "memory",
    supportsScoring: true,
    supportsExport: true,
    versions: ["standard"],
    defaultConfig: {},
  },

  avltRecognition: {
    id: "avltRecognition",
    name: "AVLT Recognition",
    category: "memory",
    supportsScoring: true,
    supportsExport: true,
    versions: ["standard"],
    defaultConfig: {},
  },

  nback: {
    id: "nback",
    name: "N-Back",
    category: "working-memory",
    supportsScoring: true,
    supportsExport: true,
    versions: ["1-back", "2-back"],
    defaultConfig: {
      n: 2,
    },
  },

  fingerTap: {
    id: "fingerTap",
    name: "Finger Tapping",
    category: "motor",
    supportsScoring: true,
    supportsExport: true,
    versions: ["custom"],
    defaultConfig: {},
  },

  psqi: {
    id: "psqi",
    name: "Pittsburgh Sleep Quality Index (PSQI)",
    category: "sleep",
    supportsScoring: true,
    supportsExport: true,
    versions: ["standard"],
    defaultConfig: {
      poorSleepThreshold: 5,
    },
  },

  stroop: {
    id: "stroop",
    name: "Stroop Test",
    category: "executive-function",
    supportsScoring: true,
    supportsExport: true,
    versions: ["standard"],
    defaultConfig: {
      includePractice: true,
      practiceTrials: 6,
      testTrials: 48,
      stimulusDurationMs: 3000,
      interTrialIntervalMs: 700,
      colors: ["red", "blue", "green", "yellow"],
      conditions: ["congruent", "incongruent", "neutral"],
    },
  },

  digitSpan: {
    id: "digitSpan",
    name: "Digit Span",
    category: "working-memory",
    supportsScoring: true,
    supportsExport: true,
    versions: ["standard"],
    defaultConfig: {
      includePractice: true,
      practiceTrialsPerMode: 2,
      digitDisplayMs: 1000,
      interDigitIntervalMs: 500,
      interTrialIntervalMs: 1000,
      forwardSpanLengths: [3, 4, 5, 6, 7, 8],
      backwardSpanLengths: [2, 3, 4, 5, 6, 7],
      trialsPerSpan: 2,
      includeForward: true,
      includeBackward: true,
    },
  },
};

function getAssessmentDefinition(type) {
  return assessmentRegistry[type];
}

function getAllAssessments() {
  return Object.values(assessmentRegistry);
}

function isRegisteredAssessment(type) {
  return Boolean(assessmentRegistry[type]);
}

module.exports = {
  assessmentRegistry,
  getAssessmentDefinition,
  getAllAssessments,
  isRegisteredAssessment,
};