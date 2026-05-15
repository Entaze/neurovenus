export const psqiSpecification = {
  id: "psqi",
  name: "Pittsburgh Sleep Quality Index",
  shortName: "PSQI",
  category: "Sleep",
  type: "questionnaire",

  description:
    "Assesses subjective sleep quality over the past month across seven clinically validated components.",

  estimatedDurationMinutes: 5,

  instructions:
    "Answer each question based on your sleep habits during the past month.",

  defaultConfig: {
    referencePeriod: "past_month",
    includePartnerQuestions: false,
  },

  responseOptions: {
    mode: "form",
  },

  trialSchema: [
    "questionId",
    "response",
    "component",
    "componentScore",
  ],

  summaryMetrics: [
    "subjectiveSleepQuality",
    "sleepLatency",
    "sleepDuration",
    "habitualSleepEfficiency",
    "sleepDisturbances",
    "sleepMedicationUse",
    "daytimeDysfunction",
    "globalPSQIScore",
  ],

  scoringNotes: {
    globalPSQIScore:
      "Total score ranging from 0 to 21. Scores greater than 5 generally indicate poor sleep quality.",
  },

  references: [
    {
      authors: "Buysse DJ, Reynolds CF, Monk TH, Berman SR, Kupfer DJ",
      year: 1989,
      title:
        "The Pittsburgh Sleep Quality Index: A New Instrument for Psychiatric Practice and Research",
      journal: "Psychiatry Research",
      volume: "28",
      pages: "193-213",
    },
  ],
};