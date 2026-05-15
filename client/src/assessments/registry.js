// client/src/assessments/registry.js

import {
  AVLTTask,
  AVLTDelayedRecallTask,
  AVLTRecognitionTask,
} from "./avlt";

import { NBackTask } from "./nback";
import { FingerTapTask } from "./fingerTap";
import { PSQITask } from "./psqi";
import { StroopTask } from "./stroop";
import { DigitSpanTask } from "./digitSpan";

import { nBackSpecification } from "./nback/nbackSpecification";
import { fingerTapSpecification } from "./fingerTap/fingerTapSpecification";
import { psqiSpecification } from "./psqi/psqiSpecification";
import { digitSpanSpecification } from "./digitSpan/digitSpanSpecification";
import { stroopSpecification } from "./stroop/stroopSpecification";
import { avltSpecification } from "./avlt/avltSpecification";

export const assessmentRegistry = {
  avltDelayedRecall: {
    id: "avltDelayedRecall",
    name: "AVLT Delayed Recall",
    shortName: "Delayed Recall",
    category: "Memory",
    description:
      "Assesses delayed verbal memory by asking participants to recall the original AVLT word list after a delay period.",
    estimatedDurationMinutes: 3,
    component: AVLTDelayedRecallTask,
    public: false,
  },

  avltRecognition: {
    id: "avltRecognition",
    name: "AVLT Recognition",
    shortName: "Recognition",
    category: "Memory",
    description:
      "Assesses recognition memory by asking participants to identify previously presented AVLT words among distractor items.",
    estimatedDurationMinutes: 4,
    component: AVLTRecognitionTask,
    public: false,
  },

  avlt: {
    ...avltSpecification,
    component: AVLTTask,
    public: true,
  },

  nback: {
    ...nBackSpecification,
    component: NBackTask,
    public: true,
  },

  fingerTap: {
    ...fingerTapSpecification,
    component: FingerTapTask,
    public: true,
  },

  psqi: {
    ...psqiSpecification,
    component: PSQITask,
    public: true,
  },

  stroop: {
    ...stroopSpecification,
    component: StroopTask,
    public: true,
  },

  digitSpan: {
    ...digitSpanSpecification,
    component: DigitSpanTask,
    public: true,
  },
};

export const publicAssessmentOptions = Object.values(assessmentRegistry)
  .filter((assessment) => assessment.public)
  .map((assessment) => ({
    id: assessment.id,
    name: assessment.name,
    shortName: assessment.shortName,
    category: assessment.category || "General",
    type: assessment.type,
    description: assessment.description || "",
    estimatedDurationMinutes: assessment.estimatedDurationMinutes || null,

    instructions: assessment.instructions,
    responseOptions: assessment.responseOptions,
    trialSchema: assessment.trialSchema,
    summaryMetrics: assessment.summaryMetrics,
    scoringNotes: assessment.scoringNotes,
    references: assessment.references,
  }));

export function getAssessmentDefinition(type) {
  return assessmentRegistry[type];
}