const express = require("express");
const requireAuth = require("../middleware/auth");
const requireAdmin = require("../middleware/requireAdmin");
const upload = require("../middleware/upload");

const {
  createFeedback,
  getMyFeedback,
  getAllFeedback,
  updateFeedbackStatus,
  updateFeedbackNotes,
} = require("../controllers/feedback.controller");

const router = express.Router();

// Researcher/customer-facing
router.post("/", requireAuth, upload.single("attachment"), createFeedback);
router.get("/my", requireAuth, getMyFeedback);

// Neurovenus admin-only
router.get("/", requireAuth, requireAdmin, getAllFeedback);
router.patch("/:feedbackId/status", requireAuth, requireAdmin, updateFeedbackStatus);
router.patch("/:feedbackId/notes", requireAuth, requireAdmin, updateFeedbackNotes);

module.exports = router;