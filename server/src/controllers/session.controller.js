const SessionRun = require("../models/SessionRun");
const Study = require("../models/Study");

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

    const study = await Study.findById(sessionRun.studyId);

    if (!study) {
      return res.status(404).json({
        success: false,
        message: "Study not found",
      });
    }

    const sessionDefinition = study.sessions.find(
      (session) => session.order === sessionRun.sessionOrder
    );

    if (!sessionDefinition) {
      return res.status(404).json({
        success: false,
        message: "Session definition not found",
      });
    }

    const task = sessionDefinition.tasks[sessionRun.currentTaskIndex];

    if (!task) {
      return res.json({
        success: true,
        completed: true,
        message: "All tasks completed for this session.",
      });
    }

    res.json({
      success: true,
      completed: false,
      task,
      taskIndex: sessionRun.currentTaskIndex,
      totalTasks: sessionDefinition.tasks.length,
      sessionRun,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch current task",
    });
  }
};

module.exports = {
  startSession,
  getCurrentTask,
};