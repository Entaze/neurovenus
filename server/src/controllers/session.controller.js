const SessionRun = require("../models/SessionRun");
const Study = require("../models/Study");

const getStudySessions = (study) =>
  study?.protocol?.sessions?.length ? study.protocol.sessions : study.sessions || [];

const getSessionAssessments = (sessionDefinition) =>
  sessionDefinition?.assessments?.length
    ? sessionDefinition.assessments
    : sessionDefinition?.tasks || [];

const normalizeAssessmentForClient = (assessment) => ({
  ...assessment,
  type: assessment.type || assessment.assessmentId,
});

const startSession = async (req, res) => {
  try {
    const { sessionRunId } = req.params;

    const sessionRun = await SessionRun.findById(sessionRunId);

    if (!sessionRun) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (!["available", "in_progress"].includes(sessionRun.status)) {
      return res.status(400).json({
        success: false,
        message: `Session cannot be started. Current status: ${sessionRun.status}`,
      });
    }

    if (sessionRun.status === "available") {
      sessionRun.status = "in_progress";
      sessionRun.startedAt = new Date();
      await sessionRun.save();
    }

    res.json({
      success: true,
      sessionRun,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to start session",
    });
  }
};

const getCurrentTask = async (req, res) => {
  try {
    const { sessionRunId } = req.params;

    const sessionRun = await SessionRun.findById(sessionRunId);

    if (!sessionRun) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const study = await Study.findOne({
      _id: sessionRun.studyId,
      organizationId: sessionRun.organizationId,
      createdBy: sessionRun.createdBy,
    });

    if (!study) {
      return res.status(404).json({
        success: false,
        message: "Study not found",
      });
    }

    const studySessions = getStudySessions(study);

    const sessionDefinition = studySessions.find(
      (session) => session.order === sessionRun.sessionOrder
    );

    if (!sessionDefinition) {
      return res.status(404).json({
        success: false,
        message: "Session definition not found",
      });
    }

    const assessments = getSessionAssessments(sessionDefinition);
    const currentAssessment = assessments[sessionRun.currentTaskIndex];

    if (!currentAssessment) {
      return res.json({
        success: true,
        completed: true,
        message: "All assessments completed for this session.",
      });
    }

    const task = normalizeAssessmentForClient(currentAssessment);

    res.json({
      success: true,
      completed: false,

      // Temporary legacy key used by current frontend.
      task,

      // New preferred key for Neurovenus.
      assessment: task,

      taskIndex: sessionRun.currentTaskIndex,
      assessmentIndex: sessionRun.currentTaskIndex,

      totalTasks: assessments.length,
      totalAssessments: assessments.length,

      sessionRun,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch current assessment",
    });
  }
};

module.exports = {
  startSession,
  getCurrentTask,
};