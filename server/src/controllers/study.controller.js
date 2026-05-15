const Study = require("../models/Study");

const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.user?.sub;
};

const createStudy = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const incomingProtocolSessions = req.body?.protocol?.sessions || [];
    const incomingLegacySessions = req.body.sessions || [];

    const sourceSessions = incomingProtocolSessions.length
      ? incomingProtocolSessions
      : incomingLegacySessions;

    const normalizedSessions = sourceSessions.map((session, sessionIndex) => {
      const sourceAssessments = session.assessments?.length
        ? session.assessments
        : session.tasks || [];

      const normalizedAssessments = sourceAssessments.map(
        (assessment, assessmentIndex) => ({
          assessmentId: assessment.assessmentId || assessment.type,
          type: assessment.type || assessment.assessmentId,
          version: assessment.version || "v1",
          order: assessment.order || assessmentIndex + 1,
          config: assessment.config || {},
        })
      );

      return {
        ...session,
        name: session.name || session.label || `Session ${sessionIndex + 1}`,
        label: session.label || session.name || `Session ${sessionIndex + 1}`,
        order: session.order || sessionIndex + 1,
        protocolVersion: session.protocolVersion || "custom",
        offsetDays: session.offsetDays || 0,
        unlockAfterHours: session.unlockAfterHours || 0,
        expiresAfterHours: session.expiresAfterHours || 24,
        assessments: normalizedAssessments,
        tasks: normalizedAssessments,
      };
    });

    const payload = {
      ...req.body,
      createdBy: userId,
      protocolVersion: req.body.protocolVersion || "custom",
      protocol: {
        type: req.body?.protocol?.type || "custom",
        version: req.body?.protocol?.version || "v1",
        sessions: normalizedSessions,
      },
      sessions: normalizedSessions,
    };

    const study = await Study.create(payload);

    res.status(201).json({
      success: true,
      study,
    });
  } catch (error) {
    console.error("Failed to create study:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create study",
      error: error.message,
    });
  }
};

const getStudies = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const studies = await Study.find({ createdBy: userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      studies,
    });
  } catch (error) {
    console.error("Failed to fetch studies:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch studies",
      error: error.message,
    });
  }
};

const getStudyById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { studyId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const study = await Study.findOne({
      _id: studyId,
      createdBy: userId,
    });

    if (!study) {
      return res.status(404).json({
        success: false,
        message: "Study not found",
      });
    }

    res.json({
      success: true,
      study,
    });
  } catch (error) {
    console.error("Failed to fetch study:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch study",
      error: error.message,
    });
  }
};

const updateStudy = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { studyId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const study = await Study.findOneAndUpdate(
      {
        _id: studyId,
        createdBy: userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!study) {
      return res.status(404).json({
        success: false,
        message: "Study not found",
      });
    }

    res.json({
      success: true,
      study,
    });
  } catch (error) {
    console.error("Failed to update study:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update study",
      error: error.message,
    });
  }
};

module.exports = {
  createStudy,
  getStudies,
  getStudyById,
  updateStudy,
};