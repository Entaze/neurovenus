import AVLTTask from "./AVLTTask";
import AVLTDelayedRecallTask from "./AVLTDelayedRecallTask";
import AVLTRecognitionTask from "./AVLTRecognitionTask";
import NBackTask from "./NBackTask";
import FingerTapTask from "./FingerTapTask";

export const assessmentRegistry = {
  avlt: {
    id: "avlt",
    name: "Auditory Verbal Learning Test",
    component: AVLTTask,
  },

  avltDelayedRecall: {
    id: "avltDelayedRecall",
    name: "AVLT Delayed Recall",
    component: AVLTDelayedRecallTask,
  },

  avltRecognition: {
    id: "avltRecognition",
    name: "AVLT Recognition",
    component: AVLTRecognitionTask,
  },

  nback: {
    id: "nback",
    name: "N-Back",
    component: NBackTask,
  },

  fingerTap: {
    id: "fingerTap",
    name: "Finger Tapping",
    component: FingerTapTask,
  },
};

export function getAssessmentDefinition(type) {
  return assessmentRegistry[type];
}