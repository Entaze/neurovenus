const express = require("express");
const {
  getResearchers,
  inviteResearcher,
  acceptInvite,
} = require("../controllers/researcher.controller");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/accept-invite", acceptInvite);

router.use(authMiddleware);

router.get("/", getResearchers);
router.post("/invite", inviteResearcher);

module.exports = router;