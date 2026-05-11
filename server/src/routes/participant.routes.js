const express = require("express");

const {
  inviteParticipant,
  validateParticipantAccess,
  getParticipantsByStudy,
} = require("../controllers/participant.controller");

const router = express.Router();

router.get("/", getParticipantsByStudy);
router.post("/invite", inviteParticipant);
router.get("/access", validateParticipantAccess);

module.exports = router;