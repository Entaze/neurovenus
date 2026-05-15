const express = require("express");
const requireAuth = require("../middleware/auth");

const {
  inviteParticipant,
  validateParticipantAccess,
  getParticipantsByStudy,
} = require("../controllers/participant.controller");

const router = express.Router();

router.get("/", requireAuth, getParticipantsByStudy);
router.post("/invite", requireAuth, inviteParticipant);

// Participant access must remain public because participants use token links.
router.get("/access", validateParticipantAccess);

module.exports = router;