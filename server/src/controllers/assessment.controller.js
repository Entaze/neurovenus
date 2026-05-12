const SessionRun = require("../models/SessionRun");
const Study = require("../models/Study");
const AssessmentRun = require("../models/AssessmentRun");
const Participant = require("../models/Participant");
const { isRegisteredAssessment } = require("../assessments/registry");

const getStudySessions = (study) =>
  study?.protocol?.sessions?.length ? study.protocol.sessions : study.sessions || [];

const getSessionAssessments = (sessionDefinition) =>
  sessionDefinition?.assessments?.length
    ? sessionDefinition.assessments
    : sessionDefinition?.tasks || [];

const completeTask = async (req, res) => {
  try {
    const {
      sessionRunId,
      taskType,
      taskVersion = "v1",
      summary = {},
      trials = [],
    } = req.body;

    if (!sessionRunId || !taskType) {
      return res.status(400).json({
        success: false,
        message: "sessionRunId and taskType are required",
      });
    }

    if (!isRegisteredAssessment(taskType)) {
      return res.status(400).json({
        success: false,
        message: `Unknown assessment type: ${taskType}`,
      });
    }

    const sessionRun = await SessionRun.findById(sessionRunId);

    if (!sessionRun) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const study = await Study.findById(sessionRun.studyId);

    if (!study) {
      return res.status(404).json({
        success: false,
        message: "Study not found",
      });
    }

    await Participant.findByIdAndUpdate(sessionRun.participantId, {
      status: "active",
    });

    const assessmentRun = await AssessmentRun.create({
      participantId: sessionRun.participantId,
      sessionRunId: sessionRun._id,
      studyId: sessionRun.studyId,
      taskType,
      taskVersion,
      startedAt: req.body.startedAt || null,
      completedAt: new Date(),
      summary,
      trials,
    });

    sessionRun.completedTaskTypes.push(taskType);
    sessionRun.currentTaskIndex += 1;

    const studySessions = getStudySessions(study);

    const sessionDefinition = studySessions.find(
      (session) => session.order === sessionRun.sessionOrder
    );

    const sessionAssessments = getSessionAssessments(sessionDefinition);

    if (
      sessionDefinition &&
      sessionRun.currentTaskIndex >= sessionAssessments.length
    ) {
      sessionRun.status = "completed";
      sessionRun.completedAt = new Date();

      const nextSessionDefinition = studySessions.find(
        (session) => session.order === sessionRun.sessionOrder + 1
      );

      if (nextSessionDefinition) {
        const nextSessionRun = await SessionRun.findOne({
          participantId: sessionRun.participantId,
          sessionOrder: nextSessionDefinition.order,
        });

        if (nextSessionRun) {
          const unlockDelayMs =
            (nextSessionDefinition.unlockAfterHours || 0) * 60 * 60 * 1000;

          const expiryDelayMs =
            (nextSessionDefinition.expiresAfterHours || 24) * 60 * 60 * 1000;

          const opensAt = new Date(
            sessionRun.completedAt.getTime() + unlockDelayMs
          );

          const expiresAt = new Date(opensAt.getTime() + expiryDelayMs);

          const now = new Date();

          nextSessionRun.opensAt = opensAt;
          nextSessionRun.expiresAt = expiresAt;
          nextSessionRun.status = opensAt <= now ? "available" : "locked";
          nextSessionRun.reminderSentAt = null;

          await nextSessionRun.save();
        }
      } else {
        await Participant.findByIdAndUpdate(sessionRun.participantId, {
          status: "completed",
          completedAt: new Date(),
        });
      }
    }

    await sessionRun.save();

    return res.status(201).json({
      success: true,
      assessmentRun,
      sessionRun,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete assessment",
    });
  }
};

module.exports = {
  completeTask,
};