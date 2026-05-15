// client/src/assessments/psqi/psqiItems.js

// IMPORTANT:
// This file defines a structured representation of the PSQI.
// Do not include copyrighted questionnaire wording unless you have obtained
// the appropriate license from the copyright holder.
// The labels below are intentionally paraphrased placeholders that capture
// the meaning of each item without reproducing the official wording verbatim.

export const FREQUENCY_OPTIONS = [
  { value: 0, label: "Not during the past month" },
  { value: 1, label: "Less than once a week" },
  { value: 2, label: "Once or twice a week" },
  { value: 3, label: "Three or more times a week" },
];

export const QUALITY_OPTIONS = [
  { value: 0, label: "Very good" },
  { value: 1, label: "Fairly good" },
  { value: 2, label: "Fairly bad" },
  { value: 3, label: "Very bad" },
];

export const DIFFICULTY_OPTIONS = [
  { value: 0, label: "No difficulty" },
  { value: 1, label: "Slight difficulty" },
  { value: 2, label: "Moderate difficulty" },
  { value: 3, label: "Severe difficulty" },
];

export const psqiItems = [
  {
    id: "usualBedtime",
    section: "Sleep Schedule",
    label: "What time do you usually go to bed?",
    type: "time",
    required: true,
  },

  {
    id: "sleepLatencyMinutes",
    section: "Sleep Schedule",
    label: "How many minutes does it usually take you to fall asleep?",
    type: "number",
    required: true,
    min: 0,
    max: 600,
    suffix: "minutes",
  },

  {
    id: "usualWakeTime",
    section: "Sleep Schedule",
    label: "What time do you usually wake up?",
    type: "time",
    required: true,
  },

  {
    id: "hoursSlept",
    section: "Sleep Schedule",
    label: "How many hours of actual sleep do you get per night?",
    type: "number",
    required: true,
    min: 0,
    max: 24,
    step: 0.5,
    suffix: "hours",
  },

  {
    id: "subjectiveSleepQuality",
    section: "Sleep Quality",
    label: "How would you rate your overall sleep quality?",
    type: "radio",
    required: true,
    options: QUALITY_OPTIONS,
  },

  {
    id: "sleepLatencyFrequency",
    section: "Sleep Difficulties",
    label: "How often do you have trouble falling asleep within 30 minutes?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "wakeDuringNight",
    section: "Sleep Difficulties",
    label: "How often do you wake up during the night or too early?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "bathroomUse",
    section: "Sleep Difficulties",
    label: "How often do you need to get up to use the bathroom?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "breathingDiscomfort",
    section: "Sleep Difficulties",
    label: "How often do you have difficulty breathing comfortably?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "coughOrSnore",
    section: "Sleep Difficulties",
    label: "How often do you cough loudly or snore?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "tooCold",
    section: "Sleep Difficulties",
    label: "How often do you feel too cold while sleeping?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "tooHot",
    section: "Sleep Difficulties",
    label: "How often do you feel too hot while sleeping?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "badDreams",
    section: "Sleep Difficulties",
    label: "How often do you have disturbing dreams?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "pain",
    section: "Sleep Difficulties",
    label: "How often do you experience pain that disrupts sleep?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "otherSleepProblem",
    section: "Sleep Difficulties",
    label: "How often do other sleep-related problems disturb your sleep?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "sleepMedicationUse",
    section: "Sleep Medication",
    label: "How often do you use medication to help you sleep?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "troubleStayingAwake",
    section: "Daytime Functioning",
    label: "How often do you struggle to stay awake during daily activities?",
    type: "radio",
    required: true,
    options: FREQUENCY_OPTIONS,
  },

  {
    id: "enthusiasmDifficulty",
    section: "Daytime Functioning",
    label: "How much difficulty do you have maintaining enthusiasm?",
    type: "radio",
    required: true,
    options: DIFFICULTY_OPTIONS,
  },
];