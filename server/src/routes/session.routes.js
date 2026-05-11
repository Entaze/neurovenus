const express = require("express");

const {
  startSession,
  getCurrentTask,
} = require("../controllers/session.controller");

const router = express.Router();

router.post("/:sessionRunId/start", startSession);
router.get("/:sessionRunId/current-task", getCurrentTask);

module.exports = router;