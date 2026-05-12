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
    public: true,
  },

  avltDelayedRecall: {
    id: "avltDelayedRecall",
    name: "AVLT Delayed Recall",
    component: AVLTDelayedRecallTask,
    public: false,
  },

  avltRecognition: {
    id: "avltRecognition",
    name: "AVLT Recognition",
    component: AVLTRecognitionTask,
    public: false,
  },

  nback: {
    id: "nback",
    name: "N-Back",
    component: NBackTask,
    public: true,
  },

  fingerTap: {
    id: "fingerTap",
    name: "Finger Tapping",
    component: FingerTapTask,
    public: true,
  },
};

export const publicAssessmentOptions = Object.values(assessmentRegistry)
  .filter((assessment) => assessment.public)
  .map((assessment) => ({
    id: assessment.id,
    name: assessment.name,
    category:
      assessment.id === "avlt"
        ? "Memory"
        : assessment.id === "nback"
          ? "Working Memory"
          : "Motor",
  }));

export function getAssessmentDefinition(type) {
  return assessmentRegistry[type];
}