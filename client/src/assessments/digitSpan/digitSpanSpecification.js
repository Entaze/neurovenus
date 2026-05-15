export const digitSpanSpecification = {
  id: "digitSpan",
  name: "Digit Span",
  shortName: "Digit Span",
  category: "Working Memory",
  type: "sequence_recall",

  description:
    "A test of attention and working memory in which participants recall sequences of digits in either the same order (forward) or reverse order (backward).",

  estimatedDurationMinutes: 8,

  instructions:
    "You will see a sequence of digits presented one at a time. After the sequence ends, type the digits in the requested order.",

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

  responseOptions: {
    mode: "typed_input",
  },

  trialSchema: [
    "trialNumber",
    "trialPhase",
    "mode",
    "spanLength",
    "sequence",
    "expectedResponse",
    "actualResponse",
    "correct",
    "startedAt",
    "answeredAt",
  ],

  summaryMetrics: [
    "forwardLongestSpan",
    "backwardLongestSpan",
    "forwardCorrectTrials",
    "backwardCorrectTrials",
    "totalCorrectTrials",
    "totalTrials",
    "overallAccuracy",
  ],

  references: [
    {
      authors: "Wechsler D",
      year: 2008,
      title: "Wechsler Adult Intelligence Scale – Fourth Edition",
      publisher: "Pearson",
    },
  ],
};