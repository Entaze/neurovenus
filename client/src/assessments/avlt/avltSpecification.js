export const avltSpecification = {
  id: "avlt",
  name: "Auditory Verbal Learning Test",
  shortName: "AVLT",
  category: "Memory",
  type: "verbal_learning",

  description:
    "Assesses verbal learning and memory through repeated recall of a 15-word list across multiple learning trials, an interference list, and delayed recall phases.",

  estimatedDurationMinutes: 12,

  instructions:
    "You will be presented with a list of words several times. After each presentation, recall as many words as possible in any order.",

  defaultConfig: {
    wordCount: 15,
    learningTrials: 5,
    includeInterferenceList: true,
    includeImmediateRecall: true,
    includeDelayedRecall: true,
    includeRecognition: true,
  },

  responseOptions: {
    mode: "typed_recall",
  },

  trialSchema: [
    "trialNumber",
    "trialPhase",
    "trialLabel",
    "presentedWords",
    "actualResponse",
    "correctWords",
    "intrusions",
    "perseverations",
    "startedAt",
    "answeredAt",
  ],

  summaryMetrics: [
    "A1",
    "A2",
    "A3",
    "A4",
    "A5",
    "B",
    "A6ImmediateRecall",
    "DelayedRecall",
    "RecognitionHits",
    "RecognitionFalsePositives",
    "TotalLearning",
    "LearningSlope",
    "ForgettingRate",
  ],

  scoringNotes: {
    TotalLearning:
      "Sum of correctly recalled words across trials A1 through A5.",

    LearningSlope:
      "Improvement in recall performance across repeated learning trials.",

    ForgettingRate:
      "Difference between final learning trial recall and delayed recall.",

    RecognitionHits:
      "Number of target words correctly identified during recognition.",

    RecognitionFalsePositives:
      "Number of distractor words incorrectly endorsed.",
  },

  references: [
    {
      authors: "Rey A",
      year: 1964,
      title: "L'examen clinique en psychologie",
      publisher: "Presses Universitaires de France",
    },
    {
      authors: "Schmidt M",
      year: 1996,
      title: "Rey Auditory Verbal Learning Test: A Handbook",
      publisher: "Western Psychological Services",
    },
  ],
};