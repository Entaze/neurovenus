const express = require("express");

const {
  createStudy,
  getStudies,
  getStudyById,
  updateStudy,
} = require("../controllers/study.controller");

const router = express.Router();

router.post("/", createStudy);
router.get("/", getStudies);
router.get("/:studyId", getStudyById);
router.patch("/:studyId", updateStudy);

module.exports = router;