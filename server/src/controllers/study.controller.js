const Study = require("../models/Study");

const createStudy = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      protocolVersion: req.body.protocolVersion || "combined-v1-v2",
      sessions: (req.body.sessions || []).map((session) => ({
        ...session,
        protocolVersion:
          session.protocolVersion ||
          session.tasks?.[0]?.version ||
          req.body.protocolVersion ||
          "v2",
      })),
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
    const studies = await Study.find().sort({ createdAt: -1 });

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

const updateStudy = async (req, res) => {
  try {
    const { studyId } = req.params;

    const study = await Study.findByIdAndUpdate(
      studyId,
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
  updateStudy,
};
