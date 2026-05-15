// server/controllers/feedback.controller.js

const Feedback = require("../models/Feedback");

const createFeedback = async (req, res) => {
  try {
    const body = req.body || {};

    const {
      type,
      title,
      description,
      category,
      priority,
    } = body;

    if (!type || !title || !description || !category || !priority) {
      return res.status(400).json({
        success: false,
        message:
          "type, title, description, category, and priority are required",
      });
    }

    const attachment = req.file
      ? {
          filename: req.file.originalname,
          url: `/uploads/feedback/${req.file.filename}`,
          mimeType: req.file.mimetype,
          size: req.file.size,
        }
      : null;

    const feedback = await Feedback.create({
      userId: req.user?._id,
      userName: req.user?.name,
      userEmail: req.user?.email,
      organizationName: req.user?.institution || "Pilot Workspace Org",
      organizationPlan: req.user?.plan || "pilot",

      type,
      title: title.trim(),
      description: description.trim(),
      category,
      priority,

      status: "submitted",
      attachments: attachment ? [attachment] : [],
    });

    return res.status(201).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Failed to submit feedback:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};

const getMyFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Failed to fetch feedback:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Failed to fetch all feedback:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};

const updateFeedbackStatus = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "submitted",
      "under_review",
      "planned",
      "in_progress",
      "released",
      "closed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid feedback status",
      });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      });
    }

    return res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Failed to update feedback status:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update feedback status",
    });
  }
};

const updateFeedbackNotes = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { internalNotes } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { internalNotes: internalNotes || "" },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    return res.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Failed to update feedback notes:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update feedback notes.",
    });
  }
};

module.exports = {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  updateFeedbackStatus,
  updateFeedbackNotes,
};