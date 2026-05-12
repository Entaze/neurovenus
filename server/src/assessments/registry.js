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
};

function getAssessmentDefinition(type) {
  return assessmentRegistry[type];
}

function getAllAssessments() {
  return Object.values(assessmentRegistry);
}

module.exports = {
  assessmentRegistry,
  getAssessmentDefinition,
  getAllAssessments,
};