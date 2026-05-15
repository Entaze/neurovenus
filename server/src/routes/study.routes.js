const express = require("express");
const requireAuth = require("../middleware/auth");

const {
  createStudy,
  getStudies,
  getStudyById,
  updateStudy,
} = require("../controllers/study.controller");

const router = express.Router();

router.post("/", requireAuth, createStudy);
router.get("/", requireAuth, getStudies);
router.get("/:studyId", requireAuth, getStudyById);
router.patch("/:studyId", requireAuth, updateStudy);

module.exports = router;